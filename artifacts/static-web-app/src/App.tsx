import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import {
  ArrowLeft, ArrowRight, BarChart3, BookOpen, Bot, Check, ChevronRight, CircleHelp,
  ClipboardCheck, FileText, GraduationCap, LayoutDashboard, Lightbulb, MessageCircle,
  Play, Send, Sparkles, Target, Users, X, Zap,
} from 'lucide-react';

type Screen = 'landing' | 'student' | 'admin';
type StudentView = 'subject' | 'group' | 'unit' | 'lesson';
type Phase = 'genesis' | 'transition' | 'metacognition';

const quotes = [
  ['Learning is not a product of teaching. Learning is a product of the activity of learners.', 'John Holt'],
  ['The mind is not a vessel to be filled but a fire to be kindled.', 'Plutarch'],
  ['We do not learn from experience. We learn from reflecting on experience.', 'John Dewey'],
  ['The important thing is not to stop questioning. Curiosity has its own reason for existing.', 'Albert Einstein'],
];

const lessons = [
  { id: 1, title: 'Meaning of Educational Psychology', short: 'Meaning & foundations', description: 'Trace the relationship between education and psychology, then notice how human behaviour begins with sensation, perception, and conception.' },
  { id: 2, title: 'Schools of Educational Psychology', short: 'Schools of thought', description: 'Compare behaviourism, Gestalt, and psycho-analysis as distinct lenses for understanding learning.' },
  { id: 3, title: 'Methods of Inquiry in Psychology', short: 'Methods of inquiry', description: 'Choose an appropriate method — observation, experimentation, case study, survey, or correlation — for a research question.' },
];

const strategies = ['Concept mapping', 'Feynman technique', 'Method of loci', 'Retrieval practice'];

function Brand({ dark = false }: { dark?: boolean }) {
  return <span className="brand"><span className="brand-mark" /><span className="brand-copy">3 Phasic Meta Learn</span></span>;
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return <div className="toast" role="status"><Check size={16} /><span>{message}</span><button onClick={onClose} aria-label="Dismiss notification"><X size={15} /></button></div>;
}

function Landing({ onEnter }: { onEnter: (role: 'student' | 'admin') => void }) {
  const [quote, setQuote] = useState(quotes[0]);
  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);
  return <main className="landing">
    <header className="landing-header">
      <Brand />
      <nav className="landing-nav"><span className="micro">Research prototype · RAC meeting demo</span><button className="outline-button" onClick={() => onEnter('admin')} data-testid="button-enter-admin"><LayoutDashboard size={15} /> Admin view</button></nav>
    </header>
    <section className="landing-main">
      <div className="landing-grid">
        <div className="landing-copy">
          <span className="eyebrow">A visible architecture for learning</span>
          <h1>Learn in<br /><em>three phases.</em></h1>
          <p>3 Phasic Meta Learn makes the hidden work of learning visible — from building a plan, to learning with support, to evaluating the moves that made progress possible.</p>
          <div className="landing-actions">
            <button className="solid-button light" onClick={() => onEnter('student')} data-testid="button-enter-student">Enter student demo <ArrowRight size={16} /></button>
            <button className="outline-button" onClick={() => onEnter('admin')} data-testid="button-enter-admin-secondary">Explore the committee dashboard</button>
          </div>
          <div className="quote-card"><blockquote>“{quote[0]}”</blockquote><cite>— {quote[1]} · opening reflection</cite></div>
        </div>
        <div className="orbit-stage" aria-label="Three phases: Genesis, Transition, and Metacognition">
          <div className="orbit-ring"><span /></div>
          <div className="orbit-center"><Sparkles size={22} /><strong>learning<br />visible</strong></div>
          <div className="orbit-node node-genesis"><Lightbulb size={19} /><span>Genesis</span></div>
          <div className="orbit-node node-transition"><Zap size={19} /><span>Transition</span></div>
          <div className="orbit-node node-meta"><Target size={19} /><span>Metacognition</span></div>
        </div>
      </div>
    </section>
    <footer className="landing-footer"><div className="landing-footer-researcher"><strong>Sharmin Shahnaz</strong><span>Reg. No. 24DEDUC010 · Ph.D. Research Scholar</span><span>Department of Education · Central University of Karnataka</span></div><span className="micro">RAC Demo · Education subject · Group C / Group D</span></footer>
  </main>;
}

