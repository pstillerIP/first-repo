import { supabase } from '@/lib/supabase'
import { ProductionOrder, OrderStatus, OrderPriority } from '@/types'
import { notFound } from 'next/navigation'

const STATUS_STYLES: Record<OrderStatus, { bg: string; text: string }> = {
  Running:  { bg: '#16A34A', text: '#fff' },
  Pending:  { bg: '#D97706', text: '#fff' },
  Down:     { bg: '#DC2626', text: '#fff' },
  Complete: { bg: '#6B7280', text: '#fff' },
}

const PRIORITY_COLOR: Record<OrderPriority, string> = {
  Standard:  '#6B7280',
  Rush:      '#D97706',
  Emergency: '#DC2626',
}

function isOverdue(order: ProductionOrder): boolean {
  if (order.status === 'Complete') return false
  return new Date(order.due_date) < new Date(new Date().toDateString())
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-4 py-3" style={{ borderBottom: '1px solid #F3F4F6' }}>
      <span className="w-44 shrink-0 text-sm font-semibold" style={{ color: '#6B7280' }}>{label}</span>
      <span className="text-sm" style={{ color: '#1F2937' }}>{value}</span>
    </div>
  )
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data, error } = await supabase
    .from('production_orders')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) notFound()

  const order = data as ProductionOrder
  const status = STATUS_STYLES[order.status]
  const overdue = isOverdue(order)
  const progress = order.quantity_ordered > 0
    ? Math.round((order.quantity_completed / order.quantity_ordered) * 100)
    : 0

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="mb-6">
        <a href="/" className="text-sm hover:underline" style={{ color: '#1A4D2E' }}>← Back to Dashboard</a>
        <div className="flex items-center gap-3 mt-2 flex-wrap">
          <h1 className="text-2xl font-bold" style={{ color: '#1A4D2E' }}>{order.order_number}</h1>
          <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ backgroundColor: status.bg, color: status.text }}>
            {order.status}
          </span>
          {overdue && (
            <span className="text-xs font-bold px-2 py-1 rounded" style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>
              OVERDUE
            </span>
          )}
        </div>
        <p className="mt-1 font-semibold" style={{ color: '#1F2937' }}>{order.product_name}</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-5" style={{ border: overdue ? '2px solid #DC2626' : '1px solid #D1D5DB' }}>
        <Row label="Production Line" value={order.production_line} />
        <Row label="Priority" value={
          <span className="font-semibold" style={{ color: PRIORITY_COLOR[order.priority] }}>{order.priority}</span>
        } />
        <Row label="Start Date" value={order.start_date} />
        <Row label="Due Date" value={order.due_date} />
        <Row label="Quantity Ordered" value={order.quantity_ordered.toLocaleString()} />
        <Row label="Quantity Completed" value={`${order.quantity_completed.toLocaleString()} (${progress}%)`} />
        {order.notes && <Row label="Notes" value={order.notes} />}
        <Row label="Created" value={new Date(order.created_at).toLocaleString()} />
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6" style={{ border: '1px solid #D1D5DB' }}>
        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#6B7280' }}>Progress</p>
        <div className="flex justify-between text-sm mb-2" style={{ color: '#6B7280' }}>
          <span>{order.quantity_completed} of {order.quantity_ordered} units</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full rounded-full h-3" style={{ backgroundColor: '#D1D5DB' }}>
          <div
            className="h-3 rounded-full"
            style={{ width: `${progress}%`, backgroundColor: order.status === 'Down' ? '#DC2626' : '#16A34A' }}
          />
        </div>
      </div>
    </div>
  )
}
