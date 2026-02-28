import { useState, useEffect, useRef, useCallback } from "react";
import bookCover from "./book-cover.jpg";

const C = {
  cream: "#F5F0E6",
  creamDk: "#EDE7DB",
  green: "#3B6255",
  greenDk: "#2C4A40",
  greenMd: "#58796E",
  greenSoft: "#759188",
  greenMist: "#9DB0AA",
  greenLt: "#C4CFCC",
  greenPale: "#DBE2E0",
  greenWash: "#EBEFEE",
  greenTint: "#F5F7F6",
  warm: "#B87D62",
  warmDk: "#9A6347",
  warmBg: "#EBD9CE",
  warmMd: "#D4BAA8",
  txt: "#2A2A2A",
  txtMd: "#4A4A4A",
  txtLt: "#7A7A7A",
  white: "#FDFBF7",
  bdr: "#DDD6CA",
  bdrLt: "#E6E0D6",
  bdrGreen: "#9DB0AA",
  red: "#B06048",
  redBg: "#EEDDD4",
  redBdr: "#D9C0B2",
};

const SF = "'Cormorant Garamond', Georgia, serif";
const SN = "'DM Sans', -apple-system, sans-serif";

/* ─── HOOKS ─── */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function useCounter(end, duration = 2000, start = 0, active = false) {
  const [val, setVal] = useState(start);
  useEffect(() => {
    if (!active) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(start + (end - start) * ease));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, end, duration, start]);
  return val;
}

/* ─── DATA ─── */
const myths = [
  { myth: "They have to hit rock bottom before they'll change.", truth: "In the fentanyl era, rock bottom is a body bag. Research shows early intervention and sustained connection lead to better outcomes. Waiting for someone to lose everything is not a strategy. It's a gamble with their life.", stat: "The average gap between first use and seeking treatment is 11 years." },
  { myth: "Stop enabling them. Cut them off completely.", truth: "There's a difference between enabling addiction and enabling life. Making sure they have a phone, food, or Narcan so they don't die? That's not enabling. That's love with open eyes.", stat: "People with strong family connections are 2x more likely to complete treatment." },
  { myth: "Tough love is the only thing that works.", truth: "Tough love was never evidence-based. It was born from frustration, not science. CRAFT gets loved ones into treatment at dramatically higher rates.", stat: "CRAFT: 64% treatment entry. Johnson Intervention: 5%." },
  { myth: "You can't help someone who doesn't want help.", truth: "Motivation isn't a light switch. It fluctuates constantly. How you show up right now shapes whether they'll reach out when that window opens.", stat: "Family involvement increases treatment entry rates by up to 7x." },
  { myth: "If you love them, let them go.", truth: "Detachment was designed to protect you, but it got weaponized into abandonment. You can protect yourself AND stay connected.", stat: "Disconnection from family is one of the strongest predictors of fatal overdose." },
];

const testimonials = [
  { text: "This book saved my relationship with my son. I was about to cut him off forever because that's what everyone told me to do. Now I know there's another way.", who: "Sarah, mother of a 24-year-old in recovery" },
  { text: "I read it in one night. I couldn't stop crying because someone finally put into words what I've been feeling for three years. This should be required reading.", who: "Marcus, father of two" },
  { text: "I've been a family therapist for 15 years and this book challenged everything I thought I knew about family addiction support. I now recommend it to every family I work with.", who: "Licensed family therapist, Pennsylvania" },
  { text: "My daughter is still using. But for the first time in two years, I can sleep at night because I know I'm loving her in a way I can live with. That changed everything.", who: "Jennifer, mother" },
  { text: "I wish I had this book five years ago. It would have changed every decision I made. I'm buying copies for every parent in my support group.", who: "David, father in long-term family recovery" },
];

const assessmentQs = [
  { q: "How would you describe most of your days right now?", opts: [
    { text: "I'm in constant crisis. I can barely get through the day.", score: 1 },
    { text: "Exhausted and on edge. Always waiting for the next phone call.", score: 2 },
    { text: "Struggling, but I'm starting to find small pockets of stability.", score: 3 },
    { text: "Building something new, even though hard days still come.", score: 4 },
  ]},
  { q: "Where are you with boundaries right now?", opts: [
    { text: "I honestly don't know what a healthy boundary looks like.", score: 1 },
    { text: "I've tried setting them but I can't hold them.", score: 2 },
    { text: "I have some, but they feel rigid or they come with crushing guilt.", score: 3 },
    { text: "I'm learning to set boundaries that feel like love, not punishment.", score: 4 },
  ]},
  { q: "When your loved one is in crisis, what happens?", opts: [
    { text: "I drop everything. Their crisis becomes my crisis every time.", score: 1 },
    { text: "I panic, react, then spend days feeling guilty about how I handled it.", score: 2 },
    { text: "I try to pause, but I still get pulled back in more than I'd like.", score: 3 },
    { text: "I can be present for them without losing myself, most of the time.", score: 4 },
  ]},
  { q: "How are you taking care of yourself right now?", opts: [
    { text: "I'm not. There's no time or energy left for me.", score: 1 },
    { text: "I know I should, but every time I try it feels selfish.", score: 2 },
    { text: "I'm starting to do small things for myself without apologizing.", score: 3 },
    { text: "I've accepted that my wellbeing isn't optional, and I'm acting on it.", score: 4 },
  ]},
];

const assessmentResults = [
  { lo: 4, hi: 7, title: "The Storm", icon: "\u26C8", desc: "You're in the thick of it. Everything feels like survival right now, and that makes sense. You're not weak. You're carrying an impossible weight with no roadmap.", color: C.red, bg: C.redBg, next: ["Get the book for crisis-moment scripts", "The Chaos Brain Grounding Tool", "Join the Community for Daily Support"] },
  { lo: 8, hi: 11, title: "The Fog", icon: "\uD83C\uDF2B", desc: "You've been doing this long enough to be exhausted but not long enough to see clearly. You're caught between what the experts told you to do and what your gut keeps saying.", color: C.warm, bg: C.warmBg, next: ["The book's Crossroads Model will change how you decide", "The OAR Compass Framework", "Weekly Navigation Emails"] },
  { lo: 12, hi: 14, title: "The Clearing", icon: "\uD83C\uDF3F", desc: "You're finding your footing. Some days are still brutal, but you're starting to understand that your healing matters too.", color: C.green, bg: C.greenPale, next: ["The book's Last Call Lens for deeper clarity", "Advanced Boundaries Toolkit", "The Crossroads Model Deep Dive"] },
  { lo: 15, hi: 16, title: "The Path", icon: "\uD83E\uDDED", desc: "You've done real work on yourself and how you show up. Boundaries feel like acts of love now, not punishment. Your experience could be a lifeline for someone earlier in this journey.", color: C.green, bg: C.greenLt, next: ["Share the book with a family who needs it", "Mentor Training Program", "Professional Advocacy Resources"] },
];

