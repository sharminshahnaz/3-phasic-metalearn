import { useEffect, useRef, useState } from 'react';
import {
  BookOpen,
  Check,
  ChevronRight,
  Globe2,
  HelpCircle,
  Lightbulb,
  Play,
  RotateCcw,
  X,
} from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

type Language = 'EN' | 'BN';
type LessonNumber = 1 | 2;
type ModalName = 'modal25' | 'modal50' | 'modal75' | 'modal100' | null;

const lessons = {
  1: {
    title: 'Lesson 1: Introduction to Strategy Scaffolding',
    shortTitle: 'Strategy Scaffolding',
    video:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    description:
      'Build a plan before you begin. Explore how an intentional strategy can make learning more visible and manageable.',
  },
  2: {
    title: 'Lesson 2: Applying Metacognitive Regulation',
    shortTitle: 'Metacognitive Regulation',
    video:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    description:
      'Practice noticing what you understand, where you are stuck, and which learning move can help you continue.',
  },
} satisfies Record<LessonNumber, { title: string; shortTitle: string; video: string; description: string }>;

const strategies = [
  'Mnemonics',
  'Method of Loci',
  'Concept Mapping',
  'Feynman Technique',
  'Frayer Model',
  'Chunking',
  'Brain Dump',
];

const copy = {
  EN: {
    eyebrow: 'Metacognitive research platform',
    title: 'Learn how you learn.',
    intro:
      'A guided space for planning, monitoring, and reflecting on the strategies that shape your learning.',
    lessonSelection: 'Select lesson',
    planning: 'Planning phase',
    chooseStrategy: 'Choose your primary learning strategy',
    hint: 'Give hints',
    videoGuide: 'Watch, pause, reflect',
    resources: 'Course documents & resources',
    syllabus: 'View syllabus PDF',
    lessonPdf: 'View lesson PPT PDF',
    reflectionSaved: 'Reflection saved in this browser.',
    demoMode: 'Demo mode · local browser storage',
    pause: 'Pause',
    continue: 'Continue video',
    submitResume: 'Submit & resume',
    submitReflection: 'Submit reflection',
    completeLesson: 'Complete lesson',
    close: 'Close',
    choose: 'Choose one option',
    saved: 'Lesson evaluation recorded successfully.',
    footer: 'A practical space for becoming more aware of your own learning.',
  },
  BN: {
    eyebrow: 'মেটাকগনিটিভ গবেষণা প্ল্যাটফর্ম',
    title: 'আপনি কীভাবে শেখেন তা শিখুন।',
    intro:
      'শেখার কৌশল পরিকল্পনা, পর্যবেক্ষণ এবং প্রতিফলনের জন্য একটি নির্দেশিত স্থান।',
    lessonSelection: 'পাঠ বেছে নিন',
    planning: 'পরিকল্পনা পর্যায়',
    chooseStrategy: 'আপনার প্রধান শেখার কৌশল বেছে নিন',
    hint: 'ইঙ্গিত দিন',
    videoGuide: 'দেখুন, থামুন, ভাবুন',
    resources: 'কোর্সের নথি ও সংস্থান',
    syllabus: 'সিলেবাস PDF দেখুন',
    lessonPdf: 'পাঠের PPT PDF দেখুন',
    reflectionSaved: 'এই ব্রাউজারে প্রতিফলন সংরক্ষিত হয়েছে।',
    demoMode: 'ডেমো মোড · ব্রাউজারে সংরক্ষিত',
    pause: 'থামুন',
    continue: 'ভিডিও চালিয়ে যান',
    submitResume: 'জমা দিয়ে চালিয়ে যান',
    submitReflection: 'প্রতিফলন জমা দিন',
    completeLesson: 'পাঠ শেষ করুন',
    close: 'বন্ধ করুন',
    choose: 'একটি উত্তর বেছে নিন',
    saved: 'পাঠের মূল্যায়ন সফলভাবে সংরক্ষিত হয়েছে।',
    footer: 'নিজের শেখাকে আরও সচেতনভাবে বোঝার জন্য একটি ব্যবহারিক স্থান।',
  },
} as const;

function Modal({
  name,
  onClose,
  children,
}: {
  name: Exclude<ModalName, null>;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div
      className="modal"
      data-testid={`modal-${name}`}
      role="dialog"
      aria-modal="true"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="modal-content">
        <button className="modal-close" aria-label="Close dialog" onClick={onClose} type="button">
          <X size={18} />
        </button>
        {children}
      </div>
    </div>
  );
}

