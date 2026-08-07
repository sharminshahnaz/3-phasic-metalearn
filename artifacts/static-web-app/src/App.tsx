import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import {
  ArrowLeft, ArrowRight, BarChart3, BookOpen, Bot, Check, ChevronRight,
  ClipboardCheck, FileText, LayoutDashboard, Lightbulb, Pause, Play,
  Send, Sparkles, Target, Users, X, Zap,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────
type Screen = 'landing' | 'student' | 'admin';
type StudentView = 'subject' | 'group' | 'unit' | 'lesson';
type Phase = 'immersion' | 'transition' | 'genesis';

/**
 * Per-video checkpoint flow (applies automatically to every one of the 42 videos):
 *   pre          → Planning Sheet + Strategy selector (shown at 0:00 before playback starts)
 *   playing      → video is running, no overlay visible
 *   cp25         → Flashcard technique (video pauses at 25%)
 *   cp50         → Monitoring Sheet (video pauses at 50%)
 *   cp75         → Muddy Point (video pauses at 75%)
 *   cp100_quiz   → Quiz / evaluation technique (video ends at 100%)
 *   cp100_eval   → Evaluation Sheet reflection (after quiz)
 *   done         → video fully complete; advance to next video in playlist
 */
type CheckpointStage =
  | 'pre' | 'playing' | 'cp25' | 'cp50' | 'cp75'
  | 'cp100_quiz' | 'cp100_eval' | 'done';

// ── Quotes ────────────────────────────────────────────────────────────────
const quotes = [
  ['Learning is not a product of teaching. Learning is a product of the activity of learners.', 'John Holt'],
  ['The mind is not a vessel to be filled but a fire to be kindled.', 'Plutarch'],
  ['We do not learn from experience. We learn from reflecting on experience.', 'John Dewey'],
  ['The important thing is not to stop questioning. Curiosity has its own reason for existing.', 'Albert Einstein'],
];

// ── Strategies ────────────────────────────────────────────────────────────
const strategies = ['Concept mapping', 'Feynman technique', 'Method of loci', 'Retrieval practice'];

// ── 42 Video slots (14 per phase) ─────────────────────────────────────────
// src is null until the file is uploaded. When you upload a video, its path
// goes here — e.g. '/videos/immersion-01.mp4'. Everything else is automatic.
interface VideoSlot { id: number; phase: Phase; index: number; title: string; src: string | null; }

function makeSlots(phase: Phase, startId: number): VideoSlot[] {
  return Array.from({ length: 14 }, (_, i) => ({
    id: startId + i,
    phase,
    index: i + 1,
    title: `Video ${String(i + 1).padStart(2, '0')}`,
    src: null,
  }));
}

const PHASE_VIDEOS: Record<Phase, VideoSlot[]> = {
  immersion:  makeSlots('immersion',  1),
  transition: makeSlots('transition', 15),
  genesis:    makeSlots('genesis',    29),
};

// ── Questionnaires ────────────────────────────────────────────────────────
// Replace the prompt strings below with the real questions once provided.
const PLANNING_QS = [
  { id: 'p1', label: '01 · Prior knowledge',    prompt: '[Planning question 1 — to be provided]' },
  { id: 'p2', label: '02 · Learning goal',       prompt: '[Planning question 2 — to be provided]' },
  { id: 'p3', label: '03 · Strategy rationale',  prompt: '[Planning question 3 — to be provided]' },
];
const MONITORING_QS = [
  { id: 'm1', label: '01 · Comprehension',       prompt: '[Monitoring question 1 — to be provided]' },
  { id: 'm2', label: '02 · Concept connection',  prompt: '[Monitoring question 2 — to be provided]' },
  { id: 'm3', label: '03 · Strategy check',      prompt: '[Monitoring question 3 — to be provided]' },
];
const EVAL_QS = [
  { id: 'e1', label: '01 · Key learning',        prompt: '[Evaluation question 1 — to be provided]' },
  { id: 'e2', label: '02 · Strategy assessment', prompt: '[Evaluation question 2 — to be provided]' },
  { id: 'e3', label: '03 · Next steps',          prompt: '[Evaluation question 3 — to be provided]' },
];

// Flashcard for 25% checkpoint — replace front/back with real content per phase
const FLASHCARD: Record<Phase, { front: string; back: string }> = {
  immersion:  { front: '[Concept term — to be provided]', back: '[Definition / explanation — to be provided]' },
  transition: { front: '[Concept term — to be provided]', back: '[Definition / explanation — to be provided]' },
  genesis:    { front: '[Concept term — to be provided]', back: '[Definition / explanation — to be provided]' },
};

// Quiz for 100% checkpoint — replace with real question per phase
const QUIZ: Record<Phase, { question: string; options: string[] }> = {
  immersion:  { question: '[Quiz question — to be provided]', options: ['[Option A]', '[Option B]', '[Option C]', '[Option D]'] },
  transition: { question: '[Quiz question — to be provided]', options: ['[Option A]', '[Option B]', '[Option C]', '[Option D]'] },
  genesis:    { question: '[Quiz question — to be provided]', options: ['[Option A]', '[Option B]', '[Option C]', '[Option D]'] },
};

// ── Shared small components ────────────────────────────────────────────────
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return <div className="toast" role="status"><Check size={16} /><span>{message}</span><button onClick={onClose} aria-label="Dismiss"><X size={15} /></button></div>;
}

