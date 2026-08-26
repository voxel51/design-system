export const typography = {
  fontFamily: {
    sans: ["Palanquin", "sans-serif"],
    mono: ["monospace"],
  },
  // Sizes track the Figma *text styles* (Body Primary/Secondary/Tertiary,
  // Heading Medium, Caption), not the font-size variables — the two disagree,
  // and only the styles are what designers apply to a layer. 13px is gone
  // because no text style uses it.
  fontSize: {
    xxs: "9px",
    xs: "11px", // Caption, Code Secondary
    sm: "12px", // Body Tertiary
    md: "14px", // Body Secondary
    lg: "15px", // Body Primary
    title: "16px", // Heading Medium
    xl: "18px",
    xxl: "23px",
  },
  fontWeight: {
    light: 300,
    normal: 400,
    semibold: 500,
    bold: 600,
  },
} as const;
