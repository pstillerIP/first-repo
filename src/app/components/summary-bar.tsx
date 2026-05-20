import { ProductionOrder, OrderStatus } from '@/types'

const STATUS_CONFIG: { status: OrderStatus; color: string; bg: string }[] = [
  { status: 'Running',  color: '#16A34A', bg: '#DCFCE7' },
  { status: 'Pending',  color: '#D97706', bg: '#FEF3C7' },
  { status: 'Down',     color: '#DC2626', bg: '#FEE2E2' },
  { status: 'Complete', color: '#6B7280', bg: '#F3F4F6' },
]

interface Props {
  orders: ProductionOrder[]
}

export default function SummaryBar({ orders }: Props) {
  const counts = STATUS_CONFIG.map(({ status, color, bg }) => ({
    status,
    color,
    bg,
    count: orders.filter(o => o.status === status).length,
  }))

  const overdue = orders.filter(
    o => o.status !== 'Complete' && new Date(o.due_date) < new Date(new Date().toDateString())
  ).length

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {counts.map(({ status, color, bg, count }) => (
        <span
          key={status}
          className="px-3 py-1.5 rounded-full text-sm font-semibold"
          style={{ backgroundColor: bg, color }}
        >
          {count} {status}
        </span>
      ))}
      {overdue > 0 && (
        <span className="px-3 py-1.5 rounded-full text-sm font-semibold" style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>
          {overdue} Overdue
        </span>
      )}
    </div>
  )
}
