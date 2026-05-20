export type OrderStatus = 'Pending' | 'Running' | 'Down' | 'Complete'
export type OrderPriority = 'Standard' | 'Rush' | 'Emergency'

export interface ProductionOrder {
  id: string
  order_number: string
  product_name: string
  status: OrderStatus
  quantity_ordered: number
  quantity_completed: number
  production_line: string
  priority: OrderPriority
  start_date: string
  due_date: string
  notes: string | null
  created_at: string
  updated_at: string
}
