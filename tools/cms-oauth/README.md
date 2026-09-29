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

After the first deployment, either attach the custom domain `auth.bsd-lab.org` in Cloudflare or replace `backend.base_url` in `public/admin/config.yml` with the assigned `workers.dev` URL.

The GitHub OAuth App callback URL must be:

```text
https://auth.bsd-lab.org/callback
```

If a `workers.dev` URL is used instead, use its `/callback` URL exactly.
