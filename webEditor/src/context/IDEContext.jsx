import React, { createContext, useState } from 'react';

//Context Creation
export const ActiveFileContext = createContext();
export const FileDirectoryContext = createContext();
export const ExplorerErrorHandler = createContext();

//Create provider Components
export const IDEProvider = ({ children }) => {
    const [activeFile, setActiveFile] = useState(null);
    const [files, setFiles] = useState(null);
    const [explorerErrorHandler, setExplorerErrorHandler] = useState();

    return (
        <FileDirectoryContext.Provider value={{ files, setFiles }}>
            <ActiveFileContext.Provider value={{ activeFile, setActiveFile }}>
                <ExplorerErrorHandler.Provider value={{ explorerErrorHandler, setExplorerErrorHandler }}>
                    { children }
                </ExplorerErrorHandler.Provider>
            </ActiveFileContext.Provider>
        </FileDirectoryContext.Provider>
    )
}