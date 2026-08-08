import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import {
  ArrowLeft, ArrowRight, BookOpen, Bot, Check, ChevronRight,
  ClipboardCheck, FileText, Gamepad2, LayoutDashboard, Lightbulb,
  NotebookPen, Pause, Play, RefreshCw, Send, Sparkles, Star,
  Target, Users, X, Zap,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────
type Lang   = 'en' | 'bn';
type Role   = 'student' | 'teacher';          // teacher sees phase names
type Screen = 'landing' | 'student' | 'admin';
type StudentView = 'subject' | 'group' | 'unit' | 'lesson' | 'notes' | 'games';
type Phase  = 'immersion' | 'transition' | 'genesis';
type CheckpointStage =
  | 'pre' | 'playing' | 'cp25' | 'cp50' | 'cp75'
  | 'cp100_quiz' | 'cp100_eval' | 'done';

// ── Contexts ───────────────────────────────────────────────────────────────
const LangContext = createContext<{ lang: Lang; toggleLang: () => void }>({ lang: 'en', toggleLang: () => {} });
const RoleContext = createContext<{ role: Role }>({ role: 'student' });
const useLang = () => useContext(LangContext);
const useRole = () => useContext(RoleContext);

// ── Phase label helper ─────────────────────────────────────────────────────
// Students see "Phase 1 / 2 / 3" — only teachers see Immersion/Transition/Genesis
const PHASE_NUMS: Record<Phase, { en: string; bn: string }> = {
  immersion:  { en: 'Phase 1', bn: 'পর্যায় ১' },
  transition: { en: 'Phase 2', bn: 'পর্যায় ২' },
  genesis:    { en: 'Phase 3', bn: 'পর্যায় ৩' },
};

function phaseLabel(phase: Phase, role: Role, lang: Lang): string {
  if (role === 'teacher') {
    return lang === 'en'
      ? ({ immersion: 'Immersion', transition: 'Transition', genesis: 'Genesis' }[phase])
      : ({ immersion: 'নিমজ্জন',    transition: 'রূপান্তর',     genesis: 'উৎপত্তি' }[phase]);
  }
  return PHASE_NUMS[phase][lang];
}

// ── Translations ───────────────────────────────────────────────────────────
const S = {
  en: {
    brand: '3 Phasic Meta Learn',
    researchPrototype: 'Research prototype',
    researcherName: 'Sharmin Shahnaz',
    researcherReg: 'Reg. No. 24DEDUC010 · Ph.D. Research Scholar',
    researcherDept: 'Department of Education · Central University of Karnataka',
    researcherShort: 'Reg. 24DEDUC010 · Dept. of Education · CUK',
    landingEyebrow: 'A visible architecture for learning',
    landingH1: 'Learn in',
    landingH2: 'three phases.',
    landingBody: '3 Phasic Meta Learn makes the hidden work of learning visible — from building a plan, to learning with support, to evaluating the moves that made progress possible.',
    enterStudent: 'Enter student demo',
    enterAdmin: 'Explore the committee dashboard',
    adminView: 'Admin view',
    openingReflection: 'opening reflection',
    footerSub: 'Education subject · Group C / Group D',
    phase: 'phase',
    phaseLabel1: 'Phase 1', phaseLabel2: 'Phase 2', phaseLabel3: 'Phase 3',
    phaseSub1: 'Build the plan',
    phaseSub2: 'Learn with support',
    phaseSub3: 'Evaluate & reflect',
    videos: 'videos',
    sidebarTitle: 'Student workspace',
    sidebarSubtitle: 'Education\nresearch lab',
    navSubject: 'Subject overview',
    navGroup: 'Groups C + D',
    navUnit: 'Unit I · Education',
    navLesson: 'Video workspace',
    navNotes: 'My Notes',
    navGames: 'Games & Activities',
    sidebarFooterLabel: 'Current pathway',
    sidebarFooterDetail: 'Group C · Unit I\n42 videos · 3 phases',
    subjectIndex: '01 · orientation',
    subjectH1a: 'Education', subjectH1b: 'as inquiry.',
    subjectBody: 'Follow one curriculum through a sequence designed to make planning, support, and reflection observable.',
    subjectCardEyebrow: 'Education subject',
    subjectCardH2: 'Learning, mind,\nand context',
    subjectCardBody: 'A research-informed pathway for exploring how people learn — and how learners can become better observers of their own thinking.',
    cohortIndex: '02 · cohort',
    cohortEyebrow: 'Choose a study group',
    cohortHeading: 'Where will you begin?',
    groupCTitle: 'Foundations', groupCDetail: 'Unit I · 42 videos · 3 phases',
    groupDTitle: 'Applications', groupDDetail: 'Unit I · coming soon',
    groupIndex: '03 · pathway',
    groupH1a: 'Group C', groupH1b: 'foundations.',
    groupBody: 'A paced entry into educational psychology, with room to pause and make your learning decisions explicit.',
    groupRailEyebrow: 'Group C · curriculum',
    groupRailH2a: 'One unit.', groupRailH2b: 'Many lenses.',
    groupRailBody: '42 videos across three phases. Every video follows the same five-checkpoint structure automatically.',
    groupContactHours: '42 videos · 3 phases · active',
    unitRowTitle: 'Education & Psychology',
    unitRowDetail: '14 Phase 1 videos · 14 Phase 2 videos · 14 Phase 3 videos.',
    unitIndex: '04 · unit map',
    unitH1a: 'Education', unitH1b: '& Psychology.',
    unitBody: '42 videos across three phases. Each video pauses automatically at 25%, 50%, 75%, and 100% for interactive monitoring and evaluation.',
    unitRailEyebrow: 'Unit I',
    unitRailH2: '42 videos\n3 phases',
    unitRailBody: 'Build a shared vocabulary before choosing a strategy for learning with the material.',
    unitContactHours: 'Group C · automated checkpoints',
    phaseRowDetail: '14 videos · planning, flashcard, monitoring, muddy point, quiz & evaluation.',
    lessonEyebrow: 'Group C · Unit I · Education & Psychology',
    lessonH1: '42 videos,\nthree phases.',
    lessonBody: 'Every video follows the same five-checkpoint structure automatically: planning, flashcard, monitoring, muddy point, and evaluation.',
    complete: 'complete',
    backToPlaylist: 'Back to playlist',
    uploadNote: 'Upload video to enable real playback · simulation active',
    statusPlaying: 'Playing…', statusReady: 'Ready to plan', statusPaused: 'Paused at',
    cpPlanning: 'Planning', cpFlashcard: 'Flashcard', cpMonitoring: 'Monitoring',
    cpMuddyPoint: 'Muddy Point', cpQuizEval: 'Quiz + Eval',
    prePhase: (p: string) => `${p}`,
    preStep: (i: number) => `Video ${i} of 14 · Planning Sheet`,
    preH2a: 'Before you watch,', preH2b: 'build your plan.',
    preSub: 'Complete the planning sheet and select your strategy. The video starts when you are ready.',
    strategyEyebrow: 'Strategy selector',
    strategyH3: 'Give your thinking a shape.',
    strategyBody: 'Pick one primary move. You can change it later, but begin with a hypothesis.',
    strategyCompactEyebrow: 'Choose your learning strategy',
    startVideo: 'Start video',
    cp25Badge: '25% reached', cp25Step: 'Monitoring · Flashcard',
    cp25H2: 'Test your understanding.',
    cp25Sub: 'Click the card to flip between the term and its definition.',
    flashcardTermLabel: 'Term', flashcardTapToFlip: 'Tap to flip', flashcardDefLabel: 'Definition',
    resumeVideo: 'Resume video',
    cp50Badge: '50% reached', cp50Step: (i: number) => `Monitoring Sheet · Video ${i}`,
    cp50H2a: 'Halfway point.', cp50H2b: 'Check your understanding.',
    cp50Sub: 'Respond to each monitoring prompt before continuing.',
    yourResponse: 'Your response…',
    cp75Badge: '75% reached', cp75Step: 'Monitoring · Muddy Point',
    cp75H2a: 'What is still', cp75H2b: 'unclear?',
    cp75Sub: 'Name the muddiest point in what you have watched so far.',
    muddyPointLabel: 'Muddy point',
    muddyPointPlaceholder: 'Describe the concept or moment that is least clear to you right now…',
    quizBadge: 'Video complete', quizStep: 'Evaluation · Quiz',
    quizH2a: 'Quick check', quizH2b: 'before you reflect.',
    quizSub: 'Choose the answer that best matches what you learned.',
    submitBtn: 'Submit',
    evalBadge: (p: string) => `${p} · Complete`,
    evalStep: (i: number) => `Evaluation Sheet · Video ${i}`,
    evalH2a: 'Look back', evalH2b: 'at the move.',
    evalSub: 'Evaluation is not a score alone. It is evidence about which strategy helped, where the concept shifted, and what you would change next time.',
    yourReflection: 'Your reflection…',
    completeVideo: 'Complete video',
    toastFlashcard: 'Flashcard saved.',
    toastMonitoring: 'Monitoring sheet saved.',
    toastMuddy: 'Muddy point saved.',
    toastVideoDone: (cur: number, next: number) => `Video ${cur} complete — starting Video ${next}.`,
    toastPhaseDone: (p: string) => `All ${p} videos complete!`,
    chatTitle: 'Levo', chatSubtitle: 'learning companion',
    chatWelcome: 'I am Levo. Ask me about the lesson, a strategy, or where to look next.',
    chatReply: 'Try connecting that question to the three phases: plan what you know, monitor what changes, then reflect on the evidence.',
    chatPlaceholder: 'Ask Levo…',
    adminIndex: 'Committee view · 06',
    adminH1a: 'Curriculum', adminH1b: 'in motion.',
    adminBody: 'One glance across the pathway: what is being taught, what learners are doing, and where support is needed.',
    metricLearners: 'Active learners', metricLearnersDetail: '+6 this week',
    metricCompletion: 'Completion rate', metricCompletionDetail: 'Group C leading',
    metricTransition: 'At phase 2', metricTransitionDetail: 'Needs a check-in',
    metricReflections: 'Reflections', metricReflectionsDetail: 'Collected locally',
    curriculumTitle: 'Curriculum overview', curriculumSub: '3 phases · 42 videos',
    pulseTitle: 'Learner pulse', pulseToday: 'today',
    signalLabel: 'Committee signal',
    signalBody: 'Several learners paused at the distinction between perception and conception. Consider adding a shared example to the next live session.',
    strategies: ['Concept mapping', 'Feynman technique', 'Method of loci', 'Retrieval practice'],
    bcStudent: 'Student', bcSubject: 'Subject overview', bcGroupC: 'Group C', bcUnit: 'Unit I',
    langToggle: 'বাংলা',
    // Notes
    notesTitle: 'My Notes',
    notesSubtitle: 'Write and save notes for each phase. Everything saves automatically.',
    notesGeneral: 'General',
    notesClear: 'Clear',
    notesCopied: 'Copied to clipboard!',
    notesCopy: 'Copy notes',
    notesPlaceholder: 'Start writing your notes here…',
    notesWords: (n: number) => `${n} word${n === 1 ? '' : 's'}`,
    notesAutoSave: 'Auto-saved',
    // Games
    gamesTitle: 'Games & Activities',
    gamesSubtitle: 'Sharpen your thinking with interactive exercises.',
    gameMemoryTitle: 'Memory Match',
    gameMemoryDesc: 'Flip cards and match terms to their definitions.',
    gameSpinnerTitle: 'Reflection Spinner',
    gameSpinnerDesc: 'Spin for a random reflection prompt.',
    gameQuizTitle: 'Strategy Quiz',
    gameQuizDesc: 'Pick the right learning strategy for each scenario.',
    gamePlay: 'Play',
    gameRestart: 'Restart',
    gameBack: '← Back to Games',
    matchScore: (m: number, t: number) => `${m} / ${t} matched`,
    matchTime: (s: number) => `${s}s`,
    matchComplete: 'All matched! 🎉',
    matchBestTime: (s: number) => `Best: ${s}s`,
    spinBtn: 'Spin',
    spinPrompt: 'Your prompt:',
    quizScenario: 'Scenario',
    quizOf: (i: number, t: number) => `Question ${i} of ${t}`,
    quizCorrect: 'Correct! ✓',
    quizWrong: 'Not quite. The better answer is:',
    quizNext: 'Next',
    quizDone: (s: number, t: number) => `You scored ${s} / ${t}`,
    quizRetry: 'Try again',
  },
  bn: {
    brand: '৩ পর্যায় মেটা লার্ন',
    researchPrototype: 'গবেষণা প্রোটোটাইপ',
    researcherName: 'শারমিন শাহনাজ',
    researcherReg: 'নিবন্ধন নং ২৪DEDUC০১০ · পিএইচ.ডি. গবেষণা পণ্ডিত',
    researcherDept: 'শিক্ষা বিভাগ · কেন্দ্রীয় কর্ণাটক বিশ্ববিদ্যালয়',
    researcherShort: 'নিবন্ধন ২৪DEDUC০১০ · শিক্ষা বিভাগ · কেকেবি',
    landingEyebrow: 'শিখনের একটি দৃশ্যমান কাঠামো',
    landingH1: 'শিখুন', landingH2: 'তিনটি পর্যায়ে।',
    landingBody: '৩ পর্যায় মেটা লার্ন শিক্ষার গভীর কাজকে দৃশ্যমান করে তোলে।',
    enterStudent: 'শিক্ষার্থী ডেমোতে প্রবেশ করুন',
    enterAdmin: 'কমিটি ড্যাশবোর্ড অন্বেষণ করুন',
    adminView: 'প্রশাসক দৃশ্য',
    openingReflection: 'প্রারম্ভিক প্রতিফলন',
    footerSub: 'শিক্ষা বিষয় · গ্রুপ সি / গ্রুপ ডি',
    phase: 'পর্যায়',
    phaseLabel1: 'পর্যায় ১', phaseLabel2: 'পর্যায় ২', phaseLabel3: 'পর্যায় ৩',
    phaseSub1: 'পরিকল্পনা গড়ুন',
    phaseSub2: 'সহায়তায় শিখুন',
    phaseSub3: 'মূল্যায়ন করুন ও প্রতিফলিত করুন',
    videos: 'ভিডিও',
    sidebarTitle: 'শিক্ষার্থী কর্মক্ষেত্র',
    sidebarSubtitle: 'শিক্ষা\nগবেষণা ল্যাব',
    navSubject: 'বিষয় সারসংক্ষেপ',
    navGroup: 'গ্রুপ সি + ডি',
    navUnit: 'ইউনিট ১ · শিক্ষা',
    navLesson: 'ভিডিও কর্মক্ষেত্র',
    navNotes: 'আমার নোট',
    navGames: 'গেম ও কার্যক্রম',
    sidebarFooterLabel: 'বর্তমান পথ',
    sidebarFooterDetail: 'গ্রুপ সি · ইউনিট ১\n৪২ ভিডিও · ৩ পর্যায়',
    subjectIndex: '০১ · অভিমুখীকরণ',
    subjectH1a: 'শিক্ষা', subjectH1b: 'অনুসন্ধান হিসেবে।',
    subjectBody: 'পরিকল্পনা, সহায়তা এবং প্রতিফলন পর্যবেক্ষণযোগ্য করার জন্য একটি পাঠ্যক্রম অনুসরণ করুন।',
    subjectCardEyebrow: 'শিক্ষা বিষয়',
    subjectCardH2: 'শিক্ষা, মন\nএবং প্রেক্ষাপট',
    subjectCardBody: 'মানুষ কীভাবে শেখে তা অন্বেষণের জন্য একটি গবেষণাভিত্তিক পথ।',
    cohortIndex: '০২ · দল',
    cohortEyebrow: 'একটি অধ্যয়ন গ্রুপ বেছে নিন',
    cohortHeading: 'আপনি কোথা থেকে শুরু করবেন?',
    groupCTitle: 'ভিত্তি', groupCDetail: 'ইউনিট ১ · ৪২ ভিডিও · ৩ পর্যায়',
    groupDTitle: 'প্রয়োগ', groupDDetail: 'ইউনিট ১ · শীঘ্রই আসছে',
    groupIndex: '০৩ · পথ',
    groupH1a: 'গ্রুপ সি', groupH1b: 'ভিত্তি।',
    groupBody: 'শিক্ষামনোবিজ্ঞানে একটি পর্যায়ক্রমিক প্রবেশ।',
    groupRailEyebrow: 'গ্রুপ সি · পাঠ্যক্রম',
    groupRailH2a: 'একটি ইউনিট।', groupRailH2b: 'অনেক দৃষ্টিভঙ্গি।',
    groupRailBody: '৪২ ভিডিও তিনটি পর্যায়ে। প্রতিটি ভিডিও স্বয়ংক্রিয়ভাবে একই পাঁচটি চেকপয়েন্ট অনুসরণ করে।',
    groupContactHours: '৪২ ভিডিও · ৩ পর্যায় · সক্রিয়',
    unitRowTitle: 'শিক্ষা ও মনোবিজ্ঞান',
    unitRowDetail: '১৪টি পর্যায় ১ ভিডিও · ১৪টি পর্যায় ২ ভিডিও · ১৪টি পর্যায় ৩ ভিডিও।',
    unitIndex: '০৪ · ইউনিট মানচিত্র',
    unitH1a: 'শিক্ষা', unitH1b: 'ও মনোবিজ্ঞান।',
    unitBody: '৪২ ভিডিও তিনটি পর্যায়ে। প্রতিটি ভিডিও ইন্টারেক্টিভ পর্যবেক্ষণের জন্য স্বয়ংক্রিয়ভাবে বিরতি দেয়।',
    unitRailEyebrow: 'ইউনিট ১',
    unitRailH2: '৪২ ভিডিও\n৩ পর্যায়',
    unitRailBody: 'শেখার কৌশল বেছে নেওয়ার আগে একটি সাধারণ শব্দভান্ডার তৈরি করুন।',
    unitContactHours: 'গ্রুপ সি · স্বয়ংক্রিয় চেকপয়েন্ট',
    phaseRowDetail: '১৪টি ভিডিও · পরিকল্পনা, ফ্ল্যাশকার্ড, পর্যবেক্ষণ, অস্পষ্ট বিন্দু, কুইজ ও মূল্যায়ন।',
    lessonEyebrow: 'গ্রুপ সি · ইউনিট ১ · শিক্ষা ও মনোবিজ্ঞান',
    lessonH1: '৪২ ভিডিও,\nতিনটি পর্যায়।',
    lessonBody: 'প্রতিটি ভিডিও স্বয়ংক্রিয়ভাবে একই পাঁচটি চেকপয়েন্ট কাঠামো অনুসরণ করে।',
    complete: 'সম্পন্ন',
    backToPlaylist: 'প্লেলিস্টে ফিরুন',
    uploadNote: 'আসল প্লেব্যাকের জন্য ভিডিও আপলোড করুন · সিমুলেশন সক্রিয়',
    statusPlaying: 'চলছে…', statusReady: 'পরিকল্পনার জন্য প্রস্তুত', statusPaused: 'বিরতি দেওয়া হয়েছে',
    cpPlanning: 'পরিকল্পনা', cpFlashcard: 'ফ্ল্যাশকার্ড', cpMonitoring: 'পর্যবেক্ষণ',
    cpMuddyPoint: 'অস্পষ্ট বিন্দু', cpQuizEval: 'কুইজ + মূল্যায়ন',
    prePhase: (p: string) => `${p}`,
    preStep: (i: number) => `ভিডিও ${i} / ১৪ · পরিকল্পনা পত্র`,
    preH2a: 'দেখার আগে,', preH2b: 'পরিকল্পনা তৈরি করুন।',
    preSub: 'পরিকল্পনা পত্র পূরণ করুন এবং আপনার কৌশল নির্বাচন করুন।',
    strategyEyebrow: 'কৌশল নির্বাচক',
    strategyH3: 'আপনার চিন্তাকে একটি রূপ দিন।',
    strategyBody: 'একটি প্রাথমিক পদক্ষেপ বেছে নিন।',
    strategyCompactEyebrow: 'আপনার শিক্ষণ কৌশল বেছে নিন',
    startVideo: 'ভিডিও শুরু করুন',
    cp25Badge: '২৫% পৌঁছেছে', cp25Step: 'পর্যবেক্ষণ · ফ্ল্যাশকার্ড',
    cp25H2: 'আপনার বোঝাপড়া পরীক্ষা করুন।',
    cp25Sub: 'পদ এবং তার সংজ্ঞার মধ্যে উল্টাতে কার্ডে ক্লিক করুন।',
    flashcardTermLabel: 'পদ', flashcardTapToFlip: 'উল্টাতে ট্যাপ করুন', flashcardDefLabel: 'সংজ্ঞা',
    resumeVideo: 'ভিডিও চালিয়ে যান',
    cp50Badge: '৫০% পৌঁছেছে', cp50Step: (i: number) => `পর্যবেক্ষণ পত্র · ভিডিও ${i}`,
    cp50H2a: 'মাঝামাঝি বিন্দু।', cp50H2b: 'আপনার বোঝাপড়া যাচাই করুন।',
    cp50Sub: 'চালিয়ে যাওয়ার আগে প্রতিটি পর্যবেক্ষণ প্রম্পটে সাড়া দিন।',
    yourResponse: 'আপনার উত্তর…',
    cp75Badge: '৭৫% পৌঁছেছে', cp75Step: 'পর্যবেক্ষণ · অস্পষ্ট বিন্দু',
    cp75H2a: 'এখনও কী', cp75H2b: 'অস্পষ্ট?',
    cp75Sub: 'এখন পর্যন্ত যা দেখেছেন তার মধ্যে সবচেয়ে অস্পষ্ট বিন্দুটি চিহ্নিত করুন।',
    muddyPointLabel: 'অস্পষ্ট বিন্দু',
    muddyPointPlaceholder: 'এই মুহূর্তে যে ধারণাটি সবচেয়ে কম স্পষ্ট তা বর্ণনা করুন…',
    quizBadge: 'ভিডিও সম্পন্ন', quizStep: 'মূল্যায়ন · কুইজ',
    quizH2a: 'প্রতিফলনের আগে', quizH2b: 'দ্রুত যাচাই করুন।',
    quizSub: 'আপনি যা শিখেছেন তার সাথে সবচেয়ে মিলে যাওয়া উত্তরটি বেছে নিন।',
    submitBtn: 'জমা দিন',
    evalBadge: (p: string) => `${p} · সম্পন্ন`,
    evalStep: (i: number) => `মূল্যায়ন পত্র · ভিডিও ${i}`,
    evalH2a: 'পেছনে ফিরে তাকান', evalH2b: 'পদক্ষেপের দিকে।',
    evalSub: 'মূল্যায়ন শুধু একটি স্কোর নয়। এটি প্রমাণ যে কোন কৌশলটি সাহায্য করেছে।',
    yourReflection: 'আপনার প্রতিফলন…',
    completeVideo: 'ভিডিও সম্পন্ন করুন',
    toastFlashcard: 'ফ্ল্যাশকার্ড সংরক্ষিত।',
    toastMonitoring: 'পর্যবেক্ষণ পত্র সংরক্ষিত।',
    toastMuddy: 'অস্পষ্ট বিন্দু সংরক্ষিত।',
    toastVideoDone: (cur: number, next: number) => `ভিডিও ${cur} সম্পন্ন — ভিডিও ${next} শুরু হচ্ছে।`,
    toastPhaseDone: (p: string) => `সমস্ত ${p} ভিডিও সম্পন্ন!`,
    chatTitle: 'লেভো', chatSubtitle: 'শিক্ষণ সঙ্গী',
    chatWelcome: 'আমি লেভো। পাঠ, কৌশল বা পরবর্তী কোথায় দেখবেন তা আমাকে জিজ্ঞাসা করুন।',
    chatReply: 'সেই প্রশ্নটি তিনটি পর্যায়ের সাথে সংযুক্ত করার চেষ্টা করুন।',
    chatPlaceholder: 'লেভোকে জিজ্ঞাসা করুন…',
    adminIndex: 'কমিটি দৃশ্য · ০৬',
    adminH1a: 'পাঠ্যক্রম', adminH1b: 'গতিশীল।',
    adminBody: 'পথের একটি দৃষ্টিভঙ্গি: কী পড়ানো হচ্ছে, শিক্ষার্থীরা কী করছে।',
    metricLearners: 'সক্রিয় শিক্ষার্থী', metricLearnersDetail: 'এই সপ্তাহে +৬',
    metricCompletion: 'সম্পন্নের হার', metricCompletionDetail: 'গ্রুপ সি এগিয়ে',
    metricTransition: 'পর্যায় ২-এ আছে', metricTransitionDetail: 'একটি চেক-ইন প্রয়োজন',
    metricReflections: 'প্রতিফলন', metricReflectionsDetail: 'স্থানীয়ভাবে সংগৃহীত',
    curriculumTitle: 'পাঠ্যক্রম সারসংক্ষেপ', curriculumSub: '৩ পর্যায় · ৪২ ভিডিও',
    pulseTitle: 'শিক্ষার্থীর পালস', pulseToday: 'আজ',
    signalLabel: 'কমিটি সংকেত',
    signalBody: 'বেশ কয়েকজন শিক্ষার্থী উপলব্ধি ও ধারণার মধ্যে পার্থক্যে থামলেন।',
    strategies: ['ধারণা মানচিত্র', 'ফাইনম্যান কৌশল', 'স্থানের পদ্ধতি', 'পুনরুদ্ধার অনুশীলন'],
    bcStudent: 'শিক্ষার্থী', bcSubject: 'বিষয় সারসংক্ষেপ', bcGroupC: 'গ্রুপ সি', bcUnit: 'ইউনিট ১',
    langToggle: 'English',
    notesTitle: 'আমার নোট',
    notesSubtitle: 'প্রতিটি পর্যায়ের জন্য নোট লিখুন এবং সংরক্ষণ করুন। সবকিছু স্বয়ংক্রিয়ভাবে সংরক্ষিত হয়।',
    notesGeneral: 'সাধারণ',
    notesClear: 'মুছুন',
    notesCopied: 'ক্লিপবোর্ডে কপি করা হয়েছে!',
    notesCopy: 'নোট কপি করুন',
    notesPlaceholder: 'এখানে আপনার নোট লিখতে শুরু করুন…',
    notesWords: (n: number) => `${n}টি শব্দ`,
    notesAutoSave: 'স্বয়ংক্রিয়ভাবে সংরক্ষিত',
    gamesTitle: 'গেম ও কার্যক্রম',
    gamesSubtitle: 'ইন্টারেক্টিভ অনুশীলনের মাধ্যমে আপনার চিন্তাকে তীক্ষ্ণ করুন।',
    gameMemoryTitle: 'মেমরি ম্যাচ',
    gameMemoryDesc: 'কার্ড উল্টান এবং পদের সাথে সংজ্ঞা মেলান।',
    gameSpinnerTitle: 'প্রতিফলন স্পিনার',
    gameSpinnerDesc: 'একটি এলোমেলো প্রতিফলন প্রম্পটের জন্য ঘুরান।',
    gameQuizTitle: 'কৌশল কুইজ',
    gameQuizDesc: 'প্রতিটি পরিস্থিতির জন্য সঠিক শিক্ষণ কৌশল বেছে নিন।',
    gamePlay: 'খেলুন',
    gameRestart: 'পুনরায় শুরু',
    gameBack: '← গেমসে ফিরুন',
    matchScore: (m: number, t: number) => `${m} / ${t} মিলেছে`,
    matchTime: (s: number) => `${s}সে.`,
    matchComplete: 'সব মিলেছে! 🎉',
    matchBestTime: (s: number) => `সেরা: ${s}সে.`,
    spinBtn: 'ঘুরান',
    spinPrompt: 'আপনার প্রম্পট:',
    quizScenario: 'পরিস্থিতি',
    quizOf: (i: number, t: number) => `প্রশ্ন ${i} / ${t}`,
    quizCorrect: 'সঠিক! ✓',
    quizWrong: 'ঠিক নয়। ভালো উত্তর হলো:',
    quizNext: 'পরবর্তী',
    quizDone: (s: number, t: number) => `আপনি ${s} / ${t} পেয়েছেন`,
    quizRetry: 'আবার চেষ্টা করুন',
  },
} as const;
type Strings = typeof S.en;

// ── Quotes ────────────────────────────────────────────────────────────────
const QUOTES_EN = [
  ['Learning is not a product of teaching. Learning is a product of the activity of learners.', 'John Holt'],
  ['The mind is not a vessel to be filled but a fire to be kindled.', 'Plutarch'],
  ['We do not learn from experience. We learn from reflecting on experience.', 'John Dewey'],
  ['The important thing is not to stop questioning.', 'Albert Einstein'],
];
const QUOTES_BN = [
  ['শিক্ষা শিক্ষকতার ফল নয়। শিক্ষা শিক্ষার্থীদের কার্যকলাপের ফল।', 'জন হোল্ট'],
  ['মন একটি পাত্র নয় যা পূর্ণ করতে হবে, বরং একটি আগুন যা জ্বালাতে হবে।', 'প্লুটার্ক'],
  ['আমরা অভিজ্ঞতা থেকে শিখি না। আমরা অভিজ্ঞতার উপর প্রতিফলন করে শিখি।', 'জন ডিউই'],
  ['গুরুত্বপূর্ণ বিষয় হলো প্রশ্ন করা বন্ধ না করা।', 'আলবার্ট আইনস্টাইন'],
];

// ── 42 Video slots ─────────────────────────────────────────────────────────
interface VideoSlot { id: number; phase: Phase; index: number; title: string; src: string | null; }
function makeSlots(phase: Phase, startId: number): VideoSlot[] {
  return Array.from({ length: 14 }, (_, i) => ({
    id: startId + i, phase, index: i + 1,
    title: `Video ${String(i + 1).padStart(2, '0')}`, src: null,
  }));
}
const PHASE_VIDEOS: Record<Phase, VideoSlot[]> = {
  immersion:  makeSlots('immersion',  1),
  transition: makeSlots('transition', 15),
  genesis:    makeSlots('genesis',    29),
};

// ── Questionnaires ─────────────────────────────────────────────────────────
const PLANNING_QS = [
  { id: 'p1', label: { en: '01 · Prior knowledge',   bn: '০১ · পূর্ব জ্ঞান'    }, prompt: '[Planning question 1 — to be provided]' },
  { id: 'p2', label: { en: '02 · Learning goal',      bn: '০২ · শিক্ষণ লক্ষ্য'  }, prompt: '[Planning question 2 — to be provided]' },
  { id: 'p3', label: { en: '03 · Strategy rationale', bn: '০৩ · কৌশলের যুক্তি'  }, prompt: '[Planning question 3 — to be provided]' },
];
const MONITORING_QS = [
  { id: 'm1', label: { en: '01 · Comprehension',      bn: '০১ · বোধগম্যতা'     }, prompt: '[Monitoring question 1 — to be provided]' },
  { id: 'm2', label: { en: '02 · Concept connection', bn: '০২ · ধারণা সংযোগ'   }, prompt: '[Monitoring question 2 — to be provided]' },
  { id: 'm3', label: { en: '03 · Strategy check',     bn: '০৩ · কৌশল যাচাই'    }, prompt: '[Monitoring question 3 — to be provided]' },
];
const EVAL_QS = [
  { id: 'e1', label: { en: '01 · Key learning',        bn: '০১ · মূল শিক্ষণ'    }, prompt: '[Evaluation question 1 — to be provided]' },
  { id: 'e2', label: { en: '02 · Strategy assessment', bn: '০২ · কৌশল মূল্যায়ন'}, prompt: '[Evaluation question 2 — to be provided]' },
  { id: 'e3', label: { en: '03 · Next steps',           bn: '০৩ · পরবর্তী পদক্ষেপ'}, prompt: '[Evaluation question 3 — to be provided]' },
];
const FLASHCARD: Record<Phase, { front: string; back: string }> = {
  immersion:  { front: '[Concept term — to be provided]', back: '[Definition / explanation — to be provided]' },
  transition: { front: '[Concept term — to be provided]', back: '[Definition / explanation — to be provided]' },
  genesis:    { front: '[Concept term — to be provided]', back: '[Definition / explanation — to be provided]' },
};
const QUIZ: Record<Phase, { question: string; options: string[] }> = {
  immersion:  { question: '[Quiz question — to be provided]', options: ['[Option A]', '[Option B]', '[Option C]', '[Option D]'] },
  transition: { question: '[Quiz question — to be provided]', options: ['[Option A]', '[Option B]', '[Option C]', '[Option D]'] },
  genesis:    { question: '[Quiz question — to be provided]', options: ['[Option A]', '[Option B]', '[Option C]', '[Option D]'] },
};

// ── Game data ──────────────────────────────────────────────────────────────
const MEMORY_PAIRS = [
  { term: 'Metacognition',   def: 'Thinking about your own thinking process' },
  { term: 'Planning',        def: 'Setting goals before you start learning' },
  { term: 'Monitoring',      def: 'Checking understanding while learning' },
  { term: 'Evaluation',      def: 'Reflecting on what you learned' },
  { term: 'Flashcard',       def: 'A two-sided memory learning card' },
  { term: 'Strategy',        def: 'A deliberate approach to a learning task' },
  { term: 'Muddy Point',     def: 'The concept that remains least clear' },
  { term: 'Feynman Technique', def: 'Explain a concept in simple words to test understanding' },
];
const SPINNER_PROMPTS = [
  'What is one thing you learned today that surprised you?',
  'How did your chosen learning strategy help you?',
  'What would you do differently next time?',
  'Explain one key concept from today in your own words.',
  'What is still unclear that you want to revisit?',
  'Connect today\'s learning to something you already knew.',
  'Rate your understanding 1–10. What would raise it?',
  'What question would you ask about this topic if you could?',
];
const STRATEGY_QUIZ = [
  {
    scenario: 'You need to remember a sequence of 7 steps for a chemistry process.',
    options: ['Feynman technique', 'Method of loci', 'Retrieval practice', 'Concept mapping'],
    correct: 1,
    explanation: 'Method of loci (memory palace) is ideal for ordered sequences.',
  },
  {
    scenario: 'You understand a topic but want to find gaps in your knowledge.',
    options: ['Method of loci', 'Concept mapping', 'Feynman technique', 'Retrieval practice'],
    correct: 2,
    explanation: 'Feynman technique: explain it simply — gaps appear where you struggle.',
  },
  {
    scenario: 'You want to see how several ideas in a chapter relate to each other.',
    options: ['Retrieval practice', 'Method of loci', 'Feynman technique', 'Concept mapping'],
    correct: 3,
    explanation: 'Concept mapping visually shows relationships between ideas.',
  },
  {
    scenario: 'You have studied a chapter and want to strengthen long-term memory.',
    options: ['Concept mapping', 'Retrieval practice', 'Feynman technique', 'Method of loci'],
    correct: 1,
    explanation: 'Retrieval practice (self-testing) is the most effective for long-term retention.',
  },
];

// ── Utility components ─────────────────────────────────────────────────────
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="toast" role="status">
      <Check size={16} /><span>{message}</span>
      <button onClick={onClose} aria-label="Dismiss"><X size={15} /></button>
    </div>
  );
}

