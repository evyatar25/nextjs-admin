export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-center text-sm text-slate-400 md:flex-row md:items-center md:justify-between md:text-right">
        <div>
          <p className="font-medium text-white">מגן - ייעוץ מוניציפלי</p>
          <p>ליווי מקצועי לרשויות, קולות קוראים ופתרונות ניהול.</p>
        </div>

        <div className="flex flex-col gap-1">
          <a href="tel:0500000000" className="hover:text-blue-400">
            050-0000000
          </a>
          <a href="mailto:info@example.com" className="hover:text-blue-400">
            info@example.com
          </a>
        </div>
      </div>
    </footer>
  )
}