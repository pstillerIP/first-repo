CLAUDE.md - Northland Composites Production Order Tracker
Project Overview
Internal web application for Northland Composites, a mid-sized composites manufacturer. The plant floor currently tracks production orders on a whiteboard and a shared spreadsheet. This app replaces that process with a simple, real-time Production Order Tracker that any operator or supervisor can access from a browser.

This is a workshop learning project. Prioritize working code over perfection. Get something functional, then improve it.

Tech Stack
Framework: Next.js (App Router)
Language: TypeScript
Styling: Tailwind CSS
UI Components: Built with Tailwind utility classes (keep it simple, no component library)
Database: Supabase (cloud-hosted PostgreSQL with REST API)
Authentication: None for now (future phase)
Deployment: Vercel (auto-deploys from GitHub)
AI Assistant: Claude Code in VS Code
Package Manager: npm
Northland Composites Design System
Northland Composites uses an industrial/safety-forward color palette inspired by the plant floor.

Primary (headers, emphasis):     #1A4D2E  (Forest Green)
Secondary (actions, buttons):    #D97706  (Safety Amber)
Background subtle:               #F0F4F1  (Light Sage)
Text primary:                    #1F2937  (Near Black)
Text secondary:                  #6B7280  (Gray)
Danger/alert:                    #DC2626  (Red)
Success:                         #16A34A  (Green)
Surface/cards:                   #FFFFFF  (White)
Border:                          #D1D5DB  (Light Gray)
Font: system font stack ("Inter", "Segoe UI", sans-serif). Clean and readable.

Use these colors consistently: - Page headers and the app navbar use Forest Green (#1A4D2E) with white text - Primary action buttons (Create Order, Save) use Safety Amber (#D97706) with white text - Status badges use color coding: green for Running, amber for Pending, red for Down/Blocked, gray for Complete - Card backgrounds are white with Light Gray borders - Page background is Light Sage (#F0F4F1)

Project Structure
Keep it simple. This is a small app.

src/
  app/
    layout.tsx          # Root layout with navbar
    page.tsx            # Home/dashboard: production order list
    orders/
      new/page.tsx      # Create new production order form
      [id]/page.tsx     # Order detail view (future)
    api/
      orders/route.ts   # API route for orders (if needed)
  lib/
    supabase.ts         # Supabase client initialization
  types/
    index.ts            # TypeScript types for orders
Database Schema (Supabase)
One table to start. Create this in the Supabase dashboard (Table Editor) or SQL Editor.

Table: production_orders
Column	Type	Notes
id	uuid	Primary key, default gen_random_uuid()
order_number	text	e.g., "WO-2026-0142"
product_name	text	e.g., "Carbon Fiber Panel - 4x8 Standard"
status	text	One of: Pending, Running, Down, Complete
quantity_ordered	integer	Total units ordered
quantity_completed	integer	Units finished so far
production_line	text	e.g., "Line 1", "Line 2", "Line 3"
priority	text	One of: Standard, Rush, Emergency
start_date	date	Scheduled start
due_date	date	Customer due date
notes	text	Optional, nullable
created_at	timestamptz	Default now()
updated_at	timestamptz	Default now()
Seed Data
Insert this data into the table so there is something to display immediately. Use the Supabase SQL Editor:

INSERT INTO production_orders (order_number, product_name, status, quantity_ordered, quantity_completed, production_line, priority, start_date, due_date, notes)
VALUES
  ('WO-2026-0142', 'Carbon Fiber Panel - 4x8 Standard', 'Running', 500, 312, 'Line 1', 'Standard', '2026-04-14', '2026-04-28', 'Customer: Northwind Aerospace'),
  ('WO-2026-0143', 'Fiberglass Reinforced Sheet - 3mm', 'Running', 1200, 870, 'Line 2', 'Rush', '2026-04-10', '2026-04-22', 'Expedited per customer request'),
  ('WO-2026-0144', 'Kevlar Composite Plate - Ballistic Grade', 'Pending', 200, 0, 'Line 3', 'Standard', '2026-04-21', '2026-05-05', NULL),
  ('WO-2026-0145', 'Carbon Fiber Tube - 2in OD', 'Down', 800, 445, 'Line 1', 'Emergency', '2026-04-07', '2026-04-18', 'Line down: resin supply issue, ETA 4/21'),
  ('WO-2026-0146', 'Glass Fiber Mat - Chopped Strand', 'Running', 3000, 2100, 'Line 2', 'Standard', '2026-04-01', '2026-04-25', NULL),
  ('WO-2026-0147', 'Hybrid Composite Panel - CF/GF Blend', 'Complete', 150, 150, 'Line 3', 'Standard', '2026-03-25', '2026-04-10', 'Shipped to customer 4/11'),
  ('WO-2026-0148', 'Pre-preg Carbon Roll - Unidirectional', 'Pending', 400, 0, 'Line 1', 'Rush', '2026-04-22', '2026-04-30', 'Customer: Summit Defense Systems'),
  ('WO-2026-0149', 'Fiberglass Boat Hull Mold - 18ft', 'Running', 12, 7, 'Line 3', 'Standard', '2026-04-08', '2026-05-15', 'Custom mold, requires QC hold at unit 10');
Supabase Configuration
The Supabase client uses two environment variables stored in .env.local:

NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
Initialize the client in src/lib/supabase.ts:

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)
What to Build (Session Goals)
Must have (this session)
A dashboard page that fetches and displays all production orders from Supabase
Orders displayed as cards or a table showing: order number, product, status, line, quantity progress, priority, due date
Status badges with color coding (green/amber/red/gray)
Visual indicator for overdue orders (due_date < today and status is not Complete)
Basic sorting or grouping by status or production line
Nice to have (if time allows)
A "New Order" form that inserts a row into Supabase
Click an order to see a detail view
Filter by status or production line
A summary bar at the top (e.g., "5 Running, 2 Pending, 1 Down")
Not building yet
Authentication or user roles
Real-time subscriptions (Supabase supports this, but save it for later)
Edit/delete functionality
Reporting or analytics
Coding Patterns
Use async/await for all Supabase queries.
Fetch data on the server side when possible (server components). If you need client-side interactivity (filters, sorting toggles), use "use client" and fetch in a useEffect or use a client-side query.
Keep components small. If a component is longer than 80 lines, break it up.
Use TypeScript types for the order data. Define them once in types/index.ts and import everywhere.
TypeScript Types
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
Common Claude Code Prompts
These are good starting points for working with Claude Code on this project:

"Read the CLAUDE.md and set up the project structure"
"Create the Supabase client in lib/supabase.ts using the env variables"
"Build the main dashboard page that fetches all production orders from Supabase and displays them as cards"
"Add status badges with color coding based on the design system"
"Highlight overdue orders where due_date is before today and status is not Complete"
"Add a summary bar at the top showing counts by status"
"Create a form at /orders/new to add a new production order"
File Naming
Components: kebab-case files, PascalCase exports (e.g., order-card.tsx exports OrderCard)
Pages: page.tsx inside the appropriate app/ directory
Lib modules: kebab-case (e.g., supabase.ts)
Types: index.ts inside types/ directory