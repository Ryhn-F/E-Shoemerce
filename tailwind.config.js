/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Dark shades
        "dark-900": "#111111",
        "dark-700": "#757575",
        "dark-500": "#aaaaaa",

        // Light shades
        "light-100": "#ffffff",
        "light-200": "#f5f5f5",
        "light-300": "#e5e5e5",
        "light-400": "#cccccc",
        "light-500": "#999999",

        // Supporting colors
        green: "#007d48",
        red: "#d33918",
        orange: "#d37918",
      },
      fontFamily: {
        jost: ["Jost", "sans-serif"],
      },
      fontSize: {
        // Heading sizes
        "heading-1": ["72px", { lineHeight: "78px", fontWeight: "700" }],
        "heading-2": ["56px", { lineHeight: "60px", fontWeight: "700" }],
        "heading-3": ["24px", { lineHeight: "30px", fontWeight: "500" }],

        // Lead
        lead: ["20px", { lineHeight: "28px", fontWeight: "500" }],

        // Body
        body: ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "body-medium": ["16px", { lineHeight: "24px", fontWeight: "500" }],

        // Caption
        caption: ["14px", { lineHeight: "20px", fontWeight: "500" }],

        // Footnote
        footnote: ["12px", { lineHeight: "18px", fontWeight: "400" }],
      },
      screens: {
        xs: "320px",
        sm: "768px",
        md: "1024px",
        lg: "1200px",
        xl: "1440px",
      },
    },
  },
  plugins: [],
};
