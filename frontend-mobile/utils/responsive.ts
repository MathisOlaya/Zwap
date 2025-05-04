import { responsiveFontSize, responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";

// Model : iPhone 14
const baseWidth = 376;
const baseHeight = 814;

// Responsive size
export const width = (px: number) => responsiveWidth((px / baseWidth) * 100);
export const height = (px: number) => responsiveHeight((px / baseHeight) * 100);

// Gaps
export const gapV = (px: number) => responsiveHeight((px / baseHeight) * 100);
export const gapH = (px: number) => responsiveWidth((px / baseWidth) * 100);

// Font
export const font = (size: number) => responsiveFontSize((size / baseHeight) * 100);
