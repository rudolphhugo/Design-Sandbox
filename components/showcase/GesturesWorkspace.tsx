"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Camera, CameraOff, Hand, Scan, PersonStanding, Info, Zap } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type Section = "face" | "hands" | "pose"

interface SectionMeta {
  id: Section
  icon: React.ReactNode
  title: string
  subtitle: string
  tracks: string[]
  usedFor: string[]
  color: string
  dotColor: string
  bgColor: string
  borderColor: string
}

// ─── Section definitions ──────────────────────────────────────────────────────

const SECTIONS: SectionMeta[] = [
  {
    id: "face",
    icon: <Scan className="w-5 h-5" />,
    title: "Face Mesh",
    subtitle: "478 facial landmarks",
    tracks: [
      "478 3D landmark points across the face",
      "Eye, iris, and brow positions",
      "Lip and jaw contours",
      "Cheek and forehead geometry",
    ],
    usedFor: [
      "AR filters & face effects",
      "Emotion & expression detection",
      "Gaze tracking & eye contact analysis",
      "Virtual try-on (glasses, makeup)",
      "Accessibility: eye-controlled interfaces",
    ],
    color: "text-violet-600",
    dotColor: "bg-violet-500",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-200",
  },
  {
    id: "hands",
    icon: <Hand className="w-5 h-5" />,
    title: "Hand Tracking",
    subtitle: "21 landmarks × 2 hands",
    tracks: [
      "21 3D joint positions per hand",
      "Fingertip and knuckle coordinates",
      "Hand orientation and chirality (left/right)",
      "Gesture classification (pinch, open palm, etc.)",
    ],
    usedFor: [
      "Touchless UI & gesture control",
      "Sign language recognition",
      "AR hand effects and rings/gloves",
      "Surgical / industrial training",
      "Music & creative instrument control",
    ],
    color: "text-blue-600",
    dotColor: "bg-blue-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    id: "pose",
    icon: <PersonStanding className="w-5 h-5" />,
    title: "Pose Estimation",
    subtitle: "33 body landmarks",
    tracks: [
      "33 3D body landmarks head to toe",
      "Shoulder, elbow, wrist joints",
      "Hip, knee, and ankle positions",
      "Visibility confidence per point",
    ],
    usedFor: [
      "Fitness & rep counting",
      "Sports performance analysis",
      "Dance & choreography feedback",
      "Physical therapy monitoring",
      "Avatar and motion capture",
    ],
    color: "text-emerald-600",
    dotColor: "bg-emerald-500",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
  },
]

// ─── Connection maps for drawing skeletons ────────────────────────────────────

// Hand connections (MediaPipe 21-point model)
const HAND_CONNECTIONS: [number, number][] = [
  [0,1],[1,2],[2,3],[3,4],
  [0,5],[5,6],[6,7],[7,8],
  [0,9],[9,10],[10,11],[11,12],
  [0,13],[13,14],[14,15],[15,16],
  [0,17],[17,18],[18,19],[19,20],
  [5,9],[9,13],[13,17],
]

// Pose connections (MediaPipe 33-point model — upper body focus for visibility)
const POSE_CONNECTIONS: [number, number][] = [
  // Face
  [0,1],[1,2],[2,3],[3,7],[0,4],[4,5],[5,6],[6,8],
  // Torso
  [11,12],[11,23],[12,24],[23,24],
  // Left arm
  [11,13],[13,15],[15,17],[15,19],[15,21],[17,19],
  // Right arm
  [12,14],[14,16],[16,18],[16,20],[16,22],[18,20],
  // Left leg
  [23,25],[25,27],[27,29],[27,31],[29,31],
  // Right leg
  [24,26],[26,28],[28,30],[28,32],[30,32],
]

// Face mesh connections (simplified — just key contours for performance)
const FACE_OVAL: number[] = [10,338,297,332,284,251,389,356,454,323,361,288,397,365,379,378,400,377,152,148,176,149,150,136,172,58,132,93,234,127,162,21,54,103,67,109,10]

// ─── Drawing utilities ────────────────────────────────────────────────────────

function drawLandmarks(
  ctx: CanvasRenderingContext2D,
  landmarks: { x: number; y: number; z?: number }[],
  w: number,
  h: number,
  color: string,
  radius = 3
) {
  ctx.fillStyle = color
  for (const lm of landmarks) {
    ctx.beginPath()
    ctx.arc(lm.x * w, lm.y * h, radius, 0, Math.PI * 2)
    ctx.fill()
  }
}

