import { useState, useMemo, useCallback } from 'react';

const PROVINCES = ['北京','上海','广州','深圳','杭州','南京','成都','武汉','西安','重庆','天津','苏州','郑州','长沙','东莞','佛山','宁波','合肥','青岛','厦门','昆明','济南','沈阳','大连','哈尔滨'];

type Formula = { id: string; label: string; desc: string; fn: (p:string,r:string,m:string,k:string,s:string) => string };

const FORMULAS: Formula[] = [
  { id:'a', label:'标准精准型', desc:'前缀+地域+修饰词+核心词+后缀', fn:(p,r,m,k,s)=>[p,r,m,k,s].filter(Boolean).join('') },
  { id:'b', label:'长尾流量型', desc:'修饰词+核心词+地域+后缀',       fn:(p,r,m,k,s)=>[m,k,r,s].filter(Boolean).join('') },
  { id:'c', label:'本地服务型', desc:'前缀+地域+核心词+修饰词+后缀',  fn:(p,r,m,k,s)=>[p,r,k,m,s].filter(Boolean).join('') },
  { id:'d', label:'核心词优先', desc:'核心词+地域+修饰词+后缀',        fn:(p,r,m,k,s)=>[k,r,m,s].filter(Boolean).join('') },
];

function parseLines(text: string): string[] {
  return text.split(/[\n,，]/).map(s => s.trim()).filter(Boolean);
}

function TextArea({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full px-3 py-2.5 rounded-lg bg-slate-900/80 border border-slate-700/60 text-slate-200 placeholder-slate-600 text-sm resize-none focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition font-mono leading-relaxed"
      />
      <p className="text-[11px] text-slate-600 mt-1">每行一个，支持逗号分隔</p>
    </div>
  );
}