function DocumentPreview({
  activeDocument,
  lesson,
}: {
  activeDocument: 'syllabus' | 'ppt';
  lesson: LessonNumber;
}) {
  const isSyllabus = activeDocument === 'syllabus';

  return (
    <div className="document-preview" data-testid={`document-preview-${activeDocument}`}>
      <div className="document-toolbar">
        <span><BookOpen size={14} /> {isSyllabus ? 'Syllabus' : lessons[lesson].shortTitle}</span>
        <span>PDF resource preview</span>
      </div>
      <div className="document-paper">
        <span className="document-paper-kicker">{isSyllabus ? 'Course syllabus' : `Lesson 0${lesson} · companion notes`}</span>
        <h3>{isSyllabus ? 'Metacognitive Learning Lab' : lessons[lesson].title}</h3>
        <div className="document-rule" />
        <div className="document-columns">
          <div>
            <span className="document-subhead">{isSyllabus ? 'Course focus' : 'Guiding question'}</span>
            <p>{isSyllabus
              ? 'Plan, monitor, and reflect on the strategies you use to learn.'
              : lessons[lesson].description}</p>
          </div>
          <div>
            <span className="document-subhead">{isSyllabus ? 'Learning moves' : 'Remember'}</span>
            <p>{isSyllabus
              ? 'Strategy selection · progress checks · reflective evaluation'
              : 'There is no single correct route through a learning process.'}</p>
          </div>
        </div>
        <div className="document-lines" aria-hidden="true">
          <span /><span /><span /><span />
        </div>
      </div>
    </div>
  );
}