function drawConnections(
  ctx: CanvasRenderingContext2D,
  landmarks: { x: number; y: number }[],
  connections: [number, number][],
  w: number,
  h: number,
  color: string,
  lineWidth = 2
) {
  ctx.strokeStyle = color
  ctx.lineWidth = lineWidth
  for (const [a, b] of connections) {
    if (landmarks[a] && landmarks[b]) {
      ctx.beginPath()
      ctx.moveTo(landmarks[a].x * w, landmarks[a].y * h)
      ctx.lineTo(landmarks[b].x * w, landmarks[b].y * h)
      ctx.stroke()
    }
  }
}

function drawPolyline(
  ctx: CanvasRenderingContext2D,
  landmarks: { x: number; y: number }[],
  indices: number[],
  w: number,
  h: number,
  color: string
) {
  ctx.strokeStyle = color
  ctx.lineWidth = 1.5
  ctx.beginPath()
  for (let i = 0; i < indices.length; i++) {
    const lm = landmarks[indices[i]]
    if (!lm) continue
    if (i === 0) ctx.moveTo(lm.x * w, lm.y * h)
    else ctx.lineTo(lm.x * w, lm.y * h)
  }
  ctx.stroke()
}

// ─── Individual demo components ───────────────────────────────────────────────

function FaceDemo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [active, setActive] = useState(false)
  const [status, setStatus] = useState<"idle" | "loading" | "running" | "error">("idle")
  const rafRef = useRef<number>(0)
  const detectorRef = useRef<any>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const stop = useCallback(() => {
    setActive(false)
    setStatus("idle")
    cancelAnimationFrame(rafRef.current)
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d")
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    }
  }, [])

  const start = useCallback(async () => {
    setActive(true)
    setStatus("loading")
    try {
      const { FaceLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision")
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      )
      detectorRef.current = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numFaces: 1,
        outputFaceBlendshapes: false,
      })

      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }

      setStatus("running")

      const loop = () => {
        const video = videoRef.current
        const canvas = canvasRef.current
        if (!video || !canvas || !detectorRef.current) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        ctx.drawImage(video, 0, 0)

        const result = detectorRef.current.detectForVideo(video, performance.now())
        if (result.faceLandmarks?.length > 0) {
          const lms = result.faceLandmarks[0]
          const w = canvas.width
          const h = canvas.height

          // Draw face oval contour
          drawPolyline(ctx, lms, FACE_OVAL, w, h, "rgba(167,139,250,0.8)")

          // Draw all landmark dots (thin, semi-transparent mesh feel)
          ctx.fillStyle = "rgba(167,139,250,0.6)"
          for (const lm of lms) {
            ctx.beginPath()
            ctx.arc(lm.x * w, lm.y * h, 1.5, 0, Math.PI * 2)
            ctx.fill()
          }
        }

        rafRef.current = requestAnimationFrame(loop)
      }
      loop()
    } catch (e) {
      console.error(e)
      setStatus("error")
      setActive(false)
    }
  }, [])

  useEffect(() => () => stop(), [stop])

  return <DemoShell active={active} status={status} onStart={start} onStop={stop} videoRef={videoRef} canvasRef={canvasRef} accentColor="violet" />
}

function HandsDemo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [active, setActive] = useState(false)
  const [status, setStatus] = useState<"idle" | "loading" | "running" | "error">("idle")
  const rafRef = useRef<number>(0)
  const detectorRef = useRef<any>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const stop = useCallback(() => {
    setActive(false)
    setStatus("idle")
    cancelAnimationFrame(rafRef.current)
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d")
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    }
  }, [])

  const start = useCallback(async () => {
    setActive(true)
    setStatus("loading")
    try {
      const { HandLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision")
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      )
      detectorRef.current = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numHands: 2,
      })

      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }

      setStatus("running")

      const loop = () => {
        const video = videoRef.current
        const canvas = canvasRef.current
        if (!video || !canvas || !detectorRef.current) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        ctx.drawImage(video, 0, 0)

        const result = detectorRef.current.detectForVideo(video, performance.now())
        if (result.landmarks?.length > 0) {
          result.landmarks.forEach((hand: any[], i: number) => {
            const isRight = result.handedness?.[i]?.[0]?.categoryName === "Right"
            const jointColor = isRight ? "rgba(96,165,250,0.9)" : "rgba(52,211,153,0.9)"
            const boneColor  = isRight ? "rgba(59,130,246,0.7)" : "rgba(16,185,129,0.7)"
            const w = canvas.width
            const h = canvas.height

            drawConnections(ctx, hand, HAND_CONNECTIONS, w, h, boneColor, 2.5)
            drawLandmarks(ctx, hand, w, h, jointColor, 4)

            // Fingertip highlights
            const tips = [4, 8, 12, 16, 20]
            ctx.fillStyle = "white"
            for (const t of tips) {
              ctx.beginPath()
              ctx.arc(hand[t].x * w, hand[t].y * h, 5, 0, Math.PI * 2)
              ctx.fill()
            }
          })
        }

        rafRef.current = requestAnimationFrame(loop)
      }
      loop()
    } catch (e) {
      console.error(e)
      setStatus("error")
      setActive(false)
    }
  }, [])

  useEffect(() => () => stop(), [stop])

  return <DemoShell active={active} status={status} onStart={start} onStop={stop} videoRef={videoRef} canvasRef={canvasRef} accentColor="blue" />
}

