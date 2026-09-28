/**
 * CONFIG.JS - Game Data Configuration
 * Contains all static game data: ROOMS, ITEMS, MEMORIES, ENDINGS, SETTINGS
 * This file is the single source of truth for game content
 */

// ============================================
// GAME SETTINGS
// ============================================
export const SETTINGS = {
    storageKey: "dracula_what_castle_v22",
    gameTitle: "DRACULA'S WHAT CASTLE?",
    gameVersion: "2.2",
    gameCodename: "An Empty Grimoire",
    legacyStorageKeys: ["dracula_what_castle_v21", "dracula_what_castle_v20", "dracula_what_castle_v16"],
    
    // UI Settings
    textSpeedDefault: 15,
    soundEnabledDefault: true,
    
    // Game Stats
    maxHP: 100,
    maxFear: 100,
    maxEndings: 5,
    
    // Balance
    fearThreshold: 100, // When fear hits this, trigger consequence
    hpCritical: 30,     // When HP drops below this, bar changes color + special dialogue
    fearHighThreshold: 70, // When fear exceeds this, hallucination texts trigger
    
    // Debug/Development
    debugMode: false
};

// ============================================
// ROOMS CONFIGURATION
// ============================================
export const ROOMS = {
    entrance: {
        title: "หน้าประตูปราสาท",
        emoji: "🏰",
        visualDesc: "สายลมหนาวพัดผ่านผืนป่าทึบและความมืดมิด",
        desc: "คุณฟื้นขึ้นหน้าประตูบานยักษ์ของปราสาทแดร็กคิวล่า ประตูเปิดค้างไว้เล็กน้อยราวกับมีบางสิ่งกำลังรอการมาถึงของคุณ",
        hint: "ลองค้นพุ่มหนามด้านข้างก่อนเข้าไป เพื่อหาอาวุธป้องกันตัวเบื้องต้น",
        options: [
            { text: "ผลักประตูเข้าไปในห้องโถงใหญ่", target: "grand_hall" },
            { text: "ค้นพุ่มหนามหาซากของนักล่าคนก่อน", action: "explore_entrance", once: true }
        ]
    },

    grand_hall: {
        title: "ห้องโถงใหญ่",
        emoji: "🏛️",
        visualDesc: "โคมระย้าฝุ่นเขรอะสั่นไหวทั้งที่ไร้สายลม",
        desc: "ประตูปิดลงตามหลังเสียงดังปัง! เสียงระฆังดำก้องกังวานหนึ่งครั้งจากหอคอย บรรยากาศรอบตัวเต็มไปด้วยความกดดัน",
        hint: "ห้องโถงเป็นศูนย์กลาง คุณสามารถไปห้องสมุดเพื่อหาเบาะแส ลงคุกใต้ดินเพื่อหากุญแจและอาวุธ หรือลองเดินผ่านทางเดินกับดักไปยังห้องคลังสมบัติ",
        options: [
            { text: "ขึ้นบันไดวนไปห้องสมุดโบราณ", target: "library" },
            { text: "ลงบันไดหินไปคุกใต้ดิน", target: "dungeon" },
            { text: "เดินเข้าทางเดินแคบด้านหลังบันได", target: "trap_corridor" },
            { text: "สำรวจม่านกำมะหยี่สีแดงกำแพงขวา", action: "explore_hall", once: true },
            { text: "แตะกำแพงหินแล้วหลับตาฟังเสียงระฆัง", action: "listen_bell", requires: ["bell"], once: true }
        ]
    },

    trap_corridor: {
        title: "ทางเดินกับดัก",
        emoji: "🕸️",
        visualDesc: "พื้นหินเรียงตัวไม่สม่ำเสมอ บางแผ่นยวบเมื่อเหยียบ",
        desc: "ทางเดินแคบทอดยาวสู่ความมืด พื้นหินบางจุดมีรอยขีดเป็นกลไกซ่อนอยู่ กลิ่นสนิมเหล็กโชยมาจากปลายทาง",
        hint: "สังเกตพื้นหินให้ดีก่อนก้าวเดิน หากมีกระเทียมติดตัวอาจช่วยพรางกลไกตรวจจับกลิ่นได้",
        options: [
            { text: "ย้อนกลับไปห้องโถงใหญ่", target: "grand_hall" },
            { text: "ก้าวเดินอย่างระมัดระวังผ่านกับดักหอก", action: "trap_spike_corridor", once: true },
            { text: "เดินต่อไปยังห้องคลังสมบัติ", target: "treasure_vault", requires: ["trap_survived"] }
        ]
    },

    treasure_vault: {
        title: "ห้องคลังสมบัติเก่าแก่",
        emoji: "💰",
        visualDesc: "เหรียญทองและเครื่องประดับกระจัดกระจายเต็มพื้น",
        desc: "ห้องเล็กๆ เต็มไปด้วยของมีค่าที่ไม่มีใครแตะต้องมานาน กลางห้องมีหีบไม้ประดับทองคำเรืองแสงอ่อนๆ ราวกับยังมีพลังหลงเหลืออยู่",
        hint: "หีบเรืองแสงนี้ฟื้นพลังให้คุณได้ แต่ใช้ได้เพียงครั้งเดียวต่อการเดินทางหนึ่งรอบเท่านั้น",
        options: [
            { text: "ย้อนกลับไปทางเดินกับดัก", target: "trap_corridor" },
            { text: "เปิดหีบเรืองแสงเพื่อฟื้นพลัง", action: "open_healing_chest", once: true }
        ]
    },

    tower: {
        title: "หอคอยพังทลาย",
        emoji: "🗼",
        visualDesc: "ลมโกรกผ่านรอยแตกของกำแพงหินโบราณ",
        desc: "บันไดวนเก่าแก่นำขึ้นสู่ยอดหอคอยที่พังครึ่งหนึ่ง จากที่นี่มองเห็นป่าทึบรอบปราสาทได้ไกลสุดลูกหูลูกตา ระฆังดำแขวนอยู่กลางหอ",
        hint: "หอคอยเชื่อมกับเสียงระฆังดำที่คุณได้ยินตลอดเกมส์ ลองสำรวจดูว่ามีอะไรซ่อนอยู่",
        options: [
            { text: "ลงบันไดกลับไปห้องสมุด", target: "library" },
            { text: "สำรวจกลไกระฆังดำ", action: "examine_tower_bell", once: true },
            { text: "มองลงไปยังป่าทึบเบื้องล่าง", action: "tower_view", once: true }
        ]
    },

    library: {
        title: "ห้องสมุดโบราณ",
        emoji: "📚",
        visualDesc: "คัมภีร์เก่าฟอนต์ประหลาดกองสูงเฉียดเพดาน",
        desc: "โต๊ะไม้กลางห้องมีไดอารี่หนังเปิดค้างไว้ ผนังฝั่งหนึ่งมีกรอบรูปโบราณผุพังแขวนเอียงอยู่ มุมห้องมีบันไดวนแคบนำขึ้นสู่หอคอย",
        hint: "อ่านไดอารี่เพื่อเข้าใจความลับของลูป ค้นชั้นหนังสือเพื่อหากุญแจเงิน หรือสำรวจกรอบรูปหากมีความทรงจำ",
        options: [
            { text: "เดินกลับลงไปห้องโถงใหญ่", target: "grand_hall" },
            { text: "ขึ้นบันไดวนไปหอคอย", target: "tower" },
            { text: "อ่านบันทึกไดอารี่บนโต๊ะไม้", action: "read_diary", once: true },
            { text: "ค้นซอกชั้นหนังสือเก่าแก่", action: "find_silver_key", once: true },
            { text: "สำรวจกรอบรูปเพื่อดูภาพวาดที่หายไป", action: "examine_drawing", once: true },
            { text: "ค้นช่องลับหลังภาพวาด", action: "find_whip", once: true, requires: ["lost_drawing"] },
            { text: "มองกระจกดำที่ไม่สะท้อนภาพคุณ", action: "black_mirror", requires: ["diary"] }
        ]
    },

    dungeon: {
        title: "คุกใต้ดินอับชื้น",
        emoji: "⛓️",
        visualDesc: "หยดน้ำดังก้องจังหวะสม่ำเสมอเหมือนนาฬิกา",
        desc: "เสียงหายใจครืดคราดดังออกจากความมืด มุมห้องมีหีบไม้ผุผนึกด้วยแถบเงินอย่างหนาแน่น",
        hint: "คุณต้องใช้กุญแจเงิน (หรือความทรงจำตราประทับ) เพื่อเปิดหีบเอาลิ่มไม้ จากนั้นเดินเข้าหาเสียงหายใจเพื่อสู้ศัตรูหากุญแจทอง",
        options: [
            { text: "เดินกลับขึ้นไปห้องโถงใหญ่", target: "grand_hall" },
            { text: "เปิดหีบไม้ผุผนึกเงิน", action: "search_chest", once: true },
            { text: "ก้าวเดินเข้าหาเสียงหายใจในมืด", action: "dungeon_shadow", once: true },
            { text: "ผ่านประตูลับไปโบสถ์", target: "chapel", requiresFlag: "dungeon_secret_open" },
            { text: "ปีนบันไดลับไปสุสาน", target: "dracula_crypt", requiresFlag: "dungeon_secret_open" }
        ]
    },

    chapel: {
        title: "โบสถ์ลับบิดเบี้ยว",
        emoji: "⛪",
        visualDesc: "แท่นบูชาหักพังมีอักขระโบราณขีดเขียนไว้",
        desc: "แม้อากาศจะอับชื้น แต่น้ำมนต์ในอ่างหินอ่อนกลางห้องกลับส่องประกายใสบริสุทธิ์อย่างน่าประหลาด",
        hint: "ตักน้ำมนต์ศักดิ์สิทธิ์เก็บไว้เพื่อรักษา HP และลด Fear หรือใช้ต้านแดร็กคิวล่าตอนสู้",
        options: [
            { text: "เดินย้อนกลับไปคุกใต้ดิน", target: "dungeon" },
            { text: "ตักน้ำมนต์ศักดิ์สิทธิ์ใส่ขวดแก้ว", action: "take_holywater", once: true }
        ]
    },

    dracula_crypt: {
        title: "สุสานใต้ดินแดร็กคิวล่า",
        emoji: "⚰️",
        visualDesc: "โลงหินเย็นจัดแผ่ไอหมอกสีดำจางๆ ออกมา",
        desc: "ร่างของแดร็กคิวล่านอนสงบนิ่งในโลงหิน ด้านหลังมีประตูเหล็กสลักเวทมนตร์นำไปสู่ระเบียงผา",
        hint: "หากมีลิ่มไม้ คุณสามารถสังหารมันขณะหลับได้เลย (Ending 1) หรือหากมีกุญแจทอง ให้เปิดประตูออกไปสู้บนระเบียง",
        options: [
            { text: "ใช้กุญแจทองคำเปิดประตูสู่ระเบียงผา", action: "escape_balcony" },
            { text: "ใช้ลิ่มไม้คาร์เพเทียนตอกอกแดร็กคิวล่า", action: "slay_dracula" },
            { text: "ถวายวิญญาณและคุกเข่าต่อโลงศพ", action: "submit_darkness", requires: ["dark_crown"] },
            { text: "เดินย้อนกลับไปห้องโถงใหญ่", target: "grand_hall" }
        ]
    },

    balcony: {
        title: "ระเบียงผาสูงชัน",
        emoji: "🌙",
        visualDesc: "ดวงจันทร์เต็มดวงส่องกระทบเงาปีศาจที่ลอยอยู่",
        desc: "ประตูปิดล็อกลง! แดร็กคิวล่านิรมิตร่างลอยอยู่กลางอากาศ เสียงลมปะทะขอบผาดังอื้ออึง",
        hint: "ใช้แซ่, น้ำมนต์, ลิ่มไม้ หรือกลยุทธ์จากภาพวาดเพื่อเอาชนะ หากไร้อาวุธ การกระโดดลงเหวอาจเป็นทางเลือกเดียว!",
        options: [
            { text: "เข้าสู้ด้วยอาวุธและของวิเศษที่มี", action: "final_battle" },
            { text: "ตัดสินใจกระโดดลงเหวเบื้องล่าง", action: "jump_cliff" },
            { text: "ฟาดแซ่หนังใส่แดร็กคิวล่าพร้อมประกาศนามนักล่า", action: "use_whip_attack", requiresItem: "whip" },
            { text: "จ้องมองเงาของแดร็กคิวล่าบนพื้น", action: "study_shadow", requires: ["moon_echo"] },
            { text: "ใช้มุมอับจากภาพวาด Lost Drawing กะจังหวะ", action: "use_drawing_tactic", requires: ["lost_drawing"] },
            { text: "ยอมจำนนต่อภาพหลอนแล้วพุ่งเข้าใส่มันแบบไม่คิดชีวิต", action: "fear_reckless_attack", minFear: 70 }
        ]
    }
};

