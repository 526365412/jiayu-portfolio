import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Work, WorksData, Category, Orientation, HeroContent, SectionContent, FooterContent } from '../types'

const ADMIN_PASSWORD = 'jiayu2026'
type AdminTab = 'works' | 'hero' | 'sections' | 'footer'

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [data, setData] = useState<WorksData | null>(null)

  useEffect(() => {
    if (localStorage.getItem('admin_auth') === 'true') setAuthenticated(true)
  }, [])

  useEffect(() => {
    if (authenticated) fetch('/data/works.json').then(r => r.json()).then(setData).catch(() => {})
  }, [authenticated])

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('admin_auth', 'true')
      setAuthenticated(true)
      setLoginError('')
    } else {
      setLoginError('密码错误')
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="liquid-glass rounded-2xl p-8 max-w-sm w-full text-center">
          <h1 className="text-2xl text-white mb-6 font-instrument italic">后台管理</h1>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()} placeholder="请输入密码"
            className="w-full liquid-glass rounded-lg px-6 py-3 text-white bg-transparent outline-none placeholder:text-white/40 mb-4" />
          {loginError && <p className="text-red-400 text-sm mb-4">{loginError}</p>}
          <button onClick={handleLogin} className="w-full bg-white text-black rounded-lg py-3 font-medium hover:bg-white/90 transition-colors">登录</button>
        </div>
      </div>
    )
  }

  return <AdminPanel data={data} setData={setData} />
}