function Topbar({ onHome, onRole }: { onHome: () => void; onRole: (role: 'student' | 'admin') => void }) {
  return <header className="topbar">
    <button className="brand" onClick={onHome} aria-label="Return to home"><span className="brand-mark" /><span className="brand-copy">3 Phasic Meta Learn</span></button>
    <div className="topbar-researcher"><span className="topbar-researcher-name">Sharmin Shahnaz</span><span className="micro">Reg. 24DEDUC010 · Dept. of Education · CUK</span></div>
    <div className="topbar-actions"><span className="micro topbar-demo-note">RAC demo</span><button className="icon-button" onClick={() => onRole('admin')} aria-label="Open admin dashboard"><LayoutDashboard size={16} /></button><button className="icon-button" onClick={onHome} aria-label="Return to opening"><X size={16} /></button></div>
  </header>;
}

function Sidebar({ view, onView }: { view: StudentView; onView: (view: StudentView) => void }) {
  const items: [StudentView, string, ReactNode][] = [
    ['subject', 'Subject overview', <BookOpen size={16} />],
    ['group', 'Groups C + D', <Users size={16} />],
    ['unit', 'Unit I · Education', <FileText size={16} />],
    ['lesson', 'Lesson workspace', <ClipboardCheck size={16} />],
  ];
  return <aside className="sidebar">
    <div className="sidebar-intro"><span className="micro">Student workspace</span><h2>Education<br />research lab</h2></div>
    <nav className="nav-list">{items.map(([key, label, icon]) => <button className={`nav-item ${view === key ? 'active' : ''}`} key={key} onClick={() => onView(key)} data-testid={`nav-${key}`}>{icon}<span>{label}</span></button>)}</nav>
    <div className="sidebar-footer"><span className="micro">Current pathway</span><p>Group C · Unit I<br />Three checkpoints · 20 contact hours</p></div>
  </aside>;
}

function StudentShell({ onHome, onAdmin, children, view, onView }: { onHome: () => void; onAdmin: () => void; children: ReactNode; view: StudentView; onView: (view: StudentView) => void }) {
  return <div className="shell"><Topbar onHome={onHome} onRole={() => onAdmin()} /><div className="workspace"><Sidebar view={view} onView={onView} /><main className="main-column"><div className="main-inner">{children}</div></main></div></div>;
}

function SubjectView({ onGroup }: { onGroup: (group: 'C' | 'D') => void }) {
  return <><div className="breadcrumb"><span>Student</span><ChevronRight size={12} /><span>Subject overview</span></div>
    <div className="page-heading"><div><span className="section-index">01 · orientation</span><h1>Education<br />as inquiry.</h1></div><p>Follow one curriculum through a sequence designed to make planning, support, and reflection observable.</p></div>
    <section className="subject-card surface"><div className="subject-card-copy"><span className="eyebrow">Education subject</span><h2>Learning, mind,<br />and context</h2><p>A research-informed pathway for exploring how people learn — and how learners can become better observers of their own thinking.</p></div><div className="subject-card-art"><div className="art-lines" /></div></section>
    <div className="section-heading" style={{ marginBottom: 17 }}><span className="section-index">02 · cohort</span><div><span className="eyebrow">Choose a study group</span><h2 style={{ fontFamily: 'var(--serif)', fontSize: 36, fontWeight: 400, margin: '12px 0 0' }}>Where will you begin?</h2></div></div>
    <div className="group-grid"><button className="group-card" onClick={() => onGroup('C')} data-testid="button-group-c"><span className="group-letter">GROUP C</span><ChevronRight size={18} /><h3>Foundations</h3><p>Unit I · 20 contact hours · 3 lessons</p></button><button className="group-card" onClick={() => onGroup('D')} data-testid="button-group-d"><span className="group-letter">GROUP D</span><ChevronRight size={18} /><h3>Applications</h3><p>Unit II · 18 contact hours · 2 lessons</p></button></div>
  </>;
}

