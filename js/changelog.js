/**
 * CHANGELOG - Dracula's What Castle?
 * ประวัติเวอร์ชั่น ฟีเจอร์ การแก้บั๊ก การปรับสมดุล และเครดิต
 */

export const CHANGELOG = {
    "2.2": {
        date: "2024-09-28",
        codename: "An Empty Grimoire",
        title: "เสถียรภาพและความปลอดภัย",
        description: "รอบนี้เน้นความมั่นคงของระบบเป็นหลัก ไม่ได้เพิ่มเนื้อหาเกมส์ใหม่ ปิดช่องโหว่เรื่องข้อมูลบันทึก ทางลับที่รั่วข้ามลูป และการกดซ้ำ พร้อมเพิ่มชุดทดสอบเดินเกมอัตโนมัติ",
        features: [
            "🧪 ชุดทดสอบเดินเกมอัตโนมัติ 25 รายการ (ตรวจห้อง ปุ่ม ทั้ง 5 ชะตากรรม และกรณีข้อมูลพัง) รันด้วย node tests/playthrough.test.mjs",
            "♻️ ย้ายข้อมูลบันทึกจากเวอร์ชั่นเก่า (v1.6 / v2.0 / v2.1) มาใช้ต่อได้อัตโนมัติ",
            "🪟 หน้าต่างยืนยันการรีเซ็ตข้อมูลของเกมเอง (แทนกล่องยืนยันของเบราว์เซอร์) และกด ESC เพื่อปิดหน้าต่างได้",
            "🏷️ เลขเวอร์ชั่นบนหัวเว็บและท้ายหน้าดึงจาก SETTINGS จุดเดียว ไม่ต้องแก้ HTML ทุกครั้งที่อัปเดต"
        ],
        bugfixes: [
            "แก้ทางลับในคุกใต้ดินที่รั่วข้ามลูป (เดิมเขียนทับข้อมูลห้องใน config ตรงๆ ตอนนี้ใช้ flag ที่รีเซ็ตทุกลูป)",
            "ข้อมูลบันทึกที่เสียหายหรือถูกแก้ไขไม่ทำให้เกมค้างอีกต่อไป: กรองเฉพาะ id ที่เกมรู้จัก ตรวจชนิดข้อมูล จำกัดค่า loops และเก็บสำรองไฟล์ที่เสียไว้",
            "แจ้งเตือนผู้เล่นเมื่อบันทึกไม่ได้ (เช่น โหมดส่วนตัว) แทนที่จะเงียบแล้วข้อมูลหาย",
            "กันการกดปุ่มซ้ำรัวๆ ระหว่างประมวลผล และตัวเลือกแบบครั้งเดียวจะถูกนับก็ต่อเมื่อ action ทำงานสำเร็จจริง",
            "ปุ่มรีเซ็ตข้อมูลล้างสถานะเกมที่กำลังเล่นด้วย และกลับหน้าเมนู (เดิมล้างแค่ข้อมูลถาวร)",
            "แก้ป้ายเวอร์ชั่นบนหัวเว็บและท้ายหน้าที่ค้างเป็น v2.0 มาตั้งแต่ v2.1",
            "ลบบรรทัดใน changelog v2.1 ที่เขียนว่าเพิ่มระดับความยากของ ending ทั้งที่ยังไม่ได้ทำ"
        ],
        improvements: [
            "เพิ่ม Content-Security-Policy และ referrer policy ใน HTML จำกัดแหล่งสคริปต์ที่โหลดได้",
            "ตรวจเงื่อนไขของตัวเลือกด้วยฟังก์ชันเดียวกันทั้งตอนวาดปุ่มและตอนกดจริง ลดโอกาสสองที่ทำงานไม่ตรงกัน",
            "มี error handling ครอบการประมวลผลตัวเลือก เกิดข้อผิดพลาดแล้วเกมยังเล่นต่อได้"
        ],
        balance: [],
        credits: [
            "พัฒนาโดย: ท่านหลอด"
        ],
        knownIssues: [
            "ยังไม่ได้ทดสอบบนเบราว์เซอร์จริง: ชุดทดสอบใช้ DOM จำลอง ตรวจตรรกะเกมได้แต่ไม่ครอบคลุมหน้าตา/CSS และ CSP ที่เพิ่มเข้าไปอาจกระทบการโหลด Tailwind หรือฟอนต์ ถ้าหน้าเว็บเพี้ยนให้แจ้งได้เลย",
            "ยังไม่ได้ทำ ending difficulty, ending routes clarity, กับดักเพิ่มเติม และห้องใหม่ (เลื่อนไปเวอร์ชั่นถัดไป)"
        ]
    },

    "2.1": {
        date: "2024-09-20",
        codename: "Insane Forest",
        title: "ปรับปรุงฟอนต์ เนื้อเรื่อง และสมดุลเกมส์",
        description: "ปรับฟอนต์ให้อ่านง่ายขึ้น แก้ไขข้อความซ้ำซ้อน เพิ่มห้องและกลไกใหม่ในปราสาท พร้อมปรับสมดุลความยากให้ยุติธรรมมากขึ้น",
        features: [
            "🔤 เปลี่ยนฟอนต์หัวข้อทั่วไปเป็น Thasadith (คง Cinzel ไว้เฉพาะชื่อเกมส์แถบบนสุด)",
            "🔤 เปลี่ยนฟอนต์เนื้อหาเป็น Google Sans Flex",
            "🏚️ เพิ่มห้องใหม่ในปราสาท พร้อมกับดักและอุปสรรค",
            "💰 เพิ่มหีบสมบัติฟื้นพลัง ใช้ได้ครั้งเดียวต่อลูป",
            "🧠 Memory unlock มี narrative feedback ชัดเจนขึ้น",
            "❤️ แจ้งเตือนพิเศษเมื่อ HP ต่ำกว่า 30",
            "👻 Fear ระดับสูงทำให้เกิดข้อความหลอนตา ไม่ใช่แค่ลด HP",
            "🔁 บทสนทนาของแดร็กคิวล่าเปลี่ยนไปตามจำนวนลูปที่วนมาแล้ว",
            "🔀 ตัวเลือกในเกมส์เปลี่ยนแบบไดนามิกตามไอเทมและสถานะ Fear"
        ],
        bugfixes: [
            "แก้คำว่า \"ปลดล็อค Endings\" ที่มี \"/ 5\" ซ้ำกันสองครั้ง",
            "เปลี่ยนหัวข้อหน้า Endings เป็น \"ชะตากรรม\"",
            "ซิงค์ persistent state กับ localStorage ทุกครั้งที่มีการเปลี่ยนแปลง ป้องกันข้อมูลหาย",
            "ตรวจสอบเงื่อนไข requires/requiresItem ก่อน execute action ทุกครั้ง"
        ],
        balance: [
            "ปรับค่าความเสียหาย HP ให้ยุติธรรมขึ้น ลดความโหดของบางจุด",
            "ปรับลำดับการค้นพบไอเทมให้เป็นธรรมชาติมากขึ้น ไม่สุ่มเดา"
        ],
        credits: [
            "พัฒนาโดย: ท่านหลอด",
            "ธีมป่าคลุ้มคลั่งและปราสาทที่ขยายใหญ่ขึ้น"
        ]
    },

    "2.0": {
        date: "2024-09-19",
        codename: "The Floating New Sanctuary",
        title: "ปรับโครงสร้างโค้ดใหม่ทั้งหมด",
        description: "ปรับปรุงสถาปัตยกรรมเพื่อความง่ายในการดูแลและขยายต่อ แยกข้อมูลเกมส์ออกจากลอจิก แยก UI เป็นตัวควบคุมเฉพาะ และจัดระเบียบ CSS ด้วยตัวแปร",
        features: [
            "🏗️ สถาปัตยกรรมแบบโมดูล - แยก config, core logic และ UI ออกจากกัน",
            "📦 โครงสร้าง 6 ไฟล์ (HTML + JS + CSS) แบ่งหน้าที่ชัดเจน",
            "🎵 ระบบ Changelog แบบถาวร (เก็บประวัติทุกเวอร์ชั่นไว้ตลอด)",
            "🔧 StateManager แยกการจัดการ state ให้เป็นระเบียบ",
            "🎨 ดึง CSS variables ออกมาเพื่อความสม่ำเสมอของธีม",
            "📱 ปรับปรุงการแสดงผลบนมือถือให้ดีขึ้น",
            "⚙️ บันทึกการตั้งค่าแบบถาวรผ่าน SETTINGS config",
            "🧠 รวมข้อมูลเกมส์ไว้ที่ config.js ที่เดียว"
        ],
        bugfixes: [
            "จัดระเบียบโค้ดใหม่ ป้องกันการเขียนทับข้อมูลโดยไม่ตั้งใจ",
            "ปรับปรุงการจัดการ localStorage key (ย้ายไปอยู่ใน SETTINGS)",
            "แยกส่วน UI กับ logic ออกจากกันชัดเจนขึ้น"
        ],
        balance: [],
        improvements: [
            "ดูแลรักษาโค้ดง่ายขึ้นมาก",
            "เพิ่มห้อง/ไอเทมใหม่ทำได้แค่แก้ config.js ไฟล์เดียว",
            "โครงสร้างแบบโมดูลทำให้เพิ่มฟีเจอร์ใหม่ในอนาคตง่ายขึ้น"
        ],
        credits: [
            "พัฒนาโดย: ท่านหลอด (คอนเทนต์ครีเอเตอร์)",
            "แรงบันดาลใจด้านสถาปัตยกรรมจากหลัก Clean Code",
            "แรงบันดาลใจธีมจากซีรีส์ Castlevania"
        ],
        technical: {
            filesCount: 6,
            linesOfCode: "~2,080 บรรทัด (จัดระเบียบแล้ว)",
            modules: ["โครงสร้าง HTML", "Changelog", "Config", "Core Engine", "UI Controller", "Theme CSS"],
            approach: "แนวทาง YAGNI - ทำเท่าที่จำเป็น ไม่ over-engineer"
        }
    },

    "1.6": {
        date: "2024-09-18",
        codename: "Dance of Silver",
        title: "ปรับโครงสร้าง GameEngine และคุณภาพชีวิตผู้เล่น",
        description: "เริ่มใช้ GameEngine class เพื่อจัดระเบียบโค้ดให้ดีขึ้น เพิ่มระบบตั้งค่า ระบบคำใบ้ และปรับเงื่อนไขปลดล็อก ending ที่ 5",
        features: [
            "🎯 GameEngine class - ตัวควบคุมเกมส์หลักเพียงตัวเดียว",
            "⚙️ หน้าต่างตั้งค่า - ปรับความเร็วข้อความและเปิด/ปิดเสียง",
            "💡 ระบบคำใบ้ - เคล็ดลับเฉพาะแต่ละห้อง",
            "🏆 ปลดล็อก ending ที่ 5 (จากเดิม 4 เป็น 5)",
            "🕯️ ปรับปรุงการแสดงผล Echo Indicator",
            "🎨 ขัดเกลา UI และแอนิเมชันให้สวยขึ้น",
            "📱 ปรับ layout มือถือให้ดีขึ้น (responsive grid)",
            "⏸️ เพิ่มเมนูหยุดเกมส์ชั่วคราว"
        ],
        bugfixes: [
            "แก้ HP bar ไม่อัปเดตบนมือถือ",
            "แก้ fear bar แสดงผลผิดเพี้ยนบนหน้าจอแคบ",
            "ปรับปรุง responsive breakpoint สำหรับแท็บเล็ต",
            "แก้ปัญหา modal backdrop filtering"
        ],
        balance: [
            "ปรับค่าความกลัวจาก dungeon_shadow (+10)",
            "เพิ่มความช่วยเหลือของระบบคำใบ้",
            "ปรับจังหวะเกมส์ให้เหมาะกับผู้เล่นใหม่มากขึ้น"
        ],
        credits: [
            "พัฒนาโดย: ท่านหลอด",
            "ปรับสมดุลและรับฟีดแบ็กเรื่อง UX มาปรับปรุง"
        ]
    },

    "1.5": {
        date: "2024-09-15",
        codename: "Wicked Children",
        title: "เวอร์ชั่นเปิดตัวครั้งแรก",
        description: "เวอร์ชั่นเสถียรตัวแรกพร้อมกลไกเกมส์หลัก ระบบ Echo Memory และ ending เริ่มต้น 4 แบบ",
        features: [
            "🦇 เกมส์เล่าเรื่องหลัก - สำรวจปราสาทแดร็กคิวล่า",
            "🧠 ระบบ Echo Memory - สิ่งที่ค้นพบคงอยู่ข้ามลูป",
            "🏆 4 endings หลัก - แบบหลบหนีและแบบต่อสู้",
            "📖 คู่มือวิธีการเล่น",
            "🔔 ระบบ feedback ภาพและเสียง",
            "📊 ติดตามสถิติ (HP, Fear, จำนวนลูป, ความทรงจำ)",
            "🎨 ธีมกอทิกมืดด้วยฟอนต์ Cinzel และ Mitr"
        ],
        bugfixes: [],
        balance: [
            "ปรับสมดุลความยากเบื้องต้น",
            "ปรับค่าสถิติ HP และ Fear"
        ],
        credits: [
            "พัฒนาโดย: ท่านหลอด",
            "แรงบันดาลใจจาก: ซีรีส์ Castlevania (Symphony of the Night ฯลฯ)",
            "ธีม: สยองขวัญกอทิกผสมเรื่องราววนลูปเวลา"
        ]
    }
};

