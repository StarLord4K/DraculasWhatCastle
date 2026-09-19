/**
 * CORE.JS - Game Engine & Logic
 * Main GameEngine class that handles all game state, logic, and flow
 * Imports from config.js for all game data
 */

import { SETTINGS, ROOMS, ITEMS, MEMORIES, ENDINGS } from './config.js';

export class GameEngine {
    constructor() {
        // Persistent data (survives across game loops)
        this.persistent = {
            endings: [],
            memories: [],
            loops: 0
        };

        // Current game state (resets each loop)
        this.state = this.getInitialState();

        // UI settings
        this.settings = {
            sound: SETTINGS.soundEnabledDefault,
            textSpeed: SETTINGS.textSpeedDefault
        };

        // Temporary state for modals
        this.pendingConfirmCallback = null;
    }

    /**
     * Get initial game state for a new loop
     */
    getInitialState() {
        return {
            currentRoom: "entrance",
            hp: SETTINGS.maxHP,
            fear: 0,
            inventory: [],
            onceEvents: {},
            gameEnded: false
        };
    }

    /**
     * Initialize the game (called on startup)
     */
    init() {
        this.loadPersistentData();
        this.persistent.loops++;
        this.updateProgressUI();
    }

    /**
     * Load persistent data from localStorage
     */
    loadPersistentData() {
        try {
            const raw = localStorage.getItem(SETTINGS.storageKey);
            if (raw) {
                const parsed = JSON.parse(raw);
                this.persistent = Object.assign(this.persistent, parsed);
            }
        } catch (e) {
            console.warn("Failed to load persistent data:", e);
            this.persistent = { endings: [], memories: [], loops: 0 };
        }
    }

    /**
     * Save persistent data to localStorage
     */
    savePersistentData() {
        try {
            localStorage.setItem(SETTINGS.storageKey, JSON.stringify(this.persistent));
        } catch (e) {
            console.warn("Failed to save persistent data:", e);
        }
        this.updateProgressUI();
    }

    /**
     * Reset game state for new loop
     */
    resetGameState() {
        this.state = this.getInitialState();
    }

    // ============================================
    // MEMORY MANAGEMENT
    // ============================================

    hasMemory(id) {
        return this.persistent.memories.includes(id);
    }

    unlockMemory(id) {
        if (!MEMORIES[id] || this.hasMemory(id)) return false;
        this.persistent.memories.push(id);
        this.savePersistentData();
        this.addLog(`🕯️ ปลดล็อกความทรงจำ: ${MEMORIES[id].title}`);
        return true;
    }

    // ============================================
    // ENDING MANAGEMENT
    // ============================================

    hasEnding(id) {
        return this.persistent.endings.includes(id);
    }

    unlockEnding(id, text, memoryId) {
        if (this.hasEnding(id)) return; // Already unlocked

        this.persistent.endings.push(id);
        this.savePersistentData();

        if (memoryId) {
            this.unlockMemory(memoryId);
        }

        this.narrate(text, true);
        this.state.gameEnded = true;

        // Render ending screen
        this.renderEndingScreen(id);
    }

    renderEndingScreen(endingId) {
        const ending = ENDINGS[endingId];
        if (!ending) return;

        const endingBox = document.getElementById("ending-display");
        if (endingBox) {
            endingBox.innerHTML = `
                <div class="text-center space-y-4">
                    <div class="text-5xl">${ending.emoji}</div>
                    <h2 class="text-xl font-bold text-yellow-400 gothic-title">${ending.title}</h2>
                    <p class="text-sm text-purple-200 max-w-md">${ending.desc}</p>
                    <p class="text-xs text-purple-400 mt-4">
                        ปลดล็อก: <span class="text-green-400">${this.persistent.endings.length} / ${SETTINGS.maxEndings}</span>
                    </p>
                </div>
            `;
        }
    }

    // ============================================
    // INVENTORY MANAGEMENT
    // ============================================

