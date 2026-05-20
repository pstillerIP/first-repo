import Link from 'next/link'
import { ProductionOrder, OrderStatus, OrderPriority } from '@/types'

const STATUS_STYLES: Record<OrderStatus, { bg: string; text: string; label: string }> = {
  Running:  { bg: '#16A34A', text: '#fff', label: 'Running' },
  Pending:  { bg: '#D97706', text: '#fff', label: 'Pending' },
  Down:     { bg: '#DC2626', text: '#fff', label: 'Down' },
  Complete: { bg: '#6B7280', text: '#fff', label: 'Complete' },
}

const PRIORITY_STYLES: Record<OrderPriority, { color: string }> = {
  Standard:  { color: '#6B7280' },
  Rush:      { color: '#D97706' },
  Emergency: { color: '#DC2626' },
}

function isOverdue(order: ProductionOrder): boolean {
  if (order.status === 'Complete') return false
  return new Date(order.due_date) < new Date(new Date().toDateString())
}

interface Props {
  order: ProductionOrder
}

export default function OrderCard({ order }: Props) {
  const status = STATUS_STYLES[order.status]
  const priority = PRIORITY_STYLES[order.priority]
  const overdue = isOverdue(order)
  const progress = order.quantity_ordered > 0
    ? Math.round((order.quantity_completed / order.quantity_ordered) * 100)
    : 0

  return (
    <Link href={`/orders/${order.id}`} className="block hover:shadow-md transition-shadow">
    <div
      className="bg-white rounded-lg shadow-sm p-5 flex flex-col gap-3 h-full"
      style={{ border: overdue ? '2px solid #DC2626' : '1px solid #D1D5DB' }}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono font-semibold" style={{ color: '#6B7280' }}>
              {order.order_number}
            </span>
            {overdue && (
              <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>
                OVERDUE
              </span>
            )}
            <span className="text-xs font-semibold" style={{ color: priority.color }}>
              {order.priority !== 'Standard' ? order.priority.toUpperCase() : ''}
            </span>
          </div>
          <h3 className="font-semibold mt-0.5" style={{ color: '#1F2937' }}>{order.product_name}</h3>
        </div>
        <span
          className="text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap"
          style={{ backgroundColor: status.bg, color: status.text }}
        >
          {status.label}
        </span>
      </div>

      <div className="text-sm" style={{ color: '#6B7280' }}>
        <span className="font-medium" style={{ color: '#1F2937' }}>{order.production_line}</span>
        {' · '}Due {order.due_date}
      </div>

      <div>
        <div className="flex justify-between text-xs mb-1" style={{ color: '#6B7280' }}>
          <span>Progress</span>
          <span>{order.quantity_completed} / {order.quantity_ordered} units ({progress}%)</span>
        </div>
        <div className="w-full rounded-full h-2" style={{ backgroundColor: '#D1D5DB' }}>
          <div
            className="h-2 rounded-full transition-all"
            style={{ width: `${progress}%`, backgroundColor: order.status === 'Down' ? '#DC2626' : '#16A34A' }}
          />
        </div>
      </div>

      {order.notes && (
        <p className="text-xs italic" style={{ color: '#6B7280' }}>{order.notes}</p>
      )}
    </div>
    </Link>
  )
}
