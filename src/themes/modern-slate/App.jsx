import { useEffect, useMemo, useState } from 'react'
import './theme.css'

const tileData = [
  {
    id: 'impact',
    label: 'Impact',
    title: 'Revenue + Retention',
    stat: '+18% DTC conversion',
    summary: 'Designed pricing + onboarding experiments across streaming and marketplace products.',
    bullets: ['Scaled A/B testing cadence', 'Lifecycle journeys improved', 'Retention loops tightened'],
  },
  {
    id: 'growth',
    label: 'Growth',
    title: 'Acquisition + Activation',
    stat: '3x funnel velocity',
    summary: 'Built growth frameworks and cross-team rituals to accelerate learning.',
    bullets: ['North-star alignment', 'Experiment backlog system', 'Growth playbooks'],
  },
  {
    id: 'leadership',
    label: 'Leadership',
    title: 'Teams + Alignment',
    stat: '4 squads aligned',
    summary: 'Led multi-team roadmapping with exec stakeholders and product ops.',
    bullets: ['Quarterly planning rhythm', 'OKR clarity', 'Cross-team rituals'],
  },
  {
    id: 'craft',
    label: 'Craft',
    title: 'Discovery + Strategy',
    stat: '10+ yrs PM',
    summary: 'Customer research, insight synthesis, and product narratives that move teams.',
    bullets: ['Voice of customer', 'Problem framing', 'Narrative decks'],
  },
]

const statStrip = [
  { label: 'Years', value: '10+' },
  { label: 'Products', value: '7' },
  { label: 'Experiments', value: '120+' },
  { label: 'Teams', value: '4' },
]

const simulatorQuadrants = [
  { id: 'high-impact-low-effort', label: 'High Impact / Low Effort' },
  { id: 'high-impact-high-effort', label: 'High Impact / High Effort' },
  { id: 'low-impact-low-effort', label: 'Low Impact / Low Effort' },
  { id: 'low-impact-high-effort', label: 'Low Impact / High Effort' },
]

const simulatorTickets = [
  {
    id: 'ticket-onboarding',
    title: 'Onboarding drop-off',
    tag: 'Growth',
    stage: 'intake',
    detail: 'Signup to activation friction',
  },
  {
    id: 'ticket-paywall',
    title: 'Paywall copy refresh',
    tag: 'Monetization',
    stage: 'intake',
    detail: 'Clarity for upgrade paths',
  },
  {
    id: 'ticket-search',
    title: 'Search latency spike',
    tag: 'Quality',
    stage: 'refinement',
    detail: 'Retention risk on core flow',
  },
  {
    id: 'ticket-pro',
    title: 'Pro annual plan',
    tag: 'Revenue',
    stage: 'prioritize',
    quadrant: 'high-impact-low-effort',
    detail: 'Pricing ladder experiment',
  },
  {
    id: 'ticket-analytics',
    title: 'Analytics events audit',
    tag: 'Experimentation',
    stage: 'delivery',
    detail: 'Instrumentation cleanup',
  },
  {
    id: 'ticket-release',
    title: 'Lifecycle nudges',
    tag: 'Engagement',
    stage: 'release',
    detail: 'Triggered messaging updates',
  },
]

const matrixFilters = [
  { id: 'growth', label: 'Growth' },
  { id: 'monetization', label: 'Monetization' },
  { id: 'experimentation', label: 'Experimentation' },
  { id: 'leadership', label: 'Leadership' },
]

const matrixCards = [
  {
    id: 'retention-loop',
    title: 'Retention loop redesign',
    tag: 'growth',
    meta: 'Zattoo · 2023',
    outcome: '+14% weekly retention',
  },
  {
    id: 'pricing-ladder',
    title: 'Pricing ladder tests',
    tag: 'monetization',
    meta: 'Spark Networks · 2021',
    outcome: '+11% ARPU uplift',
  },
  {
    id: 'experiment-system',
    title: 'Experiment intake system',
    tag: 'experimentation',
    meta: 'Quandoo · 2018',
    outcome: '2x test velocity',
  },
  {
    id: 'stakeholder-rituals',
    title: 'Executive alignment rituals',
    tag: 'leadership',
    meta: 'Zattoo · 2024',
    outcome: 'Quarterly roadmap clarity',
  },
  {
    id: 'activation-sprints',
    title: 'Activation sprint series',
    tag: 'growth',
    meta: 'Spark Networks · 2020',
    outcome: '+9% activation rate',
  },
  {
    id: 'bundle-offers',
    title: 'Bundle offer experiments',
    tag: 'monetization',
    meta: 'Zattoo · 2022',
    outcome: '+6% plan upgrades',
  },
]

