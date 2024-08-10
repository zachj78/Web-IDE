import React, { useContext, useEffect, useRef } from 'react';
import { Box, Button, FormControl, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { FaTimes } from 'react-icons/fa';
import { ClickedFolderContext } from '../../../context/IDEContext';
import { useDispatch, useSelector } from 'react-redux';
import { addError, addDirectoryHandles } from '../../../Redux/filesSlice';

const NewFolderInput = ({ setNewFolderRender }) => {
  const dispatch = useDispatch();
  const directoryHandles = useSelector((state) => state.directoryHandles);
  
  const { clickedFolder } = useContext(ClickedFolderContext);
  const newFolderName = useRef();

  const handleFolderCreate = async (e) => {
    e.preventDefault();

    const folderName = newFolderName.current.value;
    console.log("clicked folder: ", clickedFolder)

    if (!directoryHandles) {
      dispatch(addError({ err: "Please upload a folder first" }));
        return;
      }

    if (!clickedFolder) {
        dispatch(addError({ err: "Select a folder to create new sub-folder in" }));
        return;
    }

    try {
        //find parent directory handle
        for(const [path, handle] of Object.entries(directoryHandles)) {
            if(path === clickedFolder) {
                let newFolderHandle = await handle.getDirectoryHandle(folderName, { create: true });
                let newFolderName = path + '/' + folderName;

                let newDirHandle = {};
                newDirHandle[newFolderName] = newFolderHandle;
                console.log("Success!: creating folder: ", newDirHandle);

                setNewFolderRender(false);
                dispatch(addDirectoryHandles({ directoryHandles: newDirHandle }))
            }
        }
        //re-render file directory object(files)
    } catch(err) {
        console.err("Error creating folder: ", err)
        dispatch(addError({ err: "Could not create file, please try again" }));
    }
  };

  return (
    <Box p={4} w="full" boxSizing="border-box" overflow="hidden">
      <form onSubmit={handleFolderCreate}>
        <FormControl>
          <InputGroup>
            <Input
              h="4vh"
              type="text"
              placeholder="Enter folder name"
              ref={newFolderName}
              pr="110px"
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
                onClick={() => setNewFolderRender(false)}
                height="3vh"
                width="10px"
              >
                <FaTimes size="1em" />
              </button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
      </form>
    </Box>
  );
};

export default NewFolderInput;
