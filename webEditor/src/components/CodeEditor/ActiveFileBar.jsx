import React, { useContext, useEffect } from 'react';
import { Box, HStack } from '@chakra-ui/react';
import { ClickedFileContext, ActiveFileContext, SelectedFileContext } from '../../context/IDEContext';
import '../../styles/ActiveFileBar.css';
import { FaTimes } from 'react-icons/fa';

const ActiveFileBar = () => {
  const { activeFiles, setActiveFiles } = useContext(ActiveFileContext);
  const { clickedFiles, setClickedFiles } = useContext(ClickedFileContext);
  const { selectedFile, setSelectedFile } = useContext(SelectedFileContext);

  const removeActiveFile = (activeFile) => {
    const filteredFiles = activeFiles.filter((file) => file !== activeFile);
    setSelectedFile(filteredFiles[0] || null);
    setActiveFiles(filteredFiles);
  };

  const changeSelectedFile = (fileToChange) => {
    if (selectedFile === fileToChange) {
      setClickedFiles(null);
      activeFiles.length === 0
        ? setSelectedFile(null)
        : setSelectedFile(activeFiles[0]);
    }
  };

  const handleFileSelect = (selectedFile) => {
    setSelectedFile(selectedFile);
  };

  return (
    <Box w="45vw" overflowX="auto" overflowY="hidden">
      <HStack spacing="0" margin="0" padding="0" display="flex">
        {clickedFiles && (
          <div
            className="file-div clicked-file-div"
            onClick={() => handleFileSelect(clickedFiles)}
            style={{
              backgroundColor:
                selectedFile === clickedFiles ? '#444444' : 'transparent',
            }}
          >
            <FaTimes
              onClick={() => changeSelectedFile(clickedFiles)}
              className="x-icon"
              size="2.2dvh"
            />
            <span className="file-tab-text">{clickedFiles}</span>
          </div>
        )}
        {activeFiles &&
          activeFiles.map((file, index) => (
            <div
              className="file-div active-file-div"
              style={{
                backgroundColor:
                  selectedFile === file ? '#444444' : 'transparent',
              }}
              onClick={() => handleFileSelect(file)}
              key={index}
            >
              <FaTimes
                onClick={(e) => {
                  e.stopPropagation(); // Stop the event from bubbling up
                  removeActiveFile(file);
                }}
                className="x-icon"
                size="2.2dvh"
              />
              <span className="file-tab-text">{file}</span>
            </div>
          ))}
      </HStack>
    </Box>
  );
};

export default ActiveFileBar;
