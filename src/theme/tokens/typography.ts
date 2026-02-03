export const typography = {
  fontFamily: {
    sans: ["Palanquin", "sans-serif"],
    mono: ["monospace"],
  },
  // Scale tuned for 14px root
  fontSize: {
    xxs: "0.6429rem",   // 9px
    xs: "0.7857rem",    // 11px
    sm: "0.8571rem",    // 12px
    md: "0.9286rem",    // 13px
    lg: "1.0714rem",    // 15px
    xl: "1.2857rem",    // 18px
    xxl: "1.6429rem",   // 23px
  },
  fontWeight: {
    light: 300,
    normal: 400,
    semibold: 500,
    bold: 600,
  },
} as const;
