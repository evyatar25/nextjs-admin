import { Shield, CheckCircle, Star } from 'lucide-react'

const testimonials = [
  {
    name: 'דוד כהן',
    position: 'ראש עיריית תל אביב',
    content: 'מגן סיפקו לנו ייעוץ מקצועי ברמה הגבוהה ביותר. הפרויקט של התחדשות עירונית הושלם בזמן ובתקציב.',
    rating: 5
  },
  {
    name: 'רחל גולדברג',
    position: 'ראש מועצה מקומית רמת גן',
    content: 'הצוות של מגן הביא ניסיון רב וגישה יצירתית לפתרון אתגרי התשתיות שלנו. מומלץ בחום.',
    rating: 5
  },
  {
    name: 'יוסי אברהם',
    position: 'מנהל תכנון עיריית חיפה',
    content: 'שיתוף הפעולה עם מגן היה פורה ומקצועי. הם סייעו לנו בהכנת תכנית אב מורכבת בצורה יוצאת דופן.',
    rating: 5
  }
]

const certifications = [
  'תו תקן ISO 9001:2015',
  'רישיון יועץ סביבתי',
  'הסמכת מהנדסים מוסמכים',
  'אישור משרד הפנים'
]

export function Trust() {
  return (
    <section id="trust" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Certifications */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            אמון וביטחון
          </h2>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {certifications.map((cert, index) => (
              <div key={index} className="bg-white px-6 py-3 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <Shield size={16} className="text-green-600 ml-2" />
                  <span className="text-sm font-medium text-gray-900">{cert}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div>
          <h3 className="text-2xl font-semibold text-gray-900 text-center mb-12">
            מה אומרים הלקוחות שלנו
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-600 mb-4">
                  "{testimonial.content}"
                </blockquote>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.position}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 bg-white rounded-lg p-8 shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <CheckCircle size={32} className="text-green-600 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">אמינות מוכחת</h4>
              <p className="text-gray-600">מעל 15 שנות ניסיון בליווי רשויות מקומיות</p>
            </div>
            <div>
              <Shield size={32} className="text-blue-600 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">ביטחון מקצועי</h4>
              <p className="text-gray-600">כל הפרויקטים מבוטחים ומתועדים כנדרש</p>
            </div>
            <div>
              <Star size={32} className="text-yellow-600 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">שביעות רצון</h4>
              <p className="text-gray-600">100% מלקוחותינו ממליצים על שירותינו</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
import { useEffect, useState } from "react";

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