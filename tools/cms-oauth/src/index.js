const GITHUB_AUTHORIZE_URL = "https://github.com/login/oauth/authorize";
const GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token";
const DEFAULT_CMS_ORIGIN = "https://bsd-lab.org";
const STATE_COOKIE = "bsd_cms_oauth_state";

function htmlHeaders() {
  return {
    "cache-control": "no-store",
    "content-security-policy":
      "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'",
    "content-type": "text/html; charset=utf-8",
    "referrer-policy": "no-referrer",
    "x-content-type-options": "nosniff",
  };
}

function randomState() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function parseCookies(header) {
  return Object.fromEntries(
    String(header || "")
      .split(";")
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => {
        const separator = item.indexOf("=");
        if (separator < 0) return [item, ""];
        return [item.slice(0, separator), decodeURIComponent(item.slice(separator + 1))];
      }),
  );
}

function stateCookie(value, requestUrl, maxAge) {
  const secure = requestUrl.protocol === "https:" ? "; Secure" : "";
  return `${STATE_COOKIE}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

function safeEqual(left, right) {
  if (!left || !right || left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

function renderResult(status, content, cmsOrigin) {
  const safeStatus = status === "success" ? "success" : "error";
  const safeContent = JSON.stringify(content).replace(/</g, "\\u003c");
  const targetOrigin = JSON.stringify(cmsOrigin);
  const message = JSON.stringify(
    `authorization:github:${safeStatus}:${safeContent}`,
  );

  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>BSD Lab 编辑后台登录</title>
    <style>
      body { display: grid; min-height: 100vh; margin: 0; place-items: center; background: #f4f6f2; color: #254438; font: 16px/1.6 system-ui, sans-serif; text-align: center; }
    </style>
  </head>
  <body>
    <p>${safeStatus === "success" ? "登录成功，正在返回编辑后台……" : "登录失败，请关闭窗口后重试。"}</p>
    <script>
      (() => {
        const targetOrigin = ${targetOrigin};
        const result = ${message};
        if (!window.opener) return;
        const receiveMessage = (event) => {
          if (event.origin !== targetOrigin) return;
          window.opener.postMessage(result, targetOrigin);
          window.removeEventListener("message", receiveMessage);
          window.setTimeout(() => window.close(), 250);
        };
        window.addEventListener("message", receiveMessage);
        window.opener.postMessage("authorizing:github", targetOrigin);
      })();
    </script>
  </body>
</html>`;
}

function missingConfiguration(env) {
  return !env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET;
}

export async function handleRequest(request, env, fetchImpl = fetch) {
  const url = new URL(request.url);
  const cmsOrigin = env.CMS_ORIGIN || DEFAULT_CMS_ORIGIN;

  if (url.pathname === "/") {
    return new Response("BSD Lab CMS OAuth service is running.", {
      status: 200,
      headers: { "cache-control": "no-store", "content-type": "text/plain; charset=utf-8" },
    });
  }

  if (missingConfiguration(env)) {
    return new Response("OAuth service is not configured.", {
      status: 503,
      headers: { "cache-control": "no-store", "content-type": "text/plain; charset=utf-8" },
    });
  }

  if (url.pathname === "/auth") {
    const state = randomState();
    const callbackUrl = new URL("/callback", url.origin).toString();
    const authorizeUrl = new URL(GITHUB_AUTHORIZE_URL);
    authorizeUrl.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
    authorizeUrl.searchParams.set("redirect_uri", callbackUrl);
    authorizeUrl.searchParams.set("scope", "public_repo");
    authorizeUrl.searchParams.set("state", state);

    return new Response(null, {
      status: 302,
      headers: {
        "cache-control": "no-store",
        location: authorizeUrl.toString(),
        "set-cookie": stateCookie(state, url, 600),
      },
    });
  }

  if (url.pathname === "/callback") {
    const code = url.searchParams.get("code") || "";
    const state = url.searchParams.get("state") || "";
    const cookieState = parseCookies(request.headers.get("cookie"))[STATE_COOKIE] || "";
    const clearCookie = stateCookie("", url, 0);

    if (!code || !safeEqual(state, cookieState)) {
      return new Response(
        renderResult("error", { message: "OAuth state validation failed." }, cmsOrigin),
        { status: 400, headers: { ...htmlHeaders(), "set-cookie": clearCookie } },
      );
    }

    const callbackUrl = new URL("/callback", url.origin).toString();
    const tokenResponse = await fetchImpl(GITHUB_TOKEN_URL, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "user-agent": "bsd-lab-cms-oauth",
      },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: callbackUrl,
      }),
    });
    const tokenResult = await tokenResponse.json();

    if (!tokenResponse.ok || tokenResult.error || !tokenResult.access_token) {
      return new Response(
        renderResult(
          "error",
          { message: tokenResult.error_description || "GitHub authentication failed." },
          cmsOrigin,
        ),
        { status: 401, headers: { ...htmlHeaders(), "set-cookie": clearCookie } },
      );
    }

    return new Response(
      renderResult(
        "success",
        { token: tokenResult.access_token, provider: "github" },
        cmsOrigin,
      ),
      { status: 200, headers: { ...htmlHeaders(), "set-cookie": clearCookie } },
    );
  }

  return new Response("Not found", {
    status: 404,
    headers: { "cache-control": "no-store", "content-type": "text/plain; charset=utf-8" },
  });
}

export default {
  fetch(request, env) {
    return handleRequest(request, env);
  },
};
