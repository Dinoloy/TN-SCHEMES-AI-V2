"use client";



import { useMemo, useState } from "react";



type Language = "en" | "ta";

type Category = "All" | "Agriculture" | "Education" | "Women & Child" | "Health" | "Employment";

type Scheme = {

  id: string;

  name: string;

  tamilName: string;

  category: Exclude<Category, "All">;

  summary: string;

  tamilSummary: string;

  beneficiaries: string;

  tamilBeneficiaries: string;

  tags: string[];

  source: string;

  sourceLabel: string;

  status: "Needs verification" | "Official source listed";

};



// Demo content only: validate each item against the current official department source before launch.

const schemes: Scheme[] = [

  {

    id: "agri-support", name: "Farmer support & agriculture subsidies", tamilName: "விவசாயிகள் ஆதரவு மற்றும் வேளாண் மானியங்கள்",

    category: "Agriculture", summary: "Explore agriculture programmes, equipment support and cultivation assistance listed in indexed sources.",

    tamilSummary: "கிடைக்கக்கூடிய ஆதாரங்களில் உள்ள வேளாண் திட்டங்கள், கருவி மானியங்கள் மற்றும் சாகுபடி உதவிகளைப் பாருங்கள்.",

    beneficiaries: "Farmers and agricultural groups", tamilBeneficiaries: "விவசாயிகள் மற்றும் வேளாண் குழுக்கள்",

    tags: ["Farmers", "Subsidy", "Agriculture"], source: "https://www.tn.gov.in/", sourceLabel: "Tamil Nadu Government portal", status: "Needs verification",

  },

  {

    id: "student-support", name: "Student scholarships & education aid", tamilName: "மாணவர் உதவித்தொகை மற்றும் கல்வி உதவி",

    category: "Education", summary: "Find education support information and check the current department requirements before applying.",

    tamilSummary: "கல்வி உதவித் தகவல்களை அறிந்து, விண்ணப்பிக்கும் முன் தற்போதைய துறை விதிமுறைகளைச் சரிபார்க்கவும்.",

    beneficiaries: "Students and eligible families", tamilBeneficiaries: "மாணவர்கள் மற்றும் தகுதியுள்ள குடும்பங்கள்",

    tags: ["Students", "Education", "Scholarship"], source: "https://www.tn.gov.in/", sourceLabel: "Tamil Nadu Government portal", status: "Needs verification",

  },

  {

    id: "women-family", name: "Women & family welfare programmes", tamilName: "பெண்கள் மற்றும் குடும்ப நலத் திட்டங்கள்",

    category: "Women & Child", summary: "Browse family welfare and women-focused support; eligibility varies by programme.",

    tamilSummary: "குடும்ப நலம் மற்றும் பெண்களுக்கான உதவிகளைப் பாருங்கள்; தகுதிகள் திட்டத்துக்கு திட்டம் மாறுபடும்.",

    beneficiaries: "Women, parents and families", tamilBeneficiaries: "பெண்கள், பெற்றோர் மற்றும் குடும்பங்கள்",

    tags: ["Women", "Family", "Welfare"], source: "https://www.tn.gov.in/", sourceLabel: "Tamil Nadu Government portal", status: "Needs verification",

  },

  {

    id: "health-access", name: "Public health & medical assistance", tamilName: "பொது சுகாதாரம் மற்றும் மருத்துவ உதவி",

    category: "Health", summary: "Explore public health support and confirm coverage, limits and enrolment with the relevant department.",

    tamilSummary: "சுகாதார உதவிகளைப் பாருங்கள்; காப்பீடு, வரம்புகள் மற்றும் சேர்க்கையை சம்பந்தப்பட்ட துறையிடம் உறுதி செய்யவும்.",

    beneficiaries: "Eligible residents and families", tamilBeneficiaries: "தகுதியுள்ள குடியிருப்பாளர்கள் மற்றும் குடும்பங்கள்",

    tags: ["Health", "Medical", "Family"], source: "https://www.tn.gov.in/", sourceLabel: "Tamil Nadu Government portal", status: "Needs verification",

  },

  {

    id: "livelihood", name: "Employment & livelihood support", tamilName: "வேலைவாய்ப்பு மற்றும் வாழ்வாதார உதவி",

    category: "Employment", summary: "Discover skill, livelihood and employment-related support listed by government departments.",

    tamilSummary: "அரசுத் துறைகள் வழங்கும் திறன், வாழ்வாதாரம் மற்றும் வேலைவாய்ப்பு தொடர்பான உதவிகளை அறியுங்கள்.",

    beneficiaries: "Job seekers, workers and entrepreneurs", tamilBeneficiaries: "வேலை தேடுவோர், தொழிலாளர்கள் மற்றும் தொழில் முனைவோர்",

    tags: ["Skills", "Jobs", "Livelihood"], source: "https://www.tn.gov.in/", sourceLabel: "Tamil Nadu Government portal", status: "Needs verification",

  },

];



