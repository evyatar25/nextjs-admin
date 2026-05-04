import { Server, LifeBuoy, BarChart3, FileText, ShieldCheck } from 'lucide-react'

const solutions = [
  {
    icon: Server,
    title: 'מערכת תוכנה חכמה',
    description: 'כל הכלים לניהול קולות קוראים, תקציבים וניהול פניות במקום אחד.'
  },
  {
    icon: LifeBuoy,
    title: 'ייעוץ לרשויות',
    description: 'ליווי מקצועי בבניית תוכניות ומענה למכרזים ממשלתיים.'
  },
  {
    icon: BarChart3,
    title: 'ליווי תקציבי',
    description: 'בניית מודלים תקציביים ושיפור סדר תזרימי מבוקר.'
  },
  {
    icon: FileText,
    title: 'ניהול קולות קוראים',
    description: 'איתור, ניהול והגשה של קולות קוראים רלוונטיים למערכת שלכם.'
  },
  {
    icon: ShieldCheck,
    title: 'כתיבת בקשות מקצועיות',
    description: 'הכנת מסמכים מקצועיים וניסוח חזק מול משרדי ממשלה.'
  }
]

export function Solution() {
  return (
    <section id="solution" className="py-20 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-sm uppercase tracking-[0.3em] text-blue-300 mb-4">
            הפתרון שלנו
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">איך אנחנו מסייעים לרשויות להתקדם</h2>
          <p className="mt-4 max-w-2xl mx-auto text-slate-400">
            פתרון משולב של תוכנה וייעוץ למימוש הזדמנויות תקציביות, ניהול קולות קוראים וכתיבת בקשות מקצועיות.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {solutions.map((solution, index) => {
            const Icon = solution.icon
            return (
              <div key={index} className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6 hover:border-blue-500 transition">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white mb-5">
                  <Icon size={22} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{solution.title}</h3>
                <p className="text-slate-400 leading-relaxed">{solution.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}