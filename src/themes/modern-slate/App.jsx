import { useState } from 'react'
import headerBackground from '../../assets/design/modern_slate_design/Modern_slate_background.png'
import cameraIcon from '../../assets/design/modern_slate_design/camera.png'
import headphonesIcon from '../../assets/design/modern_slate_design/headphones.png'
import travelIcon from '../../assets/design/modern_slate_design/travelling.png'
import cspoBadge from '../../assets/certificates/434d64c7-6b7f-47ee-8cfd-0a4e84eb122e.png'
import discoveryBadge from '../../assets/certificates/product-discovery-certification.png'
import kmpiBadge from '../../assets/certificates/Lean_Kanban_University.png'
import kmpiPdf from '../../assets/certificates/KMPI_Sternberg.pdf'
import './theme.css'

const cvTemplate = {
  name: 'Steven Sternberg',
  role: 'Principal Product Manager',
  initials: 'SS',
  photo: '/steven-headshot.jpg',
  email: 'stevensternberg2105@gmail.com',
  phone: '+49 176 32479377',
  location: 'Berlin, Germany',
  profile: [
    'Principal Product Manager with 10+ years of experience turning complex product problems into clear roadmap decisions and measurable outcomes.',
    'Background across B2C and B2B SaaS, including subscription products, internal workflows, and marketplace environments.',
    'Strong in cross-functional delivery across product, design, engineering, analytics, and commercial stakeholders, with a hands-on, data-informed approach to product development and practical AI tool usage in day-to-day product work.',
  ],
  socials: [
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/steven-sternberg-10180691/',
      text: 'linkedin.com/in/steven-sternberg-10180691',
    },
    {
      label: 'Portfolio (Pip-Boy)',
      href: 'https://stevensternberg.github.io/portfolio-game/pip-boy/',
      text: 'stevensternberg.github.io/portfolio-game/pip-boy/',
    },
  ],
  hobbies: [
    { icon: cameraIcon, label: 'Photography' },
    { icon: headphonesIcon, label: 'Music & Podcasts' },
    { icon: travelIcon, label: 'Travel' },
  ],
  certifications: [
    { label: 'Kanban Management Professional', image: kmpiBadge, href: kmpiPdf },
    { label: 'Certified Scrum Product Owner', image: cspoBadge, href: kmpiPdf },
    { label: 'Pendo Product Discovery', image: discoveryBadge, href: kmpiPdf },
  ],
  tools: ['Jira', 'Confluence', 'Tableau', 'SQL Developer', 'Figma', 'AI Coding Agents'],
  productSkills: [
    'AI-Assisted Product Development',
    'B2C Product Management',
    'Product Analytics',
    'Roadmapping',
    'Prioritization',
    'Experimentation',
    'A/B Testing',
    'Workflow Optimization',
    'Technical Stakeholder Collaboration',
    'Stakeholder Management',
    'Data-Informed Decision Making',
    'Cross-Functional Delivery',
  ],
  aiWorkflow: [
    'Use AI tools to speed up PRD drafts, experiment plans, and product documentation.',
    'Summarize feedback, notes, and themes to support faster decision-making.',
    'Automate recurring reporting and roadmap communication tasks.',
  ],
  experience: [
    {
      title: 'Principal Product Manager DTC',
      company: 'Zattoo',
      period: 'Jan 2025 - Present',
      bullets: [
        'Own strategy and roadmap for core subscription journeys across acquisition, conversion, and retention.',
        'Drive iterative product development through experimentation, analytics, and structured prioritization.',
        'Align design, engineering, analytics, and business stakeholders on priorities, dependencies, and delivery sequencing.',
      ],
    },
    {
      title: 'Senior Product Owner DTC',
      company: 'Zattoo',
      period: 'Aug 2020 - Dec 2024',
      bullets: [
        'Defined and executed roadmaps for complex customer journeys with clear business goals and user needs.',
        'Improved funnel performance through continuous A/B testing and data-informed iteration.',
        'Balanced customer experience, conversion goals, and operational constraints in onboarding and subscription flows.',
        'Used dashboards and behavioral data to support prioritization, product direction, and cross-team decision-making.',
      ],
    },
    {
      title: 'Senior Product Owner B2B',
      company: 'Quandoo',
      period: 'Feb 2020 - Jul 2020',
      bullets: [
        'Owned B2B product roadmap for restaurant-facing workflows with strong stakeholder alignment.',
        'Prioritized MVPs using OKRs and ICE to improve delivery focus and learning speed.',
        'Improved team workflows and sprint efficiency in a fast-moving B2B product environment.',
      ],
    },
    {
      title: 'Product Manager Monetization',
      company: 'Spark Networks',
      period: 'Jul 2018 - Jan 2020',
      bullets: [
        'Integrated billing systems on a new platform and improved monetization flows.',
        'Delivered payment-related features under legal constraints, including compliant handling of payment data and clear cancellation options.',
        'Defined KPIs with BI and DWH support to inform roadmap decisions.',
        'Built monetization-focused backlogs and user stories with engineering and stakeholders in a technically complex environment.',
      ],
    },
    {
      title: 'Product Owner',
      company: 'mybet',
      period: 'Dec 2012 - Jun 2018',
      bullets: [
        'Managed Scrum-based sportsbook development from planning through release.',
        'Worked closely with design, QA, and engineering on customer-facing improvements and workflow decisions.',
        'Owned third-party provider integrations and release approvals in a technical product environment.',
      ],
    },
  ],
  education: {
    degree: 'BA Media Design',
    school: 'Mediadesign Hochschule Berlin',
    period: '2009 - 2011',
  },
  languages: [
    { language: 'English', level: 'Fluent' },
    { language: 'German', level: 'Native' },
    { language: 'French', level: 'Basic' },
    { language: 'Spanish', level: 'Basic' },
  ],
}

