/**
 * UI.JS - UI Controller & Action Handlers
 * Manages screen navigation, modal interactions, and all game actions
 * Works with GameEngine from core.js
 */

import { ROOMS, ITEMS, MEMORIES, ENDINGS, SETTINGS } from './config.js';

export class UIController {
    constructor(engine) {
        this.engine = engine;
        this.setupEventListeners();
    }

    /**
     * Setup all event listeners for UI interactions
     */
    setupEventListeners() {
        // Menu buttons
        const startBtn = document.getElementById("btn-start-game");
        const howToBtn = document.getElementById("btn-how-to");
        const endingsBtn = document.getElementById("btn-endings");
        const changelogBtn = document.getElementById("btn-changelog");

        if (startBtn) startBtn.onclick = () => this.engine.startGame();
        if (howToBtn) howToBtn.onclick = () => this.engine.navigateScreen("screen-how-to");
        if (endingsBtn) endingsBtn.onclick = () => this.engine.navigateScreen("screen-endings");
        if (changelogBtn) changelogBtn.onclick = () => this.engine.navigateScreen("screen-changelog");

        // Game screen buttons
        const pauseBtn = document.getElementById("btn-pause");
        const hintBtn = document.getElementById("btn-hint");
        const settingsBtn = document.getElementById("btn-settings");

        if (pauseBtn) pauseBtn.onclick = () => this.openModal("modal-pause");
        if (hintBtn) hintBtn.onclick = () => this.engine.triggerHint();
        if (settingsBtn) settingsBtn.onclick = () => this.openModal("modal-settings");

        // Pause menu
        const resumeBtn = document.getElementById("btn-resume");
        const menuBtn = document.getElementById("btn-back-menu");

        if (resumeBtn) resumeBtn.onclick = () => this.closeModal("modal-pause");
        if (menuBtn) menuBtn.onclick = () => {
            this.closeModal("modal-pause");
            this.engine.navigateScreen("screen-menu");
        };

        // Settings modal
        const soundToggle = document.getElementById("sound-toggle");
        const textSpeedSlider = document.getElementById("text-speed-slider");
        const resetBtn = document.getElementById("btn-reset-data");
        const closeSettingsBtn = document.getElementById("btn-close-settings");

        if (soundToggle) {
            soundToggle.checked = this.engine.settings.sound;
            soundToggle.onchange = (e) => this.engine.toggleSound(e.target.checked);
        }

        if (textSpeedSlider) {
            textSpeedSlider.value = this.engine.settings.textSpeed;
            textSpeedSlider.oninput = (e) => this.engine.setTextSpeed(parseInt(e.target.value));
        }

        if (resetBtn) resetBtn.onclick = () => this.engine.resetGameData();
        if (closeSettingsBtn) closeSettingsBtn.onclick = () => this.closeModal("modal-settings");

        // Back buttons from info screens
        const backFromHowTo = document.getElementById("btn-back-from-howto");
        const backFromEndings = document.getElementById("btn-back-from-endings");
        const backFromChangelog = document.getElementById("btn-back-from-changelog");

        if (backFromHowTo) backFromHowTo.onclick = () => this.engine.navigateScreen("screen-menu");
        if (backFromEndings) backFromEndings.onclick = () => this.engine.navigateScreen("screen-menu");
        if (backFromChangelog) backFromChangelog.onclick = () => this.engine.navigateScreen("screen-menu");
    }