    addItem(id) {
        if (!ITEMS[id] || this.state.inventory.includes(id)) return false;
        this.state.inventory.push(id);
        this.addLog(`📦 ได้รับไอเทม: ${ITEMS[id].name}`);
        return true;
    }

    hasItem(id) {
        return this.state.inventory.includes(id);
    }

    removeItem(id) {
        this.state.inventory = this.state.inventory.filter(x => x !== id);
    }

    getInventoryCount() {
        return this.state.inventory.length;
    }

    // ============================================
    // SCREEN NAVIGATION
    // ============================================

    navigateScreen(id) {
        const screens = ["screen-menu", "screen-game", "screen-endings", "screen-how-to", "screen-changelog"];
        screens.forEach(x => {
            const el = document.getElementById(x);
            if (el) el.classList.add("hidden");
        });

        const target = document.getElementById(id);
        if (target) {
            target.classList.remove("hidden");
            
            // Update UI when showing certain screens
            if (id === "screen-menu" || id === "screen-endings") {
                this.updateProgressUI();
            }
        }
    }

    navigateRoom(roomId) {
        if (!ROOMS[roomId]) {
            console.warn(`Room ${roomId} not found`);
            return;
        }

        this.state.currentRoom = roomId;
        const room = ROOMS[roomId];
        
        // Add special narrative for returning rooms
        let text = room.desc;
        if (roomId === "library" && this.hasMemory("diary")) {
            text += "<br><br><span class='text-yellow-400 font-semibold'>คุณจำประโยคหนึ่งได้ชัดเจน: 'ปราสาทนี้ไม่เคยเป็นบ้านของแดร็กคิวล่า แต่มันคือคุก!'</span>";
        }
        if (roomId === "balcony" && this.hasMemory("moon_echo")) {
            text += "<br><br><span class='text-yellow-400 font-semibold'>เงาของแดร็กคิวล่าบนพื้นหินยังขยับช้ากว่าตัวจริงหนึ่งจังหวะเหมือนในลูปก่อน</span>";
        }

        this.narrate(text);
        this.updateUI();
    }

    // ============================================
    // GAME STATE MANIPULATION
    // ============================================

    adjustHP(amount) {
        this.state.hp = Math.max(0, Math.min(SETTINGS.maxHP, this.state.hp + amount));

        if (amount < 0) {
            this.triggerShake();
            this.addLog(`❤️ สูญเสียพลังชีวิต ${Math.abs(amount)} หน่วย`);
        }
        if (amount > 0) {
            this.addLog(`💚 ฟื้นฟูพลังชีวิต ${amount} หน่วย`);
        }

        if (this.state.hp <= 0) {
            this.endGame("คุณล้มลงบนพื้นหินเย็นจัด ร่างกายสูญสิ้นพลัง วิญญาณถูกดูดกลับไปขังในปราสาทอีกครั้ง");
        }
    }

    adjustFear(amount) {
        this.state.fear = Math.max(0, Math.min(SETTINGS.maxFear, this.state.fear + amount));

        if (amount > 0) this.addLog(`👻 ระดับความกลัวเพิ่มขึ้น ${amount}%`);
        if (amount < 0) this.addLog(`😌 ระดับความกลัวลดลง ${Math.abs(amount)}%`);

        // Fear threshold consequence
        if (this.state.fear >= SETTINGS.fearThreshold) {
            this.adjustHP(-25);
            this.narrate("<strong class='text-red-400'>[สติแตกซ่าน]</strong> เสียงกระซิบและภาพหลอนทับซ้อนกันจนคุณทนไม่ไหว คุณจำจังหวะระฆังดำได้ชัดเจนขึ้น!", true);
            this.unlockMemory("bell");
            this.state.fear = 55;
        }
    }

    // ============================================
    // UI UPDATES
    // ============================================

    updateUI() {
        this.updateHealthBar();
        this.updateFearBar();
        this.updateLocationInfo();
        this.updateMemoryCount();
        this.updateLoopCount();
        this.updateInventory();
        this.updateEchoIndicator();
        this.renderOptions();
    }

