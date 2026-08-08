import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import {
  ArrowLeft, ArrowRight, BarChart3, BookOpen, Bot, Check, ChevronRight,
  ClipboardCheck, FileText, LayoutDashboard, Lightbulb, Pause, Play,
  Send, Sparkles, Target, Users, X, Zap,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────
type Lang = 'en' | 'bn';
type Screen = 'landing' | 'student' | 'admin';
type StudentView = 'subject' | 'group' | 'unit' | 'lesson';
type Phase = 'immersion' | 'transition' | 'genesis';
type CheckpointStage =
  | 'pre' | 'playing' | 'cp25' | 'cp50' | 'cp75'
  | 'cp100_quiz' | 'cp100_eval' | 'done';

// ── Language context ───────────────────────────────────────────────────────
const LangContext = createContext<{ lang: Lang; toggleLang: () => void }>({ lang: 'en', toggleLang: () => {} });
const useLang = () => useContext(LangContext);

// ── Translations ───────────────────────────────────────────────────────────
const S = {
  en: {
    // Brand
    brand: '3 Phasic Meta Learn',
    researchPrototype: 'Research prototype',
    // Researcher
    researcherName: 'Sharmin Shahnaz',
    researcherReg: 'Reg. No. 24DEDUC010 · Ph.D. Research Scholar',
    researcherDept: 'Department of Education · Central University of Karnataka',
    researcherShort: 'Reg. 24DEDUC010 · Dept. of Education · CUK',
    // Landing
    landingEyebrow: 'A visible architecture for learning',
    landingHeading1: 'Learn in',
    landingHeading2: 'three phases.',
    landingBody: '3 Phasic Meta Learn makes the hidden work of learning visible — from building a plan, to learning with support, to evaluating the moves that made progress possible.',
    enterStudent: 'Enter student demo',
    enterAdmin: 'Explore the committee dashboard',
    adminView: 'Admin view',
    openingReflection: 'opening reflection',
    footerSub: 'Education subject · Group C / Group D',
    // Phases
    immersion: 'Immersion',
    transition: 'Transition',
    genesis: 'Genesis',
    phase: 'phase',
    phaseImmersionSub: 'Build the plan',
    phaseTransitionSub: 'Learn with support',
    phaseGenesisSub: 'Evaluate & reflect',
    videos: 'videos',
    // Sidebar
    sidebarTitle: 'Student workspace',
    sidebarSubtitle: 'Education\nresearch lab',
    navSubject: 'Subject overview',
    navGroup: 'Groups C + D',
    navUnit: 'Unit I · Education',
    navLesson: 'Video workspace',
    sidebarFooterLabel: 'Current pathway',
    sidebarFooterDetail: 'Group C · Unit I\n42 videos · 3 phases',
    // Subject view
    subjectIndex: '01 · orientation',
    subjectH1a: 'Education',
    subjectH1b: 'as inquiry.',
    subjectBody: 'Follow one curriculum through a sequence designed to make planning, support, and reflection observable.',
    subjectCardEyebrow: 'Education subject',
    subjectCardH2: 'Learning, mind,\nand context',
    subjectCardBody: 'A research-informed pathway for exploring how people learn — and how learners can become better observers of their own thinking.',
    cohortIndex: '02 · cohort',
    cohortEyebrow: 'Choose a study group',
    cohortHeading: 'Where will you begin?',
    groupCTitle: 'Foundations',
    groupCDetail: 'Unit I · 42 videos · 3 phases',
    groupDTitle: 'Applications',
    groupDDetail: 'Unit I · coming soon',
    // Group view
    groupIndex: '03 · pathway',
    groupH1a: 'Group C',
    groupH1b: 'foundations.',
    groupBody: 'A paced entry into educational psychology, with room to pause and make your learning decisions explicit.',
    groupRailEyebrow: 'Group C · curriculum',
    groupRailH2a: 'One unit.',
    groupRailH2b: 'Many lenses.',
    groupRailBody: '42 videos across three phases. Every video follows the same five-checkpoint structure automatically.',
    groupContactHours: '42 videos · 3 phases · active',
    unitRowTitle: 'Education & Psychology',
    unitRowDetail: '14 Immersion videos · 14 Transition videos · 14 Genesis videos.',
    // Unit view
    unitIndex: '04 · unit map',
    unitH1a: 'Education',
    unitH1b: '& Psychology.',
    unitBody: '42 videos across three phases. Each video pauses automatically at 25%, 50%, 75%, and 100% for interactive monitoring and evaluation.',
    unitRailEyebrow: 'Unit I',
    unitRailH2: '42 videos\n3 phases',
    unitRailBody: 'Build a shared vocabulary before choosing a strategy for learning with the material.',
    unitContactHours: 'Group C · automated checkpoints',
    phaseRowDetail: '14 videos · planning, flashcard, monitoring, muddy point, quiz & evaluation at each video.',
    // Lesson
    lessonEyebrow: 'Group C · Unit I · Education & Psychology',
    lessonH1: '42 videos,\nthree phases.',
    lessonBody: 'Every video follows the same five-checkpoint structure automatically: planning, flashcard, monitoring, muddy point, and evaluation.',
    // Playlist
    complete: 'complete',
    backToPlaylist: 'Back to playlist',
    // Video player
    uploadNote: 'Upload video to enable real playback · simulation active',
    statusPlaying: 'Playing…',
    statusReady: 'Ready to plan',
    statusPaused: 'Paused at',
    // Checkpoint tracker labels
    cpPlanning: 'Planning',
    cpFlashcard: 'Flashcard',
    cpMonitoring: 'Monitoring',
    cpMuddyPoint: 'Muddy Point',
    cpQuizEval: 'Quiz + Eval',
    // Overlay — pre
    prePhase: (p: string) => `${p} phase`,
    preStep: (i: number) => `Video ${i} of 14 · Planning Sheet`,
    preH2a: 'Before you watch,',
    preH2b: 'build your plan.',
    preSub: 'Complete the planning sheet and select your strategy. The video starts when you are ready.',
    strategyEyebrow: 'Strategy selector',
    strategyH3: 'Give your thinking a shape.',
    strategyBody: 'Pick one primary move. You can change it later, but begin with a hypothesis.',
    strategyCompactEyebrow: 'Choose your learning strategy',
    startVideo: 'Start video',
    // Overlay — cp25
    cp25Badge: '25% reached',
    cp25Step: 'Monitoring · Flashcard',
    cp25H2: 'Test your understanding.',
    cp25Sub: 'Click the card to flip between the term and its definition.',
    flashcardTermLabel: 'Term',
    flashcardTapToFlip: 'Tap to flip',
    flashcardDefLabel: 'Definition',
    resumeVideo: 'Resume video',
    // Overlay — cp50
    cp50Badge: '50% reached',
    cp50Step: (i: number) => `Monitoring Sheet · Video ${i}`,
    cp50H2a: 'Halfway point.',
    cp50H2b: 'Check your understanding.',
    cp50Sub: 'Respond to each monitoring prompt before continuing.',
    yourResponse: 'Your response…',
    // Overlay — cp75
    cp75Badge: '75% reached',
    cp75Step: 'Monitoring · Muddy Point',
    cp75H2a: 'What is still',
    cp75H2b: 'unclear?',
    cp75Sub: 'Name the muddiest point in what you have watched so far. Even a partial answer helps you direct attention for the final section.',
    muddyPointLabel: 'Muddy point',
    muddyPointPlaceholder: 'Describe the concept or moment that is least clear to you right now…',
    // Overlay — quiz
    quizBadge: 'Video complete',
    quizStep: 'Evaluation · Quiz',
    quizH2a: 'Quick check',
    quizH2b: 'before you reflect.',
    quizSub: 'Choose the answer that best matches what you learned.',
    submitBtn: 'Submit',
    // Overlay — eval
    evalBadge: (p: string) => `${p} phase · Complete`,
    evalStep: (i: number) => `Evaluation Sheet · Video ${i}`,
    evalH2a: 'Look back',
    evalH2b: 'at the move.',
    evalSub: 'Evaluation is not a score alone. It is evidence about which strategy helped, where the concept shifted, and what you would change next time.',
    yourReflection: 'Your reflection…',
    completeVideo: 'Complete video',
    // Toast messages
    toastFlashcard: 'Flashcard saved.',
    toastMonitoring: 'Monitoring sheet saved.',
    toastMuddy: 'Muddy point saved.',
    toastVideoDone: (cur: number, next: number) => `Video ${cur} complete — starting Video ${next}.`,
    toastPhaseDone: (p: string) => `All ${p} phase videos complete!`,
    // Chatbot
    chatTitle: 'Levo',
    chatSubtitle: 'learning companion',
    chatWelcome: 'I am Levo. Ask me about the lesson, a strategy, or where to look next.',
    chatReply: 'Try connecting that question to the three phases: plan what you know, monitor what changes, then reflect on the evidence.',
    chatPlaceholder: 'Ask Levo…',
    // Admin
    adminIndex: 'Committee view · 06',
    adminH1a: 'Curriculum',
    adminH1b: 'in motion.',
    adminBody: 'One glance across the pathway: what is being taught, what learners are doing, and where support is needed.',
    metricLearners: 'Active learners',
    metricLearnersDetail: '+6 this week',
    metricCompletion: 'Completion rate',
    metricCompletionDetail: 'Group C leading',
    metricTransition: 'At transition',
    metricTransitionDetail: 'Needs a check-in',
    metricReflections: 'Reflections',
    metricReflectionsDetail: 'Collected locally',
    curriculumTitle: 'Curriculum overview',
    curriculumSub: '3 phases · 42 videos',
    pulseTitle: 'Learner pulse',
    pulseToday: 'today',
    signalLabel: 'Committee signal',
    signalBody: 'Several learners paused at the distinction between perception and conception. Consider adding a shared example to the next live session.',
    // Strategies
    strategies: ['Concept mapping', 'Feynman technique', 'Method of loci', 'Retrieval practice'],
    // Breadcrumbs
    bcStudent: 'Student',
    bcSubject: 'Subject overview',
    bcGroupC: 'Group C',
    bcUnit: 'Unit I',
    // Misc
    videoOf14: (i: number) => `Video ${i} of 14`,
    allComplete: (p: string) => `All ${p} phase videos complete!`,
    langToggle: 'বাংলা',
  },
  bn: {
    brand: '৩ পর্যায় মেটা লার্ন',
    researchPrototype: 'গবেষণা প্রোটোটাইপ',
    researcherName: 'শারমিন শাহনাজ',
    researcherReg: 'নিবন্ধন নং ২৪DEDUC০১০ · পিএইচ.ডি. গবেষণা পণ্ডিত',
    researcherDept: 'শিক্ষা বিভাগ · কেন্দ্রীয় কর্ণাটক বিশ্ববিদ্যালয়',
    researcherShort: 'নিবন্ধন ২৪DEDUC০১০ · শিক্ষা বিভাগ · কেকেবি',
    landingEyebrow: 'শিখনের একটি দৃশ্যমান কাঠামো',
    landingHeading1: 'শিখুন',
    landingHeading2: 'তিনটি পর্যায়ে।',
    landingBody: '৩ পর্যায় মেটা লার্ন শিক্ষার গভীর কাজকে দৃশ্যমান করে তোলে — পরিকল্পনা গড়া থেকে শুরু করে, সহায়তা নিয়ে শেখা পর্যন্ত, এবং অগ্রগতিকে সম্ভব করার পদক্ষেপগুলি মূল্যায়ন করা পর্যন্ত।',
    enterStudent: 'শিক্ষার্থী ডেমোতে প্রবেশ করুন',
    enterAdmin: 'কমিটি ড্যাশবোর্ড অন্বেষণ করুন',
    adminView: 'প্রশাসক দৃশ্য',
    openingReflection: 'প্রারম্ভিক প্রতিফলন',
    footerSub: 'শিক্ষা বিষয় · গ্রুপ সি / গ্রুপ ডি',
    immersion: 'নিমজ্জন',
    transition: 'রূপান্তর',
    genesis: 'উৎপত্তি',
    phase: 'পর্যায়',
    phaseImmersionSub: 'পরিকল্পনা গড়ুন',
    phaseTransitionSub: 'সহায়তায় শিখুন',
    phaseGenesisSub: 'মূল্যায়ন করুন ও প্রতিফলিত করুন',
    videos: 'ভিডিও',
    sidebarTitle: 'শিক্ষার্থী কর্মক্ষেত্র',
    sidebarSubtitle: 'শিক্ষা\nগবেষণা ল্যাব',
    navSubject: 'বিষয় সারসংক্ষেপ',
    navGroup: 'গ্রুপ সি + ডি',
    navUnit: 'ইউনিট ১ · শিক্ষা',
    navLesson: 'ভিডিও কর্মক্ষেত্র',
    sidebarFooterLabel: 'বর্তমান পথ',
    sidebarFooterDetail: 'গ্রুপ সি · ইউনিট ১\n৪২ ভিডিও · ৩ পর্যায়',
    subjectIndex: '০১ · অভিমুখীকরণ',
    subjectH1a: 'শিক্ষা',
    subjectH1b: 'অনুসন্ধান হিসেবে।',
    subjectBody: 'পরিকল্পনা, সহায়তা এবং প্রতিফলন পর্যবেক্ষণযোগ্য করার জন্য ডিজাইন করা একটি ক্রমানুসারে একটি পাঠ্যক্রম অনুসরণ করুন।',
    subjectCardEyebrow: 'শিক্ষা বিষয়',
    subjectCardH2: 'শিক্ষা, মন\nএবং প্রেক্ষাপট',
    subjectCardBody: 'মানুষ কীভাবে শেখে তা অন্বেষণের জন্য একটি গবেষণাভিত্তিক পথ — এবং শিক্ষার্থীরা কীভাবে তাদের নিজস্ব চিন্তার আরও ভালো পর্যবেক্ষক হতে পারে।',
    cohortIndex: '০২ · দল',
    cohortEyebrow: 'একটি অধ্যয়ন গ্রুপ বেছে নিন',
    cohortHeading: 'আপনি কোথা থেকে শুরু করবেন?',
    groupCTitle: 'ভিত্তি',
    groupCDetail: 'ইউনিট ১ · ৪২ ভিডিও · ৩ পর্যায়',
    groupDTitle: 'প্রয়োগ',
    groupDDetail: 'ইউনিট ১ · শীঘ্রই আসছে',
    groupIndex: '০৩ · পথ',
    groupH1a: 'গ্রুপ সি',
    groupH1b: 'ভিত্তি।',
    groupBody: 'শিক্ষামনোবিজ্ঞানে একটি পর্যায়ক্রমিক প্রবেশ, যেখানে থামার এবং আপনার শিক্ষণ সিদ্ধান্তগুলি স্পষ্ট করার সুযোগ রয়েছে।',
    groupRailEyebrow: 'গ্রুপ সি · পাঠ্যক্রম',
    groupRailH2a: 'একটি ইউনিট।',
    groupRailH2b: 'অনেক দৃষ্টিভঙ্গি।',
    groupRailBody: '৪২ ভিডিও তিনটি পর্যায়ে। প্রতিটি ভিডিও স্বয়ংক্রিয়ভাবে একই পাঁচটি চেকপয়েন্ট কাঠামো অনুসরণ করে।',
    groupContactHours: '৪২ ভিডিও · ৩ পর্যায় · সক্রিয়',
    unitRowTitle: 'শিক্ষা ও মনোবিজ্ঞান',
    unitRowDetail: '১৪টি নিমজ্জন ভিডিও · ১৪টি রূপান্তর ভিডিও · ১৪টি উৎপত্তি ভিডিও।',
    unitIndex: '০৪ · ইউনিট মানচিত্র',
    unitH1a: 'শিক্ষা',
    unitH1b: 'ও মনোবিজ্ঞান।',
    unitBody: '৪২ ভিডিও তিনটি পর্যায়ে। প্রতিটি ভিডিও ইন্টারেক্টিভ পর্যবেক্ষণ ও মূল্যায়নের জন্য ২৫%, ৫০%, ৭৫% এবং ১০০%-এ স্বয়ংক্রিয়ভাবে বিরতি দেয়।',
    unitRailEyebrow: 'ইউনিট ১',
    unitRailH2: '৪২ ভিডিও\n৩ পর্যায়',
    unitRailBody: 'উপাদান দিয়ে শেখার কৌশল বেছে নেওয়ার আগে একটি সাধারণ শব্দভান্ডার তৈরি করুন।',
    unitContactHours: 'গ্রুপ সি · স্বয়ংক্রিয় চেকপয়েন্ট',
    phaseRowDetail: '১৪টি ভিডিও · প্রতিটি ভিডিওতে পরিকল্পনা, ফ্ল্যাশকার্ড, পর্যবেক্ষণ, অস্পষ্ট বিন্দু, কুইজ ও মূল্যায়ন।',
    lessonEyebrow: 'গ্রুপ সি · ইউনিট ১ · শিক্ষা ও মনোবিজ্ঞান',
    lessonH1: '৪২ ভিডিও,\nতিনটি পর্যায়।',
    lessonBody: 'প্রতিটি ভিডিও স্বয়ংক্রিয়ভাবে একই পাঁচটি চেকপয়েন্ট কাঠামো অনুসরণ করে: পরিকল্পনা, ফ্ল্যাশকার্ড, পর্যবেক্ষণ, অস্পষ্ট বিন্দু এবং মূল্যায়ন।',
    complete: 'সম্পন্ন',
    backToPlaylist: 'প্লেলিস্টে ফিরুন',
    uploadNote: 'আসল প্লেব্যাকের জন্য ভিডিও আপলোড করুন · সিমুলেশন সক্রিয়',
    statusPlaying: 'চলছে…',
    statusReady: 'পরিকল্পনার জন্য প্রস্তুত',
    statusPaused: 'বিরতি দেওয়া হয়েছে',
    cpPlanning: 'পরিকল্পনা',
    cpFlashcard: 'ফ্ল্যাশকার্ড',
    cpMonitoring: 'পর্যবেক্ষণ',
    cpMuddyPoint: 'অস্পষ্ট বিন্দু',
    cpQuizEval: 'কুইজ + মূল্যায়ন',
    prePhase: (p: string) => `${p} পর্যায়`,
    preStep: (i: number) => `ভিডিও ${i} / ১৪ · পরিকল্পনা পত্র`,
    preH2a: 'দেখার আগে,',
    preH2b: 'পরিকল্পনা তৈরি করুন।',
    preSub: 'পরিকল্পনা পত্র পূরণ করুন এবং আপনার কৌশল নির্বাচন করুন। আপনি প্রস্তুত হলে ভিডিও শুরু হবে।',
    strategyEyebrow: 'কৌশল নির্বাচক',
    strategyH3: 'আপনার চিন্তাকে একটি রূপ দিন।',
    strategyBody: 'একটি প্রাথমিক পদক্ষেপ বেছে নিন। আপনি এটি পরে পরিবর্তন করতে পারবেন, কিন্তু একটি অনুমান দিয়ে শুরু করুন।',
    strategyCompactEyebrow: 'আপনার শিক্ষণ কৌশল বেছে নিন',
    startVideo: 'ভিডিও শুরু করুন',
    cp25Badge: '২৫% পৌঁছেছে',
    cp25Step: 'পর্যবেক্ষণ · ফ্ল্যাশকার্ড',
    cp25H2: 'আপনার বোঝাপড়া পরীক্ষা করুন।',
    cp25Sub: 'পদ এবং তার সংজ্ঞার মধ্যে উল্টাতে কার্ডে ক্লিক করুন।',
    flashcardTermLabel: 'পদ',
    flashcardTapToFlip: 'উল্টাতে ট্যাপ করুন',
    flashcardDefLabel: 'সংজ্ঞা',
    resumeVideo: 'ভিডিও চালিয়ে যান',
    cp50Badge: '৫০% পৌঁছেছে',
    cp50Step: (i: number) => `পর্যবেক্ষণ পত্র · ভিডিও ${i}`,
    cp50H2a: 'মাঝামাঝি বিন্দু।',
    cp50H2b: 'আপনার বোঝাপড়া যাচাই করুন।',
    cp50Sub: 'চালিয়ে যাওয়ার আগে প্রতিটি পর্যবেক্ষণ প্রম্পটে সাড়া দিন।',
    yourResponse: 'আপনার উত্তর…',
    cp75Badge: '৭৫% পৌঁছেছে',
    cp75Step: 'পর্যবেক্ষণ · অস্পষ্ট বিন্দু',
    cp75H2a: 'এখনও কী',
    cp75H2b: 'অস্পষ্ট?',
    cp75Sub: 'এখন পর্যন্ত যা দেখেছেন তার মধ্যে সবচেয়ে অস্পষ্ট বিন্দুটি চিহ্নিত করুন। আংশিক উত্তরও আপনাকে শেষ অংশে মনোযোগ দিতে সাহায্য করবে।',
    muddyPointLabel: 'অস্পষ্ট বিন্দু',
    muddyPointPlaceholder: 'এই মুহূর্তে যে ধারণা বা মুহূর্তটি সবচেয়ে কম স্পষ্ট তা বর্ণনা করুন…',
    quizBadge: 'ভিডিও সম্পন্ন',
    quizStep: 'মূল্যায়ন · কুইজ',
    quizH2a: 'প্রতিফলনের আগে',
    quizH2b: 'দ্রুত যাচাই করুন।',
    quizSub: 'আপনি যা শিখেছেন তার সাথে সবচেয়ে মিলে যাওয়া উত্তরটি বেছে নিন।',
    submitBtn: 'জমা দিন',
    evalBadge: (p: string) => `${p} পর্যায় · সম্পন্ন`,
    evalStep: (i: number) => `মূল্যায়ন পত্র · ভিডিও ${i}`,
    evalH2a: 'পেছনে ফিরে তাকান',
    evalH2b: 'পদক্ষেপের দিকে।',
    evalSub: 'মূল্যায়ন শুধু একটি স্কোর নয়। এটি প্রমাণ যে কোন কৌশলটি সাহায্য করেছে, ধারণাটি কোথায় পরিবর্তিত হয়েছে এবং পরের বার আপনি কী পরিবর্তন করবেন।',
    yourReflection: 'আপনার প্রতিফলন…',
    completeVideo: 'ভিডিও সম্পন্ন করুন',
    toastFlashcard: 'ফ্ল্যাশকার্ড সংরক্ষিত।',
    toastMonitoring: 'পর্যবেক্ষণ পত্র সংরক্ষিত।',
    toastMuddy: 'অস্পষ্ট বিন্দু সংরক্ষিত।',
    toastVideoDone: (cur: number, next: number) => `ভিডিও ${cur} সম্পন্ন — ভিডিও ${next} শুরু হচ্ছে।`,
    toastPhaseDone: (p: string) => `সমস্ত ${p} পর্যায়ের ভিডিও সম্পন্ন!`,
    chatTitle: 'লেভো',
    chatSubtitle: 'শিক্ষণ সঙ্গী',
    chatWelcome: 'আমি লেভো। পাঠ, কৌশল বা পরবর্তী কোথায় দেখবেন তা আমাকে জিজ্ঞাসা করুন।',
    chatReply: 'সেই প্রশ্নটি তিনটি পর্যায়ের সাথে সংযুক্ত করার চেষ্টা করুন: আপনি যা জানেন তা পরিকল্পনা করুন, কী পরিবর্তিত হয় তা পর্যবেক্ষণ করুন, তারপর প্রমাণের উপর প্রতিফলিত করুন।',
    chatPlaceholder: 'লেভোকে জিজ্ঞাসা করুন…',
    adminIndex: 'কমিটি দৃশ্য · ০৬',
    adminH1a: 'পাঠ্যক্রম',
    adminH1b: 'গতিশীল।',
    adminBody: 'পথের একটি দৃষ্টিভঙ্গি: কী পড়ানো হচ্ছে, শিক্ষার্থীরা কী করছে এবং কোথায় সহায়তা প্রয়োজন।',
    metricLearners: 'সক্রিয় শিক্ষার্থী',
    metricLearnersDetail: 'এই সপ্তাহে +৬',
    metricCompletion: 'সম্পন্নের হার',
    metricCompletionDetail: 'গ্রুপ সি এগিয়ে',
    metricTransition: 'রূপান্তরে আছে',
    metricTransitionDetail: 'একটি চেক-ইন প্রয়োজন',
    metricReflections: 'প্রতিফলন',
    metricReflectionsDetail: 'স্থানীয়ভাবে সংগৃহীত',
    curriculumTitle: 'পাঠ্যক্রম সারসংক্ষেপ',
    curriculumSub: '৩ পর্যায় · ৪২ ভিডিও',
    pulseTitle: 'শিক্ষার্থীর পালস',
    pulseToday: 'আজ',
    signalLabel: 'কমিটি সংকেত',
    signalBody: 'বেশ কয়েকজন শিক্ষার্থী উপলব্ধি ও ধারণার মধ্যে পার্থক্যে থামলেন। পরবর্তী লাইভ সেশনে একটি ভাগ করা উদাহরণ যোগ করার কথা বিবেচনা করুন।',
    strategies: ['ধারণা মানচিত্র', 'ফাইনম্যান কৌশল', 'স্থানের পদ্ধতি', 'পুনরুদ্ধার অনুশীলন'],
    bcStudent: 'শিক্ষার্থী',
    bcSubject: 'বিষয় সারসংক্ষেপ',
    bcGroupC: 'গ্রুপ সি',
    bcUnit: 'ইউনিট ১',
    videoOf14: (i: number) => `ভিডিও ${i} / ১৪`,
    allComplete: (p: string) => `সমস্ত ${p} পর্যায়ের ভিডিও সম্পন্ন!`,
    langToggle: 'English',
  },
};
type Strings = typeof S.en;

// ── Quotes ────────────────────────────────────────────────────────────────
const quotesEN = [
  ['Learning is not a product of teaching. Learning is a product of the activity of learners.', 'John Holt'],
  ['The mind is not a vessel to be filled but a fire to be kindled.', 'Plutarch'],
  ['We do not learn from experience. We learn from reflecting on experience.', 'John Dewey'],
  ['The important thing is not to stop questioning. Curiosity has its own reason for existing.', 'Albert Einstein'],
];
const quotesBN = [
  ['শিক্ষা শিক্ষকতার ফল নয়। শিক্ষা শিক্ষার্থীদের কার্যকলাপের ফল।', 'জন হোল্ট'],
  ['মন একটি পাত্র নয় যা পূর্ণ করতে হবে, বরং একটি আগুন যা জ্বালাতে হবে।', 'প্লুটার্ক'],
  ['আমরা অভিজ্ঞতা থেকে শিখি না। আমরা অভিজ্ঞতার উপর প্রতিফলন করে শিখি।', 'জন ডিউই'],
  ['গুরুত্বপূর্ণ বিষয় হলো প্রশ্ন করা বন্ধ না করা। কৌতূহলের নিজস্ব কারণ আছে।', 'আলবার্ট আইনস্টাইন'],
];

// ── 42 Video slots ────────────────────────────────────────────────────────
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
  { id: 'p1', label: { en: '01 · Prior knowledge',   bn: '০১ · পূর্ব জ্ঞান'          }, prompt: '[Planning question 1 — to be provided]' },
  { id: 'p2', label: { en: '02 · Learning goal',      bn: '০২ · শিক্ষণ লক্ষ্য'        }, prompt: '[Planning question 2 — to be provided]' },
  { id: 'p3', label: { en: '03 · Strategy rationale', bn: '০৩ · কৌশলের যুক্তি'        }, prompt: '[Planning question 3 — to be provided]' },
];
const MONITORING_QS = [
  { id: 'm1', label: { en: '01 · Comprehension',      bn: '০১ · বোধগম্যতা'            }, prompt: '[Monitoring question 1 — to be provided]' },
  { id: 'm2', label: { en: '02 · Concept connection', bn: '০২ · ধারণা সংযোগ'          }, prompt: '[Monitoring question 2 — to be provided]' },
  { id: 'm3', label: { en: '03 · Strategy check',     bn: '০৩ · কৌশল যাচাই'           }, prompt: '[Monitoring question 3 — to be provided]' },
];
const EVAL_QS = [
  { id: 'e1', label: { en: '01 · Key learning',        bn: '০১ · মূল শিক্ষণ'          }, prompt: '[Evaluation question 1 — to be provided]' },
  { id: 'e2', label: { en: '02 · Strategy assessment', bn: '০২ · কৌশল মূল্যায়ন'      }, prompt: '[Evaluation question 2 — to be provided]' },
  { id: 'e3', label: { en: '03 · Next steps',           bn: '০৩ · পরবর্তী পদক্ষেপ'    }, prompt: '[Evaluation question 3 — to be provided]' },
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

// ── Lang toggle button ─────────────────────────────────────────────────────
function LangToggle({ className = '' }: { className?: string }) {
  const { lang, toggleLang } = useLang();
  const t = S[lang];
  return (
    <button
      className={`lang-toggle ${className}`}
      onClick={toggleLang}
      aria-label={`Switch to ${lang === 'en' ? 'Bengali' : 'English'}`}
      data-testid="button-lang-toggle"
    >
      {t.langToggle}
    </button>
  );
}

// ── Shared small components ────────────────────────────────────────────────
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return <div className="toast" role="status"><Check size={16} /><span>{message}</span><button onClick={onClose} aria-label="Dismiss"><X size={15} /></button></div>;
}

