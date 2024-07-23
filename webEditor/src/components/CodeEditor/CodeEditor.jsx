import { Box, HStack } from '@chakra-ui/react';
import { Editor } from '@monaco-editor/react';
import { useRef, useState, useContext, useEffect } from 'react';
import { CODE_SNIPPETS } from '../../constants';
import Output from './Output';
import ExplorerWindow from '../FileExplorer/ExplorerWindow';
import ActiveFileBar from './ActiveFileBar';
import { SelectedFileContext } from '../../context/IDEContext';

const CodeEditor = () => {
  const editorRef = useRef();
  const [value, setValue] = useState('');
  const [language, setLanguage] = useState('javascript');
  const { selectedFile, setSelectedFile } = useContext(SelectedFileContext);

  useEffect(() => {
    if (selectedFile) {
      let index = selectedFile.split('.').length - 1;
      let fileType = selectedFile.split('.')[index];

      switch (fileType) {
        case 'txt':
          setLanguage('plaintext');
          break;
        case 'html':
          setLanguage('html');
          break;
        case 'css':
          setLanguage('css');
          break;
        case 'js':
          setLanguage('javascript');
          break;
        case 'java':
          setLanguage('java');
          break;
        case 'py':
          setLanguage('python');
          break;
        case 'php':
          setLanguage('php');
          break;
        case 'cpp':
          setLanguage('cpp');
          break;
        case 'c':
          setLanguage('c');
          break;
        default:
          setLanguage('plaintext');
      }
    }
  }, [selectedFile]);

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  return (
    <Box>
      <HStack spacing={6}>
        <ExplorerWindow />
        <Box w="60vw">
          <ActiveFileBar />
          <Editor
            width="45vw"
            height="90vh"
            language={language}
            defaultValue={CODE_SNIPPETS[language]}
            theme="vs-dark"
            onMount={onMount}
            value={value}
            onChange={(value) => setValue(value)}
          />
        </Box>
        <Output editorRef={editorRef} language={language} />
      </HStack>
    </Box>
  );
};

export default CodeEditor;
