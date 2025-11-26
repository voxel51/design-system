import type { ThemeOptions } from "@mui/material/styles";

/**
 * Get component theme configuration for Material UI components.
 * Returns a plain configuration object, not a Theme instance.
 *
 * @param baseConfig Base theme configuration from which to derive values
 */
export const getComponentThemeConfig = (
  baseConfig: ThemeOptions
): ThemeOptions => ({
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiButton: {
      variants: [
        {
          props: { variant: "contained" },
          style: { color: "#ffffff" },
        },
        {
          props: { variant: "outlined", color: "secondary" },
          style: {
            borderColor: baseConfig.palette?.divider,
          },
        },
      ],
    },
    MuiModal: {
      styleOverrides: {
        root: {
          // Relative to MuiMenu. Without it, Playwright will not be
          // able to click on Mui-Select component without force=true
          zIndex: 99,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          zIndex: 999,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: baseConfig.palette?.text?.secondary,
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: baseConfig.palette?.text?.primary,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {},
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          ".MuiSlider-thumb": {
            transform: "translate(-50%, -50%)",
            top: "50%",
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontSize: "1rem",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid",
          borderColor: baseConfig.palette?.divider,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          "fieldset.MuiOutlinedInput-notchedOutline": {
            borderColor: baseConfig.palette?.divider,
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        root: {
          zIndex: 1600,
        },
        paper: {
          backgroundImage: "none",
        },
      },
    },
  },
});
