"use client"

import { useState } from "react"
import {
  PawPrint,
  Puzzle,
  Paintbrush,
  Castle,
  Dumbbell,
  Zap,
  GraduationCap,
  Smile,
  Moon,
  Search,
  ArrowLeft,
  ChevronDown,
  Play,
  Gamepad2,
  Video,
  BookOpen,
  Settings,
} from "lucide-react"

type View = "main" | "search"

interface Category {
  id: string
  label: string
  Icon: React.ComponentType<{ size?: number; className?: string }>
}

interface Game {
  id: number
  title: string
  gradient: string
  accent: string
  hasPlay?: boolean
}

const CATEGORIES: Category[] = [
  { id: "pets", label: "Pets", Icon: PawPrint },
  { id: "puzzle", label: "Puzzle", Icon: Puzzle },
  { id: "brainteaser", label: "Brainteaser", Icon: Puzzle },
  { id: "art", label: "Art", Icon: Paintbrush },
  { id: "strategy", label: "Strategy", Icon: Castle },
  { id: "sports", label: "Sports", Icon: Dumbbell },
  { id: "action", label: "Action", Icon: Zap },
  { id: "education", label: "Education", Icon: GraduationCap },
  { id: "social", label: "Social", Icon: Smile },
  { id: "night", label: "Night", Icon: Moon },
]

const NEW_GAMES: Game[] = [
  {
    id: 1,
    title: "Cut the rope",
    gradient: "linear-gradient(145deg, #166534 0%, #16a34a 50%, #4ade80 100%)",
    accent: "#86efac",
  },
  {
    id: 2,
    title: "ABC Fun",
    gradient: "linear-gradient(145deg, #075985 0%, #0ea5e9 55%, #7dd3fc 100%)",
    accent: "#bae6fd",
  },
  {
    id: 3,
    title: "Cat Life",
    gradient: "linear-gradient(145deg, #9d174d 0%, #ec4899 55%, #fbcfe8 100%)",
    accent: "#fce7f3",
  },
  {
    id: 4,
    title: "Brickbreaker",
    gradient: "linear-gradient(145deg, #1e1b4b 0%, #3730a3 55%, #6366f1 100%)",
    accent: "#a5b4fc",
    hasPlay: true,
  },
]

const POPULAR_GAMES: Game[] = [
  {
    id: 5,
    title: "My World",
    gradient: "linear-gradient(145deg, #581c87 0%, #9333ea 55%, #d8b4fe 100%)",
    accent: "#f3e8ff",
  },
  {
    id: 6,
    title: "Crossy roads",
    gradient: "linear-gradient(145deg, #134e4a 0%, #14b8a6 55%, #99f6e4 100%)",
    accent: "#ccfbf1",
    hasPlay: true,
  },
  {
    id: 7,
    title: "Tivoli Fun!",
    gradient: "linear-gradient(145deg, #0c4a6e 0%, #38bdf8 55%, #e0f2fe 100%)",
    accent: "#f0f9ff",
  },
  {
    id: 8,
    title: "Makeup salon",
    gradient: "linear-gradient(145deg, #881337 0%, #f43f5e 55%, #fda4af 100%)",
    accent: "#ffe4e6",
  },
  {
    id: 9,
    title: "Princess",
    gradient: "linear-gradient(145deg, #701a75 0%, #d946ef 55%, #f0abfc 100%)",
    accent: "#fae8ff",
  },
  {
    id: 10,
    title: "Fish world",
    gradient: "linear-gradient(145deg, #164e63 0%, #0891b2 55%, #a5f3fc 100%)",
    accent: "#cffafe",
  },
]

const POPULAR_SEARCHES: Game[] = [
  {
    id: 1,
    title: "Cut the rope",
    gradient: "linear-gradient(145deg, #166534 0%, #16a34a 50%, #4ade80 100%)",
    accent: "#86efac",
  },
  {
    id: 2,
    title: "Crossy roads",
    gradient: "linear-gradient(145deg, #134e4a 0%, #14b8a6 55%, #99f6e4 100%)",
    accent: "#ccfbf1",
    hasPlay: true,
  },
  {
    id: 3,
    title: "Makeup salon",
    gradient: "linear-gradient(145deg, #881337 0%, #f43f5e 55%, #fda4af 100%)",
    accent: "#ffe4e6",
  },
]

const scrollHide: React.CSSProperties = {
  scrollbarWidth: "none",
  msOverflowStyle: "none",
}

