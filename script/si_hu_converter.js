/**
 * 四呼转换函数
 * 根据中古汉语的"等"和"呼"推导现代汉语的四呼
 * 
 * 基本规律：
 * - 开口一二等 → 开口呼
 * - 开口三四等 → 齊齿呼
 * - 合口一二等 → 合口呼
 * - 合口三四等 → 撮口呼
 * 
 * 特殊规则（不规则变异）：
 * 1. 开口一等"歌、铎"韵，部分字今读合口[uo]韵
 * 2. 开口二等见系字，今多读齐齿呼
 * 3. 开口二等江韵、三等阳韵的知、庄组字，今读合口呼韵母
 * 4. 开口三等知系字，今多读开口呼
 * 5. 开口三等止、蟹两摄今音全为开口[ɿ][ʅ]或齐齿[i]韵
 * 6. 合口一等帮系字今音部分读开口
 * 7. 合口三等知系字，今多读合口呼
 * 8. 合口三等见系字，今多读撮口呼
 */

// 声纽组分类
const SHENG_NIU_GROUPS = {
  // 帮系
  bang: ['帮', '滂', '並', '明', '非', '敷', '奉', '微'],
  // 端系
  duan: ['端', '透', '定', '泥', '来'],
  jing: ['精', '清', '從', '心', '邪'],
  // 知系
  zhi: ['知', '徹', '澄', '娘'],
  zhuang: ['莊', '初', '崇', '生'],
  zhang: ['章', '昌', '船', '書', '禅'],
  ri: ['日'],
  // 见系
  jian: ['見', '溪', '群', '疑'],
  xiao: ['曉', '匣'],
  ying: ['影']
};

// 韵部分类（用于特殊规则）
const YUNBU_CATEGORIES = {
  // 歌韵
  ge: ['歌'],
  duo: ['铎'],
  // 江韵
  jiang: ['江'],
  // 阳韵
  yang: ['陽'],
  // 止摄
  zhi: ['支', '脂', '之', '微'],
  // 蟹摄
  xie: ['齊', '皆', '佳', '祭', '廢'],
  // 药韵
  jue: ['覺', '薛', '月', '屑', '葉'],
  // 入声韵
  ru_sheng: ['屋', '沃', '燭', '覺']
};

/**
 * 获取声纽所属的组
 * @param {string} niu 声纽
 * @returns {string} 声纽组
 */
function getShengNiuGroup(niu) {
  for (const [group, nius] of Object.entries(SHENG_NIU_GROUPS)) {
    if (nius.includes(niu)) {
      return group;
    }
  }
  return 'unknown';
}

/**
 * 检查韵部是否属于特定类别
 * @param {string} yun 韵部
 * @param {string} category 韵部类别
 * @returns {boolean}
 */
function isYunbuInCategory(yun, category) {
  return YUNBU_CATEGORIES[category] && YUNBU_CATEGORIES[category].includes(yun);
}

/**
 * 根据等和呼计算四呼（基本规则）
 * @param {string} deng 等（一、二、三、四）
 * @param {string} hu 呼（開、合）
 * @returns {string} 四呼
 */
function calculateSiHuBasic(deng, hu) {
  if (hu === '開') {
    if (deng === '一' || deng === '二') {
      return '開口呼';
    } else if (deng === '三' || deng === '四') {
      return '齊齒呼';
    }
  } else if (hu === '合') {
    if (deng === '一' || deng === '二') {
      return '合口呼';
    } else if (deng === '三' || deng === '四') {
      return '撮口呼';
    }
  }
  return '開口呼'; // 默认值
}

/**
 * 应用特殊规则修正四呼
 * @param {string} siHu 基本四呼
 * @param {string} deng 等
 * @param {string} hu 呼
 * @param {string} niu 声纽
 * @param {string} yun 韵部
 * @param {string} she 摄
 * @returns {string} 修正后的四呼
 */
