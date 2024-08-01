import { Box, HStack } from '@chakra-ui/react';
import { Editor } from '@monaco-editor/react';
import { useRef, useState, useContext, useEffect } from 'react';
import Output from './Output';
import ExplorerWindow from '../FileExplorer/ExplorerWindow';
import ActiveFileBar from './ActiveFileBar';
import { ActiveFileContext, ClickedFileContext, DirectoryHandleArrayContext, FileContentContext, FileHandleArrayContext, SelectedFileContext } from '../../context/IDEContext'

const CodeEditor = () => {
  const editorRef = useRef();
  const [language, setLanguage] = useState('javascript');
  const {fileContent, setFileContent } = useContext(FileContentContext);
  const { selectedFile } = useContext(SelectedFileContext);
  const { fileHandles } = useContext(FileHandleArrayContext);
  const { directoryHandles } = useContext(DirectoryHandleArrayContext);
  const { activeFiles } = useContext(ActiveFileContext);
  const { clickedFiles } = useContext(ClickedFileContext);

  const readFile = async () => {
    try {
      if (!selectedFile && !clickedFiles) {
        console.log("NO SELECTED FILE OR CLICKED FILES AVAILABLE FROM readFile()")
        return;
      }
  
      for (const [name, handle] of Object.entries(fileHandles)) {
        if (name === selectedFile) {
          const file = await handle.getFile();
          const content = await file.text();
          console.log("Setting fileContent from readFile");
          setFileContent(content);
          break;
        }
      }
    } catch (error) {
      console.error("Error reading file:", error);
    }
  };


  useEffect(() => {
    console.log('selected file: ', selectedFile)
    if(selectedFile === null) {
      setFileContent("");
    }

    if(selectedFile !== null) {
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
    
    readFile();
  }
  }, [selectedFile]);
  

  const handleKeyDown = (e) => {
    if((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      //save file here
      console.log('ctrl+s logged')
      console.log("file handles: ", fileHandles, "selected file: ", selectedFile)
      const writeFile = async () => {
        if(fileHandles && selectedFile) {
          for(const [name, handle] of Object.entries(fileHandles)) {
            if(name === selectedFile) {
              const writeableStream = await handle.createWritable();
              await writeableStream.write(fileContent);
              await writeableStream.close();
            }
          }
        }
      }

      writeFile();
    }

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  }
  }

  window.addEventListener('keydown', handleKeyDown);

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
