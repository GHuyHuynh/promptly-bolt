/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "rgb(239 246 255)",
          100: "rgb(219 234 254)",
          200: "rgb(191 219 254)",
          300: "rgb(147 197 253)",
          400: "rgb(96 165 250)",
          500: "rgb(59 130 246)",
          600: "rgb(37 99 235)",
          700: "rgb(29 78 216)",
          800: "rgb(30 64 175)",
          900: "rgb(30 58 138)",
        },
        neutral: {
          50: "rgb(250 250 250)",
          100: "rgb(245 245 245)",
          200: "rgb(229 229 229)",
          300: "rgb(212 212 212)",
          400: "rgb(163 163 163)",
          500: "rgb(115 115 115)",
          600: "rgb(82 82 82)",
          700: "rgb(64 64 64)",
          800: "rgb(38 38 38)",
          900: "rgb(23 23 23)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        // Entrance animations
        "fade-in": "fade-in 0.6s ease-out",
        "slide-up": "slide-up 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-down": "slide-down 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-left": "slide-left 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-right": "slide-right 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
        "scale-in": "scale-in 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "bounce-in": "bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "rotate-in": "rotate-in 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        "flip-in": "flip-in 0.6s cubic-bezier(0.4, 0, 0.2, 1)",

        // Continuous animations
        float: "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out infinite 1s",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite alternate",
        shimmer: "shimmer 1.5s infinite",
        "spin-slow": "spin-slow 3s linear infinite",
        "bounce-soft": "bounce-soft 2s infinite",

        // Hover animations
        "hover-lift": "hover-lift 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "hover-scale": "hover-scale 0.3s cubic-bezier(0.4, 0, 0.2, 1)",

        // Loading animations
        "loading-dots": "loading-dots 1.4s ease-in-out infinite",
        "loading-bars": "loading-bars 1.2s ease-in-out infinite",
        "loading-pulse":
          "loading-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-down": {
          "0%": { opacity: "0", transform: "translateY(-30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-left": {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-right": {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "bounce-in": {
          "0%": { opacity: "0", transform: "scale(0.3)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "rotate-in": {
          "0%": { opacity: "0", transform: "rotate(-200deg)" },
          "100%": { opacity: "1", transform: "rotate(0deg)" },
        },
        "flip-in": {
          "0%": { opacity: "0", transform: "rotateY(-90deg)" },
          "100%": { opacity: "1", transform: "rotateY(0deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "pulse-glow": {
          "0%": { boxShadow: "0 0 5px rgba(59, 130, 246, 0.4)" },
          "100%": {
            boxShadow:
              "0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.4)",
          },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "bounce-soft": {
          "0%, 20%, 53%, 80%, 100%": { transform: "translate3d(0, 0, 0)" },
          "40%, 43%": { transform: "translate3d(0, -10px, 0)" },
          "70%": { transform: "translate3d(0, -5px, 0)" },
          "90%": { transform: "translate3d(0, -2px, 0)" },
        },
        "loading-dots": {
          "0%, 80%, 100%": { transform: "scale(0)", opacity: "0.5" },
          "40%": { transform: "scale(1)", opacity: "1" },
        },
        "loading-bars": {
          "0%, 40%, 100%": { transform: "scaleY(0.4)" },
          "20%": { transform: "scaleY(1.0)" },
        },
        "loading-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      backdropBlur: {
        xs: "2px",
        "3xl": "64px",
      },
      boxShadow: {
        glow: "0 0 20px rgba(59, 130, 246, 0.3)",
        "glow-lg": "0 0 30px rgba(59, 130, 246, 0.4)",
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
        medium:
          "0 4px 25px -2px rgba(0, 0, 0, 0.1), 0 12px 25px -5px rgba(0, 0, 0, 0.05)",
        heavy:
          "0 10px 40px -10px rgba(0, 0, 0, 0.2), 0 20px 25px -5px rgba(0, 0, 0, 0.1)",
        colored: "0 4px 14px 0 rgba(59, 130, 246, 0.15)",
        "colored-lg":
          "0 10px 25px -3px rgba(59, 130, 246, 0.1), 0 4px 6px -2px rgba(59, 130, 246, 0.05)",
      },
      backgroundImage: {
        "gradient-radial":
          "radial-gradient(ellipse at center, var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-mesh": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        glass:
          "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0))",
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.75rem" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
        "7xl": ["4.5rem", { lineHeight: "1" }],
        "8xl": ["6rem", { lineHeight: "1" }],
        "9xl": ["8rem", { lineHeight: "1" }],
      },
      scale: {
        102: "1.02",
        103: "1.03",
      },
      transitionDuration: {
        400: "400ms",
        600: "600ms",
        800: "800ms",
        900: "900ms",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
        "bounce-out": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      zIndex: {
        60: "60",
        70: "70",
        80: "80",
        90: "90",
        100: "100",
      },
      aspectRatio: {
        "4/3": "4 / 3",
        "3/2": "3 / 2",
        "2/3": "2 / 3",
        "9/16": "9 / 16",
      },
      screens: {
        xs: "475px",
        "3xl": "1680px",
        "4xl": "2048px",
      },
    },
  },
  plugins: [
    // Custom plugin for advanced utilities
    function ({ addUtilities, addComponents, theme }) {
      addUtilities({
        // Text utilities
        ".text-balance": {
          "text-wrap": "balance",
        },
        ".text-gradient": {
          background:
            "linear-gradient(135deg, rgb(59 130 246), rgb(147 51 234))",
          "-webkit-background-clip": "text",
          "-webkit-text-fill-color": "transparent",
          "background-clip": "text",
        },

        // Interactive utilities
        ".hover-lift": {
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-2px)",
          },
        },
        ".hover-scale": {
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "scale(1.05)",
          },
        },
        ".active-scale": {
          "&:active": {
            transform: "scale(0.95)",
          },
        },

        // Glass morphism
        ".glass": {
          background: "rgba(255, 255, 255, 0.25)",
          "backdrop-filter": "blur(16px)",
          "-webkit-backdrop-filter": "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
          "box-shadow": "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        },

        // Perspective utilities
        ".perspective-1000": {
          perspective: "1000px",
        },
        ".preserve-3d": {
          "transform-style": "preserve-3d",
        },
      });

      addComponents({
        // Enhanced button component
        ".btn-enhanced": {
          position: "relative",
          overflow: "hidden",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&::before": {
            content: '""',
            position: "absolute",
            top: "0",
            left: "-100%",
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
            transition: "left 0.5s ease-in-out",
          },
          "&:hover::before": {
            left: "100%",
          },
        },

        // Loading skeleton
        ".skeleton": {
          background:
            "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
          "background-size": "200% 100%",
          animation: "shimmer 1.5s infinite",
        },
      });
    },
  ],
};
