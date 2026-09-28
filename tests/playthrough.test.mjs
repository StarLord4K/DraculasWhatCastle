// ทดสอบเดินเกมอัตโนมัติ — รันด้วย: node tests/playthrough.test.mjs
// ใช้ DOM จำลองแบบเบา (ไม่ต้องติดตั้งแพ็กเกจ) พอสำหรับตรวจตรรกะเกม ไม่ได้ทดสอบหน้าตา/CSS

import assert from "node:assert/strict";

// ---------- DOM จำลอง ----------
function makeEl(id) {
    const el = {
        id, children: [], style: {}, _cls: new Set(), textContent: "", _html: "", onclick: null,
        classList: {
            add: (...c) => c.forEach(x => el._cls.add(x)),
            remove: (...c) => c.forEach(x => el._cls.delete(x)),
            contains: x => el._cls.has(x),
        },
        set className(v) { el._cls = new Set(String(v).split(/\s+/).filter(Boolean)); },
        get className() { return [...el._cls].join(" "); },
        set innerHTML(v) { el._html = v; if (v === "") el.children = []; },
        get innerHTML() { return el._html; },
        appendChild(c) { el.children.push(c); return c; },
        querySelectorAll: () => [],
        scrollTo() {},
    };
    return el;
}
const els = {};
globalThis.document = {
    title: "",
    getElementById: id => (els[id] ??= makeEl(id)),
    createElement: () => makeEl("btn"),
    querySelectorAll: () => [],
    addEventListener() {},
    body: makeEl("body"),
};
let store = {};
globalThis.localStorage = {
    getItem: k => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: k => { delete store[k]; },
};
globalThis.window = globalThis;
globalThis.setTimeout = fn => { try { fn(); } catch {} return 0; };
globalThis.console = { ...console, warn() {}, log() {} };

const { GameEngine } = await import("../js/core.js");
const { UIController } = await import("../js/ui.js");
const { ROOMS, ITEMS, MEMORIES, ENDINGS, SETTINGS } = await import("../js/config.js");

let passed = 0, failed = 0;
const failures = [];
async function test(name, fn) {
    try { store = {}; await fn(); passed++; console.info(`  ✅ ${name}`); }
    catch (e) { failed++; failures.push(name); console.info(`  ❌ ${name}\n     ${e.message}`); }
}
function newGame() {
    const engine = new GameEngine();
    const ui = new UIController(engine);
    ui.setupActionHandlers();
    engine.init();
    engine.startGame();
    return { engine, ui };
}
// เลือกตัวเลือกด้วยข้อความบางส่วน/ action / target
function pick(engine, match) {
    const room = ROOMS[engine.state.currentRoom];
    const opt = room.options.find(o => o.action === match || o.target === match);
    assert.ok(opt, `ไม่พบตัวเลือก "${match}" ในห้อง ${engine.state.currentRoom}`);
    assert.ok(engine.isOptionAvailable(opt), `ตัวเลือก "${match}" ยังใช้ไม่ได้ในสถานะนี้`);
    engine.handleChoice(opt);
}

console.info("\n=== โครงสร้างข้อมูล (config) ===");
await test("ทุก target ของทุกห้องชี้ไปห้องที่มีอยู่จริง", () => {
    for (const [rid, r] of Object.entries(ROOMS))
        for (const o of r.options)
            if (o.target) assert.ok(ROOMS[o.target], `${rid} → ${o.target} ไม่มีอยู่`);
});
await test("ทุก requires/requiresItem อ้างถึงความทรงจำ/ไอเทมที่มีจริง", () => {
    for (const [rid, r] of Object.entries(ROOMS))
        for (const o of r.options) {
            (o.requires || []).forEach(m => assert.ok(MEMORIES[m], `${rid}: memory "${m}" ไม่มี`));
            if (o.requiresItem) assert.ok(ITEMS[o.requiresItem], `${rid}: item "${o.requiresItem}" ไม่มี`);
        }
});
await test("ทุกห้องเข้าถึงได้จากห้องเริ่มต้น (BFS รวมทางลับ)", () => {
    const seen = new Set(["entrance"]), q = ["entrance"];
    while (q.length) for (const o of ROOMS[q.shift()].options)
        if (o.target && !seen.has(o.target)) { seen.add(o.target); q.push(o.target); }
    // balcony เข้าผ่าน action escape_balcony ไม่ใช่ target
    seen.add("balcony");
    for (const rid of Object.keys(ROOMS)) assert.ok(seen.has(rid), `ห้อง ${rid} ไปไม่ถึง`);
});
await test("ค่าเวอร์ชั่นใน SETTINGS เป็น 2.2 / An Empty Grimoire", () => {
    assert.equal(SETTINGS.gameVersion, "2.2");
    assert.equal(SETTINGS.gameCodename, "An Empty Grimoire");
});

