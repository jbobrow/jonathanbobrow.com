# Setting up the content editor (Sveltia CMS)

The site now has a browser-based editor at `/admin` for editing projects
without touching git or markdown directly. It's [Sveltia CMS](https://github.com/sveltia/sveltia-cms) — a
free, static admin UI that reads `public/admin/config.yml` and commits
changes straight to this repo. Every save is a git commit, which triggers
the same GitHub Actions build + deploy as pushing a commit by hand.

The editor itself needs zero setup — `public/admin/` is already part of the
site. The one thing that needs a one-time setup is **login**: a static site
can't safely hold a GitHub OAuth client secret, so a small proxy is required
to complete the login handshake. That's `cms-auth-worker/`, meant to be
deployed as a free Cloudflare Worker.

## 1. Create a GitHub OAuth App

1. Go to [github.com/settings/developers](https://github.com/settings/developers) → **OAuth Apps** → **New OAuth App**.
2. Fill in:
   - **Application name**: anything, e.g. `jonathanbobrow.com CMS`
   - **Homepage URL**: `https://jonathanbobrow.com`
   - **Authorization callback URL**: `https://<your-worker-subdomain>.workers.dev/callback`
     (you'll get the exact Worker URL in step 2 — come back and fill this in
     after deploying, or use `https://jonathanbobrow-cms-auth.<your-account>.workers.dev/callback`
     if you know your Cloudflare subdomain already)
3. Click **Register application**, then **Generate a new client secret**.
4. Save the **Client ID** and **Client secret** — you'll need both next.

## 2. Deploy the OAuth proxy (Cloudflare Worker)

Requires a free [Cloudflare account](https://dash.cloudflare.com/sign-up).

```bash
cd cms-auth-worker
npx wrangler login          # opens a browser to authenticate once
npx wrangler deploy
```

This prints the Worker's URL, e.g. `https://jonathanbobrow-cms-auth.<your-account>.workers.dev`.
If the OAuth App's callback URL from step 1 doesn't match exactly, go back
and update it now (Settings → Developer settings → OAuth Apps → your app).

Then set the two secrets the worker needs (it'll prompt you to paste each
value):

```bash
npx wrangler secret put GITHUB_CLIENT_ID
npx wrangler secret put GITHUB_CLIENT_SECRET
```

## 3. Point the CMS at the proxy

Edit `public/admin/config.yml` and replace the placeholder:

```yaml
backend:
  base_url: https://jonathanbobrow-cms-auth.<your-account>.workers.dev
```

with your actual Worker URL from step 2. Commit and push — once it deploys,
`/admin` is live.

## 4. Log in and edit

Visit `https://jonathanbobrow.com/admin`, click **Login with GitHub**, and
authorize the OAuth App. You'll need push access to `jbobrow/jonathanbobrow.com`
for the commit to succeed — anyone without repo access can log in with their
own GitHub account, but their commits will just fail, which is a reasonable
default for a single-author site.

From there:
- **Projects** — edit existing projects or add new ones. New projects are
  saved as `src/content/projects/<slug>.md`, and uploaded images go to
  `public/images/projects/<slug>/`.
- **Site Settings** — edit the name, tagline, contact email, and site URL
  in `src/data/site.json`.

A couple of things worth knowing:
- **Order** must stay unique across all projects — it's what controls
  display order on both the Featured and Archive pages. Check the Archive
  page if you're not sure what number to use for a new project.
- **Slug** becomes both the filename and the image folder name. Changing it
  on an existing project changes its URL (`/work/<slug>/`) — avoid renaming
  once a project is published unless you mean to.
- Saves commit directly to `main` (`publish_mode: simple` in config.yml). If
  you'd rather review changes as a pull request before they go live, change
  that to `editorial_workflow: true`.
