import { useState } from 'react';
import { Box, VStack } from '@chakra-ui/react';
import CodeEditor from './components/CodeEditor/CodeEditor';
import { IDEProvider } from './context/IDEContext';

const App = () => {
  return (
    <>
      <IDEProvider>
        <Box minH="100vh" bg="#0f0a19" color="grey" px={6} py={8}>
          <CodeEditor />
        </Box>
      </IDEProvider>
    </>
  );
};

export default App;