const boundaryOpts1 = ["They're asking for money", "They're living in my home and using", "They're in crisis and calling me constantly", "I'm worried about their safety but they won't talk to me", "They want to come home after treatment"];
const boundaryOpts2 = ["They'll overdose and die", "They'll hate me and cut me off", "I'll feel too guilty to function", "Other family members will judge me", "I'll be giving up on them"];

const boundaryResponses = {
  "They're asking for money": {
    "They'll overdose and die": "\"I love you, and I can't give you money right now. What I can do is help you find resources, drive you to an appointment, or sit with you while you make a call. My love for you isn't measured in dollars. It's measured in showing up.\"",
    "They'll hate me and cut me off": "\"I know this isn't what you want to hear, and I know you might be angry with me. I'm not going anywhere. I'm choosing to love you in a way I can sustain.\"",
    "I'll feel too guilty to function": "\"This boundary isn't punishment. It's preservation. You can love someone fiercely and still say 'not this way.' The guilt you feel? That's proof of your love, not evidence of your failure.\"",
    "Other family members will judge me": "\"Other people's opinions don't carry the weight of your reality. They're not answering the phone at 3am. You get to decide what you can live with.\"",
    "I'll be giving up on them": "\"A boundary is not abandonment. It's the opposite. It's choosing to stay in this fight in a way that doesn't destroy you.\"",
  },
  "They're living in my home and using": {
    "They'll overdose and die": "\"You can set conditions for your home while keeping the door to your heart wide open. 'You can live here if ___. If that changes, I'll help you find somewhere safe.'\"",
    "They'll hate me and cut me off": "\"House rules aren't rejection. You're saying 'I love you enough to not watch you destroy yourself under my roof.' That's the hardest kind of love there is.\"",
    "I'll feel too guilty to function": "\"Your home is your sanctuary. You're allowed to protect it. Setting conditions isn't cruelty. It's modeling that even love has structure.\"",
    "Other family members will judge me": "\"The people judging your boundaries aren't living your reality. You don't owe anyone an explanation for protecting your peace.\"",
    "I'll be giving up on them": "\"Conditions aren't ultimatums. 'You can stay if ___' is profoundly different from 'Get out.' One is a wall. The other is a door with a frame.\"",
  },
  "They're in crisis and calling me constantly": {
    "They'll overdose and die": "\"You can answer the phone and still have limits. 'I love you. I'm here. I can talk for ten minutes.' You don't have to be their only lifeline to be a lifeline.\"",
    "They'll hate me and cut me off": "\"You're not abandoning them by having limits on when and how you're available. You're making sure you can keep showing up.\"",
    "I'll feel too guilty to function": "\"Guilt tells you that you care. But guilt shouldn't run your life. You can care deeply and still turn your phone on silent at midnight.\"",
    "Other family members will judge me": "\"Nobody else is getting those calls. Nobody else is losing sleep. Your boundaries are between you and your loved one, not you and your critics.\"",
    "I'll be giving up on them": "\"Having limits on your availability is not giving up. It's making sure you're still functioning enough to be there when it really counts.\"",
  },
  "I'm worried about their safety but they won't talk to me": {
    "They'll overdose and die": "\"You can't force contact, but you can leave the door open. A text that says 'I love you. No strings. I'm here when you're ready.' keeps the thread alive.\"",
    "They'll hate me and cut me off": "\"Sometimes silence is their boundary, not their rejection. Keep showing up in small, no-pressure ways. Proof that you haven't disappeared.\"",
    "I'll feel too guilty to function": "\"Their silence isn't your failure. You didn't cause this distance. You can grieve it without owning it.\"",
    "Other family members will judge me": "\"People who aren't living this don't get a vote. You're doing the best you can with an impossible situation.\"",
    "I'll be giving up on them": "\"Respecting their space while keeping the connection alive IS showing up. It's just quieter than you're used to.\"",
  },
  "They want to come home after treatment": {
    "They'll overdose and die": "\"You can welcome them home AND have a plan. Talk about what happens if relapse occurs before it occurs. That's not pessimism. It's preparation.\"",
    "They'll hate me and cut me off": "\"Conditions for coming home aren't distrust. They're structure. And structure is what early recovery needs most.\"",
    "I'll feel too guilty to function": "\"You're allowed to have conditions. You're allowed to need safety in your own home. That's not guilt-worthy. That's reasonable.\"",
    "Other family members will judge me": "\"Everyone has an opinion about what you should do. But only you live with the consequences. Trust yourself on this one.\"",
    "I'll be giving up on them": "\"Having a plan and expectations isn't giving up. It's preparing to support them well. That's the opposite of giving up.\"",
  },
};

const resources = [
  { cat: "Crisis Moments", items: ["What to say when they call in crisis", "Safety planning without enabling", "When to call 911 vs. when to hold space", "Narcan: what every family needs to know"] },
  { cat: "Daily Navigation", items: ["Morning grounding for the chaos brain", "Scripts for the hardest conversations", "How to respond when they're using", "Managing holidays and family events"] },
  { cat: "Communication", items: ["The CRAFT approach, simplified", "Replacing tough love language", "How to say no without saying goodbye", "Talking to family members who disagree"] },
  { cat: "Your Healing", items: ["You are not their addiction", "Releasing guilt and shame", "Building your own recovery", "When grief hits before loss"] },
];

