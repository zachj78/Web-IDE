import React, { useContext, useEffect, useRef } from 'react';
import { Box, Button, FormControl, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { FaTimes } from 'react-icons/fa';
import { ClickedFolderContext, DirectoryHandleArrayContext, ExplorerErrorHandler, FileHandleArrayContext } from '../../../context/IDEContext';

const NewFolderInput = ({ setNewFolderRender }) => {
  const { setExplorerErrorHandler } = useContext(ExplorerErrorHandler);
  const { clickedFolder } = useContext(ClickedFolderContext);
  const { directoryHandles, setDirectoryHandles } = useContext(DirectoryHandleArrayContext);
  const newFolderName = useRef();

    useEffect(() => {
        console.log("dir handles : ", directoryHandles);
    }, [directoryHandles])

  const handleFolderCreate = async (e) => {
    e.preventDefault();

    const folderName = newFolderName.current.value;
    console.log("clicked folder: ", clickedFolder)

    if (!directoryHandles) {
        setExplorerErrorHandler("Please upload a folder first");
        return;
      }

    if (!clickedFolder) {
        setExplorerErrorHandler("Select a folder to create file in");
        return;
    }

    try {
        //find parent directory handle
        for(const [path, handle] of Object.entries(directoryHandles)) {
            if(path === clickedFolder) {
                let newFolderHandle = await handle.getDirectoryHandle(folderName, { create: true });
                let newFolderName = path + '/' + folderName;

                console.log("Success!");

                setNewFolderRender(false);

                setDirectoryHandles((prevHandles) => ({
                  ...prevHandles,
                  [newFolderName]: newFolderHandle
                }));
            }
        }
        //re-render file directory object(files)
    } catch(err) {
        console.err("couldnt create folder -- ", err)
        setExplorerErrorHandler("Could not create file, please try again")
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
