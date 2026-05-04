'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiEndpoint } from '@/lib/api'

type Lead = {
  id: string
  name: string
  phone: string
  email: string
  organization: string
  servicePlan: string
  status: string
  createdAt: string
}

function getStatusClass(status: string) {
  switch (status) {
    case 'חדשה':
      return 'border-blue-500/30 bg-blue-500/15 text-blue-300'
    case 'בטיפול':
      return 'border-yellow-500/30 bg-yellow-500/15 text-yellow-300'
    case 'נסגרה':
      return 'border-green-500/30 bg-green-500/15 text-green-300'
    case 'לא רלוונטית':
      return 'border-red-500/30 bg-red-500/15 text-red-300'
    default:
      return 'border-slate-500/30 bg-slate-500/15 text-slate-300'
  }
}

function getWhatsAppShareUrl(lead: Lead) {
  const message = [
    'פנייה חדשה מאתר מגן',
    '',
    `שם: ${lead.name}`,
    `טלפון: ${lead.phone}`,
    `אימייל: ${lead.email || 'לא צוין'}`,
    `רשות / ארגון: ${lead.organization}`,
    `מסלול נבחר: ${lead.servicePlan}`,
    `סטטוס: ${lead.status}`,
    `תאריך: ${lead.createdAt}`,
  ].join('\n')

  return `https://wa.me/?text=${encodeURIComponent(message)}`
}

