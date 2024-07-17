import { Box, HStack, Text } from '@chakra-ui/react';
import { Editor } from '@monaco-editor/react';
import { useRef, useState } from 'react';
import LanguageSelector from './LanguageSelector';
import { CODE_SNIPPETS } from '../constants';
import Output from './Output';
import ExplorerWindow from './FileExplorer/ExplorerWindow'

const CodeEditor = () => {
    const editorRef = useRef();
    const [value, setValue] = useState("");
    const [language, setLanguage] = useState("javascript");

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
                <Box w="20vw">
                    <LanguageSelector language={language} onSelect={onSelect}/>
                    <Editor 
                    height="90vh" 
                    language={language}
                    defaultLanguage="javascript" 
                    defaultValue={CODE_SNIPPETS["javascript"]}
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