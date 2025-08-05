import { useState, useEffect } from 'react'

interface HeroContent {
  title: string
  subtitle: string
  logo: string
}

interface AboutContent {
  title: string
  description: string
}

interface FooterContent {
  orgName: string
  slogan: string
  license: string
  licenseDate: string
  location: string
  whatsapp: string
  email?: string
}

interface HomepageContent {
  hero: HeroContent
  about: AboutContent
  footer: FooterContent
}

const defaultContent: HomepageContent = {
  hero: {
    title: "ONG A.A.S",
    subtitle: "جمعية مدنية للتوعية التأمينية ومواكبة المطالبات",
    logo: "https://i.postimg.cc/mkjyN04T/5.png"
  },
  about: {
    title: "من نحن",
    description: "نحن جمعية مدنية غير ربحية مكرسة لنشر الوعي التأميني وحماية حقوق المؤمنين ومساعدتهم في الحصول على تعويضاتهم المستحقة."
  },
  footer: {
    orgName: "جمعية التأمين للتوعية",
    slogan: "التأمين وعي… والتعويض حق.",
    license: "FA010000360307202511232",
    licenseDate: "2025-07-04",
    location: "نواكشوط – موريتانيا",
    whatsapp: "+222 34 14 14 97",
    email: "info@ong-aas.mr"
  }
}

export function useHomepageContent() {
  const [content, setContent] = useState<HomepageContent>(defaultContent)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadContent = async () => {
      try {
        // Try to load content from markdown files
        const [heroResponse, aboutResponse, footerResponse] = await Promise.allSettled([
          fetch('/content/homepage/hero.md'),
          fetch('/content/homepage/about.md'),
          fetch('/content/homepage/footer.md')
        ])

        const newContent = { ...defaultContent }

        // Parse hero content
        if (heroResponse.status === 'fulfilled' && heroResponse.value.ok) {
          const heroText = await heroResponse.value.text()
          const heroMatch = heroText.match(/---\n([\s\S]*?)\n---/)
          if (heroMatch) {
            const heroYaml = heroMatch[1]
            const titleMatch = heroYaml.match(/title:\s*"([^"]*)"/)
            const subtitleMatch = heroYaml.match(/subtitle:\s*"([^"]*)"/)
            const logoMatch = heroYaml.match(/logo:\s*"([^"]*)"/)
            
            if (titleMatch) newContent.hero.title = titleMatch[1]
            if (subtitleMatch) newContent.hero.subtitle = subtitleMatch[1]
            if (logoMatch) newContent.hero.logo = logoMatch[1]
          }
        }

        // Parse about content
        if (aboutResponse.status === 'fulfilled' && aboutResponse.value.ok) {
          const aboutText = await aboutResponse.value.text()
          const aboutMatch = aboutText.match(/---\n([\s\S]*?)\n---/)
          if (aboutMatch) {
            const aboutYaml = aboutMatch[1]
            const titleMatch = aboutYaml.match(/title:\s*"([^"]*)"/)
            const descMatch = aboutYaml.match(/description:\s*\|\n([\s\S]*)/)
            
            if (titleMatch) newContent.about.title = titleMatch[1]
            if (descMatch) {
              newContent.about.description = descMatch[1]
                .split('\n')
                .map(line => line.replace(/^\s{2}/, ''))
                .join('\n')
                .trim()
            }
          }
        }

        // Parse footer content
        if (footerResponse.status === 'fulfilled' && footerResponse.value.ok) {
          const footerText = await footerResponse.value.text()
          const footerMatch = footerText.match(/---\n([\s\S]*?)\n---/)
          if (footerMatch) {
            const footerYaml = footerMatch[1]
            const orgNameMatch = footerYaml.match(/orgName:\s*"([^"]*)"/)
            const sloganMatch = footerYaml.match(/slogan:\s*"([^"]*)"/)
            const licenseMatch = footerYaml.match(/license:\s*"([^"]*)"/)
            const licenseDateMatch = footerYaml.match(/licenseDate:\s*"([^"]*)"/)
            const locationMatch = footerYaml.match(/location:\s*"([^"]*)"/)
            const whatsappMatch = footerYaml.match(/whatsapp:\s*"([^"]*)"/)
            const emailMatch = footerYaml.match(/email:\s*"([^"]*)"/)
            
            if (orgNameMatch) newContent.footer.orgName = orgNameMatch[1]
            if (sloganMatch) newContent.footer.slogan = sloganMatch[1]
            if (licenseMatch) newContent.footer.license = licenseMatch[1]
            if (licenseDateMatch) newContent.footer.licenseDate = licenseDateMatch[1]
            if (locationMatch) newContent.footer.location = locationMatch[1]
            if (whatsappMatch) newContent.footer.whatsapp = whatsappMatch[1]
            if (emailMatch) newContent.footer.email = emailMatch[1]
          }
        }

        setContent(newContent)
      } catch (error) {
        console.error('Error loading homepage content:', error)
        // Keep default content on error
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [])

  return { content, loading }
}