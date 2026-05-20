'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { OrderStatus, OrderPriority } from '@/types'

const STATUSES: OrderStatus[] = ['Pending', 'Running', 'Down', 'Complete']
const PRIORITIES: OrderPriority[] = ['Standard', 'Rush', 'Emergency']
const LINES = ['Line 1', 'Line 2', 'Line 3']

function generateOrderNumber(): string {
  const year = new Date().getFullYear()
  const seq = String(Math.floor(Math.random() * 900) + 100)
  return `WO-${year}-0${seq}`
}

export default function NewOrderPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    order_number: generateOrderNumber(),
    product_name: '',
    status: 'Pending' as OrderStatus,
    quantity_ordered: '',
    quantity_completed: '0',
    production_line: 'Line 1',
    priority: 'Standard' as OrderPriority,
    start_date: new Date().toISOString().split('T')[0],
    due_date: '',
    notes: '',
  })

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const { error } = await supabase.from('production_orders').insert({
      ...form,
      quantity_ordered: Number(form.quantity_ordered),
      quantity_completed: Number(form.quantity_completed),
    })

    if (error) {
      setError(error.message)
      setSaving(false)
      return
    }

    router.push('/')
    router.refresh()
  }

  const labelClass = 'block text-sm font-semibold mb-1'
  const inputClass = 'w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2'
  const inputStyle = { borderColor: '#D1D5DB', color: '#1F2937' }
  const focusColor = '#1A4D2E'

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="mb-6">
        <a href="/" className="text-sm hover:underline" style={{ color: '#1A4D2E' }}>← Back to Dashboard</a>
        <h1 className="text-2xl font-bold mt-2" style={{ color: '#1A4D2E' }}>New Production Order</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 flex flex-col gap-5" style={{ border: '1px solid #D1D5DB' }}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass} style={{ color: '#1F2937' }}>Order Number</label>
            <input
              className={inputClass}
              style={inputStyle}
              value={form.order_number}
              onChange={e => set('order_number', e.target.value)}
              required
            />
          </div>
          <div>
            <label className={labelClass} style={{ color: '#1F2937' }}>Priority</label>
            <select
              className={inputClass}
              style={inputStyle}
              value={form.priority}
              onChange={e => set('priority', e.target.value)}
            >
              {PRIORITIES.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass} style={{ color: '#1F2937' }}>Product Name</label>
          <input
            className={inputClass}
            style={inputStyle}
            value={form.product_name}
            onChange={e => set('product_name', e.target.value)}
            placeholder="e.g. Carbon Fiber Panel - 4x8 Standard"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass} style={{ color: '#1F2937' }}>Status</label>
            <select
              className={inputClass}
              style={inputStyle}
              value={form.status}
              onChange={e => set('status', e.target.value)}
            >
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass} style={{ color: '#1F2937' }}>Production Line</label>
            <select
              className={inputClass}
              style={inputStyle}
              value={form.production_line}
              onChange={e => set('production_line', e.target.value)}
            >
              {LINES.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass} style={{ color: '#1F2937' }}>Quantity Ordered</label>
            <input
              type="number" min="1"
              className={inputClass}
              style={inputStyle}
              value={form.quantity_ordered}
              onChange={e => set('quantity_ordered', e.target.value)}
              required
            />
          </div>
          <div>
            <label className={labelClass} style={{ color: '#1F2937' }}>Quantity Completed</label>
            <input
              type="number" min="0"
              className={inputClass}
              style={inputStyle}
              value={form.quantity_completed}
              onChange={e => set('quantity_completed', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass} style={{ color: '#1F2937' }}>Start Date</label>
            <input
              type="date"
              className={inputClass}
              style={inputStyle}
              value={form.start_date}
              onChange={e => set('start_date', e.target.value)}
              required
            />
          </div>
          <div>
            <label className={labelClass} style={{ color: '#1F2937' }}>Due Date</label>
            <input
              type="date"
              className={inputClass}
              style={inputStyle}
              value={form.due_date}
              onChange={e => set('due_date', e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className={labelClass} style={{ color: '#1F2937' }}>Notes <span style={{ color: '#6B7280', fontWeight: 400 }}>(optional)</span></label>
          <textarea
            className={inputClass}
            style={{ ...inputStyle, resize: 'vertical' }}
            rows={3}
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
          />
        </div>

        {error && (
          <p className="text-sm font-medium" style={{ color: '#DC2626' }}>{error}</p>
        )}

        <div className="flex gap-3 justify-end pt-2">
          <a
            href="/"
            className="px-5 py-2 rounded text-sm font-semibold border"
            style={{ borderColor: '#D1D5DB', color: '#1F2937' }}
          >
            Cancel
          </a>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 rounded text-sm font-semibold text-white transition-opacity"
            style={{ backgroundColor: '#D97706', opacity: saving ? 0.6 : 1 }}
          >
            {saving ? 'Saving…' : 'Create Order'}
          </button>
        </div>
      </form>
    </div>
  )
}
