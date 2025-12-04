import { Home, FileText, BookOpen, Github, Linkedin, Twitter, Mail, Settings, ArrowUp, Clock } from "lucide-react"

export const DOCK_ITEMS = [
  { id: "home", icon: Home, label: "Home", href: "/" },
  { id: "posts", icon: FileText, label: "Posts", href: "/posts" },
  { id: "shelf", icon: BookOpen, label: "Research", href: "/shelf" },
  { id: "divider1", type: "divider" as const },
  { id: "github", icon: Github, label: "GitHub", href: "https://github.com/ashishkumar", external: true },
  { id: "linkedin", icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/in/ashishkumar", external: true },
  { id: "twitter", icon: Twitter, label: "Twitter", href: "https://twitter.com/ashishkumar", external: true },
  { id: "email", icon: Mail, label: "Email", href: "mailto:ashish.kumar@gmail.com", external: true },
  { id: "divider2", type: "divider" as const },
  { id: "settings", icon: Settings, label: "Settings", action: "settings" as const },
  { id: "top", icon: ArrowUp, label: "Back to Top", action: "scrollTop" as const },
  { id: "time", icon: Clock, label: "Local Time", action: "time" as const },
]
