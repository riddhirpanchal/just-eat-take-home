import { createTheme } from '@mantine/core'

export const theme = createTheme({
  primaryColor: 'orange',
  colors: {
    orange: [
      '#fff4e6',
      '#ffe8cc',
      '#ffd09c',
      '#ffb366',
      '#ff9c3a',
      '#ff8c1a',
      '#ff8906', 
      '#e6750a',
      '#cc660d',
      '#b3570f',
    ],
  },
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
  headings: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
    fontWeight: '700',
  },
  radius: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
  },
  spacing: {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
})