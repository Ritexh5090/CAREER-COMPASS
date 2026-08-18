import { useState, useRef, useEffect } from "react";
import {
  Compass, ChevronLeft, Download, RotateCcw,
  Copy, Check, Globe, Cpu, HeartPulse, TrendingUp, BookOpen, FlaskConical
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* DATA                                                                */
/* ------------------------------------------------------------------ */

const ORDER = ["engineering", "medical", "commerce", "arts", "science"];

const ICONS = {
  engineering: Cpu,
  medical: HeartPulse,
  commerce: TrendingUp,
  arts: BookOpen,
  science: FlaskConical,
};

const STREAMS = {
  engineering: {
    color: "#5EC8D8",
    en: { name: "Engineering", tagline: "The Builder", exam: "JEE Main / Advanced, BITSAT, state CETs", timeline: "11th–12th (PCM) \u2192 ~2 yrs entrance prep \u2192 4-yr B.Tech", cost: "~\u20B92L\u20136L (govt) to \u20B910L+ (private)" },
    hi: { name: "इंजीनियरिंग", tagline: "निर्माता", exam: "JEE Main/Advanced, BITSAT, राज्य CET", timeline: "11वीं–12वीं (PCM) \u2192 ~2 साल तैयारी \u2192 4 साल B.Tech", cost: "लगभग ₹2–6 लाख (सरकारी) से ₹10 लाख+ (निजी)" },
  },
  medical: {
    color: "#FF6B6B",
    en: { name: "Medical", tagline: "The Healer", exam: "NEET UG", timeline: "11th–12th (PCB) \u2192 NEET prep (often 1\u20133 attempts) \u2192 5.5-yr MBBS", cost: "Govt college low-cost; private \u20B950L\u20131Cr+" },
    hi: { name: "मेडिकल", tagline: "उपचारक", exam: "NEET UG", timeline: "11वीं–12वीं (PCB) \u2192 NEET तैयारी (अक्सर 1–3 प्रयास) \u2192 5.5 साल MBBS", cost: "सरकारी सस्ता; निजी ₹50 लाख–1 करोड़+" },
  },
  commerce: {
    color: "#E8934A",
    en: { name: "Commerce", tagline: "The Strategist", exam: "CA Foundation, CUET", timeline: "11th–12th (Commerce) \u2192 B.Com/BBA \u2192 CA/CS/CFA or MBA", cost: "Generally affordable; CA/CFA add exam fees over time" },
    hi: { name: "कॉमर्स", tagline: "रणनीतिकार", exam: "CA Foundation, CUET", timeline: "11वीं–12वीं (कॉमर्स) \u2192 B.Com/BBA \u2192 CA/CS/CFA या MBA", cost: "आमतौर पर किफ़ायती; CA/CFA में शुल्क जुड़ता है" },
  },
  arts: {
    color: "#B98CE0",
    en: { name: "Arts & Humanities", tagline: "The Storyteller", exam: "CUET, CLAT (law), design/journalism entrances", timeline: "11th–12th (Arts) \u2192 BA in chosen subject \u2192 Law / UPSC / Journalism / Design", cost: "Generally affordable at govt colleges" },
    hi: { name: "आर्ट्स / मानविकी", tagline: "कहानीकार", exam: "CUET, CLAT (लॉ), डिज़ाइन/पत्रकारिता परीक्षाएँ", timeline: "11वीं–12वीं (आर्ट्स) \u2192 BA \u2192 लॉ/UPSC/पत्रकारिता/डिज़ाइन", cost: "सरकारी कॉलेजों में आमतौर पर किफ़ायती" },
  },
  science: {
    color: "#6FCF97",
    en: { name: "Pure Science", tagline: "The Explorer", exam: "IISER Aptitude Test, NEST, CUET", timeline: "11th–12th (PCM/PCB) \u2192 BSc \u2192 MSc / Research", cost: "Generally affordable; research often fellowship-funded" },
    hi: { name: "प्योर साइंस", tagline: "खोजकर्ता", exam: "IISER Aptitude Test, NEST, CUET", timeline: "11वीं–12वीं (PCM/PCB) \u2192 BSc \u2192 MSc/रिसर्च", cost: "आमतौर पर किफ़ायती; अक्सर फेलोशिप मिलती है" },
  },
};

const QUESTIONS = [
  {
    en: "Pick a problem you'd enjoy figuring out",
    hi: "वह समस्या चुनें जिसे सुलझाने में आपको मज़ा आएगा",
    options: [
      { stream: "engineering", en: "Why does this app keep crashing?", hi: "यह ऐप बार-बार क्रैश क्यों हो रहा है?" },
      { stream: "arts", en: "Why did this ancient society collapse?", hi: "यह प्राचीन सभ्यता क्यों खत्म हो गई?" },
      { stream: "medical", en: "Why does this patient still have a fever?", hi: "इस मरीज़ को अब भी बुखार क्यों है?" },
      { stream: "science", en: "Why does this chemical reaction happen?", hi: "यह रासायनिक अभिक्रिया क्यों होती है?" },
      { stream: "commerce", en: "Why did this business lose money this quarter?", hi: "इस तिमाही में इस बिज़नेस को घाटा क्यों हुआ?" },
    ],
  },
  {
    en: "Pick your ideal Saturday",
    hi: "अपना पसंदीदा शनिवार चुनें",
    options: [
      { stream: "commerce", en: "Running a small stall or side-hustle idea", hi: "छोटी दुकान या साइड बिज़नेस चलाना" },
      { stream: "medical", en: "Volunteering at a health camp", hi: "स्वास्थ्य शिविर में स्वयंसेवा करना" },
      { stream: "science", en: "Doing a random experiment or stargazing", hi: "कोई प्रयोग करना या तारे देखना" },
      { stream: "engineering", en: "Building or fixing something with your hands/code", hi: "हाथों से या कोड से कुछ बनाना या ठीक करना" },
      { stream: "arts", en: "Writing, sketching, or debating ideas", hi: "लिखना, स्केच बनाना या बहस करना" },
    ],
  },
  {
    en: "Pick a subject you never got bored of",
    hi: "वह विषय चुनें जिससे आप कभी बोर नहीं हुए",
    options: [
      { stream: "science", en: "Chemistry theory", hi: "रसायन विज्ञान का सिद्धांत" },
      { stream: "arts", en: "History, Political Science, or Languages", hi: "इतिहास, राजनीति विज्ञान या भाषाएँ" },
      { stream: "engineering", en: "Maths numericals / physics problems", hi: "गणित के सवाल / भौतिकी की समस्याएँ" },
      { stream: "commerce", en: "Economics or Accounts", hi: "अर्थशास्त्र या अकाउंट्स" },
      { stream: "medical", en: "Biology", hi: "जीव विज्ञान (बायोलॉजी)" },
    ],
  },
  {
    en: "How do you handle a long, uncertain grind?",
    hi: "एक लंबी और अनिश्चित मेहनत को आप कैसे संभालते हैं?",
    options: [
      { stream: "medical", en: "I don't mind years of study if the goal is worth it", hi: "अगर लक्ष्य सही है तो सालों की पढ़ाई से दिक्कत नहीं" },
      { stream: "commerce", en: "I want results faster, not years of waiting", hi: "मुझे तेज़ नतीजे चाहिए, सालों का इंतज़ार नहीं" },
      { stream: "arts", en: "I'm fine with an unconventional, less structured path", hi: "मुझे एक अलग, कम बंधा हुआ रास्ता भी ठीक लगता है" },
      { stream: "science", en: "I enjoy the process itself, not just the result", hi: "मुझे नतीजे से ज़्यादा प्रक्रिया में मज़ा आता है" },
      { stream: "engineering", en: "I like clear milestones — I'll push through step by step", hi: "मुझे स्पष्ट पड़ाव पसंद हैं — कदम दर कदम आगे बढ़ूँगा/बढ़ूँगी" },
    ],
  },
  {
    en: "Pick how you'd want to spend your career",
    hi: "अपना करियर आप कैसे बिताना चाहेंगे?",
    options: [
      { stream: "arts", en: "Shaping culture, ideas, justice, or communication", hi: "संस्कृति, विचारों, न्याय या संचार को आकार देना" },
      { stream: "science", en: "Discovering something nobody knew before", hi: "कुछ ऐसा खोजना जो पहले किसी को नहीं पता था" },
      { stream: "commerce", en: "Building wealth, businesses, or managing money", hi: "पैसा, बिज़नेस या फाइनेंस को संभालना और बढ़ाना" },
      { stream: "engineering", en: "Creating or designing things people use every day", hi: "ऐसी चीज़ें बनाना जो लोग रोज़ इस्तेमाल करें" },
      { stream: "medical", en: "Directly improving or saving people's lives", hi: "सीधे लोगों की ज़िंदगी बेहतर बनाना या बचाना" },
    ],
  },
  {
    en: "Pick your risk comfort",
    hi: "अपना रिस्क लेवल चुनें",
    options: [
      { stream: "science", en: "Comfortable with slow, research-based rewards", hi: "धीमे, रिसर्च-आधारित नतीजों से सहज" },
      { stream: "engineering", en: "Balanced — decent stability, decent challenge", hi: "संतुलित — थोड़ी स्थिरता, थोड़ी चुनौती" },
      { stream: "arts", en: "Comfortable with an uncertain path if I'm passionate", hi: "अगर जुनून है तो अनिश्चित रास्ते से भी सहज" },
      { stream: "medical", en: "High effort now for high respect & stability later", hi: "अभी मेहनत ज़्यादा, बाद में सम्मान और स्थिरता ज़्यादा" },
      { stream: "commerce", en: "Taking financial risk for a bigger reward", hi: "बड़े फ़ायदे के लिए फाइनेंशियल रिस्क लेने में सहज" },
    ],
  },
];

const LOADING_PHRASES = {
  en: ["Reading your answers...", "Cross-checking the pattern...", "Drawing your path...", "Almost there..."],
  hi: ["आपके जवाब पढ़े जा रहे हैं...", "पैटर्न जांचा जा रहा है...", "आपका रास्ता बनाया जा रहा है...", "बस थोड़ी देर..."],
};

const T = {
  en: {
    title: "CAREER COMPASS",
    heroTitle: "Discover the Career That Fits You",
    subtitle: "6 questions. One honest direction.",
    durLabel: "DURATION", durVal: "~90 SEC",
    costLabel: "COST", costVal: "FREE",
    start: "Start the Quiz",
    qLabel: (n) => `Question ${n} of 6`,
    back: "Back",
    resultTag: "RESULT UNLOCKED",
    tabTop: "Your Top Match",
    tabSecond: "Also Strong",
    whyHeader: "Why this fits you",
    pathHeader: "Path ahead",
    examLabel: "Entrance exam(s)",
    timelineLabel: "Typical timeline",
    costLabel2: "Rough cost",
    reflectLabel: "One thing to sit with",
    disclaimer: "This is a starting point based on your answers — talk it through with a teacher, parent, or counselor too.",
    download: "Download result card",
    retake: "Retake quiz",
    copy: "Copy summary",
    copied: "Copied!",
    loadingTitle: "Calculating your path",
  },
  hi: {
    title: "CAREER COMPASS",
    heroTitle: "अपने लिए सही करियर खोजें",
    subtitle: "6 सवाल। एक ईमानदार दिशा।",
    durLabel: "समय", durVal: "~90 सेकंड",
    costLabel: "शुल्क", costVal: "मुफ़्त",
    start: "क्विज़ शुरू करें",
    qLabel: (n) => `सवाल ${n} / 6`,
    back: "पीछे",
    resultTag: "रिज़ल्ट अनलॉक",
    tabTop: "आपका टॉप मैच",
    tabSecond: "यह भी मज़बूत विकल्प",
    whyHeader: "यह आपके लिए सही क्यों है",
    pathHeader: "आगे का रास्ता",
    examLabel: "प्रवेश परीक्षा",
    timelineLabel: "सामान्य समयरेखा",
    costLabel2: "अनुमानित खर्च",
    reflectLabel: "एक बात सोचने लायक",
    disclaimer: "यह आपके जवाबों पर आधारित एक शुरुआती दिशा है — किसी शिक्षक, माता-पिता या काउंसलर से भी ज़रूर बात करें।",
    download: "रिज़ल्ट कार्ड डाउनलोड करें",
    retake: "फिर से क्विज़ लें",
    copy: "सारांश कॉपी करें",
    copied: "कॉपी हो गया!",
    loadingTitle: "आपका रास्ता तैयार हो रहा है",
  },
};

/* ------------------------------------------------------------------ */
/* HELPERS                                                             */
/* ------------------------------------------------------------------ */

function computeScores(answers) {
  const counts = {};
  ORDER.forEach((s) => (counts[s] = 0));
  answers.forEach((s) => { if (s) counts[s] += 1; });
  const sorted = [...ORDER].sort((a, b) => counts[b] - counts[a]);
  return { top: sorted[0], second: sorted[1], counts };
}

function buildPrompt(lang, topId, secondId, answers) {
  const langLine = lang === "hi" ? "Hindi, using Devanagari script" : "English";
  const lines = answers.map((streamId, i) => {
    const q = QUESTIONS[i];
    const opt = q.options.find((o) => o.stream === streamId);
    return `${i + 1}. Question: "${q.en}" — They picked: "${opt.en}" (leans toward ${STREAMS[streamId].en.name}).`;
  }).join("\n");
  const topName = STREAMS[topId].en.name;
  const secondName = STREAMS[secondId].en.name;
  return `You are a warm, honest career-guidance voice talking directly to a 15-17 year old Indian student who just finished Class 10 and is choosing a stream for Class 11 (Engineering, Medical, Commerce, Arts & Humanities, or Pure Science).

Here is exactly what they picked in a 6-question quiz:
${lines}

Based on scoring, their top match is "${topName}" and their strong second option is "${secondName}".

Return ONLY a raw JSON object (no markdown, no code fences, no text outside the JSON) written in ${langLine}, with exactly these three keys:
{
  "whyTop": "2-3 warm, specific sentences on why ${topName} fits them — reference at least one real pattern from their picks above, not generic praise.",
  "whySecond": "1-2 sentences on why ${secondName} is also genuinely strong for them, and how its day-to-day flavor differs from ${topName}.",
  "reflection": "one short, open-ended question (not yes/no) that helps them reflect further before deciding."
}`;
}

function fallbackResult(lang, topId, secondId) {
  const topName = STREAMS[topId][lang].name;
  const secondName = STREAMS[secondId][lang].name;
  if (lang === "hi") {
    return {
      whyTop: `आपके जवाबों में एक साफ पैटर्न ${topName} की तरफ इशारा करता है — यह आपके सोचने और काम करने के तरीके से मेल खाता है।`,
      whySecond: `${secondName} भी आपके लिए एक मज़बूत विकल्प है, बस थोड़े अलग नज़रिए से।`,
      reflection: "अगले 5 सालों में आप किस तरह का दिन जीना चाहेंगे — वो सोचकर देखें।",
    };
  }
  return {
    whyTop: `Your picks show a clear pattern pointing toward ${topName} — it lines up with how you think and what kind of problems you enjoy.`,
    whySecond: `${secondName} is also a genuinely strong fit for you, just with a slightly different flavor of day-to-day work.`,
    reflection: "What kind of day do you actually want to be living five years from now?",
  };
}

function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  const lines = [];
  words.forEach((w) => {
    const test = line + w + " ";
    if (ctx.measureText(test).width > maxWidth && line !== "") {
      lines.push(line);
      line = w + " ";
    } else {
      line = test;
    }
  });
  lines.push(line);
  const startY = y - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((l, i) => ctx.fillText(l.trim(), x, startY + i * lineHeight));
}