const credBadges = [
  { label: "Caron Treatment Centers", detail: "Recommended Reading" },
  { label: "Partnership to End Addiction", detail: "Content Partner" },
  { label: "Board-Certified ACNP-BC", detail: "Critical Care NP" },
  { label: "400,000+", detail: "Families in Community" },
];

/* ─── ANIMATED SECTION WRAPPER ─── */
function FadeIn({ children, delay = 0, style = {} }) {
  const [ref, vis] = useInView(0.1);
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(40px)", transition: `all 0.8s ease-out ${delay}s`, ...style }}>
      {children}
    </div>
  );
}

/* ─── STAT COUNTER ─── */
function StatCounter({ end, label, suffix = "", prefix = "", duration = 2200 }) {
  const [ref, vis] = useInView(0.3);
  const val = useCounter(end, duration, 0, vis);
  return (
    <div ref={ref} style={{ textAlign: "center", padding: "12px 0" }}>
      <div style={{ fontFamily: SF, fontSize: "clamp(40px, 8vw, 64px)", fontWeight: 700, color: C.white, lineHeight: 1 }}>{prefix}{val.toLocaleString()}{suffix}</div>
      <div style={{ fontFamily: SN, fontSize: 14, color: C.greenLt, marginTop: 8, lineHeight: 1.4 }}>{label}</div>
    </div>
  );
}

/* ─── LIVE COUNTER ─── */
function LiveCounter() {
  const [secs, setSecs] = useState(0);
  useEffect(() => { const i = setInterval(() => setSecs(s => s + 1), 1000); return () => clearInterval(i); }, []);
  const deaths = (secs * 0.0031).toFixed(1);
  const [ref, vis] = useInView(0.2);
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transition: "opacity 1s", textAlign: "center", padding: "32px 24px", background: C.greenDk, borderRadius: 12, margin: "40px auto 0", maxWidth: 560 }}>
      <p style={{ fontFamily: SN, fontSize: 12, letterSpacing: 3, color: C.greenMist, textTransform: "uppercase", marginBottom: 8 }}>Since you opened this page</p>
      <p style={{ fontFamily: SF, fontSize: "clamp(36px, 7vw, 56px)", color: C.warm, fontWeight: 700, margin: "0 0 4px", lineHeight: 1 }}>{deaths}</p>
      <p style={{ fontFamily: SN, fontSize: 15, color: C.greenLt, margin: 0 }}>Americans have died from overdose</p>
      <p style={{ fontFamily: SN, fontSize: 12, color: C.greenMist, marginTop: 12 }}>Based on CDC data: 107,000+ deaths per year. One every 5 minutes.</p>
    </div>
  );
}

/* ─── TESTIMONIAL CAROUSEL ─── */
function TestimonialCarousel() {
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);
  useEffect(() => {
    const i = setInterval(() => {
      setFade(false);
      setTimeout(() => { setIdx(p => (p + 1) % testimonials.length); setFade(true); }, 400);
    }, 6000);
    return () => clearInterval(i);
  }, []);
  const t = testimonials[idx];
  return (
    <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center", minHeight: 200 }}>
      <div style={{ opacity: fade ? 1 : 0, transition: "opacity 0.4s" }}>
        <p style={{ fontFamily: SF, fontSize: "clamp(18px, 3vw, 24px)", color: C.white, lineHeight: 1.5, fontStyle: "italic", margin: "0 0 20px" }}>"{t.text}"</p>
        <p style={{ fontFamily: SN, fontSize: 14, color: C.greenMist }}>- {t.who}</p>
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 24 }}>
        {testimonials.map((_, i) => (
          <button key={i} onClick={() => { setFade(false); setTimeout(() => { setIdx(i); setFade(true); }, 300); }}
            style={{ width: i === idx ? 24 : 8, height: 8, borderRadius: 4, background: i === idx ? C.warm : C.greenMd, border: "none", cursor: "pointer", transition: "all 0.3s" }} />
        ))}
      </div>
    </div>
  );
}

/* ─── STICKY BOOK CTA ─── */
function StickyBookCTA() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 99,
      background: C.greenDk, padding: "12px 24px",
      display: "flex", justifyContent: "center", alignItems: "center", gap: 16,
      transform: show ? "translateY(0)" : "translateY(100%)",
      transition: "transform 0.4s ease-out",
      boxShadow: "0 -2px 16px rgba(0,0,0,0.15)"
    }}>
      <p style={{ fontFamily: SN, fontSize: 14, color: C.greenLt, margin: 0 }}>Ready to change how you love through addiction?</p>
      <a href="https://www.amazon.com/dp/B0F1MPN4CQ" target="_blank" rel="noopener noreferrer" style={{ fontFamily: SN, padding: "10px 24px", background: C.warm, color: C.white, border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", textDecoration: "none", whiteSpace: "nowrap", transition: "background 0.2s" }}
        onMouseOver={e => e.target.style.background = C.warmDk}
        onMouseOut={e => e.target.style.background = C.warm}>
        Get the Book
      </a>
    </div>
  );
}