console.info("\n=== เส้นทางเดินเกมจริง ===");
await test("เส้นทางชนะ: ดาบ→คุก→กุญแจทอง→สุสาน→ตอกลิ่ม (ending slay_crypt)", () => {
    const { engine } = newGame();
    pick(engine, "explore_entrance");            // ได้ดาบ
    pick(engine, "grand_hall");
    pick(engine, "library");
    pick(engine, "find_silver_key");             // กุญแจเงิน
    pick(engine, "grand_hall");
    pick(engine, "dungeon");
    pick(engine, "search_chest");                // ลิ่มไม้ + กระเทียม
    pick(engine, "dungeon_shadow");              // กุญแจทอง + เปิดทางลับ
    assert.ok(engine.hasItem("stake") && engine.hasItem("key_gold"));
    pick(engine, "dracula_crypt");               // ทางลับต้องโผล่
    pick(engine, "slay_dracula");
    assert.ok(engine.hasEnding("slay_crypt"));
    assert.ok(engine.state.gameEnded);
});
await test("ทางลับ dungeon ไม่รั่วข้ามลูป (ไม่แก้ config)", () => {
    const before = ROOMS.dungeon.options.length;
    const { engine } = newGame();
    pick(engine, "explore_entrance");
    pick(engine, "grand_hall"); pick(engine, "dungeon");
    pick(engine, "dungeon_shadow");
    assert.equal(ROOMS.dungeon.options.length, before, "config ถูกแก้ระหว่างเล่น");
    engine.startGame();                          // ลูปใหม่
    assert.equal(engine.hasFlag("dungeon_secret_open"), false, "flag ค้างข้ามลูป");
    engine.navigateRoom("dungeon");
    const secret = ROOMS.dungeon.options.find(o => o.target === "dracula_crypt");
    assert.equal(engine.isOptionAvailable(secret), false, "ทางลับเปิดค้างข้ามลูป");
});
await test("ending กระโดดผา (fall_echo) ปลดล็อกได้และบันทึกลง localStorage", () => {
    const { engine } = newGame();
    engine.unlockMemory("fall_echo");
    engine.navigateRoom("balcony");
    pick(engine, "jump_cliff");
    assert.ok(engine.hasEnding("jump_cliff"));
    const saved = JSON.parse(localStorage.getItem(SETTINGS.storageKey));
    assert.ok(saved.endings.includes("jump_cliff"));
});
await test("ending คุกเข่ายอมมืด (join_darkness) ต้องมี dark_crown", () => {
    const { engine } = newGame();
    engine.navigateRoom("dracula_crypt");
    const opt = ROOMS.dracula_crypt.options.find(o => o.action === "submit_darkness");
    assert.equal(engine.isOptionAvailable(opt), false);
    engine.unlockMemory("dark_crown");
    assert.equal(engine.isOptionAvailable(opt), true);
    engine.handleChoice(opt);
    assert.ok(engine.hasEnding("join_darkness"));
});
await test("ending หนีด้วยน้ำมนต์+กระเทียม (escape_items) ที่ระเบียง", () => {
    const { engine } = newGame();
    engine.addItem("holywater"); engine.addItem("garlic");
    engine.navigateRoom("balcony");
    pick(engine, "final_battle");
    assert.ok(engine.hasEnding("escape_items"));
});
await test("ending ฆ่าที่ระเบียง (slay_balcony) ด้วยลิ่มไม้", () => {
    const { engine } = newGame();
    engine.addItem("stake");
    engine.navigateRoom("balcony");
    pick(engine, "final_battle");
    assert.ok(engine.hasEnding("slay_balcony"));
});
await test("ครบทั้ง 5 ending ปลดล็อกได้จริง (เล่นทีละเส้นทางแล้วนับจาก persistent)", () => {
    const all = new Set();
    const run = (setup, room, action) => {
        const { engine } = newGame();
        setup(engine);
        engine.navigateRoom(room);
        const opt = ROOMS[room].options.find(o => o.action === action);
        assert.ok(engine.isOptionAvailable(opt), `${action} ใช้ไม่ได้`);
        engine.handleChoice(opt);
        engine.persistent.endings.forEach(e => all.add(e));
    };
    run(e => e.addItem("stake"), "dracula_crypt", "slay_dracula");
    run(e => e.addItem("stake"), "balcony", "final_battle");
    run(e => { e.addItem("holywater"); e.addItem("garlic"); }, "balcony", "final_battle");
    run(e => e.unlockMemory("fall_echo"), "balcony", "jump_cliff");
    run(e => e.unlockMemory("dark_crown"), "dracula_crypt", "submit_darkness");
    assert.deepEqual([...all].sort(), Object.keys(ENDINGS).sort(), "ending ที่ปลดล็อกได้ไม่ครบ");
});

