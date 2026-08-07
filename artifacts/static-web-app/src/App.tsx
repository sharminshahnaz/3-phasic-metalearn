import { ArrowRight, Check, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

const prompts = [
  {
    question: 'What is asking for your attention?',
    options: ['My body', 'My thoughts', 'Something outside me'],
  },
  {
    question: 'What would feel like enough, for now?',
    options: ['A small pause', 'One honest thing', 'A little movement'],
  },
  {
    question: 'Where could you place one kind step?',
    options: ['In the next hour', 'Before the day ends', 'Tomorrow morning'],
  },
];

const responses = [
  {
    heading: 'Make room for your body.',
    copy: 'Take three slow breaths. Unclench one place you are holding. Let that be the work for this minute.',
  },
  {
    heading: 'Let the thought be seen.',
    copy: 'Write down the sentence that keeps circling. You do not have to solve it. Naming it is a form of space.',
  },
  {
    heading: 'Come back to what is here.',
    copy: 'Notice one shape, one sound, and one point of warmth. The outside world can wait while you arrive.',
  },
];

function CheckIn() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [complete, setComplete] = useState(false);

  const currentPrompt = prompts[step];
  const choose = (option: string) => {
    setSelected(option);
    window.setTimeout(() => {
      if (step === prompts.length - 1) {
        setComplete(true);
      } else {
        setSelected(null);
        setStep((value) => value + 1);
      }
    }, 250);
  };

  const restart = () => {
    setStep(0);
    setSelected(null);
    setComplete(false);
  };

  return (
    <div className="checkin-card" data-testid="card-checkin">
      <div className="card-topline">
        <span>{complete ? 'A small next step' : `Pause / 0${step + 1}`}</span>
        <span className="progress-dots" aria-label={`Step ${step + 1} of ${prompts.length}`}>
          {prompts.map((prompt, index) => (
            <span
              className={`progress-dot ${index <= step ? 'is-active' : ''}`}
              key={prompt.question}
            />
          ))}
        </span>
      </div>
      {complete ? (
        <div className="prompt-wrap checkin-result" data-testid="status-checkin-complete">
          <div className="result-mark" aria-hidden="true">
            <Check size={21} strokeWidth={1.7} />
          </div>
          <div className="result-copy">
            <h3>That is enough for now.</h3>
            <p>{responses[step % responses.length].copy}</p>
            <button className="result-action" data-testid="button-checkin-restart" onClick={restart} type="button">
              <RotateCcw size={12} /> Begin again
            </button>
          </div>
        </div>
      ) : (
        <div className="prompt-wrap" key={currentPrompt.question}>
          <h3 className="prompt-question" data-testid="text-checkin-question">{currentPrompt.question}</h3>
          <div className="prompt-options">
            {currentPrompt.options.map((option) => (
              <button
                className={`prompt-option ${selected === option ? 'is-selected' : ''}`}
                data-testid={`button-checkin-${option.toLowerCase().replaceAll(' ', '-')}`}
                key={option}
                onClick={() => choose(option)}
                type="button"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Home() {
  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="wordmark" data-testid="link-home" href="#top">
          <span aria-hidden="true" className="wordmark-mark" />
          still / here
        </a>
        <span className="topbar-note">A place to pause</span>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow">For the in-between moments</div>
          <h1>Begin<br /><em>with less.</em></h1>
          <p className="hero-intro">
            A quiet corner for when everything feels like too much. Pause here, notice what is true, and choose one thing to carry forward.
          </p>
          <div className="hero-actions">
            <a className="button-primary" data-testid="link-start-pause" href="#check-in">
              Start a pause <ArrowRight size={16} strokeWidth={1.8} />
            </a>
            <a className="button-quiet" data-testid="link-how-it-works" href="#principles">
              How it works
            </a>
          </div>
        </div>
        <div className="hero-orbit" aria-label="A visual representation of a pause" role="img">
          <div className="orbit-ring" />
          <div className="orbit-core">
            <div className="orbit-core-inner" />
          </div>
          <div className="orbit-label">nothing to fix</div>
        </div>
      </section>

      <div className="section-rule" />

      <section className="practice" id="check-in">
        <div className="practice-inner">
          <span className="section-kicker">01 / Check in</span>
          <div>
            <h2 className="practice-heading">Start where you <em>are.</em></h2>
            <CheckIn />
          </div>
        </div>
      </section>

      <section className="principles" id="principles">
        <div className="principles-header">
          <div>
            <span className="section-kicker">02 / A few reminders</span>
            <h2 className="principles-title">You do not need<br />to <em>do it all.</em></h2>
          </div>
          <p className="principles-note">Keep what helps. Leave what does not. There is no correct way through a day.</p>
        </div>
        <div className="principle-list">
          <article className="principle-row" data-testid="row-principle-01">
            <span className="principle-number">01</span>
            <span className="principle-name">Notice</span>
            <span className="principle-description">Attention is not a demand. It is simply a way back to the present.</span>
            <ArrowRight className="principle-arrow" size={17} strokeWidth={1.5} />
          </article>
          <article className="principle-row" data-testid="row-principle-02">
            <span className="principle-number">02</span>
            <span className="principle-name">Soften</span>
            <span className="principle-description">You can meet yourself without turning the moment into a problem.</span>
            <ArrowRight className="principle-arrow" size={17} strokeWidth={1.5} />
          </article>
          <article className="principle-row" data-testid="row-principle-03">
            <span className="principle-number">03</span>
            <span className="principle-name">Choose</span>
            <span className="principle-description">One meaningful next step is still movement. Small counts here.</span>
            <ArrowRight className="principle-arrow" size={17} strokeWidth={1.5} />
          </article>
        </div>
      </section>

      <footer className="closing" id="about">
        <div className="closing-inner">
          <div className="closing-main">
            <h2>Take what<br /><em>you need.</em></h2>
            <p className="closing-copy">Still / here is a tiny practice for returning to yourself, made for ordinary days.</p>
          </div>
          <div className="footer-line">
            <span>© 2024 Still / here</span>
            <a data-testid="link-about" href="#about">Made for the moments between things</a>
          </div>
        </div>
      </footer>
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