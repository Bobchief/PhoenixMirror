// ========== 搜索系统 ==========
class SearchSystem {
    constructor(mailSystem, timeSystem) {
        this.mailSystem = mailSystem;
        this.timeSystem = timeSystem;
        this.searchInput = document.getElementById('searchInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.searchResult = document.getElementById('searchResult');
        this.clues = GAME_DATA.clues;
        this.searchCount = 0;
        
        // 绑定所有方法到实例
        this.performSearch = this.performSearch.bind(this);
        this.tryDecrypt = this.tryDecrypt.bind(this);
        this.getClueByDay = this.getClueByDay.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        
        // 绑定事件
        this.searchBtn.addEventListener('click', this.handleSearch);
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.handleSearch();
            }
        });
    }

    // ===== 搜索入口 =====
    handleSearch() {
        this.performSearch();
    }

    // ===== 执行搜索 =====
    performSearch() {
        const input = this.searchInput.value.trim();
        if (!input) {
            this.searchResult.innerHTML = `<p class="hint">⚠️ ${this.getText('searchNoInput')}</p>`;
            return;
        }

        const currentDay = this.timeSystem.currentDay;

        // 消耗时间
        if (!this.timeSystem.spendTime(1)) {
            alert(`⏰ 时间不足！搜索需要1时间，剩余${this.timeSystem.timeRemaining}`);
            return;
        }

        this.searchCount++;
        updateLog(`🔍 第${this.searchCount}次搜索：「${input}」（消耗1时间）`);

        // 干扰事件
        const distractions = [
            '💬 窗外的树叶沙沙作响，像有人在低语。',
            '💬 你感觉有人在监视你，回头却空无一人。',
            '💬 走廊里传来脚步声，越来越近...又渐渐远去。',
            '💬 你手机突然亮了一下，是一条空白消息。',
            '💬 同桌的课桌里有一张纸条，上面画着一个眼睛。',
            '💬 你听到广播里传来奇怪的杂音...',
            '💬 窗外有个人影一闪而过。'
        ];

        // ===== 1. 先检查密文解密 =====
        const cryptoResult = this.tryDecrypt(input);
        if (cryptoResult) {
            this.searchResult.innerHTML = `
                <div class="clue-item">
                    <strong>🔐 ${this.getText('searchDecrypt')}：</strong>
                    <div class="decryption-result">${cryptoResult}</div>
                    <div style="margin-top:8px; color:#66cc88;">✅ ${this.getText('searchNewClue')}</div>
                    <div style="margin-top:8px; color:#6a7a8a; font-style:italic;">${distractions[Math.floor(Math.random() * distractions.length)]}</div>
                </div>
            `;
            if (this.mailSystem) {
                this.mailSystem.addToInventory('解密碎片');
            }
            return;
        }

        // ===== 2. 检查关键词线索 =====
        const clueResult = this.getClueByDay(input, currentDay);
        if (clueResult) {
            // 判断真假线索
            const fakeClues = ['转基因食堂', '军事实验', '营养液', '志愿者', '好人校长', '派对谣言', '癌症治疗', '教育创新'];
            const isFake = fakeClues.includes(input);
            
            if (isFake && this.mailSystem) {
                this.mailSystem.fakeCluesCollected.push(input);
            }
            
            this.searchResult.innerHTML = `
                <div class="clue-item" style="${isFake ? 'border-left-color:#ff8844;' : ''}">
                    <strong>${isFake ? '⚠️ 搜索结果：「' + input + '」' : '🔎 搜索结果：「' + input + '」'}</strong>
                    <div style="margin-top:8px;">${clueResult}</div>
                    ${isFake ? `<div style="margin-top:8px; color:#ff8844; font-size:0.85rem;">📌 ${this.getText('searchFakeNote')}</div>` : ''}
                    <div style="margin-top:8px; color:#6a7a8a; font-style:italic;">${distractions[Math.floor(Math.random() * distractions.length)]}</div>
                </div>
            `;
        } else {
            // ===== 3. 无结果 =====
            this.searchResult.innerHTML = `
                <div class="clue-item" style="border-left-color:#aa6644;">
                    <strong>❓ ${this.getText('searchNoResult').replace('{keyword}', input)}</strong>
                    <div style="margin-top:8px; color:#7a8a9a;">
                        ${this.getText('searchTry')}<br>
                        📚 密码学入门 · 👓 眼镜 · 🟣 紫斑<br>
                        🏗️ 实验楼 · 🧬 NX-7 · 🔑 19870515
                    </div>
                    <div style="margin-top:12px; color:#6a7a8a; font-style:italic;">${distractions[Math.floor(Math.random() * distractions.length)]}</div>
                </div>
            `;
        }
    }

    // ===== 密码学解密引擎 =====
    tryDecrypt(input) {
        // 1. 字母数字替换 (A=1, B=2...)
        if (/^[0-9\s]+$/.test(input) && input.split(/\s+/).length > 2) {
            try {
                const nums = input.split(/\s+/).map(Number);
                const result = nums.map(n => {
                    if (n >= 1 && n <= 26) {
                        return String.fromCharCode(64 + n);
                    }
                    return ' ';
                }).join('');
                if (result && result.length > 2 && !result.includes('undefined')) {
                    return `字母数字替换（A=1, B=2...）→ 明文：<br>「${result}」<br><br>💡 这是一个重要的句子！`;
                }
            } catch (e) {
                // 忽略解密错误
            }
        }

        // 2. 十六进制转ASCII
        if (/^[0-9A-Fa-f\s]+$/.test(input) && input.includes(' ')) {
            try {
                const hexStr = input.replace(/\s/g, '');
                const bytes = [];
                for (let i = 0; i < hexStr.length; i += 2) {
                    const byte = hexStr.substr(i, 2);
                    if (byte.length === 2) {
                        bytes.push(parseInt(byte, 16));
                    }
                }
                const result = String.fromCharCode(...bytes);
                if (result && result.length > 1) {
                    return `十六进制 → ASCII：<br>「${result}」`;
                }
            } catch (e) {
                // 忽略解密错误
            }
        }

        // 3. 凯撒密码 (位移3)
        if (/^[A-Za-z\s]+$/.test(input) && input.length > 5) {
            try {
                const shift = 3;
                const result = input.split('').map(char => {
                    if (char >= 'A' && char <= 'Z') {
                        return String.fromCharCode(((char.charCodeAt(0) - 65 - shift + 26) % 26) + 65);
                    } else if (char >= 'a' && char <= 'z') {
                        return String.fromCharCode(((char.charCodeAt(0) - 97 - shift + 26) % 26) + 97);
                    }
                    return char;
                }).join('');
                if (result && result.length > 1 && result !== input) {
                    return `凯撒密码（位移3）→ 明文：<br>「${result}」`;
                }
            } catch (e) {
                // 忽略解密错误
            }
        }

        // 4. ASCII码转字符
        if (/^[0-9\s]+$/.test(input) && input.split(/\s+/).length > 2) {
            try {
                const nums = input.split(/\s+/).map(Number);
                const result = nums.map(n => {
                    if (n >= 32 && n <= 126) {
                        return String.fromCharCode(n);
                    }
                    return ' ';
                }).join('');
                if (result && result.length > 2 && !result.includes('undefined')) {
                    return `ASCII码 → 字符：<br>「${result}」`;
                }
            } catch (e) {
                // 忽略解密错误
            }
        }

        // 5. 二进制转ASCII
        if (/^[01\s]+$/.test(input) && input.replace(/\s/g, '').length >= 8) {
            try {
                const binaryStr = input.replace(/\s/g, '');
                const bytes = [];
                for (let i = 0; i < binaryStr.length; i += 8) {
                    const byte = binaryStr.substr(i, 8);
                    if (byte.length === 8) {
                        bytes.push(parseInt(byte, 2));
                    }
                }
                const result = String.fromCharCode(...bytes);
                if (result && result.length > 1) {
                    return `二进制 → ASCII：<br>「${result}」`;
                }
            } catch (e) {
                // 忽略解密错误
            }
        }

        return null;
    }

    // ===== 根据天数获取线索 =====
    getClueByDay(keyword, day) {
        const clue = this.clues[keyword];
        if (!clue) return null;
        return clue;
    }

    // ===== 获取文本（支持多语言） =====
    getText(key) {
        const lang = window.getLang ? window.getLang() : 'zh';
        const dict = window.LANG ? window.LANG[lang] : null;
        if (dict && dict[key]) {
            return dict[key];
        }
        // 默认中文
        const defaultDict = {
            'searchNoInput': '⚠️ 请输入关键词',
            'searchNoResult': '❓ 没有找到关于「{keyword}」的线索',
            'searchTry': '试试搜索：',
            'searchDecrypt': '解密结果',
            'searchNewClue': '发现新线索',
            'searchFakeNote': '这条信息需要进一步验证...'
        };
        return defaultDict[key] || key;
    }
}