export default function TitleGenerator() {
  const [keywords,   setKeywords]   = useState('激光切割机\n数控车床\n包装机械');
  const [modifiers,  setModifiers]  = useState('全自动\n小型\n工业级');
  const [prefixes,   setPrefixes]   = useState('【源头厂家】\n【现货供应】\n【批发直销】');
  const [suffixes,   setSuffixes]   = useState('价格优惠 欢迎咨询\n支持定制 量大从优\n厂家直供');
  const [selProv,    setSelProv]    = useState<string[]>(['北京','上海','广州','深圳']);
  const [customReg,  setCustomReg]  = useState('');
  const [formula,    setFormula]    = useState('a');
  const [maxLen,     setMaxLen]     = useState(40);
  const [maxCount,   setMaxCount]   = useState(500);
  const [dedupe,     setDedupe]     = useState(true);
  const [searchQ,    setSearchQ]    = useState('');
  const [copied,     setCopied]     = useState(false);

  const toggleProv = (p: string) =>
    setSelProv(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);

  const titles = useMemo(() => {
    const kws  = parseLines(keywords);
    const mods = ['', ...parseLines(modifiers)];
    const pres = ['', ...parseLines(prefixes)];
    const sufs = ['', ...parseLines(suffixes)];
    const regs = [...selProv, ...parseLines(customReg), ''];
    const form = FORMULAS.find(f => f.id === formula)!;
    const result: string[] = [];
    outer:
    for (const k of kws)
      for (const p of pres)
        for (const r of regs)
          for (const m of mods)
            for (const s of sufs) {
              const t = form.fn(p, r, m, k, s);
              if (t && t.length <= maxLen) result.push(t);
              if (result.length >= maxCount * 3) break outer;
            }
    let out = dedupe ? [...new Set(result)] : result;
    return out.slice(0, maxCount);
  }, [keywords, modifiers, prefixes, suffixes, selProv, customReg, formula, maxLen, maxCount, dedupe]);

  const filtered = useMemo(() =>
    searchQ ? titles.filter(t => t.includes(searchQ)) : titles,
    [titles, searchQ]);

  const copyAll = useCallback(() => {
    navigator.clipboard.writeText(filtered.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [filtered]);

  const exportFile = useCallback((ext: string) => {
    const content = ext === 'csv'
      ? filtered.map((t, i) => `${i + 1},"${t}"`).join('\n')
      : filtered.join('\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `seo-titles-${Date.now()}.${ext}`;
    a.click();
  }, [filtered]);

  const sendToWriter = useCallback(() => {
    if (!filtered.length) return;
    localStorage.setItem('ai_writer_title', filtered[0]);
    window.location.href = '/tools/ai-writer';
  }, [filtered]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左列：词库 */}
        <div className="rounded-xl bg-slate-900/60 border border-violet-500/20 p-5 space-y-4">
          <h3 className="text-sm font-bold text-violet-400 flex items-center gap-2">
            <span>📦</span> 词库配置
          </h3>
          <TextArea label="核心产品词 *" value={keywords}  onChange={setKeywords}  placeholder={"激光切割机\n数控车床\n包装机械"} />
          <TextArea label="修饰/属性词"   value={modifiers} onChange={setModifiers} placeholder={"全自动\n小型\n工业级"} />
          <TextArea label="营销前缀"       value={prefixes}  onChange={setPrefixes}  placeholder={"【源头厂家】\n【现货供应】"} />
          <TextArea label="营销后缀"       value={suffixes}  onChange={setSuffixes}  placeholder={"价格优惠 欢迎咨询\n支持定制"} />
        </div>

        {/* 右列：地域 + 参数 */}
        <div className="space-y-4">
          <div className="rounded-xl bg-slate-900/60 border border-cyan-500/20 p-5">
            <h3 className="text-sm font-bold text-cyan-400 flex items-center gap-2 mb-3"><span>📍</span> 地域词库</h3>
            <div className="flex gap-2 mb-3">
              <button onClick={() => setSelProv(PROVINCES)} className="text-[11px] px-2 py-1 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 transition">全选</button>
              <button onClick={() => setSelProv([])}        className="text-[11px] px-2 py-1 rounded bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 transition">清空</button>
              <span className="text-[11px] text-slate-500 self-center">已选 {selProv.length} 个</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {PROVINCES.map(p => (
                <button key={p} onClick={() => toggleProv(p)}
                  className={`text-xs px-2 py-0.5 rounded-md border transition ${selProv.includes(p) ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300' : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:border-slate-600'}`}>
                  {p}
                </button>
              ))}
            </div>
            <textarea value={customReg} onChange={e => setCustomReg(e.target.value)}
              placeholder="自定义城市/区县，每行一个" rows={2}
              className="w-full px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-700/60 text-slate-200 placeholder-slate-600 text-sm resize-none focus:outline-none focus:border-cyan-500/60 transition font-mono"/>
          </div>

          <div className="rounded-xl bg-slate-900/60 border border-emerald-500/20 p-5 space-y-4">
            <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2"><span>⚗️</span> 组合公式</h3>
            <div className="grid grid-cols-2 gap-2">
              {FORMULAS.map(f => (
                <button key={f.id} onClick={() => setFormula(f.id)}
                  className={`text-left p-3 rounded-lg border text-xs transition ${formula === f.id ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:border-slate-600'}`}>
                  <div className="font-semibold mb-0.5">{f.label}</div>
                  <div className="opacity-60 leading-tight">{f.desc}</div>
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 font-semibold mb-1 block">最大字数 <span className="text-emerald-400">{maxLen}</span></label>
                <input type="range" min={15} max={80} value={maxLen} onChange={e => setMaxLen(+e.target.value)} className="w-full accent-emerald-500"/>
              </div>
              <div>
                <label className="text-xs text-slate-400 font-semibold mb-1 block">最大条数 <span className="text-emerald-400">{maxCount}</span></label>
                <input type="range" min={50} max={5000} step={50} value={maxCount} onChange={e => setMaxCount(+e.target.value)} className="w-full accent-emerald-500"/>
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={dedupe} onChange={e => setDedupe(e.target.checked)} className="accent-emerald-500 w-4 h-4"/>
              <span className="text-xs text-slate-400">自动去重</span>
            </label>
          </div>
        </div>
      </div>

      {/* 统计 + 操作栏 */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span>共生成 <strong className="text-violet-400 text-sm">{titles.length.toLocaleString()}</strong> 条</span>
          <span>筛选后 <strong className="text-emerald-400 text-sm">{filtered.length.toLocaleString()}</strong> 条</span>
          <span>均长 <strong className="text-cyan-400">{filtered.length ? Math.round(filtered.reduce((a,t)=>a+t.length,0)/filtered.length) : 0}</strong> 字</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="搜索结果…"
            className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 placeholder-slate-600 text-xs focus:outline-none focus:border-violet-500/60 w-36 transition"/>
          <button onClick={sendToWriter} className="px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs hover:bg-emerald-500/25 transition flex items-center gap-1">
            <span>✍️</span> 送入AI写作
          </button>
          <button onClick={copyAll} className={`px-3 py-1.5 rounded-lg border text-xs transition ${copied ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-violet-500/40 hover:text-violet-400'}`}>
            {copied ? '✅ 已复制' : '📋 复制全部'}
          </button>
          <button onClick={() => exportFile('txt')} className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs hover:border-violet-500/40 hover:text-violet-400 transition">⬇ TXT</button>
          <button onClick={() => exportFile('csv')} className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs hover:border-violet-500/40 hover:text-violet-400 transition">⬇ CSV</button>
        </div>
      </div>

      {/* 结果列表 */}
      <div className="rounded-xl bg-slate-900/60 border border-slate-800 overflow-hidden">
        <div className="max-h-[500px] overflow-y-auto divide-y divide-slate-800/50">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              <p className="text-4xl mb-3">🏷️</p>
              <p className="text-sm">请填写核心产品词，标题将自动生成</p>
            </div>
          ) : filtered.map((t, i) => (
            <div key={i} className="group flex items-center justify-between px-4 py-2.5 hover:bg-slate-800/40 transition">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-[11px] text-slate-600 w-8 flex-shrink-0 text-right tabular-nums">{i+1}</span>
                <span className="text-sm text-slate-200 truncate">{t}</span>
                <span className="text-[11px] text-slate-600 flex-shrink-0">{t.length}字</span>
              </div>
              <button onClick={() => navigator.clipboard.writeText(t)}
                className="opacity-0 group-hover:opacity-100 flex-shrink-0 ml-3 text-[11px] px-2 py-0.5 rounded bg-slate-700 text-slate-400 hover:text-violet-400 transition">
                复制
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
