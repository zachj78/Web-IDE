import { Box, Button, Text, useToast } from '@chakra-ui/react';
import { executeCode } from './api';
import { useState } from 'react';

const Output = ({ editorRef, language}) => {
  const toast = useToast();
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const runCode = async () => {
    const sourceCode = editorRef.current.getValue();
    setIsLoading(true);

    if (!sourceCode) {
      setIsLoading(false);
      return;
    }

    try {
      const { run: result } = await executeCode(sourceCode, language);
      setOutput(result.output.split('\n'));
      result.stderr ? setError(true) : setError(false);
    } catch (error) {
      console.log(error);
      toast({
        title: 'An error occured',
        description: error.message || 'Unable to run code',
        status: 'error',
        duration: 6000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Box w="45vw">
        <Text mb={2} fontSize="lg">
          Output
        </Text>
        <Box
          height="90vh"
          p={2}
          color={error ? 'red.400' : ''}
          border={error ? '1px red solid' : '1px #333 solid'}
          borderRadius={4}
        >
          {output ? (
            output.map((line, index) => <Text key={index}>{line}</Text>)
          ) : (
            <Button
              variant="outline"
              colorScheme="green"
              mb={4}
              onClick={runCode}
              isLoading={isLoading}
            >
              Run Code
            </Button>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Output;
