// ========== 游戏主控 ==========
let mailSystem, searchSystem, timeSystem, mapSystem;

document.addEventListener('DOMContentLoaded', function() {
    const mailList = document.getElementById('mailList');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (!mailList || !searchInput || !searchBtn) {
        console.warn('游戏元素未完全加载');
        return;
    }

    try {
        // 1. 时间系统
        timeSystem = new TimeSystem();
        window.timeSystem = timeSystem;
        console.log('✅ TimeSystem 初始化完成');

        // 2. 地图系统
        mapSystem = new MapSystem(timeSystem);
        window.mapSystem = mapSystem;
        console.log('✅ MapSystem 初始化完成');

        // 3. 邮件系统（传入mapSystem用于地点检测）
        mailSystem = new MailSystem(timeSystem, mapSystem);
        window.mailSystem = mailSystem;
        console.log('✅ MailSystem 初始化完成');

        // 4. 搜索系统
        searchSystem = new SearchSystem(mailSystem, timeSystem);
        window.searchSystem = searchSystem;
        console.log('✅ SearchSystem 初始化完成');

        // 5. 背包
        if (typeof updateInventoryDisplay === 'function') {
            updateInventoryDisplay(mailSystem.getInventory());
        }
        
        if (typeof updateLog === 'function') {
            updateLog('🔥 薪火计划启动 · 移动到不同地点探索线索');
        }
        
        // 6. 初始地点触发检查
        setTimeout(() => {
            if (mailSystem) {
                mailSystem.checkLocationTriggers();
                mailSystem.renderMailList();
            }
        }, 500);
        
        console.log('✅ 游戏初始化完成');
    } catch (e) {
        console.error('❌ 游戏初始化失败:', e);
    }
});

window.searchKeyword = function(keyword) {
    const input = document.getElementById('searchInput');
    const btn = document.getElementById('searchBtn');
    if (input && btn) {
        input.value = keyword;
        btn.click();
    }
};

window.updateGameLog = function(message) {
    if (typeof updateLog === 'function') {
        updateLog(message);
    }
};

window.getGameStatus = function() {
    if (timeSystem) {
        return timeSystem.getTimeStatus();
    }
    return null;
};