function GroupView({ onUnit, onBack }: { onUnit: () => void; onBack: () => void }) {
  return <><div className="breadcrumb"><button onClick={onBack}>Subject</button><ChevronRight size={12} /><span>Group C</span></div>
    <div className="page-heading"><div><span className="section-index">03 · pathway</span><h1>Group C<br />foundations.</h1></div><p>A paced entry into educational psychology, with room to pause and make your learning decisions explicit.</p></div>
    <div className="unit-view"><section className="unit-rail"><span className="eyebrow" style={{ color: '#a9d7cb' }}>Group C · curriculum</span><h2>One unit.<br />Many lenses.</h2><p>The first unit asks a simple question: what changes when we study learning as both a human process and a psychological one?</p><div className="contact-hours">20 contact hours · active</div></section><section className="lesson-list"><button className="lesson-row" onClick={onUnit} data-testid="button-open-unit"><span className="lesson-number">UNIT I</span><span><h3>Education &amp; Psychology</h3><p>Meaning, schools of thought, and methods of inquiry.</p></span><ChevronRight size={18} /></button><div className="surface" style={{ padding: 23 }}><span className="micro">Unit promise</span><ul className="topic-list" style={{ color: 'var(--ink-soft)', borderColor: 'var(--line)', marginTop: 15 }}><li style={{ color: 'var(--ink-soft)' }}>Connect educational aims to psychological processes.</li><li style={{ color: 'var(--ink-soft)' }}>Compare three schools of educational psychology.</li><li style={{ color: 'var(--ink-soft)' }}>Select methods for credible inquiry.</li></ul></div></section></div>
  </>;
}

function UnitView({ onLesson, onBack }: { onLesson: (id: number) => void; onBack: () => void }) {
  return <><div className="breadcrumb"><button onClick={onBack}>Group C</button><ChevronRight size={12} /><span>Unit I</span></div>
    <div className="page-heading"><div><span className="section-index">04 · unit map</span><h1>Education<br />&amp; Psychology.</h1></div><p>Three lessons move from meaning, through schools of thought, into the methods psychologists use to build knowledge.</p></div>
    <div className="unit-view"><section className="unit-rail"><span className="eyebrow" style={{ color: '#a9d7cb' }}>Unit I</span><h2>Education<br />&amp;<br />Psychology</h2><p>Build a shared vocabulary before choosing a strategy for learning with the material.</p><div className="contact-hours">20 contact hours · Group C</div></section><section className="lesson-list">{lessons.map((lesson) => <button className="lesson-row" key={lesson.id} onClick={() => onLesson(lesson.id)} data-testid={`button-open-lesson-${lesson.id}`}><span className="lesson-number">0{lesson.id}</span><span><h3>{lesson.title}</h3><p>{lesson.description}</p></span><ChevronRight size={18} /></button>)}</section></div>
    <section className="surface" style={{ marginTop: 26, padding: 24 }}><span className="micro">Unit I · core content</span><div className="topic-list" style={{ gridTemplateColumns: 'repeat(2, minmax(0,1fr))' }}><li>Meaning of Educational Psychology: needs, relationship between education and psychology, and bases of human behavior.</li><li>Human behavior: sensation, perception, and conception.</li><li>Schools: behaviourism, Gestalt, and psycho-analysis.</li><li>Methods: observation, experimentation, case study, survey, and correlation.</li></div></section>
  </>;
}

