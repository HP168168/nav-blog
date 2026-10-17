import { useState, useMemo, useCallback } from 'react';

interface WordItem {
  id: string;
  text: string;
  selected: boolean;
}

type ColumnKey = 'region' | 'brand' | 'keyword' | 'business' | 'modifier';

interface ColumnConfig {
  key: ColumnKey;
  label: string;
  tag: string;
  headerBg: string;
  headerBorder: string;
  headerText: string;
  btnBg: string;
  btnHover: string;
}

const COLUMNS: ColumnConfig[] = [
  {
    key: 'region',
    label: '地区',
    tag: '[地区]',
    headerBg: 'bg-amber-500/15',
    headerBorder: 'border-amber-500/30',
    headerText: 'text-amber-400',
    btnBg: 'bg-amber-600/80 hover:bg-amber-600 text-amber-50',
    btnHover: 'hover:bg-amber-500/20',
  },
  {
    key: 'keyword',
    label: '关键词',
    tag: '[关键词]',
    headerBg: 'bg-emerald-500/15',
    headerBorder: 'border-emerald-500/30',
    headerText: 'text-emerald-400',
    btnBg: 'bg-emerald-600/80 hover:bg-emerald-600 text-emerald-50',
    btnHover: 'hover:bg-emerald-500/20',
  },
  {
    key: 'brand',
    label: '品牌',
    tag: '[品牌]',
    headerBg: 'bg-sky-500/15',
    headerBorder: 'border-sky-500/30',
    headerText: 'text-sky-400',
    btnBg: 'bg-sky-600/80 hover:bg-sky-600 text-sky-50',
    btnHover: 'hover:bg-sky-500/20',
  },
  {
    key: 'business',
    label: '业务',
    tag: '[业务]',
    headerBg: 'bg-orange-500/15',
    headerBorder: 'border-orange-500/30',
    headerText: 'text-orange-400',
    btnBg: 'bg-orange-600/80 hover:bg-orange-600 text-orange-50',
    btnHover: 'hover:bg-orange-500/20',
  },
  {
    key: 'modifier',
    label: '修饰词',
    tag: '[修饰词]',
    headerBg: 'bg-rose-500/15',
    headerBorder: 'border-rose-500/30',
    headerText: 'text-rose-400',
    btnBg: 'bg-rose-600/80 hover:bg-rose-600 text-rose-50',
    btnHover: 'hover:bg-rose-500/20',
  },
];

const TEMPLATES = [
  { label: '[地区][品牌][关键词][业务][修饰词]', value: '[地区][品牌][关键词][业务][修饰词]' },
  { label: '[地区][关键词][业务][修饰词]', value: '[地区][关键词][业务][修饰词]' },
  { label: '[品牌][关键词][业务][修饰词]', value: '[品牌][关键词][业务][修饰词]' },
  { label: '[地区][品牌][关键词][修饰词]', value: '[地区][品牌][关键词][修饰词]' },
  { label: '[地区][关键词][修饰词]', value: '[地区][关键词][修饰词]' },
  { label: '[修饰词][关键词][地区][业务]', value: '[修饰词][关键词][地区][业务]' },
];

const INITIAL_REGIONS = [
  '北京', '天津', '上海', '重庆', '香港', '澳门', '台湾',
  '广州', '深圳', '杭州', '南京', '武汉', '成都', '长沙',
  '邵阳', '永州', '怀化', '益阳', '岳阳', '常德', '张家界', '株洲'
];

const INITIAL_KEYWORDS = ['挖掘机', '装载机', '推土机', '压路机', '吊车', '叉车'];
const INITIAL_BRANDS = ['小松', '卡特', '三一', '徐工', '日立', '柳工'];
const INITIAL_BUSINESS = ['配件', '维修', '租赁', '销售', '批发', '厂家直供', '二手置换'];
const INITIAL_MODIFIERS = [
  '制作精良', '售后保障', '服务周到', '服务至上', '设计合理',
  '性能可靠', '样式优雅', '品质优良', '质量可靠', '安全可靠',
  '量大从优', '款式新颖', '经久耐用', '信誉保证', '价格实惠', '规格齐全'
];

function createList(items: string[], defaultSelectCount = 999): WordItem[] {
  return items.map((t, idx) => ({
    id: `${t}-${idx}-${Date.now()}`,
    text: t,
    selected: idx < defaultSelectCount,
  }));
}

