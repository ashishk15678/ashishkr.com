"use client"

import type React from "react"

import { useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  strength?: number
  as?: "button" | "a" | "div"
  href?: string
  onClick?: () => void
  external?: boolean
}

export function MagneticButton({
  children,
  className,
  strength = 0.3,
  as = "button",
  href,
  onClick,
  external,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const deltaX = (e.clientX - centerX) * strength
    const deltaY = (e.clientY - centerY) * strength
    setPosition({ x: deltaX, y: deltaY })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  const style = {
    transform: `translate(${position.x}px, ${position.y}px)`,
    transition: position.x === 0 && position.y === 0 ? "transform 0.3s ease-out" : "none",
  }

  const Component = as

  const props = {
    ref: ref as React.RefObject<HTMLButtonElement & HTMLAnchorElement & HTMLDivElement>,
    className: cn("inline-block", className),
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    style,
    onClick,
    ...(as === "a" && href
      ? { href, target: external ? "_blank" : undefined, rel: external ? "noopener noreferrer" : undefined }
      : {}),
  }

  return <Component {...(props as React.HTMLAttributes<HTMLElement>)}>{children}</Component>
}
