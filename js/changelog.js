/**
 * CHANGELOG - Dracula's What Castle?
 * Version history, features, bugfixes, balance changes, and credits
 */

export const CHANGELOG = {
    "2.0": {
        date: "2024-09-19",
        codename: "The Floating New Sanctuary",
        title: "Complete Modular Refactor",
        description: "Architecture overhaul for maintainability and scalability. All game data separated from logic, UI abstracted into controllers, CSS organized with variables.",
        features: [
            "🏗️ Modular architecture - Separated config, core logic, and UI",
            "📦 6-file structure (HTML + JS + CSS) for clean separation of concerns",
            "🎵 Persistent changelog system (history preserved across versions)",
            "🔧 StateManager abstraction for better state handling",
            "🎨 CSS variables extracted for theme consistency",
            "📱 Improved mobile responsiveness",
            "⚙️ Settings persistence via SETTINGS config",
            "🧠 Game data centralized in config.js"
        ],
        bugfixes: [
            "Fixed code organization to prevent accidental overwrites",
            "Improved localStorage key management (now in SETTINGS)",
            "Better separation to prevent UI/logic coupling"
        ],
        balance: [],
        improvements: [
            "Code maintainability increased significantly",
            "Adding new rooms/items now requires only config.js edit",
            "Future features easier to implement with modular structure"
        ],
        credits: [
            "Developed by: หลอด (Content Creator)",
            "Architecture inspired by clean code principles",
            "Castlevania series for thematic inspiration"
        ],
        technical: {
            filesCount: 6,
            linesOfCode: "~2,080 lines (organized)",
            modules: ["HTML structure", "Changelog", "Config", "Core Engine", "UI Controller", "Theme CSS"],
            approach: "YAGNI - Only what's needed, not over-engineered"
        }
    },

    "1.6": {
        date: "2024-09-18",
        codename: "Dance of Silver",
        title: "GameEngine Refactor & Quality of Life",
        description: "Introduced GameEngine class for better code organization. Added settings, hints system, and improved 5th ending unlock conditions.",
        features: [
            "🎯 GameEngine class - Single game controller",
            "⚙️ Settings modal - Text speed and sound toggle",
            "💡 Hint system - Contextual tips for each room",
            "🏆 5th ending unlocked (was 4, now 5)",
            "🕯️ Echo Indicator visual refinements",
            "🎨 Enhanced UI polish and animations",
            "📱 Better mobile layout (responsive grid adjustments)",
            "⏸️ Pause menu functionality"
        ],
        bugfixes: [
            "Fixed HP bar not updating on mobile devices",
            "Fixed fear bar visual glitches on narrow screens",
            "Improved responsive breakpoints for tablets",
            "Fixed modal backdrop filtering"
        ],
        balance: [
            "Adjusted fear gain from dungeon_shadow (+10)",
            "Increased hint system helpfulness",
            "Better pacing for new players"
        ],
        credits: [
            "Developed by: หลอด",
            "Balance testing and UX feedback incorporated"
        ]
    },

    "1.5": {
        date: "2024-09-15",
        codename: "Wicked Children",
        title: "Initial Release",
        description: "First stable release with core game mechanics, Echo Memory system, and initial 4 endings.",
        features: [
            "🦇 Core narrative game - Dracula's castle exploration",
            "🧠 Echo Memory system - Discoveries persist across loops",
            "🏆 4 main endings - Escape variants and combat endings",
            "📖 How to play guide",
            "🔔 Audio/visual feedback system",
            "📊 Stats tracking (HP, Fear, Loop counter, Memories)",
            "🎨 Dark gothic aesthetic with Cinzel & Mitr fonts"
        ],
        bugfixes: [],
        balance: [
            "Initial difficulty balancing",
            "HP and Fear stat tuning"
        ],
        credits: [
            "Developed by: หลอด",
            "Inspired by: Castlevania series (Symphony of the Night, etc)",
            "Theme: Gothic horror meets time-loop narrative"
        ]
    }
};

/**
 * Helper function to get current version
 */
export function getCurrentVersion() {
    return Object.keys(CHANGELOG)[0]; // Latest version is first key
}

/**
 * Helper function to get version info
 */
export function getVersionInfo(versionNumber) {
    return CHANGELOG[versionNumber] || null;
}

/**
 * Helper function to display formatted changelog
 */
export function formatChangelogHTML(versionNumber) {
    const version = CHANGELOG[versionNumber];
    if (!version) return "<p>Version not found</p>";

    let html = `
        <div class="changelog-entry">
            <h3 class="text-lg font-bold text-purple-300 mb-2">
                v${versionNumber} - ${version.title}
                <span class="text-sm text-yellow-400 ml-2">"${version.codename}"</span>
            </h3>
            <p class="text-xs text-purple-400 mb-3">Released: ${version.date}</p>
            <p class="text-sm text-purple-200 mb-3">${version.description}</p>
    `;

    if (version.features && version.features.length > 0) {
        html += `<div class="mb-3">
            <h4 class="font-semibold text-green-400 mb-1">✨ Features:</h4>
            <ul class="text-xs text-purple-300 space-y-0.5 ml-3">
                ${version.features.map(f => `<li>• ${f}</li>`).join("")}
            </ul>
        </div>`;
    }

    if (version.bugfixes && version.bugfixes.length > 0) {
        html += `<div class="mb-3">
            <h4 class="font-semibold text-blue-400 mb-1">🐛 Bugfixes:</h4>
            <ul class="text-xs text-purple-300 space-y-0.5 ml-3">
                ${version.bugfixes.map(f => `<li>• ${f}</li>`).join("")}
            </ul>
        </div>`;
    }

    if (version.improvements && version.improvements.length > 0) {
        html += `<div class="mb-3">
            <h4 class="font-semibold text-cyan-400 mb-1">⚡ Improvements:</h4>
            <ul class="text-xs text-purple-300 space-y-0.5 ml-3">
                ${version.improvements.map(i => `<li>• ${i}</li>`).join("")}
            </ul>
        </div>`;
    }

    if (version.balance && version.balance.length > 0) {
        html += `<div class="mb-3">
            <h4 class="font-semibold text-orange-400 mb-1">⚖️ Balance:</h4>
            <ul class="text-xs text-purple-300 space-y-0.5 ml-3">
                ${version.balance.map(b => `<li>• ${b}</li>`).join("")}
            </ul>
        </div>`;
    }

    if (version.credits && version.credits.length > 0) {
        html += `<div class="mb-3">
            <h4 class="font-semibold text-red-400 mb-1">❤️ Credits:</h4>
            <ul class="text-xs text-purple-300 space-y-0.5 ml-3">
                ${version.credits.map(c => `<li>• ${c}</li>`).join("")}
            </ul>
        </div>`;
    }

    html += `</div>`;
    return html;
}
