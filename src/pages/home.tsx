import { Helmet } from "react-helmet";
import {
  HeroSection,
  ValuePropositionShowcase,
  InteractiveDemo,
  SkillTreePreview,
  SuccessStories,
  GamificationShowcase,
  PricingValue,
  FAQSection,
  SocialProofSection,
} from "@/components/home";

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>Promptly - Master AI Through Gamified Learning</title>
        <meta
          name="description"
          content="Transform your AI skills with our gamified learning platform. Earn XP, unlock achievements, and master prompt engineering through interactive lessons and challenges."
        />
        <meta
          name="keywords"
          content="AI learning, prompt engineering, gamified education, artificial intelligence, machine learning, interactive learning"
        />
        <meta name="author" content="Promptly Team" />
        <meta name="creator" content="Promptly" />
        <meta name="publisher" content="Promptly" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="format-detection" content="address=no" />
        <meta name="format-detection" content="email=no" />
        <link rel="canonical" href="https://promptly.ai" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:url" content="https://promptly.ai" />
        <meta
          property="og:title"
          content="Promptly - Master AI Through Gamified Learning"
        />
        <meta
          property="og:description"
          content="Transform your AI skills with our gamified learning platform. Earn XP, unlock achievements, and master prompt engineering."
        />
        <meta property="og:site_name" content="Promptly" />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content="Promptly - Gamified AI Learning Platform"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Promptly - Master AI Through Gamified Learning"
        />
        <meta
          name="twitter:description"
          content="Transform your AI skills with our gamified learning platform."
        />
        <meta name="twitter:image" content="/og-image.png" />
        <meta name="twitter:creator" content="@promptlyai" />
        <meta name="theme-color" content="#6366f1" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </Helmet>

      <main className="min-h-screen">
        {/* 1. Enhanced Hero Section - Duolingo for AI messaging */}
        <HeroSection />

        {/* 2. Value Proposition Showcase - 5 core benefits */}
        <ValuePropositionShowcase />

        {/* 3. Interactive Learning Preview - 60-second demo */}
        <InteractiveDemo />

        {/* 4. Learning Path Visualization - Enhanced skill tree */}
        <SkillTreePreview />

        {/* 5. Success Stories Without Testimonials - Real outcomes */}
        <SuccessStories />

        {/* 6. Gamification Deep Dive - Enhanced showcase */}
        <GamificationShowcase />

        {/* 7. Pricing & Value - Clear ROI and pricing */}
        <PricingValue />

        {/* 8. FAQ Section - Address common concerns */}
        <FAQSection />

        {/* 9. Social Proof Section - Keep existing for now */}
        <SocialProofSection />
      </main>
    </>
  );
}