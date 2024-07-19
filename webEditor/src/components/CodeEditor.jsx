import { Box, HStack } from '@chakra-ui/react';
import { Editor } from '@monaco-editor/react';
import { useRef, useState, useContext, useEffect } from 'react';
import { CODE_SNIPPETS } from '../constants';
import Output from './Output';
import ExplorerWindow from './FileExplorer/ExplorerWindow'
import { ActiveFileContext } from '../context/IDEContext';

const CodeEditor = () => {
    const editorRef = useRef();
    const [value, setValue] = useState("");
    const [language, setLanguage] = useState("javascript");
    const { activeFile } = useContext(ActiveFileContext);

    useEffect(() => {
        if(activeFile) {
            let index = activeFile.split(".").length - 1;
            let activeFileType =  activeFile.split(".")[index];
            
            switch(activeFileType) {
                case "txt":
                    setLanguage("plaintext");
                    break;
                case "html":
                    setLanguage("html");
                    break;
                case "css":
                    setLanguage("css");
                    break;
                case "js":
                    setLanguage("javascript");
                    break;
                case "java":
                    setLanguage("java");
                    break;
                case "py":
                    setLanguage("python");
                    break;
                case "php":
                    setLanguage("php");
                    break;
                case "cpp":
                    setLanguage("cpp");
                    break;
                case "c":
                    setLanguage("c");
                    break;
                default:
                    setLanguage("plaintext"); // or handle unrecognized file types
            }
        }
    }, [activeFile]); // Only re-run the effect if activeFile changes

    const onMount = (editor) => {
        editorRef.current = editor;
        editor.focus();
    }

    const onSelect = (language) => {
        setLanguage(language);
        setValue(
            CODE_SNIPPETS[language]
        );
    }

    return (
        <Box>
            <HStack spacing={6}>
                <ExplorerWindow />
                <Box w="60vw">
                    <Editor 
                        height="90vh" 
                        language={language}
                        defaultValue={CODE_SNIPPETS[language]}
                        theme="vs-dark"
                        onMount={onMount}
                        value={value}
                        onChange={(value) => setValue(value)}
                    />
                </Box>
                <Output editorRef={editorRef} language={language}/>
            </HStack>
        </Box>
    );
}
 
export default CodeEditor;
