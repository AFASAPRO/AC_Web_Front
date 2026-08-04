import { defineStore } from 'pinia'
import {
  Globe2, Smartphone, Building2, BrainCircuit, Palette, Cloud,
  GitBranch, Plug, Database, Wrench, ShieldCheck, MessagesSquare,
} from 'lucide-vue-next'
import teamImage1 from '@/assets/images/1.png'
import teamImage2 from '@/assets/images/2.JPG'
import teamImage3 from '@/assets/images/3.png'
import teamImage5 from '@/assets/images/5.png'
import teamImage6 from '@/assets/images/6.png'

export const useContentStore = defineStore('content', {
  state: () => ({
    stats: [
      { key: 'projects', value: 240, suffix: '+' },
      { key: 'clients', value: 120, suffix: '+' },
      { key: 'countries', value: 18, suffix: '' },
      { key: 'years', value: 9, suffix: '+' },
    ],
    serviceIcons: [
      Globe2, Smartphone, Building2, BrainCircuit, Palette, Cloud,
      GitBranch, Plug, Database, Wrench, ShieldCheck, MessagesSquare,
    ],
    trustedLogos: [
      'Nexora', 'Vertex Labs', 'Orbital', 'Northwind', 'Halo Systems',
      'Cascade', 'Ironclad', 'Meridian', 'Lumen Works', 'Basecamp Co',
    ],
    portfolio: [
      { id: 1, slug: 'fintech-dashboard', title: 'Fintech Analytics Dashboard', category: 'web', tags: ['Vue', 'Node.js', 'PostgreSQL'], img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1400&auto=format&fit=crop' },
      { id: 2, slug: 'health-mobile-app', title: 'Telehealth Mobile Platform', category: 'mobile', tags: ['React Native', 'Firebase'], img: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1400&auto=format&fit=crop' },
      { id: 3, slug: 'ai-support-agent', title: 'AI Customer Support Agent', category: 'ai', tags: ['Python', 'LLM', 'Vector DB'], img: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1400&auto=format&fit=crop' },
      { id: 4, slug: 'cloud-migration', title: 'Enterprise Cloud Migration', category: 'cloud', tags: ['AWS', 'Terraform', 'Kubernetes'], img: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?q=80&w=1400&auto=format&fit=crop' },
      { id: 5, slug: 'logistics-platform', title: 'Real-time Logistics Platform', category: 'web', tags: ['Vue', 'GraphQL', 'Redis'], img: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=1400&auto=format&fit=crop' },
      { id: 6, slug: 'retail-app', title: 'Omnichannel Retail App', category: 'mobile', tags: ['Flutter', 'Stripe'], img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1400&auto=format&fit=crop' },
    ],
    testimonials: [
      { name: 'Sarah Whitfield', role: 'CEO, Nexora', quote: 'Nexora Company rebuilt our entire platform in twelve weeks. The quality bar was the highest we\u2019ve worked with.', avatar: 'https://i.pravatar.cc/120?img=32', rating: 5 },
      { name: 'David Okonkwo', role: 'CTO, Halo Systems', quote: 'Communication was flawless and the engineering was even better. Our uptime has never been more stable.', avatar: 'https://i.pravatar.cc/120?img=13', rating: 5 },
      { name: 'Amara Diallo', role: 'Founder, Lumen Works', quote: 'They think like product owners, not contractors. Every recommendation moved our metrics.', avatar: 'https://i.pravatar.cc/120?img=47', rating: 5 },
      { name: 'James Liu', role: 'VP Engineering, Vertex Labs', quote: 'From discovery to launch, Nexora Company felt like an extension of our own team.', avatar: 'https://i.pravatar.cc/120?img=52', rating: 5 },
    ],
    team: [
      { name: 'Mugisha Afani', role: 'Software Developer', experience: '7+ yrs', skills: ['Strategy', 'Product'], img: teamImage1 },
      { name: 'Mugisha Tumusifu Chretien', role: 'Lead Engineer', experience: '7+ yrs', skills: ['Data Analyst', 'Node.js'], img: teamImage2 },
      { name: 'Zirikana Elie', role: 'UX and UI Designer', experience: '6+ yrs', skills: ['Figma', 'Photoshop'], img: teamImage3 },
      { name: 'Nshizirungu Espoir', role: 'DevOps Lead', experience: '8+ yrs', skills: ['UI/UX', 'Branding'], img: '' },
      { name: 'Nshimiyimana David', role: 'Software Development Lead', experience: '8+ yrs', skills: ['AWS', 'Kubernetes'], img: teamImage5 },
      { name: 'Ice Gold', role: 'DevOps Lead', experience: '6+ yrs', skills: ['Operator', 'Analytics'], img: teamImage6 }
    ],
    blog: [
      { id: 1, slug: 'ai-in-software-engineering', title: 'The Rise of AI in Modern Software Engineering', category: 'AI & Machine Learning', date: '2026-02-07', img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop', excerpt: 'How applied AI is reshaping the software development lifecycle, from code generation to intelligent QA.' },
      { id: 2, slug: 'scaling-it-infrastructure', title: 'How Modern IT Infrastructure Scales Your Business', category: 'IT Solutions', date: '2026-02-07', img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop', excerpt: 'A practical framework for choosing infrastructure that grows with your business, not against it.' },
      { id: 3, slug: 'choosing-the-right-stack', title: 'Choosing the Right Technology Stack in 2026', category: 'IT Strategy', date: '2026-02-07', img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop', excerpt: 'Why the "best" stack is always the one that matches your team, timeline and growth curve.' },
    ],
    faqOpenIndex: 0,
  }),
  getters: {
    portfolioByCategory: (state) => (category) =>
      category === 'all' ? state.portfolio : state.portfolio.filter((p) => p.category === category),
  },
})