function LangToggle({ className = '' }: { className?: string }) {
  const { lang, toggleLang } = useLang();
  return (
    <button className={`lang-toggle ${className}`} onClick={toggleLang} data-testid="button-lang-toggle">
      {S[lang].langToggle}
    </button>
  );
}

function StrategyPanel({ strategy, onStrategy, compact = false }: { strategy: string; onStrategy: (v: string) => void; compact?: boolean }) {
  const { lang } = useLang();
  const t: Strings = S[lang];
  return (
    <aside className={compact ? 'strategy-panel strategy-panel-compact' : 'strategy-panel'}>
      {!compact && (<><span className="eyebrow">{t.strategyEyebrow}</span><h3>{t.strategyH3}</h3><p>{t.strategyBody}</p></>)}
      {compact && <span className="eyebrow" style={{ marginBottom: 10, display: 'block' }}>{t.strategyCompactEyebrow}</span>}
      <div className="strategy-list">
        {t.strategies.map((item: string) => (
          <button className={`strategy-option${strategy === item ? ' selected' : ''}`} key={item} onClick={() => onStrategy(item)}>
            {item}{strategy === item && <Check size={14} />}
          </button>
        ))}
      </div>
    </aside>
  );
}

// ── Checkpoint overlay ─────────────────────────────────────────────────────
function CheckpointOverlay({
  stage, phase, videoIndex, strategy, onStrategy, onComplete,
}: {
  stage: Exclude<CheckpointStage, 'playing' | 'done'>;
  phase: Phase; videoIndex: number; strategy: string;
  onStrategy: (v: string) => void; onComplete: () => void;
}) {
  const { lang } = useLang();
  const { role } = useRole();
  const t: Strings = S[lang];
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flipped, setFlipped] = useState(false);
  const [muddyPoint, setMuddyPoint] = useState('');
  const [selected, setSelected] = useState<number | null>(null);
  const set = (k: string, v: string) => setAnswers(a => ({ ...a, [k]: v }));
  const pLabel = phaseLabel(phase, role, lang);

  if (stage === 'pre') return (
    <div className="overlay-backdrop">
      <div className="overlay-panel overlay-wide">
        <div className="overlay-top-bar">
          <span className="overlay-phase-badge">{t.prePhase(pLabel)}</span>
          <span className="overlay-step">{t.preStep(videoIndex)}</span>
        </div>
        <h2 className="overlay-heading">{t.preH2a}<br />{t.preH2b}</h2>
        <p className="overlay-sub">{t.preSub}</p>
        <div className="overlay-sheet">
          {PLANNING_QS.map(q => (
            <div className="overlay-field" key={q.id}>
              <label>{q.label[lang]}</label>
              <p className="overlay-prompt">{q.prompt}</p>
              <textarea value={answers[q.id] || ''} onChange={e => set(q.id, e.target.value)} placeholder={t.yourResponse} rows={2} />
            </div>
          ))}
        </div>
        <StrategyPanel strategy={strategy} onStrategy={onStrategy} compact />
        <div className="overlay-foot">
          <button className="solid-button" onClick={onComplete} data-testid="button-start-video">
            {t.startVideo} <Play size={15} />
          </button>
        </div>
      </div>
    </div>
  );

  if (stage === 'cp25') return (
    <div className="overlay-backdrop">
      <div className="overlay-panel">
        <div className="overlay-top-bar">
          <span className="overlay-phase-badge">{t.cp25Badge}</span>
          <span className="overlay-step">{t.cp25Step}</span>
        </div>
        <h2 className="overlay-heading">{t.cp25H2}</h2>
        <p className="overlay-sub">{t.cp25Sub}</p>
        <div className={`flashcard${flipped ? ' flipped' : ''}`} onClick={() => setFlipped(f => !f)} role="button">
          <div className="flashcard-inner">
            <div className="flashcard-front">
              <span className="micro">{t.flashcardTermLabel}</span>
              <p>{FLASHCARD[phase].front}</p>
              <span className="micro" style={{ marginTop: 'auto' }}>{t.flashcardTapToFlip}</span>
            </div>
            <div className="flashcard-back">
              <span className="micro">{t.flashcardDefLabel}</span>
              <p>{FLASHCARD[phase].back}</p>
            </div>
          </div>
        </div>
        <div className="overlay-foot">
          <button className="solid-button" onClick={onComplete} data-testid="button-continue-25">
            {t.resumeVideo} <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );

  if (stage === 'cp50') return (
    <div className="overlay-backdrop">
      <div className="overlay-panel overlay-wide">
        <div className="overlay-top-bar">
          <span className="overlay-phase-badge">{t.cp50Badge}</span>
          <span className="overlay-step">{t.cp50Step(videoIndex)}</span>
        </div>
        <h2 className="overlay-heading">{t.cp50H2a}<br />{t.cp50H2b}</h2>
        <p className="overlay-sub">{t.cp50Sub}</p>
        <div className="overlay-sheet">
          {MONITORING_QS.map(q => (
            <div className="overlay-field" key={q.id}>
              <label>{q.label[lang]}</label>
              <p className="overlay-prompt">{q.prompt}</p>
              <textarea value={answers[q.id] || ''} onChange={e => set(q.id, e.target.value)} placeholder={t.yourResponse} rows={2} />
            </div>
          ))}
        </div>
        <div className="overlay-foot">
          <button className="solid-button" onClick={onComplete} data-testid="button-continue-50">
            {t.resumeVideo} <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );

  if (stage === 'cp75') return (
    <div className="overlay-backdrop">
      <div className="overlay-panel">
        <div className="overlay-top-bar">
          <span className="overlay-phase-badge">{t.cp75Badge}</span>
          <span className="overlay-step">{t.cp75Step}</span>
        </div>
        <h2 className="overlay-heading">{t.cp75H2a}<br />{t.cp75H2b}</h2>
        <p className="overlay-sub">{t.cp75Sub}</p>
        <div className="overlay-sheet">
          <div className="overlay-field">
            <label>{t.muddyPointLabel}</label>
            <textarea value={muddyPoint} onChange={e => setMuddyPoint(e.target.value)} placeholder={t.muddyPointPlaceholder} rows={4} />
          </div>
        </div>
        <div className="overlay-foot">
          <button className="solid-button" onClick={onComplete} data-testid="button-continue-75">
            {t.resumeVideo} <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );

  if (stage === 'cp100_quiz') {
    const quiz = QUIZ[phase];
    return (
      <div className="overlay-backdrop">
        <div className="overlay-panel">
          <div className="overlay-top-bar">
            <span className="overlay-phase-badge">{t.quizBadge}</span>
            <span className="overlay-step">{t.quizStep}</span>
          </div>
          <h2 className="overlay-heading">{t.quizH2a}<br />{t.quizH2b}</h2>
          <p className="overlay-sub">{t.quizSub}</p>
          <div className="quiz-block">
            <p className="quiz-question">{quiz.question}</p>
            <div className="quiz-options">
              {quiz.options.map((opt, i) => (
                <button key={i} className={`quiz-option${selected === i ? ' selected' : ''}`} onClick={() => setSelected(i)}>{opt}</button>
              ))}
            </div>
          </div>
          <div className="overlay-foot">
            <button className="solid-button" disabled={selected === null} onClick={onComplete} data-testid="button-submit-quiz">
              {t.submitBtn} <Check size={15} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'cp100_eval') return (
    <div className="overlay-backdrop">
      <div className="overlay-panel overlay-wide">
        <div className="overlay-top-bar">
          <span className="overlay-phase-badge" style={{ background: 'var(--teal)' }}>{t.evalBadge(pLabel)}</span>
          <span className="overlay-step">{t.evalStep(videoIndex)}</span>
        </div>
        <h2 className="overlay-heading">{t.evalH2a}<br />{t.evalH2b}</h2>
        <p className="overlay-sub">{t.evalSub}</p>
        <div className="overlay-sheet">
          {EVAL_QS.map(q => (
            <div className="overlay-field" key={q.id}>
              <label>{q.label[lang]}</label>
              <p className="overlay-prompt">{q.prompt}</p>
              <textarea value={answers[q.id] || ''} onChange={e => set(q.id, e.target.value)} placeholder={t.yourReflection} rows={2} />
            </div>
          ))}
        </div>
        <div className="overlay-foot">
          <button className="solid-button" onClick={onComplete} data-testid="button-complete-video">
            {t.completeVideo} <Check size={15} />
          </button>
        </div>
      </div>
    </div>
  );

  return null;
}

