// ========== 情报邮件系统 ==========
class MailSystem {
    constructor(timeSystem, mapSystem) {
        this.timeSystem = timeSystem;
        this.mapSystem = mapSystem;
        this.mails = GAME_DATA.mails;
        this.currentMail = null;
        this.mailListEl = document.getElementById('mailList');
        this.mailDetailEl = document.getElementById('mailDetail');
        this.inventory = [...GAME_DATA.initialInventory];
        this.readMails = new Set(this.timeSystem.readMails || []);
        this.completedEvents = new Set(this.timeSystem.completedEvents || []);
        this.fakeCluesCollected = [];
        this.triggeredMails = new Set(); // 已触发的邮件
        
        // 绑定方法
        this.renderMailList = this.renderMailList.bind(this);
        this.showMailDetail = this.showMailDetail.bind(this);
        this.executeEvent = this.executeEvent.bind(this);
        this.setupHighlightClick = this.setupHighlightClick.bind(this);
        this.addToInventory = this.addToInventory.bind(this);
        this.displayMailContent = this.displayMailContent.bind(this);
        this.checkLocationTriggers = this.checkLocationTriggers.bind(this);
        
        // 初始渲染
        this.renderMailList();
        this.checkLocationTriggers();
    }

    // ===== 检查当前位置触发的邮件 =====
    checkLocationTriggers() {
        const currentDay = this.timeSystem.currentDay;
        const currentLoc = this.mapSystem ? this.mapSystem.getCurrentLocation() : 'classroom';
        
        // 查找当前地点可触发的邮件（未读且已到天数）
        const availableMails = this.mails.filter(m => 
            m.location === currentLoc &&
            m.dayUnlock <= currentDay &&
            !this.readMails.has(m.id) &&
            !this.triggeredMails.has(m.id)
        );
        
        if (availableMails.length > 0) {
            // 自动触发邮件
            availableMails.forEach(mail => {
                this.triggeredMails.add(mail.id);
                // 在日志中提示
                const locName = this.mapSystem ? this.mapSystem.getLocationName(currentLoc) : currentLoc;
                updateLog(`📨 你在${locName}发现了新邮件：「${mail.subject}」`);
            });
            this.renderMailList();
        }
    }

