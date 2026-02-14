/**
 * 广韵拼音推导功能
 * 参考文献：https://phesoca.com/tupa/
 *
 * 适配现有数据库结构，使用字段：纽、呼、等、韵、声、组、摄、反切
 */

/**
 * 前元音韵列表（用于判断C类）
 * C类改良定义：非前元音三等韵
 */
const 前元音韵 = [
    '支', '脂', '之', '微', '魚', '虞', '模', '齊', '祭', '廢',
    '真', '臻', '殷', '文', '仙', '元', '先', '幽', '蕭', '宵',
    '侵', '鹽', '嚴', '添'
];

/**
 * 判断是否属于某个类别
 * @param {Object} data - 发音数据对象
 * @param {string} category - 类别名称
 * @returns {boolean}
 */
function is(data, category) {
    const categories = category.split(/\s+/);
    return categories.every(cat => {
        // 处理组合类别
        if (cat.includes('非')) {
            const subCat = cat.replace('非', '').trim();
            return !is(data, subCat);
        }
        if (cat.includes('或')) {
            const subCats = cat.split('或');
            return subCats.some(sc => is(data, sc.trim()));
        }

        // 处理具体类别
        switch (cat) {
            case '開口':
                return data['呼'] === '開';
            case '合口':
                return data['呼'] === '合';
            case '一等':
                return data['等'] === '一';
            case '二等':
                return data['等'] === '二';
            case '三等':
                return data['等'] === '三';
            case '四等':
                return data['等'] === '四';
            case '平聲':
                return data['声'] === '平';
            case '上聲':
                return data['声'] === '上';
            case '去聲':
                return data['声'] === '去';
            case '入聲':
                return data['声'] === '入';
            case 'A類':
            case 'A类':
                // 韵值以A结尾为A类
                return data['韵'].endsWith('A');
            case 'B類':
            case 'B类':
                // 韵值以B结尾为B类
                return data['韵'].endsWith('B');
            case 'C類':
            case 'C类':
                // C类改良定义：非前元音三等韵
                if (!is(data, '三等')) return false;
                if (is(data, 'A類') || is(data, 'B類')) return false;
                const 韵基 = data['韵'].replace(/[AB]$/, '');
                return !前元音韵.includes(韵基);
            case '銳音':
                return ['端', '透', '定', '泥', '來', '精', '清', '從', '心', '邪', '章', '昌', '常', '書', '船', '日', '以'].includes(data['纽']);
            case '莊組':
                return ['莊', '初', '崇', '生', '俟'].includes(data['纽']);
            default:
                return false;
        }
    });
}

/**
 * 根据条件返回对应的值
 * @param {Object} data - 发音数据对象
 * @param {Array} conditions - 条件数组，每个元素是 [条件, 值]
 * @returns {string}
 */
function when(data, conditions) {
    for (const [condition, value] of conditions) {
        if (is(data, condition)) {
            return value;
        }
    }
    return '';
}

/**
 * 获取声母
 * @param {Object} data - 发音数据对象
 * @returns {string}
 */
function get聲母(data) {
    const 声母映射 = {
        幫: 'p', 滂: 'ph', 並: 'b', 明: 'm',
        端: 't', 透: 'th', 定: 'd', 泥: 'n', 來: 'l',
        知: 'tr', 徹: 'trh', 澄: 'dr', 孃: 'nr',
        見: 'k', 溪: 'kh', 羣: 'g', 疑: 'ng', 云: '',
        影: 'q', 曉: 'h', 匣: 'gh',
        精: 'ts', 清: 'tsh', 從: 'dz', 心: 's', 邪: 'z',
        莊: 'tsr', 初: 'tsrh', 崇: 'dzr', 生: 'sr', 俟: 'zr',
        章: 'tj', 昌: 'tjh', 常: 'dj', 書: 'sj', 船: 'zj', 日: 'nj', 以: 'j',
    };
    return 声母映射[data['纽']] || '';
}

/**
 * 获取韵母
 * @param {Object} data - 发音数据对象
 * @returns {string}
 */
