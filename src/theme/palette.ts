import { ThemeOptions } from '@mui/material';

export const darkPalette = (): ThemeOptions['palette'] => ({
  mode: 'dark',
  background: {
    default: '#000000'
  }
});

export const lightPalette = (): ThemeOptions['palette'] => ({
  mode: 'light',
  primary: { main: '#90caf9' }
});
