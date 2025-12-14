// ============================================================================
// CONFIGURATION - Sample file for GitHub/portfolio
// ============================================================================
//
// INSTRUCTIONS:
// 1. Copy this file to 'config.js'
// 2. Update the N8N_WEBHOOK_URL with your actual n8n webhook URL
// 3. Never commit config.js to git (it's in .gitignore)
//
// To get your n8n webhook URL:
// 1. Open your n8n instance (https://n8n.your-domain.com)
// 2. Open the "Charades Topic Generator" workflow
// 3. Click on the Webhook node
// 4. Copy the "Production URL" or "Test URL"
// 5. Paste it below
//

const CONFIG = {
    // Replace this with your actual n8n webhook URL
    N8N_WEBHOOK_URL: 'YOUR_N8N_WEBHOOK_URL_HERE'

    // Example formats:
    // 'https://n8n.your-domain.com/webhook/charades-topic'
    // 'https://your-n8n-instance.app.n8n.cloud/webhook/charades-topic'
};

// Don't change this line
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
