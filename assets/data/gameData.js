// ========== 游戏数据 ==========
const GAME_DATA = {
    dayConfig: { maxDays: 7, currentDay: 1 },
    timeConfig: {
        morning: { max: 15, label: '上午' },
        afternoon: { max: 25, label: '下午' },
        evening: { max: 15, label: '晚上' }
    },

    // ===== 地点列表 =====
    locations: {
        classroom: { id: 'classroom', name: '教室', x: 15, y: 60, unlockDay: 1 },
        library: { id: 'library', name: '图书馆', x: 55, y: 20, unlockDay: 1 },
        cafeteria: { id: 'cafeteria', name: '食堂', x: 85, y: 60, unlockDay: 1 },
        courtyard: { id: 'courtyard', name: '庭院', x: 50, y: 50, unlockDay: 2 },
        dorm: { id: 'dorm', name: '宿舍', x: 25, y: 40, unlockDay: 2 },
        gate: { id: 'gate', name: '校门', x: 5, y: 85, unlockDay: 3 },
        lab: { id: 'lab', name: '实验楼', x: 70, y: 85, unlockDay: 4 },
        office: { id: 'office', name: '行政楼', x: 40, y: 85, unlockDay: 5 }
    },

    // ===== 地点连接 =====
    connections: [
        { from: 'classroom', to: 'library', cost: 3 },
        { from: 'classroom', to: 'cafeteria', cost: 2 },
        { from: 'classroom', to: 'courtyard', cost: 2 },
        { from: 'library', to: 'classroom', cost: 3 },
        { from: 'library', to: 'courtyard', cost: 2 },
        { from: 'library', to: 'dorm', cost: 3 },
        { from: 'cafeteria', to: 'classroom', cost: 2 },
        { from: 'cafeteria', to: 'courtyard', cost: 2 },
        { from: 'cafeteria', to: 'lab', cost: 3 },
        { from: 'lab', to: 'cafeteria', cost: 3 },
        { from: 'lab', to: 'office', cost: 2 },
        { from: 'office', to: 'lab', cost: 2 },
        { from: 'office', to: 'gate', cost: 4 },
        { from: 'dorm', to: 'library', cost: 3 },
        { from: 'dorm', to: 'courtyard', cost: 2 },
        { from: 'gate', to: 'office', cost: 4 },
        { from: 'courtyard', to: 'classroom', cost: 2 },
        { from: 'courtyard', to: 'library', cost: 2 },
        { from: 'courtyard', to: 'cafeteria', cost: 2 },
        { from: 'courtyard', to: 'dorm', cost: 2 }
    ],

    // ===== 邮件列表（绑定地点） =====
    mails: [
        // 第1天 - 教室触发
        {
            id: 1, sender: '王瑞琦', subject: '你有没有发现？',
            date: '第1天 07:30', timeCost: 4, dayUnlock: 1,
            location: 'classroom',
            content: `你今天早读课有没有注意到隔壁班的李浩？<br><br>他以前数学从来没及格过，这次月考居然考了满分。<br><br>💬 老师表扬他的时候，他笑得很奇怪...`
        },
        // 第1天 - 图书馆触发
        {
            id: 2, sender: '王瑞琦', subject: '图书馆的发现',
            date: '第1天 13:20', timeCost: 5, dayUnlock: 1,
            location: 'library',
            content: `我在图书馆的《密码学入门》里发现了一张纸条：<br><br>"<span class="cipher-text">51207 8511 204 105 1914</span>"<br><br>这串数字是什么意思？<br><br>💬 图书馆管理员看到我拿这本书，表情好像有点紧张。`
        },
        // 第2天 - 食堂触发
        {
            id: 3, sender: '王瑞琦', subject: '食堂的怪事',
            date: '第2天 11:30', timeCost: 4, dayUnlock: 2,
            location: 'cafeteria',
            content: `今天午饭的时候，火箭班的人突然把桌子掀了。<br><br>他们力气大得吓人，一个人就把整张铁桌子举起来了。<br><br>💬 旁边有人说："好像是昨天体检之后就这样了。"`
        },
        // 第2天 - 庭院触发
        {
            id: 4, sender: '王瑞琦', subject: '体检的真相',
            date: '第2天 15:00', timeCost: 6, dayUnlock: 2,
            location: 'courtyard',
            content: `昨天那个体检有问题！<br><br>他们让我们戴一副<strong class="highlight" data-keyword="眼镜">特殊的眼镜</strong>看色卡。<br><br>我问了很多人，每个人看到的颜色都不一样。<br><br>💬 校医说"这是正常的个体差异"，但我看到他偷偷在本子上记了每个人的"颜色代码"。`
        },
        // 第3天 - 图书馆触发
        {
            id: 5, sender: '王瑞琦', subject: '我破解了密码',
            date: '第3天 09:15', timeCost: 5, dayUnlock: 3,
            location: 'library',
            content: `我破解了那张纸条！<br><br>"<span class="cipher-text">51207 8511 204 105 1914</span>"<br><br>用<strong class="highlight" data-keyword="字母数字替换">字母数字替换</strong>转换成：<br><br>"<span class="cipher-text">THEY ARE CHANGING US</span>"<br><br>他们在改变我们？<br><br>💬 我有点害怕，但必须查下去。`
        },
        // 第3天 - 宿舍触发
        {
            id: 6, sender: '王瑞琦', subject: '紫斑',
            date: '第3天 14:30', timeCost: 6, dayUnlock: 3,
            location: 'dorm',
            content: `我看到教导主任在走廊上拦住了一个同学。<br><br>那个同学的手臂上出现了<strong class="highlight" data-keyword="紫斑">奇怪的紫色斑点</strong>。<br><br>教导主任看起来很紧张，立刻把他带走了。<br><br>今天那个同学回来了，紫斑消失了，但他整个人都变了——眼神空洞，说话很慢。<br><br>💬 他以前是我们班最活泼的人...`
        },
        // 第4天 - 实验楼触发
        {
            id: 7, sender: '王瑞琦', subject: '深夜的实验室',
            date: '第4天 00:15', timeCost: 6, dayUnlock: 4,
            location: 'lab',
            content: `今晚我偷偷去了<strong class="highlight" data-keyword="实验楼">实验楼</strong>。<br><br>地下室的灯亮着，我透过窗户看到很多奇怪的仪器。<br><br>还有一些标着"<span class="cipher-text">NX-7</span>"的试管。<br><br>💬 我拍了几张照片，但是太暗了，不太清楚。`
        },
        // 第4天 - 教室触发
        {
            id: 8, sender: '王瑞琦', subject: '分班数据',
            date: '第4天 12:30', timeCost: 5, dayUnlock: 4,
            location: 'classroom',
            content: `我搞到了分班的数据！<br><br>分班不是按成绩，是按一个叫"<strong class="highlight" data-keyword="颜色分类">颜色分类</strong>"的标准。<br><br>普通班是一种颜色，火箭班是另一种，我们班又是一种。<br><br>💬 但具体是什么颜色？我没看到原始文件...`
        },
        // 第5天 - 行政楼触发
        {
            id: 9, sender: '王瑞琦', subject: '防护服',
            date: '第5天 08:50', timeCost: 5, dayUnlock: 5,
            location: 'office',
            content: `我今天看到了校长和教导主任。<br><br>他们穿着<strong class="highlight" data-keyword="防护服">防护服</strong>，在实验楼门口说话。<br><br>💬 为什么要在学校穿防护服？他们在保护自己不受什么伤害？`
        },
        // 第5天 - 图书馆触发
        {
            id: 10, sender: '王瑞琦', subject: '密码本第48页',
            date: '第5天 16:20', timeCost: 6, dayUnlock: 5,
            location: 'library',
            content: `《密码学入门》第47页是密码本。<br><br>但第48页被人撕掉了。<br><br>我在书脊的缝隙里找到了碎片，拼起来后写着：<br><br>"<span class="cipher-text">1987 05 15</span>"<br><br>💬 1987年5月15日...这个日子有什么特别的？`
        },
        // 第6天 - 行政楼触发
        {
            id: 11, sender: '王瑞琦', subject: '校长办公室',
            date: '第6天 11:00', timeCost: 7, dayUnlock: 6,
            location: 'office',
            content: `我潜入了<strong class="highlight" data-keyword="校长办公室">校长办公室</strong>！<br><br>在保险柜里找到了一个文件夹，叫"<strong class="highlight" data-keyword="薪火计划">薪火计划</strong>"。<br><br>里面写着：<br><br>用"NX-7"改造学生<br>成功者有三种颜色反应<br>失败品会...<br><br>💬 后面几页被撕掉了！关键部分缺失！`
        },
        // 第6天 - 校门触发（最后的消息）
        {
            id: 12, sender: '王瑞琦', subject: '⚠️ 他们在追我',
            date: '第6天 19:30', timeCost: 4, dayUnlock: 6,
            location: 'gate',
            content: `我被发现了！<br><br>他们在追我。这是最后一条消息。<br><br>🔑 完整证据在保险柜里，密码是<span class="cipher-text">19870515</span>。<br><br>快去拿！<br><br>💬 如果你看到这条消息...我已经...<br><br>—— 王瑞琦 最后的话`
        }
    ],

    // ===== 每日事件（绑定地点） =====
    dailyEvents: {
        1: [
            { id: 'e1', name: '📝 观察教室里的异常', timeCost: 3, location: 'classroom', desc: '你发现有几个同学的眼神变得很空洞...', isFake: false, reward: '观察记录' },
            { id: 'e2', name: '📚 去图书馆查资料', timeCost: 4, location: 'library', desc: '你翻遍了《密码学入门》，找到了密码纸条。', isFake: false, reward: '密码纸条' },
            { id: 'e3', name: '💬 和王瑞琦聊天', timeCost: 3, location: 'classroom', desc: '她说："我今天看到校长进了实验楼。"', isFake: false, reward: '校长行踪' },
            { id: 'd1', name: '📱 刷到一条新闻', timeCost: 2, location: 'cafeteria', desc: '"某中学食堂使用转基因食材，学生出现异常反应。"', isFake: true, reward: null },
            { id: 'd2', name: '💬 听到同学议论', timeCost: 2, location: 'courtyard', desc: '"我知道真相！校长其实是退伍军人，他们在做军事实验！"', isFake: true, reward: null },
        ],
        2: [
            { id: 'e7', name: '🔍 调查体检记录', timeCost: 5, location: 'office', desc: '你发现体检表上有"颜色代码"一栏，被隐藏了。', isFake: false, reward: '体检记录副本' },
            { id: 'e8', name: '📖 去图书馆找密码本', timeCost: 4, location: 'library', desc: '你找到了《密码学入门》，第47页有内容。', isFake: false, reward: null },
            { id: 'e9', name: '👀 跟踪教导主任', timeCost: 5, location: 'lab', desc: '他带着一个学生走进了实验楼地下室。', isFake: false, reward: null },
            { id: 'd3', name: '📋 捡到一张纸条', timeCost: 2, location: 'cafeteria', desc: '"NX-7是新型营养液，促进学生发育。"', isFake: true, reward: null },
        ],
        3: [
            { id: 'e12', name: '🔐 破解密码纸条', timeCost: 5, location: 'library', desc: '你花了很长时间，终于破解了密码！', isFake: false, reward: '解密碎片' },
            { id: 'e13', name: '🟣 调查紫斑同学', timeCost: 6, location: 'dorm', desc: '你发现不止一个人出现了紫斑...', isFake: false, reward: '紫斑照片' },
            { id: 'e14', name: '📋 去教务处偷看文件', timeCost: 6, location: 'office', desc: '你看到了一份"颜色分类表"。', isFake: false, reward: null },
            { id: 'd5', name: '📰 看到校报文章', timeCost: 2, location: 'classroom', desc: '"薪火计划获得省级教育创新一等奖！"', isFake: true, reward: null },
        ],
        4: [
            { id: 'e17', name: '🧪 潜入实验楼', timeCost: 7, location: 'lab', desc: '你看到了NX-7的标签和很多仪器。', isFake: false, reward: '实验楼照片' },
            { id: 'e18', name: '📊 分析分班数据', timeCost: 5, location: 'classroom', desc: '你发现分班完全按颜色分类。', isFake: false, reward: null },
            { id: 'e19', name: '👁️ 测试镜界眼镜', timeCost: 4, location: 'courtyard', desc: '你戴上眼镜，看到的颜色让你震惊。', isFake: false, reward: '眼镜观察记录' },
            { id: 'd7', name: '📱 收到陌生短信', timeCost: 2, location: 'cafeteria', desc: '"NX-7可以治愈癌症，他们在做好事。"', isFake: true, reward: null },
        ],
        5: [
            { id: 'e22', name: '👨‍🔬 调查防护服', timeCost: 6, location: 'office', desc: '你发现防护服是特制的，能隔绝某些东西。', isFake: false, reward: '防护服信息' },
            { id: 'e23', name: '📖 研究密码本', timeCost: 6, location: 'library', desc: '你发现了第48页被撕掉的碎片。', isFake: false, reward: '密码本碎片' },
            { id: 'd9', name: '📰 看到旧报纸', timeCost: 2, location: 'gate', desc: '"1987年，该校被评为全国示范高中。"', isFake: true, reward: null },
        ],
        6: [
            { id: 'e26', name: '🏫 潜入校长办公室', timeCost: 8, location: 'office', desc: '你找到了薪火计划的文件！', isFake: false, reward: '薪火计划文件' },
            { id: 'e27', name: '📄 阅读实验记录', timeCost: 7, location: 'office', desc: '你看到了完整的实验内容，触目惊心！', isFake: false, reward: '完整实验记录' },
            { id: 'd11', name: '📱 王瑞琦的消息', timeCost: 2, location: 'gate', desc: '"其实我骗了你，我只是想让你陪我调查。"', isFake: true, reward: null },
        ]
    },

    // ===== 线索数据库 =====
    clues: {
        '密码学入门': '📚 图书馆三楼的书。第47页夹着密码纸条。\n\n💡 纸条上的数字需要解密。',
        '眼镜': '👓 体检时戴的特殊眼镜。不同人看到不同颜色。\n\n💡 校医在记录"颜色代码"。',
        '字母数字替换': '🔢 A=1, B=2... 把数字转换成字母。\n\n💡 试试：5-12-15-25 = E-L-O-Y',
        '紫斑': '🟣 出现在部分同学身上的紫色斑点。\n\n💡 "治疗"后紫斑消失，但人也变了。',
        '实验楼': '🏗️ 学校北边的旧实验楼。地下室有仪器和NX-7试管。',
        '颜色分类': '📋 分班依据的颜色标准。\n\n💡 不同颜色代表不同类型的改造。',
        '防护服': '👨‍🔬 校长和教导主任穿的防护服。\n\n💡 他们在隐藏自己的颜色。',
        'NX-7': '🧬 实验用的病毒代号。能改造人体。',
        '校长办公室': '🏫 行政楼5楼，有保险柜。密码是19870515。',
        '薪火计划': '🔥 学校的秘密项目。\n\n🔬 用NX-7改造学生\n🔵 蓝色 = 智力提升\n🔴 红色 = 体能强化\n⚪ 白色 = 失败品（活死人）\n\n💀 成功率只有37%',
        '19870515': '📅 校长生日，也是保险柜密码。',
        // 假线索
        '转基因食堂': '🍽️ 食堂食材是转基因的，导致学生出现异常反应。\n\n💡 这解释了为什么学生行为异常！',
        '军事实验': '🎖️ 校长是退伍军人，薪火计划是军方秘密项目。',
        '营养液': '🧪 NX-7其实是新型营养液，帮助学生发育成长。',
        '志愿者': '🤝 那些学生是志愿者，自愿参与科学实验。'
    },

    initialInventory: ['王瑞琦的第一封信']
};