const copy = {

  en: {

    eyebrow: "TAMIL NADU · CITIZEN SERVICES", titleA: "The right scheme.", titleB: "A clearer path.",

    sub: "Explore public welfare programmes, understand what to check, and follow the source before you apply.",

    search: "Search by scheme, benefit or who you are…", explore: "Explore by category", all: "All schemes",

    categories: ["All", "Agriculture", "Education", "Women & Child", "Health", "Employment"] as Category[],

    featured: "Browse schemes", featuredSub: "Start with a topic, then check eligibility and official details.",

    people: "Who is it for?", anyone: "Everyone", farmer: "Farmer", student: "Student", women: "Woman / family", worker: "Worker / job seeker",

    allPeople: "All beneficiaries", source: "Source to verify", note: "Verification matters", noteText: "Scheme availability, benefits and deadlines can change. Demo catalogue entries are not eligibility decisions; verify each scheme with its department.",

    open: "View details", official: "Open government portal ↗", status: "Verification needed", ask: "Ask the AI assistant", askSub: "Have a specific question? Ask it with the indexed sources and citations.",

    question: "Ask about eligibility, documents, benefits…", send: "Ask", footer: "Built for accessible public information · Tamil & English", result: "matching schemes", none: "No matches yet. Try a different search or category.",

  },

  ta: {

    eyebrow: "தமிழ்நாடு · குடிமக்கள் சேவைகள்", titleA: "சரியான திட்டம்.", titleB: "தெளிவான வழி.",

    sub: "அரசு நலத் திட்டங்களைப் பாருங்கள், தகுதி விவரங்களைப் புரிந்துகொள்ளுங்கள், விண்ணப்பிக்கும் முன் அதிகாரப்பூர்வ ஆதாரத்தைச் சரிபார்க்கவும்.",

    search: "திட்டம், நன்மை அல்லது பயனாளரைத் தேடுங்கள்…", explore: "வகைப்படி தேடுங்கள்", all: "அனைத்து திட்டங்கள்",

    categories: ["All", "Agriculture", "Education", "Women & Child", "Health", "Employment"] as Category[],

    featured: "திட்டங்களைப் பாருங்கள்", featuredSub: "ஒரு வகையைத் தேர்ந்தெடுத்து, தகுதி மற்றும் அதிகாரப்பூர்வ விவரங்களைச் சரிபார்க்கவும்.",

    people: "யாருக்கானது?", anyone: "அனைவரும்", farmer: "விவசாயி", student: "மாணவர்", women: "பெண் / குடும்பம்", worker: "தொழிலாளர் / வேலை தேடுபவர்",

    allPeople: "அனைத்து பயனாளர்கள்", source: "சரிபார்க்க வேண்டிய ஆதாரம்", note: "சரிபார்ப்பு அவசியம்", noteText: "திட்டங்கள், நன்மைகள் மற்றும் கடைசித் தேதிகள் மாறலாம். இங்கு உள்ள மாதிரி பட்டியல் தகுதி உறுதிப்படுத்தல் அல்ல; சம்பந்தப்பட்ட துறையில் சரிபார்க்கவும்.",

    open: "விவரங்களைப் பார்க்க", official: "அரசு இணையதளத்தைத் திறக்க ↗", status: "சரிபார்ப்பு தேவை", ask: "AI உதவியாளரிடம் கேளுங்கள்", askSub: "குறிப்பிட்ட கேள்வி உள்ளதா? ஆதாரங்கள் மற்றும் மேற்கோள்களுடன் கேளுங்கள்.",

    question: "தகுதி, ஆவணங்கள், நன்மைகள் பற்றி கேளுங்கள்…", send: "கேள்", footer: "அனைவருக்கும் அணுகக்கூடிய அரசு தகவல் · தமிழ் & ஆங்கிலம்", result: "பொருந்தும் திட்டங்கள்", none: "பொருத்தமானவை கிடைக்கவில்லை. வேறு தேடல் அல்லது வகையை முயற்சிக்கவும்.",

  },

};

