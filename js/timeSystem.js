// ========== 时间管理系统 ==========
class TimeSystem {
    constructor() {
        this.periods = ['morning', 'afternoon', 'evening'];
        this.timeDisplay = document.getElementById('timeDisplay');
        this.dayProgressEl = document.getElementById('dayProgress');
        this.log = document.getElementById('gameLog');
        this.skipButton = null;
        this.isProcessing = false;
        
        this.loadGame();
        this.updateDisplay();
        this.showDayStatus();
        this.addSkipButton();
        this.saveGame();
    }

    loadGame() {
        const saved = localStorage.getItem('xinhuo_game_save');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.currentDay = data.currentDay || 1;
                this.currentPeriod = data.currentPeriod || 'morning';
                this.timeRemaining = data.timeRemaining || 15;
                this.periodIndex = data.periodIndex || 0;
                this.totalTimeUsed = data.totalTimeUsed || 0;
                this.daysPassed = data.daysPassed || 0;
                this.readMails = data.readMails || [];
                this.inventory = data.inventory || ['王瑞琦的第一封信'];
                this.completedDays = data.completedDays || [];
                this.completedEvents = data.completedEvents || [];
                this.gameEnded = data.gameEnded || false;
                return;
            } catch (e) {}
        }
        this.initNewGame();
    }

    initNewGame() {
        this.currentDay = 1;
        this.currentPeriod = 'morning';
        this.timeRemaining = 15;
        this.periodIndex = 0;
        this.totalTimeUsed = 0;
        this.daysPassed = 0;
        this.readMails = [];
        this.inventory = ['王瑞琦的第一封信'];
        this.completedDays = [];
        this.completedEvents = [];
        this.gameEnded = false;
    }

    saveGame() {
        try {
            const data = {
                currentDay: this.currentDay,
                currentPeriod: this.currentPeriod,
                timeRemaining: this.timeRemaining,
                periodIndex: this.periodIndex,
                totalTimeUsed: this.totalTimeUsed,
                daysPassed: this.daysPassed,
                readMails: this.readMails,
                inventory: this.inventory,
                completedDays: this.completedDays,
                completedEvents: this.completedEvents,
                gameEnded: this.gameEnded || false,
                saveTime: new Date().toISOString()
            };
            localStorage.setItem('xinhuo_game_save', JSON.stringify(data));
        } catch (e) {}
    }

    addSkipButton() {
        const header = document.querySelector('header');
        if (header) {
            const oldBtn = document.getElementById('skipPeriodBtn');
            if (oldBtn) oldBtn.remove();
            
            const btn = document.createElement('button');
            btn.id = 'skipPeriodBtn';
            btn.innerHTML = '⏭️ 跳过本时段';
            btn.style.cssText = `
                background: #ff8844;
                border: none;
                padding: 4px 14px;
                border-radius: 8px;
                color: #0a0e14;
                font-weight: bold;
                cursor: pointer;
                margin-left: 10px;
                font-size: 0.75rem;
                transition: all 0.3s;
            `;
            btn.onmouseover = () => { btn.style.background = '#ffaa66'; };
            btn.onmouseout = () => { btn.style.background = '#ff8844'; };
            btn.onclick = () => this.skipPeriod();
            
            const timeDisplay = document.getElementById('timeDisplay');
            if (timeDisplay && timeDisplay.parentNode) {
                timeDisplay.parentNode.appendChild(btn);
            }
            this.skipButton = btn;
        }
    }

    // ===== 核心：消耗时间 =====
    spendTime(cost) {
        if (this.gameEnded) {
            alert('⚠️ 游戏已经结束，请重新开始。');
            return false;
        }
        
        if (this.isProcessing) return false;
        this.isProcessing = true;
        
        try {
            // 检查时间是否足够
            if (this.timeRemaining >= cost) {
                this.timeRemaining -= cost;
                this.totalTimeUsed += cost;
                this.updateDisplay();
                this.saveGame();
                // 检查时段是否结束
                if (this.timeRemaining <= 0) {
                    this.handlePeriodEnd();
                }
                this.isProcessing = false;
                return true;
            } else {
                // 时间不足：先花完剩余时间
                const remaining = this.timeRemaining;
                if (remaining > 0) {
                    this.timeRemaining = 0;
                    this.totalTimeUsed += remaining;
                    this.updateDisplay();
                    this.saveGame();
                    updateLog(`⏰ 剩余${remaining}时间被消耗（不足${cost}）`);
                }
                // 处理时段结束
                this.handlePeriodEnd();
                this.isProcessing = false;
                return false;
            }
        } catch (e) {
            this.isProcessing = false;
            throw e;
        }
    }

    // ===== 时段结束处理 =====
    handlePeriodEnd() {
        if (this.gameEnded) return;
        
        const currentPeriodName = GAME_DATA.timeConfig[this.currentPeriod].label;
        
        // 检查是否是晚上
        if (this.currentPeriod === 'evening') {
            // 晚上时间不足，进入第二天
            updateLog('🌙 晚上时间不足，进入第二天。');
            alert('🌙 夜晚时间已用完，将进入第二天。');
            this.advanceDay();
            return;
        }
        
        // 其他时段：进入下一时段
        const nextIndex = this.periodIndex + 1;
        if (nextIndex < this.periods.length) {
            this.periodIndex = nextIndex;
            this.currentPeriod = this.periods[nextIndex];
            this.timeRemaining = GAME_DATA.timeConfig[this.currentPeriod].max;
            this.updateDisplay();
            this.saveGame();
            const msg = `⏰ 进入${GAME_DATA.timeConfig[this.currentPeriod].label}（剩余${this.timeRemaining}）`;
            updateLog(msg);
            alert(msg);
            this.triggerPeriodEvent();
            if (window.mailSystem) {
                window.mailSystem.renderMailList();
            }
            if (window.mapSystem) {
                window.mapSystem.renderMap();
            }
        } else {
            // 所有时段结束，进入下一天
            this.advanceDay();
        }
    }

    // ===== 跳过时段 =====
    skipPeriod() {
        if (this.timeRemaining <= 0) {
            this.handlePeriodEnd();
            return;
        }
        
        const periodName = GAME_DATA.timeConfig[this.currentPeriod].label;
        if (confirm(`⏭️ 确定要跳过${periodName}吗？\n\n当前剩余时间：${this.timeRemaining}\n跳过将直接进入下一时段。`)) {
            updateLog(`⏭️ 跳过${periodName}，剩余${this.timeRemaining}时间被浪费`);
            this.timeRemaining = 0;
            this.updateDisplay();
            this.saveGame();
            this.handlePeriodEnd();
        }
    }

    // ===== 推进到第二天 =====
    advanceDay() {
        if (this.gameEnded) return;
        
        if (this.currentDay >= GAME_DATA.dayConfig.maxDays) {
            this.endGame('时间耗尽');
            return;
        }
        
        if (!this.completedDays.includes(this.currentDay)) {
            this.completedDays.push(this.currentDay);
        }
        
        this.currentDay++;
        this.daysPassed++;
        this.periodIndex = 0;
        this.currentPeriod = 'morning';
        this.timeRemaining = GAME_DATA.timeConfig.morning.max;
        
        const dayMsg = `🌅 第${this.currentDay}天开始！新线索已解锁！`;
        updateLog(dayMsg);
        alert(`🌅 第${this.currentDay}天开始！\n\n${this.getDayMessage()}\n\n⏱ 时间更加紧张，请合理安排！`);
        
        this.updateDisplay();
        this.showDayStatus();
        this.triggerDayEvent();
        this.saveGame();
        
        if (window.mailSystem) {
            window.mailSystem.renderMailList();
        }
        if (window.mapSystem) {
            window.mapSystem.renderMap();
        }
    }

    // ===== 剩余方法 =====
    getDayMessage() {
        const messages = {
            2: '📢 你注意到火箭班的人力气突然变大了。',
            3: '🔍 你破解了密码纸条！但更多谜题浮现...',
            4: '⚠️ 你深夜去了实验楼，发现了NX-7试管。',
            5: '💀 你看到了紫斑同学被"治疗"后的变化。',
            6: '🔥 王瑞琦潜入了校长办公室！但被发现了...',
            7: '⚡ 最后一天！必须做出抉择！'
        };
        return messages[this.currentDay] || '🌱 新的一天，继续调查...';
    }

    triggerPeriodEvent() {
        const events = {
            afternoon: '📢 午间广播："请各班班长下午2点到教务处开会。"',
            evening: '🌙 天色渐暗，校园里安静得可怕...'
        };
        if (events[this.currentPeriod]) {
            updateLog(events[this.currentPeriod]);
        }
    }

    triggerDayEvent() {
        const dayEvents = {
            2: '📋 你发现教室里的摄像头变多了。',
            3: '🔊 广播里宣布："明天开始实行特殊作息时间。"',
            4: '📨 你收到一封匿名信："不要去实验楼。"',
            5: '👀 你看到教导主任在跟踪一个学生。',
            6: '🔐 学校所有大门都锁上了。',
            7: '⚔️ 最后的时刻到了。'
        };
        if (dayEvents[this.currentDay]) {
            updateLog(`🌅 [第${this.currentDay}天] ${dayEvents[this.currentDay]}`);
        }
    }

    showDayStatus() {
        if (this.dayProgressEl) {
            const total = GAME_DATA.dayConfig.maxDays;
            let status = `📅 第 ${this.currentDay} / ${total} 天`;
            
            if (this.completedDays.length > 0) {
                status += ` · ✅ 已完成 ${this.completedDays.length} 天`;
            }
            
            const unlockedMails = GAME_DATA.mails.filter(m => m.dayUnlock === this.currentDay);
            if (unlockedMails.length > 0) {
                status += ` · 📨 新邮件 ${unlockedMails.length} 封`;
            } else {
                const nextMails = GAME_DATA.mails.filter(m => m.dayUnlock > this.currentDay);
                if (nextMails.length > 0) {
                    const nextDay = Math.min(...nextMails.map(m => m.dayUnlock));
                    status += ` · 🔒 第${nextDay}天解锁新线索`;
                }
            }
            
            if (this.gameEnded) {
                status += ` · 🏁 已结束`;
            }
            
            this.dayProgressEl.innerHTML = status;
        }
    }

    updateDisplay() {
        const dayLabel = `第${this.currentDay}天`;
        const periodLabel = GAME_DATA.timeConfig[this.currentPeriod].label;
        
        if (this.gameEnded) {
            this.timeDisplay.innerHTML = `🏁 游戏已结束 · 请重新开始`;
            this.timeDisplay.style.borderColor = '#ff4444';
            this.timeDisplay.style.color = '#ff4444';
            if (this.skipButton) this.skipButton.style.display = 'none';
            return;
        }
        
        this.timeDisplay.innerHTML = `📅 ${dayLabel} · ${periodLabel} · 剩余：${this.timeRemaining}`;
        this.timeDisplay.style.borderColor = '#ff6b35';
        this.timeDisplay.style.color = '#ff6b35';
        
        if (this.timeRemaining <= 3) {
            this.timeDisplay.classList.add('time-warning');
        } else {
            this.timeDisplay.classList.remove('time-warning');
        }
        
        if (this.skipButton) {
            this.skipButton.style.display = this.timeRemaining > 0 ? 'inline-block' : 'none';
        }
        
        this.showDayStatus();
    }

    endGame(reason) {
        if (this.gameEnded) return;
        this.gameEnded = true;
        
        let ending = '';
        let detail = '';
        if (this.currentDay <= 3) {
            ending = '😔 你调查太慢了...';
            detail = '你还没来得及查清真相，就被送去了"治疗室"。';
        } else if (this.currentDay <= 5) {
            ending = '😟 你接近了真相...';
            detail = '你几乎拼凑出了完整的真相，但被发现了。';
        } else {
            ending = '💀 你看到了真相...';
            detail = '你知道了薪火计划的全部真相，但为时已晚。';
        }
        
        this.saveGame();
        updateLog(`🏁 游戏结束：${reason}`);
        
        setTimeout(() => {
            alert(`🏁 游戏结束\n\n${ending}\n\n${detail}\n\n天数：${this.currentDay}天\n总用时：${this.totalTimeUsed}`);
        }, 500);
    }

    resetGame() {
        if (!confirm('🔄 确定要重新开始吗？')) return;
        localStorage.removeItem('xinhuo_game_save');
        this.initNewGame();
        this.updateDisplay();
        this.showDayStatus();
        this.saveGame();
        
        if (window.mailSystem) {
            window.mailSystem.readMails = new Set();
            window.mailSystem.inventory = ['王瑞琦的第一封信'];
            window.mailSystem.completedEvents = new Set();
            window.mailSystem.renderMailList();
        }
        if (window.mapSystem) {
            window.mapSystem.currentLocation = 'classroom';
            window.mapSystem.renderMap();
        }
        if (typeof updateInventoryDisplay === 'function') {
            updateInventoryDisplay(['王瑞琦的第一封信']);
        }
        
        updateLog('🔄 游戏已重置');
        setTimeout(() => alert('✅ 游戏已重置！'), 300);
    }

    getTimeStatus() {
        return {
            day: this.currentDay,
            period: this.currentPeriod,
            remaining: this.timeRemaining,
            totalUsed: this.totalTimeUsed,
            maxDays: GAME_DATA.dayConfig.maxDays,
            completedDays: this.completedDays,
            readMails: this.readMails,
            inventory: this.inventory,
            gameEnded: this.gameEnded
        };
    }
}