export default function TitleGenerator() {
  const [template, setTemplate] = useState('[地区][品牌][关键词][业务][修饰词]');
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);

  // 词库状态
  const [words, setWords] = useState<Record<ColumnKey, WordItem[]>>({
    region: createList(INITIAL_REGIONS, 1),
    brand: createList(INITIAL_BRANDS, 1),
    keyword: createList(INITIAL_KEYWORDS, 1),
    business: createList(INITIAL_BUSINESS, 1),
    modifier: createList(INITIAL_MODIFIERS, 999),
  });

  // 正在编辑的项 ID
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  // 新增输入框状态
  const [addingCol, setAddingCol] = useState<ColumnKey | null>(null);
  const [newWordText, setNewWordText] = useState('');

  // 生成结果
  const [generatedTitles, setGeneratedTitles] = useState<string[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [filterText, setFilterText] = useState('');

  // 动态例句预览
  const exampleSentence = useMemo(() => {
    const pickFirst = (key: ColumnKey) => {
      const selected = words[key].filter(w => w.selected);
      return selected.length > 0 ? selected[0].text : '';
    };

    let res = template;
    res = res.replace(/\[地区\]/g, pickFirst('region'));
    res = res.replace(/\[品牌\]/g, pickFirst('brand'));
    res = res.replace(/\[关键词\]/g, pickFirst('keyword'));
    res = res.replace(/\[业务\]/g, pickFirst('business'));
    res = res.replace(/\[修饰词\]/g, pickFirst('modifier'));
    return res;
  }, [template, words]);

  // 全选 / 取消全选
  const handleToggleAll = (col: ColumnKey) => {
    setWords(prev => {
      const list = prev[col];
      const allSelected = list.every(item => item.selected);
      return {
        ...prev,
        [col]: list.map(item => ({ ...item, selected: !allSelected })),
      };
    });
  };

  // 单项勾选切换
  const handleToggleItem = (col: ColumnKey, id: string) => {
    setWords(prev => ({
      ...prev,
      [col]: prev[col].map(item => item.id === id ? { ...item, selected: !item.selected } : item),
    }));
  };

  // 清空整列
  const handleClearCol = (col: ColumnKey) => {
    setWords(prev => ({
      ...prev,
      [col]: [],
    }));
  };

  // 删除单项
  const handleDeleteItem = (col: ColumnKey, id: string) => {
    setWords(prev => ({
      ...prev,
      [col]: prev[col].filter(item => item.id !== id),
    }));
  };

  // 开始编辑
  const handleStartEdit = (item: WordItem) => {
    setEditingId(item.id);
    setEditingText(item.text);
  };

  // 保存编辑
  const handleSaveEdit = (col: ColumnKey) => {
    if (!editingId) return;
    const trimmed = editingText.trim();
    if (!trimmed) {
      handleDeleteItem(col, editingId);
    } else {
      setWords(prev => ({
        ...prev,
        [col]: prev[col].map(item => item.id === editingId ? { ...item, text: trimmed } : item),
      }));
    }
    setEditingId(null);
    setEditingText('');
  };

  // 添加新词
  const handleAddWord = (col: ColumnKey) => {
    const trimmed = newWordText.trim();
    if (trimmed) {
      const itemsToAdd = trimmed.split(/[\n,，\s]+/).filter(Boolean);
      setWords(prev => ({
        ...prev,
        [col]: [
          ...prev[col],
          ...itemsToAdd.map((txt, i) => ({
            id: `${txt}-${Date.now()}-${i}`,
            text: txt,
            selected: true,
          })),
        ],
      }));
    }
    setNewWordText('');
    setAddingCol(null);
  };

  // 点击“生成标题”
  const handleGenerate = () => {
    const getList = (col: ColumnKey) => {
      const sel = words[col].filter(w => w.selected).map(w => w.text);
      return sel.length > 0 ? sel : [''];
    };

    const regions = template.includes('[地区]') ? getList('region') : [''];
    const brands = template.includes('[品牌]') ? getList('brand') : [''];
    const keywords = template.includes('[关键词]') ? getList('keyword') : [''];
    const businesses = template.includes('[业务]') ? getList('business') : [''];
    const modifiers = template.includes('[修饰词]') ? getList('modifier') : [''];

    const results: string[] = [];
    const maxCombinations = 5000;

    outer:
    for (const r of regions) {
      for (const b of brands) {
        for (const k of keywords) {
          for (const bs of businesses) {
            for (const m of modifiers) {
              let t = template;
              t = t.replace(/\[地区\]/g, r);
              t = t.replace(/\[品牌\]/g, b);
              t = t.replace(/\[关键词\]/g, k);
              t = t.replace(/\[业务\]/g, bs);
              t = t.replace(/\[修饰词\]/g, m);
              t = t.trim();
              if (t) {
                results.push(t);
              }
              if (results.length >= maxCombinations) break outer;
            }
          }
        }
      }
    }

    const unique = Array.from(new Set(results));
    setGeneratedTitles(unique);
    setHasGenerated(true);

    // 滚动到结果区域
    setTimeout(() => {
      const el = document.getElementById('resultsSection');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // 复制与导出
  const filteredTitles = useMemo(() => {
    if (!filterText.trim()) return generatedTitles;
    return generatedTitles.filter(t => t.includes(filterText.trim()));
  }, [generatedTitles, filterText]);

  const copyAll = useCallback(() => {
    navigator.clipboard.writeText(filteredTitles.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [filteredTitles]);

  const exportFile = useCallback((ext: string) => {
    const content = ext === 'csv'
      ? filteredTitles.map((t, i) => `${i + 1},"${t}"`).join('\n')
      : filteredTitles.join('\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `titles-${Date.now()}.${ext}`;
    a.click();
  }, [filteredTitles]);

  const sendToWriter = useCallback((t: string) => {
    localStorage.setItem('ai_writer_title', t);
    window.location.href = '/tools/ai-writer';
  }, []);

  return (
    <div className="space-y-6">
      {/* 顶部操作区卡片 */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-xl shadow-black/20 space-y-4">
        {/* 模板选择与输入栏 */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* 下拉按钮 */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowTemplateDropdown(prev => !prev)}
              className="px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-200 text-sm font-medium flex items-center justify-between gap-2 shadow-sm transition whitespace-nowrap w-full sm:w-auto cursor-pointer"
            >
              <span>标题模板选择</span>
              <span className="text-xs text-slate-400">▾</span>
            </button>

            {showTemplateDropdown && (
              <div className="absolute left-0 top-full mt-1.5 w-72 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl z-30 py-1.5">
                {TEMPLATES.map((tpl, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setTemplate(tpl.value);
                      setShowTemplateDropdown(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-emerald-400 transition"
                  >
                    {tpl.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 模板输入框 */}
          <div className="flex-1">
            <input
              type="text"
              value={template}
              onChange={e => setTemplate(e.target.value)}
              placeholder="[地区][品牌][关键词][业务][修饰词]"
              className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700/80 text-slate-100 placeholder-slate-600 text-base font-mono focus:outline-none focus:border-red-500/80 focus:ring-1 focus:ring-red-500/30 transition shadow-inner"
            />
          </div>

          {/* 生成标题大按钮 */}
          <button
            onClick={handleGenerate}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-base shadow-lg shadow-red-900/30 active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <span>生成标题</span>
          </button>
        </div>

        {/* 例句展示 */}
        <div className="text-xs sm:text-sm text-slate-400 font-mono bg-slate-950/40 rounded-lg px-4 py-2 border border-slate-800/60 flex items-center gap-2">
          <span className="text-slate-500 font-semibold">例句：</span>
          <span className="text-slate-200 font-medium truncate">
            {exampleSentence || '北京小松挖掘机配件厂家直销'}
          </span>
        </div>
      </div>

      {/* 五列词库核心卡片区 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5 items-start">
        {COLUMNS.map(col => {
          const list = words[col.key];
          const allSelected = list.length > 0 && list.every(i => i.selected);

          return (
            <div
              key={col.key}
              className="rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col overflow-hidden shadow-lg transition-all"
            >
              {/* 卡片头部 */}
              <div className={`px-3 py-2.5 ${col.headerBg} border-b ${col.headerBorder} flex items-center justify-between`}>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={() => handleToggleAll(col.key)}
                    className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
                  />
                  <span className={`text-xs font-bold ${col.headerText}`}>{col.label}</span>
                </label>

                <button
                  onClick={() => setAddingCol(col.key)}
                  title={`添加${col.label}`}
                  className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* 弹出的添加输入行 */}
              {addingCol === col.key && (
                <div className="p-2 bg-slate-950/90 border-b border-slate-800 space-y-1.5">
                  <input
                    type="text"
                    value={newWordText}
                    onChange={e => setNewWordText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleAddWord(col.key); }}
                    placeholder={`输入${col.label}，多个空格隔开`}
                    autoFocus
                    className="w-full px-2 py-1 rounded bg-slate-800 text-xs text-slate-100 border border-slate-700 focus:outline-none focus:border-emerald-500"
                  />
                  <div className="flex justify-end gap-1.5">
                    <button
                      onClick={() => setAddingCol(null)}
                      className="px-2 py-0.5 text-[11px] rounded bg-slate-800 text-slate-400 hover:bg-slate-700"
                    >
                      取消
                    </button>
                    <button
                      onClick={() => handleAddWord(col.key)}
                      className="px-2 py-0.5 text-[11px] rounded bg-emerald-600 text-white hover:bg-emerald-500 font-medium"
                    >
                      确定添加
                    </button>
                  </div>
                </div>
              )}

              {/* 词列表（固定高度滚动条） */}
              <div className="h-[360px] overflow-y-auto divide-y divide-slate-800/40 p-1">
                {list.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-600 text-xs py-8">
                    <span>暂无{col.label}</span>
                    <button
                      onClick={() => setAddingCol(col.key)}
                      className="mt-2 text-emerald-400 hover:underline text-[11px]"
                    >
                      点击添加 +
                    </button>
                  </div>
                ) : (
                  list.map(item => (
                    <div
                      key={item.id}
                      className={`group flex items-center justify-between px-2.5 py-1.5 rounded transition ${
                        item.selected ? 'bg-slate-800/40' : 'hover:bg-slate-800/20'
                      }`}
                    >
                      <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0 mr-1 select-none">
                        <input
                          type="checkbox"
                          checked={item.selected}
                          onChange={() => handleToggleItem(col.key, item.id)}
                          className="w-3.5 h-3.5 rounded accent-emerald-500 cursor-pointer flex-shrink-0"
                        />
                        {editingId === item.id ? (
                          <input
                            type="text"
                            value={editingText}
                            onChange={e => setEditingText(e.target.value)}
                            onBlur={() => handleSaveEdit(col.key)}
                            onKeyDown={e => { if (e.key === 'Enter') handleSaveEdit(col.key); }}
                            autoFocus
                            className="px-1 py-0.5 bg-slate-900 border border-emerald-500 rounded text-xs text-white w-full"
                          />
                        ) : (
                          <span className={`text-xs truncate ${item.selected ? 'text-slate-100 font-medium' : 'text-slate-400'}`}>
                            {item.text}
                          </span>
                        )}
                      </label>

                      {/* 编辑 / 删除按钮 */}
                      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 flex-shrink-0 transition-opacity">
                        <button
                          onClick={() => handleStartEdit(item)}
                          title="修改"
                          className="text-[11px] text-slate-400 hover:text-cyan-400 p-0.5 cursor-pointer"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteItem(col.key, item.id)}
                          title="删除"
                          className="text-[11px] text-slate-400 hover:text-red-400 p-0.5 cursor-pointer"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* 底部清空按钮 */}
              <button
                onClick={() => handleClearCol(col.key)}
                className={`w-full py-2 text-xs font-semibold ${col.btnBg} transition cursor-pointer text-center`}
              >
                清空{col.label}
              </button>
            </div>
          );
        })}
      </div>

      {/* 生成结果展示区 */}
      {hasGenerated && (
        <div id="resultsSection" className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-lg">
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <span className="text-base font-bold text-white">🎉 生成结果</span>
              <span>共生成 <strong className="text-red-400 text-sm">{generatedTitles.length.toLocaleString()}</strong> 条</span>
              <span>筛选后 <strong className="text-emerald-400 text-sm">{filteredTitles.length.toLocaleString()}</strong> 条</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <input
                type="text"
                value={filterText}
                onChange={e => setFilterText(e.target.value)}
                placeholder="在结果中搜索..."
                className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-red-500 w-36"
              />
              <button
                onClick={copyAll}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition cursor-pointer ${
                  copied
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                    : 'bg-slate-800 border-slate-700 text-slate-200 hover:border-red-500/50 hover:text-red-400'
                }`}
              >
                {copied ? '✅ 已复制' : '📋 复制全部'}
              </button>
              <button
                onClick={() => exportFile('txt')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-300 text-xs transition cursor-pointer"
              >
                ⬇ 导出 TXT
              </button>
              <button
                onClick={() => exportFile('csv')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-300 text-xs transition cursor-pointer"
              >
                ⬇ 导出 CSV
              </button>
            </div>
          </div>

          {/* 标题表格/列表 */}
          <div className="rounded-xl bg-slate-900/60 border border-slate-800 overflow-hidden shadow-lg">
            <div className="max-h-[500px] overflow-y-auto divide-y divide-slate-800/60">
              {filteredTitles.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-sm">
                  没有找到匹配的标题
                </div>
              ) : (
                filteredTitles.map((t, idx) => (
                  <div
                    key={idx}
                    className="group flex items-center justify-between px-4 py-2.5 hover:bg-slate-800/40 transition"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1 mr-3">
                      <span className="text-[11px] text-slate-500 w-8 text-right font-mono flex-shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-sm text-slate-200 truncate">{t}</span>
                      <span className="text-[11px] text-slate-500 flex-shrink-0">
                        {t.length} 字
                      </span>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <button
                        onClick={() => sendToWriter(t)}
                        className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs hover:bg-emerald-500/25 transition cursor-pointer"
                        title="送入AI文章创作"
                      >
                        ✍️ 送入AI写作
                      </button>
                      <button
                        onClick={() => navigator.clipboard.writeText(t)}
                        className="px-2 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs transition cursor-pointer"
                      >
                        复制
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
