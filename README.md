# 🎭 Holiday Charades - AI-Powered PWA

> A serverless, Progressive Web App party game featuring AI-generated topics via n8n automation and Claude API

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://your-domain.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PWA Ready](https://img.shields.io/badge/PWA-ready-orange.svg)](https://developers.google.com/web/progressive-web-apps)

**[Live Demo](https://your-domain.com)** | **[Architecture](#architecture)** | **[Setup Guide](SETUP.md)** | **[Deployment](DEPLOYMENT.md)**

---

## 📖 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Project Highlights](#project-highlights)
- [Future Enhancements](#future-enhancements)
- [License](#license)

---

## 🎯 Overview

Holiday Charades is a modern, single-device party game that showcases the power of combining Progressive Web Apps with serverless AI automation. Built as a portfolio project to demonstrate full-stack skills including frontend development, API integration, workflow automation, and self-hosted infrastructure.

### The Problem

Traditional charades requires someone to think of topics, write them on paper, and manage the game manually. Digital alternatives require app store downloads and often lack AI-generated content.

### The Solution

A Progressive Web App that:
- **Installs instantly** - No app store, works offline after first load
- **Generates topics via AI** - Claude AI creates contextual, themed topics
- **Self-hosted infrastructure** - n8n automation on Contabo VPS
- **Zero friction** - One phone, pass it around, AI does the thinking

---

## ✨ Key Features

### 🎮 Gameplay Features
- **AI-Generated Topics** - Claude API creates unique, themed charades topics
- **Smart Memory** - Tracks used topics to prevent repeats
- **Theme Support** - Custom themes (Christmas, 80s, Disney, etc.)
- **Skip System** - One skip per player per round
- **Photo Integration** - Camera API for player photos
- **Persistent State** - LocalStorage saves game progress through refreshes
- **Scoring System** - Points for both actors and guessers
- **Leaderboard** - Real-time score tracking

### 💻 Technical Features
- **Progressive Web App** - Installable, offline-capable, app-like experience
- **Service Worker** - Caching for offline gameplay
- **n8n Workflow Automation** - Serverless backend orchestration
- **Graceful Degradation** - 100+ fallback topics if AI unavailable
- **Responsive Design** - Mobile-first, works on all devices
- **Zero Dependencies** - Vanilla JavaScript, no frameworks
- **Self-Hosted** - Complete control over infrastructure

---

## 🛠 Tech Stack

### Frontend
- **HTML5** - Semantic markup, manifest.json for PWA
- **CSS3** - Custom properties, gradient backgrounds, animations
- **Vanilla JavaScript** - No frameworks, ES6+ features
- **Web APIs** - Service Worker, LocalStorage, Camera API

### Backend/Infrastructure
- **n8n** - Workflow automation platform (self-hosted)
- **Claude API** - Anthropic's AI for topic generation
- **Nginx** - Web server and reverse proxy
- **Ubuntu Server** - Contabo VPS hosting
- **Certbot** - SSL/TLS certificate management

### DevOps
- **Git** - Version control with credential protection
- **GitHub** - Code hosting and collaboration
- **Systemd** - Service management for n8n
- **UFW** - Firewall configuration

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         User's Browser                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  HTML/CSS    │  │  JavaScript  │  │  Service     │      │
│  │  (PWA Shell) │  │  (Game Logic)│  │  Worker      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS (webhook call)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Contabo VPS Server                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                     Nginx (Port 443)                  │   │
│  │  - SSL Termination (Certbot)                         │   │
│  │  - Reverse Proxy                                     │   │
│  │  - Static File Serving                               │   │
│  └────────────────┬─────────────────────────────────────┘   │
│                   │                                          │
│  ┌────────────────▼─────────────────────────────────────┐   │
│  │              n8n Automation (Port 5678)              │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │   │
│  │  │ Webhook  │─>│ Claude   │─>│ Response Format  │   │   │
│  │  │ Trigger  │  │ AI Node  │  │ (JS Transform)   │   │   │
│  │  └──────────┘  └──────────┘  └──────────────────┘   │   │
│  └──────────────────┬───────────────────────────────────┘   │
└─────────────────────┼───────────────────────────────────────┘
                      │ HTTPS API Call
                      ▼
         ┌────────────────────────────┐
         │   Anthropic Claude API     │
         │   (claude-sonnet-4)        │
         └────────────────────────────┘
```

### Data Flow

1. **User clicks "Start Turn"** → Frontend sends POST request to n8n webhook
2. **n8n receives request** → Extracts theme and used topics
3. **n8n calls Claude API** → AI generates contextual topic
4. **Response parsed** → JavaScript node formats response as JSON
5. **Frontend receives topic** → Displays category, emoji, and topic
6. **Fallback logic** → If any step fails, uses local topic database

### Why This Architecture?

- **Separation of Concerns** - Frontend handles UI, n8n handles AI orchestration
- **Cost Effective** - ~$0.01 per 100 games, no serverless function costs
- **Scalable** - Can handle thousands of concurrent games
- **Portfolio-Ready** - Demonstrates full-stack and DevOps skills
- **Self-Hosted** - Complete control, no vendor lock-in

---

## 📸 Screenshots

### Setup Screen
*Add players with photos, configure timer and rounds*

### Game Screen
*AI-generated topics with countdown and scoring*

### Leaderboard
*Real-time score tracking and winner announcement*

---

## 🚀 Getting Started

### Prerequisites

- Modern browser (Chrome, Firefox, Safari, Edge)
- n8n instance (self-hosted or cloud)
- Anthropic API key ([get one here](https://console.anthropic.com))

### Quick Start (Local Development)

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR-USERNAME/holiday-charades.git
   cd holiday-charades
   ```

2. **Configure credentials**
   ```bash
   cp config.sample.js config.js
   # Edit config.js and add your n8n webhook URL
   ```

3. **Import n8n workflow**
   - Open your n8n instance
   - Import `n8n-workflow.sample.json`
   - Configure Anthropic API credentials
   - Activate the workflow
   - Copy the webhook URL to `config.js`

4. **Generate PWA icons**
   - Open `convert-icons.html` in your browser
   - Download the generated icons

5. **Run locally**
   ```bash
   python3 -m http.server 8000
   # or
   npx serve .
   ```

6. **Test the app**
   - Open `http://localhost:8000`
   - Add players and start a game

**See [SETUP.md](SETUP.md) for detailed instructions.**

---

## 🌐 Deployment

### Deploy to Contabo VPS

This project includes a comprehensive deployment guide for self-hosting on a Contabo VPS with:
- Nginx configuration
- SSL/TLS certificates
- n8n as a systemd service
- Automated backups
- Monitoring scripts

**See [DEPLOYMENT.md](DEPLOYMENT.md) for step-by-step deployment instructions.**

### Alternative Deployment Options

**Static Hosting (without AI features):**
- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages

*Note: AI features require n8n webhook - use fallback topics only for static hosting*

---

## 🎓 Project Highlights

### Why This Project Stands Out

1. **Full-Stack Demonstration**
   - Frontend: PWA development with vanilla JavaScript
   - Backend: Workflow automation with n8n
   - Infrastructure: Self-hosted server management
   - DevOps: Service configuration, SSL, monitoring

2. **Modern Web Standards**
   - Progressive Web App architecture
   - Service Worker for offline capabilities
   - Web Manifest for installability
   - Responsive, mobile-first design

3. **AI Integration**
   - Anthropic Claude API for content generation
   - Context-aware prompting
   - Theme support and memory management

4. **Production-Ready**
   - Error handling and graceful degradation
   - Persistent state management
   - Security best practices (credential protection)
   - Comprehensive documentation

5. **Self-Hosted Infrastructure**
   - Complete server setup from scratch
   - Nginx reverse proxy configuration
   - SSL/TLS certificate management
   - Service monitoring and backups

### Skills Demonstrated

- **Frontend Development** - HTML, CSS, JavaScript, PWA APIs
- **API Integration** - RESTful APIs, async/await, error handling
- **Workflow Automation** - n8n, webhook configuration, AI prompting
- **Server Administration** - Linux, Nginx, systemd, UFW firewall
- **DevOps** - Git, deployment automation, monitoring
- **Security** - HTTPS, credential management, rate limiting
- **Documentation** - README, setup guides, deployment docs

---

## 🔮 Future Enhancements

### Planned Features
- [ ] Multi-device sync (Firebase/Supabase)
- [ ] Team mode (2v2 charades)
- [ ] Difficulty levels (easy/medium/hard)
- [ ] Custom topic packs
- [ ] Sound effects and haptic feedback
- [ ] Analytics dashboard
- [ ] Social sharing (share scores to Twitter/Facebook)
- [ ] Global leaderboard
- [ ] Alternative game modes (Pictionary, Taboo)

### Technical Improvements
- [ ] TypeScript migration
- [ ] Unit tests (Jest)
- [ ] E2E tests (Playwright)
- [ ] Performance monitoring (Lighthouse CI)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Docker containerization
- [ ] Kubernetes deployment option

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Basil Suhail**

- Portfolio: [your-portfolio.com](https://your-portfolio.com)
- GitHub: [@basilsuhail](https://github.com/basilsuhail)
- LinkedIn: [Your Name](https://linkedin.com/in/yourprofile)

---

## 🙏 Acknowledgments

- Built at **AI Builders Buildathon** - Dundee Founders Collective (December 2024)
- Powered by [Anthropic Claude](https://www.anthropic.com)
- Automation via [n8n.io](https://n8n.io)
- Inspired by the classic party game Charades

---

## 📞 Support

If you have questions or want to discuss this project:
- Open an [issue](https://github.com/YOUR-USERNAME/holiday-charades/issues)
- Connect on [LinkedIn](https://linkedin.com/in/yourprofile)

---

**⭐ If you found this project interesting, please consider giving it a star!**

