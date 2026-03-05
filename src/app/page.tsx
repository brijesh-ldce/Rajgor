import Link from "next/link";
import { Heart, Briefcase, Building2, Award, ArrowRight, ShieldCheck, Users, Star } from "lucide-react";

export default function LandingPage() {
  const modules = [
    {
      icon: Heart,
      titleGuj: "વિવાહ",
      titleEn: "Matrimony",
      desc: "સમાજના વિશ્વાસુ પરિવારો સાથે આદર્શ જીવનસાથી શોધો.",
      descEn: "Find your ideal life partner within trusted community families.",
      cardColor: "bg-rose-50 border-rose-100",
      iconBg: "bg-rose-100",
      iconColor: "text-rose-600",
    },
    {
      icon: Briefcase,
      titleGuj: "રોજગાર",
      titleEn: "Employment",
      desc: "સમાજની અંદર વિશ્વાસઘાટ નોકરીઓ શોધો કે પ્રતિભાવાન કર્મચારી채용 કરો.",
      descEn: "Find or offer trusted jobs within the Samaj community.",
      cardColor: "bg-sky-50 border-sky-100",
      iconBg: "bg-sky-100",
      iconColor: "text-sky-600",
    },
    {
      icon: Building2,
      titleGuj: "વ્યાપાર",
      titleEn: "Business",
      desc: "સામૂહિક ધંધા ખોળો, પ્રમોટ કરો, અને એકબીજાને સહાય-ઓફર કરો.",
      descEn: "Discover, promote, and support community businesses.",
      cardColor: "bg-violet-50 border-violet-100",
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
    },
    {
      icon: Award,
      titleGuj: "ગર્વ",
      titleEn: "Community Pride",
      desc: "સામૂહિક ઉત્કૃષ્ટ સભ્યો ઉજ્જ્વળ કરો, બૅજ જીતો, અને ટૉપ ૧૦ માં આવો.",
      descEn: "Celebrate achievers, earn badges, climb the leaderboard.",
      cardColor: "bg-amber-50 border-amber-100",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
  ];

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: "#FDF8F0" }}>

      {/* ── NAVBAR ── */}
      <header className="sticky top-0 z-50 bg-white border-b border-orange-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md"
              style={{ background: "linear-gradient(135deg, #E8650A, #8B1C1C)" }}
            >
              RB
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm leading-tight">રાજગોર બ્રાહ્મણ</p>
              <p className="text-[10px] text-gray-400 leading-tight font-medium">Rajgor Brahmin Samaj</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#modules" className="hover:text-orange-600 transition-colors">સેવાઓ</a>
            <a href="#how" className="hover:text-orange-600 transition-colors">કઈ રીતે?</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-semibold text-gray-700 border border-gray-200 px-4 py-2 rounded-lg hover:border-orange-400 hover:text-orange-600 transition-colors hidden sm:block"
            >
              પ્રવેશ કરો
            </Link>
            <Link
              href="/register"
              className="text-sm font-bold text-white px-4 py-2 rounded-lg shadow-md hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(135deg, #E8650A, #8B1C1C)" }}
            >
              સભ્ય બનો
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 pointer-events-none" style={{ background: "radial-gradient(circle, #E8650A, transparent)", transform: "translate(40%,-40%)" }} />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-15 pointer-events-none" style={{ background: "radial-gradient(circle, #8B1C1C, transparent)", transform: "translate(-40%,40%)" }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left">
              <span
                className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-full mb-6"
                style={{ backgroundColor: "#FEE9D5", color: "#C2530B" }}
              >
                🙏 &nbsp; ખાનગી પોર્ટલ · ચકાસાયેલ સભ્યો માટે
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-3" style={{ fontFamily: "'Noto Sans Gujarati', sans-serif" }}>
                આપણો સમાજ,
                <br />
                <span
                  style={{
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    backgroundImage: "linear-gradient(90deg, #E8650A, #8B1C1C)",
                    display: "inline-block",
                  }}
                >
                  એક મંચ.
                </span>
              </h1>
              <p className="text-sm text-gray-400 font-medium mb-4">Our Community, One Platform.</p>

              <p className="text-gray-500 text-base sm:text-lg max-w-lg mx-auto lg:mx-0 leading-relaxed mb-8" style={{ fontFamily: "'Noto Sans Gujarati', sans-serif" }}>
                <strong className="text-gray-800">રાજગોર બ્રાહ્મણ સમાજ</strong> માટે વિશ્વસનીય ડિજિટલ ઘર — વિવાહ, રોજગાર, વ્યાપાર, અને ગૌરવ માટે.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white shadow-lg hover:opacity-90 transition-opacity"
                  style={{ background: "linear-gradient(135deg, #E8650A, #8B1C1C)", fontFamily: "'Noto Sans Gujarati', sans-serif" }}
                >
                  સમાજમાં જોડાઓ <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-gray-700 bg-white border border-gray-200 shadow-sm hover:border-orange-400 hover:text-orange-600 transition-colors"
                  style={{ fontFamily: "'Noto Sans Gujarati', sans-serif" }}
                >
                  સભ્ય? પ્રવેશ કરો
                </Link>
              </div>

              {/* Trust badges */}
              <div className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start">
                {[
                  { icon: ShieldCheck, text: "આધાર-ચકાસાયેલ", color: "text-green-600", bg: "bg-green-50" },
                  { icon: Users, text: "Admin-Approved", color: "text-blue-600", bg: "bg-blue-50" },
                  { icon: Star, text: "ગર્વ-ઈનામ", color: "text-amber-600", bg: "bg-amber-50" },
                ].map((t) => (
                  <span key={t.text} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${t.bg} ${t.color}`}>
                    <t.icon className="w-3.5 h-3.5" /> {t.text}
                  </span>
                ))}
              </div>
            </div>

            {/* Right card grid */}
            <div className="flex-shrink-0 w-full max-w-xs grid grid-cols-2 gap-4">
              {[
                { labelGuj: "વિવાહ", labelEn: "Matrimony", emoji: "💍", sub: "300+ profiles", bg: "bg-rose-50 border-rose-100" },
                { labelGuj: "રોજગાર", labelEn: "Employment", emoji: "💼", sub: "50+ jobs", bg: "bg-sky-50 border-sky-100" },
                { labelGuj: "વ્યાપાર", labelEn: "Business", emoji: "🏪", sub: "80+ listings", bg: "bg-violet-50 border-violet-100" },
                { labelGuj: "ગર્વ", labelEn: "Pride", emoji: "🏆", sub: "Earn badges", bg: "bg-amber-50 border-amber-100" },
              ].map((card) => (
                <div
                  key={card.labelGuj}
                  className={`${card.bg} border rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300`}
                >
                  <div className="text-3xl mb-2">{card.emoji}</div>
                  <p className="font-bold text-gray-900 text-sm" style={{ fontFamily: "'Noto Sans Gujarati', sans-serif" }}>{card.labelGuj}</p>
                  <p className="text-xs text-gray-400">{card.labelEn}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{card.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MODULES ── */}
      <section id="modules" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900" style={{ fontFamily: "'Noto Sans Gujarati', sans-serif" }}>
              સમાજના ચાર સ્તંભ
            </h2>
            <p className="text-sm text-gray-400 mt-1 font-medium">Four Pillars of the Samaj</p>
            <p className="mt-3 text-gray-500 max-w-lg mx-auto text-sm">
              આ ખાનગી, ચકાસાયેલ મંચ પર તમારા સમાજ માટે જરૂરી બધું — એક જ જગ્યાએ.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((mod) => (
              <div
                key={mod.titleGuj}
                className={`${mod.cardColor} border rounded-2xl p-6 flex flex-col hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
              >
                <div className={`w-11 h-11 rounded-xl ${mod.iconBg} ${mod.iconColor} flex items-center justify-center mb-4`}>
                  <mod.icon className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-gray-900 text-xl leading-snug mb-0.5" style={{ fontFamily: "'Noto Sans Gujarati', sans-serif" }}>{mod.titleGuj}</h3>
                <p className="text-xs text-gray-400 font-medium mb-3">{mod.titleEn}</p>
                <p className="text-sm text-gray-600 leading-relaxed flex-1" style={{ fontFamily: "'Noto Sans Gujarati', sans-serif" }}>{mod.desc}</p>
                <p className="text-xs text-gray-400 mt-1 italic">{mod.descEn}</p>
                <Link
                  href="/register"
                  className="mt-5 inline-flex items-center gap-1 text-sm font-bold hover:gap-2 transition-all"
                  style={{ color: "#E8650A", fontFamily: "'Noto Sans Gujarati', sans-serif" }}
                >
                  જોડાઓ <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="py-20" style={{ backgroundColor: "#FDF8F0" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900" style={{ fontFamily: "'Noto Sans Gujarati', sans-serif" }}>
              કઈ રીતે જોડાવું?
            </h2>
            <p className="text-sm text-gray-400 mt-1 font-medium">How Does It Work?</p>
          </div>
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="hidden md:block absolute top-10 left-[22%] right-[22%] h-0.5" style={{ background: "linear-gradient(to right, #f4cda8, #E8650A44, #f4cda8)" }} />
            {[
              { step: "01", titleGuj: "નોંધણી કરો", titleEn: "Register & Upload", desc: "આપની માહિતી ભરો અને ઓળખ-ચকાસણી માટે આધાર કાર્ડ અપલોડ કરો.", emoji: "📝" },
              { step: "02", titleGuj: "Admin ચકાસશે", titleEn: "Admin Reviews", desc: "અમારી ટીમ ૨૪-૪૮ કલાકમાં તમારી અરજીની સમીક્ષા કરીને મંજૂરી આપશે.", emoji: "✅" },
              { step: "03", titleGuj: "સંપૂર્ણ ઉપયોગ", titleEn: "Full Access", desc: "વિવાહ, રોજગાર, વ્યાપાર, અને ગર્વ — બધા મૉડ્યૂલ ઉપયોગ કરો.", emoji: "🎉" },
            ].map((s) => (
              <div key={s.step} className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-white border border-orange-100 shadow-md flex items-center justify-center text-4xl mb-5 hover:-translate-y-2 transition-transform duration-300">
                  {s.emoji}
                </div>
                <span className="text-xs font-bold tracking-widest mb-1" style={{ color: "#E8650A99" }}>STEP {s.step}</span>
                <h3 className="text-base font-bold text-gray-900 mb-0.5" style={{ fontFamily: "'Noto Sans Gujarati', sans-serif" }}>{s.titleGuj}</h3>
                <p className="text-xs text-gray-400 font-medium mb-2">{s.titleEn}</p>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs" style={{ fontFamily: "'Noto Sans Gujarati', sans-serif" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900" style={{ fontFamily: "'Noto Sans Gujarati', sans-serif" }}>
              શા માટે જોડાવું?
            </h2>
            <p className="text-sm text-gray-400 mt-1 font-medium">Why Join Our Portal?</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: ShieldCheck, titleGuj: "ચકાસાયેલ સભ્યો", titleEn: "Verified Members Only", descGuj: "દરેક સભ્ય Admin ટીમ દ્વારા આધાર-ઓળખ ચકાસ્યા પછી જ પ્રવેશ મળે.", },
              { icon: Users, titleGuj: "સમાજ-પ્રથમ", titleEn: "Community First", descGuj: "ફક્ત રાજગોર બ્રાહ્મણ સમાજ માટે — ખાનગી, પ'ારિવારિક, ભરોસાપૂર્ણ." },
              { icon: Star, titleGuj: "ગૌરવ-ઇનામ", titleEn: "Earn Garv Badges", descGuj: "મદદ કરો, નોકરી પોસ્ટ કરો, ધંધો નોંધો — ગર્વ-બૅજ જીતો." },
            ].map((v) => (
              <div key={v.titleGuj} className="flex gap-4 p-6 rounded-2xl border border-gray-100 bg-gray-50 hover:shadow-md transition-shadow">
                <div className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#FEE9D5" }}>
                  <v.icon className="w-5 h-5" style={{ color: "#E8650A" }} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-0.5 text-sm" style={{ fontFamily: "'Noto Sans Gujarati', sans-serif" }}>{v.titleGuj}</h3>
                  <p className="text-xs text-gray-400 mb-1 font-medium">{v.titleEn}</p>
                  <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: "'Noto Sans Gujarati', sans-serif" }}>{v.descGuj}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 text-white relative overflow-hidden" style={{ background: "linear-gradient(135deg, #E8650A 0%, #8B1C1C 100%)" }}>
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-10 w-64 h-64 bg-yellow-400 rounded-full blur-3xl" />
        </div>
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#FFD6B0" }}>
            🙏 &nbsp; JOIN THE COMMUNITY
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-3 leading-tight" style={{ fontFamily: "'Noto Sans Gujarati', sans-serif" }}>
            આજે રાજગોર બ્રાહ્મણ
            <br />
            સમાજ સાથે જોડાઓ!
          </h2>
          <p className="text-sm font-medium mb-6" style={{ color: "#FFD6B0" }}>Join the Rajgor Brahmin Samaj Portal Today</p>
          <p className="mb-10 text-base max-w-lg mx-auto leading-relaxed" style={{ color: "#FFD6B0", fontFamily: "'Noto Sans Gujarati', sans-serif" }}>
            ચકાસાયેલ, વૃધ્ધિ-પામતા, અને સ્નેહ-ભર્યા સમુદાયનો ભાગ બનો. હમણાં જ નોંધાઓ.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white font-bold rounded-xl shadow-lg hover:bg-orange-50 transition-colors"
              style={{ color: "#8B1C1C", fontFamily: "'Noto Sans Gujarati', sans-serif" }}
            >
              સભ્ય તરીકે નોંધાઓ <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border-2 border-white/40 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
              style={{ fontFamily: "'Noto Sans Gujarati', sans-serif" }}
            >
              આગળ સભ્ય છો? પ્રવેશ કરો
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs"
              style={{ background: "linear-gradient(135deg, #E8650A, #8B1C1C)" }}
            >
              RB
            </div>
            <div>
              <span className="font-semibold text-white text-sm block" style={{ fontFamily: "'Noto Sans Gujarati', sans-serif" }}>રાજગોર બ્રાહ્મણ સમાજ પોર્ટલ</span>
              <span className="text-xs text-gray-500">Rajgor Brahmin Samaj Portal</span>
            </div>
          </div>
          <p className="text-xs text-center">
            © {new Date().getFullYear()} Rajgor Brahmin Samaj · A private, verified community portal.
          </p>
          <div className="flex gap-4 text-xs">
            <Link href="/login" className="hover:text-white transition-colors" style={{ fontFamily: "'Noto Sans Gujarati', sans-serif" }}>પ્રવેશ</Link>
            <Link href="/register" className="hover:text-white transition-colors" style={{ fontFamily: "'Noto Sans Gujarati', sans-serif" }}>નોંધણી</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
