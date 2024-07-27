import React, { useContext, useRef } from 'react';
import { Box, Button, FormControl, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { FaTimes } from 'react-icons/fa';
import { ClickedFolderContext, DirectoryHandleArrayContext, ExplorerErrorHandler, FileHandleArrayContext } from '../../context/IDEContext';

const NewFileInput = ({ setNewFileRender }) => {
  const { setExplorerErrorHandler } = useContext(ExplorerErrorHandler);
  const { clickedFolder } = useContext(ClickedFolderContext);
  const { directoryHandles } = useContext(DirectoryHandleArrayContext);
  const { setFileHandles } = useContext(FileHandleArrayContext);
  const newFileName = useRef();

  const handleFileCreate = async (e) => {
    e.preventDefault();

    try {
      if (!directoryHandles) {
        setExplorerErrorHandler("Please upload a folder first");
        return;
      }

      if (!clickedFolder) {
        setExplorerErrorHandler("Select a folder to create file in");
        return;
      }

      const fileName = newFileName.current.value;

      if (!fileName) {
        setExplorerErrorHandler("Please set a file name");
        return;
      }

      for (const [name, handle] of Object.entries(directoryHandles)) {
        const lastPart = name.split('/').pop();
        if (lastPart === clickedFolder) {
          const fileHandle = await handle.getFileHandle(fileName, { create: true });

          const writableStream = await fileHandle.createWritable();
          writableStream.write(' ');
          await writableStream.close();

          setNewFileRender(false);

          setFileHandles((prevHandles) => ({
            ...prevHandles,
            [fileName]: fileHandle
          }));
        }
      }
    } catch (err) {
      console.error("Error creating file: ", err);
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
