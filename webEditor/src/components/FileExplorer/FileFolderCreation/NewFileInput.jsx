import React, { useContext, useEffect, useRef } from 'react';
import { Box, Button, FormControl, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { FaTimes } from 'react-icons/fa';
import { ClickedFolderContext } from '../../../context/IDEContext';
import { useDispatch, useSelector } from 'react-redux';
import { addError, addFileHandles } from '../../../Redux/filesSlice';

const NewFileInput = ({ setNewFileRender }) => {
  const dispatch = useDispatch();
  const directoryHandles = useSelector((state) => state.directoryHandles);
  const { clickedFolder } = useContext(ClickedFolderContext);
  const newFileName = useRef();

  const handleFileCreate = async (e) => {
    e.preventDefault();

    try {
      if (!directoryHandles) {
        dispatch(addError({ err: "Please upload a folder first"}))
        return;
      }

      if (!clickedFolder) {
        dispatch(addError({ err: "Select a folder to create file in" }))
        return;
      }

      const fileName = newFileName.current.value;

      if (!fileName) {
        dispatch(addError({ err: "Please set a file name" }))
        return;
      }

      for (const [name, handle] of Object.entries(directoryHandles)) {
        const lastPart = name.split('/').pop();
        if (name === clickedFolder) {
          const fileHandle = await handle.getFileHandle(fileName, { create: true });
          const fullPath = name + '/' + fileName;
          
          let newFileHandle = {};
          newFileHandle[fullPath] = fileHandle;
          
          const writableStream = await fileHandle.createWritable();
          writableStream.write(' ');
          await writableStream.close();

          setNewFileRender(false);

          dispatch(addFileHandles({ fileHandles: newFileHandle }));
        }
      }
    } catch (err) {
      console.error("Error creating file: ", err);
      dispatch(addError({ err: "Error creating file, please try again" }));
    }
  };

  return (
    <Box p={4} w="full" boxSizing="border-box" overflow="hidden">
      <form onSubmit={handleFileCreate}>
        <FormControl>
          <InputGroup>
            <Input
              h="4vh"
              type="text"
              placeholder="Enter file name"
              ref={newFileName}
              pr="110px" // Adjust to the combined width of buttons + padding
            />
            <InputRightElement width="auto" display="flex" alignItems="center" pr={2} height="100%">
              <Button
                type="submit"
                colorScheme="blue"
                mr={2}
                h="3vh"
                w="10px"
                fontSize="1.5dvh"
              >
                Submit
              </Button>
              <button
                onClick={() => setNewFileRender(false)}
                height="3vh"
                width="10px" // Adjust width here
              >
                <FaTimes size="1em" />
              </button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
      </form>
    </Box>
  );
}

export default NewFileInput;
