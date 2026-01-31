import { useEffect, useMemo, useRef, useState } from 'react'
import headerBackground from '../../assets/design/modern_slate_design/Modern_slate_background.png'
import cameraIcon from '../../assets/design/modern_slate_design/camera.png'
import headphonesIcon from '../../assets/design/modern_slate_design/headphones.png'
import travelIcon from '../../assets/design/modern_slate_design/travelling.png'
import cspoBadge from '../../assets/certificates/434d64c7-6b7f-47ee-8cfd-0a4e84eb122e.png'
import discoveryBadge from '../../assets/certificates/product-discovery-certification.png'
import kmpiBadge from '../../assets/certificates/Lean_Kanban_University.png'
import kmpiPdf from '../../assets/certificates/KMPI_Sternberg.pdf'
import './theme.css'

const priorityLevels = [
  { id: 'high', label: 'High' },
  { id: 'mid', label: 'Medium' },
  { id: 'low', label: 'Low' },
]

const simulatorTickets = [
  {
    id: 'ticket-onboarding',
    title: 'Onboarding drop-off',
    tag: 'Growth',
    stage: 'intake',
    detail: 'Signup to activation friction',
    fit: 'high',
    impact: null,
    effort: null,
  },
  {
    id: 'ticket-paywall',
    title: 'Paywall copy refresh',
    tag: 'Monetization',
    stage: 'intake',
    detail: 'Clarity for upgrade paths',
    fit: 'med',
    impact: null,
    effort: null,
  },
  {
    id: 'ticket-search',
    title: 'Search latency spike',
    tag: 'Quality',
    stage: 'refinement',
    detail: 'Retention risk on core flow',
    fit: 'high',
    impact: null,
    effort: null,
  },
  {
    id: 'ticket-pro',
    title: 'Pro annual plan',
    tag: 'Revenue',
    stage: 'prioritize',
    quadrant: 'high-impact-low-effort',
    detail: 'Pricing ladder experiment',
    fit: 'med',
    impact: 'high',
    effort: 'low',
  },
  {
    id: 'ticket-analytics',
    title: 'Analytics events audit',
    tag: 'Experimentation',
    stage: 'delivery',
    detail: 'Instrumentation cleanup',
    fit: 'low',
    impact: null,
    effort: null,
  },
  {
    id: 'ticket-release',
    title: 'Lifecycle nudges',
    tag: 'Engagement',
    stage: 'release',
    detail: 'Triggered messaging updates',
    fit: 'high',
    impact: null,
    effort: null,
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
  const [tickets, setTickets] = useState(simulatorTickets)
  const [lastReleasedId, setLastReleasedId] = useState(null)
  const [lastMovedId, setLastMovedId] = useState(null)
  const [hasStarted, setHasStarted] = useState(false)
  const [showKickoff, setShowKickoff] = useState(false)
  const [showPrioritizeIntro, setShowPrioritizeIntro] = useState(false)
  const [hasShownPrioritizeIntro, setHasShownPrioritizeIntro] = useState(false)
  const [showRefinementIntro, setShowRefinementIntro] = useState(false)
  const [hasShownRefinementIntro, setHasShownRefinementIntro] = useState(false)
  const [showDevelopmentIntro, setShowDevelopmentIntro] = useState(false)
  const [hasShownDevelopmentIntro, setHasShownDevelopmentIntro] = useState(false)
  const [showReleaseIntro, setShowReleaseIntro] = useState(false)
  const [hasShownReleaseIntro, setHasShownReleaseIntro] = useState(false)
  const [showDiceModal, setShowDiceModal] = useState(false)
  const [pendingStep, setPendingStep] = useState(null)
  const [simulationStep, setSimulationStep] = useState(0)
  const [diceRolled, setDiceRolled] = useState(false)
  const [diceResult, setDiceResult] = useState(null)
  const [diceDisplay, setDiceDisplay] = useState(null)
  const [diceEffect, setDiceEffect] = useState('')
  const [diceRolling, setDiceRolling] = useState(false)
  const [nextRollBoost, setNextRollBoost] = useState(false)
  const [diceLog, setDiceLog] = useState([])
  const [movesAllowed, setMovesAllowed] = useState(0)
  const [movesUsed, setMovesUsed] = useState(0)
  const [bonusCards, setBonusCards] = useState(0)
  const [surpriseTicketId, setSurpriseTicketId] = useState(null)
  const [toastMessage, setToastMessage] = useState('')
  const [impactScore, setImpactScore] = useState(0)
  const [riskScore, setRiskScore] = useState(0)
  const [scoredIds, setScoredIds] = useState([])
  const [refinementRoll, setRefinementRoll] = useState(null)
  const [refinementInsight, setRefinementInsight] = useState('')
  const diceIntervalRef = useRef(null)
  const diceTimeoutRef = useRef(null)
  const targetScore = 8
  const lastIndex = simulatorSteps.length - 1
  const currentStep = simulatorSteps[simulationStep] ?? simulatorSteps[0]
  const currentStage = currentStep.id
  const requiredAction = !hasStarted
    ? 'start'
    : currentStage === 'refinement' && !refinementRoll
      ? 'research'
      : !diceRolled
        ? 'roll'
        : 'advance'
  const canAdvance =
    !hasStarted ||
    (simulationStep >= lastIndex) ||
    (diceRolled && movesUsed > 0)
  const highlightAdvance =
    requiredAction === 'start' || (requiredAction === 'advance' && canAdvance)
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
  const lastMovedStage = useMemo(() => {
    if (!lastMovedId) {
      return null
    }
    const ticket = tickets.find((item) => item.id === lastMovedId)
    return ticket?.stage ?? null
  }, [tickets, lastMovedId])

  useEffect(() => {
    return () => {
      if (diceIntervalRef.current) {
        clearInterval(diceIntervalRef.current)
      }
      if (diceTimeoutRef.current) {
        clearTimeout(diceTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (
      (requiredAction === 'roll' || requiredAction === 'research') &&
      !showDiceModal &&
      !diceRolling
    ) {
      setShowDiceModal(true)
    }
  }, [requiredAction, showDiceModal, diceRolling])
  const stageOrder = useMemo(() => {
    return simulatorSteps.reduce((acc, step, index) => {
      acc[step.id] = index
      return acc
    }, {})
  }, [])
  const canDragTicket = (ticket) => {
    if (!hasStarted) {
      return false
    }
    if (!diceRolled) {
      return false
    }
    if (movesUsed >= movesAllowed) {
      return false
    }
    if (surpriseTicketId) {
      return ticket.id === surpriseTicketId
    }
    return stageOrder[ticket.stage] <= stageOrder[currentStage]
  }
  const activeTicketId = useMemo(() => {
    if (!hasStarted) {
      return null
    }
    const ticket = tickets.find((item) => item.stage === currentStage)
    return ticket?.id ?? null
  }, [tickets, currentStage, hasStarted])
  const discoveryComplete = hasStarted && simulationStep >= 3
  const deliveryComplete = hasStarted && simulationStep >= 4

  const resetStepState = () => {
    if (diceIntervalRef.current) {
      clearInterval(diceIntervalRef.current)
      diceIntervalRef.current = null
    }
    if (diceTimeoutRef.current) {
      clearTimeout(diceTimeoutRef.current)
      diceTimeoutRef.current = null
    }
    setShowDiceModal(false)
    setDiceRolled(false)
    setDiceResult(null)
    setDiceDisplay(null)
    setDiceEffect('')
    setDiceRolling(false)
    setMovesAllowed(0)
    setMovesUsed(0)
    setRefinementRoll(null)
    setRefinementInsight('')
  }

  const getQuadrantLabel = (impact, effort) => {
    if (!impact || !effort) {
      return 'Unrated'
    }
    const impactLabel =
      impact === 'high' ? 'High Impact' : impact === 'mid' ? 'Mid Impact' : 'Low Impact'
    const effortLabel =
      effort === 'high' ? 'High Effort' : effort === 'mid' ? 'Mid Effort' : 'Low Effort'
    return `${impactLabel} / ${effortLabel}`
  }

  const handleDropStage = (stageId) => (event) => {
    event.preventDefault()
    if (!hasStarted) {
      return
    }
    if (!diceRolled || movesUsed >= movesAllowed) {
      return
    }
    const ticketId = event.dataTransfer.getData('text/plain')
    if (!ticketId) {
      return
    }
    if (surpriseTicketId && ticketId !== surpriseTicketId) {
      return
    }
    if (surpriseTicketId && stageId !== 'delivery') {
      setDiceEffect('Top-down request must go straight to Development.')
      return
    }
    if (stageId === 'release' && !scoredIds.includes(ticketId)) {
      const ticket = tickets.find((item) => item.id === ticketId)
      if (ticket) {
        const baseDelta = ticket.fit === 'high' ? 2 : ticket.fit === 'med' ? 1 : -1
        const impactDelta = ticket.impactDelta ?? 0
        const riskDelta = ticket.riskDelta ?? 0
        const delta = baseDelta + impactDelta
        setImpactScore((value) => value + delta)
        const riskHit = (ticket.fit === 'low' ? 1 : 0) + riskDelta
        if (riskHit > 0) {
          setRiskScore((value) => value + riskHit)
        }
        setScoredIds((prev) => [...prev, ticketId])
        setDiceLog((prev) => [
          ...prev,
          {
            id: `outcome-${ticketId}-${Date.now()}`,
            label: `${ticket.title} outcome`,
            effect:
              delta > 0
                ? `Impact +${delta}`
                : `Misfit surfaced (${delta})`,
          },
        ])
      }
    }
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              stage: stageId,
              quadrant: undefined,
              impact: stageId === 'prioritize' ? ticket.impact : null,
              effort: stageId === 'prioritize' ? ticket.effort : null,
            }
          : ticket,
      ),
    )
    setLastMovedId(ticketId)
    if (stageId === 'release') {
      setLastReleasedId(ticketId)
    }
    if (surpriseTicketId && ticketId === surpriseTicketId && stageId === 'delivery') {
      setImpactScore((value) => value - 1)
      setRiskScore((value) => value + 1)
      setDiceLog((prev) => [
        ...prev,
        {
          id: `surprise-${Date.now()}`,
          label: 'Top-down override',
          effect: 'Impact -1 · Risk +1',
        },
      ])
      setSurpriseTicketId(null)
    }
    setMovesUsed((value) => value + 1)
  }

  const handleDropQuadrant = (quadrantId) => (event) => {
    event.preventDefault()
    if (!hasStarted) {
      return
    }
    if (!diceRolled || movesUsed >= movesAllowed) {
      return
    }
    const ticketId = event.dataTransfer.getData('text/plain')
    if (!ticketId) {
      return
    }
    if (surpriseTicketId) {
      setDiceEffect('Top-down request blocks prioritization.')
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
    setMovesUsed((value) => value + 1)
  }

  const handleRunSprint = () => {
    if (!hasStarted) {
      setShowKickoff(true)
      return
    }
    if (!diceRolled) {
      setDiceEffect('Roll the dice before advancing.')
      return
    }
    if (simulationStep >= lastIndex) {
      setTickets(simulatorTickets)
      setSimulationStep(0)
      setLastReleasedId(null)
      setLastMovedId(null)
      setHasStarted(false)
      setBonusCards(0)
      setImpactScore(0)
      setRiskScore(0)
      setScoredIds([])
      setDiceLog([])
      setNextRollBoost(false)
      resetStepState()
      return
    }
    const nextIndex = Math.min(simulationStep + 1, lastIndex)
    const nextStage = simulatorSteps[nextIndex].id
    if (nextStage === 'refinement' && !hasShownRefinementIntro) {
      setPendingStep(nextIndex)
      setShowRefinementIntro(true)
      setHasShownRefinementIntro(true)
      return
    }
    if (nextStage === 'prioritize' && !hasShownPrioritizeIntro) {
      setPendingStep(nextIndex)
      setShowPrioritizeIntro(true)
      setHasShownPrioritizeIntro(true)
      return
    }
    if (nextStage === 'delivery' && !hasShownDevelopmentIntro) {
      setPendingStep(nextIndex)
      setShowDevelopmentIntro(true)
      setHasShownDevelopmentIntro(true)
      return
    }
    if (nextStage === 'release' && !hasShownReleaseIntro) {
      setPendingStep(nextIndex)
      setShowReleaseIntro(true)
      setHasShownReleaseIntro(true)
      return
    }
    setSimulationStep(nextIndex)
    resetStepState()
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
    setSimulationStep(targetIndex)
    resetStepState()
  }

  const handleConfirmPrioritizeIntro = () => {
    setShowPrioritizeIntro(false)
    if (pendingStep !== null) {
      setSimulationStep(pendingStep)
      setPendingStep(null)
      resetStepState()
    }
  }

  const handleConfirmRefinementIntro = () => {
    setShowRefinementIntro(false)
    if (pendingStep !== null) {
      setSimulationStep(pendingStep)
      setPendingStep(null)
      resetStepState()
    }
  }

  const handleConfirmDevelopmentIntro = () => {
    setShowDevelopmentIntro(false)
    if (pendingStep !== null) {
      setSimulationStep(pendingStep)
      setPendingStep(null)
      resetStepState()
    }
  }

  const handleConfirmReleaseIntro = () => {
    setShowReleaseIntro(false)
    if (pendingStep !== null) {
      setSimulationStep(pendingStep)
      setPendingStep(null)
      resetStepState()
    }
  }

  const handleRollDice = () => {
    if (diceRolling) {
      return
    }

    const rollDie = () => Math.floor(Math.random() * 6) + 1
    const getRoll = (boost) => {
      if (!boost) {
        return rollDie()
      }
      return Math.max(rollDie(), rollDie())
    }

    const finalizeRoll = (roll) => {
      const isPartial = roll >= 3 && roll <= 4
      const closeCount = roll === 5 ? 1 : roll === 6 ? 2 : 0
      const closedTickets = closeCount
        ? releaseTickets.slice(0, closeCount)
        : []
      const closedCount = closedTickets.length
      const surpriseId = roll === 5 ? `ticket-surprise-${Date.now()}` : null
      const surpriseTicket =
        roll === 5
          ? {
              id: surpriseId,
              title: 'Top-down compliance request',
              tag: 'Legal',
              stage: 'intake',
              detail: 'New regulation forces immediate change',
              fit: 'low',
              impact: null,
              effort: null,
            }
          : null
      let effect =
        roll <= 2
          ? 'Light sprint: move 1 ticket.'
          : roll <= 4
            ? 'Standard sprint: move 2 tickets.'
            : roll === 5
              ? 'Curveball: add 1 surprise request.'
              : 'Bonus card: auto-prioritize one ticket.'
      if (isPartial) {
        effect = `${effect} Momentum builds for next round.`
      }
      if (closeCount > 0) {
        effect =
          closedCount > 0
            ? `${effect} Closed ${closedCount} release ${closedCount === 1 ? 'ticket' : 'tickets'}.`
            : `${effect} No tickets in Release to close.`
      }
      setDiceResult(roll)
      setDiceDisplay(roll)
      setDiceEffect(effect)
      setDiceRolled(true)
      setMovesAllowed(roll <= 2 ? 1 : roll <= 4 ? 2 : 2)
      setMovesUsed(0)
      setNextRollBoost(isPartial)
      if (surpriseId) {
        setSurpriseTicketId(surpriseId)
      }
      setDiceLog((prev) => [
        ...prev,
        {
          id: `roll-${Date.now()}`,
          label: `Roll ${roll}`,
          effect,
        },
      ])
      if (roll === 5 || roll === 6) {
        setTickets((prev) => {
          let next = prev
          if (closeCount > 0) {
            const closeIds = new Set(
              prev
                .filter((ticket) => ticket.stage === 'release')
                .slice(0, closeCount)
                .map((ticket) => ticket.id),
            )
            if (closeIds.size > 0) {
              next = next.filter((ticket) => !closeIds.has(ticket.id))
            }
          }
          if (surpriseTicket) {
            next = [...next, surpriseTicket]
          }
          return next
        })
      }
      if (roll === 5) {
        setMovesAllowed(1)
        setMovesUsed(0)
        setToastMessage('Top-down request added. Move it straight to Development.')
        setSimulationStep(0)
      }
      if (roll === 6) {
        setBonusCards((value) => value + 1)
      }
    }

    if (diceIntervalRef.current) {
      clearInterval(diceIntervalRef.current)
    }
    if (diceTimeoutRef.current) {
      clearTimeout(diceTimeoutRef.current)
    }

    setDiceRolling(true)
    setDiceEffect('Rolling...')
    setDiceResult(null)
    setDiceDisplay(rollDie())

    const tickDurationMs = 110
    const rollDurationMs = 1200

    diceIntervalRef.current = setInterval(() => {
      setDiceDisplay(rollDie())
    }, tickDurationMs)

    diceTimeoutRef.current = setTimeout(() => {
      if (diceIntervalRef.current) {
        clearInterval(diceIntervalRef.current)
      }
      diceIntervalRef.current = null
      const roll = getRoll(nextRollBoost)
      finalizeRoll(roll)
      setDiceRolling(false)
    }, rollDurationMs)
  }

  const handleRollResearch = () => {
    if (!hasStarted || refinementRoll) {
      return
    }
    const roll = Math.floor(Math.random() * 6) + 1
    const clarity = roll <= 2 ? 'low' : roll <= 4 ? 'medium' : 'high'
    const insight =
      roll <= 2
        ? 'Mixed signals: needs deeper validation.'
        : roll <= 4
          ? 'Moderate clarity: pain exists, scope still fuzzy.'
          : 'Clear signal: high customer pain and urgency.'
    const impactDelta = roll >= 5 ? 1 : 0
    const riskDelta = roll <= 2 ? 1 : 0
    setRefinementRoll(roll)
    setRefinementInsight(insight)
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.stage === 'refinement'
          ? { ...ticket, clarity, impactDelta, riskDelta }
          : ticket,
      ),
    )
    setDiceLog((prev) => [
      ...prev,
      {
        id: `research-${Date.now()}`,
        label: `Research roll ${roll}`,
        effect: insight,
      },
    ])
  }

  const handleUseBonus = () => {
    if (bonusCards <= 0 || currentStage !== 'prioritize') {
      return
    }
    const ticket = tickets.find((item) => item.stage === 'refinement')
    if (!ticket) {
      return
    }
    setTickets((prev) =>
      prev.map((item) =>
        item.id === ticket.id
          ? { ...item, stage: 'prioritize', impact: 'high', effort: 'low' }
          : item,
      ),
    )
    setLastMovedId(ticket.id)
    setBonusCards((value) => value - 1)
    setMovesUsed((value) => value + 1)
  }

  return (
    <main className="modern-shell">
      <div className="modern-page">
        <header
          className="modern-header modern-header--hero"
          style={{ '--header-bg': `url(${headerBackground})` }}
        >
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

        <section className="resume-split">
          <aside className="resume-aside">
            <div className="resume-panel">
              <p className="modern-kicker">Profile</p>
              <h2>Strategic, data-driven product leader.</h2>
              <p className="resume-copy">
                Principal Product Manager with 10+ years in B2C and B2B SaaS,
                streaming, and digital marketplaces. Track record in conversion
                optimization, monetization, and agile product development with
                cross-functional leadership.
              </p>
              <p className="resume-copy">
                Certified Scrum Product Owner focused on user-centric innovation and
                measurable outcomes.
              </p>
              <div className="resume-divider" />
              <p className="modern-kicker">Hobbies</p>
              <div className="resume-hobbies">
                <div className="resume-hobby">
                  <img src={cameraIcon} alt="" aria-hidden="true" />
                  <span>Photography</span>
                </div>
                <div className="resume-hobby">
                  <img src={headphonesIcon} alt="" aria-hidden="true" />
                  <span>Music</span>
                </div>
                <div className="resume-hobby">
                  <img src={travelIcon} alt="" aria-hidden="true" />
                  <span>Travel</span>
                </div>
              </div>
              <div className="resume-divider" />
              <p className="modern-kicker">Certifications</p>
              <div className="resume-certs">
                <a className="resume-cert" href={kmpiPdf} target="_blank" rel="noreferrer">
                  <img src={cspoBadge} alt="CSPO Certified badge" />
                  <span>CSPO Certified</span>
                </a>
                <a className="resume-cert" href={kmpiPdf} target="_blank" rel="noreferrer">
                  <img src={discoveryBadge} alt="Product Discovery Certified badge" />
                  <span>Product Discovery</span>
                </a>
                <a
                  className="resume-cert resume-cert--link"
                  href={kmpiPdf}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={kmpiBadge} alt="KMPI Certificate badge" />
                  <span>KMPI Certificate (PDF)</span>
                </a>
              </div>
              <div className="resume-divider" />
              <p className="modern-kicker">Skills</p>
              <p className="resume-subtitle">Tools</p>
              <div className="resume-tags">
                <span>Jira</span>
                <span>Confluence</span>
                <span>Tableau</span>
                <span>Indicative</span>
                <span>SQL Developer</span>
                <span>Figma</span>
                <span>Adobe Photoshop</span>
              </div>
              <p className="resume-subtitle">Product Skills</p>
              <div className="resume-tags">
                <span>Agile</span>
                <span>Scrum</span>
                <span>A/B Testing</span>
                <span>Roadmapping</span>
                <span>KPI Definition</span>
              </div>
              <div className="resume-divider" />
              <p className="modern-kicker">Languages</p>
              <div className="resume-languages">
                <div>
                  <span>German</span>
                  <strong>Native</strong>
                </div>
                <div>
                  <span>English</span>
                  <strong>Fluent</strong>
                </div>
                <div>
                  <span>French</span>
                  <strong>Basic</strong>
                </div>
                <div>
                  <span>Spanish</span>
                  <strong>Basic</strong>
                </div>
              </div>
            </div>
          </aside>
          <div className="resume-main">
            <div className="resume-section">
              <p className="modern-kicker">Professional Experience</p>
              <div className="resume-timeline">
                <article className="resume-role">
                  <div className="resume-role-header">
                    <h3>Principal Product Manager DTC</h3>
                    <span>Jan 2025 - Present</span>
                  </div>
                  <p className="resume-role-meta">Zattoo Deutschland GmbH</p>
                  <ul>
                    <li>Drive strategic growth of DTC product value with company vision.</li>
                    <li>Translate high-level strategy into actionable squad direction.</li>
                    <li>Enable teams with context and qualified product decisions.</li>
                    <li>Balance constraints with stakeholder and customer needs.</li>
                  </ul>
                </article>
                <article className="resume-role">
                  <div className="resume-role-header">
                    <h3>Senior Product Owner</h3>
                    <span>Aug 2020 - Dec 2020</span>
                  </div>
                  <p className="resume-role-meta">Zattoo Deutschland GmbH</p>
                  <ul>
                    <li>Led the Conversion DTC squad to optimize acquisition and retention.</li>
                    <li>Defined and executed roadmaps aligned with OKRs and strategy.</li>
                    <li>Ran A/B tests to improve UX and drive conversions.</li>
                    <li>Built Tableau dashboards for data-driven decision-making.</li>
                  </ul>
                </article>
                <article className="resume-role">
                  <div className="resume-role-header">
                    <h3>Senior Product Owner B2B</h3>
                    <span>Feb 2020 - Jul 2020</span>
                  </div>
                  <p className="resume-role-meta">Quandoo GmbH</p>
                  <ul>
                    <li>Delivered a new B2B vision and roadmap in an agile environment.</li>
                    <li>Assessed features via OKRs and ICE to prioritize MVP delivery.</li>
                    <li>Aligned cross-functional teams on milestones and scope.</li>
                    <li>Improved workflows and sprint efficiency across teams.</li>
                  </ul>
                </article>
                <article className="resume-role">
                  <div className="resume-role-header">
                    <h3>Product Manager Monetization</h3>
                    <span>Jul 2018 - Jan 2020</span>
                  </div>
                  <p className="resume-role-meta">Spark Networks Services GmbH</p>
                  <ul>
                    <li>Led billing system and affiliate program integrations.</li>
                    <li>Defined KPIs and tracked performance with BI and DWH support.</li>
                    <li>Created backlog and user stories focused on monetization.</li>
                  </ul>
                </article>
                <article className="resume-role">
                  <div className="resume-role-header">
                    <h3>Product Owner</h3>
                    <span>Dec 2012 - Jun 2018</span>
                  </div>
                  <p className="resume-role-meta">mybet GmbH</p>
                  <ul>
                    <li>Managed sportsbook development in an agile (Scrum) setting.</li>
                    <li>Collaborated with design, QA, and engineering on delivery.</li>
                    <li>Conducted customer research and usability testing.</li>
                    <li>Handled third-party integrations and release approvals.</li>
                  </ul>
                </article>
              </div>
            </div>
            <div className="resume-section">
              <p className="modern-kicker">Education</p>
              <div className="resume-education">
                <div>
                  <h3>Bachelor of Arts in Media Design</h3>
                  <p>Mediadesign Hochschule Berlin · 2009 - 2011</p>
                </div>
              </div>
            </div>
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
                    resetStepState()
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
                  You are about to enter the impact/effort board. Pick the
                  highest-leverage bets for customers before you move forward.
                </p>
                <button
                  type="button"
                  className="modern-button"
                  onClick={handleConfirmPrioritizeIntro}
                >
                  Open the board
                </button>
              </div>
            </div>
          )}
          {showRefinementIntro && (
            <div className="simulator-modal" role="dialog" aria-modal="true">
              <div className="simulator-modal-card">
                <p className="modern-kicker">Next step</p>
                <h2>Refinement round</h2>
                <p>
                  Clarify the problem, sharpen the scope, and define the success metric.
                  The better the refinement, the stronger the outcome.
                </p>
                <button
                  type="button"
                  className="modern-button"
                  onClick={handleConfirmRefinementIntro}
                >
                  Enter refinement
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
                  onClick={handleConfirmDevelopmentIntro}
                >
                  Enter development
                </button>
              </div>
            </div>
          )}
          {showReleaseIntro && (
            <div className="simulator-modal" role="dialog" aria-modal="true">
              <div className="simulator-modal-card">
                <p className="modern-kicker">Final step</p>
                <h2>Release window</h2>
                <p>
                  Announce the update, measure the impact, and capture learnings for the
                  next quarter.
                </p>
                <button
                  type="button"
                  className="modern-button"
                  onClick={handleConfirmReleaseIntro}
                >
                  Ship release
                </button>
              </div>
            </div>
          )}
          {showDiceModal && (
            <div className="simulator-modal" role="dialog" aria-modal="true">
              <div className="simulator-modal-card">
                <p className="modern-kicker">Dice tray</p>
                <h2>Roll for outcomes</h2>
                <p>
                  {requiredAction === 'research'
                    ? 'Run research first to unlock your sprint roll.'
                    : 'Roll the sprint dice to set how many tickets move.'}
                </p>
                <div className="simulator-modal-actions">
                  {requiredAction === 'research' ? (
                    <button
                      type="button"
                      className="modern-button"
                      onClick={handleRollResearch}
                      disabled={Boolean(refinementRoll)}
                    >
                      Run research
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="modern-button"
                      onClick={handleRollDice}
                      disabled={diceRolled || diceRolling}
                    >
                      {currentStage === 'refinement' ? 'Start sprint roll' : 'Roll dice'}
                    </button>
                  )}
                </div>
                {(diceResult || diceRolling) && (
                  <div className="simulator-dice-result simulator-dice-result--modal">
                    <span className={`dice-face${diceRolling ? ' is-rolling' : ''}`}>
                      {diceDisplay}
                    </span>
                    <p>{diceEffect}</p>
                  </div>
                )}
                {currentStage === 'refinement' && (
                  <div className="simulator-panel">
                    {refinementRoll ? (
                      <div className="simulator-panel-note">
                        <span>Research roll {refinementRoll}</span>
                        <p>{refinementInsight}</p>
                      </div>
                    ) : (
                      <div className="simulator-panel-note">
                        <span>Research required</span>
                        <p>Run research to unlock sprint dice.</p>
                      </div>
                    )}
                  </div>
                )}
                <button
                  type="button"
                  className="modern-button modern-button--ghost"
                  onClick={() => setShowDiceModal(false)}
                >
                  Close
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
                    const isActive = currentStage === column.id
                    const isNext =
                      simulatorSteps[simulationStep + 1]?.id === column.id
                    const isCollapsed = column.id === 'prioritize' ? false : !(isActive || isNext)
                    const isHighlight = lastMovedStage === column.id
                    return (
                      <div
                        key={column.id}
                        className={`simulator-column simulator-column--wide${
                          isActive ? ' is-active' : ''
                        }${isNext ? ' is-next' : ''}${isCollapsed ? ' is-collapsed' : ''}${
                          isHighlight ? ' is-highlight' : ''
                        }`}
                      >
                        <div className="simulator-column-header">
                          <span className="simulator-column-state" aria-hidden="true">
                            {isCollapsed ? '▸' : '▾'}
                          </span>
                          <p>{column.label}</p>
                          <span className="simulator-column-count">
                            {prioritizedTickets.length}
                          </span>
                        </div>
                      <div className="simulator-column-body">
                        {prioritizedTickets.map((ticket) => (
                          <article
                            key={ticket.id}
                            className={`simulator-card${
                              ticket.id === activeTicketId ? ' is-active' : ''
                            }${ticket.id === lastMovedId ? ' is-moved' : ''}`}
                            draggable={canDragTicket(ticket)}
                            aria-disabled={!canDragTicket(ticket)}
                            onDragStart={(event) => {
                              event.dataTransfer.setData('text/plain', ticket.id)
                            }}
                          >
                            <p className="simulator-tag">{ticket.tag}</p>
                            <h3>{ticket.title}</h3>
                            {ticket.clarity && (
                              <div className="simulator-badges">
                                <span className={`simulator-badge simulator-badge--${ticket.clarity}`}>
                                  Clarity: {ticket.clarity}
                                </span>
                                {ticket.impactDelta > 0 && (
                                  <span className="simulator-badge simulator-badge--impact">
                                    Impact +{ticket.impactDelta}
                                  </span>
                                )}
                                {ticket.riskDelta > 0 && (
                                  <span className="simulator-badge simulator-badge--risk">
                                    Risk +{ticket.riskDelta}
                                  </span>
                                )}
                              </div>
                            )}
                            <div className="simulator-inline-controls">
                              <div className="simulator-inline-group">
                                <span>Impact</span>
                                <div className="simulator-inline-options">
                                  {priorityLevels.map((level) => (
                                    <button
                                      key={level.id}
                                      type="button"
                                      className={`simulator-inline-option${
                                        ticket.impact === level.id ? ' is-on' : ''
                                      }`}
                                      onClick={() => {
                                        if (!diceRolled) {
                                          return
                                        }
                                        setTickets((prev) =>
                                          prev.map((item) =>
                                            item.id === ticket.id
                                              ? { ...item, impact: level.id }
                                              : item,
                                          ),
                                        )
                                        setLastMovedId(ticket.id)
                                      }}
                                    >
                                      {level.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div className="simulator-inline-group">
                                <span>Effort</span>
                                <div className="simulator-inline-options">
                                  {priorityLevels.map((level) => (
                                    <button
                                      key={level.id}
                                      type="button"
                                      className={`simulator-inline-option${
                                        ticket.effort === level.id ? ' is-on' : ''
                                      }`}
                                      onClick={() => {
                                        if (!diceRolled) {
                                          return
                                        }
                                        setTickets((prev) =>
                                          prev.map((item) =>
                                            item.id === ticket.id
                                              ? { ...item, effort: level.id }
                                              : item,
                                          ),
                                        )
                                        setLastMovedId(ticket.id)
                                      }}
                                    >
                                      {level.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <span className="simulator-quad">
                                {getQuadrantLabel(ticket.impact, ticket.effort)}
                              </span>
                            </div>
                          </article>
                        ))}
                      </div>
                      </div>
                    )
                      }

                  const isActive = column.id === currentStage
                  const isNext =
                    simulatorSteps[simulationStep + 1]?.id === column.id
                  const isCollapsed = !(isActive || isNext)
                  const isHighlight = lastMovedStage === column.id
                  return (
                    <div
                      key={column.id}
                      className={`simulator-column${isActive ? ' is-active' : ''}${
                        isNext ? ' is-next' : ''
                      }${isCollapsed ? ' is-collapsed' : ''}${
                        isHighlight ? ' is-highlight' : ''
                      }`}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={handleDropStage(column.id)}
                    >
                      <div className="simulator-column-header">
                        <span className="simulator-column-state" aria-hidden="true">
                          {isCollapsed ? '▸' : '▾'}
                        </span>
                        <p>{column.label}</p>
                        <span className="simulator-column-count">
                          {ticketsByStage[column.id]?.length ?? 0}
                        </span>
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
                        draggable={canDragTicket(ticket)}
                        aria-disabled={!canDragTicket(ticket)}
                        onDragStart={(event) => {
                          event.dataTransfer.setData('text/plain', ticket.id)
                        }}
                              >
                                <p className="simulator-tag">{ticket.tag}</p>
                                <h3>{ticket.title}</h3>
                                {ticket.clarity && (
                                  <div className="simulator-badges">
                                    <span
                                      className={`simulator-badge simulator-badge--${ticket.clarity}`}
                                    >
                                      Clarity: {ticket.clarity}
                                    </span>
                                    {ticket.impactDelta > 0 && (
                                      <span className="simulator-badge simulator-badge--impact">
                                        Impact +{ticket.impactDelta}
                                      </span>
                                    )}
                                    {ticket.riskDelta > 0 && (
                                      <span className="simulator-badge simulator-badge--risk">
                                        Risk +{ticket.riskDelta}
                                      </span>
                                    )}
                                  </div>
                                )}
                          <p className="simulator-detail">{ticket.detail}</p>
                        </article>
                      ))}
                    </div>
                    {column.id === 'refinement' && (
                      <div className="simulator-panel">
                        {refinementRoll && (
                          <div className="simulator-panel-note">
                            <span>Roll {refinementRoll}</span>
                            <p>{refinementInsight}</p>
                          </div>
                        )}
                        {!refinementRoll && (
                          <div className="simulator-panel-note">
                            <span>Research pending</span>
                            <p>Roll the research dice to reveal customer clarity.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
                  </div>
                </div>

                <div className="simulator-group simulator-group--delivery">
                  <div className="simulator-group-header">Delivery</div>
                  <div className="simulator-group-body simulator-group-body--delivery">
                    {deliveryColumns.map((column) => {
                      const isHighlight = lastMovedStage === column.id
                      return (
                        <div
                          key={column.id}
                          className={`simulator-column${
                            column.id === currentStage ? ' is-active' : ''
                          }${
                            simulatorSteps[simulationStep + 1]?.id === column.id
                              ? ' is-next'
                              : ''
                          }${
                            column.id !== currentStage &&
                            simulatorSteps[simulationStep + 1]?.id !== column.id
                              ? ' is-collapsed'
                              : ''
                          }${isHighlight ? ' is-highlight' : ''}`}
                          onDragOver={(event) => event.preventDefault()}
                          onDrop={handleDropStage(column.id)}
                        >
                          <div className="simulator-column-header">
                            <span className="simulator-column-state" aria-hidden="true">
                              {column.id !== currentStage &&
                              simulatorSteps[simulationStep + 1]?.id !== column.id
                                ? '▸'
                                : '▾'}
                            </span>
                            <p>{column.label}</p>
                            <span className="simulator-column-count">
                              {ticketsByStage[column.id]?.length ?? 0}
                            </span>
                          </div>
                          <div className="simulator-column-body">
                            {ticketsByStage[column.id]?.map((ticket) => (
                              <article
                                key={ticket.id}
                                className={`simulator-card${
                                  column.id === 'release' &&
                                  ticket.id === lastReleasedId
                                    ? ' is-released'
                                    : ''
                                }${ticket.id === activeTicketId ? ' is-active' : ''}${
                                  ticket.id === lastMovedId ? ' is-moved' : ''
                                }`}
                                draggable={canDragTicket(ticket)}
                                aria-disabled={!canDragTicket(ticket)}
                                onDragStart={(event) => {
                                  event.dataTransfer.setData('text/plain', ticket.id)
                                }}
                              >
                                <p className="simulator-tag">{ticket.tag}</p>
                                <h3>{ticket.title}</h3>
                                {ticket.clarity && (
                                  <div className="simulator-badges">
                                    <span
                                      className={`simulator-badge simulator-badge--${ticket.clarity}`}
                                    >
                                      Clarity: {ticket.clarity}
                                    </span>
                                    {ticket.impactDelta > 0 && (
                                      <span className="simulator-badge simulator-badge--impact">
                                        Impact +{ticket.impactDelta}
                                      </span>
                                    )}
                                    {ticket.riskDelta > 0 && (
                                      <span className="simulator-badge simulator-badge--risk">
                                        Risk +{ticket.riskDelta}
                                      </span>
                                    )}
                                  </div>
                                )}
                                <p className="simulator-detail">{ticket.detail}</p>
                              </article>
                            ))}
                          </div>
                        </div>
                      )
                    })}
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
              <div className="simulator-dice">
                {diceResult && <p className="simulator-dice-summary">{diceEffect}</p>}
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
              <button
                type="button"
                className={`modern-button${highlightAdvance ? ' is-required' : ''}`}
                onClick={handleRunSprint}
                disabled={!canAdvance}
              >
                {!hasStarted
                  ? 'Start discovery'
                  : simulationStep >= lastIndex
                    ? 'Restart simulation'
                    : `Advance to ${simulatorSteps[simulationStep + 1].label}`}
              </button>
              {bonusCards > 0 && (
                <button
                  type="button"
                  className="modern-button modern-button--ghost"
                  onClick={handleUseBonus}
                  disabled={currentStage !== 'prioritize'}
                >
                  Use bonus card ({bonusCards})
                </button>
              )}
              {toastMessage && (
                <div className="simulator-toast">
                  <p>{toastMessage}</p>
                  <button
                    type="button"
                    className="simulator-toast-close"
                    onClick={() => setToastMessage('')}
                    aria-label="Dismiss notice"
                  >
                    ×
                  </button>
                </div>
              )}
              <span className="simulator-outcome">
                Latest release: {releaseTickets.length}
              </span>
              <div className="simulator-score">
                <span>Impact {impactScore}/{targetScore}</span>
                <span>Risk {riskScore}</span>
              </div>
              {diceLog.length > 0 && (
                <div className="simulator-log">
                  <p className="modern-kicker">Dice log</p>
                  <ul>
                    {diceLog.slice(-4).map((entry) => (
                      <li key={entry.id}>
                        <strong>{entry.label}</strong>
                        <span>{entry.effect}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
      </div>
    </main>
  )
}

export default App