export default function AdminLeadsPage() {
  const router = useRouter()

  const [leads, setLeads] = useState<Lead[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('הכל')
  const [loading, setLoading] = useState(true)
  const [updatingLeadId, setUpdatingLeadId] = useState<string | null>(null)
  const [deletingLeadId, setDeletingLeadId] = useState<string | null>(null)
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([])

  async function loadLeads() {
    try {
      setLoading(true)
      const response = await fetch(apiEndpoint('leads'), { cache: 'no-store' })
      if (response.status === 401) {
        router.push('/login')
        router.refresh()
        return
      }
      const data = await response.json()
      setLeads(data.leads || [])
    } catch (error) {
      console.error('Failed to load leads:', error)
      setLeads([])
    } finally {
      setLoading(false)
    }
  }

  async function updateLeadStatus(id: string, status: string) {
    try {
      setUpdatingLeadId(id)

      const response = await fetch(apiEndpoint('leads'), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status }),
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === id ? { ...lead, status } : lead
        )
      )
    } catch (error) {
      console.error('Failed to update lead status:', error)
      await loadLeads()
    } finally {
      setUpdatingLeadId(null)
    }
  }

  async function deleteLead(id: string) {
    const confirmed = window.confirm('האם למחוק את הפנייה הזו?')
    if (!confirmed) return

    try {
      setDeletingLeadId(id)

      const response = await fetch(apiEndpoint('leads'), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) {
        throw new Error('Failed to delete lead')
      }

      setLeads((prev) => prev.filter((lead) => lead.id !== id))
      setSelectedLeadIds((prev) => prev.filter((leadId) => leadId !== id))
    } catch (error) {
      console.error('Failed to delete lead:', error)
      await loadLeads()
    } finally {
      setDeletingLeadId(null)
    }
  }

  async function deleteSelectedLeads() {
    if (selectedLeadIds.length === 0) return

    const confirmed = window.confirm(`למחוק ${selectedLeadIds.length} פניות?`)
    if (!confirmed) return

    try {
      for (const id of selectedLeadIds) {
        await fetch(apiEndpoint('leads'), {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        })
      }

      setLeads((prev) => prev.filter((lead) => !selectedLeadIds.includes(lead.id)))
      setSelectedLeadIds([])
    } catch (error) {
      console.error('Failed to delete selected leads:', error)
      await loadLeads()
    }
  }

  async function updateSelectedLeadsStatus(status: string) {
    if (selectedLeadIds.length === 0) return

    try {
      for (const id of selectedLeadIds) {
        await fetch(apiEndpoint('leads'), {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id, status }),
        })
      }

      setLeads((prev) =>
        prev.map((lead) =>
          selectedLeadIds.includes(lead.id) ? { ...lead, status } : lead
        )
      )

      setSelectedLeadIds([])
    } catch (error) {
      console.error('Failed to update selected leads:', error)
      await loadLeads()
    }
  }

  function toggleLeadSelection(id: string) {
    setSelectedLeadIds((prev) =>
      prev.includes(id)
        ? prev.filter((leadId) => leadId !== id)
        : [...prev, id]
    )
  }

  function toggleSelectAllVisible() {
    const visibleIds = filteredLeads.map((lead) => lead.id)

    const allVisibleSelected =
      visibleIds.length > 0 &&
      visibleIds.every((id) => selectedLeadIds.includes(id))

    if (allVisibleSelected) {
      setSelectedLeadIds((prev) =>
        prev.filter((id) => !visibleIds.includes(id))
      )
    } else {
setSelectedLeadIds((prev) =>
  Array.from(new Set([...prev, ...visibleIds]))
)    }
  }

  async function handleLogout() {
    try {
      await fetch(apiEndpoint('logout'), {
        method: 'POST',
      })

      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  useEffect(() => {
    loadLeads()
  }, [])

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const q = search.trim().toLowerCase()

      const matchesSearch =
        !q ||
        lead.name.toLowerCase().includes(q) ||
        lead.phone.toLowerCase().includes(q) ||
        lead.email.toLowerCase().includes(q) ||
        lead.organization.toLowerCase().includes(q) ||
        lead.servicePlan.toLowerCase().includes(q)

      const matchesStatus =
        statusFilter === 'הכל' ? true : lead.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [leads, search, statusFilter])

  const allVisibleSelected =
    filteredLeads.length > 0 &&
    filteredLeads.every((lead) => selectedLeadIds.includes(lead.id))

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white" dir="rtl">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
  <div>
    <p className="text-xs uppercase tracking-widest text-blue-400">Dashboard</p>
    <h1 className="text-4xl font-bold text-white">ניהול לידים</h1>
    <p className="mt-2 text-sm text-slate-400">
      שליטה מלאה על כל הפניות שמגיעות מהאתר
    </p>
  </div>

  <div className="flex items-center gap-3">
    <div className="hidden rounded-xl border border-green-500/30 bg-green-500/10 px-3 py-2 text-xs text-green-300 md:block">
      מערכת פעילה
    </div>

    <button
      onClick={loadLeads}
      className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
    >
      רענן
    </button>

    <button
      onClick={handleLogout}
      className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
    >
      התנתקות
    </button>
  </div>
</div>

<div className="mb-8 grid gap-4 md:grid-cols-4">
  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
    <p className="text-sm text-slate-400">סה"כ פניות</p>
    <p className="mt-2 text-2xl font-bold text-white">{leads.length}</p>
  </div>

  <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4">
    <p className="text-sm text-blue-300">חדשות</p>
    <p className="mt-2 text-2xl font-bold text-white">
      {leads.filter(l => l.status === 'חדשה').length}
    </p>
  </div>

  <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4">
    <p className="text-sm text-yellow-300">בטיפול</p>
    <p className="mt-2 text-2xl font-bold text-white">
      {leads.filter(l => l.status === 'בטיפול').length}
    </p>
  </div>

  <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-4">
    <p className="text-sm text-green-300">נסגרו</p>
    <p className="mt-2 text-2xl font-bold text-white">
      {leads.filter(l => l.status === 'נסגרה').length}
    </p>
  </div>
</div>

<div className="mb-8 grid gap-4 md:grid-cols-3">
            <input
            type="text"
            placeholder="חיפוש לפי שם, טלפון, אימייל או ארגון"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
            
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
          >
            <option>הכל</option>
            <option value="חדשה">חדשה</option>
            <option value="בטיפול">בטיפול</option>
            <option value="נסגרה">נסגרה</option>
            <option value="לא רלוונטית">לא רלוונטית</option>
          </select>

          <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-300">
            סך פניות: <span className="font-bold text-white">{filteredLeads.length}</span>
          </div>
        </div>

        {selectedLeadIds.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3">
            <span className="text-sm text-slate-300">
              נבחרו {selectedLeadIds.length} פניות
            </span>

            <button
              onClick={() => updateSelectedLeadsStatus('בטיפול')}
              className="rounded-lg bg-yellow-500/15 px-3 py-2 text-sm font-medium text-yellow-300 hover:bg-yellow-500/25"
            >
              סמן כבטיפול
            </button>

            <button
              onClick={() => updateSelectedLeadsStatus('נסגרה')}
              className="rounded-lg bg-green-500/15 px-3 py-2 text-sm font-medium text-green-300 hover:bg-green-500/25"
            >
              סמן כנסגרה
            </button>

            <button
              onClick={deleteSelectedLeads}
              className="rounded-lg bg-red-500/15 px-3 py-2 text-sm font-medium text-red-300 hover:bg-red-500/25"
            >
              מחק נבחרות
            </button>
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          <div className="overflow-x-auto">
            <table className="min-w-full text-right">
              <thead className="bg-slate-800/60 text-sm text-slate-300">
                <tr>
                  <th className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={toggleSelectAllVisible}
                      className="h-4 w-4 accent-blue-600"
                    />
                  </th>
                  <th className="px-4 py-3">שם</th>
                  <th className="px-4 py-3">טלפון</th>
                  <th className="px-4 py-3">אימייל</th>
                  <th className="px-4 py-3">רשות / ארגון</th>
                  <th className="px-4 py-3">מסלול נבחר</th>
                  <th className="px-4 py-3">תאריך</th>
                  <th className="px-4 py-3">סטטוס</th>
                  <th className="px-4 py-3">פעולות</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-slate-400">
                      טוען פניות...
                    </td>
                  </tr>
                ) : filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-slate-400">
                      אין פניות להצגה
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="border-t border-slate-800 transition hover:bg-slate-800/40"
                    >
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedLeadIds.includes(lead.id)}
                          onChange={() => toggleLeadSelection(lead.id)}
                          className="h-4 w-4 accent-blue-600"
                        />
                      </td>
                      <td className="px-4 py-4 font-medium text-white">{lead.name}</td>
                      <td className="px-4 py-4 text-slate-300">{lead.phone}</td>
                      <td className="px-4 py-4 text-slate-300">{lead.email}</td>
                      <td className="px-4 py-4 text-slate-300">{lead.organization}</td>
                      <td className="px-4 py-4 text-slate-300">{lead.servicePlan}</td>
                      <td className="px-4 py-4 text-slate-300">{lead.createdAt}</td>
                      <td className="px-4 py-4">
                        <select
                          value={lead.status}
                          disabled={updatingLeadId === lead.id}
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                          className={`rounded-lg border px-3 py-2 text-sm font-medium outline-none transition disabled:opacity-60 ${getStatusClass(
                            lead.status
                          )}`}
                        >
                          <option value="חדשה">חדשה</option>
                          <option value="בטיפול">בטיפול</option>
                          <option value="נסגרה">נסגרה</option>
                          <option value="לא רלוונטית">לא רלוונטית</option>
                        </select>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          <a
                            href={getWhatsAppShareUrl(lead)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm font-medium text-green-300 transition hover:bg-green-500/20"
                          >
                            שיתוף וואטסאפ
                          </a>
                        <button
                          onClick={() => deleteLead(lead.id)}
                          disabled={deletingLeadId === lead.id}
                          className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/20 disabled:opacity-60"
                        >
                          {deletingLeadId === lead.id ? 'מוחק...' : 'מחיקה'}
                        </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  )
}
