import React, { createContext, useState } from 'react';

//Context Creation
export const ActiveFileContext = createContext();
export const FileDirectoryContext = createContext();
export const ExplorerErrorHandler = createContext();
export const CachedFileArrayContext = createContext();
export const ClickedFileContext = createContext();

//Create provider Components
export const IDEProvider = ({ children }) => {
    const [activeFiles, setActiveFiles] = useState(null);
    const [files, setFiles] = useState(null);
    const [explorerErrorHandler, setExplorerErrorHandler] = useState(null);
    const [cachedFileArray, setCachedFileArray] = useState(null);
    const [clickedFiles, setClickedFiles] = useState(null);

    return (
        <FileDirectoryContext.Provider value={{ files, setFiles }}>
            <ActiveFileContext.Provider value={{ activeFiles, setActiveFiles }}>
                <ClickedFileContext.Provider value={{ clickedFiles, setClickedFiles }}>
                    <ExplorerErrorHandler.Provider value={{ explorerErrorHandler, setExplorerErrorHandler }}>
                        <CachedFileArrayContext.Provider value={{ cachedFileArray, setCachedFileArray }}>
                            { children }
                        </CachedFileArrayContext.Provider>
                    </ExplorerErrorHandler.Provider>
                </ClickedFileContext.Provider>
            </ActiveFileContext.Provider>
        </FileDirectoryContext.Provider>
    )
}