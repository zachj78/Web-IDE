import React, { createContext, useState } from 'react';

//Context Creation
export const ActiveFileContext = createContext();
export const FileDirectoryContext = createContext();
export const ExplorerErrorHandler = createContext();
export const CachedFileArrayContext = createContext();
export const ClickedFileContext = createContext();
export const SelectedFileContext = createContext();

//Create provider Components
export const IDEProvider = ({ children }) => {
  const [activeFiles, setActiveFiles] = useState([]);
  const [files, setFiles] = useState(null);
  const [explorerErrorHandler, setExplorerErrorHandler] = useState(null);
  const [cachedFileArray, setCachedFileArray] = useState(null);
  const [clickedFiles, setClickedFiles] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  return (
    <FileDirectoryContext.Provider value={{ files, setFiles }}>
      <ActiveFileContext.Provider value={{ activeFiles, setActiveFiles }}>
        <SelectedFileContext.Provider value={{ selectedFile, setSelectedFile }}>
          <ClickedFileContext.Provider
            value={{ clickedFiles, setClickedFiles }}
          >
            <ExplorerErrorHandler.Provider
              value={{ explorerErrorHandler, setExplorerErrorHandler }}
            >
              <CachedFileArrayContext.Provider
                value={{ cachedFileArray, setCachedFileArray }}
              >
                {children}
              </CachedFileArrayContext.Provider>
            </ExplorerErrorHandler.Provider>
          </ClickedFileContext.Provider>
        </SelectedFileContext.Provider>
      </ActiveFileContext.Provider>
    </FileDirectoryContext.Provider>
  );
};
