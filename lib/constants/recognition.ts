export interface Recognition {
  id: string
  year: string
  title: string
  organization: string
}

export const RECOGNITIONS: Recognition[] = [
  {
    id: "1",
    year: "2024",
    title: "Winner - Google AI Hackathon",
    organization: "Google Developer Groups / Bangalore",
  },
  {
    id: "2",
    year: "2024",
    title: "Best Innovation Award",
    organization: "TechCrunch Disrupt / India",
  },
  {
    id: "3",
    year: "2023",
    title: "1st Place - Smart India Hackathon",
    organization: "Ministry of Education / Govt. of India",
  },
  {
    id: "4",
    year: "2023",
    title: "Open Source Contributor of the Year",
    organization: "GitHub India",
  },
  {
    id: "5",
    year: "2022",
    title: "Gold Medal - M.Tech Computer Science",
    organization: "IIT Delhi",
  },
]
