"use client"

import { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  X,
  Phone,
  Settings,
  BellOff,
  Package,
  ChevronRight,
  MapPin,
  Fish,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingDown,
  RefreshCw,
} from "lucide-react"

// ─── Types ───────────────────────────────────────────────────────────────────

type StatusColor = "red" | "yellow" | "green"

interface Order {
  id: string
  quantity: string
  scheduledDate: string
  status: "Confirmed" | "Pending" | "In Transit" | "Awaiting ETA"
}

interface Site {
  id: string
  name: string
  customer: string
  status: StatusColor
  inactive: boolean
  reasons: string[]
  nextDelivery: string | null
  feedLevel: number        // current feed % of capacity
  bufferLevel: number      // buffer threshold %
  capacityTonnes: number
  daysToBuffer: number | null
  location: string
  species: string
  consumptionPerDay: number // tonnes/day
  orders: Order[]
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_SITES: Site[] = [
  {
    id: "1",
    name: "Havbruk AS — Nord Pen 4",
    customer: "Havbruk AS",
    status: "red",
    inactive: false,
    reasons: ["Missing Delivery ETA", "Feed approaching buffer limit in 1 day", "No fallback supplier assigned"],
    nextDelivery: null,
    feedLevel: 28,
    bufferLevel: 25,
    capacityTonnes: 120,
    daysToBuffer: 1,
    location: "Tromsø, Norway",
    species: "Atlantic Salmon",
    consumptionPerDay: 3.2,
    orders: [
      { id: "ORD-2291", quantity: "40 000 kg", scheduledDate: "—", status: "Awaiting ETA" },
      { id: "ORD-2244", quantity: "38 000 kg", scheduledDate: "12 Apr 2026", status: "Confirmed" },
    ],
  },
  {
    id: "2",
    name: "BlueOcean Farm — Pen 3",
    customer: "BlueOcean Farm",
    status: "red",
    inactive: false,
    reasons: ["Feed level below buffer — immediate action", "Delivery delayed by carrier"],
    nextDelivery: "1 Apr 2026",
    feedLevel: 18,
    bufferLevel: 25,
    capacityTonnes: 80,
    daysToBuffer: 0,
    location: "Bergen, Norway",
    species: "Rainbow Trout",
    consumptionPerDay: 2.4,
    orders: [
      { id: "ORD-2305", quantity: "25 000 kg", scheduledDate: "1 Apr 2026", status: "In Transit" },
    ],
  },
  {
    id: "3",
    name: "Nordic Aqua — Site B",
    customer: "Nordic Aqua",
    status: "yellow",
    inactive: false,
    reasons: ["Approaching buffer limit in 2 days"],
    nextDelivery: "3 Apr 2026",
    feedLevel: 31,
    bufferLevel: 25,
    capacityTonnes: 100,
    daysToBuffer: 2,
    location: "Ålesund, Norway",
    species: "Atlantic Salmon",
    consumptionPerDay: 2.8,
    orders: [
      { id: "ORD-2298", quantity: "35 000 kg", scheduledDate: "3 Apr 2026", status: "Confirmed" },
    ],
  },
  {
    id: "4",
    name: "FjordFisk — Pen Alpha",
    customer: "FjordFisk",
    status: "yellow",
    inactive: false,
    reasons: ["Unconfirmed order pending approval", "Consumption rate elevated +15%"],
    nextDelivery: "5 Apr 2026",
    feedLevel: 45,
    bufferLevel: 25,
    capacityTonnes: 90,
    daysToBuffer: 5,
    location: "Stavanger, Norway",
    species: "Atlantic Cod",
    consumptionPerDay: 2.0,
    orders: [
      { id: "ORD-2312", quantity: "30 000 kg", scheduledDate: "5 Apr 2026", status: "Pending" },
      { id: "ORD-2280", quantity: "28 000 kg", scheduledDate: "19 Apr 2026", status: "Confirmed" },
    ],
  },
  {
    id: "5",
    name: "Salmon Peak — Site 7",
    customer: "Salmon Peak",
    status: "green",
    inactive: false,
    reasons: ["Automated"],
    nextDelivery: "8 Apr 2026",
    feedLevel: 68,
    bufferLevel: 25,
    capacityTonnes: 150,
    daysToBuffer: 12,
    location: "Bodø, Norway",
    species: "Atlantic Salmon",
    consumptionPerDay: 3.6,
    orders: [
      { id: "ORD-2318", quantity: "42 000 kg", scheduledDate: "8 Apr 2026", status: "Confirmed" },
      { id: "ORD-2319", quantity: "42 000 kg", scheduledDate: "22 Apr 2026", status: "Confirmed" },
    ],
  },
  {
    id: "6",
    name: "AquaNord — Site Delta",
    customer: "AquaNord",
    status: "green",
    inactive: false,
    reasons: ["Automated"],
    nextDelivery: "10 Apr 2026",
    feedLevel: 82,
    bufferLevel: 25,
    capacityTonnes: 200,
    daysToBuffer: 18,
    location: "Kristiansund, Norway",
    species: "Atlantic Halibut",
    consumptionPerDay: 4.1,
    orders: [
      { id: "ORD-2325", quantity: "50 000 kg", scheduledDate: "10 Apr 2026", status: "Confirmed" },
      { id: "ORD-2326", quantity: "50 000 kg", scheduledDate: "24 Apr 2026", status: "Confirmed" },
    ],
  },
  {
    id: "7",
    name: "Polar Aqua — Site 2",
    customer: "Polar Aqua",
    status: "green",
    inactive: true,
    reasons: ["Automated"],
    nextDelivery: null,
    feedLevel: 0,
    bufferLevel: 25,
    capacityTonnes: 110,
    daysToBuffer: null,
    location: "Hammerfest, Norway",
    species: "Atlantic Salmon",
    consumptionPerDay: 0,
    orders: [],
  },
  {
    id: "8",
    name: "VestHav — Pen B",
    customer: "VestHav",
    status: "green",
    inactive: true,
    reasons: ["Automated"],
    nextDelivery: null,
    feedLevel: 0,
    bufferLevel: 25,
    capacityTonnes: 75,
    daysToBuffer: null,
    location: "Molde, Norway",
    species: "Rainbow Trout",
    consumptionPerDay: 0,
    orders: [],
  },
]

const STATUS_ORDER: Record<StatusColor, number> = { red: 0, yellow: 1, green: 2 }

// ─── Sub-components ───────────────────────────────────────────────────────────

function TrafficLight({ status }: { status: StatusColor }) {
  const colors: Record<StatusColor, string> = {
    red: "bg-red-500 shadow-[0_0_8px_2px_rgba(239,68,68,0.5)]",
    yellow: "bg-amber-400 shadow-[0_0_8px_2px_rgba(251,191,36,0.5)]",
    green: "bg-emerald-500 shadow-[0_0_8px_2px_rgba(16,185,129,0.5)]",
  }
  const labels: Record<StatusColor, string> = {
    red: "Critical",
    yellow: "Warning",
    green: "Healthy",
  }
  return (
    <div className="flex items-center gap-2">
      <span className={`w-3 h-3 rounded-full shrink-0 ${colors[status]}`} />
      <span
        className={`text-xs font-medium ${
          status === "red"
            ? "text-red-600"
            : status === "yellow"
            ? "text-amber-600"
            : "text-emerald-600"
        }`}
      >
        {labels[status]}
      </span>
    </div>
  )
}

function OrderStatusBadge({ status }: { status: Order["status"] }) {
  const variants: Record<Order["status"], string> = {
    Confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Pending: "bg-amber-100 text-amber-700 border-amber-200",
    "In Transit": "bg-blue-100 text-blue-700 border-blue-200",
    "Awaiting ETA": "bg-red-100 text-red-700 border-red-200",
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${variants[status]}`}>
      {status}
    </span>
  )
}

// ─── Feed Level Timeline Chart (SVG mock) ─────────────────────────────────────

function FeedTimeline({ site }: { site: Site }) {
  const days = 14
  const width = 440
  const height = 140
  const padL = 36
  const padR = 16
  const padT = 12
  const padB = 28
  const chartW = width - padL - padR
  const chartH = height - padT - padB

  // Find delivery day index (rough approximation)
  const deliveryDayIndex = site.nextDelivery
    ? (() => {
        const parts = site.nextDelivery.split(" ")
        const day = parseInt(parts[0]) || 0
        const today = 29 // mock today = 29 Mar
        return Math.max(0, day - today)
      })()
    : null

  // Build feed % points
  const points: { day: number; feed: number }[] = []
  const dailyDrop = site.capacityTonnes > 0
    ? (site.consumptionPerDay / site.capacityTonnes) * 100
    : 2

  let currentFeed = site.feedLevel
  for (let d = 0; d < days; d++) {
    // Apply delivery bump
    if (deliveryDayIndex !== null && d === deliveryDayIndex) {
      const deliveryBump = (40 / site.capacityTonnes) * 100 * (site.capacityTonnes / 100)
      currentFeed = Math.min(95, currentFeed + deliveryBump * 2.5)
    }
    points.push({ day: d, feed: Math.max(0, currentFeed) })
    currentFeed = Math.max(0, currentFeed - dailyDrop)
  }

  const toX = (d: number) => padL + (d / (days - 1)) * chartW
  const toY = (f: number) => padT + (1 - f / 100) * chartH
  const bufferY = toY(site.bufferLevel)

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${toX(p.day).toFixed(1)} ${toY(p.feed).toFixed(1)}`)
    .join(" ")

  const areaPath =
    linePath +
    ` L ${toX(days - 1).toFixed(1)} ${(padT + chartH).toFixed(1)} L ${padL.toFixed(1)} ${(padT + chartH).toFixed(1)} Z`

  const isCritical = site.status === "red"
  const isWarning = site.status === "yellow"
  const lineColor = isCritical ? "#ef4444" : isWarning ? "#f59e0b" : "#10b981"
  const areaColor = isCritical ? "rgba(239,68,68,0.08)" : isWarning ? "rgba(245,158,11,0.08)" : "rgba(16,185,129,0.08)"

  // X-axis day labels (every 2 days)
  const dayLabels = [0, 2, 4, 6, 8, 10, 12]

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 overflow-hidden">
      <div className="px-3 pt-3 pb-1 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Feed Level — 14-day projection</span>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-3 h-0.5 bg-slate-300 inline-block rounded border-dashed" />
            Buffer ({site.bufferLevel}%)
          </span>
          {deliveryDayIndex !== null && (
            <span className="flex items-center gap-1">
              <span className="w-3 h-0.5 bg-blue-400 inline-block rounded" />
              Delivery
            </span>
          )}
        </div>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height: 140 }}>
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((pct) => (
          <g key={pct}>
            <line
              x1={padL}
              y1={toY(pct)}
              x2={padL + chartW}
              y2={toY(pct)}
              stroke="#e2e8f0"
              strokeWidth="1"
            />
            <text x={padL - 4} y={toY(pct) + 4} fontSize="8" fill="#94a3b8" textAnchor="end">
              {pct}%
            </text>
          </g>
        ))}

        {/* Buffer threshold dashed line */}
        <line
          x1={padL}
          y1={bufferY}
          x2={padL + chartW}
          y2={bufferY}
          stroke="#f97316"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          opacity={0.7}
        />

        {/* Delivery vertical marker */}
        {deliveryDayIndex !== null && deliveryDayIndex < days && (
          <line
            x1={toX(deliveryDayIndex)}
            y1={padT}
            x2={toX(deliveryDayIndex)}
            y2={padT + chartH}
            stroke="#3b82f6"
            strokeWidth="1"
            strokeDasharray="3 3"
            opacity={0.6}
          />
        )}

        {/* Area fill */}
        <path d={areaPath} fill={areaColor} />

        {/* Feed level line */}
        <path d={linePath} fill="none" stroke={lineColor} strokeWidth="2" strokeLinejoin="round" />

        {/* Today marker */}
        <circle cx={toX(0)} cy={toY(site.feedLevel)} r="3.5" fill={lineColor} />

        {/* X axis labels */}
        {dayLabels.map((d) => (
          <text
            key={d}
            x={toX(d)}
            y={padT + chartH + 16}
            fontSize="8"
            fill="#94a3b8"
            textAnchor="middle"
          >
            +{d}d
          </text>
        ))}
      </svg>
    </div>
  )
}

