export const SITE_CONFIG = {
  name: "Ashish Kumar",
  firstName: "ASHISH",
  lastName: "KUMAR",
  email: "15678ashish@gmail.com",
  location: "Gr Noida, INDIA",
  credentials: "Student — B.TECH",
  tagline:
    "Full-stack & Backend Engineer turning complex problems into elegant solutions.",
  bio: "Building scalable systems and intelligent applications with a focus on user experience and performance.",
  openToWork: true,
  copyright: `© ${new Date().getFullYear()} ASHISH KUMAR`,
  version: "PORTFOLIO_V1",
};

export const SOCIAL_LINKS = {
  github: "https://github.com/ashishk15678",
  linkedin: "https://www.linkedin.com/in/ashishk15678/",
  twitter: "https://twitter.com/ashishonsol",
  email: `mailto:${SITE_CONFIG.email}`,
};

export const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Posts", href: "/posts" },
  { name: "Shelf", href: "/shelf" },
  { name: "Designs", href: "/designs" },
];
