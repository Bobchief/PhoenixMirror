// ========== 路线图系统 ==========
class MapSystem {
    constructor(timeSystem) {
        this.timeSystem = timeSystem;
        this.locations = [];
        this.connections = [];
        this.currentLocation = 'classroom';
        this.mapContainer = document.getElementById('mapCanvas');
        this.locationDisplay = document.getElementById('currentLocation');
        
        // 从GAME_DATA加载
        this.loadData();
        this.renderMap();
        this.updateLocationDisplay();
        
        document.addEventListener('languageChanged', () => {
            this.renderMap();
            this.updateLocationDisplay();
        });
    }

    loadData() {
        this.locations = Object.values(GAME_DATA.locations);
        this.connections = GAME_DATA.connections;
    }

    renderMap() {
        const container = this.mapContainer;
        if (!container) return;
        
        const currentDay = this.timeSystem ? this.timeSystem.currentDay : 1;
        
        // 更新解锁状态
        this.locations.forEach(loc => {
            loc.unlocked = currentDay >= loc.unlockDay;
        });
        
        let html = '';
        const lang = window.getLang ? window.getLang() : 'zh';
        const t = window.t || ((key) => key);
        
        // 绘制连线
        this.connections.forEach(conn => {
            const from = this.locations.find(l => l.id === conn.from);
            const to = this.locations.find(l => l.id === conn.to);
            if (from && to) {
                const isActive = from.unlocked && to.unlocked;
                const isCurrent = from.id === this.currentLocation || to.id === this.currentLocation;
                html += `<div style="position:absolute; left:${Math.min(from.x, to.x)}%; top:${Math.min(from.y, to.y)}%; width:${Math.abs(from.x - to.x)}%; height:${Math.abs(from.y - to.y)}%; pointer-events:none; z-index:1;">
                    <svg style="width:100%; height:100%; position:absolute; top:0; left:0;">
                        <line x1="0" y1="0" x2="100%" y2="100%" 
                              stroke="${isActive ? (isCurrent ? '#ff8844' : '#2a4a5a') : '#1a2a3a'}" 
                              stroke-width="${isCurrent ? '3' : '2'}" 
                              stroke-dasharray="${isActive ? '' : '4,4'}"
                              style="opacity:${isActive ? '1' : '0.3'};"/>
                    </svg>
                </div>`;
            }
        });
        
        // 绘制节点
        this.locations.forEach(loc => {
            const isCurrent = loc.id === this.currentLocation;
            const isUnlocked = loc.unlocked;
            const color = isCurrent ? '#ff6b35' : (isUnlocked ? '#66cc88' : '#4a5a6a');
            const size = isCurrent ? 28 : (isUnlocked ? 22 : 18);
            const name = t(`loc${loc.id.charAt(0).toUpperCase() + loc.id.slice(1)}`) || loc.name;
            
            let clickAttr = '';
            if (isUnlocked) {
                clickAttr = `onclick="window.mapSystem.moveTo('${loc.id}')"`;
            }
            
            html += `
                <div ${clickAttr}
                     style="position:absolute; left:${loc.x-2}%; top:${loc.y-2}%; z-index:10; cursor:${isUnlocked ? 'pointer' : 'not-allowed'}; 
                            transition:all 0.3s; transform:translate(-50%, -50%);"
                     title="${isUnlocked ? '移动到 ' + name : '🔒 需要第' + loc.unlockDay + '天'}">
                    <div style="width:${size}px; height:${size}px; border-radius:50%; background:${color}; 
                                border:2px solid ${isCurrent ? '#ff8844' : (isUnlocked ? '#2a4a5a' : '#1a2a3a')};
                                box-shadow: ${isCurrent ? '0 0 20px rgba(255,107,53,0.4)' : 'none'};
                                display:flex; align-items:center; justify-content:center; margin:0 auto;">
                        ${isCurrent ? '📍' : (isUnlocked ? '●' : '🔒')}
                    </div>
                    <div style="color:${color}; font-size:${isCurrent ? '11px' : '9px'}; text-align:center; margin-top:2px; font-weight:${isCurrent ? 'bold' : 'normal'}; 
                                text-shadow:0 0 8px rgba(0,0,0,0.8); white-space:nowrap;">
                        ${name}
                        ${isCurrent ? '' : (isUnlocked ? '' : ' 🔒')}
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        this.updateLocationDisplay();
    }

    moveTo(locationId) {
        const loc = this.locations.find(l => l.id === locationId);
        if (!loc) return;
        if (!loc.unlocked) {
            alert(`🔒 此地点尚未解锁（需要第${loc.unlockDay}天）`);
            return;
        }
        if (locationId === this.currentLocation) {
            alert('📍 你已经在这里了。');
            return;
        }
        
        // 查找路径
        const connection = this.connections.find(c => 
            (c.from === this.currentLocation && c.to === locationId) ||
            (c.to === this.currentLocation && c.from === locationId)
        );
        
        if (!connection) {
            alert('🚫 没有直接路径到达该地点。');
            return;
        }
        
        const cost = connection.cost;
        const locName = this.getLocationName(locationId);
        
        // 检查时间
        if (!this.timeSystem) {
            this.currentLocation = locationId;
            this.renderMap();
            this.updateLocationDisplay();
            // 触发地点检查
            this.triggerLocationCheck();
            return;
        }
        
        if (this.timeSystem.timeRemaining < cost) {
            alert(`⏰ 时间不足！需要${cost}，剩余${this.timeSystem.timeRemaining}`);
            this.timeSystem.timeRemaining = 0;
            this.timeSystem.updateDisplay();
            this.timeSystem.checkPeriodEnd();
            return;
        }
        
        if (confirm(`📍 移动到「${locName}」？\n\n消耗时间：${cost}`)) {
            this.timeSystem.spendTime(cost);
            this.currentLocation = locationId;
            this.renderMap();
            this.updateLocationDisplay();
            updateLog(`📍 移动到「${locName}」（消耗${cost}时间）`);
            
            // 触发地点检查（检查是否有新邮件/事件）
            this.triggerLocationCheck();
        }
    }

    // ===== 移动后触发地点检查 =====
    triggerLocationCheck() {
        // 通知邮件系统检查地点触发
        if (window.mailSystem) {
            setTimeout(() => {
                window.mailSystem.checkLocationTriggers();
                window.mailSystem.renderMailList();
                updateLog(`📍 已到达「${this.getLocationName(this.currentLocation)}」，检查新线索...`);
            }, 300);
        }
    }

    updateLocationDisplay() {
        const loc = this.locations.find(l => l.id === this.currentLocation);
        if (this.locationDisplay && loc) {
            const name = this.getLocationName(loc.id);
            this.locationDisplay.textContent = `📍 当前位置：${name}`;
        }
    }

    getCurrentLocation() {
        return this.currentLocation;
    }

    getLocationName(id) {
        const loc = this.locations.find(l => l.id === id);
        if (!loc) return id;
        const t = window.t || ((key) => key);
        return t(`loc${id.charAt(0).toUpperCase() + id.slice(1)}`) || loc.name;
    }

    getPathCost(targetId) {
        const connection = this.connections.find(c => 
            (c.from === this.currentLocation && c.to === targetId) ||
            (c.to === this.currentLocation && c.from === targetId)
        );
        return connection ? connection.cost : null;
    }

    isLocationUnlocked(locationId) {
        const loc = this.locations.find(l => l.id === locationId);
        return loc ? loc.unlocked : false;
    }
}