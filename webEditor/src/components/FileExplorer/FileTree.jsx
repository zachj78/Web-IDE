import React, { useState, useContext, useEffect } from 'react';
import { List, ListItem, Box, Flex } from '@chakra-ui/react';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';
import {
  ActiveFileContext,
  ClickedFileContext,
  ClickedFolderContext,
  DirectoryHandleArrayContext,
  FileDirectoryContext,
  SelectedFileContext,
} from '../../context/IDEContext';
import '../../styles/FileTree.css';
import FileContextMenu from './ExplorerContextMenus/FileContextMenu';

const FileTree = () => {
  const { files, setFiles } = useContext(FileDirectoryContext);
  const { activeFiles, setActiveFiles } = useContext(ActiveFileContext);
  const { clickedFiles, setClickedFiles } = useContext(ClickedFileContext);
  const { setSelectedFile } = useContext(SelectedFileContext);
  const { clickedFolder, setClickedFolder } = useContext(ClickedFolderContext);
  const { directoryHandles } = useContext(DirectoryHandleArrayContext);
  const [collapsed, setCollapsed] = useState({});
  const [fileContextMenuPos, setFileContextMenuPos] = useState({ x: 0, y: 0 });
  const [fileContextMenuItems, setFileContextMenuItems] = useState([]);
  const [fileContextMenuVisible, setFileContextMenuVisible] = useState(false);

  useEffect(() => {
    setCollapsed(initializeCollapsedState(files));
    console.log("file directory obj: ", files);
  }, [files]);

  const initializeCollapsedState = (files, parentKey = '') => {
    let initialState = {};
    Object.keys(files).forEach((key) => {
      const path = `${parentKey}${key}`;
      if (typeof files[key] === 'object') {
        initialState[path] = true;
        initialState = { ...initialState, ...initializeCollapsedState(files[key], `${path}/`) };
      }
    });
    return initialState;
  };

  const handleFolderClick = (folderPath) => {
    setClickedFolder(folderPath);
  };

  const handleFileClick = (fileName) => {
    if (!activeFiles.includes(fileName)) {
      setClickedFiles(fileName);
    }
    setSelectedFile(fileName);
  };

  const handleDoubleClick = (fileName) => {
    if (clickedFiles === fileName) {
      setClickedFiles(null);
    }
    if (!activeFiles.includes(fileName)) {
      setActiveFiles((prevState) => [fileName, ...prevState]);
      setSelectedFile(fileName);
    }
  };

  const toggleCollapse = (key) => {
    setCollapsed((prevCollapsed) => ({
      ...prevCollapsed,
      [key]: !prevCollapsed[key],
    }));
  };

  const deleteItem = async (fileName) => {
    if(fileName !== null) {
      //find matching directory handle: 
      let dirPath = fileName.split('/');
      const fileHandleName = dirPath.pop();
      dirPath = dirPath.join("/"); // ex outpt: /Notes/ExampleFolder
      //search directory handle keys for same name
      for(const [name, handle] of Object.entries(directoryHandles)) {
        if(name === dirPath) {
          //delete file once path is found w/in directory handle
          const fileHandle = await handle.getFileHandle(fileHandleName); 
          await handle.removeEntry(fileHandleName);
        }
      }

      //rerender directory - remove file from files context obj
      function deleteNestedKey(files, keyToDelete) {
        return Object.keys(files).reduce((result, key) => {
          if(key === keyToDelete) return result;
          if(typeof files[key] === 'object' && !Array.isArray(files[key])) {
            result[key] = deleteNestedKey(files[key], keyToDelete)
          } else {
            result[key] = obj[key];
          }
          return result;
        }, {});
      };

      const newDirectoryObj = deleteNestedKey(files, fileHandleName)
      setFiles(newDirectoryObj);

    } else {
      console.log("No file chosen")
    }
  }

  const handleFileContextMenu = (e, fileName) => {
    e.preventDefault();
    setFileContextMenuVisible(true);
    setFileContextMenuPos({ x: e.clientX, y: e.clientY });
    setFileContextMenuItems([
      { label: 'Delete', onClick: () => deleteItem(fileName) },
      { label: 'Rename', onClick: () => alert('rename item: ' + fileName) },
    ]);
  };

  const renderDirectory = (files, parentKey = '') => {
    return (
      <List spacing={2} styleType="none" id="list">
        {Object.keys(files).map((key) => {
          const path = `${parentKey}${key}`;
          const isCollapsed = collapsed[path] || false;
          const hasChildren = typeof files[key] === 'object';

          return (
            <ListItem key={path}>
              {hasChildren ? (
                <Box>
                  <Flex
                    bgColor={clickedFolder && clickedFolder.split('/')[clickedFolder.split('/').length - 1] === key ? "#444444" : "none"}
                    fontWeight="bold"
                    mb={2}
                    alignItems="center"
                    onClick={() => {
                      toggleCollapse(path);
                      handleFolderClick(path);
                    }}
                    cursor="pointer"
                  >
                    {isCollapsed ? <FaChevronRight /> : <FaChevronDown />}
                    <Box pl={4}>{key}</Box>
                  </Flex>
                  {!isCollapsed && renderDirectory(files[key], `${path}/`)}
                </Box>
              ) : (
                <Box
                  pl={4}
                  bgColor={activeFiles.includes(key) ? "#444444" : "none"}
                  cursor="pointer"
                  onClick={() => handleFileClick(path)}
                  onDoubleClick={() => handleDoubleClick(path)}
                  onContextMenu={(e) => handleFileContextMenu(e, path)}
                >
                  {key}
                </Box>
              )}
            </ListItem>
          );
        })}
      </List>
    );
  };

  return (
    <Box
      className="file-display"
      w="20vw"
      overflowY="auto"
      fontSize="14px"
      maxH="20vh"
      position="relative"
    >
      {files ? renderDirectory(files) : <div>No Files Uploaded Yet!</div>}
      {fileContextMenuVisible && (
        <FileContextMenu
          fileContextMenuPos={fileContextMenuPos}
          fileContextMenuItems={fileContextMenuItems}
          fileContextMenuVisible={fileContextMenuVisible}
          setFileContextMenuVisible={setFileContextMenuVisible}
        />
      )}
    </Box>
  );
};

export default FileTree;