    /**
     * Open a modal
     */
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove("hidden");
        }
    }

    /**
     * Close a modal
     */
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add("hidden");
        }
    }

    /**
     * Trigger sound effect (placeholder for future audio system)
     */
    playSound(soundId) {
        if (!this.engine.settings.sound) return;
        // TODO: Implement actual sound playback when audio system is added
        console.log(`Playing sound: ${soundId}`);
    }

    /**
     * Execute game actions based on action ID
     * This is where all action logic lives
     */
    executeGameAction(action) {
        const engine = this.engine;

        switch(action) {
            // ===== ENTRANCE ACTIONS =====
            case "explore_entrance":
                engine.narrate("คุณดึง <strong class='text-yellow-400'>ดาบอัศวินหัก</strong> ออกจากพุ่มหนาม หนามแหลมบาดมือคุณเล็กน้อย");
                engine.adjustHP(-5);
                engine.addItem("sword");
                break;

            // ===== GRAND HALL ACTIONS =====
            case "explore_hall":
                engine.narrate("หลังม่านสีแดง ฝูงค้างคาวมรณะพุ่งออกมาโจมตี! คุณเห็นนิมิตปราสาทซ้อนทับกันนับร้อยชั้น");
                engine.adjustFear(25);
                engine.adjustHP(-10);
                break;

            case "listen_bell":
                engine.narrate("คุณแตะกำแพงหินเย็นจัดแล้วตั้งใจฟังเสียงระฆังดำ <span class='text-yellow-400'>จิตใจคุณสงบลงเมื่อปรับจังหวะหายใจเข้ากับห้วงเวลาลูป</span>");
                engine.adjustFear(-25);
                engine.unlockMemory("bell");
                break;

            // ===== LIBRARY ACTIONS =====
            case "read_diary":
                engine.narrate("หน้าสุดท้ายเขียนไว้ด้วยหมึกสีแดง: <span class='text-indigo-300 italic'>'สิ่งที่อยู่ใต้โลงไม่ใช่ผู้สร้างปราสาท และเมื่อระฆังดัง คนที่ตายจะถูกดึงกลับมาวนเวียน'</span>");
                engine.unlockMemory("diary");
                engine.adjustFear(-15);
                break;

            case "find_silver_key":
                engine.narrate("คุณคลำเจอกุญแจเงินเก่าแก่ในรอยแตกของชั้นหนังสือ");
                engine.addItem("key_silver");
                break;

            case "examine_drawing":
                engine.narrate("คุณปัดฝุ่นออกจากกรอบรูปเก่า ภาพนี้ชื่อ <strong class='text-yellow-400'>Lost Drawing</strong> แสดงระเบียงผายามจันทร์เพ็ญ พร้อมข้อความลายมือสลักว่า: <span class='text-indigo-300 italic'>'เงารัตติกาลมักล้มเหลวในการซ่อนตัวมุมขวาของระเบียง'</span>");
                engine.unlockMemory("lost_drawing");
                break;

            case "find_whip":
                engine.narrate("คุณคลำเจอกลไกซ่อนอยู่หลังภาพวาด อิฐเปิดออกเผยให้เห็น <strong class='text-yellow-400'>แซ่หนังเปียกชื้น</strong> ด้ามจับสลักตราตระกูลนักล่าไร้นาม");
                engine.addItem("whip");
                engine.unlockMemory("whip_legacy");
                break;

            case "black_mirror":
                if (engine.state.fear >= 65) {
                    engine.narrate("<span class='text-red-400 font-bold'>[Mirror Companion]</span> เงาในกระจกบิดเบี้ยวฉีกยิ้มสยอง: <i>'แกวนเวียนในปราสาทนี้จนสมองเลอะเทอะแล้ว... ลองยอมรับความมืดสิ บัลลังก์ใต้ดินยังว่างอยู่นะ!'</i>");
                    engine.adjustFear(20);
                    engine.unlockMemory("dark_crown");
                } else {
                    engine.narrate("<span class='text-indigo-300 font-bold'>[Mirror Companion]</span> เงาในกระจกแตะที่พื้นผิวพร้อมกระซิบ: <i>'หากอยากปราบปีศาจบนระเบียง จงหาแซ่ประจำตระกูลที่ซ่อนอยู่หลังภาพวาด...'</i>");
                    engine.adjustFear(-15);
                    engine.unlockMemory("bell");
                }
                break;

            // ===== DUNGEON ACTIONS =====
            case "search_chest":
                if (engine.hasItem("key_silver") || engine.hasMemory("chest")) {
                    engine.narrate("ตราประทับเงินละลายออก คุณพบ <strong class='text-yellow-400'>ลิ่มไม้คาร์เพเทียน</strong> และ <strong class='text-yellow-400'>กระเทียมแห้ง</strong> ซ่อนอยู่ภายใน!");
                    engine.addItem("stake");
                    engine.addItem("garlic");
                    engine.unlockMemory("chest");
                } else {
                    engine.narrate("หีบถูกผนึกด้วยเงินอย่างแน่นหนา คุณต้องการกุญแจเงินหรือความทรงจำตราประทับเพื่อเปิดมัน");
                }
                break;

            case "dungeon_shadow":
                engine.narrate("ร่างซอมบี้อัศวินพุ่งออกจากความมืดอย่างรวดเร็ว!");
                if (engine.hasItem("sword")) {
                    engine.narrate("คุณใช้ดาบอัศวินหักฟันสู้จนล้มซอมบี้ได้ ดาบหักละเอียด แต่มี <strong class='text-yellow-400'>กุญแจทองคำลงอักขระ</strong> ตกลงมาจากซาก!");
                    engine.removeItem("sword");
                    engine.addItem("key_gold");
                } else {
                    engine.narrate("คุณไม่มีอาวุธในมือ ดิ้นรนเอาชีวิตรอดจนโดนกรงเล็บตะปบไหล่เลือดอาบ!");
                    engine.adjustHP(-30);
                    engine.adjustFear(30);
                    engine.addItem("key_gold");
                }

                // Unlock chapel and crypt options dynamically
                if (!ROOMS.dungeon.options.some(x => x.target === "chapel")) {
                    ROOMS.dungeon.options.push({ text: "ผ่านประตูลลับไปโบสถ์", target: "chapel" });
                }
                if (!ROOMS.dungeon.options.some(x => x.target === "dracula_crypt")) {
                    ROOMS.dungeon.options.push({ text: "ปีนบันไดลับไปสุสาน", target: "dracula_crypt" });
                }
                break;

            // ===== CHAPEL ACTIONS =====
            case "take_holywater":
                engine.narrate("คุณตักน้ำมนต์ใส่ขวดแก้ว น้ำมนต์อุ่นขึ้นทันทีเมื่อสัมผัส");
                engine.addItem("holywater");
                engine.adjustHP(25);
                engine.adjustFear(engine.hasMemory("holy_echo") ? -50 : -35);
                engine.unlockMemory("holy_echo");
                break;

            // ===== CRYPT ACTIONS =====
            case "escape_balcony":
                if (engine.hasItem("key_gold")) {
                    engine.navigateRoom("balcony");
                } else {
                    engine.narrate("ประตูไม่ขยับ! อักขระบนลูกกรงต้องการกุญแจทองคำลงอักขระ");
                }
                break;

            case "slay_dracula":
                if (engine.hasItem("stake")) {
                    engine.unlockEnding("slay_crypt", "คุณตอกลิ่มไม้คาร์เพเทียนปักทะลุอกแดร็กคิวล่า! ร่างมันสลายเป็นเถ้าถ่านพร้อมกระซิบชื่อคุณ...", "dracula_breath");
                } else {
                    engine.narrate("คุณเปิดฝาโลงโดยไม่มีลิ่มไม้ แดร็กคิวล่าลืมตาตาสีแดงฉานพุ่งทำร้ายคุณ!");
                    engine.adjustHP(-45);
                    engine.adjustFear(40);
                }
                break;

            case "submit_darkness":
                engine.unlockEnding("join_darkness", "คุณคุกเข่าต่อหน้าโลงหิน ยอมรับมงกุฎแห่งเงามืด แดร็กคิวล่าส่งยิ้มพึงพอใจก่อนยกร่างให้คุณกลายเป็นจอมปีศาจคนใหม่แห่งปราสาท!", "dark_crown");
                break;

            // ===== BALCONY ACTIONS =====
            case "use_whip_attack":
                engine.narrate("คุณสะบัดแซ่หนังส่งเสียงดังเพียด! แดร็กคิวล่าชะงักผวา: <span class='text-red-400 font-semibold'>'นี่แก... สายเลือดนักล่าไร้นามยังไม่สูญสิ้นหรือ!'</span>");
                if (engine.hasItem("stake")) {
                    engine.unlockEnding("slay_balcony", "คุณใช้แซ่พันธนาการร่างแดร็กคิวล่าแล้วตอกลิ่มไม้เข้ากลางอกมันอย่างแม่นยำ!", "whip_legacy");
                } else if (engine.hasItem("holywater")) {
                    engine.unlockEnding("escape_items", "คุณฟาดแซ่เปิดช่องและสาดน้ำมนต์ใส่หน้ามันเต็มรักจนเปิดทางหนีสำเร็จ!", "holy_echo");
                } else {
                    engine.narrate("แดร็กคิวล่าคำรามก้อง สลัดแซ่หลุดและพุ่งกรงเล็บเข้าใส่!");
                    engine.adjustHP(-35);
                }
                break;

            case "final_battle":
                engine.narrate(`แดร็กคิวล่าลอยตัวขึ้นพลางหัวเราะ: <span class='text-red-400'>'แกวนเวียนตายในปราสาทข้ามาแล้ว <b>${engine.persistent.loops}</b> รอบ! ยังไม่ยอมแพ้อีกหรือ?'</span>`);
                
                if (engine.hasItem("holywater") && engine.hasItem("garlic")) {
                    engine.unlockEnding("escape_items", "คุณใช้กระเทียมถ่วงจังหวะและสาดน้ำมนต์จนร่างเงามืดถอยร่น เปิดทางหนีสำเร็จ", "holy_echo");
                } else if (engine.hasItem("stake")) {
                    engine.unlockEnding("slay_balcony", "คุณแทงลิ่มไม้คาร์เพเทียนเข้ากลางอกแดร็กคิวล่าจนร่างมันแตกสลายใต้แสงจันทร์", "moon_echo");
                } else {
                    engine.adjustHP(-100);
                }
                break;

            case "use_drawing_tactic":
                engine.narrate("คุณนึกถึงภาพวาด Lost Drawing พุ่งตัวไปมุมขวาของระเบียง เงาแดร็กคิวล่าเสียจังหวะเปิดช่องโหว่!");
                engine.adjustFear(-20);
                
                if (engine.hasItem("stake")) {
                    engine.unlockEnding("slay_balcony", "คุณแทงลิ่มไม้เข้ากลางอกแดร็กคิวล่าจากมุมอับได้อย่างแม่นยำ!", "moon_echo");
                } else if (engine.hasItem("holywater")) {
                    engine.unlockEnding("escape_items", "คุณสาดน้ำมนต์เข้ากลางหน้าแดร็กคิวล่าแล้วฉวยโอกาสหนี!", "holy_echo");
                } else {
                    this.executeGameAction("jump_cliff");
                }
                break;

            case "jump_cliff":
                if (engine.hasMemory("fall_echo") || Math.random() > 0.4) {
                    engine.unlockEnding("jump_cliff", "คุณกระแทกกิ่งสนกลางทาง ช่วยชะลอความเร็วและรอดชีวิตออกจากปราสาทอย่างเหลือเชื่อ!", "fall_echo");
                } else {
                    engine.narrate("ร่างของคุณกระแทกโขดหินด้านล่างผาสูงชัน...");
                    engine.adjustHP(-100);
                }
                break;

            case "study_shadow":
                engine.narrate("คุณจ้องมองเงาบนพื้นหิน เงานั้นหันกลับมามองคุณก่อนตัวจริง!");
                engine.adjustFear(-20);
                engine.unlockMemory("moon_echo");
                break;

            default:
                console.warn(`Unknown action: ${action}`);
        }
    }

    /**
     * Override engine's executeAction to use our UI handlers
     */
    setupActionHandlers() {
        const originalExecute = this.engine.executeAction.bind(this.engine);
        this.engine.executeAction = (action) => {
            this.executeGameAction(action);
        };
    }
}

/**
 * Initialize everything on page load
 */
export function initializeGame() {
    // Create game engine instance
    window.engine = window.engine || new (require('./core.js').GameEngine)();
    
    // Create UI controller and link it to engine
    window.ui = new UIController(window.engine);
    window.ui.setupActionHandlers();
    
    // Initialize engine
    window.engine.init();
    
    // Show menu screen
    window.engine.navigateScreen("screen-menu");
}
