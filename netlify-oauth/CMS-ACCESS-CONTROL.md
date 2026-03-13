# CMS Access Control

## Current Approach: Environment Variable Allowlist

The OAuth callback function checks the `ALLOWED_GITHUB_USERS` environment variable on Netlify to restrict which GitHub accounts can log in to the CMS.

### How it works

1. User authenticates with GitHub via OAuth
2. The callback function exchanges the code for a token
3. It calls GitHub's `/user` API to get the authenticated username
4. If `ALLOWED_GITHUB_USERS` is set, it checks the username against the comma-separated list
5. If the user is not in the list, they get an "access denied" error
6. If the env var is empty/unset, all GitHub users with repo write access can log in

### Setup

Set the environment variable in Netlify (Dashboard > Site settings > Environment variables):

```
ALLOWED_GITHUB_USERS=nanda-nainadurai,another-pta-admin
```

### Updating the list

1. Update the `ALLOWED_GITHUB_USERS` value in the Netlify dashboard (or via `netlify env:set`)
2. Trigger a redeploy from the Netlify dashboard (Deploys > Trigger deploy) or redeploy via CLI

A redeploy is required each time the allowlist changes because Netlify Functions read env vars at deploy time.

---

## Alternative Approach: JSON File in Repo (not implemented)

Instead of an env var, the allowlist could be stored as a JSON file in the GitHub repo (e.g. `src/content/allowed-users.json`). The callback function would fetch this file from GitHub at runtime using the raw content URL.

### How it would work

1. Create `src/content/allowed-users.json`:
   ```json
   { "users": ["nanda-nainadurai", "another-admin"] }
   ```
2. The callback function fetches this file from `https://raw.githubusercontent.com/nanda-nainadurai/aldryngton-pta-new/main/src/content/allowed-users.json` at runtime
3. No redeploy needed when updating the list — just edit the JSON file (even via the CMS itself)

### Trade-offs

| | Env Variable (current) | JSON File (alternative) |
|---|---|---|
| Redeploy needed on change | Yes | No |
| Editable via CMS | No | Yes |
| Extra network request | No | Yes (fetches file from GitHub on each login) |
| Security | Env var is private | JSON file is public if repo is public |