/**
 * ดึงเวอร์ชั่นล่าสุด
 */
export function getCurrentVersion() {
    return Object.keys(CHANGELOG)[0]; // เวอร์ชั่นล่าสุดคือ key แรก
}

/**
 * ดึงข้อมูลของเวอร์ชั่นที่ระบุ
 */
export function getVersionInfo(versionNumber) {
    return CHANGELOG[versionNumber] || null;
}

/**
 * แปลงข้อมูล changelog เป็น HTML สำหรับแสดงผล
 */
export function formatChangelogHTML(versionNumber) {
    const version = CHANGELOG[versionNumber];
    if (!version) return "<p>ไม่พบข้อมูลเวอร์ชั่นนี้</p>";

    let html = `
        <div class="changelog-entry">
            <h3 class="text-lg font-bold text-purple-300 mb-2">
                v${versionNumber} - ${version.title}
                <span class="text-sm text-yellow-400 ml-2">"${version.codename}"</span>
            </h3>
            <p class="text-xs text-purple-400 mb-3">เผยแพร่: ${version.date}</p>
            <p class="text-sm text-purple-200 mb-3">${version.description}</p>
    `;

    if (version.features && version.features.length > 0) {
        html += `<div class="mb-3">
            <h4 class="font-semibold text-green-400 mb-1">✨ ฟีเจอร์ใหม่:</h4>
            <ul class="text-xs text-purple-300 space-y-0.5 ml-3">
                ${version.features.map(f => `<li>• ${f}</li>`).join("")}
            </ul>
        </div>`;
    }

    if (version.bugfixes && version.bugfixes.length > 0) {
        html += `<div class="mb-3">
            <h4 class="font-semibold text-blue-400 mb-1">🐛 แก้บั๊ก:</h4>
            <ul class="text-xs text-purple-300 space-y-0.5 ml-3">
                ${version.bugfixes.map(f => `<li>• ${f}</li>`).join("")}
            </ul>
        </div>`;
    }

    if (version.improvements && version.improvements.length > 0) {
        html += `<div class="mb-3">
            <h4 class="font-semibold text-cyan-400 mb-1">⚡ ปรับปรุง:</h4>
            <ul class="text-xs text-purple-300 space-y-0.5 ml-3">
                ${version.improvements.map(i => `<li>• ${i}</li>`).join("")}
            </ul>
        </div>`;
    }

    if (version.balance && version.balance.length > 0) {
        html += `<div class="mb-3">
            <h4 class="font-semibold text-orange-400 mb-1">⚖️ ปรับสมดุล:</h4>
            <ul class="text-xs text-purple-300 space-y-0.5 ml-3">
                ${version.balance.map(b => `<li>• ${b}</li>`).join("")}
            </ul>
        </div>`;
    }

    if (version.knownIssues && version.knownIssues.length > 0) {
        html += `<div class="mb-3">
            <h4 class="font-semibold text-yellow-400 mb-1">⚠️ ข้อจำกัดที่ทราบ:</h4>
            <ul class="text-xs text-purple-300 space-y-0.5 ml-3">
                ${version.knownIssues.map(k => `<li>• ${k}</li>`).join("")}
            </ul>
        </div>`;
    }

    if (version.credits && version.credits.length > 0) {
        html += `<div class="mb-3">
            <h4 class="font-semibold text-red-400 mb-1">❤️ เครดิต:</h4>
            <ul class="text-xs text-purple-300 space-y-0.5 ml-3">
                ${version.credits.map(c => `<li>• ${c}</li>`).join("")}
            </ul>
        </div>`;
    }

    html += `</div>`;
    return html;
}
