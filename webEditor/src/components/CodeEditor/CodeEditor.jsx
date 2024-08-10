import { Box, HStack } from '@chakra-ui/react';
import { Editor } from '@monaco-editor/react';
import { useRef, useState, useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Output from './Output';
import ExplorerWindow from '../FileExplorer/ExplorerWindow';
import ActiveFileBar from './ActiveFileBar';
import { FileContentContext } from '../../context/IDEContext';

const CodeEditor = () => {
  const clickedFile = useSelector((state) => state.clickedFile);
  const selectedFile = useSelector((state) => state.selectedFile);
  const fileHandles = useSelector((state) => state.fileHandles);
  const editorRef = useRef();
  const abortControllerRef = useRef(new AbortController());
  const [language, setLanguage] = useState('javascript');
  const { fileContent, setFileContent } = useContext(FileContentContext);
  const [loading, setLoading] = useState(false);

  const readFile = async (fileName, signal) => {
    console.log("reading file content")
    try {
      if (!fileName) {
        return;
      }

      for (const [name, handle] of Object.entries(fileHandles)) {
        if (name === fileName) {
          const file = await handle.getFile();
          const content = await file.text();
          if (!signal.aborted) {
            console.log("Setting fileContent from readFile");
            setFileContent(content);
            setLoading(false);
          }
          break;
        }
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error("Error reading file:", error);
        setLoading(false);
      }
      console.error("Error reading file:", error);
    }
  };

  const writeFile = async () => {
    if (fileHandles && selectedFile) {
      for (const [name, handle] of Object.entries(fileHandles)) {
        if (name === selectedFile) {
          const writeableStream = await handle.createWritable();
          await writeableStream.write(fileContent);
          await writeableStream.close();
        }
      }
    }
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      // Save file here
      console.log('ctrl+s logged');
      console.log("file handles: ", fileHandles, "selected file: ", selectedFile);

      writeFile();
    }
  };

  useEffect(() => {
    console.log('selected file: ', selectedFile);
    if (selectedFile === null) {
      console.log("BALLOCKS!");
      setFileContent("");
    } else {
      const index = selectedFile.split('.').length - 1;
      const fileType = selectedFile.split('.')[index];

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

      abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();
      readFile(selectedFile, abortControllerRef.current.signal);
    }
  }, [selectedFile]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [fileContent]);

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
            theme="vs-dark"
            onMount={onMount}
            value={fileContent}
            onChange={(newValue) => {
              console.log("Editor onChange:", newValue);
              setFileContent(newValue); // Update fileContent on change
            }}
          />
        </Box>
        <Output editorRef={editorRef} language={language} />
      </HStack>
    </Box>
  );
};

export default CodeEditor;
