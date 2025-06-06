export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  content: string;
  skills: {
    before: number;
    after: number;
    improvement: number;
  };
  featured?: boolean;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "Product Manager",
    company: "TechCorp",
    avatar: "/avatars/sarah.svg",
    rating: 5,
    content:
      "Promptly transformed my approach to AI tools. I went from basic ChatGPT usage to implementing AI workflows that saved my team 15 hours per week. The gamification made learning addictive!",
    skills: {
      before: 2,
      after: 8,
      improvement: 300,
    },
    featured: true,
  },
  {
    id: "2",
    name: "Marcus Rodriguez",
    role: "Software Engineer",
    company: "StartupXYZ",
    avatar: "/avatars/marcus.svg",
    rating: 5,
    content:
      "The skill tree approach is genius. I could see exactly what I needed to learn next. Now I'm the go-to person for AI integration at my company.",
    skills: {
      before: 3,
      after: 9,
      improvement: 200,
    },
  },
  {
    id: "3",
    name: "Emily Watson",
    role: "Marketing Director",
    company: "GrowthCo",
    avatar: "/avatars/emily.svg",
    rating: 5,
    content:
      "I was skeptical about AI at first, but Promptly's guided approach made it accessible. The achievements and streaks kept me motivated throughout my learning journey.",
    skills: {
      before: 1,
      after: 7,
      improvement: 600,
    },
  },
  {
    id: "4",
    name: "David Kim",
    role: "Data Scientist",
    company: "DataTech",
    avatar: "/avatars/david.svg",
    rating: 5,
    content:
      "Even as someone with a technical background, I learned so much about prompt engineering and AI tool optimization. The hands-on projects were incredibly valuable.",
    skills: {
      before: 6,
      after: 10,
      improvement: 67,
    },
  },
  {
    id: "5",
    name: "Lisa Thompson",
    role: "Freelance Designer",
    company: "Independent",
    avatar: "/avatars/lisa.svg",
    rating: 5,
    content:
      "Promptly helped me integrate AI into my design workflow. I'm now creating better work in half the time. The community aspect made learning fun and collaborative.",
    skills: {
      before: 2,
      after: 8,
      improvement: 300,
    },
  },
  {
    id: "6",
    name: "James Park",
    role: "Content Creator",
    company: "CreativeMedia",
    avatar: "/avatars/james.svg",
    rating: 4,
    content:
      "The variety of AI tools covered was impressive. I went from knowing just ChatGPT to mastering Midjourney, Claude, and several other tools for content creation.",
    skills: {
      before: 2,
      after: 7,
      improvement: 250,
    },
  },
];

export const companies = [
  {
    name: "TechCorp",
    logo: "/logos/techcorp.svg",
    users: 150,
  },
  {
    name: "StartupXYZ",
    logo: "/logos/startupxyz.svg",
    users: 75,
  },
  {
    name: "GrowthCo",
    logo: "/logos/growthco.svg",
    users: 200,
  },
  {
    name: "DataTech",
    logo: "/logos/datatech.svg",
    users: 120,
  },
  {
    name: "CreativeMedia",
    logo: "/logos/creativemedia.svg",
    users: 90,
  },
  {
    name: "Microsoft",
    logo: "/logos/microsoft.svg",
    users: 500,
  },
  {
    name: "Google",
    logo: "/logos/google.svg",
    users: 350,
  },
  {
    name: "OpenAI",
    logo: "/logos/openai.svg",
    users: 180,
  },
];

export const stats = {
  totalUsers: 25000,
  averageSkillImprovement: 280,
  completionRate: 94,
  averageRating: 4.8,
  totalLessonsCompleted: 150000,
  averageTimeToCompletion: "3 weeks",
};
