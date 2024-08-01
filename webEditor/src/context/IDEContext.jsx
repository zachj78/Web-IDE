import React, { createContext, useState } from 'react';

//Context Creation
export const ActiveFileContext = createContext();
export const FileDirectoryContext = createContext();
export const ExplorerErrorHandler = createContext();
export const ClickedFileContext = createContext();
export const SelectedFileContext = createContext();
export const FileHandleArrayContext = createContext();
export const DirectoryHandleArrayContext = createContext();
export const ClickedFolderContext = createContext();
export const FileContentContext = createContext();

//Create provider Components
export const IDEProvider = ({ children }) => {
  //file management context
  const [activeFiles, setActiveFiles] = useState([]);
  const [files, setFiles] = useState([]);
  const [explorerErrorHandler, setExplorerErrorHandler] = useState(null);  
  const [clickedFiles, setClickedFiles] = useState(null);
  const [clickedFolder, setClickedFolder] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileHandles, setFileHandles] = useState([]);
  const [directoryHandles, setDirectoryHandles] = useState([]);
  //file editor context
  const [fileContent, setFileContent] = useState("");

  return (
    <FileDirectoryContext.Provider value={{ files, setFiles }}>
      <ActiveFileContext.Provider value={{ activeFiles, setActiveFiles }}>
        <SelectedFileContext.Provider value={{ selectedFile, setSelectedFile }}>
          <ClickedFileContext.Provider
            value={{ clickedFiles, setClickedFiles }}
          >
            <FileHandleArrayContext.Provider value = {{ fileHandles, setFileHandles}}>
              <DirectoryHandleArrayContext.Provider value={{directoryHandles, setDirectoryHandles}}>
                <ExplorerErrorHandler.Provider value={{ explorerErrorHandler, setExplorerErrorHandler }}>
                  <ClickedFolderContext.Provider value={{ clickedFolder, setClickedFolder }}>
                    <FileContentContext.Provider value={{ fileContent, setFileContent }}>
                      {children}
                    </FileContentContext.Provider>
                  </ClickedFolderContext.Provider>
                </ExplorerErrorHandler.Provider>
              </DirectoryHandleArrayContext.Provider>
            </FileHandleArrayContext.Provider>
          </ClickedFileContext.Provider>
        </SelectedFileContext.Provider>
      </ActiveFileContext.Provider>
    </FileDirectoryContext.Provider>
  );
};