console.info("\n=== ห้องใหม่ กับดัก และหีบสมบัติ ===");
await test("กับดัก+คลังสมบัติ: หีบฟื้นพลังใช้ได้ครั้งเดียวต่อลูป", () => {
    const { engine } = newGame();
    engine.state.hp = 30;
    engine.navigateRoom("treasure_vault");
    pick(engine, "open_healing_chest");
    assert.ok(engine.state.hp > 30, "ไม่ได้ฟื้นพลัง");
    const chest = ROOMS.treasure_vault.options.find(o => o.action === "open_healing_chest");
    assert.equal(engine.isOptionAvailable(chest), false, "หีบเปิดซ้ำได้ในลูปเดียว");
    engine.startGame(); engine.navigateRoom("treasure_vault");
    assert.equal(engine.isOptionAvailable(chest), true, "ลูปใหม่ควรเปิดหีบได้อีก");
});
await test("หอคอยเข้าได้จากห้องสมุด และย้อนกลับได้", () => {
    const { engine } = newGame();
    pick(engine, "grand_hall"); pick(engine, "library"); pick(engine, "tower");
    assert.equal(engine.state.currentRoom, "tower");
    pick(engine, "library");
});

console.info("\n=== เสถียรภาพและความปลอดภัย ===");
await test("บล็อกตัวเลือกที่เงื่อนไขไม่ผ่านแม้ถูกเรียกตรง (ข้าม UI)", () => {
    const { engine } = newGame();
    engine.navigateRoom("balcony");
    const whip = ROOMS.balcony.options.find(o => o.action === "use_whip_attack");
    const hpBefore = engine.state.hp;
    engine.handleChoice(whip);                   // ไม่มีแซ่
    assert.equal(engine.state.hp, hpBefore);
    assert.equal(engine.state.gameEnded, false);
});
await test("กดตัวเลือกหลังจบเกมแล้วไม่ทำอะไร", () => {
    const { engine } = newGame();
    engine.addItem("stake"); engine.navigateRoom("dracula_crypt"); pick(engine, "slay_dracula");
    const n = engine.persistent.endings.length;
    engine.handleChoice({ action: "slay_dracula" });
    assert.equal(engine.persistent.endings.length, n);
});
await test("ข้อมูลบันทึกเสียหาย (JSON พัง) → เริ่มใหม่ได้และเก็บสำรองไว้", () => {
    localStorage.setItem(SETTINGS.storageKey, "{ไม่ใช่json");
    const { engine } = newGame();
    assert.deepEqual(engine.persistent.endings, []);
    assert.ok(localStorage.getItem(SETTINGS.storageKey + "_corrupt_backup"));
});
await test("ข้อมูลบันทึกที่ถูกแก้ไข: กรอง id แปลกปลอม/ชนิดผิด/ค่า loops เพี้ยน", () => {
    localStorage.setItem(SETTINGS.storageKey, JSON.stringify({
        endings: ["slay_crypt", "hack<script>", 42, "slay_crypt"],
        memories: ["bell", "__proto__", { x: 1 }],
        loops: "9e99"
    }));
    const { engine } = newGame();
    assert.deepEqual(engine.persistent.endings, ["slay_crypt"]);
    assert.deepEqual(engine.persistent.memories, ["bell"]);
    assert.ok(Number.isFinite(engine.persistent.loops) && engine.persistent.loops <= 1000000);
});
await test("ข้อมูลบันทึกเป็นชนิดผิด (array/null/string) ไม่ทำเกมพัง", () => {
    for (const bad of ["[]", "null", '"text"', "123"]) {
        store = {}; localStorage.setItem(SETTINGS.storageKey, bad);
        const { engine } = newGame();
        assert.deepEqual(engine.persistent.endings, []);
    }
});
await test("migrate ข้อมูลจาก key เวอร์ชั่นเก่า (v2.1) มาใช้ต่อได้", () => {
    localStorage.setItem("dracula_what_castle_v21", JSON.stringify({ endings: ["jump_cliff"], memories: ["bell"], loops: 4 }));
    const { engine } = newGame();
    assert.ok(engine.hasEnding("jump_cliff") && engine.hasMemory("bell"));
    assert.ok(localStorage.getItem(SETTINGS.storageKey), "ควรบันทึกเป็น key ใหม่");
});
await test("localStorage ใช้ไม่ได้ (โหมดส่วนตัว/ปิดการเก็บข้อมูล) เกมยังเล่นได้", () => {
    const realSet = localStorage.setItem, realGet = localStorage.getItem;
    localStorage.setItem = () => { throw new Error("QuotaExceeded"); };
    localStorage.getItem = () => { throw new Error("SecurityError"); };
    const { engine } = newGame();
    engine.unlockMemory("bell");
    assert.ok(engine.hasMemory("bell"));
    localStorage.setItem = realSet; localStorage.getItem = realGet;
});
await test("รีเซ็ตข้อมูล: ล้าง persistent + state และไม่มีข้อมูลเก่าค้าง", () => {
    const { engine } = newGame();
    engine.unlockMemory("bell"); engine.addItem("stake");
    engine.resetGameData();
    assert.deepEqual(engine.persistent.memories, []);
    assert.deepEqual(engine.state.inventory, []);
});
await test("HP หมด → จบเกม ไม่ติดลบ และ HP ไม่เกินค่าสูงสุด", () => {
    const { engine } = newGame();
    engine.adjustHP(-9999);
    assert.equal(engine.state.hp, 0); assert.ok(engine.state.gameEnded);
    const g = newGame().engine; g.adjustHP(9999);
    assert.equal(g.state.hp, SETTINGS.maxHP);
});
await test("Fear ไม่ติดลบ/ไม่เกิน 100 และการแตกสติลด Fear ลงมาที่ 55", () => {
    const { engine } = newGame();
    engine.adjustFear(-500); assert.equal(engine.state.fear, 0);
    engine.adjustFear(500);  assert.ok(engine.state.fear <= SETTINGS.maxFear);
    assert.equal(engine.state.fear, 55);
});
await test("escapeHTML กันแท็กแปลกปลอม", () => {
    const { engine } = newGame();
    assert.equal(engine.escapeHTML('<img src=x onerror=alert(1)>"\''),
        "&lt;img src=x onerror=alert(1)&gt;&quot;&#39;");
});
await test("once ไม่ถูก mark เมื่อ action พัง (โยน error กลางทาง)", () => {
    const { engine } = newGame();
    engine.executeAction = () => { throw new Error("boom"); };
    const opt = { text: "x", action: "explore_entrance", once: true };
    engine.handleChoice(opt);
    assert.equal(engine.state.onceEvents.explore_entrance, undefined);
    assert.equal(engine._busy, false, "ล็อกกดซ้ำค้าง");
});

console.info(`\nผลรวม: ผ่าน ${passed} / ล้มเหลว ${failed}`);
if (failed) { console.info("ที่ล้มเหลว:", failures.join(" | ")); process.exit(1); }