// ============================================
// ITEMS REGISTRY
// ============================================
export const ITEMS = {
    sword: {
        name: "ดาบอัศวินหัก",
        desc: "ถูกผุกร่อนแต่ยังตัดได้ เหมาะสำหรับสู้กับศัตรูอ่อนแอ",
        icon: "🗡️"
    },
    key_silver: {
        name: "กุญแจเงินแก่แค",
        desc: "ปลดล็อกหีบไม้ผุในคุกใต้ดิน เก็บสิ่งของลึกลับไว้",
        icon: "🔑"
    },
    stake: {
        name: "ลิ่มไม้คาร์เพเทียน",
        desc: "อาวุธของนักล่าวัมไพร์โบราณ เทพอย่างแดร็กคิวล่าจะหลับแบบนี้",
        icon: "🪓"
    },
    garlic: {
        name: "กระเทียมแห้ง",
        desc: "โรค่านไม้ที่สาดรุนแรง มีคุณประโยชน์อย่างน้ำมนต์",
        icon: "🧄"
    },
    holywater: {
        name: "น้ำมนต์ศักดิ์สิทธิ์",
        desc: "ฟื้นฟู HP อย่างมากและลด Fear สูงสุด ใช้ได้กับปีศาจ",
        icon: "💧"
    },
    whip: {
        name: "แซ่หนังตระกูลนักล่า",
        desc: "สืบทอดมาจากตระกูลนักล่าไร้นาม ถูกสลักตราบนด้ามจับ",
        icon: "🪢"
    },
    key_gold: {
        name: "กุญแจทองคำลงอักขระ",
        desc: "ปลดล็อกประตูไปยังระเบียงผา ตัดสินใจชีวิตของคุณ",
        icon: "🔑"
    }
};