/* ─── HERO ─── */
function Hero({ onAssess, onBound }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 300); }, []);
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "120px 24px 80px", position: "relative", overflow: "hidden", background: C.green }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 20% 30%, ${C.greenMd}44 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, ${C.greenDk}44 0%, transparent 50%)` }} />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 780, margin: "0 auto" }}>
        <div style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(30px)", transition: "all 1s ease-out" }}>
          <p style={{ fontFamily: SN, fontSize: 13, letterSpacing: 3, color: C.greenLt, textTransform: "uppercase", fontWeight: 600, marginBottom: 20 }}>For families who refuse to give up</p>
          <h1 style={{ fontFamily: SF, fontSize: "clamp(36px, 7vw, 64px)", fontWeight: 400, color: C.white, lineHeight: 1.15, margin: "0 0 8px" }}>
            They told you to <em style={{ fontStyle: "italic", color: C.warm }}>let go.</em>
          </h1>
          <h1 style={{ fontFamily: SF, fontSize: "clamp(36px, 7vw, 64px)", fontWeight: 700, color: C.white, lineHeight: 1.15, margin: "0 0 32px" }}>
            I'm telling you there's another way.
          </h1>
        </div>
        <div style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(30px)", transition: "all 1s ease-out 0.3s" }}>
          <p style={{ fontFamily: SN, fontSize: "clamp(16px, 2.2vw, 19px)", color: C.greenLt, lineHeight: 1.8, maxWidth: 620, marginBottom: 12 }}>
            If you love someone struggling with addiction, you've been handed a set of rules that were never built for this moment. Detach. Let them hit rock bottom. Stop enabling.
          </p>
          <p style={{ fontFamily: SN, fontSize: "clamp(16px, 2.2vw, 19px)", color: C.warm, lineHeight: 1.8, maxWidth: 620, marginBottom: 12, fontWeight: 600 }}>
            In the fentanyl era, that advice is a death sentence.
          </p>
          <p style={{ fontFamily: SN, fontSize: "clamp(16px, 2.2vw, 19px)", color: C.greenLt, lineHeight: 1.8, maxWidth: 620, marginBottom: 40 }}>
            There is a way to love your person, protect yourself, and make decisions you can live with no matter what happens. That's what we do here.
          </p>
        </div>
        <div style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(30px)", transition: "all 1s ease-out 0.6s", display: "flex", gap: 14, flexWrap: "wrap" }}>
          <a href="https://www.amazon.com/dp/B0F1MPN4CQ" target="_blank" rel="noopener noreferrer" style={{ fontFamily: SN, padding: "16px 32px", background: C.warm, color: C.white, border: "none", borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: "pointer", textDecoration: "none", transition: "all 0.25s", boxShadow: "0 4px 16px rgba(184,125,98,0.3)" }}>
            Get the Book
          </a>
          <button onClick={onAssess} style={{ fontFamily: SN, padding: "16px 32px", background: C.white, color: C.green, border: "none", borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: "pointer", transition: "all 0.25s" }}>
            Find Where You Are
          </button>
          <button onClick={onBound} style={{ fontFamily: SN, padding: "16px 32px", background: "transparent", color: C.white, border: "2px solid rgba(255,255,255,0.4)", borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
            Build a Boundary
          </button>
        </div>
        <LiveCounter />
      </div>
    </div>
  );
}

/* ─── MYTH CARD ─── */
function MythCard({ myth, truth, stat }) {
  const [flipped, setFlipped] = useState(false);
  const [ref, vis] = useInView(0.1);
  return (
    <div ref={ref} onClick={() => setFlipped(!flipped)} style={{ cursor: "pointer", perspective: 1000, minHeight: 280, marginBottom: 16, opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(30px)", transition: "all 0.6s ease-out" }}>
      <div style={{ position: "relative", width: "100%", minHeight: 280, transition: "transform 0.6s", transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0)" }}>
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", background: C.warmBg, border: `1px solid ${C.warmMd}`, borderRadius: 12, padding: 28, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p style={{ fontFamily: SN, fontSize: 11, letterSpacing: 3, color: C.red, textTransform: "uppercase", marginBottom: 12, fontWeight: 700 }}>What you've been told</p>
          <p style={{ fontFamily: SF, fontSize: 22, color: C.txt, fontWeight: 600, lineHeight: 1.35, margin: "0 0 auto" }}>"{myth}"</p>
          <p style={{ fontFamily: SN, fontSize: 13, color: C.txtLt, marginTop: 16 }}>Tap to see the truth →</p>
        </div>
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: C.greenTint, border: `1px solid ${C.greenLt}`, borderRadius: 12, padding: 28, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p style={{ fontFamily: SN, fontSize: 11, letterSpacing: 3, color: C.green, textTransform: "uppercase", marginBottom: 12, fontWeight: 700 }}>What we actually know</p>
          <p style={{ fontFamily: SN, fontSize: 15, color: C.txt, lineHeight: 1.6, margin: "0 0 16px" }}>{truth}</p>
          <div style={{ background: C.greenPale, borderRadius: 8, padding: 12 }}>
            <p style={{ fontFamily: SN, fontSize: 13, color: C.greenDk, margin: 0, lineHeight: 1.5, fontWeight: 500 }}>{stat}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── ASSESSMENT ─── */
function Assessment({ onComplete }) {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState([]);
  const [sel, setSel] = useState(null);
  const go = () => {
    if (sel === null) return;
    const ns = [...scores, sel];
    setScores(ns);
    setSel(null);
    if (step < assessmentQs.length - 1) setStep(step + 1);
    else onComplete(ns.reduce((a, b) => a + b, 0));
  };
  const q = assessmentQs[step];
  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <div style={{ height: 3, background: C.greenLt, borderRadius: 2, marginBottom: 32 }}>
        <div style={{ height: "100%", background: C.green, borderRadius: 2, width: `${((step + (sel ? 1 : 0)) / assessmentQs.length) * 100}%`, transition: "width 0.5s" }} />
      </div>
      <p style={{ fontFamily: SN, fontSize: 13, color: C.txtLt, marginBottom: 6 }}>Question {step + 1} of {assessmentQs.length}</p>
      <h3 style={{ fontFamily: SF, fontSize: 22, color: C.txt, fontWeight: 600, marginBottom: 24, lineHeight: 1.35 }}>{q.q}</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {q.opts.map((o, i) => (
          <button key={i} onClick={() => setSel(o.score)} style={{
            fontFamily: SN, padding: "16px 20px", background: sel === o.score ? C.greenTint : C.white,
            border: `1.5px solid ${sel === o.score ? C.green : C.bdr}`, borderRadius: 10,
            color: sel === o.score ? C.greenDk : C.txtMd, fontSize: 15, textAlign: "left",
            cursor: "pointer", transition: "all 0.2s", lineHeight: 1.45
          }}>{o.text}</button>
        ))}
      </div>
      <button onClick={go} disabled={sel === null} style={{
        fontFamily: SN, marginTop: 24, padding: "14px 36px",
        background: sel !== null ? C.green : C.greenLt,
        color: sel !== null ? C.white : C.greenSoft,
        border: "none", borderRadius: 8, fontSize: 15, fontWeight: 600,
        cursor: sel !== null ? "pointer" : "default", transition: "all 0.3s"
      }}>{step < assessmentQs.length - 1 ? "Next" : "See Where I Am"}</button>
    </div>
  );
}

function AssessmentResult({ score, onReset }) {
  const r = assessmentResults.find(x => score >= x.lo && score <= x.hi);
  if (!r) return null;
  return (
    <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
      <div style={{ width: 72, height: 72, borderRadius: "50%", background: r.bg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 30, border: `2px solid ${r.color}` }}>{r.icon}</div>
      <h3 style={{ fontFamily: SF, fontSize: 30, color: r.color, fontWeight: 700, margin: "0 0 8px" }}>{r.title}</h3>
      <p style={{ fontFamily: SN, fontSize: 16, color: C.txtMd, lineHeight: 1.7, marginBottom: 32 }}>{r.desc}</p>
      <div style={{ textAlign: "left", background: C.white, borderRadius: 12, padding: 24, marginBottom: 24, border: `1px solid ${C.bdr}` }}>
        <p style={{ fontFamily: SN, fontSize: 12, color: C.green, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>Recommended Next Steps</p>
        {r.next.map((n, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: i < r.next.length - 1 ? `1px solid ${C.bdrLt}` : "none" }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", background: C.greenPale, color: C.green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
            <span style={{ fontFamily: SN, color: C.txt, fontSize: 15 }}>{n}</span>
          </div>
        ))}
      </div>
      <a href="https://www.amazon.com/dp/B0F1MPN4CQ" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", fontFamily: SN, padding: "14px 32px", background: C.warm, color: C.white, border: "none", borderRadius: 8, fontSize: 15, fontWeight: 600, textDecoration: "none", marginBottom: 12 }}>Get the Book</a>
      <br />
      <button onClick={onReset} style={{ fontFamily: SN, padding: "10px 24px", background: "transparent", color: C.txtLt, border: `1px solid ${C.bdr}`, borderRadius: 8, fontSize: 14, cursor: "pointer" }}>Retake</button>
    </div>
  );
}

/* ─── BOUNDARY BUILDER ─── */
function BoundaryBuilder() {
  const [step, setStep] = useState(0);
  const [situation, setSituation] = useState(null);
  const [fear, setFear] = useState(null);
  const getResp = () => boundaryResponses[situation]?.[fear] || null;
  const reset = () => { setStep(0); setSituation(null); setFear(null); };
  const btn = (text, onClick) => (
    <button onClick={onClick} style={{
      fontFamily: SN, padding: "16px 20px", background: C.white,
      border: `1.5px solid ${C.bdr}`, borderRadius: 10,
      color: C.txtMd, fontSize: 15, textAlign: "left",
      cursor: "pointer", transition: "all 0.2s", lineHeight: 1.45, width: "100%"
    }}>{text}</button>
  );

  if (step === 0) return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h3 style={{ fontFamily: SF, fontSize: 20, color: C.txt, marginBottom: 6 }}>What's happening right now?</h3>
      <p style={{ fontFamily: SN, color: C.txtMd, marginBottom: 20, fontSize: 15 }}>Pick the situation closest to yours.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{boundaryOpts1.map((o, i) => btn(o, () => { setSituation(o); setStep(1); }))}</div>
    </div>
  );

  if (step === 1) return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <p style={{ fontFamily: SN, fontSize: 13, color: C.warm, marginBottom: 16, fontWeight: 500 }}>Situation: {situation}</p>
      <h3 style={{ fontFamily: SF, fontSize: 20, color: C.txt, marginBottom: 6 }}>What scares you most about setting this boundary?</h3>
      <p style={{ fontFamily: SN, color: C.txtMd, marginBottom: 20, fontSize: 15 }}>Be honest. There's no wrong answer here.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{boundaryOpts2.map((o, i) => btn(o, () => { setFear(o); setStep(2); }))}</div>
    </div>
  );

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <p style={{ fontFamily: SN, fontSize: 13, color: C.warm, marginBottom: 4, fontWeight: 500 }}>Situation: {situation}</p>
      <p style={{ fontFamily: SN, fontSize: 13, color: C.txtLt, marginBottom: 20, fontWeight: 500 }}>Fear: {fear}</p>
      <h3 style={{ fontFamily: SF, fontSize: 22, color: C.txt, marginBottom: 20 }}>What Boundaried Love Sounds Like</h3>
      <div style={{ background: C.green, borderRadius: 12, padding: 28 }}>
        <p style={{ fontFamily: SF, fontSize: 18, color: C.white, lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>{getResp()}</p>
      </div>
      <div style={{ marginTop: 20, padding: 20, background: C.greenTint, borderRadius: 10, border: `1px solid ${C.greenLt}` }}>
        <p style={{ fontFamily: SN, fontSize: 14, color: C.greenDk, fontWeight: 600, marginBottom: 6 }}>Want the full framework?</p>
        <p style={{ fontFamily: SN, fontSize: 14, color: C.txtMd, lineHeight: 1.6, margin: "0 0 12px" }}>The book includes 25+ boundary scripts, the Crossroads Model for decision-making, and the Last Call Lens for every hard choice you'll face.</p>
        <a href="https://www.amazon.com/dp/B0F1MPN4CQ" target="_blank" rel="noopener noreferrer" style={{ fontFamily: SN, fontSize: 14, color: C.warm, fontWeight: 600, textDecoration: "none" }}>Get the Book →</a>
      </div>
      <button onClick={reset} style={{ fontFamily: SN, marginTop: 16, padding: "10px 24px", background: "transparent", color: C.txtLt, border: `1px solid ${C.bdr}`, borderRadius: 8, fontSize: 14, cursor: "pointer" }}>Start Over</button>
    </div>
  );
}

/* ─── EMAIL CAPTURE ─── */
function EmailCapture() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [ref, vis] = useInView(0.2);
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(30px)", transition: "all 0.8s", maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
      {!submitted ? (
        <>
          <p style={{ fontFamily: SF, fontSize: "clamp(22px, 4vw, 30px)", color: C.white, fontWeight: 600, margin: "0 0 8px" }}>Get the First Chapter Free</p>
          <p style={{ fontFamily: SN, fontSize: 15, color: C.greenLt, margin: "0 0 24px", lineHeight: 1.6 }}>Plus weekly scripts, tools, and the words you've been searching for at 2am. No spam. Just help.</p>
          <div style={{ display: "flex", gap: 8, maxWidth: 440, margin: "0 auto", flexWrap: "wrap", justifyContent: "center" }}>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email" style={{
              fontFamily: SN, flex: 1, minWidth: 200, padding: "14px 16px", border: `1px solid ${C.greenMd}`, borderRadius: 8,
              background: "rgba(255,255,255,0.1)", color: C.white, fontSize: 15, outline: "none"
            }} />
            <button onClick={() => { if (email.includes("@")) setSubmitted(true); }} style={{
              fontFamily: SN, padding: "14px 24px", background: C.warm, color: C.white, border: "none", borderRadius: 8,
              fontSize: 15, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap"
            }}>Send It</button>
          </div>
          <p style={{ fontFamily: SN, fontSize: 12, color: C.greenMist, marginTop: 12 }}>Join 400,000+ families. Unsubscribe anytime.</p>
        </>
      ) : (
        <div>
          <p style={{ fontFamily: SF, fontSize: 28, color: C.warm, fontWeight: 600, margin: "0 0 8px" }}>Check your inbox.</p>
          <p style={{ fontFamily: SN, fontSize: 15, color: C.greenLt }}>Your first chapter is on its way. You just took the first step.</p>
        </div>
      )}
    </div>
  );
}

/* ─── MAIN APP ─── */
export default function App() {
  const [assessScore, setAssessScore] = useState(null);
  const assessRef = useRef(null);
  const boundRef = useRef(null);

  return (
    <div style={{ background: C.cream, color: C.txt, fontFamily: SN, minHeight: "100vh" }}>
      <StickyBookCTA />

      {/* Nav */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: C.green, padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 1px 8px rgba(0,0,0,0.12)" }}>
        <div style={{ fontFamily: SF, fontSize: 16, fontWeight: 700, color: C.white }}>Do What You Can Live With</div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "flex-end" }}>
          {["The Book", "The Program", "Resources", "For Professionals"].map(t => (
            <button key={t} style={{ fontFamily: SN, padding: "6px 12px", background: "transparent", color: C.greenLt, border: "none", fontSize: 13, cursor: "pointer", borderRadius: 6, fontWeight: 500 }}>{t}</button>
          ))}
        </div>
      </nav>

      <Hero onAssess={() => assessRef.current?.scrollIntoView({ behavior: "smooth" })} onBound={() => boundRef.current?.scrollIntoView({ behavior: "smooth" })} />

      {/* Cred Bar */}
      <div style={{ padding: "36px 24px", background: C.greenDk }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 20, textAlign: "center" }}>
          {credBadges.map((b, i) => (
            <div key={i} style={{ padding: "8px 0" }}>
              <div style={{ fontFamily: SN, fontSize: 15, color: C.white, fontWeight: 700 }}>{b.label}</div>
              <div style={{ fontFamily: SN, fontSize: 13, color: C.greenMist, marginTop: 3 }}>{b.detail}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Counter Section */}
      <div style={{ padding: "64px 24px", background: C.green }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
          <StatCounter end={107000} label="overdose deaths per year in the US" suffix="+" />
          <StatCounter end={64} label="of loved ones enter treatment with CRAFT vs. 5% with intervention" suffix="%" />
          <StatCounter end={21} label="million Americans have substance use disorder" suffix="M+" />
        </div>
      </div>

      {/* Mission */}
      <div style={{ padding: "80px 24px", background: C.greenPale }}>
        <FadeIn>
          <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
            <p style={{ fontFamily: SF, fontSize: "clamp(22px, 4vw, 30px)", color: C.txt, lineHeight: 1.5, fontWeight: 400, margin: "0 0 20px" }}>
              Families are being told to choose between loving their person and protecting themselves, <em style={{ color: C.warm }}>as if those are opposites.</em>
            </p>
            <p style={{ fontFamily: SN, fontSize: 16, color: C.txtMd, lineHeight: 1.7 }}>That false choice is destroying families and costing lives. This space exists because no one gave you a way to do both. Until now.</p>
          </div>
        </FadeIn>
      </div>

      {/* Book - PRIMARY CTA */}
      <div style={{ padding: "80px 24px", background: C.green }}>
        <FadeIn>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <div style={{ display: "flex", gap: 48, alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
              <div style={{ flexShrink: 0 }}>
                <img src={bookCover} alt="Do What You Can Live With by Brandi Mac" style={{ width: 280, borderRadius: 8, boxShadow: "0 12px 40px rgba(0,0,0,0.35)", transition: "transform 0.3s" }} />
              </div>
              <div style={{ flex: 1, minWidth: 280 }}>
                <p style={{ fontFamily: SN, fontSize: 12, letterSpacing: 3, color: C.greenLt, textTransform: "uppercase", fontWeight: 600, marginBottom: 12 }}>The Book Families Are Calling "Life-Changing"</p>
                <h2 style={{ fontFamily: SF, fontSize: "clamp(26px, 4vw, 36px)", color: C.white, fontWeight: 600, margin: "0 0 16px", lineHeight: 1.2 }}>Do What You Can Live With</h2>
                <p style={{ fontFamily: SN, fontSize: 15, color: C.greenLt, lineHeight: 1.7, marginBottom: 16 }}>A Survival Guide for Families Navigating Addiction, Grief, and Impossible Choices. This isn't a workbook about control. It's a workbook about peace.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                  {["The Crossroads Model for decision-making under pressure", "The Last Call Lens for every impossible choice", "25+ boundary scripts you can use tonight", "The OAR process for healing damaged relationships", "Permission to love them AND protect yourself"].map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <span style={{ color: C.warm, fontSize: 16, lineHeight: 1.4 }}>&#10003;</span>
                      <span style={{ fontFamily: SN, fontSize: 14, color: C.greenLt, lineHeight: 1.4 }}>{item}</span>
                    </div>
                  ))}
                </div>
                <p style={{ fontFamily: SN, fontSize: 13, color: C.greenMist, fontStyle: "italic", marginBottom: 16 }}>On Caron Treatment Centers' Recommended Reading List</p>
                <a href="https://www.amazon.com/dp/B0F1MPN4CQ" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", fontFamily: SN, padding: "16px 32px", background: C.warm, color: C.white, border: "none", borderRadius: 8, fontSize: 16, fontWeight: 600, textDecoration: "none", boxShadow: "0 4px 16px rgba(184,125,98,0.3)", transition: "all 0.25s" }}>
                  Get the Book Now
                </a>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Testimonials */}
      <div style={{ padding: "80px 24px", background: C.greenDk }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <p style={{ fontFamily: SN, fontSize: 12, letterSpacing: 3, color: C.greenMist, textTransform: "uppercase", fontWeight: 600, marginBottom: 12 }}>What Families Are Saying</p>
            </div>
            <TestimonialCarousel />
          </FadeIn>
        </div>
      </div>

      {/* Assessment */}
      <div style={{ padding: "80px 24px", background: C.cream }} id="assessment">
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div ref={assessRef} />
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <p style={{ fontFamily: SN, fontSize: 12, letterSpacing: 3, color: C.green, textTransform: "uppercase", fontWeight: 600, marginBottom: 12 }}>Find Where You Are</p>
              <h2 style={{ fontFamily: SF, fontSize: "clamp(28px, 5vw, 42px)", color: C.txt, fontWeight: 600, margin: "0 0 12px", lineHeight: 1.2 }}>This Isn't a Test. It's a Compass.</h2>
              <p style={{ fontFamily: SN, fontSize: 16, color: C.txtMd, maxWidth: 560, margin: "0 auto", lineHeight: 1.65 }}>Answer honestly. No wrong answers, no grades. We just want to meet you where you are.</p>
            </div>
          </FadeIn>
          {assessScore === null ? <Assessment onComplete={setAssessScore} /> : <AssessmentResult score={assessScore} onReset={() => setAssessScore(null)} />}
        </div>
      </div>

      {/* Boundary Builder */}
      <div style={{ padding: "80px 24px", background: C.greenWash }} id="boundaries">
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div ref={boundRef} />
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <p style={{ fontFamily: SN, fontSize: 12, letterSpacing: 3, color: C.green, textTransform: "uppercase", fontWeight: 600, marginBottom: 12 }}>Interactive Tool</p>
              <h2 style={{ fontFamily: SF, fontSize: "clamp(28px, 5vw, 42px)", color: C.txt, fontWeight: 600, margin: "0 0 12px", lineHeight: 1.2 }}>The Boundary Builder</h2>
              <p style={{ fontFamily: SN, fontSize: 16, color: C.txtMd, maxWidth: 560, margin: "0 auto", lineHeight: 1.65 }}>Boundaries aren't walls. They're bridges with guardrails. Let's build one together.</p>
            </div>
          </FadeIn>
          <BoundaryBuilder />
        </div>
      </div>

      {/* Myths */}
      <div style={{ padding: "80px 24px", background: C.green }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <p style={{ fontFamily: SN, fontSize: 12, letterSpacing: 3, color: C.greenLt, textTransform: "uppercase", fontWeight: 600, marginBottom: 12 }}>Evidence Over Tradition</p>
              <h2 style={{ fontFamily: SF, fontSize: "clamp(28px, 5vw, 42px)", color: C.white, fontWeight: 600, margin: "0 0 12px", lineHeight: 1.2 }}>Everything You Were Told Is Wrong</h2>
              <p style={{ fontFamily: SN, fontSize: 16, color: C.greenLt, maxWidth: 560, margin: "0 auto", lineHeight: 1.65 }}>Tap each card. The advice you received was never evidence-based.</p>
            </div>
          </FadeIn>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            {myths.map((m, i) => <MythCard key={i} {...m} />)}
          </div>
          <FadeIn delay={0.3}>
            <div style={{ textAlign: "center", marginTop: 32 }}>
              <p style={{ fontFamily: SN, fontSize: 15, color: C.greenLt, marginBottom: 16 }}>The book breaks down the evidence behind every myth and gives you the scripts to respond.</p>
              <a href="https://www.amazon.com/dp/B0F1MPN4CQ" target="_blank" rel="noopener noreferrer" style={{ fontFamily: SN, padding: "14px 28px", background: C.warm, color: C.white, border: "none", borderRadius: 8, fontSize: 15, fontWeight: 600, textDecoration: "none" }}>Get the Book</a>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Permission */}
      <div style={{ padding: "80px 24px", background: C.greenDk }}>
        <FadeIn>
          <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
            <p style={{ fontFamily: SN, fontSize: 12, letterSpacing: 3, color: C.greenMist, textTransform: "uppercase", fontWeight: 600, marginBottom: 20 }}>Permission Granted</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {["You are allowed to still love them.", "You are allowed to be angry and heartbroken at the same time.", "You are allowed to set a boundary and cry about it later.", "You are allowed to hope and grieve simultaneously.", "You are allowed to not have this figured out.", "You are allowed to take care of yourself without guilt."].map((p, i) => (
                <FadeIn key={i} delay={i * 0.12}><p style={{ fontFamily: SF, fontSize: "clamp(18px, 3vw, 24px)", color: C.greenTint, lineHeight: 1.4, margin: 0, fontWeight: 400 }}>{p}</p></FadeIn>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Email Capture */}
      <div style={{ padding: "80px 24px", background: C.green }}>
        <EmailCapture />
      </div>

      {/* Resources */}
      <div style={{ padding: "80px 24px", background: C.greenPale }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <p style={{ fontFamily: SN, fontSize: 12, letterSpacing: 3, color: C.green, textTransform: "uppercase", fontWeight: 600, marginBottom: 12 }}>Resource Library</p>
              <h2 style={{ fontFamily: SF, fontSize: "clamp(28px, 5vw, 42px)", color: C.txt, fontWeight: 600, margin: "0 0 12px", lineHeight: 1.2 }}>Tools for Every Moment</h2>
              <p style={{ fontFamily: SN, fontSize: 16, color: C.txtMd, maxWidth: 560, margin: "0 auto", lineHeight: 1.65 }}>Whether it's 2am and you're in crisis, or Tuesday and you just need someone to tell you you're doing okay.</p>
            </div>
          </FadeIn>
          <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            {resources.map((r, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div style={{ background: C.white, borderRadius: 12, padding: 24, border: `1px solid ${C.greenLt}`, height: "100%" }}>
                  <h4 style={{ fontFamily: SF, fontSize: 18, color: C.green, fontWeight: 600, marginBottom: 16 }}>{r.cat}</h4>
                  {r.items.map((item, j) => (
                    <div key={j} style={{ padding: "10px 0", borderBottom: j < r.items.length - 1 ? `1px solid ${C.bdrLt}` : "none", fontFamily: SN, fontSize: 14, color: C.txtMd, cursor: "pointer" }}>{item}</div>
                  ))}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>

      {/* Community */}
      <div style={{ padding: "80px 24px", background: C.green }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <p style={{ fontFamily: SN, fontSize: 12, letterSpacing: 3, color: C.greenLt, textTransform: "uppercase", fontWeight: 600, marginBottom: 12 }}>You're Not Alone in This</p>
              <h2 style={{ fontFamily: SF, fontSize: "clamp(28px, 5vw, 42px)", color: C.white, fontWeight: 600, margin: "0 0 12px", lineHeight: 1.2 }}>400,000+ Families. One Truth.</h2>
            </div>
          </FadeIn>
          <div style={{ maxWidth: 700, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            {[
              { title: "The Podcast", desc: "Real conversations about loving someone through addiction. No sugarcoating." },
              { title: "The Book", desc: "The survival guide families and people in recovery are both reading." },
              { title: "Weekly Emails", desc: "Tools, scripts, and encouragement delivered when you need it most." },
              { title: "The Community", desc: "Families who understand. You don't have to explain yourself here." },
            ].map((c, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div style={{ background: `${C.white}18`, borderRadius: 12, padding: 24, border: `1px solid ${C.greenMd}`, cursor: "pointer", backdropFilter: "blur(4px)", height: "100%" }}>
                  <h4 style={{ fontFamily: SF, fontSize: 18, color: C.white, fontWeight: 600, marginBottom: 8 }}>{c.title}</h4>
                  <p style={{ fontFamily: SN, fontSize: 14, color: C.greenLt, lineHeight: 1.6, margin: 0 }}>{c.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>

      {/* For Professionals */}
      <div style={{ padding: "80px 24px", background: C.cream }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <p style={{ fontFamily: SN, fontSize: 12, letterSpacing: 3, color: C.green, textTransform: "uppercase", fontWeight: 600, marginBottom: 12 }}>For Treatment Centers and Professionals</p>
              <h2 style={{ fontFamily: SF, fontSize: "clamp(28px, 5vw, 42px)", color: C.txt, fontWeight: 600, margin: "0 0 12px", lineHeight: 1.2 }}>Bring This to Your Organization</h2>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div style={{ maxWidth: 700, margin: "0 auto" }}>
              <div style={{ background: C.white, border: `1px solid ${C.bdr}`, borderRadius: 16, padding: 36 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24, marginBottom: 32 }}>
                  {[
                    { title: "Curriculum Licensing", desc: "A comprehensive 6-week family program built on CRAFT, harm reduction, attachment theory, and lived experience." },
                    { title: "Speaking Engagements", desc: "Keynotes and workshops that challenge industry assumptions and change how organizations engage families." },
                    { title: "Staff Training", desc: "Help your team understand what families actually need, not what tradition tells us they need." },
                  ].map((s, i) => (
                    <div key={i}>
                      <h4 style={{ fontFamily: SF, fontSize: 17, color: C.green, fontWeight: 600, marginBottom: 8 }}>{s.title}</h4>
                      <p style={{ fontFamily: SN, fontSize: 14, color: C.txtMd, lineHeight: 1.55, margin: 0 }}>{s.desc}</p>
                    </div>
                  ))}
                </div>
                <div style={{ textAlign: "center" }}>
                  <button style={{ fontFamily: SN, padding: "16px 36px", background: C.green, color: C.white, border: "none", borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>Partner With Us</button>
                  <p style={{ fontFamily: SN, fontSize: 13, color: C.txtLt, marginTop: 12 }}>Brandi Mac, MSN, APRN, ACNP-BC</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Last Call Lens */}
      <div style={{ padding: "80px 24px", background: C.greenDk }}>
        <FadeIn>
          <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
            <p style={{ fontFamily: SF, fontSize: "clamp(24px, 5vw, 36px)", color: C.greenTint, lineHeight: 1.4, margin: "0 0 16px", fontWeight: 400, fontStyle: "italic" }}>
              "If they died tomorrow, would I be at peace with how I loved them today?"
            </p>
            <p style={{ fontFamily: SN, fontSize: 15, color: C.greenMist, lineHeight: 1.6, marginBottom: 24 }}>That's the only question that matters. Everything we build here helps you answer it.</p>
            <a href="https://www.amazon.com/dp/B0F1MPN4CQ" target="_blank" rel="noopener noreferrer" style={{ fontFamily: SN, padding: "16px 32px", background: C.warm, color: C.white, border: "none", borderRadius: 8, fontSize: 16, fontWeight: 600, textDecoration: "none" }}>Get the Book</a>
          </div>
        </FadeIn>
      </div>

      {/* Footer */}
      <footer style={{ padding: "48px 24px 80px", textAlign: "center", background: C.green }}>
        <p style={{ fontFamily: SF, fontSize: 22, color: C.white, fontWeight: 600, marginBottom: 8 }}>Do What You Can Live With</p>
        <p style={{ fontFamily: SN, fontSize: 14, color: C.greenLt, maxWidth: 440, margin: "0 auto 24px", lineHeight: 1.6 }}>Because love and boundaries were never meant to be opposites.</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 24 }}>
          {["Facebook", "Instagram", "TikTok", "Podcast"].map(s => (
            <span key={s} style={{ fontFamily: SN, fontSize: 13, color: C.greenLt, cursor: "pointer" }}>{s}</span>
          ))}
        </div>
        <p style={{ fontFamily: SN, fontSize: 12, color: C.greenMist }}>© 2025 Brandi Mac. All rights reserved.</p>
      </footer>
    </div>
  );
}