function StrategyPanel({ strategy, onStrategy, compact = false }: { strategy: string; onStrategy: (v: string) => void; compact?: boolean }) {
  const { lang } = useLang();
  const t = S[lang];
  return (
    <aside className={compact ? 'strategy-panel strategy-panel-compact' : 'strategy-panel'}>
      {!compact && (
        <>
          <span className="eyebrow">{t.strategyEyebrow}</span>
          <h3>{t.strategyH3}</h3>
          <p>{t.strategyBody}</p>
        </>
      )}
      {compact && <span className="eyebrow" style={{ marginBottom: 10, display: 'block' }}>{t.strategyCompactEyebrow}</span>}
      <div className="strategy-list">
        {t.strategies.map((item: string) => (
          <button
            className={`strategy-option ${strategy === item ? 'selected' : ''}`}
            key={item}
            onClick={() => onStrategy(item)}
            data-testid={`button-strategy-${item.toLowerCase().replaceAll(' ', '-')}`}
          >
            {item}{strategy === item && <Check size={14} />}
          </button>
        ))}
      </div>
    </aside>
  );
}

// ── Checkpoint overlay ─────────────────────────────────────────────────────
interface CheckpointOverlayProps {
  stage: Exclude<CheckpointStage, 'playing' | 'done'>;
  phase: Phase;
  videoIndex: number;
  strategy: string;
  onStrategy: (v: string) => void;
  onComplete: () => void;
}

