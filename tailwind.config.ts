import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,js,jsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Deep forest-green base — Avika's primary brand color.
        // Token name kept as `bg` so existing utilities (bg-bg, bg-bg-card,
        // from-bg, via-bg, text-bg) continue to work across the codebase.
        bg: {
          DEFAULT: "#0a1f12",
          soft: "#0f2b18",
          card: "#14361e",
        },
        // `gold` is repurposed to the Avika orange ramp — kept as `gold-*`
        // so all existing `text-gold-300`, `bg-gold-500`, `shadow-gold`,
        // `from-gold-400`, `via-gold-500` classes auto-pick up the new accent.
        gold: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },
        // Warm cream / muted sage text on the green base.
        ink: {
          DEFAULT: "#f3efe4",
          soft: "#c8c4b6",
          mute: "#8a9286",
        },
        // Explicit Avika brand tokens — use these when you need the
        // logo's exact green or orange.
        brand: {
          green: {
            50: "#eaf5ec",
            100: "#cce5d0",
            200: "#a0d0a8",
            300: "#6fb87b",
            400: "#3f9e51",
            500: "#2e7d32",
            600: "#1f6b27",
            700: "#166534",
            800: "#14532d",
            900: "#0d3a1f",
          },
          orange: {
            400: "#fb923c",
            500: "#f97316",
            600: "#ea580c",
            700: "#c2410c",
          },
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "radial-gold":
          "radial-gradient(circle at 50% 0%, rgba(249,115,22,0.22), transparent 60%)",
        "radial-fade":
          "radial-gradient(ellipse at center, rgba(255,255,255,0.06), transparent 70%)",
        "radial-green":
          "radial-gradient(circle at 50% 100%, rgba(46,125,50,0.28), transparent 60%)",
        "shimmer":
          "linear-gradient(110deg, transparent 30%, rgba(249,115,22,0.4) 50%, transparent 70%)",
        "noise":
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.45'/></svg>\")",
      },
      boxShadow: {
        gold: "0 10px 40px -10px rgba(249,115,22,0.5)",
        "gold-sm": "0 4px 18px -4px rgba(249,115,22,0.4)",
        green: "0 10px 40px -10px rgba(46,125,50,0.45)",
        glass:
          "inset 0 1px 0 rgba(255,255,255,0.08), 0 20px 60px -20px rgba(0,0,0,0.65)",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shine: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        glow: {
          "0%,100%": { boxShadow: "0 0 0 0 rgba(249,115,22,0.0)" },
          "50%": { boxShadow: "0 0 30px 6px rgba(249,115,22,0.4)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        gradient: {
          "0%,100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        shine: "shine 2.5s linear infinite",
        glow: "glow 3s ease-in-out infinite",
        slideUp: "slideUp 0.6s ease-out both",
        gradient: "gradient 8s ease infinite",
      },
    },
  },
  plugins: [],
};

export default config;