function PoseDemo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [active, setActive] = useState(false)
  const [status, setStatus] = useState<"idle" | "loading" | "running" | "error">("idle")
  const rafRef = useRef<number>(0)
  const detectorRef = useRef<any>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const stop = useCallback(() => {
    setActive(false)
    setStatus("idle")
    cancelAnimationFrame(rafRef.current)
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d")
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    }
  }, [])

  const start = useCallback(async () => {
    setActive(true)
    setStatus("loading")
    try {
      const { PoseLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision")
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      )
      detectorRef.current = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numPoses: 1,
      })

      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }

      setStatus("running")

      const loop = () => {
        const video = videoRef.current
        const canvas = canvasRef.current
        if (!video || !canvas || !detectorRef.current) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        ctx.drawImage(video, 0, 0)

        const result = detectorRef.current.detectForVideo(video, performance.now())
        if (result.landmarks?.length > 0) {
          const lms = result.landmarks[0]
          const w = canvas.width
          const h = canvas.height

          drawConnections(ctx, lms, POSE_CONNECTIONS, w, h, "rgba(52,211,153,0.75)", 3)
          drawLandmarks(ctx, lms, w, h, "rgba(52,211,153,0.95)", 5)

          // Joint highlights for key points
          const keyPoints = [0, 11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28]
          ctx.fillStyle = "white"
          for (const i of keyPoints) {
            if (lms[i]?.visibility > 0.5) {
              ctx.beginPath()
              ctx.arc(lms[i].x * w, lms[i].y * h, 6, 0, Math.PI * 2)
              ctx.fill()
            }
          }
        }

        rafRef.current = requestAnimationFrame(loop)
      }
      loop()
    } catch (e) {
      console.error(e)
      setStatus("error")
      setActive(false)
    }
  }, [])

  useEffect(() => () => stop(), [stop])

  return <DemoShell active={active} status={status} onStart={start} onStop={stop} videoRef={videoRef} canvasRef={canvasRef} accentColor="emerald" />
}

// ─── Shared camera shell ──────────────────────────────────────────────────────

type AccentColor = "violet" | "blue" | "emerald"

const ACCENT: Record<AccentColor, { btn: string; ring: string; badge: string; loader: string }> = {
  violet: {
    btn:    "bg-violet-600 hover:bg-violet-700 text-white",
    ring:   "ring-violet-400",
    badge:  "bg-violet-100 text-violet-700 border-violet-200",
    loader: "border-violet-500",
  },
  blue: {
    btn:    "bg-blue-600 hover:bg-blue-700 text-white",
    ring:   "ring-blue-400",
    badge:  "bg-blue-100 text-blue-700 border-blue-200",
    loader: "border-blue-500",
  },
  emerald: {
    btn:    "bg-emerald-600 hover:bg-emerald-700 text-white",
    ring:   "ring-emerald-400",
    badge:  "bg-emerald-100 text-emerald-700 border-emerald-200",
    loader: "border-emerald-500",
  },
}

interface DemoShellProps {
  active: boolean
  status: "idle" | "loading" | "running" | "error"
  onStart: () => void
  onStop: () => void
  videoRef: React.RefObject<HTMLVideoElement | null>
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  accentColor: AccentColor
}

