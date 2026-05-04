"use client";

import BackToTop from "@/components/BackToTop";
import { apiEndpoint } from "@/lib/api";
import { useEffect, useMemo, useState } from "react";
import LogosMarquee from "@/components/LogosMarquee";

type FormState = {
  fullName: string;
  phone: string;
  email: string;
  organization: string;
  servicePlan: string;
};

const initialForm: FormState = {
  fullName: "",
  phone: "",
  email: "",
  organization: "",
  servicePlan: "",
};

export default function HomePage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [openImage, setOpenImage] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [showTeam, setShowTeam] = useState(false);

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        threshold: 0.6,
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const stats = useMemo(
    () => [
      { label: "ליווי מלא", value: "360°" },
      { label: "התאמה לרשויות", value: "100%" },
      { label: "תהליך מסודר", value: "End-to-End" },
    ],
    [],
  );

  function validateForm() {
    const newErrors: Partial<FormState> = {};

    // שם מלא - רק אותיות בעברית/אנגלית ורווחים
    if (!form.fullName.trim()) {
      newErrors.fullName = "נא להזין שם מלא";
    } else if (!/^[א-תa-zA-Z\s]+$/.test(form.fullName)) {
      newErrors.fullName = "השם יכול להכיל אותיות בלבד";
    }

    // טלפון
    if (!form.phone.trim()) {
      newErrors.phone = "נא להזין מספר טלפון";
    } else if (!/^05\d{8}$/.test(form.phone)) {
      newErrors.phone = "מספר טלפון לא תקין";
    }

    // אימייל
    if (form.email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        newErrors.email = "אימייל לא תקין";
      }
    }

    // ארגון - בלי תווים מוזרים
    if (!form.organization.trim()) {
      newErrors.organization = "נא להזין שם רשות / ארגון";
    } else if (!/^[א-תa-zA-Z0-9\s]+$/.test(form.organization)) {
      newErrors.organization = "השם מכיל תווים לא חוקיים";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isSubmitting) return; // מונע דאבל קליק

    setIsSubmitting(true);
    setMessage("");
    setMessageType("");
    if (!form.fullName || !form.phone) {
      setMessage("נא למלא שם וטלפון");
      setMessageType("error");
      setIsSubmitting(false);
      if (!validateForm()) {
        setIsSubmitting(false);
        return;
      }
      return;
    }

    if (!/^05\d{8}$/.test(form.phone)) {
      setMessage("מספר טלפון לא תקין");
      setMessageType("error");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(apiEndpoint("leads"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      let data: any = null;

      try {
        data = await response.json();
      } catch {
        // אם אין JSON בכלל
        data = null;
      }

      if (!response.ok) {
        throw new Error(data?.error || "שליחת הטופס נכשלה. נסה שוב.");
      }

      setMessage(data?.message || "הפנייה נשלחה בהצלחה");
      setMessageType("success");
      setForm(initialForm);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "שגיאת רשת. בדוק חיבור ונסה שוב.";

      setMessage(errorMessage);
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-950" dir="rtl">
      <header className="absolute left-0 right-0 top-0 z-50">
        <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-6">
          {/* לוגו ימין */}
          <a href="#hero" className="flex w-52 justify-start">
            <img
              src="/logo magen new.png"
              alt="לוגו מגן"
              className="mt-7 h-15 w-auto object-contain"
            />
          </a>

          {/* ניווט מרכז */}
          <nav className="hidden flex-1 items-center justify-center gap-10 text-sm font-bold text-white/90 lg:flex">
            <NavLink id="hero" label="דף הבית" active={activeSection} />
            <NavLink id="problems" label="האתגרים" active={activeSection} />
            <NavLink id="solution" label="הפתרון" active={activeSection} />
            <NavLink id="kol-magen" label="קול מגן" active={activeSection} />
            <NavLink id="clients" label="לקוחות" active={activeSection} />
            <NavLink id="team" label="צוות" active={activeSection} />
            <NavLink id="contact" label="צור קשר" active={activeSection} />
          </nav>

          {/* כפתור שמאל */}
          <div className="flex w-52 justify-end">
            <a
              href="#contact"
              className="rounded-2xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            >
              קבל ייעוץ
            </a>
          </div>
        </div>
      </header>
      {/* ראשי */}
      <section
        id="hero"
        className="relative min-h-screen overflow-hidden bg-[#0B1A2B] text-white"
      >
        <div
          className="hero-city-bg absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero city.png')" }}
        />

        <div className="absolute inset-0 bg-slate-950/35" />
        <div className="absolute inset-0 bg-gradient-to-l from-slate-950/95 via-slate-950/70 to-slate-950/35" />
        <div className="section-data-grid absolute inset-0" />
        <div className="section-signal-dots absolute inset-0" />

        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center px-6 pt-32">
          <div className="w-full max-w-3xl text-right lg:translate-x-10 xl:translate-x-20 2xl:translate-x-28">
            <h1 className="text-4xl font-black leading-tight md:text-5xl xl:text-6xl">
              {" "}
              ניהול קולות קוראים
              <span className="block">בצורה חכמה ויעילה</span>
              <span className="block text-[#22D3EE]">
                משלב האיתור ועד <br />
                קבלת התקציב
              </span>
            </h1>

            <p className="mt-7 max-w-3xl text-xl leading-9 text-white/80 md:text-2xl">
              מערכת וליווי מקצועי לרשויות מקומיות, מועצות אזוריות וגופים
              ציבוריים. איתור הזדמנויות, כתיבת בקשות, הגשה מסודרת, מעקב וניהול
              תהליך מלא במקום אחד.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="#contact"
                className="rounded-2xl bg-[#22D3EE] px-8 py-4 text-base font-black text-slate-950 transition hover:bg-cyan-300"
              >
                בדיקת התאמה ללא התחייבות
              </a>
              <a
                href="#solution"
                className="rounded-2xl border border-white/20 bg-white/5 px-8 py-4 text-base font-bold text-white transition hover:bg-white/10"
              >
                איך זה עובד
              </a>
            </div>
          </div>
        </div>
      </section>
      {/* האתגרים */}
      <section
        id="problems"
        className="relative overflow-hidden bg-[#F8FAFC] py-28"
      >
        {/* רקע בסיס */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#F8FAFC] via-white to-slate-100" />

        {/* grain עדין (נותן מראה פרימיום) */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        <div className="section-data-grid absolute inset-0" />
        <div className="section-signal-dots absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <p className="text-sm font-black tracking-wide text-[#22D3EE]">
              האתגרים של הרשויות
            </p>

            <h2 className="mt-4 text-4xl font-black leading-tight text-slate-950 md:text-5xl">
              למה רשויות מפספסות תקציבים?
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              קולות קוראים, מסמכים, מועדים, דרישות ועדכונים - בלי תהליך מסודר,
              רשויות עלולות לפספס הזדמנויות תקציביות משמעותיות.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <FeatureCard
              number="01"
              title="פספוס קולות קוראים"
              text="הזדמנויות נפתחות ונסגרות מהר, ולעיתים אין מי שמזהה ומקדם אותן בזמן."
            />

            <FeatureCard
              number="02"
              title="חוסר זמן לניהול"
              text="הצוותים עמוסים במשימות שוטפות, והתהליך התקציבי נדחק הצידה."
            />

            <FeatureCard
              number="03"
              title="חוסר מעקב ובקרה"
              text="אין תמונת מצב ברורה לגבי בקשות, סטטוסים, השלמות ומועדי הגשה."
            />

            <FeatureCard
              number="04"
              title="קושי בהגשה מקצועית"
              text="הגשה לא מדויקת או חסרה עלולה לפגוע בסיכויי האישור והתקצוב."
            />
          </div>
        </div>
      </section>
      {/*פתרונות*/}
      <section
        id="solution"
        className="relative overflow-hidden bg-[#0B1A2B] py-28 text-white"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B1A2B] via-slate-950 to-slate-950" />
        <div className="section-data-grid absolute inset-0" />
        <div className="section-signal-dots absolute inset-0" />

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="mx-auto mb-16 max-w-4xl text-center">
            <p className="text-sm font-black text-[#22D3EE]">
              ליווי מקצועי לרשויות
            </p>

            <h2 className="mt-4 text-4xl font-black leading-tight text-white md:text-5xl">
              ניהול קולות קוראים בצורה מסודרת ומקצועית
              <span className="block text-[#22D3EE]">
                משלב האיתור ועד קבלת התקציב
              </span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-300">
              אנחנו מלווים רשויות מקומיות בתהליך מלא של איתור, כתיבה והגשה של
              קולות קוראים, יחד עם מערכת קטנה שמביאה סדר, שקיפות ובקרה חכמה.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <FeatureCard
              number="01"
              title="איתור הזדמנויות רלוונטיות"
              text="זיהוי קולות קוראים מתאימים לרשות מתוך מגוון מקורות ממשלתיים וציבוריים."
              variant="dark"
              compact
            />

            <FeatureCard
              number="02"
              title="כתיבה והגשה מקצועית"
              text="בניית בקשות, ריכוז מסמכים והגשה מסודרת לפי דרישות הקול הקורא."
              variant="dark"
              compact
            />

            <FeatureCard
              number="03"
              title="מעקב ובקרה שוטפים"
              text="שליטה מלאה על סטטוסים, מועדים ומשימות פתוחות לאורך כל התהליך."
              variant="dark"
              compact
            />

            <FeatureCard
              number="04"
              title="ניהול תהליך עקבי"
              text="מערכת עבודה מסודרת שמביאה סדר, שקיפות ותוצאות ברורות."
              variant="dark"
              compact
            />
          </div>
        </div>
      </section>

      {/*מערכת קול מגן*/}
      <section
        id="kol-magen"
        className="relative overflow-hidden bg-[#0F172A] py-28 text-white"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B1A2B] via-[#11243A] to-[#0B1A2B] opacity-80" />
        <div className="section-data-grid absolute inset-0" />
        <div className="section-signal-dots absolute inset-0" />

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="mx-auto mb-14 max-w-4xl text-center">
            <p className="text-sm font-black text-[#22D3EE]">מערכת קול מגן</p>
            <h2 className="mt-4 text-4xl font-black leading-tight text-white md:text-5xl">
              מערכת קול מגן ומסלולי שירות
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              מערכת חכמה לניהול תהליכי קולות קוראים, יחד עם מסלולי שירות ברורים
              שמתאימים לכל רשות ולכל שלב בתהליך.
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="grid gap-4">
              <p className="text-sm font-black uppercase tracking-[0.26em] text-cyan-200">
                3 מסלולי שירות
              </p>
              <FeatureCard
                number="1"
                title="מסלול בסיסי"
                text="מתן גישה למערכת קול מגן."
                variant="dark"
                compact
              />
              <FeatureCard
                number="2"
                title="מסלול מקצועי"
                text="מתן שירות, הגשת קולות קוראים, דיווחים ודוחות ביצוע שותפים ליווי מלא מהאיתור ועד הסגירה עם בקרה ושקיפות לאורך כל הדרך."
                variant="dark"
                compact
              />
              <FeatureCard
                number="3"
                title="מסלול מלא"
                text="מתן שירות מלא כולל תוכניות פיתוח מפעל הפיס."
                variant="dark"
                compact
              />
            </div>

            <div className="space-y-6">
              <div className="relative overflow-hidden rounded-[2rem] border border-slate-700 bg-slate-900/95 p-8 shadow-2xl">
                <div className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-br from-[#22D3EE]/10 via-[#22D3EE]/5 to-transparent blur-2xl" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-4 rounded-[1.5rem] border border-slate-700 bg-[#0B1A2B] px-6 py-4">
                    <div>
                      <p className="text-sm text-slate-400">Kol Magen System</p>
                      <p className="text-xl font-black text-white">
                        מערכת קול מגן
                      </p>
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-[1.75rem] bg-slate-100 mt-6">
                    <img
                      src="/system.png"
                      alt="מערכת קול מגן"
                      onClick={() => setOpenImage(true)}
                      className="w-full h-[400px] object-cover cursor-pointer"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center rounded-2xl bg-[#22D3EE] px-10 py-4 text-base font-black text-slate-950 shadow-xl shadow-[#22D3EE]/20 transition hover:bg-cyan-300"
                >
                  קבלו ייעוץ למסלול
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* הצוות שלנו */}
      <section
        id="team"
        className="relative overflow-hidden bg-[#F8FAFC] py-28"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#F8FAFC] via-white to-slate-100" />
        <div className="section-data-grid absolute inset-0" />
        <div className="section-signal-dots absolute inset-0" />

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <p className="text-sm font-black text-[#22D3EE]">הצוות שלנו</p>

            <h2 className="mt-4 text-4xl font-black leading-tight text-slate-950 md:text-5xl">
              האנשים שמלווים את התהליך
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              צוות מקצועי המשלב ניסיון, הבנה בתהליכי רשויות וליווי אישי לאורך כל
              הדרך.
            </p>
          </div>

          <div className="grid items-center gap-12 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-lg lg:grid-cols-2">
            <div className="order-2 text-right lg:order-1">
              <p className="text-sm font-black text-[#22D3EE]">מוביל תחום</p>

              <h3 className="mt-3 text-3xl font-black text-slate-950">
                אתי מגן
              </h3>

              <p className="mt-2 text-lg font-bold text-slate-600">
                מנכ"לית החברה{" "}
              </p>

              <p className="mt-5 leading-8 text-slate-600">
                בעלת ניסיון של כ־35 שנה בתחום מיצוי תקציבים. שימשה בעבר כמנהלת
                מחלקת תב"רים בעיריית קריית גת. כיום מובילה את תחום הדיווחים,
                התקציבים השוטפים והתב"רים, לצד ליווי פרויקטים בהתחדשות עירונית
                והסכמי גג.{" "}
              </p>

              <button
                type="button"
                onClick={() => setShowTeam((prev) => !prev)}
                className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-[#22D3EE] px-7 py-4 text-base font-black text-slate-950 shadow-lg transition hover:bg-cyan-300"
              >
                {showTeam ? "הסתר צוות" : "הצג את כל הצוות"}
                <span className={`transition ${showTeam ? "rotate-180" : ""}`}>
                  ↓
                </span>
              </button>
            </div>

            <div className="order-1 lg:order-2">
              <div className="relative overflow-hidden rounded-[2rem] shadow-2xl">
                <img
                  src="/office.png"
                  alt="אתי מגן"
                  className="h-[420px] w-full object-cover"
                />
              </div>
            </div>
          </div>

          {showTeam && (
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <TeamCard
                image="/office.png"
                name="לירון צור"
                role="כלכלנית, בעלת ניסיון בתחום הבקרה התקציבית."
                text="בעבר עבדה ככלכלנית באינטל ובמשרד החינוך, וכן שימשה כמורה במשך 12 שנים.
בנוסף, מנתחת התנהגות.
כיום עוסקת במגן ייעוץ בדיווחים למשרדי ממשלה ובבקרת תקציבים מול משרדי הממשלה והרשויות המקומיות."
              />

              <TeamCard
                image="/office.png"
                name="זוהר צור"
                role="כלכלן ויועץ בתחום מפעל הפיס"
                text="עוסק בליווי וייעוץ מקצועי למחלקות ברשויות המקומיות, ובסיוע בהכנת ובדיקת דוחות ביצוע שוטפים"
              />

              <TeamCard
                image="/office.png"
                name=" אביתר מיכאלי"
                role="יועץ מוניציפלי"
                text="אחראי על דיווחים למשרדי ממשלה וניהול העבודה מול פורטל ספקים.
עוסק בהכנת דוחות ביצוע ובניהול תחום הסייבר בארגון."
              />
            </div>
          )}
        </div>
      </section>
      {/*אמון מספרים*/}
      <section
        id="trust"
        className="relative overflow-hidden bg-[#0B1A2B] py-28 text-white"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_35%)]" />
        <div className="section-data-grid absolute inset-0" />
        <div className="section-signal-dots absolute inset-0" />

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="mb-16 max-w-3xl mx-auto text-center">
            <p className="inline-flex rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-bold text-[#22D3EE]">
              המספרים שלנו
            </p>
            <h2 className="mt-6 text-4xl font-black leading-tight md:text-5xl text-white">
              ניסיון מקצועי שמביא
              <span className="block text-[#22D3EE]">סדר, בקרה ותוצאות</span>
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              שילוב של ליווי מקצועי, תהליך עבודה מסודר ומערכת קול מגן מאפשר
              לרשויות לנהל קולות קוראים בצורה חכמה, שקופה ומבוקרת יותר.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <TrustCard
              value={
                <>
                  <Counter target={24} />
                </>
              }
              title="רשויות"
              text="רשויות מקומיות בליווי מלא"
            />
            <TrustCard
              value={
                <>
                  <Counter target={35} />
                </>
              }
              title="שנות ניסיון"
              text="ניסיון מצטבר בתחום המוניציפלי"
            />
            <TrustCard
              value={
                <>
                  <Counter target={3} />
                </>
              }
              title="מסלולי שירות"
              text=" התאמה מלאה לפי היקף הפעילות ורמת הליווי הנדרשת  "
            />
            <TrustCard
              value={"360°"}
              title="ליווי מלא"
              text="משלב האיתור ועד קבלת התקציב"
            />{" "}
          </div>
        </div>
      </section>
      {/* לקוחות ואמון */}
      <section
        id="clients"
        className="relative overflow-hidden bg-slate-100 py-24 text-slate-950"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-white to-slate-200" />
        <div className="section-data-grid absolute inset-0" />
        <div className="section-signal-dots absolute inset-0" />
        <div className="mx-auto max-w-7xl px-6">
          {/* כותרת */}
          <div className="relative z-10 mx-auto mb-14 max-w-3xl text-center">
            <p className="text-sm font-black text-[#22D3EE]">לקוחות ואמון</p>

            <h2 className="mt-4 text-4xl font-black text-slate-950 md:text-5xl">
              עובדים עם רשויות וגופים ציבוריים
            </h2>

            <p className="mt-6 text-lg text-slate-600">
              ניסיון מוכח בעבודה עם רשויות מקומיות וגופים ציבוריים
            </p>
          </div>

          {/* לוגואים בתנועה */}
          <div className="relative overflow-hidden">
            {/* fade */}
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-[#F8FAFC] to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-[#F8FAFC] to-transparent" />
            <p className="mb-6 text-center text-sm text-slate-500">
              בין הרשויות שעובדות איתנו:
            </p>
            {(() => {
              const logos = [
                { src: "/logos/elkana.png", alt: "מועצה מקומית אלקנה" },
                { src: "/logos/beer-yacov.png", alt: "מועצה מקומית באר יעקב" },
                { src: "/logos/ashkelon.png", alt: "עיריית אשקלון" },
                { src: "/logos/beit-arie.png", alt: "מועצה מקומית בית אריה" },
                { src: "/logos/even-yeuda.png", alt: "מועצה מקומית אבן יהודה" },
                { src: "/logos/gan-yavne.png", alt: "מועצה מקומית גן יבנה" },
                { src: "/logos/gderot-new.png", alt: "מועצה אזורית גדרות" },
                { src: "/logos/gedera-new.png", alt: "מועצה מקומית גדרה" },
                { src: "/logos/gezer.png", alt: "מועצה אזורית גזר" },
                { src: "/logos/hod-hasharon.png", alt: "עיריית הוד השרון" },
                {
                  src: "/logos/mevasert-tsion.png",
                  alt: "מועצה מקומית מבשרת ציון",
                },
                { src: "/logos/kiryat-ata.png", alt: "עיריית קריית אתא" },
                { src: "/logos/kfar-yona.png", alt: "עיריית כפר יונה" },
                {
                  src: "/logos/karni-shomron.png",
                  alt: "מועצה מקומית קרני שומרון",
                },
                {
                  src: "/logos/kadima-tsoran.png",
                  alt: "מועצה מקומית קדימה צורן",
                },
                { src: "/logos/rosh-haayin.png", alt: "עיריית ראש העין" },
                { src: "/logos/ramle.png", alt: "עיריית רמלה" },
                { src: "/logos/oranit.png", alt: "מועצה מקומית אורנית" },
                { src: "/logos/nesher.png", alt: "עיריית נשר" },
                { src: "/logos/migdal.png", alt: "מועצה מקומית מגדל" },
                { src: "/logos/yeruham.png", alt: "מועצה מקומית ירוחם" },
                { src: "/logos/tel-mond.png", alt: "מועצה מקומית תל מונד" },
                { src: "/logos/shafir.png", alt: "מועצה אזורית שפיר" },
                {
                  src: "/logos/shaar-shomron.png",
                  alt: "מועצה אזורית שער שומרון",
                },
              ];

              return (
                <div className="flex w-max animate-marquee gap-12 hover:[animation-play-state:paused]">
                  {[...logos, ...logos].map((logo, i) => (
                    <div
                      key={i}
                      className="flex h-28 w-48 shrink-0 items-center justify-center"
                    >
                      <img
                        src={logo.src}
                        alt={logo.alt}
                        className="max-h-20 max-w-full object-contain grayscale opacity-70 transition duration-300 hover:grayscale-0 hover:opacity-100"
                      />
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      </section>
      {/* יצירת קשר */}
      <section
        id="contact"
        className="relative overflow-hidden bg-[#0B1A2B] py-20 text-white"
      >
        <div className="section-data-grid absolute inset-0" />
        <div className="section-signal-dots absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="text-sm font-semibold text-[#22D3EE]">צור קשר</p>
              <h2 className="mt-3 text-3xl font-black text-white md:text-5xl">
                רוצה לבדוק התאמה לרשות שלך?
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                השאירו פרטים ונחזור אליכם כדי להבין את הצורך, לבדוק התאמה ולהציע
                דרך עבודה יעילה, מסודרת ומעשית.
              </p>

              <div className="mt-8 space-y-4">
                <InfoRow
                  title="למי זה מתאים"
                  text="רשויות מקומיות, מועצות אזוריות, מועצות מקומיות וגופים ציבוריים."
                  dark
                />
                <InfoRow
                  title="מה מקבלים"
                  text="ליווי מקצועי, חשיבה אסטרטגית וניהול תהליך ברור."
                  dark
                />
                <InfoRow
                  title="שלב ראשון"
                  text="שיחת היכרות קצרה ובדיקת התאמה ללא התחייבות."
                  dark
                />
              </div>
            </div>
            <form
              onSubmit={handleSubmit}
              className="rounded-[2rem] border border-slate-700 bg-slate-900/95 p-8 shadow-lg"
            >
              <div className="grid gap-5">
                <FieldLabel title="שם מלא">
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => {
                      updateField("fullName", e.target.value);
                      setErrors((prev) => ({ ...prev, fullName: "" }));
                    }}
                    className={`w-full rounded-2xl border bg-slate-800 px-4 py-3 text-slate-200 text-right outline-none placeholder:text-slate-400 transition ${
                      errors.fullName
                        ? "border-red-400 bg-red-50 focus:border-red-500"
                        : "border-slate-600 focus:border-[#22D3EE]"
                    }`}
                    placeholder="הכנס שם מלא"
                  />
                  {errors.fullName && (
                    <p className="mt-2 text-sm font-medium text-red-500">
                      {errors.fullName}
                    </p>
                  )}
                </FieldLabel>

                <FieldLabel title="טלפון">
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={form.phone}
                    onChange={(e) => {
                      const onlyNumbers = e.target.value.replace(/\D/g, "");
                      updateField("phone", onlyNumbers);
                      setErrors((prev) => ({ ...prev, phone: "" }));
                    }}
                    className={`w-full rounded-2xl border bg-slate-800 px-4 py-3 text-slate-200 text-right outline-none placeholder:text-slate-400 transition ${
                      errors.phone
                        ? "border-red-400 bg-red-50 focus:border-red-500"
                        : "border-slate-600 focus:border-[#22D3EE]"
                    }`}
                    placeholder="הכנס מספר טלפון"
                  />
                  {errors.phone && (
                    <p className="mt-2 text-sm font-medium text-red-500">
                      {errors.phone}
                    </p>
                  )}
                </FieldLabel>

                <FieldLabel title="אימייל">
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => {
                      updateField("email", e.target.value);
                      setErrors((prev) => ({ ...prev, email: "" }));
                    }}
                    className={`w-full rounded-2xl border bg-slate-800 px-4 py-3 text-slate-200 text-right outline-none placeholder:text-slate-400 transition ${
                      errors.email
                        ? "border-red-400 bg-red-50 focus:border-red-500"
                        : "border-slate-600 focus:border-[#22D3EE]"
                    }`}
                    placeholder="הכנס כתובת אימייל"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm font-medium text-red-500">
                      {errors.email}
                    </p>
                  )}
                </FieldLabel>

                <FieldLabel title="רשות / ארגון">
                  <input
                    type="text"
                    value={form.organization}
                    onChange={(e) => {
                      updateField("organization", e.target.value);
                      setErrors((prev) => ({ ...prev, organization: "" }));
                    }}
                    className={`w-full rounded-2xl border bg-slate-800 px-4 py-3 text-slate-200 text-right outline-none placeholder:text-slate-400 transition ${
                      errors.organization
                        ? "border-red-400 bg-red-50 focus:border-red-500"
                        : "border-slate-600 focus:border-[#22D3EE]"
                    }`}
                    placeholder="שם הרשות או הארגון"
                  />
                  {errors.organization && (
                    <p className="mt-2 text-sm font-medium text-red-500">
                      {errors.organization}
                    </p>
                  )}
                </FieldLabel>

                <FieldLabel title="בחר מסלול שירות">
                  <select
                    value={form.servicePlan}
                    onChange={(e) => updateField("servicePlan", e.target.value)}
                    className="w-full rounded-2xl border bg-slate-800 px-4 py-3 text-slate-200 text-right outline-none placeholder:text-slate-400 transition border-slate-600 focus:border-[#22D3EE]"
                  >
                    <option value="" disabled hidden>
                      בחר מסלול שירות
                    </option>
                    <option value="basic">מסלול בסיסי</option>
                    <option value="professional">מסלול מקצועי</option>
                    <option value="full">מסלול מלא</option>
                  </select>
                </FieldLabel>

                {message ? (
                  <div
                    className={`rounded-2xl border px-4 py-3 text-sm ${
                      messageType === "success"
                        ? "border-green-200 bg-green-50 text-green-700"
                        : "border-red-200 bg-red-50 text-red-700"
                    }`}
                  >
                    {message}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-2xl bg-[#22D3EE] px-6 py-4 text-base font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "שולח..." : "שלחו לי פרטים"}
                </button>
              </div>
            </form>{" "}
          </div>
        </div>
      </section>
      {/* תחתית  */}
      <footer className="border-t border-white/10 bg-[#0B1A2B]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-300 md:flex-row md:items-center md:justify-between">
          <p>© מגן - ליווי וייעוץ מוניציפלי</p>
          <div className="flex gap-6">
            <a href="#problems" className="hover:text-[#22D3EE]">
              האתגרים
            </a>
            <a href="#solution" className="hover:text-[#22D3EE]">
              הפתרון
            </a>
            <a href="#kol-magen" className="hover:text-[#22D3EE]">
              קול מגן
            </a>
            <a href="#team" className="hover:text-[#22D3EE]">
              צוות
            </a>
            <a href="#clients" className="hover:text-[#22D3EE]">
              לקוחות
            </a>
          </div>
        </div>
      </footer>
      <BackToTop />
      {openImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setOpenImage(false)}
        >
          <img
            src="/system.png"
            className="max-h-[90%] max-w-[90%] rounded-xl shadow-2xl"
          />
        </div>
      )}
    </main>
  );
}

function FeatureCard({
  number,
  title,
  text,
  variant = "light",
  compact = false,
}: {
  number: string;
  title: string;
  text: string;
  variant?: "light" | "dark";
  compact?: boolean;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-[2rem] border ${
        compact ? "p-5" : "p-7"
      } shadow-sm transition duration-300 hover:-translate-y-2 hover:border-[#22D3EE] hover:shadow-xl ${
        variant === "dark"
          ? "border-slate-700 bg-slate-800/95"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="absolute -left-2 top-4 text-7xl font-black text-slate-100 transition duration-300 group-hover:text-[#22D3EE]/50">
        {number}
      </div>

      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-[#22D3EE] via-[#22D3EE] to-[#22D3EE] opacity-0 transition duration-300 group-hover:opacity-100" />

      <div
        className={`relative mb-8 flex items-center justify-center rounded-2xl bg-[#22D3EE] text-sm font-black text-slate-950 shadow-lg transition duration-300 group-hover:scale-110 group-hover:bg-cyan-300 ${
          compact ? "h-12 w-12" : "h-14 w-14"
        }`}
      >
        {number}
      </div>

      <h3
        className={`relative ${compact ? "text-lg" : "text-xl"} font-black transition duration-300 group-hover:text-[#22D3EE] ${
          variant === "dark" ? "text-white" : "text-slate-950"
        }`}
      >
        {title}
      </h3>

      <p
        className={`relative mt-4 leading-7 ${
          variant === "dark" ? "text-slate-300" : "text-slate-600"
        }`}
      >
        {text}
      </p>
    </div>
  );
}
function ProcessRow({
  title,
  status,
  color,
}: {
  title: string;
  status: string;
  color: "green" | "yellow" | "blue";
}) {
  const colors = {
    green: "border-[#22D3EE]/30 bg-[#22D3EE]/10 text-[#22D3EE]",
    yellow: "border-[#22D3EE]/30 bg-[#22D3EE]/10 text-[#22D3EE]",
    blue: "border-[#22D3EE]/30 bg-[#22D3EE]/10 text-[#22D3EE]",
  };

  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 p-4">
      <p className="font-bold text-white">{title}</p>
      <span
        className={`rounded-full border px-3 py-1 text-xs font-bold ${colors[color]}`}
      >
        {status}
      </span>
    </div>
  );
}

function AdvantageCard({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-7 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-2 hover:border-cyan-300/50 hover:bg-white/10 hover:shadow-2xl hover:shadow-cyan-500/10">
      <div className="absolute -left-2 top-4 text-7xl font-black text-white/5 transition duration-300 group-hover:text-cyan-400/10">
        {number}
      </div>

      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-[#22D3EE] via-[#22D3EE] to-[#22D3EE] opacity-0 transition duration-300 group-hover:opacity-100" />

      <div className="relative mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#22D3EE]/10 text-sm font-black text-[#22D3EE] ring-1 ring-[#22D3EE]/20 transition duration-300 group-hover:scale-110 group-hover:bg-[#22D3EE] group-hover:text-slate-950">
        {number}
      </div>

      <h3 className="relative text-xl font-black text-white">{title}</h3>

      <p className="relative mt-4 leading-7 text-slate-300">{text}</p>
    </div>
  );
}
function TrustCard({
  value,
  title,
  text,
}: {
  value: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-[2rem] border border-slate-600 bg-slate-800/95 p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-[#22D3EE] hover:shadow-xl">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-[#22D3EE] via-[#22D3EE] to-[#22D3EE] opacity-0 transition duration-300 group-hover:opacity-100" />

      <p className="text-4xl font-black text-slate-100">{value}</p>
      <h3 className="mt-5 text-xl font-black text-slate-100">{title}</h3>
      <p className="mt-4 leading-7 text-slate-300">{text}</p>
    </div>
  );
}
function InfoRow({
  title,
  text,
  dark = false,
}: {
  title: string;
  text: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm ${
        dark
          ? "border-white/10 bg-white/5 text-white"
          : "border-slate-200 bg-white text-slate-950"
      }`}
    >
      <h3
        className={`text-base font-bold ${dark ? "text-white" : "text-slate-950"}`}
      >
        {title}
      </h3>
      <p
        className={`mt-2 leading-7 ${dark ? "text-slate-300" : "text-slate-600"}`}
      >
        {text}
      </p>
    </div>
  );
}

function FieldLabel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-white">{title}</span>
      {children}
    </label>
  );
}

function Counter({ target }: { target: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500; // זמן האנימציה (ms)
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
      start += increment;

      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target]);

  return <span>{count}</span>;
}

function NavLink({
  id,
  label,
  active,
}: {
  id: string;
  label: string;
  active: string;
}) {
  const isActive = active === id;

  return (
    <a
      href={`#${id}`}
      className={`transition ${
        isActive
          ? "text-cyan-300 border-b-2 border-cyan-300 pb-1"
          : "hover:text-cyan-300"
      }`}
    >
      {label}
    </a>
  );
}
function TeamCard({
  image,
  name,
  role,
  text,
}: {
  image: string;
  name: string;
  role: string;
  text: string;
}) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:border-[#22D3EE] hover:shadow-xl">
      <img src={image} alt={name} className="h-64 w-full object-cover" />

      <div className="p-6 text-right">
        <h3 className="text-xl font-black text-slate-950">{name}</h3>
        <p className="mt-1 font-bold text-[#22D3EE]">{role}</p>
        <p className="mt-4 leading-7 text-slate-600">{text}</p>
      </div>
    </div>
  );
}
