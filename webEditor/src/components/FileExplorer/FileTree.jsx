import React, { useState, useContext } from 'react';
import { List, ListItem, Box } from '@chakra-ui/react';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';
import { ActiveFileContext, FileDirectoryContext } from '../../context/IDEContext';
import "../../styles/FileTree.css"

const FileTree = () => {
  const { files } = useContext(FileDirectoryContext);
  const { activeFile, setActiveFile } = useContext(ActiveFileContext);
  const [collapsed, setCollapsed] = useState({});

  const toggleCollapse = (key) => {
    setCollapsed(prevCollapsed => ({
      ...prevCollapsed,
      [key]: !prevCollapsed[key],
    }));
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
              ) : (
                key === activeFile ? 
                  <Box pl={4} bgColor="#444444">{key}</Box> :
                  <Box cursor="pointer" className="file-name" pl={4} onClick={() => setActiveFile(key)}>{key}</Box> 
              )}
            </ListItem>
          );
        })}
      </List>
    );
  };

  return (
    <Box className="file-display" w="20vw" overflowY="auto" fontSize="14px" maxH="20vh">
    { files ? renderDirectory(files) : <div>No Files Uploaded Yet!</div> }
    </Box>
  )
};

export default FileTree;