// ============================================
// MEMORIES / ECHO CATALOG
// ============================================
export const MEMORIES = {
    bell: {
        title: "เสียงระฆังดำ",
        desc: "เสียงดังแต่ละครั้งดูเหมือนดึงคุณกลับมาผ่านเวลา",
        effect: "ช่วยควบคุมจังหวะห้วงลูป"
    },
    diary: {
        title: "บันทึกไดอารี่ลับ",
        desc: "'ปราสาทนี้ไม่เคยเป็นบ้านของแดร็กคิวล่า แต่มันคือคุก!'",
        effect: "ปลดล็อก Black Mirror dialogue"
    },
    lost_drawing: {
        title: "ภาพวาดที่หายไป",
        desc: "ระบุตำแหน่งมุมอับบนระเบียง เดือดร้อนแดร็กคิวล่า",
        effect: "ใช้ยุทธศาสตร์พิเศษบนระเบียง"
    },
    chest: {
        title: "การเปิดหีบที่สำเร็จ",
        desc: "ตราประทับเงินละลายแล้ว เนื้อหาภายในได้เปิดเผย",
        effect: "จำวิธีเปิดหีบได้อีกครั้ง"
    },
    whip_legacy: {
        title: "มรดกตระกูลนักล่า",
        desc: "แซ่นี้ถูกสลักตราตระกูลของนักล่าไร้นาม",
        effect: "พลังสูง ใช้บนระเบียงได้"
    },
    holy_echo: {
        title: "แสงศักดิ์สิทธิ์",
        desc: "น้ำมนต์ชุดยาวเก็บไว้ในตัวคุณอยู่",
        effect: "ลด Fear เพิ่มมากขึ้น ต้านแดร็กคิวล่า"
    },
    moon_echo: {
        title: "ท่าทางจันทร์",
        desc: "เงาของศัตรูสั่นสะท้านเมื่อจันทร์เต็ม",
        effect: "รู้จังหวะว่ำของแดร็กคิวล่า"
    },
    dracula_breath: {
        title: "กระซิบปีศาจ",
        desc: "แดร็กคิวล่ากระซิบชื่อคุณในชั้นสตรี",
        effect: "มันรู้จักคุณมานาน...",
        unlock: "After defeating Dracula"
    },
    fall_echo: {
        title: "ความทรงจำการร่วง",
        desc: "กิ่งสนชุ่มชื้นชะลอความเร็วได้ครั้งแรก",
        effect: "รอดชีวิตจากการกระโดด"
    },
    dark_crown: {
        title: "มงกุฎมืดเรบิริอน",
        desc: "อาจารย์ของแดร็กคิวล่า ปลุกสัญชาตญาณปีศาจ",
        effect: "ปลดล็อก ending ที่มืด"
    },
    trap_survived: {
        title: "ก้าวที่รอดพ้นกับดัก",
        desc: "คุณจำแผ่นหินที่ยวบตัวได้ทุกจุดในทางเดินนั้น",
        effect: "เดินผ่านทางเดินกับดักไปคลังสมบัติได้อย่างปลอดภัย"
    },
    tower_bell: {
        title: "กลไกระฆังดำ",
        desc: "ระฆังนี้ไม่ได้แขวนไว้เฉยๆ แต่เป็นตัวนับจังหวะการวนลูปทั้งหมด",
        effect: "เข้าใจธรรมชาติของห้วงเวลาลึกซึ้งขึ้น"
    }
};

