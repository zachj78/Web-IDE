import React, { useState, useContext, useEffect } from 'react';
import { List, ListItem, Box } from '@chakra-ui/react';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';
import {
  ActiveFileContext,
  ClickedFileContext,
  FileDirectoryContext,
  SelectedFileContext,
} from '../../context/IDEContext';
import '../../styles/FileTree.css';

const FileTree = () => {
  const { files } = useContext(FileDirectoryContext);
  const { activeFiles, setActiveFiles } = useContext(ActiveFileContext);
  const { clickedFiles, setClickedFiles } = useContext(ClickedFileContext);
  const { selectedFile, setSelectedFile } = useContext(SelectedFileContext);
  const [collapsed, setCollapsed] = useState({});

  useEffect(() => {
    console.log('Collapsed object:', collapsed);
    console.log('Files: ', files)

    setCollapsed(initializeCollapsedState(files));
  }, [files])

  const initializeCollapsedState = (files, parentKey = '') => {
    let initialState = {};
    Object.keys(files).forEach((key) => {
      const path = `${parentKey}${key}`;
      if(typeof files[key] === 'object') {
        initialState[path] = true;
        initialState = {...initialState, ...initializeCollapsedState(files[key], `${path}/`) }
      }
    })

    return initialState;
  }

  useEffect(() => {
    console.log('SELECTED FILE', selectedFile);
  }, [selectedFile]);

  useEffect(() => {
    console.log('ACTIVE FILE ARRAY: ', activeFiles);
  }, [activeFiles]);

  const handleFileClick = (fileName) => {
    console.log('HANDLE FILE CLICK', fileName);
    if (activeFiles.includes(fileName)) {
      setSelectedFile(fileName);
    } else {
      setClickedFiles(fileName);
      setSelectedFile(fileName);
    }
  };

  const handleDoubleClick = (fileName) => {
    if (clickedFiles === fileName) {
      console.log('clicked file => activeFiles');
      setClickedFiles(null);
    }

    if (activeFiles.includes(fileName)) {
      return;
    } else {
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

  const renderDirectory = (files, parentKey = '') => {
    return (
      <List spacing={2} styleType="none" id="list">
        {Object.keys(files).map((key) => {
          const path = `${parentKey}${key}`;
          console.log("PATH: ", path);
          const isCollapsed = collapsed[path] || false;
          const hasChildren = typeof files[key] === 'object';
        
          return (
            <ListItem key={path}>
              {hasChildren ? (
                <Box pl={4} borderLeft="1px solid black">
                  <Box
                    fontWeight="bold"
                    mb={2}
                    display="flex"
                    alignItems="center"
                    onClick={() => toggleCollapse(path)}
                    cursor="pointer"
                  >
                    {isCollapsed ? <FaChevronRight /> : <FaChevronDown />} {key}
                  </Box>
                  {!isCollapsed && renderDirectory(files[key], `${path}/`)}
                </Box>
              ) : activeFiles === key ? (
                <Box pl={4} bgColor="#444444">
                  {key}
                </Box>
              ) : (
                <Box
                  cursor="pointer"
                  className="file-name"
                  pl={4}
                  onClick={() => handleFileClick(key)}
                  onDoubleClick={() => handleDoubleClick(key)}
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
    >
      {files ? renderDirectory(files) : <div>No Files Uploaded Yet!</div>}
    </Box>
  );
};

export default FileTree;
