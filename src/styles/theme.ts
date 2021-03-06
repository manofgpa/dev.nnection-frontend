import { extendTheme } from '@chakra-ui/react'

export const theme = extendTheme({
  colors: {
    gray: {
      '900': '#181b23',
      '800': '#1f2029',
      '700': '#353646',
      '600': '#4b4d63',
      '500': '#C4C4C4',
      '400': '#797d9a',
      '300': '#9699b0',
      '200': '#C4C4C4',
      '100': '#d1d2dc',
      '50': '#F0F2F5',
    },
    green: {
      '500': '#36A420',
      '800': '#00B800',
    },
  },
  fonts: {
    heading: 'Roboto',
    body: 'Roboto',
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.900',
      },
    },
  },
})
