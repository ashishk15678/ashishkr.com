"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { DOCK_ITEMS } from "@/lib/constants/dock"
import type { LucideIcon } from "lucide-react"

export function ScrollDock() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)
  const [localTime, setLocalTime] = useState("")
  const [showTime, setShowTime] = useState(false)
  const pathname = usePathname()
  const dockRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0
      setScrollProgress(progress)
    }

    const updateTime = () => {
      const time = new Date().toLocaleTimeString("en-US", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      setLocalTime(time)
    }

    handleScroll()
    updateTime()
    window.addEventListener("scroll", handleScroll, { passive: true })
    const timeInterval = setInterval(updateTime, 1000)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearInterval(timeInterval)
    }
  }, [])

  const handleAction = (action: string) => {
    if (action === "scrollTop") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else if (action === "time") {
      setShowTime(!showTime)
    }
  }

  return (
    <div
      ref={dockRef}
      className="fixed right-4 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-center"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => {
        setIsExpanded(false)
        setShowTime(false)
      }}
    >
      {/* Scroll progress bar */}
      <div className="relative w-1 h-32 bg-muted rounded-full overflow-hidden mb-4">
        <div
          className="absolute bottom-0 left-0 right-0 bg-foreground rounded-full transition-all duration-150"
          style={{ height: `${scrollProgress}%` }}
        />
        <div
          className="absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-foreground rounded-full border-2 border-background shadow-lg transition-all duration-150"
          style={{ bottom: `calc(${scrollProgress}% - 6px)` }}
        />
      </div>

      {/* Expandable dock */}
      <div
        className={`
          flex flex-col items-center gap-1 p-2 rounded-2xl border border-border bg-background/95 backdrop-blur-md shadow-2xl
          transition-all duration-300 ease-out origin-center
          ${isExpanded ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"}
        `}
      >
        {DOCK_ITEMS.map((item) => {
          if (item.type === "divider") {
            return <div key={item.id} className="w-8 h-px bg-border my-1" />
          }

          const Icon = item.icon as LucideIcon
          const isActive = item.href === pathname
          const isExternal = item.external

          const content = (
            <div
              className={`
                group relative flex items-center justify-center w-10 h-10 rounded-xl
                transition-all duration-200 ease-out
                hover:bg-foreground hover:text-background hover:scale-110
                ${isActive ? "bg-foreground text-background" : "text-muted-foreground"}
              `}
            >
              <Icon className="w-4 h-4" />
              {/* Tooltip */}
              <span
                className="
                  absolute right-full mr-3 px-2 py-1 text-xs font-medium whitespace-nowrap
                  bg-foreground text-background rounded-md
                  opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100
                  transition-all duration-150 pointer-events-none
                "
              >
                {item.label}
                {item.id === "time" && showTime && `: ${localTime}`}
              </span>
            </div>
          )

          if (item.action) {
            return (
              <button key={item.id} onClick={() => handleAction(item.action as string)} className="outline-none">
                {content}
              </button>
            )
          }

          if (isExternal) {
            return (
              <a key={item.id} href={item.href} target="_blank" rel="noopener noreferrer">
                {content}
              </a>
            )
          }

          return (
            <Link key={item.id} href={item.href as string}>
              {content}
            </Link>
          )
        })}
      </div>

      {/* Time display */}
      {showTime && (
        <div className="mt-4 px-3 py-2 bg-foreground text-background rounded-lg text-sm font-mono animate-in fade-in slide-in-from-right-2 duration-200">
          {localTime}
        </div>
      )}
    </div>
  )
}