function get韻母(data) {
    const 韵 = data['韵'];
    const 韵基 = 韵.replace(/[AB]$/, ''); // 去掉A/B后缀获取韵基
    
    let 韻母 = when(data, [
        ['脂韻', 'i'], ['之韻', 'y'], ['尤侯韻', 'u'],
        ['支韻', 'e'], ['佳韻', 'ee'], ['魚韻', 'eo'], ['虞模韻', 'o'],
        ['麻韻', 'ae'], ['歌韻', 'a'],

        ['蒸韻 A類', 'ing'], ['蒸韻', 'yng'], ['東韻', 'ung'],
        ['青韻', 'eng'], ['耕韻', 'eeng'], ['登韻', 'eong'], ['冬鍾韻', 'ong'], ['江韻', 'oeung'],
        ['庚清韻', 'aeng'], ['陽唐韻', 'ang'],

        ['微韻', 'uj'],
        ['齊祭韻', 'ej'], ['皆韻', 'eej'], ['灰咍廢韻', 'oj'],
        ['夬韻', 'aej'], ['泰韻', 'aj'],

        ['真臻韻', 'in'], ['殷文韻', 'un'],
        ['先仙韻', 'en'], ['山韻', 'een'], ['元魂痕韻', 'on'],
        ['刪韻', 'aen'], ['寒韻', 'an'],

        ['幽韻', 'iw'],
        ['蕭宵韻', 'ew'],
        ['肴韻', 'aew'], ['豪韻', 'aw'],

        ['侵韻', 'im'],
        ['鹽添韻', 'em'], ['咸韻', 'eem'], ['覃嚴凡韻', 'om'],
        ['銜韻', 'aem'], ['談韻', 'am'],
    ]);

    // 如果没有匹配到，尝试单韵母匹配
    if (!韻母) {
        const 单韵母映射 = {
            '脂': 'i', '之': 'y', '尤': 'u', '侯': 'u',
            '支': 'e', '佳': 'ee', '魚': 'eo', '虞': 'o', '模': 'o',
            '麻': 'ae', '歌': 'a',
            '蒸': 'yng', '東': 'ung',
            '青': 'eng', '耕': 'eeng', '登': 'eong', '冬': 'ong', '鍾': 'ong', '江': 'oeung',
            '庚': 'aeng', '清': 'aeng', '陽': 'ang', '唐': 'ang',
            '微': 'uj',
            '齊': 'ej', '祭': 'ej', '皆': 'eej', '灰': 'oj', '咍': 'oj', '廢': 'oj',
            '夬': 'aej', '泰': 'aj',
            '真': 'in', '臻': 'in', '殷': 'un', '文': 'un',
            '先': 'en', '仙': 'en', '山': 'een', '元': 'on', '魂': 'on', '痕': 'on',
            '刪': 'aen', '寒': 'an',
            '幽': 'iw',
            '蕭': 'ew', '宵': 'ew',
            '肴': 'aew', '豪': 'aw',
            '侵': 'im',
            '鹽': 'em', '添': 'em', '咸': 'eem', '覃': 'om', '嚴': 'om', '凡': 'om',
            '銜': 'aem', '談': 'am',
        };
        韻母 = 单韵母映射[韵基] || '';
    }

    // 不圆唇元音
    if (is(data, '開口') && !韻母.endsWith('m')) {
        韻母 = 韻母.replace(/^u/, 'y').replace(/^o/, 'eo');
    }

    // 等类标记
    if (is(data, '三等') || (is(data, '四等') && 韻母.startsWith('ae'))) {
        if (is(data, 'A類') || (is(data, '銳音 非 莊組') && /^i|^e(?!o)|^ae/.test(韻母))) {
            // A 类以 i- 标记
            if (!韻母.startsWith('i')) {
                韻母 = 'i' + 韻母;
            }
        } else {
            // B、C 类以 y-/u- 标记
            if ((/^[uo]|^a(?!e)/.test(韻母) ? is(data, '開口') : is(data, '非 合口'))) {
                if (!韻母.startsWith('y')) {
                    韻母 = 'y' + 韻母;
                }
                韻母 = 韻母.replace('yeo', 'yo');
            } else {
                if (!韻母.startsWith('u')) {
                    韻母 = 'u' + 韻母;
                }
            }
        }
    } else {
        // 高元音非三等以 o- 标记
        if (/^[yu]/.test(韻母)) {
            韻母 = 'o' + 韻母;
        }
    }

    // 合口标记
    if (is(data, '合口') && !/^[uo]/.test(韻母)) {
        韻母 = 'w' + 韻母;
    }

    // 入声处理
    if (is(data, '入聲')) {
        韻母 = 韻母
            .replace('ng', 'k')
            .replace('n', 't')
            .replace('m', 'p');
    }

    return 韻母;
}

/**
 * 获取声调
 * @param {Object} data - 发音数据对象
 * @returns {string}
 */
function get聲調(data) {
    const 声调映射 = {
        上: 'q',
        去: 'h'
    };
    return 声调映射[data['声']] || '';
}

/**
 * 获取广韵拼音
 * @param {Object} data - 发音数据对象
 * @returns {string}
 */
function getKwangUnPinyin(data) {
    return get聲母(data) + get韻母(data) + get聲調(data);
}