    updateHealthBar() {
        const hpBar = document.getElementById("hp-bar");
        const hpText = document.getElementById("hp-text");
        
        if (hpBar && hpText) {
            hpBar.style.width = `${this.state.hp}%`;
            hpText.textContent = `${this.state.hp} / ${SETTINGS.maxHP}`;

            // Change color based on HP level
            if (this.state.hp < SETTINGS.hpCritical) {
                hpBar.className = "bg-red-600 h-full transition-all duration-300 danger-pulse";
            } else {
                hpBar.className = "bg-gradient-to-r from-red-800 to-red-500 h-full transition-all duration-300";
            }
        }
    }

    updateFearBar() {
        const fearBar = document.getElementById("fear-bar");
        const fearText = document.getElementById("fear-text");

        if (fearBar && fearText) {
            fearBar.style.width = `${this.state.fear}%`;
            fearText.textContent = `${this.state.fear} / ${SETTINGS.maxFear}`;

            if (this.state.fear > 70) {
                fearBar.className = "bg-gradient-to-r from-red-800 to-purple-500 h-full transition-all duration-300 danger-pulse";
            } else {
                fearBar.className = "bg-gradient-to-r from-purple-800 to-indigo-500 h-full transition-all duration-300";
            }
        }
    }

    updateLocationInfo() {
        const room = ROOMS[this.state.currentRoom];
        if (!room) return;

        const locName = document.getElementById("location-name");
        const roomVisual = document.getElementById("room-visual");
        const roomStatus = document.getElementById("room-status-desc");

        if (locName) locName.textContent = room.title;
        if (roomVisual) roomVisual.textContent = room.emoji;
        if (roomStatus) roomStatus.textContent = room.visualDesc;
    }

    updateMemoryCount() {
        const memCount = document.getElementById("memory-count");
        if (memCount) {
            memCount.textContent = this.persistent.memories.length;
        }
    }

    updateLoopCount() {
        const loopCount = document.getElementById("loop-count");
        if (loopCount) {
            loopCount.textContent = Math.max(1, this.persistent.loops);
        }
    }

    updateInventory() {
        const invList = document.getElementById("inventory-list");
        const invCount = document.getElementById("inventory-count-text");

        if (invList && invCount) {
            invCount.textContent = `${this.state.inventory.length} ชิ้น`;

            if (this.state.inventory.length > 0) {
                invList.innerHTML = this.state.inventory.map(id => {
                    const item = ITEMS[id];
                    return `
                        <div class="group relative flex items-center gap-1.5 bg-purple-950/60 border border-purple-500/30 px-2 py-1 rounded-lg text-xs hover:border-yellow-500/50 transition-all cursor-default">
                            <span>${item.icon}</span>
                            <span class="font-medium text-[11px] text-purple-200">${item.name}</span>
                            <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-44 bg-black/95 text-[10px] text-purple-200 p-2 rounded-lg border border-purple-800 opacity-0 group-hover:opacity-100 pointer-events-none z-50 shadow-xl transition-opacity">
                                <b class="text-yellow-400 block mb-0.5">${item.name}</b>
                                ${item.desc}
                            </div>
                        </div>
                    `;
                }).join("");
            } else {
                invList.innerHTML = `<span class="text-xs text-purple-500 italic p-1">ไม่มีไอเทมในกระเป๋า</span>`;
            }
        }
    }

    updateEchoIndicator() {
        const echoEl = document.getElementById("active-echo");
        if (!echoEl) return;

        let activeEcho = "ยังไม่มี Echo พิเศษ";
        
        if (this.state.fear >= 75) {
            activeEcho = "👻 Fear สูง: มองเห็นนิมิตสยองและคำพูดซ่อนเร้น";
        } else if (this.hasMemory("dark_crown")) {
            activeEcho = "👑 Echo มงกุฎมืด: ปลุกสัญชาตญาณปีศาจ";
        } else if (this.hasMemory("lost_drawing")) {
            activeEcho = "🖼️ Echo ภาพวาด: รู้มุมอับเงาบนระเบียง";
        } else if (this.hasMemory("bell")) {
            activeEcho = "🔔 Echo ระฆังดำ: เข้าใจจังหวะวงลูป";
        }

        echoEl.textContent = activeEcho;
    }

