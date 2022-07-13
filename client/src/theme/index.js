import PropTypes from "prop-types";

import { useMemo } from "react";
// import useSettings from "hooks/useSettings";
// material
import { CssBaseline } from "@mui/material";
import {
  createTheme,
  ThemeProvider,
  StyledEngineProvider,
} from "@mui/material/styles";
//
import shape from "./shape";
import palette from "./palette";
import typography from "./typography";
import breakpoints from "./breakpoints";
import shadows, { customShadows } from "./shadows";

// ----------------------------------------------------------------------

ThemeConfig.propTypes = {
  children: PropTypes.node,
};

export default function ThemeConfig({ children }) {
    const themeDirection = "ltr";
    const themeMode = 'light';
    const isLight = themeMode === "light";

    const themeOptions = useMemo(
        () => ({
            palette: isLight
                ? { ...palette.light, mode: "light" }
                : { ...palette.dark, mode: "dark" },
            shape,
            typography,
            breakpoints,
            direction: themeDirection,
            shadows: isLight ? shadows.light : shadows.dark,
            customShadows: isLight ? customShadows.light : customShadows.dark,
        }),
        [isLight, themeDirection]
    );

  const theme = createTheme(themeOptions);

  return (
    <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {/* <GlobalStyles /> */}
            {children}
        </ThemeProvider>
    </StyledEngineProvider>
  );
}
