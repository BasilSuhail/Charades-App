# Deployment Guide - Contabo Server

This guide explains how to deploy the Holiday Charades PWA to your Contabo server with n8n integration.

## Architecture Overview

```
┌─────────────────┐         ┌──────────────┐         ┌────────────────┐
│  PWA Frontend   │────────>│ n8n Workflow │────────>│  Claude API    │
│  (Static HTML)  │ webhook │  (Contabo)   │  API    │  (Anthropic)   │
└─────────────────┘         └──────────────┘         └────────────────┘
```

## Prerequisites

- Contabo VPS with Ubuntu/Debian
- Domain name (optional but recommended)
- SSH access to your server
- Anthropic API key ([get one here](https://console.anthropic.com))

---

## Part 1: Server Setup

### 1. Initial Server Configuration

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y nginx certbot python3-certbot-nginx git curl

# Install Node.js (required for n8n)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installations
node --version  # Should show v20.x
npm --version   # Should show 10.x
nginx -v        # Should show nginx version
```

### 2. Install n8n

```bash
# Install n8n globally
sudo npm install -g n8n

# Create n8n user (security best practice)
sudo useradd -m -s /bin/bash n8n
sudo mkdir -p /home/n8n/.n8n
sudo chown -R n8n:n8n /home/n8n/.n8n
```

### 3. Configure n8n as a System Service

Create the systemd service file:

```bash
sudo nano /etc/systemd/system/n8n.service
```

Paste this configuration:

```ini
[Unit]
Description=n8n - Workflow Automation
After=network.target

[Service]
Type=simple
User=n8n
Environment="N8N_PORT=5678"
Environment="N8N_PROTOCOL=https"
Environment="N8N_HOST=your-domain.com"
Environment="WEBHOOK_URL=https://your-domain.com"
Environment="N8N_BASIC_AUTH_ACTIVE=true"
Environment="N8N_BASIC_AUTH_USER=admin"
Environment="N8N_BASIC_AUTH_PASSWORD=your-secure-password"
ExecStart=/usr/bin/n8n
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

**Important**: Replace:
- `your-domain.com` with your actual domain
- `your-secure-password` with a strong password

Enable and start n8n:

```bash
sudo systemctl daemon-reload
sudo systemctl enable n8n
sudo systemctl start n8n
sudo systemctl status n8n  # Check it's running
```

---

## Part 2: Web Server Configuration

### 4. Setup Nginx

Create the nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/charades
```

Paste this configuration:

```nginx
# n8n automation backend
server {
    listen 80;
    server_name n8n.your-domain.com;

    location / {
        proxy_pass http://localhost:5678;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Charades PWA Frontend
server {
    listen 80;
    server_name charades.your-domain.com;

    root /var/www/charades;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|json)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Service worker - no cache
    location = /service-worker.js {
        add_header Cache-Control "no-cache";
        expires 0;
    }
}
```

**Replace**: `your-domain.com` with your actual domain

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/charades /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl restart nginx
```

### 5. SSL Certificates (HTTPS)

```bash
# Get SSL certificates for both domains
sudo certbot --nginx -d n8n.your-domain.com -d charades.your-domain.com

# Auto-renewal is set up automatically
# Test renewal:
sudo certbot renew --dry-run
```

---

## Part 3: Deploy the PWA

### 6. Upload Frontend Files

```bash
# Create web directory
sudo mkdir -p /var/www/charades
sudo chown -R $USER:$USER /var/www/charades
```

**Option A: Upload via SCP/SFTP**

From your local machine:

```bash
cd "/Users/basilsuhail/folders/Term Projects/Charades App"
scp index.html style.css app.js manifest.json service-worker.js user@your-server:/var/www/charades/
```

**Option B: Git Deployment**

```bash
cd /var/www/charades
git clone https://github.com/YOUR-USERNAME/charades-app.git .
```

### 7. Generate PWA Icons

Open [convert-icons.html](convert-icons.html) in your browser locally, download the generated icons, then upload them:

```bash
scp icon-192.png icon-512.png user@your-server:/var/www/charades/
```

---

## Part 4: Configure n8n Workflow

### 8. Access n8n Dashboard

1. Go to `https://n8n.your-domain.com`
2. Login with the credentials you set earlier
3. Click "Add workflow" → "Import from File"
4. Upload `n8n-workflow.json`

### 9. Configure Anthropic API Credentials

1. In n8n, go to **Settings** → **Credentials**
2. Click **"Add Credential"** → Search for **"Anthropic"**
3. Enter your Anthropic API key
4. Click **"Save"**

### 10. Update Workflow

1. Open the imported "Charades Topic Generator" workflow
2. Click on the **"Claude AI"** node
3. Select your Anthropic credential from the dropdown
4. Click on the **"Webhook"** node
5. Copy the webhook URL (should be like: `https://n8n.your-domain.com/webhook/charades-topic`)
6. **Activate the workflow** (toggle in top-right corner)

### 11. Update Frontend Configuration

Edit `/var/www/charades/app.js`:

```bash
sudo nano /var/www/charades/app.js
```

Find line 7 and update:

```javascript
const CONFIG = {
    N8N_WEBHOOK_URL: 'https://n8n.your-domain.com/webhook/charades-topic'
};
```

Save and exit.

---

## Part 5: Testing

### 12. Test the Deployment

1. **Test PWA**: Go to `https://charades.your-domain.com`
   - Should load instantly
   - Add players, configure game
   - Click "Start Game"

2. **Test AI Integration**:
   - Click "START TURN"
   - Should show "Getting topic from AI..."
   - Should receive a topic within 2-3 seconds
   - If it fails, check fallback topics load

3. **Test PWA Installation**:
   - On mobile: Open in browser, tap "Add to Home Screen"
   - Should install as standalone app

4. **Test Persistence**:
   - Start a game
   - Refresh the page
   - Should restore game state

### 13. Check Logs

If something doesn't work:

```bash
# Check n8n logs
sudo journalctl -u n8n -f

# Check nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Check nginx status
sudo systemctl status nginx

# Check n8n status
sudo systemctl status n8n
```

---

## Part 6: Monitoring & Maintenance

### 14. Setup Monitoring

Create a simple monitoring script:

```bash
sudo nano /usr/local/bin/check-charades.sh
```

```bash
#!/bin/bash
# Check if services are running

if ! systemctl is-active --quiet n8n; then
    echo "n8n is down! Restarting..."
    systemctl restart n8n
fi

if ! systemctl is-active --quiet nginx; then
    echo "nginx is down! Restarting..."
    systemctl restart nginx
fi
```

Make it executable and add to cron:

```bash
sudo chmod +x /usr/local/bin/check-charades.sh
sudo crontab -e

# Add this line:
*/5 * * * * /usr/local/bin/check-charades.sh >> /var/log/charades-monitor.log 2>&1
```

### 15. Backup Strategy

```bash
# Backup n8n workflows
sudo mkdir -p /backups
sudo crontab -e

# Add daily backup at 2 AM:
0 2 * * * tar -czf /backups/n8n-$(date +\%Y\%m\%d).tar.gz /home/n8n/.n8n
0 2 * * * tar -czf /backups/charades-$(date +\%Y\%m\%d).tar.gz /var/www/charades

# Delete backups older than 30 days:
0 3 * * * find /backups -type f -mtime +30 -delete
```

---

## Troubleshooting

### Common Issues

**1. "Getting topic from AI..." hangs forever**
- Check n8n is running: `sudo systemctl status n8n`
- Check webhook URL in app.js matches n8n
- Check n8n workflow is activated (toggle top-right)
- Check Anthropic API key is valid

**2. PWA won't install**
- Ensure HTTPS is working
- Check icons exist (icon-192.png, icon-512.png)
- Check manifest.json is accessible

**3. Game state doesn't persist**
- Check browser localStorage is enabled
- Check for browser console errors (F12)

**4. n8n shows "502 Bad Gateway"**
- n8n service might be down
- Check: `sudo systemctl status n8n`
- Restart: `sudo systemctl restart n8n`

**5. Topics don't match theme**
- Check the workflow prompt includes theme
- Verify theme is being sent in request body

---

## Performance Optimization

### Enable Gzip Compression

Edit `/etc/nginx/nginx.conf`:

```nginx
http {
    # ... existing config ...

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;
}
```

Restart nginx: `sudo systemctl restart nginx`

### Rate Limiting (Prevent Abuse)

Add to nginx config:

```nginx
limit_req_zone $binary_remote_addr zone=charades_limit:10m rate=10r/m;

location /webhook/ {
    limit_req zone=charades_limit burst=5;
    proxy_pass http://localhost:5678;
}
```

---

## Security Checklist

- [ ] n8n secured with basic auth
- [ ] HTTPS enabled on all domains
- [ ] Firewall configured (UFW):
  ```bash
  sudo ufw allow 22/tcp    # SSH
  sudo ufw allow 80/tcp    # HTTP
  sudo ufw allow 443/tcp   # HTTPS
  sudo ufw enable
  ```
- [ ] Regular system updates scheduled
- [ ] Backups configured
- [ ] n8n running as non-root user
- [ ] API keys stored as environment variables (not in code)

---

## Updating the App

To deploy updates:

```bash
cd /var/www/charades
# Backup current version
sudo cp -r /var/www/charades /backups/charades-$(date +%Y%m%d)

# Pull/upload new files
git pull  # or upload via SCP

# No restart needed for frontend
# Nginx automatically serves new files

# For n8n workflow updates:
# Import new workflow version in n8n dashboard
```

---

## Support & Documentation

- n8n Docs: https://docs.n8n.io
- Nginx Docs: https://nginx.org/en/docs/
- Anthropic API: https://docs.anthropic.com

---

**Your app should now be live at:**
- PWA: `https://charades.your-domain.com`
- n8n Dashboard: `https://n8n.your-domain.com`

Enjoy your portfolio-ready charades app! 🎭