function LessonWorkspace({ lessonId, onBack, onToast }: { lessonId: number; onBack: () => void; onToast: (message: string) => void }) {
  const [phase, setPhase] = useState<Phase>('genesis');
  const [strategy, setStrategy] = useState(strategies[0]);
  const [started, setStarted] = useState(false);
  const [evaluation, setEvaluation] = useState('');
  const lesson = lessons.find((item) => item.id === lessonId) || lessons[0];
  const phaseIndex = { genesis: 0, transition: 1, metacognition: 2 }[phase];
  return <><div className="lesson-header"><div><button className="back-button" onClick={onBack}><ArrowLeft size={14} /> Back to Unit I</button><span className="eyebrow" style={{ marginTop: 22 }}>Lesson 0{lesson.id} · Group C</span><h1>{lesson.title}</h1><p>{lesson.description}</p></div></div>
    <div className="phase-nav">{(['genesis', 'transition', 'metacognition'] as Phase[]).map((key, index) => <button className={`phase-tab ${phase === key ? 'active' : ''}`} key={key} onClick={() => setPhase(key)} data-testid={`button-phase-${key}`}><span className="phase-code">0{index + 1} · {key}</span><strong>{key === 'genesis' ? 'Build the plan' : key === 'transition' ? 'Learn with support' : 'Evaluate & reflect'}</strong></button>)}</div>
    <div className="phase-content">
      {phase === 'genesis' && <div className="planning-grid"><section className="planning-sheet surface"><span className="section-index">Genesis phase · planning sheet</span><h2>Before the video,<br />place your attention.</h2><p>Choose a deliberate route through the lesson. A plan does not predict the learning perfectly; it gives you something to notice when the route changes.</p><div className="prompt-row"><div className="prompt-card"><span className="micro">01 · intention</span><p>What do you already associate with educational psychology?</p></div><div className="prompt-card"><span className="micro">02 · signal</span><p>What will tell you that a new concept has become clear?</p></div></div><div className="begin-row"><p>Planning is recorded locally for this meeting demo.</p><button className="solid-button" onClick={() => { setStarted(true); setPhase('transition'); onToast('Genesis complete — entering Transition.'); }} data-testid="button-begin-transition">Begin Transition <ArrowRight size={15} /></button></div></section><StrategyPanel strategy={strategy} onStrategy={setStrategy} /></div>}
      {phase === 'transition' && <TransitionView started={started} lesson={lesson} onToast={onToast} onEvaluate={() => setPhase('metacognition')} />}
      {phase === 'metacognition' && <EvaluationView evaluation={evaluation} setEvaluation={setEvaluation} onComplete={() => onToast('Evaluation recorded locally. This lesson is complete.')} />}
    </div>
    <div className="micro" style={{ marginTop: 18 }}>Phase {phaseIndex + 1} of 3 · Strategy selected: {strategy}</div>
  </>;
}

function StrategyPanel({ strategy, onStrategy }: { strategy: string; onStrategy: (value: string) => void }) {
  return <aside className="strategy-panel"><span className="eyebrow">Strategy selector</span><h3>Give your thinking a shape.</h3><p>Pick one primary move. You can change it later, but begin with a hypothesis.</p><div className="strategy-list">{strategies.map((item) => <button className={`strategy-option ${strategy === item ? 'selected' : ''}`} key={item} onClick={() => onStrategy(item)} data-testid={`button-strategy-${item.toLowerCase().replaceAll(' ', '-')}`}>{item}{strategy === item && <Check size={14} />}</button>)}</div></aside>;
}

