/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "surface-variant": "var(--surface-variant, #dee4de)",
        "primary-fixed-dim": "#68dba9",
        "on-secondary-fixed-variant": "#3d4757",
        "inverse-on-surface": "#ecf2ec",
        "surface-dim": "#d5dcd6",
        "surface-bright": "#f5fbf5",
        "secondary-container": "var(--secondary-container, #d6e0f4)",
        "error": "#ba1a1a",
        "on-primary": "var(--on-primary, #ffffff)",
        "surface": "var(--surface, #f5fbf5)",
        "background": "var(--background, #f5fbf5)",
        "secondary": "var(--secondary, #555f70)",
        "on-secondary-container": "var(--on-secondary-container, #596374)",
        "inverse-primary": "#68dba9",
        "on-error-container": "#93000a",
        "outline": "var(--outline, #6d7a72)",
        "primary": "var(--primary, #006948)",
        "tertiary-fixed-dim": "#ffb3ae",
        "primary-container": "var(--primary-container, #00855d)",
        "inverse-surface": "#2c322e",
        "surface-container-lowest": "var(--surface-container-lowest, #ffffff)",
        "secondary-fixed-dim": "#bdc7db",
        "tertiary-fixed": "#ffdad7",
        "secondary-fixed": "#d9e3f7",
        "on-tertiary-fixed-variant": "#7f2928",
        "on-surface-variant": "var(--on-surface-variant, #3d4a42)",
        "on-primary-fixed-variant": "#005137",
        "on-error": "#ffffff",
        "on-secondary": "var(--on-secondary, #ffffff)",
        "on-tertiary-fixed": "#410004",
        "on-tertiary": "#ffffff",
        "on-primary-fixed": "#002114",
        "surface-container": "var(--surface-container, #e9efe9)",
        "on-background": "var(--on-background, #171d19)",
        "on-primary-container": "var(--on-primary-container, #f5fff7)",
        "on-secondary-fixed": "#121c2a",
        "on-surface": "var(--on-surface, #171d19)",
        "primary-fixed": "#85f8c4",
        "surface-container-low": "var(--surface-container-low, #eff5ef)",
        "tertiary": "#9b3e3b",
        "error-container": "#ffdad6",
        "outline-variant": "var(--outline-variant, #bccac0)",
        "surface-tint": "#006c4a",
        "tertiary-container": "#ba5551",
        "surface-container-high": "var(--surface-container-high, #e4eae4)",
        "on-tertiary-container": "#fffbff",
        "surface-container-highest": "var(--surface-container-highest, #dee4de)"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      spacing: {
        "sidebar-width": "260px",
        "gutter": "24px",
        "container-max": "1440px",
        "margin-page": "32px",
        "unit": "8px"
      },
      fontFamily: {
        "body-sm": ["Inter", "sans-serif"],
        "label-uppercase": ["Inter", "sans-serif"],
        "display-sm": ["Inter", "sans-serif"],
        "headline-md": ["Inter", "sans-serif"],
        "body-base": ["Inter", "sans-serif"]
      },
      fontSize: {
        "body-sm": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "label-uppercase": ["12px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "700" }],
        "display-sm": ["24px", { lineHeight: "32px", letterSpacing: "-0.02em", fontWeight: "600" }],
        "headline-md": ["18px", { lineHeight: "28px", fontWeight: "600" }],
        "body-base": ["16px", { lineHeight: "24px", fontWeight: "400" }]
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