function ProgressModal({
  modal,
  language,
  onClose,
  onSubmitReflection,
  onSubmitQuiz,
}: {
  modal: Exclude<ModalName, null>;
  language: Language;
  onClose: () => void;
  onSubmitReflection: (text: string) => void;
  onSubmitQuiz: () => void;
}) {
  const t = copy[language];
  const [muddyPoint, setMuddyPoint] = useState('');
  const [monitoring, setMonitoring] = useState('');
  const [quizAnswer, setQuizAnswer] = useState('');

  if (modal === 'modal25') {
    return (
      <Modal name={modal} onClose={onClose}>
        <span className="modal-kicker">25% progress</span>
        <h3>Content flashcard</h3>
        <p className="modal-question">
          <strong>What is metacognitive regulation?</strong>
        </p>
        <div className="answer-callout">
          It involves monitoring and controlling your cognitive processes during learning.
        </div>
        <button className="btn" onClick={onClose} type="button">
          {t.continue} <ChevronRight size={16} />
        </button>
      </Modal>
    );
  }

  if (modal === 'modal50') {
    return (
      <Modal name={modal} onClose={onClose}>
        <span className="modal-kicker">50% progress</span>
        <h3>Monitoring survey</h3>
        <p className="modal-question">How well do you understand the material presented so far?</p>
        <div className="radio-list">
          {[
            ['High', 'High comprehension'],
            ['Medium', 'Moderate comprehension'],
            ['Low', 'Struggling / confused'],
          ].map(([value, label]) => (
            <label className={`radio-option ${monitoring === value ? 'is-selected' : ''}`} key={value}>
              <input
                checked={monitoring === value}
                name="monitoring"
                onChange={(event) => setMonitoring(event.target.value)}
                type="radio"
                value={value}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
        <button className="btn" disabled={!monitoring} onClick={onClose} type="button">
          {t.submitResume} <ChevronRight size={16} />
        </button>
      </Modal>
    );
  }

  if (modal === 'modal75') {
    return (
      <Modal name={modal} onClose={onClose}>
        <span className="modal-kicker">75% progress</span>
        <h3>Muddy point reflection</h3>
        <p className="modal-question">
          What concept or part of this video is still unclear or confusing to you?
        </p>
        <textarea
          aria-label="Muddy point reflection"
          className="reflection-input"
          onChange={(event) => setMuddyPoint(event.target.value)}
          placeholder="Write your reflection here..."
          rows={4}
          value={muddyPoint}
        />
        <button className="btn" disabled={!muddyPoint.trim()} onClick={() => onSubmitReflection(muddyPoint)} type="button">
          {t.submitReflection} <ChevronRight size={16} />
        </button>
      </Modal>
    );
  }

  return (
    <Modal name={modal} onClose={onClose}>
      <span className="modal-kicker">100% complete</span>
      <h3>Evaluation & quiz</h3>
      <p className="modal-question">
        <strong>Which technique relies on spatial memory journeys?</strong>
      </p>
      <div className="radio-list">
        {[
          ['A', 'Concept mapping'],
          ['B', 'Method of loci'],
          ['C', 'Chunking'],
        ].map(([value, label]) => (
          <label className={`radio-option ${quizAnswer === value ? 'is-selected' : ''}`} key={value}>
            <input
              checked={quizAnswer === value}
              name="quiz"
              onChange={(event) => setQuizAnswer(event.target.value)}
              type="radio"
              value={value}
            />
            <span>{value}) {label}</span>
          </label>
        ))}
      </div>
      <button className="btn" disabled={!quizAnswer} onClick={onSubmitQuiz} type="button">
        {t.completeLesson} <Check size={16} />
      </button>
    </Modal>
  );
}

function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [language, setLanguage] = useState<Language>('EN');
  const [lesson, setLesson] = useState<LessonNumber>(1);
  const [strategy, setStrategy] = useState('Mnemonics');
  const [modal, setModal] = useState<ModalName>(null);
  const [completed, setCompleted] = useState(false);
  const [toast, setToast] = useState('');
  const [activeDocument, setActiveDocument] = useState<'syllabus' | 'ppt'>('syllabus');
  const [triggers, setTriggers] = useState({ 25: false, 50: false, 75: false, 100: false });
  const t = copy[language];

  useEffect(() => {
    const saved = window.localStorage.getItem('metacognitive-reflection');
    if (saved) setToast(t.reflectionSaved);
  }, [t.reflectionSaved]);

  const resetTriggers = () => setTriggers({ 25: false, 50: false, 75: false, 100: false });

  const selectLesson = (number: LessonNumber) => {
    setLesson(number);
    setCompleted(false);
    setModal(null);
    resetTriggers();
    if (videoRef.current) {
      videoRef.current.load();
    }
  };

  const handleProgress = () => {
    const video = videoRef.current;
    if (!video?.duration) return;
    const progress = (video.currentTime / video.duration) * 100;
    const checkpoint = progress >= 99 ? 100 : progress >= 75 ? 75 : progress >= 50 ? 50 : progress >= 25 ? 25 : null;
    if (!checkpoint || triggers[checkpoint]) return;
    setTriggers((current) => ({ ...current, [checkpoint]: true }));
    video.pause();
    setModal(`modal${checkpoint}` as Exclude<ModalName, null>);
  };

  const closeModal = () => {
    setModal(null);
    window.setTimeout(() => videoRef.current?.play().catch(() => undefined), 80);
  };

  const submitReflection = (text: string) => {
    window.localStorage.setItem(
      'metacognitive-reflection',
      JSON.stringify({ lesson, strategy, text, savedAt: new Date().toISOString() }),
    );
    setToast(t.reflectionSaved);
    setModal(null);
    window.setTimeout(() => videoRef.current?.play().catch(() => undefined), 80);
  };

  const submitQuiz = () => {
    setCompleted(true);
    setToast(t.saved);
    setModal(null);
  };

  const showHint = () => {
    setToast(
      language === 'BN'
        ? 'ইঙ্গিত: আপনার নোটকে ভিজ্যুয়াল ম্যাপে সাজান বা নতুন ধারণাকে পরিচিত স্থানিক অবস্থানের সঙ্গে যুক্ত করুন।'
        : 'Hint: Structure your notes into visual maps or link new ideas to familiar spatial locations.',
    );
  };

  return (
    <main className="research-app">
      <header className="site-header">
        <a className="brand" href="#top">
          <span className="brand-mark"><span /></span>
          <span>
            <strong>Meta</strong> / cognition
          </span>
        </a>
        <div className="header-actions">
          <span className="status-pill"><span /> {t.demoMode}</span>
          <div className="language-switch" aria-label="Language switcher">
            <Globe2 size={15} />
            <button className={language === 'EN' ? 'is-active' : ''} onClick={() => setLanguage('EN')} type="button">EN</button>
            <span>/</span>
            <button className={language === 'BN' ? 'is-active' : ''} onClick={() => setLanguage('BN')} type="button">BN</button>
          </div>
        </div>
      </header>

      <section className="research-hero" id="top">
        <div className="hero-grid">
          <div className="hero-text">
            <span className="eyebrow"><span /> {t.eyebrow}</span>
            <h1>{t.title}</h1>
            <p>{t.intro}</p>
            <a className="hero-link" href="#lesson">
              Begin a lesson <ChevronRight size={17} />
            </a>
          </div>
          <div className="hero-diagram" aria-label="Learning cycle diagram" role="img">
            <div className="diagram-orbit orbit-one" />
            <div className="diagram-orbit orbit-two" />
            <div className="diagram-core"><BookOpen size={27} strokeWidth={1.4} /></div>
            <span className="diagram-label label-plan">PLAN</span>
            <span className="diagram-label label-monitor">MONITOR</span>
            <span className="diagram-label label-reflect">REFLECT</span>
          </div>
        </div>
      </section>

      <main className="content-shell" id="lesson">
        <section className="lesson-selector">
          <div className="section-heading">
            <span className="section-number">01</span>
            <div>
              <span className="eyebrow">Course pathway</span>
              <h2>{t.lessonSelection}</h2>
            </div>
          </div>
          <div className="lesson-buttons">
            {[1, 2].map((number) => (
              <button
                className={`lesson-button ${lesson === number ? 'is-active' : ''}`}
                data-testid={`button-lesson-${number}`}
                key={number}
                onClick={() => selectLesson(number as LessonNumber)}
                type="button"
              >
                <span>0{number}</span>
                <strong>{lessons[number as LessonNumber].shortTitle}</strong>
                <ChevronRight size={17} />
              </button>
            ))}
          </div>
        </section>

        <section className="planning-box">
          <div className="planning-copy">
            <div className="section-label"><Lightbulb size={15} /> {t.planning}</div>
            <h2>{lessons[lesson].title}</h2>
            <p>{lessons[lesson].description}</p>
          </div>
          <div className="planning-control">
            <label htmlFor="strategySelect">{t.chooseStrategy}</label>
            <div className="control-row">
              <select id="strategySelect" onChange={(event) => setStrategy(event.target.value)} value={strategy}>
                {strategies.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
              <button className="btn-secondary" data-testid="button-hint" onClick={showHint} type="button">
                <HelpCircle size={16} /> {t.hint}
              </button>
            </div>
          </div>
        </section>

        <section className="video-container">
          <div className="section-header">
            <div>
              <span className="eyebrow">{t.videoGuide}</span>
              <h2>{lessons[lesson].title}</h2>
            </div>
            {completed && <span className="completed-badge"><Check size={14} /> Complete</span>}
          </div>
          <div className="video-frame">
            <video
              controls
              data-testid="video-lesson"
              onTimeUpdate={handleProgress}
              ref={videoRef}
              width="100%"
            >
              <source src={lessons[lesson].video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="video-overlay-label"><Play size={13} /> {lesson === 1 ? 'LESSON 01' : 'LESSON 02'}</div>
          </div>
          <div className="video-meta">
            <span>Strategy selected: <strong>{strategy}</strong></span>
            <span>Checkpoints: 25 / 50 / 75 / 100%</span>
          </div>
        </section>

        <section className="documents-section">
          <div className="section-heading">
            <span className="section-number">02</span>
            <div>
              <span className="eyebrow">Continue your inquiry</span>
              <h2>{t.resources}</h2>
            </div>
          </div>
          <div className="document-tabs">
            <button className={activeDocument === 'syllabus' ? 'is-active' : ''} onClick={() => setActiveDocument('syllabus')} type="button">
              <BookOpen size={16} /> {t.syllabus}
            </button>
            <button className={activeDocument === 'ppt' ? 'is-active' : ''} onClick={() => setActiveDocument('ppt')} type="button">
              <BookOpen size={16} /> {t.lessonPdf}
            </button>
          </div>
          <DocumentPreview activeDocument={activeDocument} lesson={lesson} />
        </section>
      </main>

      <footer className="site-footer">
        <div>
          <span className="eyebrow">Meta / cognition</span>
          <p>{t.footer}</p>
        </div>
        <span className="footer-note">Research prototype · 2026</span>
      </footer>

      {toast && (
        <div className="toast" role="status">
          <Check size={16} />
          <span>{toast}</span>
          <button aria-label="Dismiss notification" onClick={() => setToast('')} type="button"><X size={15} /></button>
        </div>
      )}

      {modal && (
        <ProgressModal
          language={language}
          modal={modal}
          onClose={closeModal}
          onSubmitQuiz={submitQuiz}
          onSubmitReflection={submitReflection}
        />
      )}
    </main>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;