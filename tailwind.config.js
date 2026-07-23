export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f7ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          500: "#0077b6",
          600: "#1e6091",
          700: "#0096c7",
          900: "#0f172a",
        },
        accent: {
          DEFAULT: "#ff6b35",
          hover: "#e85d04",
          orange: "#f77f00",
        },
        surface: {
          body: "#f8fafc",
          card: "#ffffff",
          hover: "#f0f7ff",
          muted: "#ebf4f6",
        },
        border: {
          subtle: "#e2e8f0",
        },
        heading: "#0f172a",
        muted: "#64748b",
        difficulty: {
          easy: { bg: "#e6f4ea", text: "#137333" },
          medium: { bg: "#fef3c7", text: "#d97706" },
          hard: { bg: "#fee2e2", text: "#dc2626" },
        },
        tag: {
          bg: "#e0f2fe",
          text: "#0369a1",
        },
      },
    },
  },

  plugins: [],
};

