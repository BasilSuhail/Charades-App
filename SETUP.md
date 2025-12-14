# Setup Instructions

Quick guide to get the Charades app running with your own n8n instance.

## Step 1: Configure Your Credentials

### Create config.js

```bash
# Copy the sample config file
cp config.sample.js config.js
```

Then edit `config.js` and update the webhook URL:

```javascript
const CONFIG = {
    N8N_WEBHOOK_URL: 'https://n8n.your-domain.com/webhook/charades-topic'
};
```

**Note:** `config.js` is gitignored, so your credentials stay private.

## Step 2: Setup n8n Workflow

### Option A: Import the sample workflow

1. Open your n8n instance
2. Click "Add workflow" → "Import from File"
3. Select `n8n-workflow.sample.json`
4. Configure your Anthropic API credentials in n8n
5. Activate the workflow
6. Copy the webhook URL and paste it in your `config.js`

### Option B: Use your existing workflow

If you already have `n8n-workflow.json` configured:

1. Make sure it's **not** committed to git (it's in `.gitignore`)
2. Import it to your n8n instance
3. Copy the webhook URL to `config.js`

## Step 3: Generate PWA Icons

Open `convert-icons.html` in your browser and click the download buttons to generate:
- `icon-192.png`
- `icon-512.png`

These are also gitignored, so regenerate them as needed.

## Step 4: Test Locally

```bash
# Use any simple HTTP server
python3 -m http.server 8000
# or
npx serve .
```

Open `http://localhost:8000` and test the app.

## Step 5: Deploy to Contabo

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment instructions.

---

## File Structure

```
.
├── index.html              # Main HTML (safe to commit)
├── style.css               # Styles (safe to commit)
├── app.js                  # Main JavaScript (safe to commit)
├── manifest.json           # PWA manifest (safe to commit)
├── service-worker.js       # Service worker (safe to commit)
│
├── config.sample.js        # Sample config (safe to commit)
├── config.js               # YOUR config (gitignored - DO NOT COMMIT)
│
├── n8n-workflow.sample.json    # Sample workflow (safe to commit)
├── n8n-workflow.json          # YOUR workflow (gitignored - DO NOT COMMIT)
│
├── convert-icons.html      # Icon generator tool
├── icon-192.png            # Generated icon (gitignored)
├── icon-512.png            # Generated icon (gitignored)
│
├── .gitignore             # Protects your credentials
├── SETUP.md               # This file
├── DEPLOYMENT.md          # Server deployment guide
└── README.md              # Project documentation
```

## Security Notes

**Never commit these files:**
- `config.js` (contains your webhook URL)
- `n8n-workflow.json` (may contain credential IDs)
- Generated icons (can be regenerated)

**Safe to commit:**
- `config.sample.js` (template only)
- `n8n-workflow.sample.json` (template only)
- All other source files

---

## Troubleshooting

**"CONFIG is not defined" error:**
- Make sure `config.js` exists (copy from `config.sample.js`)
- Make sure `index.html` loads `config.js` before `app.js`

**Topics not generating:**
- Check `config.js` has the correct webhook URL
- Check n8n workflow is activated
- Check browser console for errors
- Fallback topics should work automatically if AI fails

**Icons not showing:**
- Generate them using `convert-icons.html`
- Or create your own 192x192 and 512x512 PNG icons

---

## Getting Help

See the main [README.md](README.md) for more information.
