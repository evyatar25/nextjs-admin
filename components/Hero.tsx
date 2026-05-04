import { ShieldCheck, Users, Clock3, FileText } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-6 py-24 lg:px-8">
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-blue-500/10 to-transparent" />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-8">
            <span className="inline-flex rounded-full bg-blue-600/20 px-4 py-1 text-sm font-semibold uppercase tracking-[0.3em] text-blue-200">ייעוץ ורשויות מקומיות</span>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
מיצוי תקציבי ממשלה
והגדלת הכנסות הרשויות
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-300">
חברה מובילה בתחום מיצוי תקציבים לרשויות מקומיות ,
<br /> מלווה משלב איתור התקציבים ועד מימוש מלא.            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <a href="#contact" className="inline-flex items-center justify-center rounded-full bg-blue-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400">
                השאירו פרטים
              </a>
              <a href="#solution" className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-950/80 px-8 py-4 text-base font-semibold text-white transition hover:border-blue-500">
                לשירותים שלנו
              </a>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-3xl bg-slate-900/80 px-4 py-5 text-center border border-slate-800">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white mb-3">
                  <ShieldCheck size={20} />
                </div>
                <p className="text-sm text-slate-300">ניהול זמנים ושקיפות</p>
              </div>
              <div className="rounded-3xl bg-slate-900/80 px-4 py-5 text-center border border-slate-800">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white mb-3">
                  <Users size={20} />
                </div>
                <p className="text-sm text-slate-300">צוות מומחי רשויות</p>
              </div>
              <div className="rounded-3xl bg-slate-900/80 px-4 py-5 text-center border border-slate-800">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white mb-3">
                  <Clock3 size={20} />
                </div>
                <p className="text-sm text-slate-300">חיסכון בזמן ובמשאבים</p>
              </div>
              <div className="rounded-3xl bg-slate-900/80 px-4 py-5 text-center border border-slate-800">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white mb-3">
                  <FileText size={20} />
                </div>
                <p className="text-sm text-slate-300">תמיכה בהגשות למשרדי ממשלה</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-slate-900/85 p-8 shadow-2xl shadow-slate-950/40">
            <div className="space-y-6">
              <div className="rounded-3xl bg-slate-950/90 p-6 border border-slate-800">
                <p className="text-sm uppercase tracking-[0.24em] text-blue-300 mb-3">פתרון מובנה לרשויות</p>
                <h2 className="text-2xl font-semibold text-white">כל הכלים לניהול ההזדמנויות והתקציבים במקום אחד</h2>
                <p className="mt-4 text-slate-400 leading-relaxed">
                  חיבור בין תוכנה לניהול פנימי, תהליך הגשה מקצועי וייעוץ תקציבי מדוייק לרשויות מקומיות.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-950/75 p-5 border border-slate-800">
                  <p className="text-xs uppercase tracking-[0.3em] text-blue-300 mb-2">הזדמנויות</p>
                  <p className="text-xl font-semibold text-white">איתור קולות קוראים</p>
                </div>
                <div className="rounded-3xl bg-slate-950/75 p-5 border border-slate-800">
                  <p className="text-xs uppercase tracking-[0.3em] text-blue-300 mb-2">ליווי</p>
                  <p className="text-xl font-semibold text-white">כתיבת בקשות מקצועיות</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}