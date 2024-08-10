import React, { useContext } from 'react';
import { Box, HStack } from '@chakra-ui/react';
import { FileContentContext } from '../../context/IDEContext';
import {
  addSelectedFile,
  updateActiveFiles,
  removeClickedFile,
  removeSelectedFile
} from '../../Redux/fileBarSlice';
import '../../styles/ActiveFileBar.css';
import { FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

const ActiveFileBar = () => {
  const dispatch = useDispatch();
  const activeFiles = useSelector((state) => state.activeFiles);
  const clickedFile = useSelector((state) => state.clickedFile);
  const selectedFile = useSelector((state) => state.selectedFile);
  const { fileContent, setFileContent } = useContext(FileContentContext);

  const removeActiveFile = (fileToRemove) => {
    const filteredFiles = activeFiles.filter((file) => file !== fileToRemove);
    dispatch(updateActiveFiles({ activeFile: filteredFiles }));

    if (filteredFiles.length > 0) {
      dispatch(addSelectedFile({ selectedFile: filteredFiles[0] }));
    } else {
      dispatch(removeSelectedFile());
    }
  };

  const changeSelectedFile = (fileToChange) => {
    console.log("NO ACTIVE FILES", activeFiles);

    if (selectedFile === fileToChange) {
      dispatch(removeClickedFile());

      // Dispatch to update active files and selected file
      const filteredFiles = activeFiles.filter((file) => file !== fileToChange);
      dispatch(updateActiveFiles({ activeFile: filteredFiles }));

      if (filteredFiles.length === 0) {
        dispatch(removeSelectedFile());
      } else {
        dispatch(addSelectedFile({ selectedFile: filteredFiles[0] }));
      }
    }
  };

  const handleFileSelect = (selectedFile) => {
    console.log("selected a file: ", selectedFile);
    dispatch(addSelectedFile({ selectedFile: selectedFile }));
  };

  return (
    <Box w="45vw" overflowX="auto" overflowY="hidden">
      <HStack spacing="0" margin="0" padding="0" display="flex">
        {clickedFile && (
          <div
            className="file-div clicked-file-div"
            onClick={() => {
              handleFileSelect(clickedFile);
              console.log(clickedFile, " is clicked");
            }}
            style={{
              backgroundColor:
                selectedFile === clickedFile ? '#444444' : 'transparent',
            }}
          >
            <FaTimes
              onClick={(e) => {
                e.stopPropagation(); // Stop the event from bubbling up
                changeSelectedFile(clickedFile);
                console.log("X CLICKED");
              }}
              className="x-icon"
              size="2.2dvh"
            />
            <span pl={4} className="file-tab-text">{clickedFile}</span>
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
              onClick={() => {
                handleFileSelect(file);
              }}
              key={index}
            >
              <FaTimes
                onClick={(e) => {
                  e.stopPropagation(); // Stop the event from bubbling up
                  removeActiveFile(file);
                  console.log("X CLICKED(ACTIVE FILE)");
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
