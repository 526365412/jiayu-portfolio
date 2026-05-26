export type Category = 'film' | 'design' | 'aigc'

export type Orientation = 'landscape' | 'portrait'

export interface Work {
  id: string
  category: Category
  title: string
  description: string
  client: string
  date: string
  tags: string[]
  cover: string
  videoUrl: string
  featured: boolean
  order: number
  orientation: Orientation
}

export interface HeroContent {
  heading: string
  subtitle: string
  scrollText: string
  videoUrl: string
  videoUrl2: string
}

export interface SectionContent {
  id: string
  title: string
  subtitle: string
  description: string
}

export interface FooterContent {
  name: string
  tagline: string
  email: string
  phone: string
  copyright: string
  socialLinks: {
    instagram: string
    twitter: string
    website: string
    xiaohongshu: string
    xinpianchang: string
    douyin: string
  }
}

export interface SiteMeta {
  siteTitle: string
  hero: HeroContent
  sections: SectionContent[]
  footer: FooterContent
}

export interface WorksData {
  meta: SiteMeta
  works: Work[]
}