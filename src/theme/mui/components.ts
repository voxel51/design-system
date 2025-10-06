import { ThemeOptions } from "@mui/material";

/**
 * Create theme overrides for Material UI components.
 *
 * @param theme Base theme from which to derive values
 */
export const createComponentTheme = (theme: ThemeOptions) =>
  ({
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
              borderColor: theme.palette?.divider,
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
              borderColor: theme.palette?.text?.secondary,
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette?.text?.tertiary,
            },
          },
        },
      },
      MuiLink: {
        styleOverrides: {
          root: {
            color: theme.palette?.text?.primary,
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            "&:hover": {
              backgroundColor: theme.palette?.background?.level2,
            },
          },
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
            borderColor: theme.palette?.divider,
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            "fieldset.MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette?.divider,
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
  }) as const;
