import { createTheme } from "@mui/material";

declare module "@mui/material/styles" {
  interface Palette {
    blue: Palette["primary"];
  }

  interface PaletteOptions {
    blue?: PaletteOptions["primary"];
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: "#ff0000",
    },
    secondary: {
      main: "#ffffff",
    },
    blue: {
      main: "#4285f4",
      light: "#8ab4f8",
      dark: "#0d47a1",
      contrastText: "#FFFFFF",
    },
  },
  typography: {
    fontFamily:
      "Noto Sans JP, Yu Gothic, Meiryo, Hiragino Kaku Gothic Pro, sans-serif",
    button: {
      textTransform: "none",
    },
  },
});
