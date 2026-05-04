import { Building2, MapPin, Leaf, FileText } from 'lucide-react'

const services = [
  {
    icon: Building2,
    title: 'תכנון עירוני',
    description: 'תכניות אב, תכניות מפורטות והתחדשות עירונית'
  },
  {
    icon: MapPin,
    title: 'פיתוח תשתיות',
    description: 'תכנון ופיתוח תשתיות ציבוריות ותחבורתיות'
  },
  {
    icon: Leaf,
    title: 'ייעוץ סביבתי',
    description: 'תסקירי השפעה על הסביבה ותכניות קיימות'
  },
  {
    icon: FileText,
    title: 'ייעוץ כלכלי',
    description: 'תכניות כלכליות וייעוץ פיננסי לרשויות'
  }
]

export function Services() {
  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            השירותים שלנו
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            פתרונות מקצועיים ומותאמים אישית לרשויות מקומיות וארגונים ציבוריים
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon size={24} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600">
                  {service.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}