import { Box } from '@chakra-ui/react';
import React, { useEffect, useState, useContext } from 'react';
import CenteredModal from '../ReusableComponents/ReusableModal';
import { FileDirectoryContext, ExplorerErrorHandler, FileHandleArrayContext, DirectoryHandleArrayContext } from '../../context/IDEContext';

const FileSelectFromDir = ({ parentHandle, dirFileHandles }) => {
    const { files, setFiles } = useContext(FileDirectoryContext);
    const { setExplorerErrorHandler } = useContext(ExplorerErrorHandler);
    const { fileHandles, setFileHandles } = useContext(FileHandleArrayContext);
    const { directoryHandles, setDirectoryHandles } = useContext(DirectoryHandleArrayContext);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        if (dirFileHandles && dirFileHandles.length > 0) {
            setModalOpen(true);
        }
    }, [dirFileHandles]);

    const handleCloseModal = () => setModalOpen(false);

    const handleSelectedFile = async (fileHandle) => {
        try {
          const file = await fileHandle.getFile();
          const fullFilePath = `${parentHandle.name}/${file.name}`;
          setFiles((prevFiles) => {
            if (prevFiles[parentHandle.name]) {
              return {
                ...prevFiles,
                [parentHandle.name]: {
                  ...prevFiles[parentHandle.name],
                  [fileHandle.name]: 'file', // Add or update the file
                },
              };
            } else {
              return {
                ...prevFiles,
                [parentHandle.name]: {
                  [fileHandle.name]: 'file',
                },
              };
            }
          });
          
      
          setFileHandles((prevHandles) => ({
            ...prevHandles,
            [fullFilePath]: fileHandle,
          }));

          setDirectoryHandles((prevHandles = {}) => {
            if(!prevHandles[parentHandle.name]) {
                return {
                    ...prevHandles,
                    [parentHandle.name]: parentHandle
                }
            }
            return prevHandles;
          })

        } catch (err) {
          console.error("Error reading selected file:", err);
          setExplorerErrorHandler("Error reading file, try again");
        }
      };
    
      const structureAddedFile = () => {
            const directory = {};
            directory[parentHandle.name]
      }

    return (
        <>
            {dirFileHandles && dirFileHandles.length > 0 && (
                <CenteredModal isOpen={modalOpen} onClose={handleCloseModal} title="- Choose A File -">
                <Box overflowY="auto" maxHeight="400px" padding="4">
                        {dirFileHandles.map((file, index) => (
                            <Box
                                key={index}
                                padding="2"
                                marginBottom="2"
                                backgroundColor="gray.600"
                                borderRadius="md"
                                cursor="pointer"
                                _hover={{ backgroundColor: 'gray.200' }}
                                onClick={() => handleSelectedFile(file)}
                            >
                                {file.name}
                            </Box>
                        ))}
                    </Box>
                </CenteredModal>
            )}
        </>
    );
};

export default FileSelectFromDir;
