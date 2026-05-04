import { Users, Award, Target } from 'lucide-react'

const stats = [
  { number: '15+', label: 'שנות ניסיון' },
  { number: '50+', label: 'פרויקטים מוצלחים' },
  { number: '25+', label: 'רשויות לקוחות' },
  { number: '100%', label: 'שביעות רצון' }
]

export function About() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            אודותינו
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            מגן - ייעוץ מוניציפלי הוא שותף אמין לרשויות מקומיות בישראל.
            אנו מספקים פתרונות מקצועיים ומקיפים בתחומי התכנון העירוני,
            פיתוח התשתיות והייעוץ הסביבתי.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              המומחיות שלנו
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center ml-4 mt-1">
                  <Users size={16} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">צוות מקצועי</h4>
                  <p className="text-gray-600">צוות מומחים בעלי ניסיון רב בתחומי התכנון והייעוץ המוניציפלי</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center ml-4 mt-1">
                  <Award size={16} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">איכות מוכחת</h4>
                  <p className="text-gray-600">פרויקטים מוצלחים ושביעות רצון מלאה מלקוחותינו</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center ml-4 mt-1">
                  <Target size={16} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">גישה ממוקדת</h4>
                  <p className="text-gray-600">פתרונות מותאמים אישית לצרכים הספציפיים של כל רשות</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-8">
            <h4 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              המספרים מדברים בעד עצמם
            </h4>
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}