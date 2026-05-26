import Hero from '../components/Hero'
import Navbar from '../components/Navbar'
import SectionTitle from '../components/SectionTitle'
import WorkGrid from '../components/WorkGrid'
import SocialFooter from '../components/SocialFooter'
import MouseSpotlight from '../components/MouseSpotlight'
import { useWorks } from '../hooks/useWorks'

export default function Home() {
  const { data, loading, error, getWorksByCategory } = useWorks()

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/40 text-sm">加载中...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white/40">加载失败：{error || '未知错误'}</p>
      </div>
    )
  }

  const filmWorks = getWorksByCategory('film')
  const designWorks = getWorksByCategory('design')
  const aigcWorks = getWorksByCategory('aigc')

  return (
    <div className="min-h-screen bg-black text-white">
      <MouseSpotlight />
      <Navbar />
      <Hero content={data.meta.hero} />

      {/* 滚动内容区域：半透明背景 + 磨玻璃，让底层视频若隐若现 */}
      <div className="relative z-10">
        {/* 顶部渐变过渡 */}
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent via-black/50 to-black/80 pointer-events-none -translate-y-full" />

        {/* 内容区域：深色半透明 + 轻微模糊 */}
        <div className="bg-black/80 backdrop-blur-sm">
          <SectionTitle content={data.meta.sections[0]} />
          <WorkGrid works={filmWorks} />

          <SectionTitle content={data.meta.sections[1]} />
          <WorkGrid works={designWorks} />

          <SectionTitle content={data.meta.sections[2]} />
          <WorkGrid works={aigcWorks} />

          <SocialFooter content={data.meta.footer} />
        </div>
      </div>
    </div>
  )
}