    updateProgressUI() {
        const endingCount = document.getElementById("menu-ending-count");
        const unlockedBadge = document.getElementById("unlocked-count-badge");

        if (endingCount) endingCount.textContent = `${this.persistent.endings.length} / ${SETTINGS.maxEndings}`;
        if (unlockedBadge) unlockedBadge.textContent = `${this.persistent.endings.length} / ${SETTINGS.maxEndings}`;

        // Render endings grid
        const endingsGrid = document.getElementById("endings-grid");
        if (endingsGrid) {
            endingsGrid.innerHTML = Object.entries(ENDINGS).map(([id, ending]) => {
                const unlocked = this.hasEnding(id);
                return `
                    <div class="${unlocked ? "bg-purple-950/40 border-yellow-600/40" : "bg-black/40 border-purple-950 opacity-60"} border p-3 rounded-xl flex gap-3 transition-all">
                        <div class="text-2xl">${unlocked ? ending.emoji : "🔒"}</div>
                        <div>
                            <b class="${unlocked ? "text-yellow-400" : "text-purple-500"} block text-xs sm:text-sm">${unlocked ? ending.title : "ยังไม่เปิดเผยรูทนี้"}</b>
                            <span class="text-[10px] text-purple-300 block mt-0.5">${unlocked ? ending.desc : "จงค้นหาวิธีการหลบหนีหรือต่อสู้รูปแบบอื่น"}</span>
                        </div>
                    </div>
                `;
            }).join("");
        }

        // Render memories grid
        const memoriesGrid = document.getElementById("memories-grid");
        if (memoriesGrid) {
            memoriesGrid.innerHTML = Object.entries(MEMORIES).map(([id, memory]) => {
                const unlocked = this.hasMemory(id);
                return `
                    <div class="${unlocked ? "border-yellow-700/40 bg-yellow-950/20" : "border-purple-950 bg-black/40"} border rounded-lg p-2.5">
                        <b class="${unlocked ? "text-yellow-400" : "text-purple-600"} text-xs block">
                            ${unlocked ? "🕯️" : "🔒"} ${unlocked ? memory.title : "ความทรงจำที่ยังเลือนราง"}
                        </b>
                        <p class="text-[10px] text-purple-300 mt-1">${unlocked ? memory.desc : memory.effect}</p>
                    </div>
                `;
            }).join("");
        }
    }

    // ============================================
    // NARRATIVE & LOGGING
    // ============================================

    narrate(text, alert = false) {
        const box = document.getElementById("narrative-container");
        if (!box) return;

        const p = document.createElement("p");
        p.className = `p-3.5 rounded-xl leading-relaxed shadow-sm transition-all ${
            alert 
                ? "bg-red-950/40 border-l-4 border-red-500 text-red-200 font-semibold" 
                : "bg-purple-950/20 border border-purple-900/30 text-purple-100"
        }`;
        p.innerHTML = text;
        box.appendChild(p);

        // Auto-scroll
        setTimeout(() => {
            box.scrollTo({ top: box.scrollHeight, behavior: "smooth" });
        }, 40);
    }

    addLog(msg) {
        const log = document.getElementById("action-log");
        if (log) {
            log.innerHTML = `<span class="text-yellow-400 font-bold">${msg}</span>`;
        }
    }

    triggerShake() {
        document.body.classList.add("shake-effect");
        setTimeout(() => {
            document.body.classList.remove("shake-effect");
        }, 300);
    }

    // ============================================
    // ACTION HANDLING & CHOICE SYSTEM
    // ============================================

    handleChoice(opt) {
        if (this.state.gameEnded) return;

        if (opt.once) {
            this.state.onceEvents[opt.action] = true;
        }

        if (opt.target) {
            this.navigateRoom(opt.target);
            return;
        }

        if (opt.action) {
            this.executeAction(opt.action);
            this.updateUI();
        }
    }