function AdminPanel({ data, setData }: { data: WorksData | null; setData: (d: WorksData) => void }) {
  const [activeTab, setActiveTab] = useState<AdminTab>('works')

  if (!data) return <div className="min-h-screen bg-black text-white p-8">加载中...</div>

  const tabs = [
    { id: 'works' as AdminTab, label: '作品管理', icon: '🎬' },
    { id: 'hero' as AdminTab, label: 'Hero 区域', icon: '🏠' },
    { id: 'sections' as AdminTab, label: '版块标题', icon: '📝' },
    { id: 'footer' as AdminTab, label: '页脚信息', icon: '📋' },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="px-6 py-4 border-b border-white/10 bg-[#050505] sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-instrument italic">内容管理</h1>
          <div className="flex items-center gap-3">
            <button onClick={() => exportJson(data)} className="liquid-glass rounded-lg px-4 py-2 text-sm text-white/80 hover:text-white transition-colors">导出 JSON</button>
            <button onClick={() => copyJson(data)} className="liquid-glass rounded-lg px-4 py-2 text-sm text-white/80 hover:text-white transition-colors">复制 JSON</button>
            <a href="/" className="text-white/60 hover:text-white text-sm transition-colors ml-2">返回主页</a>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm transition-all whitespace-nowrap ${
                activeTab === tab.id ? 'bg-white/10 text-white border border-white/20' : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'
              }`}>
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            {activeTab === 'works' && <WorksManager data={data} setData={setData} />}
            {activeTab === 'hero' && <HeroEditor data={data} setData={setData} />}
            {activeTab === 'sections' && <SectionsEditor data={data} setData={setData} />}
            {activeTab === 'footer' && <FooterEditor data={data} setData={setData} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function WorksManager({ data, setData }: { data: WorksData; setData: (d: WorksData) => void }) {
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all')
  const [editingWork, setEditingWork] = useState<Work | null>(null)
  const [showForm, setShowForm] = useState(false)

  const categoryLabels: Record<Category | 'all', string> = { all: '全部', film: '影视', design: '设计', aigc: 'AIGC' }
  const filteredWorks = activeCategory === 'all' ? data.works : data.works.filter(w => w.category === activeCategory)

  const handleDelete = (id: string) => {
    if (!confirm('确定删除此作品？')) return
    setData({ ...data, works: data.works.filter(w => w.id !== id) })
  }

  const handleToggleFeatured = (id: string) => {
    setData({ ...data, works: data.works.map(w => w.id === id ? { ...w, featured: !w.featured } : w) })
  }

  const handleSave = (work: Work) => {
    const exists = data.works.find(w => w.id === work.id)
    const newWorks = exists ? data.works.map(w => w.id === work.id ? work : w) : [...data.works, work]
    setData({ ...data, works: newWorks })
    setShowForm(false)
    setEditingWork(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {(['all', 'film', 'design', 'aigc'] as const).map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${activeCategory === cat ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'}`}>
              {categoryLabels[cat]}
            </button>
          ))}
        </div>
        <button onClick={() => { setEditingWork(null); setShowForm(true) }} className="bg-white text-black rounded-lg px-5 py-2.5 text-sm font-medium hover:bg-white/90 transition-colors">+ 新增作品</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredWorks.map(work => (
          <div key={work.id} className="liquid-glass rounded-xl p-4 flex items-center gap-4">
            <img src={work.cover || `https://picsum.photos/seed/${work.id}/120/${work.orientation === 'portrait' ? '160' : '68'}`}
              alt={work.title} className={`rounded-lg flex-shrink-0 object-cover ${work.orientation === 'portrait' ? 'w-16 h-20' : 'w-28 h-16'}`} />
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{work.title}</p>
              <p className="text-white/50 text-xs">{work.client} · {work.date}</p>
              <span className="text-[10px] text-white/30 mt-1 inline-block">{work.orientation === 'portrait' ? '竖版' : '横版'}</span>
            </div>
            <div className="flex flex-col gap-2 flex-shrink-0">
              <button onClick={() => handleToggleFeatured(work.id)}
                className={`text-xs px-3 py-1 rounded-lg transition-colors ${work.featured ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
                {work.featured ? '精选' : '置顶'}
              </button>
              <button onClick={() => { setEditingWork(work); setShowForm(true) }} className="text-white/50 hover:text-white text-xs px-3 py-1 rounded-lg hover:bg-white/5 transition-colors">编辑</button>
              <button onClick={() => handleDelete(work.id)} className="text-red-400/50 hover:text-red-400 text-xs px-3 py-1 rounded-lg hover:bg-red-400/5 transition-colors">删除</button>
            </div>
          </div>
        ))}
      </div>

      {showForm && <WorkForm work={editingWork} onSave={handleSave} onClose={() => { setShowForm(false); setEditingWork(null) }} />}
    </div>
  )
}

function WorkForm({ work, onSave, onClose }: { work: Work | null; onSave: (w: Work) => void; onClose: () => void }) {
  const [form, setForm] = useState<Work>(work || {
    id: crypto.randomUUID(), category: 'film', title: '', description: '', client: '', date: '',
    tags: [], cover: '', videoUrl: '', featured: false, order: 0, orientation: 'landscape',
  })
  const [tagsInput, setTagsInput] = useState(work?.tags.join(', ') || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ ...form, tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean) })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <form onClick={e => e.stopPropagation()} onSubmit={handleSubmit}
        className="liquid-glass relative z-10 rounded-2xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto space-y-4">
        <h2 className="text-lg text-white mb-2 font-instrument italic">{work ? '编辑作品' : '新增作品'}</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-white/60 text-xs mb-1 block">分类</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value as Category })}
              className="w-full liquid-glass rounded-lg px-4 py-2 text-white bg-transparent outline-none">
              <option value="film" className="bg-black">影视作品</option>
              <option value="design" className="bg-black">平面设计</option>
              <option value="aigc" className="bg-black">AIGC</option>
            </select>
          </div>
          <div>
            <label className="text-white/60 text-xs mb-1 block">方向</label>
            <select value={form.orientation} onChange={e => setForm({ ...form, orientation: e.target.value as Orientation })}
              className="w-full liquid-glass rounded-lg px-4 py-2 text-white bg-transparent outline-none">
              <option value="landscape" className="bg-black">横版</option>
              <option value="portrait" className="bg-black">竖版</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-white/60 text-xs mb-1 block">标题</label>
          <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
            className="w-full liquid-glass rounded-lg px-4 py-2 text-white bg-transparent outline-none placeholder:text-white/30" placeholder="作品标题" />
        </div>
        <div>
          <label className="text-white/60 text-xs mb-1 block">描述</label>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
            className="w-full liquid-glass rounded-lg px-4 py-2 text-white bg-transparent outline-none placeholder:text-white/30 min-h-[80px] resize-y" placeholder="作品描述" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-white/60 text-xs mb-1 block">客户</label>
            <input value={form.client} onChange={e => setForm({ ...form, client: e.target.value })}
              className="w-full liquid-glass rounded-lg px-4 py-2 text-white bg-transparent outline-none placeholder:text-white/30" placeholder="客户名称" />
          </div>
          <div>
            <label className="text-white/60 text-xs mb-1 block">日期</label>
            <input value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
              className="w-full liquid-glass rounded-lg px-4 py-2 text-white bg-transparent outline-none placeholder:text-white/30" placeholder="2025" />
          </div>
        </div>
        <div>
          <label className="text-white/60 text-xs mb-1 block">标签（逗号分隔）</label>
          <input value={tagsInput} onChange={e => setTagsInput(e.target.value)}
            className="w-full liquid-glass rounded-lg px-4 py-2 text-white bg-transparent outline-none placeholder:text-white/30" placeholder="标签1, 标签2" />
        </div>
        <div>
          <label className="text-white/60 text-xs mb-1 block">封面图 URL</label>
          <input value={form.cover} onChange={e => setForm({ ...form, cover: e.target.value })}
            className="w-full liquid-glass rounded-lg px-4 py-2 text-white bg-transparent outline-none placeholder:text-white/30" placeholder="https://..." />
        </div>
        <div>
          <label className="text-white/60 text-xs mb-1 block">视频链接</label>
          <input value={form.videoUrl} onChange={e => setForm({ ...form, videoUrl: e.target.value })}
            className="w-full liquid-glass rounded-lg px-4 py-2 text-white bg-transparent outline-none placeholder:text-white/30" placeholder="https://..." />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-white/60 text-xs mb-1 block">排序权重</label>
            <input type="number" value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })}
              className="w-full liquid-glass rounded-lg px-4 py-2 text-white bg-transparent outline-none" />
          </div>
          <div className="flex items-center gap-3 pt-6">
            <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 accent-white" />
            <label htmlFor="featured" className="text-white/60 text-sm">精选作品</label>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" className="flex-1 bg-white text-black rounded-lg py-3 font-medium hover:bg-white/90 transition-colors">保存</button>
          <button type="button" onClick={onClose} className="flex-1 liquid-glass rounded-lg py-3 text-white/60 hover:text-white transition-colors">取消</button>
        </div>
      </form>
    </div>
  )
}

function HeroEditor({ data, setData }: { data: WorksData; setData: (d: WorksData) => void }) {
  const [hero, setHero] = useState<HeroContent>(data.meta.hero)

  const handleSave = () => {
    setData({ ...data, meta: { ...data.meta, hero } })
    alert('已保存')
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-lg text-white mb-6 font-instrument italic">Hero 区域内容</h2>
      <div className="space-y-4">
        <div>
          <label className="text-white/60 text-xs mb-1 block">主标题</label>
          <input value={hero.heading} onChange={e => setHero({ ...hero, heading: e.target.value })}
            className="w-full liquid-glass rounded-lg px-4 py-3 text-white bg-transparent outline-none" />
        </div>
        <div>
          <label className="text-white/60 text-xs mb-1 block">副标题</label>
          <input value={hero.subtitle} onChange={e => setHero({ ...hero, subtitle: e.target.value })}
            className="w-full liquid-glass rounded-lg px-4 py-3 text-white bg-transparent outline-none" />
        </div>
        <div>
          <label className="text-white/60 text-xs mb-1 block">滚动提示文字</label>
          <input value={hero.scrollText} onChange={e => setHero({ ...hero, scrollText: e.target.value })}
            className="w-full liquid-glass rounded-lg px-4 py-3 text-white bg-transparent outline-none" />
        </div>
        <div>
          <label className="text-white/60 text-xs mb-1 block">背景视频 URL</label>
          <input value={hero.videoUrl} onChange={e => setHero({ ...hero, videoUrl: e.target.value })}
            className="w-full liquid-glass rounded-lg px-4 py-3 text-white bg-transparent outline-none" placeholder="/videos/index.mp4 或 https://..." />
          <p className="text-white/30 text-[10px] mt-1">留空则显示纯黑背景</p>
        </div>
        <button onClick={handleSave} className="bg-white text-black rounded-lg px-8 py-3 font-medium hover:bg-white/90 transition-colors">保存</button>
      </div>
    </div>
  )
}

function SectionsEditor({ data, setData }: { data: WorksData; setData: (d: WorksData) => void }) {
  const [sections, setSections] = useState<SectionContent[]>(data.meta.sections)

  const handleSave = () => {
    setData({ ...data, meta: { ...data.meta, sections } })
    alert('已保存')
  }

  const updateSection = (index: number, field: keyof SectionContent, value: string) => {
    const newSections = [...sections]
    newSections[index] = { ...newSections[index], [field]: value }
    setSections(newSections)
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-lg text-white mb-6 font-instrument italic">版块标题内容</h2>
      <div className="space-y-6">
        {sections.map((section, index) => (
          <div key={section.id} className="liquid-glass rounded-xl p-6">
            <h3 className="text-white/40 text-xs mb-4 uppercase tracking-wider">版块 {index + 1}</h3>
            <div className="space-y-3">
              <div>
                <label className="text-white/40 text-xs mb-1 block">英文标题</label>
                <input value={section.subtitle} onChange={e => updateSection(index, 'subtitle', e.target.value)} className="w-full liquid-glass rounded-lg px-4 py-2 text-white bg-transparent outline-none" />
              </div>
              <div>
                <label className="text-white/40 text-xs mb-1 block">中文标题</label>
                <input value={section.title} onChange={e => updateSection(index, 'title', e.target.value)} className="w-full liquid-glass rounded-lg px-4 py-2 text-white bg-transparent outline-none" />
              </div>
              <div>
                <label className="text-white/40 text-xs mb-1 block">描述</label>
                <textarea value={section.description} onChange={e => updateSection(index, 'description', e.target.value)} className="w-full liquid-glass rounded-lg px-4 py-2 text-white bg-transparent outline-none min-h-[60px] resize-y" />
              </div>
            </div>
          </div>
        ))}
        <button onClick={handleSave} className="bg-white text-black rounded-lg px-8 py-3 font-medium hover:bg-white/90 transition-colors">保存</button>
      </div>
    </div>
  )
}

function FooterEditor({ data, setData }: { data: WorksData; setData: (d: WorksData) => void }) {
  const [footer, setFooter] = useState<FooterContent>(data.meta.footer)

  const handleSave = () => {
    setData({ ...data, meta: { ...data.meta, footer } })
    alert('已保存')
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-lg text-white mb-6 font-instrument italic">页脚信息</h2>
      <div className="space-y-4">
        <div>
          <label className="text-white/60 text-xs mb-1 block">姓名</label>
          <input value={footer.name} onChange={e => setFooter({ ...footer, name: e.target.value })} className="w-full liquid-glass rounded-lg px-4 py-3 text-white bg-transparent outline-none" />
        </div>
        <div>
          <label className="text-white/60 text-xs mb-1 block">标语</label>
          <input value={footer.tagline} onChange={e => setFooter({ ...footer, tagline: e.target.value })} className="w-full liquid-glass rounded-lg px-4 py-3 text-white bg-transparent outline-none" />
        </div>
        <div>
          <label className="text-white/60 text-xs mb-1 block">邮箱</label>
          <input value={footer.email} onChange={e => setFooter({ ...footer, email: e.target.value })} className="w-full liquid-glass rounded-lg px-4 py-3 text-white bg-transparent outline-none" />
        </div>
        <div>
          <label className="text-white/60 text-xs mb-1 block">电话</label>
          <input value={footer.phone} onChange={e => setFooter({ ...footer, phone: e.target.value })} className="w-full liquid-glass rounded-lg px-4 py-3 text-white bg-transparent outline-none" />
        </div>
        <div>
          <label className="text-white/60 text-xs mb-1 block">版权信息</label>
          <input value={footer.copyright} onChange={e => setFooter({ ...footer, copyright: e.target.value })} className="w-full liquid-glass rounded-lg px-4 py-3 text-white bg-transparent outline-none" />
        </div>
        <div className="pt-4 border-t border-white/10">
          <h3 className="text-white/40 text-xs mb-3 uppercase tracking-wider">社交媒体链接</h3>
          <div className="space-y-3">
            <div>
              <label className="text-white/40 text-xs mb-1 block">小红书</label>
              <input value={footer.socialLinks.xiaohongshu} onChange={e => setFooter({ ...footer, socialLinks: { ...footer.socialLinks, xiaohongshu: e.target.value } })} className="w-full liquid-glass rounded-lg px-4 py-2 text-white bg-transparent outline-none" />
            </div>
            <div>
              <label className="text-white/40 text-xs mb-1 block">新片场</label>
              <input value={footer.socialLinks.xinpianchang} onChange={e => setFooter({ ...footer, socialLinks: { ...footer.socialLinks, xinpianchang: e.target.value } })} className="w-full liquid-glass rounded-lg px-4 py-2 text-white bg-transparent outline-none" />
            </div>
            <div>
              <label className="text-white/40 text-xs mb-1 block">Instagram</label>
              <input value={footer.socialLinks.instagram} onChange={e => setFooter({ ...footer, socialLinks: { ...footer.socialLinks, instagram: e.target.value } })} className="w-full liquid-glass rounded-lg px-4 py-2 text-white bg-transparent outline-none" />
            </div>
            <div>
              <label className="text-white/40 text-xs mb-1 block">Twitter</label>
              <input value={footer.socialLinks.twitter} onChange={e => setFooter({ ...footer, socialLinks: { ...footer.socialLinks, twitter: e.target.value } })} className="w-full liquid-glass rounded-lg px-4 py-2 text-white bg-transparent outline-none" />
            </div>
            <div>
              <label className="text-white/40 text-xs mb-1 block">抖音</label>
              <input value={footer.socialLinks.douyin || ''} onChange={e => setFooter({ ...footer, socialLinks: { ...footer.socialLinks, douyin: e.target.value } })} className="w-full liquid-glass rounded-lg px-4 py-2 text-white bg-transparent outline-none" />
            </div>
            <div>
              <label className="text-white/40 text-xs mb-1 block">个人网站</label>
              <input value={footer.socialLinks.website} onChange={e => setFooter({ ...footer, socialLinks: { ...footer.socialLinks, website: e.target.value } })} className="w-full liquid-glass rounded-lg px-4 py-2 text-white bg-transparent outline-none" />
            </div>
          </div>
        </div>
        <button onClick={handleSave} className="bg-white text-black rounded-lg px-8 py-3 font-medium hover:bg-white/90 transition-colors">保存</button>
      </div>
    </div>
  )
}

function exportJson(data: WorksData) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = 'works.json'; a.click()
  URL.revokeObjectURL(url)
}

function copyJson(data: WorksData) {
  navigator.clipboard.writeText(JSON.stringify(data, null, 2)).then(() => alert('已复制到剪贴板')).catch(() => alert('复制失败'))
}