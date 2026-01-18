import mybetLogo from '../assets/logos/mybet.jpg'
import sparkLogo from '../assets/logos/spark.png'
import zattooLogo from '../assets/logos/zattoo.png'
import quandooLogo from '../assets/logos/Quandoo.png'
import trophyAgile from '../assets/trophies/Agile.png'
import trophyMonetization from '../assets/trophies/Menetization.png'
import trophyExperimentation from '../assets/trophies/Experimentation.png'
import trophyLeadership from '../assets/trophies/Leadership.png'

const careerEntries = [
  {
    id: 'mybet-2012',
    logoKey: 'mybet-2012',
    company: 'mybet',
    role: 'Product Owner',
    period: 'Dec 2012 - Jun 2018',
    year: '2012',
    detail: 'Owned sportsbook delivery and integrations.',
    logo: mybetLogo,
    url: 'https://www.mybet.com/en',
    badge: 'Agile',
    stat: 'agile',
    lane: 0,
    trophy: trophyAgile,
    outcome: 'Established Scrum delivery cadence and tighter release quality.',
    highlights: [
      'Managed Scrum-based sportsbook development.',
      'Partnered with design, QA, and engineering.',
      'Conducted customer research and usability testing.',
      'Owned provider integrations and release approvals.',
    ],
  },
  {
    id: 'spark-2018',
    logoKey: 'spark-2018',
    company: 'Spark Networks',
    role: 'Product Manager Monetization',
    period: 'Jul 2018 - Jan 2020',
    year: '2018',
    detail: 'Migrated billing and affiliate programs.',
    logo: sparkLogo,
    url: 'https://www.spark.net/',
    badge: 'Monetization',
    stat: 'monetization',
    lane: 1,
    trophy: trophyMonetization,
    outcome: 'Improved revenue focus with KPI-driven backlog decisions.',
    highlights: [
      'Integrated billing systems on a new platform.',
      'Defined KPIs with BI and DWH support.',
      'Built monetization-focused backlog and stories.',
    ],
  },
  {
    id: 'quandoo-2020',
    logoKey: 'quandoo-2020',
    company: 'Quandoo',
    role: 'Senior Product Owner B2B',
    period: 'Feb 2020 - Jul 2020',
    year: '2020',
    detail: 'Delivered B2B vision and roadmap.',
    logo: quandooLogo,
    url: 'https://www.quandoo.de/en',
    badge: 'Experimentation',
    stat: 'experimentation',
    lane: 0,
    trophy: trophyExperimentation,
    outcome: 'Shipped MVPs faster through OKR + ICE prioritization.',
    highlights: [
      'Prioritized MVPs using OKRs and ICE model.',
      'Aligned stakeholders on milestones.',
      'Improved agile workflows and sprint efficiency.',
    ],
  },
  {
    id: 'zattoo',
    logoKey: 'zattoo',
    company: 'Zattoo',
    role: 'Principal Product Manager DTC',
    period: 'Aug 2020 - Present',
    year: '2020',
    detail: 'DTC growth, conversion optimization, and squad leadership.',
    logo: zattooLogo,
    url: 'https://zattoo.com/de',
    badge: 'Leadership',
    stat: 'leadership',
    lane: 1,
    trophy: trophyLeadership,
    outcome: 'Led DTC growth focus across strategy, experiments, and teams.',
    highlights: [
      'Principal Product Manager DTC (Jan 2025 - Present).',
      'Senior Product Owner DTC (Aug 2020 - Dec 2020).',
      'Optimized acquisition and retention via experiments.',
      'Defined roadmaps aligned with OKRs and product strategy.',
      'Built Tableau dashboards for decision-making.',
    ],
  },
]

export default careerEntries
