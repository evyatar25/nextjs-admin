'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin } from 'lucide-react'
import { apiEndpoint } from '@/lib/api'

export function Contact() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    organization: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [submitError, setSubmitError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')
    setSubmitError('')

    try {
      const response = await fetch(apiEndpoint('leads'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitMessage('הפנייה נשלחה בהצלחה')
        setFormData({ fullName: '', phone: '', email: '', organization: '' })
      } else {
        setSubmitError(data.error || 'שגיאה בשליחת הפנייה')
      }
    } catch (error) {
      setSubmitError('שגיאה בחיבור לשרת')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <section id="contact" className="py-20 bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-[0.3em] text-blue-300 mb-3">השאירו פרטים ונחזור בהקדם</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">דאגו שהפניה של הרשות שלכם לא תתפספס</h2>
          <p className="mt-4 max-w-2xl mx-auto text-slate-400">
            קבלו מענה אישי ומקצועי לטיפול בקולות קוראים, תקציבים ובקשות מול גופים ציבוריים.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-xl shadow-slate-950/20">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm">
                <span className="text-slate-300">שם מלא</span>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                  placeholder="הכנס שם מלא"
                />
              </label>
              <label className="space-y-2 text-sm">
                <span className="text-slate-300">טלפון</span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                  placeholder="050-1234567"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm">
                <span className="text-slate-300">אימייל</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                  placeholder="email@example.com"
                />
              </label>
              <label className="space-y-2 text-sm">
                <span className="text-slate-300">רשות / ארגון</span>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                  placeholder="עיריית תל אביב"
                />
              </label>
            </div>

            {submitMessage && (
              <div className="rounded-2xl bg-green-500/10 border border-green-500/20 p-4">
                <p className="text-green-400 text-sm">{submitMessage}</p>
              </div>
            )}

            {submitError && (
              <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4">
                <p className="text-red-400 text-sm">{submitError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-blue-500 px-6 py-4 text-base font-semibold text-white transition hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'שולח...' : 'השאירו פרטים'}
            </button>
          </form>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-slate-300 shadow-xl shadow-slate-950/20">
            <div className="flex items-center gap-3 rounded-3xl bg-slate-950/80 px-4 py-3 mb-6">
              <Phone size={20} className="text-blue-400" />
              <div>
                <p className="text-sm text-slate-300">טלפון חירום מקצועי</p>
                <p className="font-semibold text-white">03-1234567</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-3xl bg-slate-950/80 px-4 py-3 mb-6">
              <Mail size={20} className="text-blue-400" />
              <div>
                <p className="text-sm text-slate-300">אימייל</p>
                <p className="font-semibold text-white">info@magen-consulting.co.il</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-3xl bg-slate-950/80 px-4 py-3">
              <MapPin size={20} className="text-blue-400" />
              <div>
                <p className="text-sm text-slate-300">כתובת</p>
                <p className="font-semibold text-white">רחוב הרצל 123, תל אביב</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