function App() {
  const [avatarLoadFailed, setAvatarLoadFailed] = useState(false)
  const showPhoto = Boolean(cvTemplate.photo) && !avatarLoadFailed

  return (
    <main className="modern-shell">
      <div className="modern-page">
        <header
          className="modern-header modern-header--hero"
          style={{ '--header-bg': `url(${headerBackground})` }}
        >
          <div className="modern-profile">
            <div className="modern-avatar" aria-hidden="true">
              {showPhoto ? (
                <img
                  src={cvTemplate.photo}
                  alt=""
                  onError={() => setAvatarLoadFailed(true)}
                />
              ) : (
                cvTemplate.initials
              )}
            </div>
            <div>
              <p className="modern-name">{cvTemplate.name}</p>
              <p className="modern-role">{cvTemplate.role}</p>
            </div>
          </div>

          <div className="modern-contact">
            <p className="modern-header-title">Contact</p>
            <p>{cvTemplate.email}</p>
            <p>{cvTemplate.phone}</p>
            <p>{cvTemplate.location}</p>
          </div>

          <div className="modern-follow">
            <p className="modern-header-title">Follow</p>
            <div className="modern-link-list">
              {cvTemplate.socials.map((item) => (
                <p key={item.href} className="modern-link-row">
                  <strong>{item.label}</strong>
                  <a href={item.href} target="_blank" rel="noreferrer">
                    {item.text}
                  </a>
                </p>
              ))}
            </div>
          </div>
        </header>

        <section className="resume-split">
          <aside className="resume-aside">
            <div className="resume-panel">
              <p className="modern-kicker">Profile</p>
              <h2>About Me</h2>
              {cvTemplate.profile.map((line) => (
                <p key={line} className="resume-copy">
                  {line}
                </p>
              ))}

              <div className="resume-divider" />

              <p className="modern-kicker">Skills</p>
              <p className="resume-subtitle">Product Skills</p>
              <div className="resume-tags">
                {cvTemplate.productSkills.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>

              <p className="resume-subtitle">Tools</p>
              <div className="resume-tags">
                {cvTemplate.tools.map((tool) => (
                  <span key={tool}>{tool}</span>
                ))}
              </div>

              <div className="resume-divider" />

              <p className="modern-kicker">Interests</p>
              <div className="resume-hobbies">
                {cvTemplate.hobbies.map((hobby) => (
                  <div key={hobby.label} className="resume-hobby">
                    <img src={hobby.icon} alt="" aria-hidden="true" />
                    <span>{hobby.label}</span>
                  </div>
                ))}
              </div>

              <div className="resume-divider" />

              <p className="modern-kicker">Certifications</p>
              <div className="resume-certs">
                {cvTemplate.certifications.map((cert) => (
                  <a key={cert.label} className="resume-cert" href={cert.href} target="_blank" rel="noreferrer">
                    <img src={cert.image} alt={cert.label} />
                    <span>{cert.label}</span>
                  </a>
                ))}
              </div>

            </div>
          </aside>

          <div className="resume-main">
            <div className="resume-section">
              <p className="modern-kicker">Professional Experience</p>
              <div className="resume-timeline">
                {cvTemplate.experience.map((role) => (
                  <article key={`${role.title}-${role.period}`} className="resume-role">
                    <div className="resume-role-header">
                      <h3>{role.title}</h3>
                      <span>{role.period}</span>
                    </div>
                    <p className="resume-role-meta">{role.company}</p>
                    <ul>
                      {role.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>

            <div className="resume-section">
              <p className="modern-kicker">Education</p>
              <div className="resume-education">
                <h3>{cvTemplate.education.degree}</h3>
                <p>{cvTemplate.education.school}</p>
                <p>{cvTemplate.education.period}</p>
              </div>

              <div className="resume-divider" />

              <p className="modern-kicker">Languages</p>
              <div className="resume-languages">
                {cvTemplate.languages.map((entry) => (
                  <div key={entry.language}>
                    <span>{entry.language}</span>
                    <strong>{entry.level}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="resume-section">
              <p className="modern-kicker">AI Tools</p>
              <ul className="resume-ai-list">
                {cvTemplate.aiWorkflow.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default App
