// ========== 语言系统 ==========
const LANG = {
    zh: {
        // 通用
        gameTitle: '🔥 PHOENIX · MIRROR',
        gameSub: '—— 薪火 · 镜界 ——',
        confirmReset: '🔄 确定要重新开始吗？所有进度将被清除。',
        resetSuccess: '✅ 游戏已重置！一切从头开始。',
        
        // 界面
        mapTitle: '🗺️ 校园路线图',
        mailTitle: '📨 情报终端',
        searchTitle: '🔍 密码学搜索',
        inventoryTitle: '🎒 证据背包',
        mapHint: '💡 点击节点移动 · 消耗时间',
        timeWarning: '⚡ 时间紧张！移动消耗时间，规划路线',
        
        // 地点
        locClassroom: '教室',
        locLibrary: '图书馆',
        locCafeteria: '食堂',
        locLab: '实验楼',
        locOffice: '行政楼',
        locDorm: '宿舍',
        locGate: '校门',
        locCourtyard: '庭院',
        
        // 导航
        navHome: '📋 总览',
        navCh1: '📖 第一章',
        navCh2: '📖 第二章',
        navCh3: '📖 第三章',
        
        // 按钮
        btnHelp: '📖 说明',
        btnReset: '🔄 重新开始',
        btnSearch: '解析',
        btnStart: '🔥 开始调查',
        
        // 时间
        timeMorning: '上午',
        timeAfternoon: '下午',
        timeEvening: '晚上',
        timeDay: '第',
        timeDaySuffix: '天',
        timeRemain: '剩余',
        
        // 邮件
        mailToday: '今日新邮件',
        mailRead: '已读邮件',
        mailLocked: '锁定中',
        mailUnlock: '天解锁',
        mailReadTag: '已读',
        mailNoData: '📭 没有可用的事件或邮件',
        mailNoDataHint: '继续推进时间，解锁更多内容',
        
        // 事件
        eventReal: '可做之事',
        eventFake: '其他信息',
        eventClick: '点击事件可执行（消耗时间）',
        eventComplete: '完成',
        eventCost: '消耗时间',
        eventReward: '获得',
        eventFakeNote: '你获得了一些信息，但不确定是否可靠...',
        
        // 搜索
        searchPlaceholder: '输入关键词或密文...',
        searchNoInput: '⚠️ 请输入关键词',
        searchNoResult: '❓ 没有找到关于「{keyword}」的线索',
        searchTry: '试试搜索：',
        searchDecrypt: '解密结果',
        searchNewClue: '发现新线索',
        searchFakeNote: '这条信息需要进一步验证...',
        
        // 移动
        moveTo: '移动到',
        moveCost: '消耗',
        moveConfirm: '📍 确定要移动到「{loc}」吗？\n\n消耗时间：{cost}',
        moveSuccess: '📍 移动到「{loc}」（消耗{cost}时间）',
        moveNotEnough: '⏰ 时间不足！需要{cost}，剩余{remain}',
        moveNightEnd: '🌙 晚上时间不足，将进入第二天。',
        
        // 结局
        endingDeath: '💀 死亡轮回',
        endingSurvive: '⚔️ 真相大白',
        endingAssimilate: '🔵 蓝色精英'
    },
    en: {
        // Common
        gameTitle: '🔥 PHOENIX · MIRROR',
        gameSub: '—— Phoenix · Mirror ——',
        confirmReset: '🔄 Are you sure you want to restart? All progress will be lost.',
        resetSuccess: '✅ Game reset! Start from scratch.',
        
        // UI
        mapTitle: '🗺️ Campus Map',
        mailTitle: '📨 Intelligence Terminal',
        searchTitle: '🔍 Cryptography Search',
        inventoryTitle: '🎒 Evidence Backpack',
        mapHint: '💡 Click nodes to move · Costs time',
        timeWarning: '⚡ Time is tight! Movement costs time, plan your route',
        
        // Locations
        locClassroom: 'Classroom',
        locLibrary: 'Library',
        locCafeteria: 'Cafeteria',
        locLab: 'Lab Building',
        locOffice: 'Admin Building',
        locDorm: 'Dormitory',
        locGate: 'School Gate',
        locCourtyard: 'Courtyard',
        
        // Navigation
        navHome: '📋 Overview',
        navCh1: '📖 Chapter 1',
        navCh2: '📖 Chapter 2',
        navCh3: '📖 Chapter 3',
        
        // Buttons
        btnHelp: '📖 Help',
        btnReset: '🔄 Reset',
        btnSearch: 'Search',
        btnStart: '🔥 Start Investigation',
        
        // Time
        timeMorning: 'Morning',
        timeAfternoon: 'Afternoon',
        timeEvening: 'Evening',
        timeDay: 'Day ',
        timeDaySuffix: '',
        timeRemain: 'Remaining',
        
        // Mail
        mailToday: "Today's New Mail",
        mailRead: 'Read Mail',
        mailLocked: 'Locked',
        mailUnlock: 'day unlock',
        mailReadTag: 'Read',
        mailNoData: '📭 No events or mail available',
        mailNoDataHint: 'Continue advancing time to unlock more content',
        
        // Events
        eventReal: 'Available Actions',
        eventFake: 'Other Information',
        eventClick: 'Click event to execute (costs time)',
        eventComplete: 'Completed',
        eventCost: 'Time cost',
        eventReward: 'Reward',
        eventFakeNote: 'You got some information, but its reliability is uncertain...',
        
        // Search
        searchPlaceholder: 'Enter keyword or cipher...',
        searchNoInput: '⚠️ Please enter a keyword',
        searchNoResult: '❓ No clues found for "{keyword}"',
        searchTry: 'Try searching:',
        searchDecrypt: 'Decryption Result',
        searchNewClue: 'New clue discovered',
        searchFakeNote: 'This information needs further verification...',
        
        // Movement
        moveTo: 'Move to',
        moveCost: 'Cost',
        moveConfirm: '📍 Move to "{loc}"?\n\nTime cost: {cost}',
        moveSuccess: '📍 Moved to "{loc}" (cost {cost} time)',
        moveNotEnough: '⏰ Not enough time! Need {cost}, remaining {remain}',
        moveNightEnd: '🌙 Not enough time at night, moving to next day.',
        
        // Endings
        endingDeath: '💀 Death Loop',
        endingSurvive: '⚔️ Truth Revealed',
        endingAssimilate: '🔵 Blue Elite'
    }
};

