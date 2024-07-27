import { Box, HStack } from '@chakra-ui/react';
import { Editor } from '@monaco-editor/react';
import { useRef, useState, useContext, useEffect } from 'react';
import Output from './Output';
import ExplorerWindow from '../FileExplorer/ExplorerWindow';
import ActiveFileBar from './ActiveFileBar';
import { ActiveFileContext, ClickedFileContext, DirectoryHandleArrayContext, FileHandleArrayContext, SelectedFileContext } from '../../context/IDEContext'

const CodeEditor = () => {
  const editorRef = useRef();
  const [language, setLanguage] = useState('javascript');
  const [fileContent, setFileContent] = useState("");
  const { selectedFile } = useContext(SelectedFileContext);
  const { fileHandles } = useContext(FileHandleArrayContext);
  const { directoryHandles } = useContext(DirectoryHandleArrayContext);
  const { activeFiles } = useContext(ActiveFileContext);
  const { clickedFile} = useContext(ClickedFileContext);

  useEffect(() => {
    if(activeFiles.length === 0 && !clickedFile) {
      setFileContent("");
    }
  }, [activeFiles, clickedFile])

  useEffect(() => {
    const readFile = async () => {
      try {
        if (fileHandles && selectedFile) {
          console.log("FILE HANDLES:", fileHandles);
          for (const [name, handle] of Object.entries(fileHandles)) {
            if (name === selectedFile) {
              console.log("handle...", handle);
              const file = await handle.getFile();
              const fileData = await file.text();
              setFileContent(fileData);
              break;
            }
          }
        }
      } catch (error) {
        console.error("Error reading file:", error);
      }
    };

    readFile();
  }, [selectedFile]);


  useEffect(() => {
    console.log('Directory handles: ', directoryHandles);
  }, [directoryHandles])

  useEffect(() => {
    //save keybind
    const handleKeyDown = (e) => {
      if((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        //save file here
        console.log('ctrl+s logged')
        console.log("file handles: ", fileHandles, "selected file: ", selectedFile)
        const writeFile = async () => {
          if(fileHandles && selectedFile) {
            for(const [name, handle] of Object.entries(fileHandles)) {
              console.log("file names: ", name)
              if(name === selectedFile) {
                console.log("yay")
                const writeableStream = await handle.createWritable();
                await writeableStream.write(fileContent);
                await writeableStream.close();
              }
            }
          }
        }

        writeFile();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, [fileContent])

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
            theme="vs-dark"
            onMount={onMount}
            value={fileContent}
            onChange={(fileContent) => setFileContent(fileContent)}
          />
        </Box>
        <Output editorRef={editorRef} language={language} />
      </HStack>
    </Box>
  );
};

export default CodeEditor;