function TransitionView({ started, lesson, onToast, onEvaluate }: { started: boolean; lesson: typeof lessons[0]; onToast: (message: string) => void; onEvaluate: () => void }) {
  const [progress, setProgress] = useState(50);
  const [hint, setHint] = useState('');
  return <><div className="transition-layout"><section className="video-surface"><div className="video-head"><span className="micro">Transition · guided media</span><span className="micro">Lesson 0{lesson.id} · 08:40</span></div><div className="video-body"><button className="play-button" onClick={() => { setProgress(Math.min(progress + 10, 90)); onToast('Playback advanced in the local demo.'); }} aria-label="Play lesson video" data-testid="button-play-video"><Play size={24} /></button><h2>{lesson.short}</h2><p>{started ? 'Pause, notice, and continue when ready.' : 'Your plan will appear here as you learn.'}</p></div><div className="video-foot"><span className="micro">0{Math.round(progress / 10)}:12</span><div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div><span className="micro">{progress}%</span></div></section><aside className="monitor-card surface"><span className="eyebrow">Live monitoring</span><h3>Where is your understanding?</h3><div className="monitor-ring"><span>{progress}%</span></div><p>At the midpoint, name what is clear and what needs another pass.</p><button className="text-button" onClick={() => setHint('Try drawing a three-step chain: stimulus → interpretation → meaning.')} data-testid="button-get-hint"><CircleHelp size={15} /> Get hints</button>{hint && <div className="hint-callout">{hint}</div>}</aside></div><div className="resource-grid"><div className="embed-card surface padlet"><span className="micro">Embedded study surface</span><div className="embed-decoration" /><h3>Padlet wall</h3><p>Pin one observation, one question, and one connection for the group to revisit.</p><button className="text-button" style={{ marginTop: 18 }} onClick={() => onToast('Padlet surface opened in the meeting demo.')} data-testid="button-open-padlet">Open wall <ArrowRight size={14} /></button></div><div className="embed-card surface anki"><span className="micro">Retrieval practice</span><div className="embed-decoration" /><h3>Anki cards</h3><p>Test the distinctions between sensation, perception, and conception.</p><button className="text-button" style={{ marginTop: 18 }} onClick={() => onToast('Anki-style cards are ready for review.')} data-testid="button-open-anki">Review cards <ArrowRight size={14} /></button></div></div><div className="begin-row"><p>Monitoring checkpoint is active at 50%.</p><button className="solid-button" onClick={onEvaluate} data-testid="button-go-evaluation">Continue to evaluation <ArrowRight size={15} /></button></div></>;
}

function EvaluationView({ evaluation, setEvaluation, onComplete }: { evaluation: string; setEvaluation: (value: string) => void; onComplete: () => void }) {
  return <><div className="evaluation"><section className="evaluation-intro"><span className="eyebrow" style={{ color: '#a9d7cb' }}>Metacognition phase</span><h2>Look back<br />at the move.</h2><p>Evaluation is not a score alone. It is evidence about which strategy helped, where the concept shifted, and what you would change next time.</p></section><section className="evaluation-form surface"><label htmlFor="reflection">What did you notice about your learning?</label><textarea id="reflection" value={evaluation} onChange={(event) => setEvaluation(event.target.value)} placeholder="Name one strategy, one moment of clarity, or one remaining question." data-testid="input-reflection" /><button className="solid-button" disabled={!evaluation.trim()} onClick={onComplete} data-testid="button-submit-evaluation">Save reflection <Check size={15} /></button></section></div><div className="completion" style={{ marginTop: 17 }}><span className="completion-icon"><BarChart3 size={16} /></span><div><strong>End-of-lesson evaluation</strong><p>Your reflection stays in this browser for the committee demo.</p></div></div></>;
}

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(['I am Levo. Ask me about the lesson, a strategy, or where to look next.']);
  const send = () => { if (!input.trim()) return; const question = input.trim(); setMessages((items) => [...items, question, 'Try connecting that question to the three phases: plan what you know, monitor what changes, then reflect on the evidence.']); setInput(''); };
  return <div className="chatbot">{open && <div className="chat-window"><div className="chat-header"><div><strong>Levo</strong><small>learning companion · local demo</small></div><button onClick={() => setOpen(false)} aria-label="Close Levo"><X size={16} /></button></div><div className="chat-messages">{messages.map((message, index) => <div className={`chat-message ${index % 2 === 1 ? 'user' : ''}`} key={`${message}-${index}`}>{message}</div>)}</div><div className="chat-input"><input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && send()} placeholder="Ask Levo..." aria-label="Message Levo" data-testid="input-chat" /><button onClick={send} aria-label="Send message" data-testid="button-send-chat"><Send size={15} /></button></div></div>}<button className="chat-toggle" onClick={() => setOpen(!open)} aria-label="Open Levo chatbot" data-testid="button-open-levo"><Bot size={22} /></button></div>;
}

