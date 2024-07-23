import { extendTheme } from '@chakra-ui/react';

/* code editor theme */
const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
});

export default theme;
