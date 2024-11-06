import { createTheme } from '@mui/material/styles';
import { darkPalette, lightPalette } from './palette.ts';

export const darkTheme = createTheme({
  palette: darkPalette()
});

export const lightTheme = createTheme({
  palette: lightPalette()
});