function DemoShell({ active, status, onStart, onStop, videoRef, canvasRef, accentColor }: DemoShellProps) {
  const a = ACCENT[accentColor]

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Camera viewport */}
      <div className={`relative bg-slate-950 rounded-xl overflow-hidden aspect-video w-full ${active ? `ring-2 ${a.ring}` : ""}`}>
        {/* Video element (hidden — canvas draws on top) */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover opacity-0"
          muted
          playsInline
        />
        {/* Canvas overlay */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Idle state */}
        {!active && status !== "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
              <Camera className="w-7 h-7 text-white/50" />
            </div>
            <p className="text-sm text-white/40">Camera off — press Start to begin</p>
          </div>
        )}

        {/* Loading state */}
        {status === "loading" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950/80">
            <div className={`w-10 h-10 rounded-full border-2 border-t-transparent animate-spin ${a.loader}`} />
            <p className="text-sm text-white/60">Loading model…</p>
          </div>
        )}

        {/* Error state */}
        {status === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <CameraOff className="w-8 h-8 text-red-400" />
            <p className="text-sm text-red-400">Camera error — check permissions</p>
          </div>
        )}

        {/* Running badge */}
        {status === "running" && (
          <div className="absolute top-3 left-3">
            <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${a.badge}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              Live
            </span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        {!active ? (
          <button
            onClick={onStart}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${a.btn}`}
          >
            <Camera className="w-4 h-4" />
            Start camera
          </button>
        ) : (
          <button
            onClick={onStop}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-slate-900 hover:bg-slate-800 text-white transition-colors"
          >
            <CameraOff className="w-4 h-4" />
            Stop camera
          </button>
        )}
        <p className="text-xs text-slate-400">Camera feed stays local — nothing is uploaded</p>
      </div>
    </div>
  )
}

// ─── Main Workspace ───────────────────────────────────────────────────────────

export function GesturesWorkspace() {
  const [activeSection, setActiveSection] = useState<Section>("face")

  const meta = SECTIONS.find(s => s.id === activeSection)!

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col bg-slate-50 overflow-hidden">

      {/* Header */}
      <header className="shrink-0 flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-slate-900">MediaPipe Explorer</h1>
            <p className="text-xs text-slate-400">Real-time ML vision — runs fully in-browser</p>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-500 font-medium">
          @mediapipe/tasks-vision
        </span>
      </header>

      {/* Section tabs */}
      <div className="shrink-0 flex gap-0 bg-white border-b border-slate-200 px-6">
        {SECTIONS.map(s => {
          const isActive = activeSection === s.id
          return (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
                isActive
                  ? `${s.color} border-current`
                  : "text-slate-500 border-transparent hover:text-slate-700"
              }`}
            >
              <span className={isActive ? s.color : "text-slate-400"}>{s.icon}</span>
              {s.title}
              <span className={`text-[11px] px-1.5 py-0.5 rounded-full border font-normal ${isActive ? `${s.bgColor} ${s.borderColor} ${s.color}` : "bg-slate-50 border-slate-200 text-slate-400"}`}>
                {s.subtitle}
              </span>
            </button>
          )
        })}
      </div>

      {/* Content — info left, camera right */}
      <div className="flex-1 min-h-0 flex gap-0 overflow-hidden">

        {/* Left panel — info */}
        <div className="w-[340px] shrink-0 overflow-y-auto border-r border-slate-200 bg-white">
          <div className="p-5 space-y-5">

            {/* What it tracks */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Info className={`w-4 h-4 ${meta.color}`} />
                <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">What it tracks</h3>
              </div>
              <ul className="space-y-2">
                {meta.tracks.map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className={`mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full ${meta.dotColor}`} />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-slate-100" />

            {/* Used for */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Zap className={`w-4 h-4 ${meta.color}`} />
                <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Used for</h3>
              </div>
              <ul className="space-y-2">
                {meta.usedFor.map((u, i) => (
                  <li key={i} className={`flex items-start gap-2.5 text-sm rounded-lg px-3 py-2 border ${meta.bgColor} ${meta.borderColor}`}>
                    <span className={`mt-0.5 text-xs font-bold ${meta.color}`}>{i + 1}</span>
                    <span className="text-slate-700">{u}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-slate-100" />

            {/* Tech note */}
            <div className={`rounded-lg p-3.5 border text-xs ${meta.bgColor} ${meta.borderColor}`}>
              <p className={`font-semibold mb-1 ${meta.color}`}>How it works</p>
              <p className="text-slate-600 leading-relaxed">
                {activeSection === "face" && "A lightweight model detects 478 face landmarks in a single forward pass. Running at ~30fps via WebAssembly + WebGL — no server round-trips."}
                {activeSection === "hands" && "Two-stage pipeline: palm detector first, then 21-point landmark regression per hand. GPU acceleration via WebGL for real-time performance."}
                {activeSection === "pose" && "BlazePose Lite model detects 33 3D body landmarks. Optimized for mobile — uses heatmaps + regression for sub-30ms inference."}
              </p>
            </div>
          </div>
        </div>

        {/* Right panel — camera demo */}
        <div className="flex-1 overflow-hidden p-6 bg-slate-50">
          <div className="h-full flex flex-col max-w-2xl mx-auto">
            <div className="mb-3">
              <h2 className={`text-base font-semibold ${meta.color}`}>{meta.title} — Live Demo</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeSection === "face" && "Position your face in the frame. Purple dots will map across your facial landmarks."}
                {activeSection === "hands" && "Hold your hands up to the camera. Blue = right hand, green = left hand."}
                {activeSection === "pose" && "Step back so your full body is visible. Green skeleton will track your joints."}
              </p>
            </div>

            <div className="flex-1 min-h-0">
              {activeSection === "face"  && <FaceDemo />}
              {activeSection === "hands" && <HandsDemo />}
              {activeSection === "pose"  && <PoseDemo />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
