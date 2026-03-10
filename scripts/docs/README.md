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