function StrategyPanel({ strategy, onStrategy, compact = false }: { strategy: string; onStrategy: (v: string) => void; compact?: boolean }) {
  return (
    <aside className={compact ? 'strategy-panel strategy-panel-compact' : 'strategy-panel'}>
      {!compact && <><span className="eyebrow">Strategy selector</span><h3>Give your thinking a shape.</h3><p>Pick one primary move. You can change it later, but begin with a hypothesis.</p></>}
      {compact && <span className="eyebrow" style={{ marginBottom: 10, display: 'block' }}>Choose your learning strategy</span>}
      <div className="strategy-list">
        {strategies.map(item => (
          <button className={`strategy-option ${strategy === item ? 'selected' : ''}`} key={item} onClick={() => onStrategy(item)} data-testid={`button-strategy-${item.toLowerCase().replaceAll(' ', '-')}`}>
            {item}{strategy === item && <Check size={14} />}
          </button>
        ))}
      </div>
    </aside>
  );
}

// ── Checkpoint overlay ────────────────────────────────────────────────────
interface CheckpointOverlayProps {
  stage: Exclude<CheckpointStage, 'playing' | 'done'>;
  phase: Phase;
  videoIndex: number;
  strategy: string;
  onStrategy: (v: string) => void;
  onComplete: () => void;
}