// ── Video player ───────────────────────────────────────────────────────────
function VideoPlayer({ slot, stage, onCheckpoint }: { slot: VideoSlot; stage: CheckpointStage; onCheckpoint: (pct: 25 | 50 | 75 | 100) => void }) {
  const { lang } = useLang();
  const t: Strings = S[lang];
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const fired = useRef<Set<number>>(new Set());
  const CHECKPOINTS = [25, 50, 75, 100] as const;

  useEffect(() => {
    if (stage !== 'playing') { videoRef.current?.pause(); setPlaying(false); }
  }, [stage]);

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || !isFinite(v.duration) || v.duration === 0) return;
    const pct = (v.currentTime / v.duration) * 100;
    setProgress(pct);
    for (const cp of [25, 50, 75] as const) {
      if (pct >= cp && !fired.current.has(cp)) {
        fired.current.add(cp); v.pause(); setPlaying(false); onCheckpoint(cp); break;
      }
    }
  };

  const handleEnded = () => {
    if (!fired.current.has(100)) { fired.current.add(100); setPlaying(false); setProgress(100); onCheckpoint(100); }
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) { v.pause(); setPlaying(false); } else { v.play().catch(() => {}); setPlaying(true); }
  };

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
            clearInterval(simRef.current!); simRef.current = null;
            setPlaying(false); onCheckpoint(cp); return next;
          }
        }
        if (next >= 100) {
          clearInterval(simRef.current!); simRef.current = null;
          setPlaying(false);
          if (!fired.current.has(100)) { fired.current.add(100); onCheckpoint(100); }
          return 100;
        }
        return next;
      });
    }, 80);
  };

  const pauseSim = () => { if (simRef.current) { clearInterval(simRef.current); simRef.current = null; } setPlaying(false); };
  const toggleSim = () => playing ? pauseSim() : startSim();
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
            <p className="video-placeholder-note">{t.uploadNote}</p>
          </div>
        )
      }
      <div className="video-controls">
        {slot.src
          ? <button className="video-ctrl-btn" onClick={togglePlay}>{playing ? <Pause size={16} /> : <Play size={16} />}</button>
          : <button className="video-ctrl-btn" onClick={toggleSim}>{playing ? <Pause size={16} /> : <Play size={16} />}</button>
        }
        <div className="progress-track" role="progressbar" aria-valuenow={Math.round(displayProgress)} aria-valuemin={0} aria-valuemax={100}>
          <div className="progress-fill" style={{ width: `${displayProgress}%` }} />
          {CHECKPOINTS.map(cp => (
            <div key={cp} className={`progress-cp${fired.current.has(cp) ? ' done' : ''}`} style={{ left: `${cp}%` }} title={`${cp}% checkpoint`} />
          ))}
        </div>
        <span className="micro video-pct">{Math.round(displayProgress)}%</span>
      </div>
    </div>
  );
}

