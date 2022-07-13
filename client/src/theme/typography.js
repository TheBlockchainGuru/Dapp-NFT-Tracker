// ----------------------------------------------------------------------

function pxToRem(value) {
    return `${value / 16}rem`;
}

function responsiveFontSizes({ sm, md, lg }) {
    return {
        "@media (min-width:600px)": {
            fontSize: pxToRem(sm),
        },
        "@media (min-width:900px)": {
            fontSize: pxToRem(md),
        },
        "@media (min-width:1200px)": {
            fontSize: pxToRem(lg),
        },
    };
}

// const FONT_PRIMARY = "BRLNSR"; // Google Font
// const FONT_PRIMARY = "Mochiy Pop P One, sans-serif"; // Google Font
const FONT_PRIMARY = "Plus Jakarta Sans"; // Local Font
const FONT_SECONDARY = "Plus Jakarta Sans";

const typography = {
    fontFamily: FONT_PRIMARY,
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    fontWeightBold: 700,
    h1: {
        lineHeight: 80 / 64,
        fontSize: pxToRem(40),
        fontFamily: 'Plus Jakarta Sans Extra Bold',
        ...responsiveFontSizes({ sm: 52, md: 58, lg: 64 }),
    },
    h2: {
        fontWeight: 700,
        lineHeight: 64 / 48,
        fontSize: pxToRem(32),
        fontFamily: 'Plus Jakarta Sans Extra Bold',
        ...responsiveFontSizes({ sm: 32, md: 36, lg: 40 }),
    },
    h3: {
        fontWeight: 700,
        lineHeight: 1.5,
        fontSize: pxToRem(24),
        fontFamily: 'Plus Jakarta Sans Bold',
        ...responsiveFontSizes({ sm: 26, md: 30, lg: 32 }),
    },
    h4: {
    // fontFamily: FONT_SECONDARY,
        fontWeight: 700,
        lineHeight: 1.5,
        fontSize: pxToRem(20),
        ...responsiveFontSizes({ sm: 20, md: 24, lg: 24 }),
    },
    h5: {
        fontWeight: 700,
        lineHeight: 1.5,
        fontSize: pxToRem(18),
        ...responsiveFontSizes({ sm: 16, md: 18, lg: 20 }),
    },
    h6: {
        fontWeight: 700,
        lineHeight: 28 / 18,
        fontSize: pxToRem(17),
        ...responsiveFontSizes({ sm: 14, md: 16, lg: 18 }),
    },
    subtitle1: {
        fontWeight: 600,
        lineHeight: 1.5,
        fontSize: pxToRem(16),
        ...responsiveFontSizes({ sm: 12, md: 14, lg: 16 })
    },
    subtitle2: {
        fontWeight: 600,
        fontSize: pxToRem(14),
        ...responsiveFontSizes({ sm: 10, md: 12, lg: 14 })
    },
    body1: {
        lineHeight: 1.5,
        fontSize: pxToRem(22),
    },
    body2: {
        lineHeight: 22 / 14,
        fontSize: pxToRem(12),
    },
    caption: {
        fontSize: pxToRem(12),
        ...responsiveFontSizes({ sm: 8, md: 10, lg: 12 }),
    },
    overline: {
        fontWeight: 700,
        lineHeight: 1.5,
        fontSize: pxToRem(12),
        letterSpacing: 1.1,
        textTransform: "uppercase",
    },
    button: {
        fontWeight: 700,
        lineHeight: 24 / 14,
        fontSize: pxToRem(14),
        textTransform: "capitalize",
    },
};

export default typography;