/* ------------------------------------------------------------------ */
/* COMPONENT                                                           */
/* ------------------------------------------------------------------ */

export default function CareerCompass() {
  const [lang, setLang] = useState("en");
  const [screen, setScreen] = useState("landing"); // landing | quiz | loading | result
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(null));
  const [transitioning, setTransitioning] = useState(false);
  const [topId, setTopId] = useState(null);
  const [secondId, setSecondId] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [activeTab, setActiveTab] = useState("top");
  const [copied, setCopied] = useState(false);
  const [phraseIdx, setPhraseIdx] = useState(0);
  const canvasRef = useRef(null);
  const t = T[lang];

  useEffect(() => {
    if (screen !== "loading") return;
    const id = setInterval(() => {
      setPhraseIdx((p) => (p + 1) % LOADING_PHRASES[lang].length);
    }, 1400);
    return () => clearInterval(id);
  }, [screen, lang]);

  const toggleLang = () => setLang((l) => (l === "en" ? "hi" : "en"));

  const selectOption = (streamId) => {
    if (transitioning) return;
    setTransitioning(true);
    const next = [...answers];
    next[currentQ] = streamId;
    setAnswers(next);
    setTimeout(() => {
      if (currentQ < QUESTIONS.length - 1) {
        setCurrentQ((q) => q + 1);
        setTransitioning(false);
      } else {
        finishQuiz(next);
      }
    }, 360);
  };

  const goBack = () => {
    if (currentQ === 0 || transitioning) return;
    setCurrentQ((q) => q - 1);
  };

  async function fetchAIResult(finalAnswers, top, second) {
    let result = null;
    try {
      const prompt = buildPrompt(lang, top, second, finalAnswers);
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await response.json();
      const text = (data.content || []).map((b) => b.text || "").join("");
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      if (parsed.whyTop && parsed.whySecond && parsed.reflection) result = parsed;
    } catch {
      result = null;
    }
    if (!result) result = fallbackResult(lang, top, second);
    setAiResult(result);
    setActiveTab("top");
    setScreen("result");
  }

  const finishQuiz = (finalAnswers) => {
    const { top, second } = computeScores(finalAnswers);
    setTopId(top);
    setSecondId(second);
    setScreen("loading");
    setTransitioning(false);
    fetchAIResult(finalAnswers, top, second);
  };

  const retake = () => {
    setAnswers(Array(QUESTIONS.length).fill(null));
    setCurrentQ(0);
    setAiResult(null);
    setTopId(null);
    setSecondId(null);
    setScreen("landing");
  };

  const handleDownload = async () => {
    const id = activeTab === "top" ? topId : secondId;
    const stream = STREAMS[id][lang];
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (document.fonts?.ready) await document.fonts.ready;
    const ctx = canvas.getContext("2d");
    const W = 1080, H = 1350;
    canvas.width = W; canvas.height = H;
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, "#1B1F2A");
    grad.addColorStop(1, "#12151D");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
    ctx.beginPath();
    ctx.arc(W / 2, 470, 220, 0, Math.PI * 2);
    ctx.strokeStyle = STREAMS[id].color;
    ctx.lineWidth = 14;
    ctx.stroke();
    ctx.textAlign = "center";
    ctx.fillStyle = STREAMS[id].color;
    ctx.font = "600 32px 'Space Mono', monospace";
    ctx.fillText(t.resultTag, W / 2, 250);
    ctx.fillStyle = "#EDEAE0";
    ctx.font = "700 84px 'Space Grotesk', sans-serif";
    wrapCanvasText(ctx, stream.name, W / 2, 490, 880, 96);
    ctx.fillStyle = "#9BA1B0";
    ctx.font = "italic 38px 'Kalam', cursive";
    ctx.fillText(stream.tagline, W / 2, 650);
    ctx.fillStyle = "#5B6172";
    ctx.font = "26px 'Space Mono', monospace";
    ctx.fillText("CAREER COMPASS", W / 2, H - 90);
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "career-compass-result.png";
    a.click();
  };

  const handleCopy = async () => {
    const id = activeTab === "top" ? topId : secondId;
    const stream = STREAMS[id][lang];
    const why = activeTab === "top" ? aiResult?.whyTop : aiResult?.whySecond;
    const text = `${t.resultTag}: ${stream.name} (${stream.tagline})\n\n${why || ""}\n\n— Career Compass`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const progressCount = answers.filter(Boolean).length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&family=Kalam:wght@400;700&family=Space+Mono:wght@400;700&display=swap');

        .cc-root {
          min-height: 100%;
          width: 100%;
          background: #1B1F2A;
          background-image:
            radial-gradient(circle at 20% 15%, rgba(240,200,90,0.05), transparent 40%),
            radial-gradient(circle at 80% 85%, rgba(94,200,216,0.05), transparent 40%);
          display: flex;
          justify-content: center;
          padding: 28px 14px;
          font-family: 'Inter', system-ui, sans-serif;
          box-sizing: border-box;
        }
        .cc-root * { box-sizing: border-box; }
        .cc-frame {
          width: 100%;
          max-width: 430px;
          background: #242A3A;
          border: 1px solid #343B4E;
          border-radius: 20px;
          padding: 24px 20px 22px;
          position: relative;
          box-shadow: 0 20px 60px rgba(0,0,0,0.35);
        }
        .cc-lang-toggle {
          position: absolute;
          top: 16px;
          right: 16px;
          display: flex;
          align-items: center;
          gap: 5px;
          background: #1B1F2A;
          border: 1px solid #3A4157;
          color: #C9CDD8;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.04em;
          padding: 6px 10px;
          border-radius: 999px;
          cursor: pointer;
        }
        .cc-lang-toggle:hover { border-color: #F0C85A; color: #F0C85A; }
        .cc-lang-toggle:focus-visible, .cc-btn:focus-visible, .cc-opt:focus-visible { outline: 2px solid #F0C85A; outline-offset: 2px; }

        /* ---- Landing ---- */
        .cc-land { text-align: center; padding-top: 64px; }
        .cc-compass-static { color: #F0C85A; margin-bottom: 14px; }
        .cc-title {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 30px;
          letter-spacing: 0.02em;
          color: #EDEAE0;
          margin: 0 0 8px;
        }
        .cc-sub {
          font-family: 'Kalam', cursive;
          color: #A9AFC0;
          font-size: 16px;
          margin: 0 0 26px;
        }
        .cc-credit {
          position: absolute;
          top: 16px;
          left: 16px;
          color: #EDEAE0;
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          font-weight: 700;
          line-height: 1.45;
          letter-spacing: 0.02em;
          text-align: left;
          width: 135px;
          text-shadow: 0 2px 5px rgba(0, 0, 0, 0.65);
        }
        .cc-credit a {
          color: #F0C85A;
          text-decoration: none;
        }
        .cc-credit a:hover, .cc-credit a:focus-visible { text-decoration: underline; }

        @media (max-width: 360px) {
          .cc-root { padding: 16px 10px; }
          .cc-frame { padding-left: 16px; padding-right: 16px; }
          .cc-credit { left: 14px; width: 120px; font-size: 8px; }
          .cc-lang-toggle { right: 14px; }
        }
        .cc-hero-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #F0C85A;
          margin: 0 0 6px;
        }
        .cc-ticket {
          display: flex;
          border-top: 1px dashed #3A4157;
          border-bottom: 1px dashed #3A4157;
          padding: 12px 0;
          margin-bottom: 26px;
        }
        .cc-ticket-field { flex: 1; }
        .cc-ticket-field + .cc-ticket-field { border-left: 1px dashed #3A4157; }
        .cc-ticket-label {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.08em;
          color: #6B7288;
        }
        .cc-ticket-val {
          font-family: 'Space Mono', monospace;
          font-size: 14px;
          color: #EDEAE0;
          margin-top: 4px;
        }
        .cc-btn {
          width: 100%;
          background: #F0C85A;
          color: #1B1F2A;
          border: none;
          border-radius: 12px;
          padding: 15px 18px;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: transform 0.15s ease, opacity 0.15s ease;
        }
        .cc-btn:hover { transform: translateY(-1px); opacity: 0.95; }
        .cc-btn:active { transform: translateY(0); }
        .cc-btn-ghost {
          background: transparent;
          color: #C9CDD8;
          border: 1px solid #3A4157;
        }

        /* ---- Quiz ---- */
        .cc-quiz-top { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; }
        .cc-back {
          background: none; border: none; color: #6B7288; cursor: pointer;
          display: flex; align-items: center; padding: 4px;
        }
        .cc-back:disabled { visibility: hidden; }
        .cc-omr { display: flex; gap: 7px; flex: 1; }
        .cc-omr-bubble {
          flex: 1;
          height: 6px;
          border-radius: 999px;
          background: #343B4E;
          transition: background 0.25s ease;
        }
        .cc-omr-bubble.filled { background: #F0C85A; }
        .cc-qlabel {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: #6B7288;
          letter-spacing: 0.06em;
          margin-bottom: 8px;
        }
        .cc-qtext {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 21px;
          color: #EDEAE0;
          margin: 0 0 20px;
          line-height: 1.35;
        }
        .cc-opts { display: flex; flex-direction: column; gap: 10px; }
        .cc-opt {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #1E2330;
          border: 1.5px solid #343B4E;
          border-radius: 12px;
          padding: 13px 14px;
          cursor: pointer;
          text-align: left;
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .cc-opt:hover { border-color: #4C5470; }
        .cc-opt.selected { border-color: #F0C85A; background: rgba(240,200,90,0.08); }
        .cc-opt-letter {
          flex-shrink: 0;
          width: 28px; height: 28px;
          border-radius: 50%;
          border: 1.5px solid #4C5470;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          color: #9BA1B0;
        }
        .cc-opt.selected .cc-opt-letter { border-color: #F0C85A; background: #F0C85A; color: #1B1F2A; }
        .cc-opt-text { font-size: 14.5px; color: #DADDE5; line-height: 1.4; }

        /* ---- Loading ---- */
        .cc-loading { text-align: center; padding: 46px 10px 30px; }
        .cc-compass-wrap { display: flex; justify-content: center; margin-bottom: 22px; }
        .cc-compass-spin { animation: cc-spin 1.8s linear infinite; transform-origin: 100px 100px; }
        .cc-compass-trace {
          fill: none; stroke: #F0C85A; stroke-width: 3;
          stroke-dasharray: 440; stroke-dashoffset: 440;
          animation: cc-draw 1.8s ease-in-out infinite;
        }
        @keyframes cc-spin { to { transform: rotate(360deg); } }
        @keyframes cc-draw { to { stroke-dashoffset: 0; } }
        .cc-loading-title {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700; font-size: 18px; color: #EDEAE0; margin: 0 0 8px;
        }
        .cc-loading-phrase {
          font-family: 'Kalam', cursive; color: #8B92A6; font-size: 15px; min-height: 22px;
        }

        /* ---- Result ---- */
        .cc-result { animation: cc-fadein 0.5s ease; }
        @keyframes cc-fadein { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .cc-eyebrow {
          font-family: 'Space Mono', monospace;
          font-size: 11px; letter-spacing: 0.1em; color: #F0C85A;
          text-align: center; margin-bottom: 10px;
        }
        .cc-tabs { display: flex; gap: 8px; margin-bottom: 18px; }
        .cc-tab {
          flex: 1; padding: 9px; border-radius: 10px; text-align: center;
          font-family: 'Space Mono', monospace; font-size: 11px; letter-spacing: 0.03em;
          background: #1E2330; border: 1px solid #343B4E; color: #8B92A6; cursor: pointer;
        }
        .cc-tab.active { border-color: #F0C85A; color: #F0C85A; background: rgba(240,200,90,0.08); }
        .cc-stream-head { display: flex; align-items: center; gap: 14px; margin-bottom: 18px; }
        .cc-stream-icon {
          width: 56px; height: 56px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .cc-stream-name { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 24px; color: #EDEAE0; margin: 0; }
        .cc-stream-tag { font-family: 'Kalam', cursive; font-size: 14px; color: #9BA1B0; margin: 2px 0 0; }
        .cc-card {
          background: #1E2330; border: 1px solid #343B4E; border-radius: 14px;
          padding: 16px; margin-bottom: 14px;
        }
        .cc-card-h {
          font-family: 'Space Mono', monospace; font-size: 11px; letter-spacing: 0.06em;
          color: #6B7288; margin-bottom: 8px; text-transform: uppercase;
        }
        .cc-card-body { font-size: 14.5px; color: #DADDE5; line-height: 1.55; }
        .cc-path-row { display: flex; justify-content: space-between; gap: 10px; padding: 8px 0; border-top: 1px dashed #343B4E; }
        .cc-path-row:first-of-type { border-top: none; }
        .cc-path-label { font-family: 'Space Mono', monospace; font-size: 11px; color: #6B7288; flex-shrink: 0; }
        .cc-path-val { font-size: 13px; color: #DADDE5; text-align: right; }
        .cc-reflect { font-family: 'Kalam', cursive; font-size: 15.5px; color: #F0C85A; line-height: 1.5; }
        .cc-disclaimer { font-size: 12px; color: #6B7288; line-height: 1.5; margin: 4px 0 18px; text-align: center; }
        .cc-actions { display: flex; flex-direction: column; gap: 10px; }
        .cc-actions-row { display: flex; gap: 10px; }
        .cc-actions-row .cc-btn-ghost { flex: 1; font-size: 13px; padding: 12px; }

        @media (prefers-reduced-motion: reduce) {
          .cc-compass-spin, .cc-compass-trace, .cc-result { animation: none !important; }
        }
      `}</style>

      <div className="cc-root">
        <div className="cc-frame">
          <div className="cc-credit">
            <div>Designed and developed by Ritesh Jagtap</div>
            <a href="https://www.instagram.com/not_ritexh_911/" target="_blank" rel="noreferrer">Insta: @not_ritexh_911</a>
          </div>
          <button className="cc-lang-toggle" onClick={toggleLang} aria-label="Toggle language">
            <Globe size={13} /> {lang === "en" ? "हिं" : "EN"}
          </button>

          {screen === "landing" && (
            <div className="cc-land">
              <div className="cc-compass-static"><Compass size={44} strokeWidth={1.6} /></div>
              <h1 className="cc-title">{t.title}</h1>
              <p className="cc-hero-title">{t.heroTitle}</p>
              <p className="cc-sub">{t.subtitle}</p>
              <div className="cc-ticket">
                <div className="cc-ticket-field">
                  <div className="cc-ticket-label">{t.durLabel}</div>
                  <div className="cc-ticket-val">{t.durVal}</div>
                </div>
                <div className="cc-ticket-field">
                  <div className="cc-ticket-label">{t.costLabel}</div>
                  <div className="cc-ticket-val">{t.costVal}</div>
                </div>
              </div>
              <button className="cc-btn" onClick={() => setScreen("quiz")}>
                {t.start} <Compass size={17} />
              </button>
            </div>
          )}

          {screen === "quiz" && (
            <div>
              <div className="cc-quiz-top">
                <button className="cc-back" onClick={goBack} disabled={currentQ === 0} aria-label={t.back}>
                  <ChevronLeft size={20} />
                </button>
                <div className="cc-omr">
                  {QUESTIONS.map((_, i) => (
                    <div key={i} className={`cc-omr-bubble ${i < progressCount ? "filled" : ""}`} />
                  ))}
                </div>
              </div>
              <div className="cc-qlabel">{t.qLabel(currentQ + 1)}</div>
              <h2 className="cc-qtext">{QUESTIONS[currentQ][lang]}</h2>
              <div className="cc-opts">
                {QUESTIONS[currentQ].options.map((opt, i) => (
                  <button
                    key={opt.stream}
                    className={`cc-opt ${answers[currentQ] === opt.stream ? "selected" : ""}`}
                    onClick={() => selectOption(opt.stream)}
                  >
                    <span className="cc-opt-letter">{String.fromCharCode(65 + i)}</span>
                    <span className="cc-opt-text">{opt[lang]}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {screen === "loading" && (
            <div className="cc-loading">
              <div className="cc-compass-wrap">
                <svg width="120" height="120" viewBox="0 0 200 200" className="cc-compass-spin">
                  <circle cx="100" cy="100" r="70" className="cc-compass-trace" />
                  <line x1="100" y1="100" x2="100" y2="32" stroke="#EDEAE0" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="100" cy="100" r="5" fill="#F0C85A" />
                </svg>
              </div>
              <p className="cc-loading-title">{t.loadingTitle}</p>
              <p className="cc-loading-phrase">{LOADING_PHRASES[lang][phraseIdx]}</p>
            </div>
          )}

          {screen === "result" && aiResult && topId && secondId && (() => {
            const id = activeTab === "top" ? topId : secondId;
            const stream = STREAMS[id][lang];
            const Icon = ICONS[id];
            const why = activeTab === "top" ? aiResult.whyTop : aiResult.whySecond;
            return (
              <div className="cc-result">
                <div className="cc-eyebrow">{t.resultTag}</div>
                <div className="cc-tabs">
                  <button className={`cc-tab ${activeTab === "top" ? "active" : ""}`} onClick={() => setActiveTab("top")}>{t.tabTop}</button>
                  <button className={`cc-tab ${activeTab === "second" ? "active" : ""}`} onClick={() => setActiveTab("second")}>{t.tabSecond}</button>
                </div>
                <div className="cc-stream-head">
                  <div className="cc-stream-icon" style={{ background: `${STREAMS[id].color}22`, color: STREAMS[id].color }}>
                    <Icon size={28} />
                  </div>
                  <div>
                    <p className="cc-stream-name">{stream.name}</p>
                    <p className="cc-stream-tag">{stream.tagline}</p>
                  </div>
                </div>

                <div className="cc-card">
                  <div className="cc-card-h">{t.whyHeader}</div>
                  <div className="cc-card-body">{why}</div>
                </div>

                <div className="cc-card">
                  <div className="cc-card-h">{t.pathHeader}</div>
                  <div className="cc-path-row"><span className="cc-path-label">{t.examLabel}</span><span className="cc-path-val">{stream.exam}</span></div>
                  <div className="cc-path-row"><span className="cc-path-label">{t.timelineLabel}</span><span className="cc-path-val">{stream.timeline}</span></div>
                  <div className="cc-path-row"><span className="cc-path-label">{t.costLabel2}</span><span className="cc-path-val">{stream.cost}</span></div>
                </div>

                <div className="cc-card">
                  <div className="cc-card-h">{t.reflectLabel}</div>
                  <div className="cc-reflect">{aiResult.reflection}</div>
                </div>

                <p className="cc-disclaimer">{t.disclaimer}</p>

                <div className="cc-actions">
                  <button className="cc-btn" onClick={handleDownload}>
                    <Download size={16} /> {t.download}
                  </button>
                  <div className="cc-actions-row">
                    <button className="cc-btn cc-btn-ghost" onClick={handleCopy}>
                      {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? t.copied : t.copy}
                    </button>
                    <button className="cc-btn cc-btn-ghost" onClick={retake}>
                      <RotateCcw size={14} /> {t.retake}
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </>
  );
}
