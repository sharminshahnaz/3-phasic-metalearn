// ── Real syllabus data: WBCHSE Class XI Education (EDCN), Semester II ──────
// Group C: Psychological Perspective in Education (Units 1 & 2)
// Group D: Historical Development of Indian Education (Unit 1 only)
// Q&A notes transcribed from the uploaded Bengali study-notes PDF.
import { useMemo, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import c1 from './data/unit_c1.json';
import c2 from './data/unit_c2.json';
import d1 from './data/unit_d1.json';

export type QAItem = { marks: number; q: string; a: string };
export type UnitDef = {
  id: 'c1' | 'c2' | 'd1';
  group: 'C' | 'D';
  unitNo: number;
  titleEn: string;
  titleBn: string;
  syllabusEn: string;
  syllabusBn: string;
  questions: QAItem[];
};

export const UNITS: UnitDef[] = [
  {
    id: 'c1', group: 'C', unitNo: 1,
    titleEn: 'Education & Psychology',
    titleBn: 'শিক্ষা ও মনোবিজ্ঞান',
    syllabusEn: 'Meaning & needs of educational psychology · Schools: Behaviourism, Gestalt, Psycho-analysis · Methods of inquiry: observation, experimentation, case study, survey.',
    syllabusBn: 'শিক্ষামনোবিজ্ঞানের অর্থ ও প্রয়োজনীয়তা · সম্প্রদায়: আচরণবাদ, গেস্টাল্ট, মনঃসমীক্ষণ · অনুসন্ধান পদ্ধতি: পর্যবেক্ষণ, পরীক্ষণ, কেস স্টাডি, সমীক্ষা।',
    questions: (c1 as { questions: QAItem[] }).questions,
  },
  {
    id: 'c2', group: 'C', unitNo: 2,
    titleEn: 'Growth & Development',
    titleBn: 'বৃদ্ধি ও বিকাশ',
    syllabusEn: 'Principles of growth & development · Heredity and environment · Stages: infancy, childhood, adolescence · Physical, cognitive, emotional & social dimensions.',
    syllabusBn: 'বৃদ্ধি ও বিকাশের নীতি · বংশগতি ও পরিবেশ · স্তর: শৈশব, বাল্যকাল, বয়ঃসন্ধিকাল · দৈহিক, মানসিক, প্রাক্ষোভিক ও সামাজিক বিকাশ।',
    questions: (c2 as { questions: QAItem[] }).questions,
  },
  {
    id: 'd1', group: 'D', unitNo: 1,
    titleEn: 'Ancient, Medieval & Pre-Independent Indian Education',
    titleBn: 'প্রাচীন, মধ্য ও প্রাক-স্বাধীনতা যুগের শিক্ষা',
    syllabusEn: 'Vedic & Buddhist education · Islamic education · Charter Act 1813, Macaulay Minute, Wood’s Despatch 1854, Hunter Commission 1882, Curzon policy, Sadler Commission 1917, Hartog Committee 1929, Sargent Plan 1944.',
    syllabusBn: 'বৈদিক ও বৌদ্ধ শিক্ষা · ইসলামীয় শিক্ষা · চার্টার অ্যাক্ট ১৮১৩, মেকলে মিনিট, উডের ডেসপ্যাচ ১৮৫৪, হান্টার কমিশন ১৮৮২, কার্জন নীতি, স্যাডলার কমিশন ১৯১৭, হার্টগ কমিটি ১৯২৯, সার্জেন্ট পরিকল্পনা ১৯৪৪।',
    questions: (d1 as { questions: QAItem[] }).questions,
  },
];

export const GROUP_META = {
  C: {
    titleEn: 'Psychological Perspective in Education',
    titleBn: 'শিক্ষায় মনোবৈজ্ঞানিক দৃষ্টিভঙ্গি',
    marks: 20,
    units: UNITS.filter(u => u.group === 'C'),
  },
  D: {
    titleEn: 'Historical Development of Indian Education',
    titleBn: 'ভারতীয় শিক্ষার ঐতিহাসিক বিকাশ',
    marks: 20,
    units: UNITS.filter(u => u.group === 'D'),
  },
} as const;

// ── Q&A study-notes browser ────────────────────────────────────────────────
const QA_STRINGS = {
  en: {
    heading: 'Study notes · questions & answers',
    sub: 'From the Class XI (Semester II) Bengali notes. Tap a question to reveal its answer.',
    short: 'Short questions',
    long: 'Long questions',
    marks: 'marks',
    searchPlaceholder: 'Search questions…',
    empty: 'No questions match your search.',
    count: (n: number) => `${n} questions`,
  },
  bn: {
    heading: 'পাঠ নোট · প্রশ্ন ও উত্তর',
    sub: 'একাদশ শ্রেণি (দ্বিতীয় সেমিস্টার) বাংলা নোট থেকে। উত্তর দেখতে প্রশ্নে ক্লিক করুন।',
    short: 'সংক্ষিপ্ত প্রশ্ন',
    long: 'রচনাধর্মী প্রশ্ন',
    marks: 'নম্বর',
    searchPlaceholder: 'প্রশ্ন খুঁজুন…',
    empty: 'কোনো প্রশ্ন পাওয়া যায়নি।',
    count: (n: number) => `${n}টি প্রশ্ন`,
  },
};

export function QASection({ unit, lang }: { unit: UnitDef; lang: 'en' | 'bn' }) {
  const t = QA_STRINGS[lang];
  const [tab, setTab] = useState<'short' | 'long'>('short');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<number | null>(null);

  const items = useMemo(() => {
    const base = unit.questions.filter(q => (tab === 'short' ? q.marks === 2 : q.marks > 2));
    const needle = query.trim().toLowerCase();
    return needle ? base.filter(q => q.q.toLowerCase().includes(needle)) : base;
  }, [unit, tab, query]);

  const shortCount = unit.questions.filter(q => q.marks === 2).length;
  const longCount = unit.questions.length - shortCount;

  return (
    <section className="qa-section" data-testid={`qa-section-${unit.id}`}>
      <div className="qa-header">
        <div>
          <span className="eyebrow">{t.heading}</span>
          <h2 className="qa-title">{lang === 'bn' ? unit.titleBn : unit.titleEn}</h2>
          <p className="qa-sub">{t.sub}</p>
        </div>
      </div>
      <div className="qa-toolbar">
        <div className="qa-tabs">
          <button className={`qa-tab ${tab === 'short' ? 'active' : ''}`} onClick={() => { setTab('short'); setOpen(null); }} data-testid="tab-qa-short">
            {t.short} · {shortCount}
          </button>
          <button className={`qa-tab ${tab === 'long' ? 'active' : ''}`} onClick={() => { setTab('long'); setOpen(null); }} data-testid="tab-qa-long">
            {t.long} · {longCount}
          </button>
        </div>
        <label className="qa-search">
          <Search size={13} />
          <input
            value={query}
            onChange={e => { setQuery(e.target.value); setOpen(null); }}
            placeholder={t.searchPlaceholder}
            data-testid="input-qa-search"
          />
        </label>
      </div>
      <p className="qa-count micro">{t.count(items.length)}</p>
      <div className="qa-list">
        {items.length === 0 && <p className="qa-empty">{t.empty}</p>}
        {items.map((item, i) => (
          <div className={`qa-item ${open === i ? 'open' : ''}`} key={`${tab}-${i}-${item.q.slice(0, 24)}`}>
            <button className="qa-question" onClick={() => setOpen(open === i ? null : i)} data-testid={`button-qa-${tab}-${i}`}>
              <span className="qa-q-index">{i + 1}</span>
              <span className="qa-q-text">{item.q}</span>
              <span className="qa-q-marks">{item.marks} {t.marks}</span>
              <ChevronDown size={15} className="qa-chevron" />
            </button>
            {open === i && (
              <div className="qa-answer" data-testid={`text-qa-answer-${tab}-${i}`}>
                {item.a.split('\n').map((line, li) => line.trim() && <p key={li}>{line}</p>)}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