// 当前语言
let currentLang = 'zh';

function getLang() {
    return currentLang;
}

function setGameLanguage(lang) {
    if (LANG[lang]) {
        currentLang = lang;
        localStorage.setItem('xinhuo_lang', lang);
        // 触发语言更新事件
        document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: lang } }));
        // 更新所有界面文本
        updateUIText(lang);
    }
}

function t(key, params = {}) {
    const dict = LANG[currentLang] || LANG.zh;
    let text = dict[key] || key;
    // 替换参数
    for (const [k, v] of Object.entries(params)) {
        text = text.replace(`{${k}}`, v);
    }
    return text;
}

function updateUIText(lang) {
    const dict = LANG[lang] || LANG.zh;
    
    // 更新所有带 data-i18n 属性的元素
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (dict[key]) {
            el.textContent = dict[key];
        }
    });
    
    // 更新特定元素
    const map = {
        'gameTitle': dict.gameTitle,
        'gameSub': dict.gameSub,
        'mapTitle': dict.mapTitle,
        'mailTitle': dict.mailTitle,
        'searchTitle': dict.searchTitle,
        'inventoryTitle': dict.inventoryTitle,
        'mapHint': dict.mapHint,
        'timeWarning': dict.timeWarning,
        'navHome': dict.navHome,
        'navCh1': dict.navCh1,
        'navCh2': dict.navCh2,
        'navCh3': dict.navCh3,
        'btnHelp': dict.btnHelp,
        'btnReset': dict.btnReset,
        'btnSearch': dict.btnSearch,
        'startBtn': dict.btnStart,
        'searchPlaceholder': dict.searchPlaceholder
    };
    
    for (const [id, text] of Object.entries(map)) {
        const el = document.getElementById(id);
        if (el) {
            if (id === 'searchPlaceholder') {
                el.placeholder = text;
            } else {
                el.textContent = text;
            }
        }
    }
    
    // 更新搜索按钮
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) searchBtn.textContent = dict.btnSearch;
    
    // 更新开始按钮
    const startBtn = document.getElementById('startGameBtn');
    if (startBtn) startBtn.textContent = dict.btnStart;
}

// 暴露给全局
window.LANG = LANG;
window.t = t;
window.getLang = getLang;
window.setGameLanguage = setGameLanguage;
window.updateUIText = updateUIText;