// ── Phase video workspace ──────────────────────────────────────────────────
function PhaseVideoWorkspace({ phase, onToast }: { phase: Phase; onToast: (m: string) => void }) {
  const { lang } = useLang();
  const { role } = useRole();
  const t: Strings = S[lang];
  const slots = PHASE_VIDEOS[phase];
  const [videoIdx, setVideoIdx] = useState<number | null>(null);
  const [stage, setStage] = useState<CheckpointStage>('pre');
  const [strategy, setStrategy] = useState(t.strategies[0]);
  const [done, setDone] = useState<Set<number>>(new Set());
  const pLabel = phaseLabel(phase, role, lang);
  const currentSlot = videoIdx !== null ? slots[videoIdx] : null;

  const openVideo = (idx: number) => { setVideoIdx(idx); setStage('pre'); setStrategy(t.strategies[0]); };

  const handleCheckpoint = (pct: 25 | 50 | 75 | 100) => {
    if (pct === 25) setStage('cp25');
    else if (pct === 50) setStage('cp50');
    else if (pct === 75) setStage('cp75');
    else setStage('cp100_quiz');
  };

  const handleOverlayComplete = () => {
    if (stage === 'pre') {
      setStage('playing');
    } else if (stage === 'cp25' || stage === 'cp50' || stage === 'cp75') {
      setStage('playing');
      onToast(stage === 'cp25' ? t.toastFlashcard : stage === 'cp50' ? t.toastMonitoring : t.toastMuddy);
    } else if (stage === 'cp100_quiz') {
      setStage('cp100_eval');
    } else if (stage === 'cp100_eval' && videoIdx !== null) {
      setDone(d => new Set([...d, slots[videoIdx].id]));
      const next = videoIdx + 1;
      if (next < slots.length) {
        onToast(t.toastVideoDone(videoIdx + 1, next + 1));
        setVideoIdx(next); setStage('pre');
      } else {
        onToast(t.toastPhaseDone(pLabel));
        setVideoIdx(null); setStage('pre');
      }
    }
  };

  // Playlist view
  if (currentSlot === null) return (
    <div className="playlist">
      <div className="playlist-header">
        <div>
          <span className="eyebrow">{pLabel}</span>
          <h2>{lang === 'en' ? `14 videos · ${done.size} complete` : `১৪টি ভিডিও · ${done.size}টি সম্পন্ন`}</h2>
        </div>
        <div className="playlist-progress-bar"><div className="playlist-fill" style={{ width: `${(done.size / 14) * 100}%` }} /></div>
      </div>
      <div className="playlist-grid">
        {slots.map((slot, i) => {
          const isDone = done.has(slot.id);
          const isNext = !isDone && (i === 0 || done.has(slots[i - 1].id));
          return (
            <button key={slot.id} className={`video-card${isDone ? ' done' : ''}${isNext ? ' next' : ''}`} onClick={() => openVideo(i)}>
              <span className="video-card-num">{String(slot.index).padStart(2, '0')}</span>
              <span className="video-card-title">{slot.title}</span>
              <span className="video-card-status">{isDone ? <Check size={14} /> : isNext ? <Play size={12} /> : null}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  // Player view
  const stageOrder: CheckpointStage[] = ['pre', 'playing', 'cp25', 'cp50', 'cp75', 'cp100_quiz', 'cp100_eval', 'done'];
  const statusLabel = stage === 'playing' ? t.statusPlaying : stage === 'pre' ? t.statusReady
    : `${t.statusPaused} ${stage === 'cp25' ? '25%' : stage === 'cp50' ? '50%' : stage === 'cp75' ? '75%' : '100%'}`;

  const cpSteps: [string, string, CheckpointStage][] = [
    ['0:00', t.cpPlanning, 'pre'], ['25%', t.cpFlashcard, 'cp25'],
    ['50%', t.cpMonitoring, 'cp50'], ['75%', t.cpMuddyPoint, 'cp75'], ['100%', t.cpQuizEval, 'cp100_quiz'],
  ];

  return (
    <div className="video-workspace">
      <div className="video-workspace-header">
        <button className="back-button" onClick={() => setVideoIdx(null)}><ArrowLeft size={14} /> {t.backToPlaylist}</button>
        <span className="video-workspace-label">{pLabel} · {currentSlot.title}</span>
        <span className="video-checkpoint-status">{statusLabel}</span>
      </div>
      <VideoPlayer slot={currentSlot} stage={stage} onCheckpoint={handleCheckpoint} />
      {stage !== 'playing' && stage !== 'done' && (
        <CheckpointOverlay stage={stage} phase={phase} videoIndex={currentSlot.index}
          strategy={strategy} onStrategy={setStrategy} onComplete={handleOverlayComplete} />
      )}
      <div className="cp-tracker">
        {cpSteps.map(([time, label, s]) => {
          const isActive = stage === s;
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

// ── Lesson workspace ───────────────────────────────────────────────────────
function LessonWorkspace({ onBack, onToast }: { onBack: () => void; onToast: (m: string) => void }) {
  const { lang } = useLang();
  const { role } = useRole();
  const t: Strings = S[lang];
  const [phase, setPhase] = useState<Phase>('immersion');
  const phases: Phase[] = ['immersion', 'transition', 'genesis'];
  const phaseSubs = [t.phaseSub1, t.phaseSub2, t.phaseSub3];

  return (
    <>
      <div className="lesson-header">
        <div>
          <button className="back-button" onClick={onBack}><ArrowLeft size={14} /> {t.bcUnit}</button>
          <span className="eyebrow" style={{ marginTop: 22 }}>{t.lessonEyebrow}</span>
          <h1>{t.lessonH1.split('\n').map((l, i) => <span key={i}>{l}{i === 0 && <br />}</span>)}</h1>
          <p>{t.lessonBody}</p>
        </div>
      </div>
      <div className="phase-nav">
        {phases.map((key, i) => (
          <button className={`phase-tab${phase === key ? ' active' : ''}`} key={key} onClick={() => setPhase(key)} data-testid={`button-phase-${key}`}>
            <span className="phase-code">0{i + 1}</span>
            <strong>{phaseLabel(key, role, lang)}</strong>
            <span className="phase-tab-sub">{phaseSubs[i]}</span>
            <span className="phase-tab-count">{lang === 'en' ? '14 videos' : '১৪টি ভিডিও'}</span>
          </button>
        ))}
      </div>
      <div className="phase-content">
        <PhaseVideoWorkspace key={phase} phase={phase} onToast={onToast} />
      </div>
    </>
  );
}

// ── Notes section ──────────────────────────────────────────────────────────
const NOTE_TABS_EN = ['General', 'Phase 1', 'Phase 2', 'Phase 3'];
const NOTE_TABS_BN = ['সাধারণ', 'পর্যায় ১', 'পর্যায় ২', 'পর্যায় ৩'];
const LS_KEY = (tab: string) => `metalearn_note_${tab}`;

function NotesSection() {
  const { lang } = useLang();
  const t: Strings = S[lang];
  const tabs = lang === 'en' ? NOTE_TABS_EN : NOTE_TABS_BN;
  const [activeTab, setActiveTab] = useState(0);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [savedIndicator, setSavedIndicator] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const loaded: Record<number, string> = {};
    tabs.forEach((_, i) => {
      loaded[i] = localStorage.getItem(LS_KEY(String(i))) || '';
    });
    setNotes(loaded);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (val: string) => {
    const updated = { ...notes, [activeTab]: val };
    setNotes(updated);
    localStorage.setItem(LS_KEY(String(activeTab)), val);
    setSavedIndicator(true);
    setTimeout(() => setSavedIndicator(false), 1500);
  };

  const wordCount = (notes[activeTab] || '').trim().split(/\s+/).filter(Boolean).length;

  const copyNotes = () => {
    navigator.clipboard.writeText(notes[activeTab] || '').then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    });
  };

  const clearNotes = () => {
    const updated = { ...notes, [activeTab]: '' };
    setNotes(updated);
    localStorage.setItem(LS_KEY(String(activeTab)), '');
  };

  return (
    <div className="notes-section">
      <div className="notes-header">
        <div>
          <span className="eyebrow">{lang === 'en' ? '05 · notes' : '০৫ · নোট'}</span>
          <h1 className="notes-title">{t.notesTitle}</h1>
          <p className="notes-subtitle">{t.notesSubtitle}</p>
        </div>
      </div>
      <div className="notes-tabs">
        {tabs.map((tab, i) => (
          <button key={i} className={`notes-tab${activeTab === i ? ' active' : ''}`} onClick={() => setActiveTab(i)}>
            {tab}
            {(notes[i] || '').trim().length > 0 && <span className="notes-tab-dot" />}
          </button>
        ))}
      </div>
      <div className="notes-editor-wrap">
        <div className="notes-toolbar">
          <span className="micro notes-word-count">{t.notesWords(wordCount)}</span>
          {savedIndicator && <span className="notes-saved micro">{t.notesAutoSave} ✓</span>}
          <button className="notes-action-btn" onClick={copyNotes}>{copied ? t.notesCopied : t.notesCopy}</button>
          <button className="notes-action-btn notes-clear-btn" onClick={clearNotes}>{t.notesClear}</button>
        </div>
        <textarea
          className="notes-textarea"
          value={notes[activeTab] || ''}
          onChange={e => handleChange(e.target.value)}
          placeholder={t.notesPlaceholder}
        />
      </div>
    </div>
  );
}

// ── Memory Match Game ──────────────────────────────────────────────────────
interface MemCard { id: number; pairId: number; content: string; type: 'term' | 'def'; flipped: boolean; matched: boolean; }

function MemoryMatchGame({ onBack }: { onBack: () => void }) {
  const { lang } = useLang();
  const t: Strings = S[lang];

  const buildCards = useCallback((): MemCard[] => {
    const cards: MemCard[] = [];
    MEMORY_PAIRS.forEach((pair, pairId) => {
      cards.push({ id: pairId * 2,     pairId, content: pair.term, type: 'term', flipped: false, matched: false });
      cards.push({ id: pairId * 2 + 1, pairId, content: pair.def,  type: 'def',  flipped: false, matched: false });
    });
    return cards.sort(() => Math.random() - 0.5);
  }, []);

  const [cards, setCards] = useState<MemCard[]>(buildCards);
  const [selected, setSelected] = useState<number[]>([]);
  const [locked, setLocked] = useState(false);
  const [matched, setMatched] = useState(0);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [bestTime, setBestTime] = useState<number | null>(null);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setTime(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const restart = () => {
    setCards(buildCards()); setSelected([]); setLocked(false);
    setMatched(0); setTime(0); setRunning(false);
  };

  const flip = (cardIdx: number) => {
    if (locked || cards[cardIdx].flipped || cards[cardIdx].matched) return;
    if (!running) setRunning(true);

    const newSel = [...selected, cardIdx];
    setCards(prev => prev.map((c, i) => i === cardIdx ? { ...c, flipped: true } : c));

    if (newSel.length === 2) {
      setLocked(true);
      const [a, b] = newSel;
      const cardA = cards[a]; const cardB = cards[b];
      if (cardA.pairId === cardB.pairId && cardA.type !== cardB.type) {
        // Match!
        setTimeout(() => {
          setCards(prev => prev.map((c, i) => (i === a || i === b) ? { ...c, matched: true } : c));
          const newMatched = matched + 1;
          setMatched(newMatched);
          if (newMatched === MEMORY_PAIRS.length) {
            setRunning(false);
            setBestTime(prev => prev === null || time < prev ? time : prev);
          }
          setSelected([]); setLocked(false);
        }, 600);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map((c, i) => (i === a || i === b) ? { ...c, flipped: false } : c));
          setSelected([]); setLocked(false);
        }, 900);
      }
    } else {
      setSelected(newSel);
    }
  };

  const allMatched = matched === MEMORY_PAIRS.length;

  return (
    <div className="game-view">
      <button className="back-button" style={{ marginBottom: 20 }} onClick={onBack}>{t.gameBack}</button>
      <div className="game-header">
        <div>
          <span className="eyebrow">{t.gameMemoryTitle}</span>
          <h2 className="game-title">{t.matchScore(matched, MEMORY_PAIRS.length)}</h2>
        </div>
        <div className="game-stats">
          <span className="game-stat">{t.matchTime(time)}</span>
          {bestTime !== null && <span className="game-stat micro">{t.matchBestTime(bestTime)}</span>}
          <button className="outline-button-dark" onClick={restart}><RefreshCw size={13} /> {t.gameRestart}</button>
        </div>
      </div>
      {allMatched && <div className="game-complete-banner">{t.matchComplete}</div>}
      <div className="memory-grid">
        {cards.map((card, i) => (
          <button
            key={card.id}
            className={`mem-card${card.flipped || card.matched ? ' flipped' : ''}${card.matched ? ' matched' : ''}`}
            onClick={() => flip(i)}
          >
            <div className="mem-card-inner">
              <div className="mem-card-front"><Star size={20} /></div>
              <div className={`mem-card-back ${card.type}`}><p>{card.content}</p></div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Reflection Spinner Game ────────────────────────────────────────────────
function SpinnerGame({ onBack }: { onBack: () => void }) {
  const { lang } = useLang();
  const t: Strings = S[lang];
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [prompt, setPrompt] = useState<string | null>(null);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setPrompt(null);
    const extra = 1440 + Math.random() * 360;
    const finalRot = rotation + extra;
    setRotation(finalRot);
    setTimeout(() => {
      setSpinning(false);
      const idx = Math.floor(Math.random() * SPINNER_PROMPTS.length);
      setPrompt(SPINNER_PROMPTS[idx]);
    }, 2200);
  };

  const segmentCount = 8;
  const segAngle = 360 / segmentCount;
  const colors = ['#4b9f99', '#df735e', '#e7b86b', '#214d57', '#4b9f99', '#df735e', '#e7b86b', '#214d57'];

  return (
    <div className="game-view">
      <button className="back-button" style={{ marginBottom: 20 }} onClick={onBack}>{t.gameBack}</button>
      <div className="game-header">
        <div>
          <span className="eyebrow">{t.gameSpinnerTitle}</span>
          <h2 className="game-title" style={{ fontFamily: 'var(--serif)', fontWeight: 400 }}>{t.gameSpinnerDesc}</h2>
        </div>
      </div>
      <div className="spinner-stage">
        <div className="spinner-wrap">
          <div className="spinner-wheel"
            style={{ transform: `rotate(${rotation}deg)`, transition: spinning ? 'transform 2.2s cubic-bezier(.17,.67,.12,.99)' : 'none' }}
          >
            {Array.from({ length: segmentCount }, (_, i) => (
              <div key={i} className="spinner-segment" style={{
                transform: `rotate(${i * segAngle}deg)`,
                borderTopColor: colors[i],
              }} />
            ))}
            <div className="spinner-center"><Sparkles size={22} /></div>
          </div>
          <div className="spinner-pointer" />
        </div>
        <button className="solid-button spinner-btn" onClick={spin} disabled={spinning}>{t.spinBtn}</button>
        {prompt && (
          <div className="spinner-result">
            <span className="micro">{t.spinPrompt}</span>
            <p className="spinner-prompt-text">{prompt}</p>
            <textarea className="spinner-response" placeholder={lang === 'en' ? 'Write your reflection here…' : 'এখানে আপনার প্রতিফলন লিখুন…'} rows={3} />
          </div>
        )}
      </div>
    </div>
  );
}

// ── Strategy Quiz Game ─────────────────────────────────────────────────────
function StrategyQuizGame({ onBack }: { onBack: () => void }) {
  const { lang } = useLang();
  const t: Strings = S[lang];
  const [qi, setQi] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = STRATEGY_QUIZ[qi];

  const choose = (i: number) => { if (selected !== null) return; setSelected(i); if (i === q.correct) setScore(s => s + 1); };

  const next = () => {
    if (qi + 1 >= STRATEGY_QUIZ.length) { setDone(true); }
    else { setQi(qi + 1); setSelected(null); }
  };

  const restart = () => { setQi(0); setSelected(null); setScore(0); setDone(false); };

  if (done) return (
    <div className="game-view">
      <button className="back-button" style={{ marginBottom: 20 }} onClick={onBack}>{t.gameBack}</button>
      <div className="quiz-done">
        <div className="quiz-done-score">{score}<span>/{STRATEGY_QUIZ.length}</span></div>
        <p className="quiz-done-label">{t.quizDone(score, STRATEGY_QUIZ.length)}</p>
        <button className="solid-button" onClick={restart}>{t.quizRetry}</button>
      </div>
    </div>
  );

  return (
    <div className="game-view">
      <button className="back-button" style={{ marginBottom: 20 }} onClick={onBack}>{t.gameBack}</button>
      <div className="game-header">
        <div>
          <span className="eyebrow">{t.gameQuizTitle}</span>
          <h2 className="game-title">{t.quizOf(qi + 1, STRATEGY_QUIZ.length)}</h2>
        </div>
        <span className="game-stat">{score}/{STRATEGY_QUIZ.length}</span>
      </div>
      <div className="strategy-quiz-card">
        <p className="sq-scenario-label">{t.quizScenario}</p>
        <p className="sq-scenario">{q.scenario}</p>
        <div className="sq-options">
          {q.options.map((opt, i) => {
            let cls = 'sq-option';
            if (selected !== null) {
              if (i === q.correct) cls += ' correct';
              else if (i === selected && i !== q.correct) cls += ' wrong';
            }
            return (
              <button key={i} className={cls} onClick={() => choose(i)}>{opt}</button>
            );
          })}
        </div>
        {selected !== null && (
          <div className={`sq-feedback${selected === q.correct ? ' correct' : ' wrong'}`}>
            <strong>{selected === q.correct ? t.quizCorrect : t.quizWrong}</strong>
            {selected !== q.correct && <span> {q.options[q.correct]}</span>}
            <p className="sq-explanation">{q.explanation}</p>
          </div>
        )}
        {selected !== null && (
          <div className="overlay-foot" style={{ marginTop: 20, justifyContent: 'flex-end' }}>
            <button className="solid-button" onClick={next}>
              {qi + 1 >= STRATEGY_QUIZ.length ? t.submitBtn : t.quizNext} <ArrowRight size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Games hub ──────────────────────────────────────────────────────────────
type ActiveGame = 'none' | 'memory' | 'spinner' | 'stratquiz';

function GamesSection() {
  const { lang } = useLang();
  const t: Strings = S[lang];
  const [active, setActive] = useState<ActiveGame>('none');

  if (active === 'memory')   return <MemoryMatchGame onBack={() => setActive('none')} />;
  if (active === 'spinner')  return <SpinnerGame onBack={() => setActive('none')} />;
  if (active === 'stratquiz') return <StrategyQuizGame onBack={() => setActive('none')} />;

  const games = [
    { id: 'memory' as ActiveGame,   icon: <Gamepad2 size={28} />,    title: t.gameMemoryTitle,  desc: t.gameMemoryDesc  },
    { id: 'spinner' as ActiveGame,  icon: <RefreshCw size={28} />,   title: t.gameSpinnerTitle, desc: t.gameSpinnerDesc },
    { id: 'stratquiz' as ActiveGame,icon: <Lightbulb size={28} />,   title: t.gameQuizTitle,    desc: t.gameQuizDesc    },
  ];

  return (
    <div className="games-section">
      <div className="notes-header">
        <div>
          <span className="eyebrow">{lang === 'en' ? '06 · activities' : '০৬ · কার্যক্রম'}</span>
          <h1 className="notes-title">{t.gamesTitle}</h1>
          <p className="notes-subtitle">{t.gamesSubtitle}</p>
        </div>
      </div>
      <div className="games-grid">
        {games.map(g => (
          <div key={g.id} className="game-card">
            <div className="game-card-icon">{g.icon}</div>
            <h3>{g.title}</h3>
            <p>{g.desc}</p>
            <button className="solid-button" style={{ marginTop: 'auto' }} onClick={() => setActive(g.id)}>
              {t.gamePlay} <ArrowRight size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Chatbot ────────────────────────────────────────────────────────────────
function Chatbot() {
  const { lang } = useLang();
  const t: Strings = S[lang];
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  useEffect(() => { setMessages([t.chatWelcome]); }, [lang]); // eslint-disable-line react-hooks/exhaustive-deps
  const send = () => {
    if (!input.trim()) return;
    const q = input.trim();
    setMessages(m => [...m, q, t.chatReply]);
    setInput('');
  };
  return (
    <div className="chatbot">
      {open && (
        <div className="chat-window">
          <div className="chat-header">
            <div><strong>{t.chatTitle}</strong><small>{t.chatSubtitle}</small></div>
            <button onClick={() => setOpen(false)} aria-label="Close"><X size={16} /></button>
          </div>
          <div className="chat-messages">
            {messages.map((m, i) => <div className={`chat-message${i % 2 === 1 ? ' user' : ''}`} key={`${m}-${i}`}>{m}</div>)}
          </div>
          <div className="chat-input">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder={t.chatPlaceholder} data-testid="input-chat" />
            <button onClick={send} data-testid="button-send-chat"><Send size={15} /></button>
          </div>
        </div>
      )}
      <button className="chat-toggle" onClick={() => setOpen(!open)} data-testid="button-open-levo"><Bot size={22} /></button>
    </div>
  );
}

// ── Landing ────────────────────────────────────────────────────────────────
function Landing({ onEnter }: { onEnter: (role: 'student' | 'admin') => void }) {
  const { lang } = useLang();
  const t: Strings = S[lang];
  const quotes = lang === 'en' ? QUOTES_EN : QUOTES_BN;
  const [quote, setQuote] = useState(quotes[0]);
  useEffect(() => { setQuote(quotes[Math.floor(Math.random() * quotes.length)]); }, [lang]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <main className="landing">
      <header className="landing-header">
        <span className="brand"><span className="brand-mark" /><span className="brand-copy">{t.brand}</span></span>
        <nav className="landing-nav">
          <span className="micro">{t.researchPrototype}</span>
          <LangToggle />
          <button className="outline-button" onClick={() => onEnter('admin')} data-testid="button-enter-admin">
            <LayoutDashboard size={15} /> {t.adminView}
          </button>
        </nav>
      </header>
      <section className="landing-main">
        <div className="landing-grid">
          <div className="landing-copy">
            <span className="eyebrow">{t.landingEyebrow}</span>
            <h1>{t.landingH1}<br /><em>{t.landingH2}</em></h1>
            <p>{t.landingBody}</p>
            <div className="landing-actions">
              <button className="solid-button light" onClick={() => onEnter('student')} data-testid="button-enter-student">
                {t.enterStudent} <ArrowRight size={16} />
              </button>
              <button className="outline-button" onClick={() => onEnter('admin')} data-testid="button-enter-admin-secondary">
                {t.enterAdmin}
              </button>
            </div>
            <div className="quote-card">
              <blockquote>"{quote[0]}"</blockquote>
              <cite>— {quote[1]} · {t.openingReflection}</cite>
            </div>
          </div>
          <div className="orbit-stage">
            <div className="orbit-ring"><span /></div>
            <div className="orbit-center"><Sparkles size={22} /><strong>{lang === 'en' ? 'learning\nvisible' : 'শিক্ষণ\nদৃশ্যমান'}</strong></div>
            <div className="orbit-node node-immersion"><Lightbulb size={19} /><span>{t.phaseLabel1}</span></div>
            <div className="orbit-node node-transition"><Zap size={19} /><span>{t.phaseLabel2}</span></div>
            <div className="orbit-node node-genesis"><Target size={19} /><span>{t.phaseLabel3}</span></div>
          </div>
        </div>
      </section>
      <footer className="landing-footer">
        <div className="landing-footer-researcher">
          <strong>{t.researcherName}</strong>
          <span>{t.researcherReg}</span>
          <span>{t.researcherDept}</span>
        </div>
        <span className="micro">{t.footerSub}</span>
      </footer>
    </main>
  );
}

// ── Topbar ─────────────────────────────────────────────────────────────────
function Topbar({ onHome, onRole }: { onHome: () => void; onRole: (r: 'student' | 'admin') => void }) {
  const { lang } = useLang();
  const t: Strings = S[lang];
  return (
    <header className="topbar">
      <button className="brand" onClick={onHome}><span className="brand-mark" /><span className="brand-copy">{t.brand}</span></button>
      <div className="topbar-researcher">
        <span className="topbar-researcher-name">{t.researcherName}</span>
        <span className="micro">{t.researcherShort}</span>
      </div>
      <div className="topbar-actions">
        <LangToggle />
        <button className="icon-button" onClick={() => onRole('admin')} aria-label="Admin"><LayoutDashboard size={16} /></button>
        <button className="icon-button" onClick={onHome} aria-label="Home"><X size={16} /></button>
      </div>
    </header>
  );
}

// ── Sidebar ────────────────────────────────────────────────────────────────
function Sidebar({ view, onView }: { view: StudentView; onView: (v: StudentView) => void }) {
  const { lang } = useLang();
  const t: Strings = S[lang];
  const items: [StudentView, string, ReactNode][] = [
    ['subject', t.navSubject, <BookOpen size={16} />],
    ['group',   t.navGroup,   <Users size={16} />],
    ['unit',    t.navUnit,    <FileText size={16} />],
    ['lesson',  t.navLesson,  <ClipboardCheck size={16} />],
    ['notes',   t.navNotes,   <NotebookPen size={16} />],
    ['games',   t.navGames,   <Gamepad2 size={16} />],
  ];
  return (
    <aside className="sidebar">
      <div className="sidebar-intro">
        <span className="micro">{t.sidebarTitle}</span>
        <h2>Education<br />research lab</h2>
      </div>
      <nav className="nav-list">
        {items.map(([key, label, icon]) => (
          <button className={`nav-item${view === key ? ' active' : ''}`} key={key} onClick={() => onView(key)} data-testid={`nav-${key}`}>
            {icon}<span>{label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <span className="micro">{t.sidebarFooterLabel}</span>
        <p>Group C · Unit I<br />42 videos · 3 phases</p>
      </div>
    </aside>
  );
}

function StudentShell({ onHome, onAdmin, children, view, onView }: { onHome: () => void; onAdmin: () => void; children: ReactNode; view: StudentView; onView: (v: StudentView) => void }) {
  return (
    <div className="shell">
      <Topbar onHome={onHome} onRole={() => onAdmin()} />
      <div className="workspace">
        <Sidebar view={view} onView={onView} />
        <main className="main-column"><div className="main-inner">{children}</div></main>
      </div>
    </div>
  );
}

// ── Subject / Group / Unit views ───────────────────────────────────────────
function SubjectView({ onGroup }: { onGroup: (g: 'C' | 'D') => void }) {
  const { lang } = useLang();
  const t: Strings = S[lang];
  return (
    <>
      <div className="breadcrumb"><span>{t.bcStudent}</span><ChevronRight size={12} /><span>{t.bcSubject}</span></div>
      <div className="page-heading">
        <div><span className="section-index">{t.subjectIndex}</span><h1>{t.subjectH1a}<br />{t.subjectH1b}</h1></div>
        <p>{t.subjectBody}</p>
      </div>
      <section className="subject-card surface">
        <div className="subject-card-copy">
          <span className="eyebrow">{t.subjectCardEyebrow}</span>
          <h2>{t.subjectCardH2.split('\n').map((l, i) => <span key={i}>{l}{i === 0 && <br />}</span>)}</h2>
          <p>{t.subjectCardBody}</p>
        </div>
        <div className="subject-card-art"><div className="art-lines" /></div>
      </section>
      <div className="section-heading" style={{ marginBottom: 17 }}>
        <span className="section-index">{t.cohortIndex}</span>
        <div>
          <span className="eyebrow">{t.cohortEyebrow}</span>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: 36, fontWeight: 400, margin: '12px 0 0' }}>{t.cohortHeading}</h2>
        </div>
      </div>
      <div className="group-grid">
        <button className="group-card" onClick={() => onGroup('C')} data-testid="button-group-c">
          <span className="group-letter">GROUP C</span><ChevronRight size={18} />
          <h3>{t.groupCTitle}</h3><p>{t.groupCDetail}</p>
        </button>
        <button className="group-card" onClick={() => onGroup('D')} data-testid="button-group-d">
          <span className="group-letter">GROUP D</span><ChevronRight size={18} />
          <h3>{t.groupDTitle}</h3><p>{t.groupDDetail}</p>
        </button>
      </div>
    </>
  );
}

function GroupView({ onUnit, onBack }: { onUnit: () => void; onBack: () => void }) {
  const { lang } = useLang();
  const t: Strings = S[lang];
  return (
    <>
      <div className="breadcrumb"><button onClick={onBack}>{t.bcSubject}</button><ChevronRight size={12} /><span>{t.bcGroupC}</span></div>
      <div className="page-heading">
        <div><span className="section-index">{t.groupIndex}</span><h1>{t.groupH1a}<br />{t.groupH1b}</h1></div>
        <p>{t.groupBody}</p>
      </div>
      <div className="unit-view">
        <section className="unit-rail">
          <span className="eyebrow" style={{ color: '#a9d7cb' }}>{t.groupRailEyebrow}</span>
          <h2>{t.groupRailH2a}<br />{t.groupRailH2b}</h2>
          <p>{t.groupRailBody}</p>
          <div className="contact-hours">{t.groupContactHours}</div>
        </section>
        <section className="lesson-list">
          <button className="lesson-row" onClick={onUnit} data-testid="button-open-unit">
            <span className="lesson-number">UNIT I</span>
            <span><h3>{t.unitRowTitle}</h3><p>{t.unitRowDetail}</p></span>
            <ChevronRight size={18} />
          </button>
        </section>
      </div>
    </>
  );
}

function UnitView({ onLesson, onBack }: { onLesson: () => void; onBack: () => void }) {
  const { lang } = useLang();
  const { role } = useRole();
  const t: Strings = S[lang];
  const phases: Phase[] = ['immersion', 'transition', 'genesis'];
  return (
    <>
      <div className="breadcrumb"><button onClick={onBack}>{t.bcGroupC}</button><ChevronRight size={12} /><span>{t.bcUnit}</span></div>
      <div className="page-heading">
        <div><span className="section-index">{t.unitIndex}</span><h1>{t.unitH1a}<br />{t.unitH1b}</h1></div>
        <p>{t.unitBody}</p>
      </div>
      <div className="unit-view">
        <section className="unit-rail">
          <span className="eyebrow" style={{ color: '#a9d7cb' }}>{t.unitRailEyebrow}</span>
          <h2>{t.unitRailH2.split('\n').map((l, i) => <span key={i}>{l}{i === 0 && <br />}</span>)}</h2>
          <p>{t.unitRailBody}</p>
          <div className="contact-hours">{t.unitContactHours}</div>
        </section>
        <section className="lesson-list">
          {phases.map((ph, i) => (
            <button className="lesson-row" key={ph} onClick={onLesson} data-testid={`button-open-phase-${ph}`}>
              <span className="lesson-number">0{i + 1}</span>
              <span>
                <h3>{phaseLabel(ph, role, lang)}</h3>
                <p>{t.phaseRowDetail}</p>
              </span>
              <ChevronRight size={18} />
            </button>
          ))}
        </section>
      </div>
    </>
  );
}

// ── Student app ────────────────────────────────────────────────────────────
function StudentApp({ onHome, onAdmin }: { onHome: () => void; onAdmin: () => void }) {
  const [view, setView] = useState<StudentView>('subject');
  const [toast, setToast] = useState('');
  useEffect(() => { if (!toast) return; const ti = setTimeout(() => setToast(''), 3200); return () => clearTimeout(ti); }, [toast]);
  return (
    <>
      <StudentShell onHome={onHome} onAdmin={onAdmin} view={view} onView={setView}>
        {view === 'subject' && <SubjectView onGroup={() => setView('group')} />}
        {view === 'group'   && <GroupView onUnit={() => setView('unit')} onBack={() => setView('subject')} />}
        {view === 'unit'    && <UnitView onLesson={() => setView('lesson')} onBack={() => setView('group')} />}
        {view === 'lesson'  && <LessonWorkspace onBack={() => setView('unit')} onToast={setToast} />}
        {view === 'notes'   && <NotesSection />}
        {view === 'games'   && <GamesSection />}
      </StudentShell>
      <Chatbot />
      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </>
  );
}

// ── Admin app ──────────────────────────────────────────────────────────────
function AdminApp({ onHome, onStudent }: { onHome: () => void; onStudent: () => void }) {
  const { lang } = useLang();
  const t: Strings = S[lang];
  const curriculumRows = [
    ['01', lang === 'en' ? 'Immersion · planning' : 'নিমজ্জন · পরিকল্পনা',                lang === 'en' ? 'Learners selecting strategies' : 'শিক্ষার্থীরা কৌশল নির্বাচন করছে',  '78%'],
    ['02', lang === 'en' ? 'Transition · supported learning' : 'রূপান্তর · সহায়তায় শিক্ষণ', lang === 'en' ? 'Midpoint monitoring active' : 'মধ্যবিন্দু পর্যবেক্ষণ সক্রিয়',   '50%'],
    ['03', lang === 'en' ? 'Genesis · evaluation' : 'উৎপত্তি · মূল্যায়ন',                lang === 'en' ? 'Reflections submitted' : 'প্রতিফলন জমা দেওয়া হয়েছে',              '64%'],
  ];
  const learners = [
    ['AS', 'A. Sen',  lang === 'en' ? 'Group C · Immersion' : 'গ্রুপ সি · নিমজ্জন',   '86%'],
    ['MN', 'M. Noor', lang === 'en' ? 'Group D · Unit I' : 'গ্রুপ ডি · ইউনিট ১',     '61%'],
    ['RK', 'R. Karim',lang === 'en' ? 'Group C · Transition' : 'গ্রুপ সি · রূপান্তর', '50%'],
  ];
  return (
    <div className="shell">
      <Topbar onHome={onHome} onRole={r => r === 'student' && onStudent()} />
      <div className="workspace">
        <Sidebar view="subject" onView={onStudent} />
        <main className="main-column"><div className="main-inner">
          <div className="admin-hero">
            <div><span className="section-index">{t.adminIndex}</span><h1>{t.adminH1a}<br />{t.adminH1b}</h1></div>
            <p>{t.adminBody}</p>
          </div>
          <section className="metrics">
            <div className="metric"><span className="metric-label">{t.metricLearners}</span><strong>48</strong><small>{t.metricLearnersDetail}</small></div>
            <div className="metric"><span className="metric-label">{t.metricCompletion}</span><strong>72%</strong><small>{t.metricCompletionDetail}</small></div>
            <div className="metric"><span className="metric-label">{t.metricTransition}</span><strong>19</strong><small>{t.metricTransitionDetail}</small></div>
            <div className="metric"><span className="metric-label">{t.metricReflections}</span><strong>31</strong><small>{t.metricReflectionsDetail}</small></div>
          </section>
          <div className="admin-grid">
            <section className="admin-panel surface">
              <div className="panel-title"><h2>{t.curriculumTitle}</h2><span>{t.curriculumSub}</span></div>
              {curriculumRows.map(([n, title, sub, p]) => (
                <div className="curriculum-row" key={n}>
                  <span>{n}</span><div><strong>{title}</strong><small>{sub}</small></div>
                  <div className="bar"><span style={{ width: p }} /></div>
                </div>
              ))}
            </section>
            <section className="admin-panel surface">
              <div className="panel-title"><h2>{t.pulseTitle}</h2><span>{t.pulseToday}</span></div>
              <div className="learner-list">
                {learners.map(([ini, name, detail, prog]) => (
                  <div className="learner" key={name}>
                    <span className="avatar">{ini}</span>
                    <div className="learner-info"><strong>{name}</strong><small>{detail}</small></div>
                    <span className="learner-progress">{prog}</span>
                  </div>
                ))}
              </div>
              <div className="signal-box"><span className="micro">{t.signalLabel}</span><p>{t.signalBody}</p></div>
            </section>
          </div>
        </div></main>
      </div>
    </div>
  );
}

// ── Root ───────────────────────────────────────────────────────────────────
function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [lang, setLang] = useState<Lang>('en');
  const [role, setRole] = useState<Role>('student');
  const toggleLang = () => setLang(l => l === 'en' ? 'bn' : 'en');

  const enter = (r: 'student' | 'admin') => {
    setRole(r === 'admin' ? 'teacher' : 'student');
    setScreen(r);
  };

  return (
    <LangContext.Provider value={{ lang, toggleLang }}>
      <RoleContext.Provider value={{ role }}>
        {screen === 'landing' && <Landing onEnter={enter} />}
        {screen === 'admin'   && <AdminApp onHome={() => setScreen('landing')} onStudent={() => { setRole('student'); setScreen('student'); }} />}
        {screen === 'student' && <StudentApp onHome={() => setScreen('landing')} onAdmin={() => { setRole('teacher'); setScreen('admin'); }} />}
      </RoleContext.Provider>
    </LangContext.Provider>
  );
}

export default App;
