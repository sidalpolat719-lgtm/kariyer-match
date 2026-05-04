/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brand palette
        midnight: {
          50: "#f3f6fb",
          100: "#e3eaf6",
          200: "#c2d0e8",
          300: "#94aed4",
          400: "#5f86bc",
          500: "#3c63a3",
          600: "#2c4d87",
          700: "#243f6e",
          800: "#1d3057",
          900: "#0d1a3a",
          950: "#070f24",
        },
        electric: {
          50: "#ecfeff",
          100: "#cffafe",
          200: "#a5f3fc",
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
          700: "#0e7490",
          800: "#155e75",
          900: "#164e63",
        },
        royal: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
        },
        emerald2: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
        },
        ink: {
          50: "#f7f9fc",
          100: "#eef2f8",
          200: "#dde4ef",
          300: "#c2cce0",
          400: "#94a2bd",
          500: "#6a799a",
          600: "#4a587a",
          700: "#33415d",
          800: "#1f2942",
          900: "#0f172a",
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Plus Jakarta Sans", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15,23,42,0.04), 0 1px 1px rgba(15,23,42,0.03)",
        card: "0 8px 24px -12px rgba(15,23,42,0.12), 0 2px 6px -2px rgba(15,23,42,0.06)",
        glow: "0 14px 40px -16px rgba(34,211,238,0.45)",
        deep: "0 30px 60px -25px rgba(13, 26, 58, 0.35)",
      },
      backgroundImage: {
        "grad-primary": "linear-gradient(135deg, #0d1a3a 0%, #243f6e 45%, #06b6d4 100%)",
        "grad-cta": "linear-gradient(135deg, #22d3ee 0%, #7c3aed 100%)",
        "grad-soft": "linear-gradient(135deg, #ecfeff 0%, #f5f3ff 100%)",
        "grad-mesh":
          "radial-gradient(at 10% 10%, #cffafe 0px, transparent 50%), radial-gradient(at 80% 0%, #ddd6fe 0px, transparent 50%), radial-gradient(at 90% 80%, #a5f3fc 0px, transparent 55%)",
        // Company / recruiter palette
        "grad-corp": "linear-gradient(135deg, #0d1a3a 0%, #4c1d95 50%, #7c3aed 100%)",
        "grad-corp-cta": "linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)",
        "grad-corp-soft": "linear-gradient(135deg, #f5f3ff 0%, #fdf4ff 100%)",
        "grad-corp-mesh":
          "radial-gradient(at 10% 10%, #ddd6fe 0px, transparent 50%), radial-gradient(at 80% 0%, #fae8ff 0px, transparent 50%), radial-gradient(at 90% 80%, #c4b5fd 0px, transparent 55%)",
      },
      borderRadius: {
        xl2: "1.25rem",
        "4xl": "2rem",
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseRing: {
          "0%": { transform: "scale(0.9)", opacity: "0.8" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
      },
      animation: {
        floaty: "floaty 6s ease-in-out infinite",
        shimmer: "shimmer 2.2s infinite",
        fadeUp: "fadeUp .5s ease-out both",
        pulseRing: "pulseRing 2s ease-out infinite",
      },
    },
  },
  plugins: [],
};