function GameCard({
  game,
  width = 208,
  height = 240,
}: {
  game: Game
  width?: number
  height?: number
}) {
  return (
    <div
      className="relative rounded-[22px] overflow-hidden flex-shrink-0 cursor-pointer group"
      style={{ background: game.gradient, width, height }}
    >
      {/* Accent blobs */}
      <div
        className="absolute -top-8 -right-8 w-28 h-28 rounded-full opacity-25"
        style={{ background: game.accent }}
      />
      <div
        className="absolute top-1/2 -left-6 w-16 h-16 rounded-full opacity-20"
        style={{ background: game.accent }}
      />
      <div
        className="absolute bottom-1/3 right-1/3 w-10 h-10 rounded-full opacity-15"
        style={{ background: game.accent }}
      />

      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-200" />

      {/* Title overlay */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pt-10 pb-3 px-3">
        <p className="text-white font-semibold text-sm leading-snug drop-shadow">
          {game.title}
        </p>
      </div>

      {game.hasPlay && (
        <div className="absolute bottom-3 right-3 w-9 h-9 bg-green-500 rounded-xl flex items-center justify-center shadow-md">
          <Play size={15} fill="white" className="text-white ml-0.5" />
        </div>
      )}
    </div>
  )
}

function FilterButton({
  category,
  isActive,
  onClick,
}: {
  category: Category
  isActive: boolean
  onClick: () => void
}) {
  const { Icon, label } = category
  return (
    <button
      onClick={onClick}
      className={[
        "flex items-center justify-center gap-2 rounded-2xl flex-shrink-0 h-14",
        "transition-all duration-200 cursor-pointer",
        isActive
          ? "bg-white text-purple-700 px-4 font-semibold"
          : "bg-white/20 text-white w-14 hover:bg-white/30",
      ].join(" ")}
    >
      <Icon size={22} className="flex-shrink-0" />
      {isActive && <span className="text-sm whitespace-nowrap">{label}</span>}
    </button>
  )
}

function Background() {
  const plusMarks = [
    { size: 110, opacity: 0.12, top: 30, right: 90 },
    { size: 72, opacity: 0.08, top: 220, right: 380 },
    { size: 90, opacity: 0.09, bottom: 80, left: 220 },
    { size: 56, opacity: 0.07, bottom: 240, right: 560 },
    { size: 44, opacity: 0.06, top: 350, left: 80 },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {plusMarks.map((p, i) => (
        <span
          key={i}
          className="absolute text-white font-extralight leading-none"
          style={{
            fontSize: p.size,
            opacity: p.opacity,
            top: "top" in p ? p.top : undefined,
            bottom: "bottom" in p ? p.bottom : undefined,
            left: "left" in p ? p.left : undefined,
            right: "right" in p ? p.right : undefined,
          }}
        >
          +
        </span>
      ))}

      {/* Circle outlines */}
      <div
        className="absolute rounded-full border border-white/10"
        style={{ width: 420, height: 420, left: -160, top: "45%", transform: "translateY(-50%)" }}
      />
      <div
        className="absolute rounded-full border border-white/[0.07]"
        style={{ width: 280, height: 280, left: -80, top: "45%", transform: "translateY(-50%)" }}
      />

      {/* Glow blobs bottom-right */}
      <div
        className="absolute rounded-full blur-3xl"
        style={{
          width: 600,
          height: 600,
          bottom: -200,
          right: -100,
          background: "radial-gradient(circle, rgba(100,130,255,0.12) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute rounded-full blur-3xl"
        style={{
          width: 380,
          height: 380,
          bottom: -80,
          right: 80,
          background: "radial-gradient(circle, rgba(80,200,220,0.07) 0%, transparent 70%)",
        }}
      />
    </div>
  )
}

function MainView({
  activeFilter,
  onFilterChange,
  onSearchClick,
}: {
  activeFilter: string | null
  onFilterChange: (id: string) => void
  onSearchClick: () => void
}) {
  return (
    <div className="py-8 space-y-8">
      <section className="px-8">
        <h2 className="text-white text-xl font-semibold mb-4">New games</h2>
        <div className="flex gap-4 overflow-x-auto pb-1" style={scrollHide}>
          {NEW_GAMES.map((game) => (
            <GameCard key={game.id} game={game} width={210} height={245} />
          ))}
        </div>
      </section>

      <section className="px-8">
        <h2 className="text-white text-xl font-semibold mb-4">Filter by category</h2>
        <div className="flex gap-2 overflow-x-auto pb-1" style={scrollHide}>
          {CATEGORIES.map((cat) => (
            <FilterButton
              key={cat.id}
              category={cat}
              isActive={activeFilter === cat.id}
              onClick={() => onFilterChange(cat.id)}
            />
          ))}
          <button
            onClick={onSearchClick}
            className="w-14 h-14 bg-purple-900 hover:bg-purple-800 rounded-2xl flex items-center justify-center flex-shrink-0 text-white transition-colors"
          >
            <Search size={22} />
          </button>
        </div>
      </section>

      <section className="px-8">
        <h2 className="text-white text-xl font-semibold mb-4">Popular games</h2>
        <div className="flex gap-4 overflow-x-auto pb-1" style={scrollHide}>
          {POPULAR_GAMES.map((game) => (
            <GameCard key={game.id} game={game} width={172} height={200} />
          ))}
        </div>
      </section>
    </div>
  )
}

function SearchView({ onBack }: { onBack: () => void }) {
  const [query, setQuery] = useState("")

  return (
    <div className="flex flex-col min-h-screen">
      <header
        className="border-b border-white/10 px-6 py-3.5 flex items-center gap-6 flex-shrink-0"
        style={{ background: "rgba(20,4,70,0.75)", backdropFilter: "blur(8px)" }}
      >
        <button
          onClick={onBack}
          className="text-white hover:text-white/70 transition-colors"
        >
          <ArrowLeft size={26} />
        </button>

        <h1 className="flex-1 text-center text-white font-semibold text-lg">
          Advanced search
        </h1>

        <nav className="flex items-center gap-5">
          <div className="flex items-center gap-2 bg-purple-600 rounded-full px-4 py-1.5">
            <Gamepad2 size={18} className="text-white" />
            <span className="text-white text-sm font-semibold">Games</span>
          </div>
          <Video size={22} className="text-white/50 cursor-pointer hover:text-white transition-colors" />
          <GraduationCap size={22} className="text-white/50 cursor-pointer hover:text-white transition-colors" />
          <BookOpen size={22} className="text-white/50 cursor-pointer hover:text-white transition-colors" />
          <Settings size={22} className="text-white/50 cursor-pointer hover:text-white transition-colors" />
        </nav>
      </header>

      <div className="px-8 pt-8 pb-12">
        {/* Search controls */}
        <div className="flex gap-4 items-center mb-14">
          <div className="flex-1 flex items-center gap-3 bg-white rounded-full px-5 py-4 shadow-lg">
            <Search size={22} className="text-purple-600 flex-shrink-0" />
            <input
              type="text"
              placeholder="Enter your search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 outline-none text-gray-700 bg-transparent text-base placeholder:text-gray-400"
            />
          </div>

          <div className="flex items-center gap-3 bg-white rounded-full px-5 py-4 shadow-lg cursor-pointer min-w-72">
            <span className="flex-1 text-gray-400 text-base select-none">
              Select category - Optional
            </span>
            <ChevronDown size={20} className="text-gray-500 flex-shrink-0" />
          </div>

          <button className="bg-purple-800 hover:bg-purple-700 transition-colors text-white font-semibold text-base px-10 py-4 rounded-full shadow-lg whitespace-nowrap">
            Search
          </button>
        </div>

        {/* Popular searches */}
        <section>
          <h2 className="text-white text-xl font-semibold mb-5">Popular searches</h2>
          <div className="flex gap-5">
            {POPULAR_SEARCHES.map((game) => (
              <GameCard key={game.id} game={game} width={210} height={245} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export function KidsGamesHub() {
  const [view, setView] = useState<View>("main")
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  function handleFilterChange(id: string) {
    setActiveFilter((prev) => (prev === id ? null : id))
  }

  return (
    <div
      className="relative w-full min-h-screen overflow-hidden text-white"
      style={{
        background:
          "linear-gradient(135deg, #3d0e91 0%, #5529b8 30%, #4a4dca 65%, #3d62d8 100%)",
      }}
    >
      <Background />
      <div className="relative z-10">
        {view === "main" ? (
          <MainView
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
            onSearchClick={() => setView("search")}
          />
        ) : (
          <SearchView onBack={() => setView("main")} />
        )}
      </div>
    </div>
  )
}
