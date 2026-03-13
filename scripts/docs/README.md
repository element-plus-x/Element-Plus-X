# Docs Deployment on Tencent Cloud (Lite Server)

## DNS Records

Create A records to your Tencent Cloud public IP:

1. `element-plus-x.com`
2. `v1.element-plus-x.com`
3. `v2.element-plus-x.com`

## Nginx Config

1. Copy `scripts/docs/nginx/element-plus-x.conf` to `/etc/nginx/conf.d/element-plus-x.conf`.
2. Create the redirect target file:

```bash
sudo mkdir -p /var/www/element-plus-x/root
echo 'set $root_target https://v1.element-plus-x.com;' | sudo tee /var/www/element-plus-x/root/redirect.conf
```

3. Create base directories:

```bash
sudo mkdir -p /var/www/element-plus-x/v1/releases /var/www/element-plus-x/v2/releases
sudo mkdir -p /var/www/element-plus-x/v1/current /var/www/element-plus-x/v2/current
```

4. Test and reload:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Baota Dist Overwrite Mode (Optional)

If you prefer a clean single-version deployment (no `releases/current`), you can deploy directly to
`/www/wwwroot/<domain>/dist` and overwrite on every release.

**Requirements**

- Set `DOCS_DEPLOY_BASE_DIR=/www/wwwroot` in GitHub Secrets.
- Configure Baota/Nginx root to point at the `dist` folder:
  - v1 root: `/www/wwwroot/v1.element-plus-x.com/dist`
  - v2 root: `/www/wwwroot/v2.element-plus-x.com/dist`

**Workflow**

- Use `.github/workflows/docs-deploy-bt.yaml` (`Docs Deploy (Baota Dist)`).
- It removes the target `dist` directory, recreates it, and uploads the new build.

**Trade-offs**

- Pros: minimal disk usage, simple directory structure.
- Cons: no instant rollback (previous build is deleted).

## HTTPS (Recommended)

Use Certbot to issue TLS certificates for the three domains. Example:

```bash
sudo apt update
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d element-plus-x.com -d v1.element-plus-x.com -d v2.element-plus-x.com
```

## GitHub Secrets Required

Configure these secrets in the repo settings:

1. `DOCS_DEPLOY_HOST`
2. `DOCS_DEPLOY_PORT`
3. `DOCS_DEPLOY_USER`
4. `DOCS_DEPLOY_SSH_KEY`
5. `DOCS_DEPLOY_BASE_DIR` (suggested: `/var/www/element-plus-x`)

## Workflows

### Docs Deploy Verify

Use the `Docs Deploy Verify` workflow for the first end-to-end server test.

- Trigger it manually from the default branch.
- Point `source_ref` to the branch or tag you want to build.
- It uploads to `${DOCS_DEPLOY_BASE_DIR}/verify/<line>/<verify_id>`.
- It does not switch `current`, does not change `root/redirect.conf`, and does not reload nginx.

### Docs Release

Use the `Docs Release` workflow for release uploads and cutover.

- `switch_current=false` uploads the release without switching live traffic.
- `switch_current=true` updates the `<line>/current` symlink.
- `update_root_redirect=true` updates the root domain redirect when the release should become the default docs line.

### Docs Deploy (Baota Dist)

Use the `Docs Deploy (Baota Dist)` workflow when running the overwrite-style deployment on Baota.

- Inputs: `line` and `source_ref`
- Target: `${DOCS_DEPLOY_BASE_DIR}/<domain>/dist`
- It deletes the existing `dist` directory before uploading.