const simulatorSteps = [
  { id: 'intake', label: 'Intake', phase: 'discovery' },
  { id: 'refinement', label: 'Refinement', phase: 'discovery' },
  { id: 'prioritize', label: 'Prioritize', phase: 'discovery' },
  { id: 'delivery', label: 'Development', phase: 'delivery' },
  { id: 'release', label: 'Release', phase: 'delivery' },
]

const simulatorColumns = [
  { id: 'intake', label: 'Intake', type: 'stage', group: 'discovery' },
  { id: 'refinement', label: 'Refinement', type: 'stage', group: 'discovery' },
  { id: 'prioritize', label: 'Prioritize', type: 'prioritize', group: 'discovery' },
  { id: 'delivery', label: 'Development', type: 'stage', group: 'delivery' },
  { id: 'release', label: 'Release', type: 'stage', group: 'delivery' },
]

function App() {
  const [activeId, setActiveId] = useState(tileData[0]?.id)
  const [activeFilter, setActiveFilter] = useState(matrixFilters[0].id)
  const [tickets, setTickets] = useState(simulatorTickets)
  const [lastReleasedId, setLastReleasedId] = useState(null)
  const [lastMovedId, setLastMovedId] = useState(null)
  const [hasStarted, setHasStarted] = useState(false)
  const [showKickoff, setShowKickoff] = useState(false)
  const [showPrioritizeIntro, setShowPrioritizeIntro] = useState(false)
  const [hasShownPrioritizeIntro, setHasShownPrioritizeIntro] = useState(false)
  const [showDevelopmentIntro, setShowDevelopmentIntro] = useState(false)
  const [hasShownDevelopmentIntro, setHasShownDevelopmentIntro] = useState(false)
  const [simulationStep, setSimulationStep] = useState(0)
  const activeTile = useMemo(
    () => tileData.find((tile) => tile.id === activeId) || tileData[0],
    [activeId],
  )
  const filteredMatrix = useMemo(
    () => matrixCards.filter((card) => card.tag === activeFilter),
    [activeFilter],
  )
  const ticketsByStage = useMemo(() => {
    return simulatorSteps.reduce((acc, stage) => {
      acc[stage.id] = tickets.filter((ticket) => ticket.stage === stage.id)
      return acc
    }, {})
  }, [tickets])
  const discoveryColumns = useMemo(
    () => simulatorColumns.filter((column) => column.group === 'discovery'),
    [],
  )
  const deliveryColumns = useMemo(
    () => simulatorColumns.filter((column) => column.group === 'delivery'),
    [],
  )
  const prioritizedTickets = useMemo(
    () => tickets.filter((ticket) => ticket.stage === 'prioritize'),
    [tickets],
  )
  const releaseTickets = useMemo(
    () => tickets.filter((ticket) => ticket.stage === 'release'),
    [tickets],
  )
  const currentStep = simulatorSteps[simulationStep] ?? simulatorSteps[0]
  const currentStage = currentStep.id
  const stageOrder = useMemo(() => {
    return simulatorSteps.reduce((acc, step, index) => {
      acc[step.id] = index
      return acc
    }, {})
  }, [])
  const canDragTicket = (stage) => {
    if (!hasStarted) {
      return false
    }
    return stageOrder[stage] <= stageOrder[currentStage]
  }
  const activeTicketId = useMemo(() => {
    if (!hasStarted) {
      return null
    }
    const ticket = tickets.find((item) => item.stage === currentStage)
    return ticket?.id ?? null
  }, [tickets, currentStage, hasStarted])
  const lastIndex = simulatorSteps.length - 1
  const discoveryComplete = hasStarted && simulationStep >= 3
  const deliveryComplete = hasStarted && simulationStep >= 4

  useEffect(() => {
    if (hasStarted && currentStage === 'delivery' && !hasShownDevelopmentIntro) {
      setShowDevelopmentIntro(true)
      setHasShownDevelopmentIntro(true)
    }
  }, [hasStarted, currentStage, hasShownDevelopmentIntro])

  const handleDropStage = (stageId) => (event) => {
    event.preventDefault()
    if (!hasStarted) {
      return
    }
    const ticketId = event.dataTransfer.getData('text/plain')
    if (!ticketId) {
      return
    }
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId
          ? { ...ticket, stage: stageId, quadrant: undefined }
          : ticket,
      ),
    )
    setLastMovedId(ticketId)
    if (stageId === 'refinement' && !hasShownPrioritizeIntro) {
      setShowPrioritizeIntro(true)
      setHasShownPrioritizeIntro(true)
    }
    if (stageId === 'delivery' && !hasShownDevelopmentIntro) {
      setShowDevelopmentIntro(true)
      setHasShownDevelopmentIntro(true)
    }
    if (stageId === 'release') {
      setLastReleasedId(ticketId)
    }
    const nextIndex = simulatorSteps.findIndex((step) => step.id === stageId) + 1
    if (nextIndex < simulatorSteps.length) {
      setSimulationStep(nextIndex)
    }
  }

  const handleDropQuadrant = (quadrantId) => (event) => {
    event.preventDefault()
    if (!hasStarted) {
      return
    }
    const ticketId = event.dataTransfer.getData('text/plain')
    if (!ticketId) {
      return
    }
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId
          ? { ...ticket, stage: 'prioritize', quadrant: quadrantId }
          : ticket,
      ),
    )
    setLastMovedId(ticketId)
    const nextIndex = simulatorSteps.findIndex((step) => step.id === 'prioritize') + 1
    if (nextIndex < simulatorSteps.length) {
      setSimulationStep(nextIndex)
    }
  }

  const handleRunSprint = () => {
    if (!hasStarted) {
      setShowKickoff(true)
      return
    }
    if (simulationStep >= lastIndex) {
      setTickets(simulatorTickets)
      setSimulationStep(0)
      setLastReleasedId(null)
      setLastMovedId(null)
      setHasStarted(false)
      return
    }
    const nextIndex = Math.min(simulationStep + 1, lastIndex)
    const nextStage = simulatorSteps[nextIndex].id
    const ticketId = activeTicketId
    if (!ticketId) {
      return
    }
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              stage: nextStage,
              quadrant: nextStage === 'prioritize' ? 'high-impact-low-effort' : undefined,
            }
          : ticket,
      ),
    )
    setLastMovedId(ticketId)
    if (nextStage === 'refinement' && !hasShownPrioritizeIntro) {
      setShowPrioritizeIntro(true)
      setHasShownPrioritizeIntro(true)
    }
    if (nextStage === 'delivery' && !hasShownDevelopmentIntro) {
      setShowDevelopmentIntro(true)
      setHasShownDevelopmentIntro(true)
    }
    setSimulationStep(nextIndex)
    if (nextStage === 'release') {
      setLastReleasedId(ticketId)
    }
  }

  const moveTicketToStage = (ticketId, stageId) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              stage: stageId,
              quadrant: stageId === 'prioritize' ? 'high-impact-low-effort' : undefined,
            }
          : ticket,
      ),
    )
  }

  const handleStepNavigate = (direction) => {
    if (!hasStarted) {
      return
    }
    const targetIndex = Math.min(
      Math.max(simulationStep + direction, 0),
      lastIndex,
    )
    if (targetIndex === simulationStep) {
      return
    }
    const ticketId = activeTicketId
    if (!ticketId) {
      return
    }
    const targetStage = simulatorSteps[targetIndex].id
    moveTicketToStage(ticketId, targetStage)
    setLastMovedId(ticketId)
    setSimulationStep(targetIndex)
    if (targetStage === 'refinement' && !hasShownPrioritizeIntro) {
      setShowPrioritizeIntro(true)
      setHasShownPrioritizeIntro(true)
    }
    if (targetStage === 'release') {
      setLastReleasedId(ticketId)
    }
  }

  return (
    <main className="modern-shell">
      <div className="modern-page">
        <header className="modern-header">
          <div className="modern-profile">
            <div className="modern-avatar" aria-hidden="true">
              SS
            </div>
            <div>
              <p className="modern-name">Steven Sternberg</p>
              <p className="modern-role">Product Lead + Growth Strategist</p>
            </div>
          </div>
          <div className="modern-contact">
            <p className="modern-header-title">Contact</p>
            <p>stevensternberg2105@gmail.com</p>
            <p>Available on request</p>
            <p>Berlin, Germany</p>
          </div>
          <div className="modern-follow">
            <p className="modern-header-title">Follow</p>
            <div className="modern-socials">
              <span className="modern-social">in</span>
              <span className="modern-social">x</span>
              <span className="modern-social">be</span>
              <span className="modern-social">dr</span>
            </div>
            <p className="modern-header-title">Visit</p>
            <p>stevensternberg.github.io</p>
          </div>
        </header>

        <section className="modern-hero">
          <div>
            <p className="modern-kicker">Control Room</p>
            <h1>Product impact, live and measurable.</h1>
            <p className="modern-hero-copy">
              A modern command center for product outcomes, experiments, and leadership wins.
              Select a tile to open the active brief.
            </p>
          </div>
          <div className="modern-stat-strip">
            {statStrip.map((stat) => (
              <div key={stat.label} className="modern-stat">
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="control-room">
          <div className="control-tiles">
            {tileData.map((tile) => (
              <button
                key={tile.id}
                type="button"
                className={`control-tile${tile.id === activeTile.id ? ' is-active' : ''}`}
                onClick={() => setActiveId(tile.id)}
              >
                <div>
                  <p className="control-label">{tile.label}</p>
                  <h2>{tile.title}</h2>
                </div>
                <span className="control-stat">{tile.stat}</span>
              </button>
            ))}
          </div>

          <aside className="control-brief" aria-live="polite">
            <div className="control-brief-header">
              <div>
                <p className="control-label">Active brief</p>
                <h2>{activeTile.title}</h2>
              </div>
              <span className="control-live">Live</span>
            </div>
            <p className="control-summary">{activeTile.summary}</p>
            <ul className="control-list">
              {activeTile.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
            <div className="control-actions">
              <button type="button" className="modern-button">
                Open case study
              </button>
              <button type="button" className="modern-button modern-button--ghost">
                See timeline
              </button>
            </div>
          </aside>
        </section>

        <section className="control-grid">
          <div className="modern-card">
            <p className="modern-kicker">Experience Pulse</p>
            <div className="modern-list">
              <div>
                <p className="modern-item-title">Principal PM · Zattoo</p>
                <p className="modern-item-meta">2022-Present · DTC growth and monetization</p>
              </div>
              <div>
                <p className="modern-item-title">Senior PM · Spark Networks</p>
                <p className="modern-item-meta">2019-2022 · Subscription strategy</p>
              </div>
              <div>
                <p className="modern-item-title">Product Lead · Quandoo</p>
                <p className="modern-item-meta">2016-2019 · Marketplace playbooks</p>
              </div>
            </div>
          </div>
          <div className="modern-card">
            <p className="modern-kicker">Skill Signals</p>
            <div className="modern-signal">
              <span>Experiment design</span>
              <div className="modern-dots" aria-hidden="true">
                <span className="is-on" />
                <span className="is-on" />
                <span className="is-on" />
                <span className="is-on" />
                <span />
              </div>
            </div>
            <div className="modern-signal">
              <span>Monetization</span>
              <div className="modern-dots" aria-hidden="true">
                <span className="is-on" />
                <span className="is-on" />
                <span className="is-on" />
                <span />
                <span />
              </div>
            </div>
            <div className="modern-signal">
              <span>Leadership</span>
              <div className="modern-dots" aria-hidden="true">
                <span className="is-on" />
                <span className="is-on" />
                <span className="is-on" />
                <span className="is-on" />
                <span className="is-on" />
              </div>
            </div>
          </div>
          <div className="modern-card">
            <p className="modern-kicker">Highlights</p>
            <div className="modern-pill-row">
              <span className="modern-pill">North-star strategy</span>
              <span className="modern-pill">DTC monetization</span>
              <span className="modern-pill">Lifecycle growth</span>
              <span className="modern-pill">Experiment systems</span>
            </div>
          </div>
          <div className="modern-card modern-cta">
            <p className="modern-kicker">Next</p>
            <h2>Let’s build the next product win.</h2>
            <button type="button" className="modern-button">
              Schedule a chat
            </button>
          </div>
        </section>

        <section className="simulator">
          {showKickoff && (
            <div className="simulator-modal" role="dialog" aria-modal="true">
              <div className="simulator-modal-card">
                <p className="modern-kicker">New quarter</p>
                <h2>Discovery starts now.</h2>
                <p>
                  New requests just landed. It is up to you to align on the highest
                  outcomes and ship the right bets.
                </p>
                <button
                  type="button"
                  className="modern-button"
                  onClick={() => {
                    setShowKickoff(false)
                    setHasStarted(true)
                  }}
                >
                  Start discovery
                </button>
              </div>
            </div>
          )}
          {showPrioritizeIntro && (
            <div className="simulator-modal" role="dialog" aria-modal="true">
              <div className="simulator-modal-card">
                <p className="modern-kicker">Next step</p>
                <h2>Prioritization round</h2>
                <p>
                  Place the ticket into the impact/effort board. Choose wisely to
                  maximize outcomes this quarter.
                </p>
                <button
                  type="button"
                  className="modern-button"
                  onClick={() => setShowPrioritizeIntro(false)}
                >
                  Open the board
                </button>
              </div>
            </div>
          )}
          {showDevelopmentIntro && (
            <div className="simulator-modal" role="dialog" aria-modal="true">
              <div className="simulator-modal-card">
                <p className="modern-kicker">Next phase</p>
                <h2>Development sprint</h2>
                <p>
                  Lock the scope, align the squad, and ship the work. This is where
                  outcomes become real.
                </p>
                <button
                  type="button"
                  className="modern-button"
                  onClick={() => setShowDevelopmentIntro(false)}
                >
                  Enter development
                </button>
              </div>
            </div>
          )}
          <div className="simulator-header">
            <div>
              <p className="modern-kicker">Project Simulator</p>
              <h2>
                {currentStep.phase === 'discovery'
                  ? 'Discovery: find the biggest opportunity.'
                  : 'Delivery: ship the right bet.'}
              </h2>
              <p className="simulator-subtitle">
                Drag tickets across the pipeline. Drop into the impact/effort grid to
                prioritize.
              </p>
            </div>
            <div className="simulator-legend">
              <span>Drag</span>
              <span>Drop</span>
              <span>Decide</span>
              <span>Ship</span>
            </div>
          </div>

          <div className="simulator-body">
            <div className="simulator-main">
              <div className="simulator-grid">
                <div className="simulator-group simulator-group--discovery">
                  <div className="simulator-group-header">Discovery</div>
                  <div className="simulator-group-body simulator-group-body--discovery">
                    {discoveryColumns.map((column) => {
                      if (column.type === 'prioritize') {
                        return (
                          <div
                            key={column.id}
                            className={`simulator-column simulator-column--wide${
                              currentStage === column.id ? ' is-active' : ''
                            }`}
                          >
                            <div className="simulator-column-header">
                              <p>{column.label}</p>
                              <span>{prioritizedTickets.length}</span>
                            </div>
                            <div
                              className={`simulator-quadrants${
                                currentStage === column.id ? ' is-active' : ''
                              }`}
                            >
                              {simulatorQuadrants.map((quadrant) => (
                                <div
                                  key={quadrant.id}
                                  className="simulator-quadrant"
                                  onDragOver={(event) => event.preventDefault()}
                                  onDrop={handleDropQuadrant(quadrant.id)}
                                >
                                  <p>{quadrant.label}</p>
                                  <div className="simulator-quadrant-body">
                                    {prioritizedTickets
                                      .filter((ticket) => ticket.quadrant === quadrant.id)
                                      .map((ticket) => (
                                        <article
                                          key={ticket.id}
                                          className={`simulator-card simulator-card--tight${
                                            ticket.id === activeTicketId ? ' is-active' : ''
                                          }${ticket.id === lastMovedId ? ' is-moved' : ''}`}
                            draggable={canDragTicket(ticket.stage)}
                            aria-disabled={!canDragTicket(ticket.stage)}
                            onDragStart={(event) => {
                              event.dataTransfer.setData('text/plain', ticket.id)
                            }}
                                        >
                                          <p className="simulator-tag">{ticket.tag}</p>
                                          <h3>{ticket.title}</h3>
                                        </article>
                                      ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      }

                      return (
                        <div
                          key={column.id}
                          className={`simulator-column${
                            column.id === currentStage ? ' is-active' : ''
                          }`}
                          onDragOver={(event) => event.preventDefault()}
                          onDrop={handleDropStage(column.id)}
                        >
                          <div className="simulator-column-header">
                            <p>{column.label}</p>
                            <span>{ticketsByStage[column.id]?.length ?? 0}</span>
                          </div>
                          <div className="simulator-column-body">
                            {ticketsByStage[column.id]?.map((ticket) => (
                              <article
                                key={ticket.id}
                                className={`simulator-card${
                                  column.id === 'release' && ticket.id === lastReleasedId
                                    ? ' is-released'
                                    : ''
                                }${ticket.id === activeTicketId ? ' is-active' : ''}${
                                  ticket.id === lastMovedId ? ' is-moved' : ''
                                }`}
                        draggable={canDragTicket(ticket.stage)}
                        aria-disabled={!canDragTicket(ticket.stage)}
                        onDragStart={(event) => {
                          event.dataTransfer.setData('text/plain', ticket.id)
                        }}
                              >
                                <p className="simulator-tag">{ticket.tag}</p>
                                <h3>{ticket.title}</h3>
                                <p className="simulator-detail">{ticket.detail}</p>
                              </article>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="simulator-group simulator-group--delivery">
                  <div className="simulator-group-header">Delivery</div>
                  <div className="simulator-group-body simulator-group-body--delivery">
                    {deliveryColumns.map((column) => (
                      <div
                        key={column.id}
                        className={`simulator-column${
                          column.id === currentStage ? ' is-active' : ''
                        }`}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={handleDropStage(column.id)}
                      >
                        <div className="simulator-column-header">
                          <p>{column.label}</p>
                          <span>{ticketsByStage[column.id]?.length ?? 0}</span>
                        </div>
                        <div className="simulator-column-body">
                          {ticketsByStage[column.id]?.map((ticket) => (
                            <article
                              key={ticket.id}
                              className={`simulator-card${
                                column.id === 'release' && ticket.id === lastReleasedId
                                  ? ' is-released'
                                  : ''
                              }${ticket.id === activeTicketId ? ' is-active' : ''}${
                                ticket.id === lastMovedId ? ' is-moved' : ''
                              }`}
                            draggable={canDragTicket(ticket.stage)}
                            aria-disabled={!canDragTicket(ticket.stage)}
                            onDragStart={(event) => {
                              event.dataTransfer.setData('text/plain', ticket.id)
                            }}
                            >
                              <p className="simulator-tag">{ticket.tag}</p>
                              <h3>{ticket.title}</h3>
                              <p className="simulator-detail">{ticket.detail}</p>
                            </article>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <aside className="simulator-rail">
              <div className="simulator-rail-header">
                <p className="modern-kicker">Step guide</p>
                <p className="simulator-rail-step">
                  {simulationStep + 1}/{simulatorSteps.length}
                </p>
              </div>
              <div className="simulator-steps">
                {simulatorSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`simulator-step${
                      index === simulationStep ? ' is-current' : ''
                    }${index < simulationStep ? ' is-complete' : ''}`}
                  >
                    <span className="simulator-step-indicator" />
                    <span>{step.label}</span>
                  </div>
                ))}
              </div>
              <div className="simulator-nav">
                <button
                  type="button"
                  className="modern-button modern-button--ghost"
                  onClick={() => handleStepNavigate(-1)}
                  disabled={!hasStarted || simulationStep === 0}
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="modern-button modern-button--ghost"
                  onClick={() => handleStepNavigate(1)}
                  disabled={!hasStarted || simulationStep >= lastIndex}
                >
                  Next
                </button>
              </div>
              <button type="button" className="modern-button" onClick={handleRunSprint}>
                {!hasStarted
                  ? 'Start discovery'
                  : simulationStep >= lastIndex
                    ? 'Restart simulation'
                    : `Advance to ${simulatorSteps[simulationStep + 1].label}`}
              </button>
              <span className="simulator-outcome">
                Latest release: {releaseTickets.length}
              </span>
            </aside>
          </div>
          {(discoveryComplete || deliveryComplete) && (
            <div className="simulator-banner">
              {deliveryComplete
                ? 'Delivery complete. Release shipped.'
                : 'Discovery complete. Move into delivery.'}
            </div>
          )}
        </section>

        <section className="matrix-lab">
          <div className="matrix-header">
            <div>
              <p className="modern-kicker">Skill Matrix Lab</p>
              <h2>Filter by the work you care about.</h2>
              <p className="matrix-subtitle">
                Select a focus area to reveal the strongest outcomes and case studies.
              </p>
            </div>
            <div className="matrix-filters" role="tablist" aria-label="Skill filters">
              {matrixFilters.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  role="tab"
                  aria-selected={filter.id === activeFilter}
                  className={`matrix-filter${
                    filter.id === activeFilter ? ' is-active' : ''
                  }`}
                  onClick={() => setActiveFilter(filter.id)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="matrix-grid">
            {filteredMatrix.map((card) => (
              <article key={card.id} className="matrix-card">
                <p className="matrix-tag">{card.tag}</p>
                <h3>{card.title}</h3>
                <p className="matrix-meta">{card.meta}</p>
                <p className="matrix-outcome">{card.outcome}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

export default App