// ============================================
// ENDINGS DATABASE
// ============================================
export const ENDINGS = {
    slay_crypt: {
        id: "slay_crypt",
        title: "ผลักลิ่ม - ศพผุพัง",
        desc: "ตอกแดร็กคิวล่าขณะหลับในโลง พร้อมกระซิบชื่อคุณ",
        emoji: "⚔️",
        category: "combat"
    },
    slay_balcony: {
        id: "slay_balcony",
        title: "ฟาดจันทร์ - ศัตรูสลาย",
        desc: "สำเร็จการสังหารแดร็กคิวล่าบนระเบียงภายใต้จันทร์เต็ม",
        emoji: "🗡️",
        category: "combat"
    },
    escape_items: {
        id: "escape_items",
        title: "วิ่งหลบ - ศักดิ์และมนต์",
        desc: "ใช้อาวุธศักดิ์สิทธิ์หลบเหลือเนื่องออกจากปราสาท",
        emoji: "🚪",
        category: "escape"
    },
    jump_cliff: {
        id: "jump_cliff",
        title: "กระโดด - นก(ต่อ)งาม",
        desc: "กระโดดลงเหวแล้วกระแทกกิ่งสนรอดชีวิต",
        emoji: "🪶",
        category: "escape"
    },
    join_darkness: {
        id: "join_darkness",
        title: "คุกเข่า - เถิดจริต",
        desc: "ยอมรับมงกุฎมืด กลายเป็นจอมปีศาจคนใหม่",
        emoji: "👑",
        category: "secret"
    }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get all rooms as an array
 */
export function getAllRooms() {
    return Object.values(ROOMS);
}

/**
 * Get room by ID
 */
export function getRoom(roomId) {
    return ROOMS[roomId];
}

/**
 * Get item by ID
 */
export function getItem(itemId) {
    return ITEMS[itemId];
}

/**
 * Get memory by ID
 */
export function getMemory(memoryId) {
    return MEMORIES[memoryId];
}

/**
 * Get ending by ID
 */
export function getEnding(endingId) {
    return ENDINGS[endingId];
}

/**
 * Validate room exists
 */
export function isValidRoom(roomId) {
    return roomId in ROOMS;
}

/**
 * Validate item exists
 */
export function isValidItem(itemId) {
    return itemId in ITEMS;
}

/**
 * Validate memory exists
 */
export function isValidMemory(memoryId) {
    return memoryId in MEMORIES;
}
