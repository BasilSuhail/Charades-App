// ============================================================================
// TOPICS DATABASE - Lightweight Offline Version (No SQLite needed!)
// ============================================================================
// All 325 topics embedded directly in JavaScript for 100% offline support
// ============================================================================

class TopicsDatabase {
    constructor() {
        this.topics = TOPICS; // Loaded from topics-embedded.js
        this.initialized = true;
        console.log(`Topics database initialized with ${this.topics.length} topics`);
    }

    // Fuzzy match theme names to handle typos
    fuzzyMatchTheme(userInput) {
        if (!userInput || userInput.trim() === '') {
            return 'General';
        }

        const input = userInput.toLowerCase().trim();

        // Map of common typos/variations to correct theme names
        const themeMap = {
            // Animals
            'animal': 'Animals', 'animl': 'Animals', 'anmal': 'Animals', 'anim': 'Animals',
            // Christmas
            'christmas': 'christmas', 'xmas': 'christmas', 'christ': 'christmas', 'chritsmas': 'christmas',
            // Disney
            'disney': 'disney', 'disny': 'disney', 'disnee': 'disney',
            // Space
            'space': 'space', 'spce': 'space', 'spac': 'space',
            // Music
            'music': 'Music', 'musie': 'Music', 'msic': 'Music', 'song': 'Music', 'instrument': 'Music',
            // Movies
            'movie': 'Movies', 'film': 'Movies', 'movies': 'Movies',
            // Food
            'food': 'food', 'fod': 'food', 'foods': 'food',
            // Sports
            'sport': 'sports', 'sports': 'sports', 'sprts': 'sports',
            // 1980s
            '1980': '1980s', '80s': '1980s', 'eighties': '1980s',
            // Modern
            'modern': 'Modern', 'tech': 'Modern', 'technology': 'Modern', 'tiktok': 'Modern', 'zoom': 'Modern',
            // Fairy Tales
            'fairy': 'Fairy Tales', 'fairytale': 'Fairy Tales', 'tale': 'Fairy Tales', 'fiary': 'Fairy Tales',
            // Transport
            'transport': 'Transport', 'vehicle': 'Transport', 'car': 'Transport', 'vehicl': 'Transport',
            // School
            'school': 'School', 'scool': 'School', 'schol': 'School', 'education': 'School',
            // Chores
            'chore': 'Chores', 'chores': 'Chores', 'cleaning': 'Chores', 'clean': 'Chores',
            // History
            'history': 'History', 'histoy': 'History', 'historic': 'History',
            // TV
            'tv': 'TV', 'television': 'TV', 'show': 'TV', 'shows': 'TV'
        };

        // Direct match
        if (themeMap[input]) {
            return themeMap[input];
        }

        // Partial match (check if input is contained in any key)
        for (const [key, value] of Object.entries(themeMap)) {
            if (key.includes(input) || input.includes(key)) {
                return value;
            }
        }

        // No match found, return original input (will be used in filtering)
        return userInput.trim();
    }

    // Get a random topic based on theme and exclude used topics
    getTopic(theme = '', usedTopics = []) {
        try {
            // Apply fuzzy matching to theme
            const matchedTheme = this.fuzzyMatchTheme(theme);

            // Filter topics by theme
            let filteredTopics;
            if (matchedTheme && matchedTheme !== 'General') {
                // Match ONLY the specific theme (not General)
                filteredTopics = this.topics.filter(t =>
                    t.theme.toLowerCase().includes(matchedTheme.toLowerCase())
                );
            } else {
                // No theme specified, only use General topics
                filteredTopics = this.topics.filter(t => t.theme === 'General');
            }

            // Exclude used topics
            if (usedTopics && usedTopics.length > 0) {
                filteredTopics = filteredTopics.filter(t => !usedTopics.includes(t.topic));
            }

            console.log(`Found ${filteredTopics.length} topics for theme "${matchedTheme}" (excluding ${usedTopics.length} used)`);

            // If we have topics, pick a random one
            if (filteredTopics.length > 0) {
                const randomIndex = Math.floor(Math.random() * filteredTopics.length);
                return filteredTopics[randomIndex];
            }

            // If no topics found, it means all topics for this theme have been used
            // Instead of falling back to General, reset the theme's used topics
            if (matchedTheme && matchedTheme !== 'General') {
                console.warn(`🔄 All ${matchedTheme} topics have been used! Resetting theme topics...`);

                // Get all topics for this theme (ignoring used list)
                const themeTopics = this.topics.filter(t =>
                    t.theme.toLowerCase().includes(matchedTheme.toLowerCase())
                );

                if (themeTopics.length > 0) {
                    const randomIndex = Math.floor(Math.random() * themeTopics.length);
                    const topic = themeTopics[randomIndex];
                    return {
                        ...topic,
                        resetNotice: `🔄 All ${matchedTheme} topics completed! Starting fresh.`
                    };
                }
            }

            // Absolute fallback: return a random General topic
            return this.getRandomGeneralTopic(usedTopics);
        } catch (error) {
            console.error('Error getting topic:', error);
            throw error;
        }
    }

    // Fallback: Get any random General topic
    getRandomGeneralTopic(usedTopics = []) {
        let generalTopics = this.topics.filter(t => t.theme === 'General');

        // Exclude used topics
        if (usedTopics && usedTopics.length > 0) {
            generalTopics = generalTopics.filter(t => !usedTopics.includes(t.topic));
        }

        if (generalTopics.length > 0) {
            const randomIndex = Math.floor(Math.random() * generalTopics.length);
            return generalTopics[randomIndex];
        }

        // Last resort: return first topic in entire database
        return this.topics[0] || {
            category: 'Movie',
            emoji: '🎬',
            topic: 'The Wizard of Oz',
            difficulty: 'Medium',
            constraint: 'Skip and lock arms',
            theme: 'General'
        };
    }

    // Get all available themes
    getThemes() {
        const themes = [...new Set(this.topics.map(t => t.theme))];
        return themes.filter(t => t !== 'General').sort();
    }

    // Get topic count by theme
    getTopicCount(theme = '') {
        if (!theme || theme.trim() === '') {
            return this.topics.filter(t => t.theme === 'General').length;
        }

        const matchedTheme = this.fuzzyMatchTheme(theme);
        return this.topics.filter(t =>
            t.theme.toLowerCase().includes(matchedTheme.toLowerCase())
        ).length;
    }
}

// Create global instance
const topicsDB = new TopicsDatabase();
