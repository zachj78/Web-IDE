import React, { useState, useContext, useEffect } from 'react';
import { List, ListItem, Box, Flex, Input } from '@chakra-ui/react';
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
import { useDispatch, useSelector } from 'react-redux';
import { addActiveFiles,
   addClickedFile,
  addSelectedFile, 
  removeClickedFile,
  removeSelectedFile } from '../../Redux/fileBarSlice';
  import { addFiles } from '../../Redux/filesSlice';
import FileContextMenu from './ExplorerContextMenus/FileContextMenu';
import RenameFileInput from '../ReusableComponents/RenameFileInput';

const FileTree = () => {
  const dispatch = useDispatch();
  //redux states
  const activeFiles = useSelector((state) => state.activeFiles);
  const clickedFile = useSelector((state) => state.clickedFile)
  const directoryHandles = useSelector((state) => state.directoryHandles);
  const files = useSelector((state) => state.files || {});
  
  //collapsed state/clicked folder states
  const { clickedFolder, setClickedFolder } = useContext(ClickedFolderContext);
  const [collapsed, setCollapsed] = useState({});

  //context menu state
  const [fileContextMenuPos, setFileContextMenuPos] = useState({ x: 0, y: 0 });
  const [fileContextMenuItems, setFileContextMenuItems] = useState([]);
  const [fileContextMenuVisible, setFileContextMenuVisible] = useState(false);
  const [showRenameInput, setShowRenameInput] = useState(false);
  const [renamePath, setRenamePath] = useState(null);
  const [renameInputValue, setRenameInputValue] = useState("");

  useEffect(() => {
    setCollapsed(initializeCollapsedState(files));
  }, [files]);

  useEffect(() => {
    console.log("new file rename: ", renameInputValue);
  }, [renameInputValue])

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
      dispatch(addClickedFile({ clickedFile: fileName }));
    }
    dispatch(addSelectedFile({ selectedFile: fileName}));
  };

  const handleDoubleClick = (fileName) => {
    if (clickedFile === fileName) {
      dispatch(removeClickedFile())
    }
    if (!activeFiles.includes(fileName)) {
      dispatch(addActiveFiles({ activeFiles: fileName}));
      dispatch(addSelectedFile({ selectedFile: fileName }));
    }
  };

  const toggleCollapse = (key) => {
    setCollapsed((prevCollapsed) => ({
      ...prevCollapsed,
      [key]: !prevCollapsed[key],
    }));
  };

  const deleteItem = async (fileName) => {
    if (fileName !== null) {
      // find matching directory handle:
      let dirPath = fileName.split('/');
      const fileHandleName = dirPath.pop();
      dirPath = dirPath.join('/'); // ex output: /Notes/ExampleFolder
      // search directory handle keys for same name
      for (const [name, handle] of Object.entries(directoryHandles)) {
        if (name === dirPath) {
          // delete file once path is found w/in directory handle
          const fileHandle = await handle.getFileHandle(fileHandleName);
          await handle.removeEntry(fileHandleName);
        }
      }

      // rerender directory - remove file from files context obj
      function deleteNestedKey(files, keyToDelete) {
        return Object.keys(files).reduce((result, key) => {
          if (key === keyToDelete) return result;
          if (typeof files[key] === 'object' && !Array.isArray(files[key])) {
            result[key] = deleteNestedKey(files[key], keyToDelete);
          } else {
            result[key] = files[key];
          }
          return result;
        }, {});
      }

      const newDirectoryObj = deleteNestedKey(files, fileHandleName);
      dispatch(addFiles({ files: newDirectoryObj}))
    } else {
      console.log('No file chosen');
    }
  };

  const renameItem = async (fileName, newFilePath) => {
    try {
      const response = await fetch('/rename', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName, newFilePath }),
      });

      if(!response.ok) {
        console.log("RESPONSE NOT OKAY");
      }

      const result = response.json();
      console.log("file renamed successfully: ", result);
    } catch(err) {
      console.error("Error renaming file: ", err);
    }
  }

  const handleFileContextMenu = (e, fileName) => {
    e.preventDefault();
    setFileContextMenuVisible(true);
    setFileContextMenuPos({ x: e.clientX, y: e.clientY });
    setFileContextMenuItems([
      { label: 'Delete', onClick: () => deleteItem(fileName) },
      { label: 'Rename', onClick: () => { 
        setShowRenameInput(true);
        setRenamePath(fileName);
      } 
    },
    ]);
  };

  const renderDirectory = (files, parentKey = '', depth = 0) => {
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
                    pl={1 + depth * 5}
                    bgColor={
                      clickedFolder &&
                      clickedFolder.split('/')[clickedFolder.split('/').length - 1] === key
                        ? '#444444'
                        : 'none'
                    }
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
                    <Box pl={3}>{key}</Box>
                  </Flex>
                  {!isCollapsed && renderDirectory(files[key], `${path}/`, depth + 1)} 
                </Box>
              ) : (
                showRenameInput && renamePath === path ? (
                  <RenameFileInput 
                  pl={1 + depth * 5}
                  setShowRenameInput={setShowRenameInput}
                  originalFilePath={path}
                  renameInputValue={renameInputValue}
                  setRenameInputValue={setRenameInputValue}
                  />
                ) : (
                <Box
                  pl={1 + depth * 5}
                  bgColor={activeFiles.includes(key) ? '#444444' : 'none'}
                  cursor="pointer"
                  onClick={() => handleFileClick(path)}
                  onDoubleClick={() => handleDoubleClick(path)}
                  onContextMenu={(e) => handleFileContextMenu(e, path)}
                >
                  {key}
                </Box>
                )
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
