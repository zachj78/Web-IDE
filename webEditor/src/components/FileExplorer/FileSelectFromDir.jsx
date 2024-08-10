import { Box } from '@chakra-ui/react';
import React, { useEffect, useState, useContext } from 'react';
import CenteredModal from '../ReusableComponents/ReusableModal';
import { useDispatch, useSelector } from 'react-redux';
import { addFileHandles, addFiles, updateFiles, addDirectoryHandles, addError } from '../../Redux/filesSlice'

const FileSelectFromDir = ({ parentHandle, dirFileHandles }) => {
    const dispatch = useDispatch();
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
          
          dispatch(updateFiles({
            parentHandleName: parentHandle.name,
            fileHandleName: fileHandle.name,
          }));
          
          dispatch(addFileHandles({ 
            fileHandles: { 
              [fullFilePath]: fileHandle
            }
          }));

          dispatch(addDirectoryHandles({
            directoryHandles: {
                [parentHandle.name]: parentHandle
            }
          }));

        } catch (err) {
          console.error("Error reading selected file:", err);
          dispatch(addError({ err: "Error reading file, try again"}));
        }
      };

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
