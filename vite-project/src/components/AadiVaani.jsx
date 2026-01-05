import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

// Icons
const MicIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);

const SwapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 10h14l-4-4" />
    <path d="M17 14H3l4 4" />
  </svg>
);

const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

// EXTENSIVE INDIAN LANGUAGES & GLOBAL SUPPORT
const LANGUAGES = [
  { code: "en", name: "English", voice: "en-US" },
  { code: "hi", name: "Hindi (हिन्दी)", voice: "hi-IN" },
  { code: "bn", name: "Bengali (বাংলা)", voice: "bn-IN" },
  { code: "mr", name: "Marathi (मराठी)", voice: "mr-IN" },
  { code: "te", name: "Telugu (తెలుగు)", voice: "te-IN" },
  { code: "ta", name: "Tamil (தமிழ்)", voice: "ta-IN" },
  { code: "gu", name: "Gujarati (ગુજરાતી)", voice: "gu-IN" },
  { code: "ur", name: "Urdu (اردو)", voice: "ur-IN" },
  { code: "kn", name: "Kannada (ಕನ್ನಡ)", voice: "kn-IN" },
  { code: "ml", name: "Malayalam (മലയാളം)", voice: "ml-IN" },
  { code: "pa", name: "Punjabi (ਪੰਜਾਬੀ)", voice: "pa-IN" },
  { code: "as", name: "Assamese (অসমীয়া)", voice: "as-IN" },
  { code: "or", name: "Odia (ଓଡ଼ିଆ)", voice: "or-IN" },
  { code: "ne", name: "Nepali (नेपाली)", voice: "ne-NP" },
  { code: "sa", name: "Sanskrit (संस्कृत)", voice: "sa-IN" },
  { code: "sd", name: "Sindhi (सिन्धी)", voice: "sd-IN" },
  { code: "kok", name: "Konkani (कोंकणी)", voice: "kok-IN" },
  { code: "mni", name: "Manipuri (Meiteilon)", voice: "mni-IN" },
  { code: "doi", name: "Dogri (डोगरी)", voice: "doi-IN" },
  { code: "brx", name: "Bodo (बड़ो)", voice: "brx-IN" },
  { code: "mai", name: "Maithili (मैथिली)", voice: "mai-IN" },
  { code: "sat", name: "Santali (ᱥᱟᱱᱛᱟᱲᱤ)", voice: "sat-IN" },
  { code: "ks", name: "Kashmiri (कश्मीरी)", voice: "ks-IN" },
  { code: "lus", name: "Mizo (Mizo ṭawng)", voice: "lus-IN" },

  // Expanded Regional & Tribal Support (2024+)
  { code: "awa", name: "Awadhi (अवधी)", voice: "hi-IN" },
  { code: "bho", name: "Bhojpuri (भोजपुरी)", voice: "hi-IN" },
  { code: "hne", name: "Chhatisgarhi (छत्तीसगढ़ी)", voice: "hi-IN" },
  { code: "kha", name: "Khasi (Ka Ktien Khasi)", voice: "en-IN" },
  { code: "trp", name: "Kokborok (ककबरक)", voice: "bn-IN" },
  { code: "mag", name: "Magahi (मगही)", voice: "hi-IN" },
  { code: "mwr", name: "Marwari (मारवाड़ी)", voice: "hi-IN" },
  { code: "tcy", name: "Tulu (ತುಳು)", voice: "kn-IN" },

  // Additional Global
  { code: "es", name: "Spanish", voice: "es-ES" },
  { code: "fr", name: "French", voice: "fr-FR" },
  { code: "de", name: "German", voice: "de-DE" },
  { code: "ja", name: "Japanese", voice: "ja-JP" },
  { code: "ko", name: "Korean", voice: "ko-KR" },
  { code: "zh-CN", name: "Chinese (Simp)", voice: "zh-CN" },
];

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.3 }}
    style={{ width: "100%" }}
  >
    {children}
  </motion.div>
);