    renderOptions() {
        const box = document.getElementById("options-container");
        if (!box) return;

        box.innerHTML = "";

        if (this.state.gameEnded) {
            box.innerHTML = `
                <button class="w-full bg-gradient-to-r from-red-900 to-red-800 hover:from-red-800 hover:to-red-700 text-white font-bold py-3 rounded-xl text-xs sm:text-sm shadow-lg transition-all flex justify-center items-center gap-2">
                    🔄 <span>เข้าสู่ลูปถัดไป</span>
                </button>
                <button class="w-full bg-purple-950 hover:bg-purple-900 border border-purple-800 text-purple-200 font-bold py-3 rounded-xl text-xs sm:text-sm transition-all">
                    🚪 ย้อนกลับเมนูหลัก
                </button>
            `;
            
            // Add event listeners to the buttons
            box.querySelectorAll("button").forEach((btn, idx) => {
                if (idx === 0) {
                    btn.onclick = () => this.restartGame();
                } else if (idx === 1) {
                    btn.onclick = () => this.navigateScreen("screen-menu");
                }
            });
            
            return;
        }

        const room = ROOMS[this.state.currentRoom];
        if (!room) return;

        room.options.forEach(opt => {
            // Check if option should be shown
            if (opt.once && this.state.onceEvents[opt.action]) return;
            if (opt.requires && !opt.requires.every(id => this.hasMemory(id))) return;
            if (opt.requiresItem && !this.hasItem(opt.requiresItem)) return;

            const isEchoOption = opt.requires || opt.action === "search_chest" || opt.action === "take_holywater";

            const button = document.createElement("button");
            button.className = "w-full text-left bg-gradient-to-r from-purple-950/80 via-purple-900/60 to-purple-950/80 hover:from-red-950/90 hover:to-red-900/80 border border-purple-900/60 hover:border-red-500/60 p-3 sm:p-3.5 rounded-xl text-xs sm:text-sm transition-all flex items-center justify-between group shadow-sm";
            button.innerHTML = `
                <span class="flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                    ${isEchoOption ? '<span class="text-yellow-400">🕯️</span>' : ''}
                    <span>${opt.text}</span>
                </span>
                <span class="text-xs text-purple-400 group-hover:text-red-400 transition-colors">➜</span>
            `;
            button.onclick = () => this.handleChoice(opt);
            box.appendChild(button);
        });
    }

    executeAction(action) {
        // Placeholder - will be overridden by UIController.setupActionHandlers()
        console.warn(`executeAction not properly hooked: ${action}`);
        this.addLog(`⚡ ทำการกระทำ: ${action}`);
    }

    // ============================================
    // GAME FLOW
    // ============================================

    startGame() {
        this.resetGameState();
        this.navigateScreen("screen-game");
        this.navigateRoom("entrance");
        this.updateUI();
    }

    restartGame() {
        this.startGame();
    }

    endGame(text) {
        this.narrate(text, true);
        this.state.gameEnded = true;
        this.renderOptions();
    }

    triggerHint() {
        const room = ROOMS[this.state.currentRoom];
        if (room) {
            this.narrate(`<span class='text-yellow-300 font-semibold'>💡 เสียงกระซิบจากเงามืด:</span> ${room.hint}`);
        }
    }

    // ============================================
    // SETTINGS & PERSISTENCE
    // ============================================

    toggleSound(enabled) {
        this.settings.sound = enabled;
    }

    setTextSpeed(speed) {
        this.settings.textSpeed = Math.max(5, Math.min(50, speed));
    }

    resetGameData() {
        if (confirm("คุณแน่ใจหรือ? วิญญาณที่อยู่ปราสาทจะตายหมด")) {
            localStorage.removeItem(SETTINGS.storageKey);
            this.persistent = { endings: [], memories: [], loops: 0 };
            this.updateProgressUI();
            this.addLog("🔄 ข้อมูลรีเซ็ตแล้ว");
        }
    }
}