function applySpecialRules(siHu, deng, hu, niu, yun, she) {
  const shengNiuGroup = getShengNiuGroup(niu);
  
  // 规则1：开口一等"歌、铎"韵，部分字今读合口[uo]韵
  // 注意：这个规则需要具体字的信息，暂时无法在函数中实现
  // 可以在转换脚本中处理特定字
  
  // 规则2：开口二等见系字，今多读齐齿呼
  if (hu === '開' && deng === '二' && (shengNiuGroup === 'jian' || shengNiuGroup === 'xiao' || shengNiuGroup === 'ying')) {
    // 见系字（见、溪、群、疑、曉、匣、影）大多读齐齿呼
    // 但有些字仍读开口呼（如：搞、扛、格、更）
    // 这里返回齐齿呼作为默认，特殊字需要单独处理
    return '齊齒呼';
  }
  
  // 规则3：开口二等江韵、三等阳韵的知、庄组字，今读合口呼韵母
  if (hu === '開' && shengNiuGroup === 'zhuang' && deng === '二' && isYunbuInCategory(yun, 'jiang')) {
    return '合口呼';
  }
  if (hu === '開' && shengNiuGroup === 'zhang' && deng === '三' && isYunbuInCategory(yun, 'yang')) {
    return '合口呼';
  }
  
  // 规则4：开口三等知系字，今多读开口呼
  if (hu === '開' && deng === '三' && (shengNiuGroup === 'zhi' || shengNiuGroup === 'zhuang' || shengNiuGroup === 'zhang' || shengNiuGroup === 'ri')) {
    // 知系字（知、徹、澄、娘、莊、初、崇、生、章、昌、船、書、禅、日）
    // 今多读开口呼，但有个别例外（如：漱、庄、饷、酌、爹）
    return '開口呼';
  }
  
  // 规则5：开口三等止、蟹两摄今音全为开口[ɿ][ʅ]或齐齿[i]韵
  if (hu === '開' && deng === '三' && (she === '止' || she === '蟹')) {
    // 止摄：支、脂、之、微韵
    // 蟹摄：齊、皆、佳、祭、廢韵
    // 知系字读开口，其他多读齐齿
    if (shengNiuGroup === 'zhi' || shengNiuGroup === 'zhuang' || shengNiuGroup === 'zhang' || shengNiuGroup === 'ri') {
      return '開口呼';
    }
    return '齊齒呼';
  }
  
  // 规则6：合口一等帮系字今音部分读开口
  if (hu === '合' && deng === '一' && shengNiuGroup === 'bang') {
    // 帮系字（帮、滂、並、明、非、敷、奉、微）
    // 部分今读开口（如：杯、般、配、坯、拼），部分读合口[u]（如：铺、不）
    // 部分读齐齿（如：坯、拼）
    // 这里返回合口呼作为默认，特殊字需要单独处理
    return '合口呼';
  }
  
  // 规则7：合口三等知系字，今多读合口呼
  if (hu === '合' && deng === '三' && (shengNiuGroup === 'zhi' || shengNiuGroup === 'zhuang' || shengNiuGroup === 'zhang' || shengNiuGroup === 'ri')) {
    return '合口呼';
  }
  
  // 规则8：合口三等见系字，今多读撮口呼
  if (hu === '合' && deng === '三' && (shengNiuGroup === 'jian' || shengNiuGroup === 'xiao' || shengNiuGroup === 'ying')) {
    return '撮口呼';
  }
  
  return siHu;
}

/**
 * 主函数：根据中古音参数计算四呼
 * @param {string} deng 等（一、二、三、四）
 * @param {string} hu 呼（開、合）
 * @param {string} niu 声纽
 * @param {string} yun 韵部
 * @param {string} she 摄
 * @returns {string} 四呼
 */
function calculateSiHu(deng, hu, niu, yun, she) {
  // 先应用基本规则
  let siHu = calculateSiHuBasic(deng, hu);
  
  // 再应用特殊规则修正
  siHu = applySpecialRules(siHu, deng, hu, niu, yun, she);
  
  return siHu;
}

// 导出函数供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    calculateSiHu,
    calculateSiHuBasic,
    applySpecialRules,
    getShengNiuGroup,
    isYunbuInCategory,
    SHENG_NIU_GROUPS,
    YUNBU_CATEGORIES
  };
}