export default function AadiVaani() {
  const [activeTab, setActiveTab] = useState("home");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("hi");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: "", email: "", query: "" });

  /* ---------- TRANSLATION API (Backend Proxy) ---------- */
  const translateText = async () => {
    if (!input) return;
    setLoading(true);
    try {
      // Use relative path - Vite proxy handles local, Vercel handles prod
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: input,
          source: sourceLang,
          target: targetLang
        })
      });

      const data = await response.json();

      if (data.translatedText) {
        setOutput(data.translatedText);
      } else {
        setOutput("Translation unavailable locally.");
      }
    } catch (err) {
      console.error(err);
      setOutput("Server connection failed. Ensure 'node server.js' is running.");
    }
    setLoading(false);
  };

  /* ---------- VOICE INPUT ---------- */
  const startVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    const langConfig = LANGUAGES.find((l) => l.code === sourceLang);
    recognition.lang = langConfig ? langConfig.voice : "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    setIsListening(true);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const copyToClipboard = (text) => {
    if (text) navigator.clipboard.writeText(text);
  };

  /* ---------- CONTACT FORM HANDLER ---------- */
  const handleContactChange = (e) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    const originalText = e.target.querySelector('button[type="submit"]').innerText;
    e.target.querySelector('button[type="submit"]').innerText = "Sending...";

    try {
      // Use relative path - Vite proxy handles local, Vercel handles prod
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      });

      if (response.ok) {
        alert("Query sent successfully! Ticket #ID-" + Date.now().toString().slice(-6));
        setContactForm({ name: "", email: "", query: "" });
      } else {
        alert("Failed to send message.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Backend server off. Run 'node server.js' in backend folder.");
    }
    e.target.querySelector('button[type="submit"]').innerText = originalText;
  };

  return (
    <div className="page">
      <motion.div
        className="glass-card"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* NAV */}
        <div className="nav">
          <div className="logo" onClick={() => setActiveTab("home")} style={{ cursor: 'pointer' }}>
            <img src="/logo.png" alt="Aadi-Vaani" style={{ height: '50px', objectFit: 'contain' }} />
          </div>
          <div className="nav-links">
            <span className={`nav-item ${activeTab === "home" ? "active" : ""}`} onClick={() => setActiveTab("home")}>Home</span>
            <span className={`nav-item ${activeTab === "about" ? "active" : ""}`} onClick={() => setActiveTab("about")}>About</span>
            <span className={`nav-item ${activeTab === "contact" ? "active" : ""}`} onClick={() => setActiveTab("contact")}>Contact</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "home" && (
            <PageTransition key="home">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h1 className="title">Bharatiya Anuvadak</h1>
                <p className="subtitle">
                  Empowering 1.4 Billion Indians with Instant Translation in {LANGUAGES.length}+ Native Languages 🇮🇳
                </p>
              </motion.div>

              <div className="translator-box">
                <motion.div className="lang-card" whileHover={{ scale: 1.02 }}>
                  <div className="card-header">
                    <select
                      className="lang-select"
                      value={sourceLang}
                      onChange={(e) => setSourceLang(e.target.value)}
                    >
                      {LANGUAGES.map((lang) => (
                        <option key={lang.code} value={lang.code}>{lang.name}</option>
                      ))}
                    </select>
                    <div className="control-btn" onClick={() => copyToClipboard(input)} title="Copy"><CopyIcon /></div>
                  </div>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter text or speak..."
                  />
                  <div className="input-controls">
                    <button className={`control-btn ${isListening ? "active" : ""}`} onClick={startVoice} title="Voice Input"><MicIcon /></button>
                  </div>
                </motion.div>

                <div className="swap-container">
                  <button
                    className="swap-btn"
                    onClick={() => {
                      const tempLang = sourceLang; setSourceLang(targetLang); setTargetLang(tempLang);
                      const tempText = input; setInput(output); setOutput(tempText);
                    }}
                    title="Swap"
                  >
                    <SwapIcon />
                  </button>
                </div>

                <motion.div className="lang-card" whileHover={{ scale: 1.02 }}>
                  <div className="card-header">
                    <select
                      className="lang-select"
                      value={targetLang}
                      onChange={(e) => setTargetLang(e.target.value)}
                    >
                      {LANGUAGES.map((lang) => (
                        <option key={lang.code} value={lang.code}>{lang.name}</option>
                      ))}
                    </select>
                    <div className="control-btn" onClick={() => copyToClipboard(output)} title="Copy"><CopyIcon /></div>
                  </div>
                  <textarea value={output} readOnly placeholder="Translation..." />
                </motion.div>
              </div>

              <div className="action-area">
                <button className="translate-btn" onClick={translateText} disabled={loading}>
                  {loading ? "Translating..." : "Translate Text"}
                </button>
              </div>
            </PageTransition>
          )}

          {activeTab === "about" && (
            <PageTransition key="about">
              <div className="info-container">
                <h1 className="title">About Aadi-Vaani</h1>
                <div className="about-grid">

                  <div className="info-card">
                    <h3>🇮🇳 Our Mission</h3>
                    <p>
                      "Aadi-Vaani" (First Voice) symbolizes the origin of communication. Our mission is to democratize information access by breaking linguistic barriers for every Indian citizen, ensuring technology speaks their language.
                    </p>
                  </div>

                  <div className="info-card">
                    <h3>🚀 Future Vision</h3>
                    <p>
                      We aim to integrate real-time document translation, offline voice mode for rural areas, and dialect-specific recognition models to cover the vast linguistic diversity of the subcontinent.
                    </p>
                  </div>

                  <div className="info-card">
                    <h3>🤖 Technology</h3>
                    <p>
                      Powered by advanced Neural Machine Translation (NMT) and scalable Node.js backend infrastructure, providing low-latency and context-aware translations securely.
                    </p>
                  </div>

                  <div className="info-card">
                    <h3>✨ Why AadiVaani?</h3>
                    <p>
                      Unlike generic tools, we prioritize regional Indian dialects and simple, accessible UX designed for the next billion users coming online.
                    </p>
                  </div>

                </div>
              </div>
            </PageTransition>
          )}

          {activeTab === "contact" && (
            <PageTransition key="contact">
              <div className="info-container">
                <h1 className="title">Contact Support</h1>
                <div className="info-card">
                  <p style={{ marginBottom: '1rem', color: 'rgba(255,255,255,0.8)' }}>
                    We value your feedback. Reach out to us for any issues or suggestions.
                  </p>
                  <div className="contact-item" style={{ marginBottom: '1.5rem' }}>
                    <strong>📍 Headquarters:</strong> New Delhi, Delhi, India
                  </div>
                  <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input
                      type="text" name="name" placeholder="Your Name" value={contactForm.name} onChange={handleContactChange} required
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                    />
                    <input
                      type="email" name="email" placeholder="Your Email ID" value={contactForm.email} onChange={handleContactChange} required
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                    />
                    <textarea
                      name="query" placeholder="Describe your problem or issue..." value={contactForm.query} onChange={handleContactChange} required rows="4"
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', resize: 'vertical' }}
                    />
                    <button type="submit" className="translate-btn">Send Message</button>
                  </form>
                </div>
              </div>
            </PageTransition>
          )}
        </AnimatePresence>

        {activeTab === "home" && (
          <div className="features">
            <div className="feature-pill"><MicIcon /> Voice Input</div>
            <div className="feature-pill"><span>🇮🇳</span> {LANGUAGES.length} Languages</div>
            <div className="feature-pill"><span>⚡</span> Neural AI</div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