function CheckpointOverlay({ stage, phase, videoIndex, strategy, onStrategy, onComplete }: CheckpointOverlayProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flipped, setFlipped] = useState(false);
  const [muddyPoint, setMuddyPoint] = useState('');
  const [selected, setSelected] = useState<number | null>(null);
  const set = (k: string, v: string) => setAnswers(a => ({ ...a, [k]: v }));

  const phaseName = { immersion: 'Immersion', transition: 'Transition', genesis: 'Genesis' }[phase];

  // ── Planning sheet (shown before video starts) ─────────────────────────
  if (stage === 'pre') return (
    <div className="overlay-backdrop">
      <div className="overlay-panel overlay-wide">
        <div className="overlay-top-bar"><span className="overlay-phase-badge">{phaseName} phase</span><span className="overlay-step">Video {videoIndex} of 14 · Planning Sheet</span></div>
        <h2 className="overlay-heading">Before you watch,<br />build your plan.</h2>
        <p className="overlay-sub">Complete the planning sheet and select your strategy. The video starts when you are ready.</p>
        <div className="overlay-sheet">
          {PLANNING_QS.map(q => (
            <div className="overlay-field" key={q.id}>
              <label>{q.label}</label>
              <p className="overlay-prompt">{q.prompt}</p>
              <textarea value={answers[q.id] || ''} onChange={e => set(q.id, e.target.value)} placeholder="Your response…" rows={2} />
            </div>
          ))}
        </div>
        <StrategyPanel strategy={strategy} onStrategy={onStrategy} compact />
        <div className="overlay-foot">
          <button className="solid-button" onClick={onComplete} data-testid="button-start-video">
            Start video <Play size={15} />
          </button>
        </div>
      </div>
    </div>
  );

  // ── 25% — Flashcard ────────────────────────────────────────────────────
  if (stage === 'cp25') return (
    <div className="overlay-backdrop">
      <div className="overlay-panel">
        <div className="overlay-top-bar"><span className="overlay-phase-badge">25% reached</span><span className="overlay-step">Monitoring · Flashcard</span></div>
        <h2 className="overlay-heading">Test your understanding.</h2>
        <p className="overlay-sub">Click the card to flip between the term and its definition.</p>
        <div className={`flashcard${flipped ? ' flipped' : ''}`} onClick={() => setFlipped(f => !f)} role="button" aria-label="Flip flashcard">
          <div className="flashcard-inner">
            <div className="flashcard-front"><span className="micro">Term</span><p>{FLASHCARD[phase].front}</p><span className="micro" style={{ marginTop: 'auto' }}>Tap to flip</span></div>
            <div className="flashcard-back"><span className="micro">Definition</span><p>{FLASHCARD[phase].back}</p></div>
          </div>
        </div>
        <div className="overlay-foot">
          <button className="solid-button" onClick={onComplete} data-testid="button-continue-25">Resume video <ArrowRight size={15} /></button>
        </div>
      </div>
    </div>
  );

  // ── 50% — Monitoring sheet ─────────────────────────────────────────────
  if (stage === 'cp50') return (
    <div className="overlay-backdrop">
      <div className="overlay-panel overlay-wide">
        <div className="overlay-top-bar"><span className="overlay-phase-badge">50% reached</span><span className="overlay-step">Monitoring Sheet · Video {videoIndex}</span></div>
        <h2 className="overlay-heading">Halfway point.<br />Check your understanding.</h2>
        <p className="overlay-sub">Respond to each monitoring prompt before continuing.</p>
        <div className="overlay-sheet">
          {MONITORING_QS.map(q => (
            <div className="overlay-field" key={q.id}>
              <label>{q.label}</label>
              <p className="overlay-prompt">{q.prompt}</p>
              <textarea value={answers[q.id] || ''} onChange={e => set(q.id, e.target.value)} placeholder="Your response…" rows={2} />
            </div>
          ))}
        </div>
        <div className="overlay-foot">
          <button className="solid-button" onClick={onComplete} data-testid="button-continue-50">Resume video <ArrowRight size={15} /></button>
        </div>
      </div>
    </div>
  );

  // ── 75% — Muddy Point ─────────────────────────────────────────────────
  if (stage === 'cp75') return (
    <div className="overlay-backdrop">
      <div className="overlay-panel">
        <div className="overlay-top-bar"><span className="overlay-phase-badge">75% reached</span><span className="overlay-step">Monitoring · Muddy Point</span></div>
        <h2 className="overlay-heading">What is still<br />unclear?</h2>
        <p className="overlay-sub">Name the muddiest point in what you have watched so far. Even a partial answer helps you direct attention for the final section.</p>
        <div className="overlay-sheet">
          <div className="overlay-field">
            <label>Muddy point</label>
            <textarea
              value={muddyPoint}
              onChange={e => setMuddyPoint(e.target.value)}
              placeholder="Describe the concept or moment that is least clear to you right now…"
              rows={4}
            />
          </div>
        </div>
        <div className="overlay-foot">
          <button className="solid-button" onClick={onComplete} data-testid="button-continue-75">Resume video <ArrowRight size={15} /></button>
        </div>
      </div>
    </div>
  );

  // ── 100% — Quiz ───────────────────────────────────────────────────────
  if (stage === 'cp100_quiz') {
    const quiz = QUIZ[phase];
    return (
      <div className="overlay-backdrop">
        <div className="overlay-panel">
          <div className="overlay-top-bar"><span className="overlay-phase-badge">Video complete</span><span className="overlay-step">Evaluation · Quiz</span></div>
          <h2 className="overlay-heading">Quick check<br />before you reflect.</h2>
          <p className="overlay-sub">Choose the answer that best matches what you learned.</p>
          <div className="quiz-block">
            <p className="quiz-question">{quiz.question}</p>
            <div className="quiz-options">
              {quiz.options.map((opt, i) => (
                <button
                  key={i}
                  className={`quiz-option${selected === i ? ' selected' : ''}`}
                  onClick={() => setSelected(i)}
                  data-testid={`button-quiz-option-${i}`}
                >{opt}</button>
              ))}
            </div>
          </div>
          <div className="overlay-foot">
            <button className="solid-button" disabled={selected === null} onClick={onComplete} data-testid="button-submit-quiz">
              Submit <Check size={15} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── 100% — Evaluation Sheet ───────────────────────────────────────────
  if (stage === 'cp100_eval') return (
    <div className="overlay-backdrop">
      <div className="overlay-panel overlay-wide">
        <div className="overlay-top-bar"><span className="overlay-phase-badge" style={{ background: 'var(--teal)' }}>{phaseName} phase · Genesis</span><span className="overlay-step">Evaluation Sheet · Video {videoIndex}</span></div>
        <h2 className="overlay-heading">Look back<br />at the move.</h2>
        <p className="overlay-sub">Evaluation is not a score alone. It is evidence about which strategy helped, where the concept shifted, and what you would change next time.</p>
        <div className="overlay-sheet">
          {EVAL_QS.map(q => (
            <div className="overlay-field" key={q.id}>
              <label>{q.label}</label>
              <p className="overlay-prompt">{q.prompt}</p>
              <textarea value={answers[q.id] || ''} onChange={e => set(q.id, e.target.value)} placeholder="Your reflection…" rows={2} />
            </div>
          ))}
        </div>
        <div className="overlay-foot">
          <button className="solid-button" onClick={onComplete} data-testid="button-complete-video">
            Complete video <Check size={15} />
          </button>
        </div>
      </div>
    </div>
  );

  return null;
}

// ── Video player ───────────────────────────────────────────────────────────
interface VideoPlayerProps {
  slot: VideoSlot;
  stage: CheckpointStage;
  onCheckpoint: (pct: 25 | 50 | 75 | 100) => void;
}

function VideoPlayer({ slot, stage, onCheckpoint }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  // Track which checkpoints have already fired for this video
  const fired = useRef<Set<number>>(new Set());
  const CHECKPOINTS = [25, 50, 75, 100] as const;

  // Pause the video whenever an overlay is showing
  useEffect(() => {
    if (stage !== 'playing') {
      videoRef.current?.pause();
      setPlaying(false);
    }
  }, [stage]);

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || !isFinite(v.duration) || v.duration === 0) return;
    const pct = (v.currentTime / v.duration) * 100;
    setProgress(pct);
    for (const cp of [25, 50, 75] as const) {
      if (pct >= cp && !fired.current.has(cp)) {
        fired.current.add(cp);
        v.pause();
        setPlaying(false);
        onCheckpoint(cp);
        break; // only fire one checkpoint at a time
      }
    }
  };

  const handleEnded = () => {
    if (!fired.current.has(100)) {
      fired.current.add(100);
      setPlaying(false);
      setProgress(100);
      onCheckpoint(100);
    }
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) { v.pause(); setPlaying(false); }
    else { v.play().catch(() => {}); setPlaying(true); }
  };

  const cpDone = (cp: number) => fired.current.has(cp);

  // ── Simulation mode (no video file yet) ───────────────────────────────
  const [simProgress, setSimProgress] = useState(0);
  const simRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startSim = () => {
    if (simRef.current) return;
    setPlaying(true);
    simRef.current = setInterval(() => {
      setSimProgress(prev => {
        const next = prev + 1;
        for (const cp of [25, 50, 75] as const) {
          if (next >= cp && !fired.current.has(cp)) {
            fired.current.add(cp);
            clearInterval(simRef.current!);
            simRef.current = null;
            setPlaying(false);
            onCheckpoint(cp);
            return next;
          }
        }
        if (next >= 100) {
          clearInterval(simRef.current!);
          simRef.current = null;
          setPlaying(false);
          if (!fired.current.has(100)) {
            fired.current.add(100);
            onCheckpoint(100);
          }
          return 100;
        }
        return next;
      });
    }, 80); // ~8 s per 100 steps for demo speed
  };

  const pauseSim = () => {
    if (simRef.current) { clearInterval(simRef.current); simRef.current = null; }
    setPlaying(false);
  };

  const toggleSim = () => playing ? pauseSim() : startSim();

  // ── Render ─────────────────────────────────────────────────────────────
  const displayProgress = slot.src ? progress : simProgress;

  return (
    <div className="video-surface">
      {slot.src
        ? <video ref={videoRef} src={slot.src} onTimeUpdate={handleTimeUpdate} onEnded={handleEnded} className="video-element" />
        : (
          <div className="video-placeholder">
            <button className="play-button" onClick={stage === 'playing' ? toggleSim : undefined} aria-label={playing ? 'Pause' : 'Play'}>
              {playing ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <h2>{slot.title}</h2>
            <p className="video-placeholder-note">Upload video to enable real playback · simulation active</p>
          </div>
        )
      }

      <div className="video-controls">
        {slot.src
          ? <button className="video-ctrl-btn" onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'}>{playing ? <Pause size={16} /> : <Play size={16} />}</button>
          : <button className="video-ctrl-btn" onClick={toggleSim} aria-label={playing ? 'Pause simulation' : 'Run simulation'}>{playing ? <Pause size={16} /> : <Play size={16} />}</button>
        }
        <div className="progress-track" role="progressbar" aria-valuenow={Math.round(displayProgress)} aria-valuemin={0} aria-valuemax={100}>
          <div className="progress-fill" style={{ width: `${displayProgress}%` }} />
          {CHECKPOINTS.map(cp => (
            <div key={cp} className={`progress-cp${cpDone(cp) ? ' done' : ''}`} style={{ left: `${cp}%` }} title={`${cp}% checkpoint`} />
          ))}
        </div>
        <span className="micro video-pct">{Math.round(displayProgress)}%</span>
      </div>
    </div>
  );
}

