import { Zap, Clock3, Layers, Activity, BookOpen } from 'lucide-react'

const problems = [
  {
    icon: Zap,
    title: 'רשויות מפספסות קולות קוראים',
    description: 'הזדמנויות מימון רגישות לעתים קרובות נעלמות ללא מערכת עקבית.'
  },
  {
    icon: Clock3,
    title: 'אין זמן לניהול תהליכים',
    description: 'העומס היומי מקשה על מעקב והנעת פרויקטים בזמן.'
  },
  {
    icon: Layers,
    title: 'אין סדר תקציבי',
    description: 'תקציבים לא מתועדים ולא מנוהלים בהתאם ליעדים האסטרטגיים.'
  },
  {
    icon: Activity,
    title: 'אין מעקב שיטתי',
    description: 'בקשות ותהליכים נעלמים בין דואר, פגישות ותיקיות נייר.'
  },
  {
    icon: BookOpen,
    title: 'חוסר ידע מקצועי',
    description: 'לא תמיד ברור איך להכין בקשות ולהגיש תשתיות לרשויות ומשרדי הממשלה.'
  }
]

export function Problem() {
  return (
    <section id="problem" className="bg-slate-950 text-white py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-sm uppercase tracking-[0.3em] text-blue-300 mb-4">
            הכאב הגדול של הרשויות
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">מה מונע מהרשויות להתקדם?</h2>
          <p className="mt-4 max-w-2xl mx-auto text-slate-300">
            חוסר זמינות, סדר וידע עלולים לעלות ברשויות המקומיות במימון, תהליכים ותחרות על קולות קוראים.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {problems.map((problem, index) => {
            const Icon = problem.icon
            return (
              <div key={index} className="group rounded-3xl border border-slate-800 bg-slate-900/90 p-6 transition hover:border-blue-500 hover:bg-slate-900">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white mb-5">
                  <Icon size={22} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{problem.title}</h3>
                <p className="text-slate-400 leading-relaxed">{problem.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}