    // ===== 渲染邮件列表（地点过滤） =====
    renderMailList() {
        const currentDay = this.timeSystem.currentDay;
        const currentLoc = this.mapSystem ? this.mapSystem.getCurrentLocation() : 'classroom';
        
        // 获取当前地点可触发的邮件
        const locationMails = this.mails.filter(m => 
            m.location === currentLoc && 
            m.dayUnlock <= currentDay &&
            !this.readMails.has(m.id)
        );
        
        // 已读邮件（全部显示）
        const readMails = this.mails.filter(m => this.readMails.has(m.id));
        
        // 其他地点的邮件（锁定状态）
        const otherMails = this.mails.filter(m => 
            m.location !== currentLoc && 
            m.dayUnlock <= currentDay &&
            !this.readMails.has(m.id)
        );
        
        // 未来邮件
        const futureMails = this.mails.filter(m => m.dayUnlock > currentDay);
        
        let html = '';
        const lang = window.getLang ? window.getLang() : 'zh';
        const t = window.t || ((key) => key);
        
        // ===== 当前地点新邮件 =====
        if (locationMails.length > 0) {
            html += `<div style="color:#66ff88; font-size:0.85rem; margin-bottom:8px;">📍 当前位置：${this.mapSystem ? this.mapSystem.getLocationName(currentLoc) : currentLoc}</div>`;
            html += `<div style="color:#ffcc66; font-size:0.85rem; margin-bottom:8px;">📨 可查看邮件 (${locationMails.length})：</div>`;
            html += locationMails.map(mail => `
                <div class="mail-item" data-id="${mail.id}" style="cursor:pointer; border-left-color:#ffcc66;">
                    <span class="mail-sender">✉️ ${mail.sender}</span>
                    <span class="mail-subject">${mail.subject}</span>
                    <span class="mail-date">${mail.date}</span>
                    <span class="time-cost">⏱ ${mail.timeCost}</span>
                    <span style="color:#66cc88; font-size:0.6rem; margin-left:6px;">📍 当前地点</span>
                </div>
            `).join('');
        }
        
        // ===== 每日事件（地点过滤） =====
        const dailyEvents = GAME_DATA.dailyEvents[currentDay] || [];
        const locationEvents = dailyEvents.filter(e => 
            e.location === currentLoc && 
            !this.completedEvents.has(e.id)
        );
        
        if (locationEvents.length > 0) {
            const realEvents = locationEvents.filter(e => !e.isFake);
            const fakeEvents = locationEvents.filter(e => e.isFake);
            
            if (realEvents.length > 0) {
                html += `<div style="color:#66cc88; font-size:0.85rem; margin:12px 0 8px 0;">📋 ${t('eventReal')} (${realEvents.length})：</div>`;
                html += realEvents.map(e => `
                    <div class="mail-item" data-event="${e.id}" style="border-left-color:#66cc88; cursor:pointer;">
                        <span class="mail-sender">📌 ${e.name}</span>
                        <span class="mail-date">⏱ ${e.timeCost}</span>
                        <span style="color:#5a7a8a; font-size:0.7rem;">${e.desc.substring(0, 25)}...</span>
                        ${e.reward ? `<span style="color:#ffcc66; font-size:0.65rem; margin-left:4px;">🎁 ${e.reward}</span>` : ''}
                        <span style="color:#4488ff; font-size:0.6rem; margin-left:6px;">📍 当前地点</span>
                    </div>
                `).join('');
            }
            
            if (fakeEvents.length > 0) {
                html += `<div style="color:#6a7a8a; font-size:0.75rem; margin:8px 0; text-align:center;">— — — ${t('eventFake')} — — —</div>`;
                html += fakeEvents.map(e => `
                    <div style="background:#0f0f1a; padding:6px 12px; border-radius:4px; margin-bottom:4px; border-left:2px solid #4a5a6a; font-size:0.8rem; color:#6a7a8a; cursor:pointer;" 
                         class="mail-item" data-event="${e.id}">
                        ⚡ ${e.name} · ⏱ ${e.timeCost}
                        <span style="font-size:0.7rem; display:block; color:#5a6a7a;">${e.desc}</span>
                        <span style="color:#4488ff; font-size:0.6rem;">📍 当前地点</span>
                    </div>
                `).join('');
            }
        }
        
        // ===== 其他地点的邮件（提示移动） =====
        if (otherMails.length > 0) {
            html += `<div style="color:#5a7a8a; font-size:0.8rem; margin:12px 0 8px 0;">🔍 其他地点的线索：</div>`;
            const groupedByLocation = {};
            otherMails.forEach(m => {
                if (!groupedByLocation[m.location]) groupedByLocation[m.location] = [];
                groupedByLocation[m.location].push(m);
            });
            for (const [locId, mails] of Object.entries(groupedByLocation)) {
                const locName = this.mapSystem ? this.mapSystem.getLocationName(locId) : locId;
                html += `<div style="background:#0f0f1a; padding:4px 10px; border-radius:4px; margin-bottom:4px; border-left:2px solid #4a5a6a; font-size:0.75rem; color:#6a7a8a;">
                    📍 去「${locName}」可解锁 ${mails.length} 封邮件
                    <span style="color:#ff8844; font-size:0.65rem;">（需要移动）</span>
                </div>`;
            }
        }
        
        // ===== 已读邮件 =====
        if (readMails.length > 0) {
            html += `<div style="color:#5a7a8a; font-size:0.85rem; margin:12px 0 8px 0;">📖 ${t('mailRead')}：</div>`;
            html += readMails.map(mail => `
                <div class="mail-item" data-id="${mail.id}" style="opacity:0.7; border-left-color:#5a6a7a; cursor:pointer;">
                    <span class="mail-sender">✉️ ${mail.sender}</span>
                    <span class="mail-subject">${mail.subject}</span>
                    <span class="mail-date">${mail.date}</span>
                    <span style="color:#5a7a8a; font-size:0.7rem;">✅ ${t('mailReadTag')}</span>
                </div>
            `).join('');
        }
        
        // ===== 未来邮件 =====
        if (futureMails.length > 0) {
            const nextDay = Math.min(...futureMails.map(m => m.dayUnlock));
            html += `<div style="color:#5a7a8a; font-size:0.85rem; margin:12px 0 8px 0;">🔒 ${t('mailLocked')}：</div>`;
            html += futureMails.filter(m => m.dayUnlock === nextDay).map(mail => `
                <div class="mail-item" style="opacity:0.4; border-left-color:#4a5a6a; cursor:not-allowed;">
                    <span class="mail-sender">🔒 ${mail.sender}</span>
                    <span class="mail-subject">${mail.subject}</span>
                    <span class="mail-date">第${mail.dayUnlock}天 · ${this.mapSystem ? this.mapSystem.getLocationName(mail.location) : mail.location}</span>
                    <span style="color:#5a7a8a; font-size:0.7rem;">⏱ ${mail.timeCost}</span>
                </div>
            `).join('');
        }
        
        if (html === '') {
            html = `<div style="color:#5a7a8a; padding:20px; text-align:center;">
                📭 当前地点没有可用的内容<br>
                <span style="font-size:0.85rem;">💡 移动到其他地点探索更多线索</span>
            </div>`;
        }
        
        this.mailListEl.innerHTML = html;

        // ===== 绑定事件点击 =====
        this.mailListEl.querySelectorAll('.mail-item[data-event]').forEach(el => {
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                const eventId = el.dataset.event;
                this.executeEvent(eventId);
            });
        });

        // ===== 绑定邮件点击 =====
        this.mailListEl.querySelectorAll('.mail-item[data-id]').forEach(el => {
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(el.dataset.id);
                if (!isNaN(id)) {
                    this.showMailDetail(id);
                }
            });
        });
    }

    // ===== 执行事件（检查地点） =====
    executeEvent(eventId) {
        const currentDay = this.timeSystem.currentDay;
        const events = GAME_DATA.dailyEvents[currentDay] || [];
        const event = events.find(e => e.id === eventId);
        
        if (!event) return;
        if (this.completedEvents.has(eventId)) return;
        
        // 检查是否在正确地点
        const currentLoc = this.mapSystem ? this.mapSystem.getCurrentLocation() : 'classroom';
        if (event.location !== currentLoc) {
            const locName = this.mapSystem ? this.mapSystem.getLocationName(event.location) : event.location;
            alert(`📍 需要移动到「${locName}」才能执行此事件！`);
            return;
        }
        
        if (!this.timeSystem.spendTime(event.timeCost)) {
            alert(`⏰ 时间不足！需要${event.timeCost}，剩余${this.timeSystem.timeRemaining}`);
            return;
        }
        
        this.completedEvents.add(eventId);
        if (this.timeSystem) {
            this.timeSystem.completedEvents = Array.from(this.completedEvents);
            this.timeSystem.saveGame();
        }
        
        // 显示结果
        let resultHtml = `
            <div style="background:#0a0a14; padding:20px; border-radius:10px; line-height:2;">
                <p style="color:${event.isFake ? '#ff8844' : '#66cc88'};">${event.isFake ? '⚠️' : '✅'} 完成：${event.name}</p>
                <hr style="border-color:#2a2a3a; margin:8px 0;">
                <p style="color:#aabbcc;">${event.desc}</p>
        `;
        
        if (event.isFake) {
            resultHtml += `<div style="margin-top:8px; color:#ff8844; font-style:italic; border-top:1px solid #2a2a3a; padding-top:8px;">
                📌 你获得了一些信息，但不确定是否可靠...
            </div>`;
            this.fakeCluesCollected.push(event.name);
        }
        
        if (event.reward) {
            resultHtml += `<div style="margin-top:8px; color:#ffcc66;">🎁 获得：${event.reward}</div>`;
            if (!event.isFake) {
                this.addToInventory(event.reward);
            }
        }
        
        resultHtml += `
                <div style="margin-top:12px; color:#5a7a8a; font-size:0.85rem;">
                    ⏱ 消耗时间：${event.timeCost} · 剩余时间：${this.timeSystem.timeRemaining}
                </div>
            </div>
        `;
        
        this.mailDetailEl.innerHTML = resultHtml;
        updateLog(`📌 完成事件：${event.name}（消耗${event.timeCost}时间）`);
        this.renderMailList();
    }

    // ===== 显示邮件详情（检查地点） =====
    showMailDetail(id) {
        const mail = this.mails.find(m => m.id === id);
        if (!mail) {
            console.warn(`邮件 ID ${id} 未找到`);
            return;
        }
        
        // 检查是否在正确地点
        const currentLoc = this.mapSystem ? this.mapSystem.getCurrentLocation() : 'classroom';
        if (mail.location !== currentLoc && !this.readMails.has(mail.id)) {
            const locName = this.mapSystem ? this.mapSystem.getLocationName(mail.location) : mail.location;
            alert(`📍 需要移动到「${locName}」才能阅读此邮件！`);
            return;
        }
        
        if (this.readMails.has(mail.id)) {
            this.displayMailContent(mail);
            return;
        }
        
        if (!this.timeSystem.spendTime(mail.timeCost)) {
            alert(`⏰ 时间不足！需要${mail.timeCost}，剩余${this.timeSystem.timeRemaining}`);
            return;
        }
        
        this.readMails.add(mail.id);
        if (this.timeSystem) {
            this.timeSystem.readMails = Array.from(this.readMails);
            this.timeSystem.saveGame();
        }
        
        this.displayMailContent(mail);
        this.renderMailList();
        updateLog(`📨 已读邮件：${mail.subject}（消耗${mail.timeCost}时间）`);
    }

    // ===== 显示邮件内容 =====
    displayMailContent(mail) {
        if (!this.mailDetailEl) return;
        
        this.mailDetailEl.innerHTML = `
            <div style="display:flex; justify-content:space-between; color:#5a7a8a; font-size:0.85rem; margin-bottom:10px;">
                <span>发件人：<strong style="color:#ff6b35;">${mail.sender}</strong></span>
                <span>${mail.date}</span>
            </div>
            <div style="margin-bottom:10px; color:#aabbcc;">主题：${mail.subject}</div>
            <div style="border-top:1px solid #2a2a3a; padding-top:12px;">
                ${mail.content}
            </div>
            <div style="margin-top:12px; color:#5a7a8a; font-size:0.8rem; border-top:1px solid #1a1a2e; padding-top:10px;">
                ⏱ 阅读耗时：${mail.timeCost} · 剩余时间：${this.timeSystem.timeRemaining}
                <br>📍 地点：${this.mapSystem ? this.mapSystem.getLocationName(mail.location) : mail.location}
                <br>💡 点击<strong style="color:#ffcc66;">高亮关键词</strong>可自动搜索
            </div>
        `;

        this.setupHighlightClick();
    }

    // ===== 设置高亮点击 =====
    setupHighlightClick() {
        document.querySelectorAll('.highlight').forEach(el => {
            el.removeEventListener('click', this._highlightHandler);
            this._highlightHandler = (e) => {
                e.stopPropagation();
                const keyword = el.dataset.keyword;
                if (keyword) {
                    const searchInput = document.getElementById('searchInput');
                    const searchBtn = document.getElementById('searchBtn');
                    if (searchInput && searchBtn) {
                        searchInput.value = keyword;
                        searchBtn.click();
                        updateLog(`🔍 从邮件中提取关键词：「${keyword}」`);
                    }
                }
            };
            el.addEventListener('click', this._highlightHandler);
        });

        document.querySelectorAll('.cipher-text').forEach(el => {
            el.style.cursor = 'pointer';
            el.title = '点击复制到搜索框';
            el.removeEventListener('click', this._cipherHandler);
            this._cipherHandler = function(e) {
                e.stopPropagation();
                const text = this.textContent.trim();
                const searchInput = document.getElementById('searchInput');
                const searchBtn = document.getElementById('searchBtn');
                if (searchInput && searchBtn) {
                    searchInput.value = text;
                    updateLog(`📋 已复制密文：${text.substring(0, 30)}...`);
                    setTimeout(() => {
                        searchBtn.click();
                    }, 300);
                }
            };
            el.addEventListener('click', this._cipherHandler);
        });
    }

    // ===== 添加到背包 =====
    addToInventory(item) {
        if (!this.inventory.includes(item)) {
            this.inventory.push(item);
            if (this.timeSystem) {
                this.timeSystem.inventory = this.inventory;
                this.timeSystem.saveGame();
            }
            updateInventoryDisplay(this.inventory);
            updateLog(`🎒 获得新证据：「${item}」`);
        }
    }

    // ===== 获取背包 =====
    getInventory() {
        return this.inventory;
    }
}