// ── Phase video workspace (one phase's 14-video playlist + player) ─────────
function PhaseVideoWorkspace({ phase, onToast }: { phase: Phase; onToast: (m: string) => void }) {
  const slots = PHASE_VIDEOS[phase];
  const [videoIdx, setVideoIdx] = useState<number | null>(null); // null = list view
  const [stage, setStage] = useState<CheckpointStage>('pre');
  const [strategy, setStrategy] = useState(strategies[0]);
  // Track which video IDs are done
  const [done, setDone] = useState<Set<number>>(new Set());

  const currentSlot = videoIdx !== null ? slots[videoIdx] : null;
  const phaseName = { immersion: 'Immersion', transition: 'Transition', genesis: 'Genesis' }[phase];

  const openVideo = (idx: number) => {
    setVideoIdx(idx);
    setStage('pre');
    setStrategy(strategies[0]);
  };

  const handleCheckpoint = (pct: 25 | 50 | 75 | 100) => {
    if (pct === 25) setStage('cp25');
    else if (pct === 50) setStage('cp50');
    else if (pct === 75) setStage('cp75');
    else { setStage('cp100_quiz'); }
  };

  const handleOverlayComplete = () => {
    if (stage === 'pre') {
      setStage('playing');
    } else if (stage === 'cp25' || stage === 'cp50' || stage === 'cp75') {
      setStage('playing');
      onToast(`${stage === 'cp25' ? 'Flashcard' : stage === 'cp50' ? 'Monitoring sheet' : 'Muddy point'} saved.`);
    } else if (stage === 'cp100_quiz') {
      setStage('cp100_eval');
    } else if (stage === 'cp100_eval') {
      // Mark video done and advance
      if (videoIdx !== null) {
        setDone(d => new Set([...d, slots[videoIdx].id]));
        const next = videoIdx + 1;
        if (next < slots.length) {
          onToast(`Video ${videoIdx + 1} complete — starting Video ${next + 1}.`);
          setVideoIdx(next);
          setStage('pre');
        } else {
          onToast(`All ${phaseName} phase videos complete!`);
          setVideoIdx(null);
          setStage('pre');
        }
      }
    }
  };

  // ── Playlist view ─────────────────────────────────────────────────────
  if (currentSlot === null) return (
    <div className="playlist">
      <div className="playlist-header">
        <div>
          <span className="eyebrow">{phaseName} phase</span>
          <h2>14 videos · {done.size} complete</h2>
        </div>
        <div className="playlist-progress-bar">
          <div className="playlist-fill" style={{ width: `${(done.size / 14) * 100}%` }} />
        </div>
      </div>
      <div className="playlist-grid">
        {slots.map((slot, i) => {
          const isDone = done.has(slot.id);
          const isNext = !isDone && (i === 0 || done.has(slots[i - 1].id));
          return (
            <button
              key={slot.id}
              className={`video-card${isDone ? ' done' : ''}${isNext ? ' next' : ''}`}
              onClick={() => openVideo(i)}
              data-testid={`button-video-${slot.id}`}
            >
              <span className="video-card-num">{String(slot.index).padStart(2, '0')}</span>
              <span className="video-card-title">{slot.title}</span>
              <span className="video-card-status">
                {isDone ? <Check size={14} /> : isNext ? <Play size={12} /> : null}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  // ── Video player view ──────────────────────────────────────────────────
  return (
    <div className="video-workspace">
      <div className="video-workspace-header">
        <button className="back-button" onClick={() => setVideoIdx(null)}>
          <ArrowLeft size={14} /> Back to playlist
        </button>
        <span className="video-workspace-label">{phaseName} phase · {currentSlot.title}</span>
        <span className="video-checkpoint-status">
          {stage === 'playing' ? 'Playing…' : stage === 'pre' ? 'Ready to plan' : `Paused at ${stage === 'cp25' ? '25%' : stage === 'cp50' ? '50%' : stage === 'cp75' ? '75%' : '100%'}`}
        </span>
      </div>

      <VideoPlayer slot={currentSlot} stage={stage} onCheckpoint={handleCheckpoint} />

      {/* Checkpoint overlay sits on top of the video */}
      {stage !== 'playing' && stage !== 'done' && (
        <CheckpointOverlay
          stage={stage}
          phase={phase}
          videoIndex={currentSlot.index}
          strategy={strategy}
          onStrategy={setStrategy}
          onComplete={handleOverlayComplete}
        />
      )}

      {/* Checkpoint progress tracker below video */}
      <div className="cp-tracker">
        {([['0:00', 'Planning', 'pre'], ['25%', 'Flashcard', 'cp25'], ['50%', 'Monitoring', 'cp50'], ['75%', 'Muddy Point', 'cp75'], ['100%', 'Quiz + Eval', 'cp100_quiz']] as const).map(([time, label, s]) => {
          const stageOrder: CheckpointStage[] = ['pre', 'playing', 'cp25', 'cp50', 'cp75', 'cp100_quiz', 'cp100_eval', 'done'];
          const isActive = stage === s || (s === 'pre' && stage === 'playing' && stageOrder.indexOf(stage) < stageOrder.indexOf('cp25'));
          const isPast = stageOrder.indexOf(stage) > stageOrder.indexOf(s);
          return (
            <div key={s} className={`cp-step${isActive ? ' active' : ''}${isPast ? ' past' : ''}`}>
              <div className="cp-dot">{isPast ? <Check size={10} /> : null}</div>
              <span className="cp-time">{time}</span>
              <span className="cp-label">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Lesson workspace — phase tabs + video workspaces ──────────────────────
function LessonWorkspace({ onBack, onToast }: { onBack: () => void; onToast: (m: string) => void }) {
  const [phase, setPhase] = useState<Phase>('immersion');
  return (
    <>
      <div className="lesson-header">
        <div>
          <button className="back-button" onClick={onBack}><ArrowLeft size={14} /> Back to Unit I</button>
          <span className="eyebrow" style={{ marginTop: 22 }}>Group C · Unit I · Education &amp; Psychology</span>
          <h1>42 videos,<br />three phases.</h1>
          <p>Every video follows the same five-checkpoint structure automatically: planning, flashcard, monitoring, muddy point, and evaluation.</p>
        </div>
      </div>

      <div className="phase-nav">
        {(['immersion', 'transition', 'genesis'] as Phase[]).map((key, i) => (
          <button
            className={`phase-tab${phase === key ? ' active' : ''}`}
            key={key}
            onClick={() => setPhase(key)}
            data-testid={`button-phase-${key}`}
          >
            <span className="phase-code">0{i + 1} · {key}</span>
            <strong>{key === 'immersion' ? 'Build the plan' : key === 'transition' ? 'Learn with support' : 'Evaluate & reflect'}</strong>
            <span className="phase-tab-count">14 videos</span>
          </button>
        ))}
      </div>

      <div className="phase-content">
        <PhaseVideoWorkspace key={phase} phase={phase} onToast={onToast} />
      </div>
    </>
  );
}

// ── Chatbot (Levo) ────────────────────────────────────────────────────────
function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(['I am Levo. Ask me about the lesson, a strategy, or where to look next.']);
  const send = () => {
    if (!input.trim()) return;
    const q = input.trim();
    setMessages(m => [...m, q, 'Try connecting that question to the three phases: plan what you know, monitor what changes, then reflect on the evidence.']);
    setInput('');
  };
  return (
    <div className="chatbot">
      {open && (
        <div className="chat-window">
          <div className="chat-header">
            <div><strong>Levo</strong><small>learning companion</small></div>
            <button onClick={() => setOpen(false)} aria-label="Close Levo"><X size={16} /></button>
          </div>
          <div className="chat-messages">
            {messages.map((m, i) => <div className={`chat-message${i % 2 === 1 ? ' user' : ''}`} key={`${m}-${i}`}>{m}</div>)}
          </div>
          <div className="chat-input">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Ask Levo…" aria-label="Message Levo" data-testid="input-chat" />
            <button onClick={send} aria-label="Send" data-testid="button-send-chat"><Send size={15} /></button>
          </div>
        </div>
      )}
      <button className="chat-toggle" onClick={() => setOpen(!open)} aria-label="Open Levo chatbot" data-testid="button-open-levo"><Bot size={22} /></button>
    </div>
  );
}

// ── Landing ───────────────────────────────────────────────────────────────
function Landing({ onEnter }: { onEnter: (role: 'student' | 'admin') => void }) {
  const [quote, setQuote] = useState(quotes[0]);
  useEffect(() => { setQuote(quotes[Math.floor(Math.random() * quotes.length)]); }, []);
  return (
    <main className="landing">
      <header className="landing-header">
        <span className="brand"><span className="brand-mark" /><span className="brand-copy">3 Phasic Meta Learn</span></span>
        <nav className="landing-nav">
          <span className="micro">Research prototype</span>
          <button className="outline-button" onClick={() => onEnter('admin')} data-testid="button-enter-admin"><LayoutDashboard size={15} /> Admin view</button>
        </nav>
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
            <div className="quote-card"><blockquote>"{quote[0]}"</blockquote><cite>— {quote[1]} · opening reflection</cite></div>
          </div>
          <div className="orbit-stage" aria-label="Three phases: Immersion, Transition, and Genesis">
            <div className="orbit-ring"><span /></div>
            <div className="orbit-center"><Sparkles size={22} /><strong>learning<br />visible</strong></div>
            <div className="orbit-node node-immersion"><Lightbulb size={19} /><span>Immersion</span></div>
            <div className="orbit-node node-transition"><Zap size={19} /><span>Transition</span></div>
            <div className="orbit-node node-genesis"><Target size={19} /><span>Genesis</span></div>
          </div>
        </div>
      </section>
      <footer className="landing-footer">
        <div className="landing-footer-researcher">
          <strong>Sharmin Shahnaz</strong>
          <span>Reg. No. 24DEDUC010 · Ph.D. Research Scholar</span>
          <span>Department of Education · Central University of Karnataka</span>
        </div>
        <span className="micro">Education subject · Group C / Group D</span>
      </footer>
    </main>
  );
}

// ── Topbar ────────────────────────────────────────────────────────────────
function Topbar({ onHome, onRole }: { onHome: () => void; onRole: (r: 'student' | 'admin') => void }) {
  return (
    <header className="topbar">
      <button className="brand" onClick={onHome} aria-label="Return to home"><span className="brand-mark" /><span className="brand-copy">3 Phasic Meta Learn</span></button>
      <div className="topbar-researcher"><span className="topbar-researcher-name">Sharmin Shahnaz</span><span className="micro">Reg. 24DEDUC010 · Dept. of Education · CUK</span></div>
      <div className="topbar-actions"><button className="icon-button" onClick={() => onRole('admin')} aria-label="Admin dashboard"><LayoutDashboard size={16} /></button><button className="icon-button" onClick={onHome} aria-label="Return home"><X size={16} /></button></div>
    </header>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────
function Sidebar({ view, onView }: { view: StudentView; onView: (v: StudentView) => void }) {
  const items: [StudentView, string, ReactNode][] = [
    ['subject', 'Subject overview', <BookOpen size={16} />],
    ['group', 'Groups C + D', <Users size={16} />],
    ['unit', 'Unit I · Education', <FileText size={16} />],
    ['lesson', 'Video workspace', <ClipboardCheck size={16} />],
  ];
  return (
    <aside className="sidebar">
      <div className="sidebar-intro"><span className="micro">Student workspace</span><h2>Education<br />research lab</h2></div>
      <nav className="nav-list">{items.map(([key, label, icon]) => <button className={`nav-item${view === key ? ' active' : ''}`} key={key} onClick={() => onView(key)} data-testid={`nav-${key}`}>{icon}<span>{label}</span></button>)}</nav>
      <div className="sidebar-footer"><span className="micro">Current pathway</span><p>Group C · Unit I<br />42 videos · 3 phases</p></div>
    </aside>
  );
}

function StudentShell({ onHome, onAdmin, children, view, onView }: { onHome: () => void; onAdmin: () => void; children: ReactNode; view: StudentView; onView: (v: StudentView) => void }) {
  return <div className="shell"><Topbar onHome={onHome} onRole={() => onAdmin()} /><div className="workspace"><Sidebar view={view} onView={onView} /><main className="main-column"><div className="main-inner">{children}</div></main></div></div>;
}

// ── Subject / Group / Unit views ──────────────────────────────────────────
function SubjectView({ onGroup }: { onGroup: (g: 'C' | 'D') => void }) {
  return (
    <>
      <div className="breadcrumb"><span>Student</span><ChevronRight size={12} /><span>Subject overview</span></div>
      <div className="page-heading"><div><span className="section-index">01 · orientation</span><h1>Education<br />as inquiry.</h1></div><p>Follow one curriculum through a sequence designed to make planning, support, and reflection observable.</p></div>
      <section className="subject-card surface"><div className="subject-card-copy"><span className="eyebrow">Education subject</span><h2>Learning, mind,<br />and context</h2><p>A research-informed pathway for exploring how people learn — and how learners can become better observers of their own thinking.</p></div><div className="subject-card-art"><div className="art-lines" /></div></section>
      <div className="section-heading" style={{ marginBottom: 17 }}><span className="section-index">02 · cohort</span><div><span className="eyebrow">Choose a study group</span><h2 style={{ fontFamily: 'var(--serif)', fontSize: 36, fontWeight: 400, margin: '12px 0 0' }}>Where will you begin?</h2></div></div>
      <div className="group-grid"><button className="group-card" onClick={() => onGroup('C')} data-testid="button-group-c"><span className="group-letter">GROUP C</span><ChevronRight size={18} /><h3>Foundations</h3><p>Unit I · 42 videos · 3 phases</p></button><button className="group-card" onClick={() => onGroup('D')} data-testid="button-group-d"><span className="group-letter">GROUP D</span><ChevronRight size={18} /><h3>Applications</h3><p>Unit I · coming soon</p></button></div>
    </>
  );
}

function GroupView({ onUnit, onBack }: { onUnit: () => void; onBack: () => void }) {
  return (
    <>
      <div className="breadcrumb"><button onClick={onBack}>Subject</button><ChevronRight size={12} /><span>Group C</span></div>
      <div className="page-heading"><div><span className="section-index">03 · pathway</span><h1>Group C<br />foundations.</h1></div><p>A paced entry into educational psychology, with room to pause and make your learning decisions explicit.</p></div>
      <div className="unit-view"><section className="unit-rail"><span className="eyebrow" style={{ color: '#a9d7cb' }}>Group C · curriculum</span><h2>One unit.<br />Many lenses.</h2><p>42 videos across three phases. Every video follows the same five-checkpoint structure automatically.</p><div className="contact-hours">42 videos · 3 phases · active</div></section><section className="lesson-list"><button className="lesson-row" onClick={onUnit} data-testid="button-open-unit"><span className="lesson-number">UNIT I</span><span><h3>Education &amp; Psychology</h3><p>14 Immersion videos · 14 Transition videos · 14 Genesis videos.</p></span><ChevronRight size={18} /></button></section></div>
    </>
  );
}

function UnitView({ onLesson, onBack }: { onLesson: () => void; onBack: () => void }) {
  return (
    <>
      <div className="breadcrumb"><button onClick={onBack}>Group C</button><ChevronRight size={12} /><span>Unit I</span></div>
      <div className="page-heading"><div><span className="section-index">04 · unit map</span><h1>Education<br />&amp; Psychology.</h1></div><p>42 videos across three phases. Each video pauses automatically at 25%, 50%, 75%, and 100% for interactive monitoring and evaluation.</p></div>
      <div className="unit-view">
        <section className="unit-rail"><span className="eyebrow" style={{ color: '#a9d7cb' }}>Unit I</span><h2>42 videos<br />3 phases</h2><p>Build a shared vocabulary before choosing a strategy for learning with the material.</p><div className="contact-hours">Group C · automated checkpoints</div></section>
        <section className="lesson-list">
          {(['immersion', 'transition', 'genesis'] as Phase[]).map((ph, i) => (
            <button className="lesson-row" key={ph} onClick={onLesson} data-testid={`button-open-phase-${ph}`}>
              <span className="lesson-number">0{i + 1}</span>
              <span>
                <h3>{ph.charAt(0).toUpperCase() + ph.slice(1)} phase</h3>
                <p>14 videos · planning, flashcard, monitoring, muddy point, quiz & evaluation at each video.</p>
              </span>
              <ChevronRight size={18} />
            </button>
          ))}
        </section>
      </div>
    </>
  );
}

// ── Student app ───────────────────────────────────────────────────────────
function StudentApp({ onHome, onAdmin }: { onHome: () => void; onAdmin: () => void }) {
  const [view, setView] = useState<StudentView>('subject');
  const [toast, setToast] = useState('');
  const go = (v: StudentView) => setView(v);
  useEffect(() => { if (!toast) return; const t = window.setTimeout(() => setToast(''), 3200); return () => window.clearTimeout(t); }, [toast]);
  return (
    <>
      <StudentShell onHome={onHome} onAdmin={onAdmin} view={view} onView={go}>
        {view === 'subject' && <SubjectView onGroup={() => setView('group')} />}
        {view === 'group'   && <GroupView onUnit={() => setView('unit')} onBack={() => setView('subject')} />}
        {view === 'unit'    && <UnitView onLesson={() => setView('lesson')} onBack={() => setView('group')} />}
        {view === 'lesson'  && <LessonWorkspace onBack={() => setView('unit')} onToast={setToast} />}
      </StudentShell>
      <Chatbot />
      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </>
  );
}

// ── Admin app ─────────────────────────────────────────────────────────────
function AdminApp({ onHome, onStudent }: { onHome: () => void; onStudent: () => void }) {
  return (
    <div className="shell">
      <Topbar onHome={onHome} onRole={r => r === 'student' && onStudent()} />
      <div className="workspace">
        <Sidebar view="subject" onView={onStudent} />
        <main className="main-column"><div className="main-inner">
          <div className="admin-hero"><div><span className="section-index">Committee view · 06</span><h1>Curriculum<br />in motion.</h1></div><p>One glance across the pathway: what is being taught, what learners are doing, and where support is needed.</p></div>
          <section className="metrics">
            <div className="metric"><span className="metric-label">Active learners</span><strong>48</strong><small>+6 this week</small></div>
            <div className="metric"><span className="metric-label">Completion rate</span><strong>72%</strong><small>Group C leading</small></div>
            <div className="metric"><span className="metric-label">At transition</span><strong>19</strong><small>Needs a check-in</small></div>
            <div className="metric"><span className="metric-label">Reflections</span><strong>31</strong><small>Collected locally</small></div>
          </section>
          <div className="admin-grid">
            <section className="admin-panel surface">
              <div className="panel-title"><h2>Curriculum overview</h2><span>3 phases · 42 videos</span></div>
              {[['01', 'Immersion · planning', 'Learners selecting strategies', '78%'], ['02', 'Transition · supported learning', 'Midpoint monitoring active', '50%'], ['03', 'Genesis · evaluation', 'Reflections submitted', '64%']].map(([n, t, s, p]) => (
                <div className="curriculum-row" key={n}><span>{n}</span><div><strong>{t}</strong><small>{s}</small></div><div className="bar"><span style={{ width: p }} /></div></div>
              ))}
            </section>
            <section className="admin-panel surface">
              <div className="panel-title"><h2>Learner pulse</h2><span>today</span></div>
              <div className="learner-list">
                {[['AS', 'A. Sen', 'Group C · Immersion', '86%'], ['MN', 'M. Noor', 'Group D · Unit I', '61%'], ['RK', 'R. Karim', 'Group C · Transition', '50%']].map(([ini, name, detail, prog]) => (
                  <div className="learner" key={name}><span className="avatar">{ini}</span><div className="learner-info"><strong>{name}</strong><small>{detail}</small></div><span className="learner-progress">{prog}</span></div>
                ))}
              </div>
              <div className="signal-box"><span className="micro">Committee signal</span><p>Several learners paused at the distinction between perception and conception. Consider adding a shared example to the next live session.</p></div>
            </section>
          </div>
        </div></main>
      </div>
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────
function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const enter = (role: 'student' | 'admin') => setScreen(role);
  if (screen === 'landing') return <Landing onEnter={enter} />;
  if (screen === 'admin') return <AdminApp onHome={() => setScreen('landing')} onStudent={() => setScreen('student')} />;
  return <StudentApp onHome={() => setScreen('landing')} onAdmin={() => setScreen('admin')} />;
}

export default App;