const categoryIcons: Record<Exclude<Category, "All">, string> = { Agriculture: "✳", Education: "▤", "Women & Child": "♡", Health: "+", Employment: "↗" };



export default function Home() {

  const [lang, setLang] = useState<Language>("en");

  const [query, setQuery] = useState("");

  const [category, setCategory] = useState<Category>("All");

  const [person, setPerson] = useState("All");

  const [active, setActive] = useState<Scheme | null>(null);

  const [question, setQuestion] = useState("");

  const [answer, setAnswer] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const t = copy[lang];



  const filtered = useMemo(() => schemes.filter((scheme) => {

    const text = `${scheme.name} ${scheme.tamilName} ${scheme.summary} ${scheme.tamilSummary} ${scheme.tags.join(" ")}`.toLowerCase();

    const matchesQuery = !query.trim() || text.includes(query.trim().toLowerCase());

    const matchesCategory = category === "All" || scheme.category === category;

    const target: Record<string, string[]> = {

      All: [], Farmer: ["agriculture", "farmers"], Student: ["student", "education"],

      "Woman / family": ["women", "family"], "Worker / job seeker": ["employment", "livelihood", "jobs"],

    };

    const terms = target[person] ?? [];

    const matchesPerson = !terms.length || terms.some((term) => text.includes(term));

    return matchesQuery && matchesCategory && matchesPerson;

  }), [query, category, person]);



  async function askAI(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const clean = question.trim();
    if (!clean || loading) return;

    setLoading(true);
    setError("");
    setAnswer("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: clean, language: lang }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "The assistant could not answer that right now."
        );
      }

      setAnswer(
        typeof data.answer === "string" && data.answer.trim()
          ? data.answer
          : lang === "ta"
            ? "தற்போது பதில் கிடைக்கவில்லை. பின்னர் மீண்டும் முயற்சிக்கவும்."
            : "No answer was returned. Please try again."
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : lang === "ta"
            ? "AI உதவியாளருடன் இணைக்க முடியவில்லை."
            : "Unable to connect to the assistant."
      );
    } finally {
      setLoading(false);
    }
  }

  return <main className="site-shell">

    <header className="nav-bar">

      <a className="brand" href="#top" aria-label="TN Scheme Guide home"><span className="brand-symbol">TN</span><span><b>Scheme<span>Setu</span></b><small>தமிழ்நாடு அரசுத் திட்ட வழிகாட்டி</small></span></a>

      <nav className="desktop-nav"><a href="#schemes">{lang === "ta" ? "திட்டங்களை ஆராயுங்கள்" : "Explore schemes"}</a><a href="#assistant">{lang === "ta" ? "AI உதவியாளர்" : "AI assistant"}</a><a href="#trust">{lang === "ta" ? "எங்களைப் பற்றி" : "How it works"}</a></nav>

      <div className="nav-actions"><span className="live-pill"><i /> {lang === "ta" ? "ஆதார அடிப்படை" : "Source-led"}</span><div className="lang-toggle" aria-label="Language"><button className={lang === "en" ? "selected" : ""} onClick={() => setLang("en")}>EN</button><button className={lang === "ta" ? "selected" : ""} onClick={() => setLang("ta")}>தமிழ்</button></div></div>

    </header>



    <section id="top" className="hero">

      <div className="hero-content"><div className="eyebrow"><span className="eyebrow-line" />{t.eyebrow}</div><h1>{t.titleA}<br /><em>{t.titleB}</em></h1><p className="hero-copy">{t.sub}</p>

        <div className="hero-search"><span>⌕</span><input aria-label={t.search} placeholder={t.search} value={query} onChange={(e) => { setQuery(e.target.value); document.getElementById("schemes")?.scrollIntoView({ behavior: "smooth", block: "start" }); }} /><kbd>SEARCH</kbd></div>

        <div className="hero-meta"><span><b>01</b> {lang === "ta" ? "தேடுங்கள்" : "Discover"}</span><span className="meta-divider" /><span><b>02</b> {lang === "ta" ? "சரிபாருங்கள்" : "Check"}</span><span className="meta-divider" /><span><b>03</b> {lang === "ta" ? "விண்ணப்பியுங்கள்" : "Apply"}</span></div>

      </div>

      <div className="hero-art" aria-hidden="true"><div className="sun-disc" /><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="monument"><div className="dome" /><div className="tower"><i /><i /><i /></div><div className="base" /></div><div className="floating-note"><span className="check-seal">✓</span><span><b>{lang === "ta" ? "தெளிவான தகவல்" : "Clear information"}</b><small>{lang === "ta" ? "ஆதாரத்துடன்" : "With source references"}</small></span></div><div className="art-caption">PEOPLE · PROGRAMMES · PROGRESS</div></div>

      <div className="hero-bottom-mark"><span>தமிழ்நாடு</span><span>11° 07′ N · 78° 39′ E</span></div>

    </section>



    <section className="trust-strip" id="trust"><div><span className="strip-icon">⌕</span><span><b>{lang === "ta" ? "தேட எளிது" : "Easy to explore"}</b><small>{lang === "ta" ? "ஒரே இடத்தில் வகைகள்" : "Topics in one place"}</small></span></div><div><span className="strip-icon">◈</span><span><b>{lang === "ta" ? "ஆதாரங்களைப் பாருங்கள்" : "Check the source"}</b><small>{lang === "ta" ? "அதிகாரப்பூர்வ உறுதிப்படுத்தல்" : "Official confirmation matters"}</small></span></div><div><span className="strip-icon">文</span><span><b>{lang === "ta" ? "இருமொழி அணுகல்" : "Bilingual access"}</b><small>{lang === "ta" ? "தமிழ் மற்றும் ஆங்கிலம்" : "Tamil and English"}</small></span></div></section>



    <section className="schemes-section" id="schemes"><div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line" />{lang === "ta" ? "உதவி எங்கே தொடங்குகிறது" : "A GOOD PLACE TO START"}</div><h2>{t.featured}</h2><p>{t.featuredSub}</p></div><span className="results-count">{filtered.length.toString().padStart(2, "0")} <small>{t.result}</small></span></div>

      <div className="explore-layout"><aside className="filters"><h3>{t.explore}</h3><p>{t.people}</p><div className="person-options">{[{label:t.anyone,value:"All",icon:"◉"},{label:t.farmer,value:"Farmer",icon:"✳"},{label:t.student,value:"Student",icon:"▤"},{label:t.women,value:"Woman / family",icon:"♡"},{label:t.worker,value:"Worker / job seeker",icon:"↗"}].map((item)=><button key={item.value} className={person===item.value?"person-active":""} onClick={()=>setPerson(item.value)}><span>{item.icon}</span>{item.label}{person===item.value&&<i>✓</i>}</button>)}</div><div className="filter-divider"/><p>{lang === "ta" ? "திட்ட வகை" : "CATEGORY"}</p><div className="category-options">{t.categories.map((item)=> <button key={item} className={category===item?"category-active":""} onClick={()=>setCategory(item)}>{item==="All"?t.all:lang==="ta"?({Agriculture:"வேளாண்மை",Education:"கல்வி","Women & Child":"பெண்கள் & குழந்தைகள்",Health:"சுகாதாரம்",Employment:"வேலைவாய்ப்பு"} as Record<string,string>)[item]:item}<span>{item==="All"?schemes.length:schemes.filter((s)=>s.category===item).length}</span></button>)}</div><div className="mini-warning"><b>ⓘ {t.note}</b><p>{t.noteText}</p></div></aside>

      <div className="scheme-grid">{filtered.length===0?<div className="empty-state">{t.none}</div>:filtered.map((scheme,index)=><article className={`scheme-card ${index===0?"scheme-card-featured":""}`} key={scheme.id}><div className="scheme-card-top"><span className={`scheme-icon icon-${scheme.category.toLowerCase().replace(/[^a-z]+/g,"-")}`}>{categoryIcons[scheme.category]}</span><span className="scheme-status"><i />{t.status}</span></div><div className="scheme-category">{lang==="ta"?({Agriculture:"வேளாண்மை",Education:"கல்வி","Women & Child":"பெண்கள் & குழந்தைகள்",Health:"சுகாதாரம்",Employment:"வேலைவாய்ப்பு"} as Record<string,string>)[scheme.category]:scheme.category}</div><h3>{lang === "ta" ? scheme.tamilName : scheme.name}</h3><p className="scheme-description">{lang === "ta" ? scheme.tamilSummary : scheme.summary}</p><div className="scheme-card-bottom"><span className="beneficiary-label">{lang === "ta" ? scheme.tamilBeneficiaries : scheme.beneficiaries}</span><button className="detail-link" onClick={()=>setActive(scheme)}>{t.open} <span>↗</span></button></div></article>)}</div></div>

    </section>



    <section className="assistant-section" id="assistant"><div className="assistant-ornament" aria-hidden="true"><div className="assistant-sun" /><div className="assistant-lines" /></div><div className="assistant-copy"><div className="eyebrow"><span className="eyebrow-line" />{lang === "ta" ? "உங்கள் கேள்விக்கு உதவி" : "NEED A MORE SPECIFIC ANSWER?"}</div><h2>{t.ask}</h2><p>{t.askSub}</p><div className="assistant-pills"><span>{lang === "ta" ? "தகுதி" : "Eligibility"}</span><span>{lang === "ta" ? "ஆவணங்கள்" : "Documents"}</span><span>{lang === "ta" ? "மானியங்கள்" : "Benefits"}</span></div></div><div className="assistant-form-wrap"><form className="assistant-form" onSubmit={askAI}><textarea rows={3} maxLength={800} value={question} onChange={(e)=>setQuestion(e.target.value)} placeholder={t.question} aria-label={t.question}/><div><small>{question.length}/800</small><button type="submit" disabled={!question.trim()||loading}>{loading?(lang==="ta"?"சரிபார்க்கிறது…":"Checking…"):t.send} <span>↗</span></button></div></form>{error&&<p className="api-error" role="alert">{error}</p>}{answer&&<div className="assistant-answer"><b>{lang === "ta" ? "பதில்" : "Answer"}</b><p>{answer}</p><small>{lang === "ta" ? "முக்கிய விவரங்களை அதிகாரப்பூர்வ துறையில் உறுதிப்படுத்தவும்." : "Confirm important details with the relevant official department."}</small></div>}</div></section>



    <footer className="footer"><a className="brand footer-brand" href="#top"><span className="brand-symbol">TN</span><span><b>Scheme<span>Setu</span></b><small>தமிழ்நாடு அரசுத் திட்ட வழிகாட்டி</small></span></a><p>{t.footer}<br /><small>{lang === "ta" ? "இது ஒரு தகவல் வழிகாட்டி; அரசின் அதிகாரப்பூர்வ இணையதளம் அல்ல." : "An information guide; not an official government website."}</small></p><a className="footer-up" href="#top">↑</a></footer>



    {active&&<div className="modal-backdrop" role="presentation" onMouseDown={(e)=>{if(e.target===e.currentTarget)setActive(null)}}><section className="scheme-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button className="modal-close" onClick={()=>setActive(null)} aria-label="Close details">×</button><div className="eyebrow"><span className="eyebrow-line" />{t.source}</div><span className="modal-category">{active.category}</span><h2 id="modal-title">{lang === "ta" ? active.tamilName : active.name}</h2><p>{lang === "ta" ? active.tamilSummary : active.summary}</p><div className="modal-status"><i />{t.status}<small>{active.status}</small></div><div className="modal-source"><span>↗</span><span><b>{active.sourceLabel}</b><small>{active.source}</small></span></div><a className="official-link" href={active.source} target="_blank" rel="noreferrer">{t.official}</a><p className="modal-disclaimer">{t.noteText}</p></section></div>}

  </main>;

}