function CheckpointOverlay({ stage, phase, videoIndex, strategy, onStrategy, onComplete }: CheckpointOverlayProps) {
  const { lang } = useLang();
  const t: Strings = S[lang];
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flipped, setFlipped] = useState(false);
  const [muddyPoint, setMuddyPoint] = useState('');
  const [selected, setSelected] = useState<number | null>(null);
  const set = (k: string, v: string) => setAnswers(a => ({ ...a, [k]: v }));

  const phaseName = { immersion: t.immersion, transition: t.transition, genesis: t.genesis }[phase];

  if (stage === 'pre') return (
    <div className="overlay-backdrop">
      <div className="overlay-panel overlay-wide">
        <div className="overlay-top-bar">
          <span className="overlay-phase-badge">{t.prePhase(phaseName)}</span>
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
        <div className={`flashcard${flipped ? ' flipped' : ''}`} onClick={() => setFlipped(f => !f)} role="button" aria-label="Flip flashcard">
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
            <textarea
              value={muddyPoint}
              onChange={e => setMuddyPoint(e.target.value)}
              placeholder={t.muddyPointPlaceholder}
              rows={4}
            />
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
          <span className="overlay-phase-badge" style={{ background: 'var(--teal)' }}>{t.evalBadge(phaseName)}</span>
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
interface VideoPlayerProps {
  slot: VideoSlot;
  stage: CheckpointStage;
  onCheckpoint: (pct: 25 | 50 | 75 | 100) => void;
}

function VideoPlayer({ slot, stage, onCheckpoint }: VideoPlayerProps) {
  const { lang } = useLang();
  const t = S[lang];
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const fired = useRef<Set<number>>(new Set());
  const CHECKPOINTS = [25, 50, 75, 100] as const;

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
        break;
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
    }, 80);
  };

  const pauseSim = () => {
    if (simRef.current) { clearInterval(simRef.current); simRef.current = null; }
    setPlaying(false);
  };

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