// ─── Drawer ───────────────────────────────────────────────────────────────────

function SiteDrawer({ site, onClose }: { site: Site; onClose: () => void }) {
  const quickActions: Record<StatusColor, { label: string; icon: React.ReactNode; variant: string }[]> = {
    red: [
      { label: "Contact Logistics", icon: <Phone className="w-4 h-4" />, variant: "bg-red-600 hover:bg-red-700 text-white" },
      { label: "Override Automation", icon: <Settings className="w-4 h-4" />, variant: "bg-slate-900 hover:bg-slate-800 text-white" },
      { label: "Escalate to Manager", icon: <AlertTriangle className="w-4 h-4" />, variant: "border border-red-300 text-red-700 hover:bg-red-50" },
    ],
    yellow: [
      { label: "Contact Logistics", icon: <Phone className="w-4 h-4" />, variant: "bg-amber-500 hover:bg-amber-600 text-white" },
      { label: "Snooze Alert (24h)", icon: <BellOff className="w-4 h-4" />, variant: "border border-slate-300 text-slate-700 hover:bg-slate-50" },
      { label: "Confirm Order", icon: <CheckCircle2 className="w-4 h-4" />, variant: "bg-slate-900 hover:bg-slate-800 text-white" },
    ],
    green: [
      { label: "View Full History", icon: <Clock className="w-4 h-4" />, variant: "border border-slate-300 text-slate-700 hover:bg-slate-50" },
      { label: "Override Automation", icon: <Settings className="w-4 h-4" />, variant: "border border-slate-300 text-slate-700 hover:bg-slate-50" },
    ],
  }

  const feedBarColor =
    site.status === "red"
      ? "bg-red-500"
      : site.status === "yellow"
      ? "bg-amber-400"
      : "bg-emerald-500"

  const isBelowBuffer = site.feedLevel < site.bufferLevel

  return (
    <div className="h-full flex flex-col bg-white border-l border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-slate-100">
        <div className="flex-1 min-w-0 pr-3">
          <div className="flex items-center gap-2 mb-1">
            <TrafficLight status={site.status} />
          </div>
          <h2 className="text-base font-semibold text-slate-900 leading-tight truncate">
            {site.name}
          </h2>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {site.location}
            </span>
            <span className="flex items-center gap-1">
              <Fish className="w-3 h-3" />
              {site.species}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

        {/* Status detail card */}
        <div className={`rounded-lg border text-sm ${
          site.status === "red"
            ? "bg-red-50 border-red-200"
            : site.status === "yellow"
            ? "bg-amber-50 border-amber-200"
            : "bg-emerald-50 border-emerald-200"
        }`}>
          <div className={`px-3.5 pt-3 pb-2 border-b font-medium text-xs uppercase tracking-wider ${
            site.status === "red"
              ? "text-red-700 border-red-200"
              : site.status === "yellow"
              ? "text-amber-700 border-amber-200"
              : "text-emerald-700 border-emerald-200"
          }`}>
            {site.reasons.length === 1 ? "Active flag" : `${site.reasons.length} active flags`}
          </div>
          <ul className="divide-y divide-dashed divide-red-100">
            {site.reasons.map((reason, i) => (
              <li key={i} className={`flex items-start gap-2 px-3.5 py-2.5 text-sm ${
                site.status === "red" ? "text-red-900 divide-red-100" : site.status === "yellow" ? "text-amber-900 divide-amber-100" : "text-emerald-900 divide-emerald-100"
              }`}>
                <span className={`mt-0.5 shrink-0 w-1.5 h-1.5 rounded-full ${
                  site.status === "red" ? "bg-red-500" : site.status === "yellow" ? "bg-amber-400" : "bg-emerald-500"
                }`} />
                {reason}
              </li>
            ))}
          </ul>
          {site.daysToBuffer !== null && (
            <p className="px-3.5 pb-3 pt-1 text-xs text-slate-500">
              {isBelowBuffer
                ? "Feed level is currently below the safety buffer."
                : `${site.daysToBuffer} day${site.daysToBuffer === 1 ? "" : "s"} until feed reaches the buffer threshold.`}
            </p>
          )}
        </div>

        {/* Feed level meter */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-slate-600 uppercase tracking-wider">Current Feed Level</span>
            <span className={`text-sm font-semibold ${
              site.status === "red" ? "text-red-600" : site.status === "yellow" ? "text-amber-600" : "text-emerald-600"
            }`}>
              {site.feedLevel}%
            </span>
          </div>
          <div className="relative h-2.5 bg-slate-100 rounded-full overflow-visible">
            <div
              className={`h-full rounded-full transition-all ${feedBarColor}`}
              style={{ width: `${site.feedLevel}%` }}
            />
            {/* Buffer marker */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-orange-400 rounded-full"
              style={{ left: `${site.bufferLevel}%` }}
            >
              <span className="absolute top-4 left-1/2 -translate-x-1/2 text-[9px] text-orange-500 whitespace-nowrap font-medium">
                buffer
              </span>
            </div>
          </div>
          <div className="flex justify-between mt-3 text-xs text-slate-400">
            <span>0%</span>
            <span className="text-slate-500">Consumption: {site.consumptionPerDay} t/day</span>
            <span>100%</span>
          </div>
        </div>

        {/* Timeline chart */}
        <div>
          <p className="text-xs font-medium text-slate-600 uppercase tracking-wider mb-2">Feed Projection</p>
          <FeedTimeline site={site} />
        </div>

        {/* Orders */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-3.5 h-3.5 text-slate-400" />
            <p className="text-xs font-medium text-slate-600 uppercase tracking-wider">Active & Planned Orders</p>
          </div>
          {site.orders.length === 0 ? (
            <p className="text-sm text-slate-400 italic">No orders found</p>
          ) : (
            <div className="space-y-2">
              {site.orders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50 text-sm"
                >
                  <div>
                    <span className="font-medium text-slate-800 text-xs">{order.id}</span>
                    <p className="text-slate-500 text-xs mt-0.5">{order.quantity} · {order.scheduledDate}</p>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div>
          <p className="text-xs font-medium text-slate-600 uppercase tracking-wider mb-2">Quick Actions</p>
          <div className="flex flex-col gap-2">
            {quickActions[site.status].map((action) => (
              <button
                key={action.label}
                className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${action.variant}`}
              >
                {action.icon}
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-slate-100 bg-slate-50">
        <p className="text-xs text-slate-400 text-center">
          Last synced: today at 09:14 · Source: FeedControl API
        </p>
      </div>
    </div>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

type Tab = "active" | "inactive" | "requires-action"

const TAB_LABELS: Record<Tab, string> = {
  active: "Active",
  inactive: "Inactive",
  "requires-action": "Requires Action",
}

export function FishyDashboard1() {
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null)
  const [activeTab, setActiveTab]           = useState<Tab>("requires-action")
  const [issueFilter, setIssueFilter]       = useState<string | null>(null)
  const [resolvedIds, setResolvedIds]       = useState<Set<string>>(new Set())

  // Apply local resolve overrides
  const sites = useMemo(() =>
    MOCK_SITES.map(s =>
      resolvedIds.has(s.id)
        ? { ...s, status: "green" as StatusColor, reasons: ["Automated"], daysToBuffer: null }
        : s
    ), [resolvedIds]
  )

  // Stats from live site state (active sites only)
  const stats = useMemo(() => {
    const active   = sites.filter(s => !s.inactive)
    const red      = active.filter(s => s.status === "red")
    const yellow   = active.filter(s => s.status === "yellow")
    const green    = active.filter(s => s.status === "green")
    const nonGreen = [...red, ...yellow]
    return {
      red:        { sites: red.length,    flags: red.reduce((n, s) => n + s.reasons.length, 0) },
      yellow:     { sites: yellow.length, flags: yellow.reduce((n, s) => n + s.reasons.length, 0) },
      green:      { sites: green.length },
      totalFlags: nonGreen.reduce((n, s) => n + s.reasons.length, 0),
    }
  }, [sites])

  // Badge count for Requires Action tab
  const requiresActionCount = useMemo(() =>
    sites.filter(s => !s.inactive && (s.status === "red" || s.status === "yellow")).length,
    [sites]
  )

  // Tab-filtered sites
  const tabSites = useMemo(() => {
    switch (activeTab) {
      case "active":
        return sites.filter(s => !s.inactive && s.status === "green")
      case "inactive":
        return sites.filter(s => s.inactive)
      case "requires-action":
        return sites
          .filter(s => !s.inactive && (s.status === "red" || s.status === "yellow"))
          .sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status])
    }
  }, [sites, activeTab])

  // Unique issue pills derived from visible tab reasons
  const issueOptions = useMemo(() => {
    if (activeTab !== "requires-action") return []
    return [...new Set(tabSites.flatMap(s => s.reasons))]
  }, [tabSites, activeTab])

  // Apply issue filter
  const visibleSites = useMemo(() =>
    issueFilter ? tabSites.filter(s => s.reasons.includes(issueFilter)) : tabSites,
    [tabSites, issueFilter]
  )

  // Drawer site — stays open if still visible
  const drawerSite = useMemo(() =>
    selectedSiteId ? (sites.find(s => s.id === selectedSiteId) ?? null) : null,
    [sites, selectedSiteId]
  )
  const drawerOpen = drawerSite !== null && visibleSites.some(s => s.id === selectedSiteId)

  function handleTabChange(tab: Tab) {
    setActiveTab(tab)
    setIssueFilter(null)
    setSelectedSiteId(null)
  }

  function handleResolve(e: React.MouseEvent, siteId: string) {
    e.stopPropagation()
    setResolvedIds(prev => new Set([...prev, siteId]))
    if (selectedSiteId === siteId) setSelectedSiteId(null)
  }

  const columnHeaders =
    activeTab === "inactive"
      ? ["Site Name", "Location", "Species", "Deactivated"]
      : activeTab === "requires-action"
      ? ["Site Name", "Status", "Current Reason", ""]
      : ["Site Name", "Status", "Next Delivery", ""]

  const gridCols = activeTab === "requires-action"
    ? "grid-cols-[2fr_1fr_2fr_120px]"
    : "grid-cols-[2fr_1fr_2fr_1fr]"

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">

      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-3.5 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-3">
          <Fish className="w-5 h-5 text-slate-500" />
          <div>
            <h1 className="text-sm font-semibold text-slate-900">Customers Overview</h1>
            <p className="text-xs text-slate-400">Feed ordering — automated monitoring</p>
          </div>
        </div>
        <button className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>
      </header>

      {/* Stat widgets */}
      <div className="shrink-0 grid grid-cols-4 gap-0 border-b border-slate-200 bg-white">
        <div className={`flex items-center gap-4 px-6 py-4 border-r border-slate-100 ${stats.red.sites > 0 ? "bg-red-50/60" : ""}`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${stats.red.sites > 0 ? "bg-red-100" : "bg-slate-100"}`}>
            <span className={`w-3.5 h-3.5 rounded-full ${stats.red.sites > 0 ? "bg-red-500 shadow-[0_0_6px_2px_rgba(239,68,68,0.4)]" : "bg-slate-300"}`} />
          </div>
          <div className="min-w-0">
            <p className={`text-2xl font-bold leading-none tabular-nums ${stats.red.sites > 0 ? "text-red-600" : "text-slate-400"}`}>{stats.red.sites}</p>
            <p className="text-xs font-medium text-slate-500 mt-1">Critical sites</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{stats.red.flags === 0 ? "No active flags" : `${stats.red.flags} active flag${stats.red.flags === 1 ? "" : "s"}`}</p>
          </div>
        </div>
        <div className={`flex items-center gap-4 px-6 py-4 border-r border-slate-100 ${stats.yellow.sites > 0 ? "bg-amber-50/60" : ""}`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${stats.yellow.sites > 0 ? "bg-amber-100" : "bg-slate-100"}`}>
            <span className={`w-3.5 h-3.5 rounded-full ${stats.yellow.sites > 0 ? "bg-amber-400 shadow-[0_0_6px_2px_rgba(251,191,36,0.4)]" : "bg-slate-300"}`} />
          </div>
          <div className="min-w-0">
            <p className={`text-2xl font-bold leading-none tabular-nums ${stats.yellow.sites > 0 ? "text-amber-600" : "text-slate-400"}`}>{stats.yellow.sites}</p>
            <p className="text-xs font-medium text-slate-500 mt-1">Warning sites</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{stats.yellow.flags === 0 ? "No active flags" : `${stats.yellow.flags} active flag${stats.yellow.flags === 1 ? "" : "s"}`}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 px-6 py-4 border-r border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-[0_0_6px_2px_rgba(16,185,129,0.4)]" />
          </div>
          <div className="min-w-0">
            <p className="text-2xl font-bold leading-none tabular-nums text-emerald-600">{stats.green.sites}</p>
            <p className="text-xs font-medium text-slate-500 mt-1">Healthy sites</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Fully automated</p>
          </div>
        </div>
        <div className="flex items-center gap-4 px-6 py-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${stats.totalFlags > 0 ? "bg-slate-900" : "bg-slate-100"}`}>
            <AlertTriangle className={`w-4 h-4 ${stats.totalFlags > 0 ? "text-white" : "text-slate-400"}`} />
          </div>
          <div className="min-w-0">
            <p className={`text-2xl font-bold leading-none tabular-nums ${stats.totalFlags > 0 ? "text-slate-900" : "text-slate-400"}`}>{stats.totalFlags}</p>
            <p className="text-xs font-medium text-slate-500 mt-1">Total active flags</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Across {stats.red.sites + stats.yellow.sites} non-healthy site{stats.red.sites + stats.yellow.sites === 1 ? "" : "s"}</p>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="shrink-0 bg-white border-b border-slate-200 px-5 flex items-end gap-0">
        {(["active", "inactive", "requires-action"] as Tab[]).map(tab => {
          const isActive = activeTab === tab
          return (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`relative px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                isActive
                  ? "text-slate-900 border-slate-900"
                  : "text-slate-500 border-transparent hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              {TAB_LABELS[tab]}
              {tab === "requires-action" && requiresActionCount > 0 && (
                <span className="ml-2 inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold px-1 leading-none">
                  {requiresActionCount}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Issue filter pills — requires-action only */}
      {activeTab === "requires-action" && issueOptions.length > 0 && (
        <div className="shrink-0 bg-white border-b border-slate-100 px-5 py-2.5 flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">Filter by issue:</span>
          <button
            onClick={() => setIssueFilter(null)}
            className={`text-xs px-2.5 py-1 rounded-full border font-medium transition-colors ${
              issueFilter === null
                ? "bg-slate-900 text-white border-slate-900"
                : "border-slate-200 text-slate-600 hover:border-slate-400 bg-white"
            }`}
          >
            All
          </button>
          {issueOptions.map(opt => (
            <button
              key={opt}
              onClick={() => setIssueFilter(issueFilter === opt ? null : opt)}
              className={`text-xs px-2.5 py-1 rounded-full border font-medium transition-colors whitespace-nowrap ${
                issueFilter === opt
                  ? "bg-red-600 text-white border-red-600"
                  : "border-slate-200 text-slate-600 hover:border-slate-400 bg-white"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {/* Content area — split when drawer open */}
      <div className="flex flex-1 min-h-0 transition-all duration-300">

        {/* Main table */}
        <div className={`flex flex-col min-h-0 overflow-hidden transition-all duration-300 ${drawerOpen ? "w-[60%]" : "w-full"}`}>

          {/* Column headers */}
          <div className={`grid gap-0 bg-slate-100 border-b border-slate-200 px-5 shrink-0 ${gridCols}`}>
            {columnHeaders.map((h, i) => (
              <div key={i} className="py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider px-3">
                {h}
              </div>
            ))}
          </div>

          {/* Rows */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 bg-white">
            {visibleSites.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 gap-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                <p className="text-sm text-slate-400">
                  {activeTab === "requires-action" ? "All clear — no issues to action" : "No sites in this category"}
                </p>
              </div>
            ) : visibleSites.map(site => {
              const isSelected = selectedSiteId === site.id
              const rowBg =
                activeTab === "requires-action"
                  ? site.status === "red"
                    ? "bg-red-50/40 hover:bg-red-50"
                    : "bg-amber-50/30 hover:bg-amber-50"
                  : "hover:bg-slate-50"

              return (
                <div
                  key={site.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedSiteId(isSelected ? null : site.id)}
                  onKeyDown={e => e.key === "Enter" && setSelectedSiteId(isSelected ? null : site.id)}
                  className={`w-full grid gap-0 px-5 py-3.5 text-left transition-colors cursor-pointer ${gridCols} ${rowBg} ${isSelected ? "ring-1 ring-inset ring-blue-200 bg-blue-50/30" : ""}`}
                >
                  {/* Site name — always first col */}
                  <div className="flex items-center min-w-0 px-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{site.name}</p>
                      <p className="text-xs text-slate-400 truncate">{site.customer}</p>
                    </div>
                  </div>

                  {activeTab === "inactive" ? (
                    <>
                      <div className="flex items-center px-3 text-sm text-slate-500 truncate">{site.location}</div>
                      <div className="flex items-center px-3 text-sm text-slate-500 truncate">{site.species}</div>
                      <div className="flex items-center px-3 text-xs text-slate-400 italic">Mar 2026</div>
                    </>
                  ) : activeTab === "requires-action" ? (
                    <>
                      <div className="flex items-center px-3">
                        <TrafficLight status={site.status} />
                      </div>
                      <div className="flex items-center gap-2 px-3 min-w-0">
                        <p className="text-sm text-slate-600 truncate">{site.reasons[0]}</p>
                        {site.reasons.length > 1 && (
                          <span className={`shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                            site.status === "red" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                          }`}>
                            +{site.reasons.length - 1}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-end px-3">
                        <button
                          onClick={e => handleResolve(e, site.id)}
                          className="text-xs px-3 py-1.5 rounded-lg font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors whitespace-nowrap"
                        >
                          Resolve
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center px-3">
                        <TrafficLight status={site.status} />
                      </div>
                      <div className="flex items-center px-3">
                        <p className="text-sm text-slate-700">{site.nextDelivery ?? "—"}</p>
                      </div>
                      <div className="flex items-center justify-end px-3">
                        <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? "text-blue-500" : "text-slate-300"}`} />
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>

          {/* Footer */}
          <div className="shrink-0 px-5 py-2 bg-white border-t border-slate-100">
            <p className="text-xs text-slate-400">
              {visibleSites.length} site{visibleSites.length === 1 ? "" : "s"}
              {issueFilter ? ` · Filtered by "${issueFilter}"` : ""}
              {" · "}
              {activeTab === "requires-action"
                ? "Click to inspect · Resolve to clear from list"
                : "Click a row to inspect"}
            </p>
          </div>
        </div>

        {/* Slide-out Drawer */}
        <div className={`shrink-0 overflow-hidden transition-all duration-300 ease-in-out border-l border-slate-200 ${drawerOpen ? "w-[40%]" : "w-0"}`}>
          {drawerSite && drawerOpen && (
            <SiteDrawer site={drawerSite} onClose={() => setSelectedSiteId(null)} />
          )}
        </div>
      </div>
    </div>
  )
}
