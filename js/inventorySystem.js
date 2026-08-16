// ========== 证据背包系统 ==========
function updateInventoryDisplay(inventory) {
    const container = document.getElementById('inventoryList');
    if (!container) return;
    
    if (!inventory || inventory.length === 0) {
        container.innerHTML = `<p class="hint" style="color:#5a6a7a;">📭 背包为空，继续探索收集证据</p>`;
        return;
    }

    container.innerHTML = inventory.map(item => `
        <div class="inventory-item">
            📦 ${item}
            <span class="badge">证据</span>
        </div>
    `).join('');
}

function updateLog(message) {
    const logEl = document.getElementById('gameLog');
    if (logEl) {
        const time = new Date().toLocaleTimeString();
        logEl.innerHTML = `📌 [${time}] ${message}`;
    }
}