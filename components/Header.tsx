'use client'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* לוגו */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold">
            מ
          </div>
          <span className="font-bold text-lg text-slate-900">
            מגן
          </span>
        </div>

        {/* ניווט */}
        <nav className="hidden md:flex gap-8 text-sm text-slate-600">
          <a href="#problems" className="hover:text-blue-600">האתגרים</a>
          <a href="#solution" className="hover:text-blue-600">הפתרון</a>
          <a href="#advantages" className="hover:text-blue-600">יתרונות</a>
          <a href="#clients" className="hover:text-blue-600">לקוחות</a>
          <a href="#contact" className="hover:text-blue-600">צור קשר</a>
        </nav>

        {/* כפתור */}
        <a
          href="#contact"
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-blue-500 transition"
        >
          קבל ייעוץ
        </a>

      </div>
    </header>
  )
}