// ── Phase video workspace ──────────────────────────────────────────────────
function PhaseVideoWorkspace({ phase, onToast }: { phase: Phase; onToast: (m: string) => void }) {
  const { lang } = useLang();
  const t = S[lang];
  const slots = PHASE_VIDEOS[phase];
  const [videoIdx, setVideoIdx] = useState<number | null>(null);
  const [stage, setStage] = useState<CheckpointStage>('pre');
  const [strategy, setStrategy] = useState(t.strategies[0]);
  const [done, setDone] = useState<Set<number>>(new Set());

  const currentSlot = videoIdx !== null ? slots[videoIdx] : null;
  const phaseName = { immersion: t.immersion, transition: t.transition, genesis: t.genesis }[phase];

  const openVideo = (idx: number) => {
    setVideoIdx(idx);
    setStage('pre');
    setStrategy(t.strategies[0]);
  };

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
    } else if (stage === 'cp100_eval') {
      if (videoIdx !== null) {
        setDone(d => new Set([...d, slots[videoIdx].id]));
        const next = videoIdx + 1;
        if (next < slots.length) {
          onToast(t.toastVideoDone(videoIdx + 1, next + 1));
          setVideoIdx(next);
          setStage('pre');
        } else {
          onToast(t.toastPhaseDone(phaseName));
          setVideoIdx(null);
          setStage('pre');
        }
      }
    }
  };

  // Playlist view
  if (currentSlot === null) return (
    <div className="playlist">
      <div className="playlist-header">
        <div>
          <span className="eyebrow">{phaseName} {t.phase}</span>
          <h2>{lang === 'en' ? `14 ${t.videos} · ${done.size} ${t.complete}` : `১৪টি ${t.videos} · ${done.size}টি ${t.complete}`}</h2>
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

  // Video player view
  const stageOrder: CheckpointStage[] = ['pre', 'playing', 'cp25', 'cp50', 'cp75', 'cp100_quiz', 'cp100_eval', 'done'];
  const statusLabel = stage === 'playing'
    ? t.statusPlaying
    : stage === 'pre'
      ? t.statusReady
      : `${t.statusPaused} ${stage === 'cp25' ? '25%' : stage === 'cp50' ? '50%' : stage === 'cp75' ? '75%' : '100%'}`;

  const cpSteps: [string, string, CheckpointStage][] = [
    ['0:00', t.cpPlanning,   'pre'],
    ['25%',  t.cpFlashcard,  'cp25'],
    ['50%',  t.cpMonitoring, 'cp50'],
    ['75%',  t.cpMuddyPoint, 'cp75'],
    ['100%', t.cpQuizEval,   'cp100_quiz'],
  ];

  return (
    <div className="video-workspace">
      <div className="video-workspace-header">
        <button className="back-button" onClick={() => setVideoIdx(null)}>
          <ArrowLeft size={14} /> {t.backToPlaylist}
        </button>
        <span className="video-workspace-label">{phaseName} {t.phase} · {currentSlot.title}</span>
        <span className="video-checkpoint-status">{statusLabel}</span>
      </div>

      <VideoPlayer slot={currentSlot} stage={stage} onCheckpoint={handleCheckpoint} />

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

      <div className="cp-tracker">
        {cpSteps.map(([time, label, s]) => {
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

// ── Lesson workspace ───────────────────────────────────────────────────────
function LessonWorkspace({ onBack, onToast }: { onBack: () => void; onToast: (m: string) => void }) {
  const { lang } = useLang();
  const t = S[lang];
  const [phase, setPhase] = useState<Phase>('immersion');
  const phases: [Phase, string, string][] = [
    ['immersion',  t.immersion,  t.phaseImmersionSub],
    ['transition', t.transition, t.phaseTransitionSub],
    ['genesis',    t.genesis,    t.phaseGenesisSub],
  ];
  return (
    <>
      <div className="lesson-header">
        <div>
          <button className="back-button" onClick={onBack}><ArrowLeft size={14} /> {t.bcUnit}</button>
          <span className="eyebrow" style={{ marginTop: 22 }}>{t.lessonEyebrow}</span>
          <h1>{t.lessonH1}</h1>
          <p>{t.lessonBody}</p>
        </div>
      </div>

      <div className="phase-nav">
        {phases.map(([key, name, sub], i) => (
          <button
            className={`phase-tab${phase === key ? ' active' : ''}`}
            key={key}
            onClick={() => setPhase(key)}
            data-testid={`button-phase-${key}`}
          >
            <span className="phase-code">0{i + 1} · {key}</span>
            <strong>{name}</strong>
            <span className="phase-tab-sub">{sub}</span>
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

// ── Chatbot ────────────────────────────────────────────────────────────────
function Chatbot() {
  const { lang } = useLang();
  const t = S[lang];
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  // Reset welcome message when language changes
  useEffect(() => {
    setMessages([t.chatWelcome]);
  }, [lang]); // eslint-disable-line react-hooks/exhaustive-deps

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
            <button onClick={() => setOpen(false)} aria-label="Close Levo"><X size={16} /></button>
          </div>
          <div className="chat-messages">
            {messages.map((m, i) => <div className={`chat-message${i % 2 === 1 ? ' user' : ''}`} key={`${m}-${i}`}>{m}</div>)}
          </div>
          <div className="chat-input">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder={t.chatPlaceholder} aria-label={t.chatPlaceholder} data-testid="input-chat" />
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
  const { lang } = useLang();
  const t = S[lang];
  const quotes = lang === 'en' ? quotesEN : quotesBN;
  const [quote, setQuote] = useState(quotes[0]);
  useEffect(() => { setQuote(quotes[Math.floor(Math.random() * quotes.length)]); }, [lang]); // eslint-disable-line react-hooks/exhaustive-deps

  const phases = [
    { label: t.immersion, icon: <Lightbulb size={19} />, cls: 'node-immersion' },
    { label: t.transition, icon: <Zap size={19} />,      cls: 'node-transition' },
    { label: t.genesis,   icon: <Target size={19} />,    cls: 'node-genesis'    },
  ];

  return (
    <main className="landing">
      <header className="landing-header">
        <span className="brand"><span className="brand-mark" /><span className="brand-copy">{t.brand}</span></span>
        <nav className="landing-nav">
          <span className="micro">{t.researchPrototype}</span>
          <LangToggle />
          <button className="outline-button" onClick={() => onEnter('admin')} data-testid="button-enter-admin"><LayoutDashboard size={15} /> {t.adminView}</button>
        </nav>
      </header>
      <section className="landing-main">
        <div className="landing-grid">
          <div className="landing-copy">
            <span className="eyebrow">{t.landingEyebrow}</span>
            <h1>{t.landingHeading1}<br /><em>{t.landingHeading2}</em></h1>
            <p>{t.landingBody}</p>
            <div className="landing-actions">
              <button className="solid-button light" onClick={() => onEnter('student')} data-testid="button-enter-student">{t.enterStudent} <ArrowRight size={16} /></button>
              <button className="outline-button" onClick={() => onEnter('admin')} data-testid="button-enter-admin-secondary">{t.enterAdmin}</button>
            </div>
            <div className="quote-card"><blockquote>"{quote[0]}"</blockquote><cite>— {quote[1]} · {t.openingReflection}</cite></div>
          </div>
          <div className="orbit-stage" aria-label={`Three phases: ${t.immersion}, ${t.transition}, and ${t.genesis}`}>
            <div className="orbit-ring"><span /></div>
            <div className="orbit-center"><Sparkles size={22} /><strong>{lang === 'en' ? 'learning\nvisible' : 'শিক্ষণ\ndৃশ্যমান'}</strong></div>
            {phases.map(p => (
              <div key={p.cls} className={`orbit-node ${p.cls}`}>{p.icon}<span>{p.label}</span></div>
            ))}
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

// ── Topbar ────────────────────────────────────────────────────────────────
function Topbar({ onHome, onRole }: { onHome: () => void; onRole: (r: 'student' | 'admin') => void }) {
  const { lang } = useLang();
  const t = S[lang];
  return (
    <header className="topbar">
      <button className="brand" onClick={onHome} aria-label="Return to home"><span className="brand-mark" /><span className="brand-copy">{t.brand}</span></button>
      <div className="topbar-researcher">
        <span className="topbar-researcher-name">{t.researcherName}</span>
        <span className="micro">{t.researcherShort}</span>
      </div>
      <div className="topbar-actions">
        <LangToggle />
        <button className="icon-button" onClick={() => onRole('admin')} aria-label="Admin dashboard"><LayoutDashboard size={16} /></button>
        <button className="icon-button" onClick={onHome} aria-label="Return home"><X size={16} /></button>
      </div>
    </header>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────
function Sidebar({ view, onView }: { view: StudentView; onView: (v: StudentView) => void }) {
  const { lang } = useLang();
  const t = S[lang];
  const items: [StudentView, string, ReactNode][] = [
    ['subject', t.navSubject, <BookOpen size={16} />],
    ['group',   t.navGroup,   <Users size={16} />],
    ['unit',    t.navUnit,    <FileText size={16} />],
    ['lesson',  t.navLesson,  <ClipboardCheck size={16} />],
  ];
  return (
    <aside className="sidebar">
      <div className="sidebar-intro">
        <span className="micro">{t.sidebarTitle}</span>
        <h2>{t.sidebarSubtitle.split('\n').map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}</h2>
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
        <p>{t.sidebarFooterDetail.split('\n').map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}</p>
      </div>
    </aside>
  );
}

function StudentShell({ onHome, onAdmin, children, view, onView }: { onHome: () => void; onAdmin: () => void; children: ReactNode; view: StudentView; onView: (v: StudentView) => void }) {
  return <div className="shell"><Topbar onHome={onHome} onRole={() => onAdmin()} /><div className="workspace"><Sidebar view={view} onView={onView} /><main className="main-column"><div className="main-inner">{children}</div></main></div></div>;
}

// ── Subject / Group / Unit views ───────────────────────────────────────────
function SubjectView({ onGroup }: { onGroup: (g: 'C' | 'D') => void }) {
  const { lang } = useLang();
  const t = S[lang];
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
  const t = S[lang];
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
  const t = S[lang];
  const phases: [Phase, string][] = [
    ['immersion', t.immersion],
    ['transition', t.transition],
    ['genesis', t.genesis],
  ];
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
          {phases.map(([ph, name], i) => (
            <button className="lesson-row" key={ph} onClick={onLesson} data-testid={`button-open-phase-${ph}`}>
              <span className="lesson-number">0{i + 1}</span>
              <span>
                <h3>{name} {t.phase}</h3>
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
  const go = (v: StudentView) => setView(v);
  useEffect(() => { if (!toast) return; const ti = window.setTimeout(() => setToast(''), 3200); return () => window.clearTimeout(ti); }, [toast]);
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

// ── Admin app ──────────────────────────────────────────────────────────────
function AdminApp({ onHome, onStudent }: { onHome: () => void; onStudent: () => void }) {
  const { lang } = useLang();
  const t = S[lang];
  const curriculumRows = [
    ['01', lang === 'en' ? 'Immersion · planning' : 'নিমজ্জন · পরিকল্পনা',       lang === 'en' ? 'Learners selecting strategies' : 'শিক্ষার্থীরা কৌশল নির্বাচন করছে',   '78%'],
    ['02', lang === 'en' ? 'Transition · supported learning' : 'রূপান্তর · সহায়তায় শিক্ষণ', lang === 'en' ? 'Midpoint monitoring active' : 'মধ্যবিন্দু পর্যবেক্ষণ সক্রিয়',   '50%'],
    ['03', lang === 'en' ? 'Genesis · evaluation' : 'উৎপত্তি · মূল্যায়ন',       lang === 'en' ? 'Reflections submitted' : 'প্রতিফলন জমা দেওয়া হয়েছে',               '64%'],
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
                <div className="curriculum-row" key={n}><span>{n}</span><div><strong>{title}</strong><small>{sub}</small></div><div className="bar"><span style={{ width: p }} /></div></div>
              ))}
            </section>
            <section className="admin-panel surface">
              <div className="panel-title"><h2>{t.pulseTitle}</h2><span>{t.pulseToday}</span></div>
              <div className="learner-list">
                {learners.map(([ini, name, detail, prog]) => (
                  <div className="learner" key={name}><span className="avatar">{ini}</span><div className="learner-info"><strong>{name}</strong><small>{detail}</small></div><span className="learner-progress">{prog}</span></div>
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
  const toggleLang = () => setLang(l => l === 'en' ? 'bn' : 'en');
  const enter = (role: 'student' | 'admin') => setScreen(role);
  return (
    <LangContext.Provider value={{ lang, toggleLang }}>
      {screen === 'landing' && <Landing onEnter={enter} />}
      {screen === 'admin'   && <AdminApp onHome={() => setScreen('landing')} onStudent={() => setScreen('student')} />}
      {screen === 'student' && <StudentApp onHome={() => setScreen('landing')} onAdmin={() => setScreen('admin')} />}
    </LangContext.Provider>
  );
}

export default App;
