# BSD Lab CMS OAuth Worker

This Cloudflare Worker completes GitHub OAuth for the Decap CMS editor at `https://bsd-lab.org/admin/`.

The Worker requests only the `public_repo` scope needed for Open Authoring on the public website repository. It validates a short-lived OAuth state cookie, restricts the browser message target to `https://bsd-lab.org`, and does not store access tokens.

## Local setup

```bash
npm ci
cp .dev.vars.example .dev.vars
npm run dev
```

Put the GitHub OAuth App client ID and secret in `.dev.vars`. Never commit that file.

## Deploy

```bash
npx wrangler login
npx wrangler secret put GITHUB_CLIENT_ID
npx wrangler secret put GITHUB_CLIENT_SECRET
npm run deploy
```

The production editor currently uses this Worker URL:

```text
https://bsd-lab-cms-auth.393649680.workers.dev
```

Keep `backend.base_url` in `public/admin/config.yml` synchronized with the deployed Worker URL. A custom domain such as `auth.bsd-lab.org` can be attached later if the website DNS is moved to Cloudflare.

The GitHub OAuth App callback URL must be:

```text
https://bsd-lab-cms-auth.393649680.workers.dev/callback
```

If the Worker domain changes, update this callback URL in the GitHub OAuth App at the same time.