function StudentApp({ onHome, onAdmin }: { onHome: () => void; onAdmin: () => void }) {
  const [view, setView] = useState<StudentView>('subject');
  const [group, setGroup] = useState<'C' | 'D'>('C');
  const [lessonId, setLessonId] = useState(1);
  const [toast, setToast] = useState('');
  const go = (next: StudentView) => setView(next);
  useEffect(() => { if (!toast) return; const timer = window.setTimeout(() => setToast(''), 3200); return () => window.clearTimeout(timer); }, [toast]);
  return <><StudentShell onHome={onHome} onAdmin={onAdmin} view={view} onView={go}>{view === 'subject' && <SubjectView onGroup={(next) => { setGroup(next); setView('group'); }} />}{view === 'group' && <GroupView onUnit={() => setView('unit')} onBack={() => setView('subject')} />}{view === 'unit' && <UnitView onLesson={(id) => { setLessonId(id); setView('lesson'); }} onBack={() => setView('group')} />}{view === 'lesson' && <LessonWorkspace lessonId={lessonId} onBack={() => setView('unit')} onToast={setToast} />}</StudentShell><Chatbot />{toast && <Toast message={toast} onClose={() => setToast('')} />}</>;
}

function AdminApp({ onHome, onStudent }: { onHome: () => void; onStudent: () => void }) {
  return <div className="shell"><Topbar onHome={onHome} onRole={(role) => role === 'student' && onStudent()} /><div className="workspace"><Sidebar view="subject" onView={onStudent} /><main className="main-column"><div className="main-inner"><div className="admin-hero"><div><span className="section-index">Committee view · 06</span><h1>Curriculum<br />in motion.</h1></div><p>One glance across the pathway: what is being taught, what learners are doing, and where support is needed.</p></div><section className="metrics"><div className="metric"><span className="metric-label">Active learners</span><strong>48</strong><small>+6 this week</small></div><div className="metric"><span className="metric-label">Completion rate</span><strong>72%</strong><small>Group C leading</small></div><div className="metric"><span className="metric-label">At transition</span><strong>19</strong><small>Needs a check-in</small></div><div className="metric"><span className="metric-label">Reflections</span><strong>31</strong><small>Collected locally</small></div></section><div className="admin-grid"><section className="admin-panel surface"><div className="panel-title"><h2>Curriculum overview</h2><span>3 phases · 2 groups</span></div>{[['01', 'Genesis · planning', 'Learners selecting strategies', '78%'], ['02', 'Transition · supported learning', 'Midpoint monitoring active', '50%'], ['03', 'Metacognition · evaluation', 'Reflections submitted', '64%']].map(([number, title, sub, progress]) => <div className="curriculum-row" key={number}><span>{number}</span><div><strong>{title}</strong><small>{sub}</small></div><div className="bar"><span style={{ width: progress }} /></div></div>)}</section><section className="admin-panel surface"><div className="panel-title"><h2>Learner pulse</h2><span>today</span></div><div className="learner-list">{[['AS', 'A. Sen', 'Group C · Unit I', '86%'], ['MN', 'M. Noor', 'Group D · Unit II', '61%'], ['RK', 'R. Karim', 'Group C · Unit I', '50%']].map(([initials, name, detail, progress]) => <div className="learner" key={name}><span className="avatar">{initials}</span><div className="learner-info"><strong>{name}</strong><small>{detail}</small></div><span className="learner-progress">{progress}</span></div>)}</div><div className="signal-box"><span className="micro">Committee signal</span><p>Several learners paused at the distinction between perception and conception. Consider adding a shared example to the next live session.</p></div></section></div></div></main></div></div>;
}

function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const enter = (role: 'student' | 'admin') => setScreen(role);
  if (screen === 'landing') return <Landing onEnter={enter} />;
  if (screen === 'admin') return <AdminApp onHome={() => setScreen('landing')} onStudent={() => setScreen('student')} />;
  return <StudentApp onHome={() => setScreen('landing')} onAdmin={() => setScreen('admin')} />;
}

export default App;