import React, { useContext, useEffect } from 'react';
import { Box, Tooltip } from '@chakra-ui/react';
import { FaFolder } from 'react-icons/fa';
import { FileDirectoryContext, ExplorerErrorHandler, FileHandleArrayContext, DirectoryHandleArrayContext } from '../../context/IDEContext';
import { FaFile } from 'react-icons/fa6';

const InputBar = () => {
  const { files, setFiles } = useContext(FileDirectoryContext);
  const { setExplorerErrorHandler } = useContext(ExplorerErrorHandler);
  const { fileHandles, setFileHandles } = useContext(FileHandleArrayContext);
  const { setDirectoryHandles } = useContext(DirectoryHandleArrayContext);

  useEffect(() => {
    console.log('files updated: ', files);
  }, [files]);

  const handleFileUpload = async () => {
    try {
      console.log('Opening file picker...');
      const [fileHandle] = await window.showOpenFilePicker({
        multiple: false
      });

      if (fileHandle) {
        console.log('File selected:', fileHandle.name);
        const file = await fileHandle.getFile();
        console.log('File object:', file);
        const fileData = await file.text();
        console.log('File data:', fileData);

        setFiles((prevFiles) => ({
          ...prevFiles,
          [file.name]: fileData
        }));
        setFileHandles((prevHandles) => ({
          ...prevHandles,
          [fileHandle.name]: fileHandle
        }));
      } else {
        console.log('No file selected.');
      }
    } catch (err) {
      console.error('Error uploading file:', err);
      setExplorerErrorHandler('Error uploading file, try again');
    }
  };

  const handleDirectoryUpload = async () => {
    try {
      console.log('Opening directory picker...');
      const directoryHandle = await window.showDirectoryPicker();
      console.log('Directory selected:', directoryHandle.name);
      const { structure, handles } = await parseDirectory(directoryHandle);
      console.log('Directory structure:', structure);
      setFiles((prevFiles) => ({
        ...prevFiles,
        [directoryHandle.name]: structure
      }));
      setFileHandles((prevHandles) => [...prevHandles, ...handles]);
      setDirectoryHandles((prevHandles) => ({
        ...prevHandles,
        [directoryHandle.name] : directoryHandle,
      }));
    } catch (err) {
      console.error('Error accessing file system', err);
      setExplorerErrorHandler('Error uploading files, try again');
    }
  };

  const parseDirectory = async (directoryHandle) => {
    const directory = {};
    const handles = [];
    const chunkSize = 10;

    console.log('Parsing directory:', directoryHandle.name);

    const directoryIterator = directoryHandle.entries();

    while (true) {
      const chunk = [];
      for (let i = 0; i < chunkSize; i++) {
        const result = await directoryIterator.next();
        if (result.done) break;
        chunk.push(result.value);
      }

      if (chunk.length === 0) break;

      await Promise.all(chunk.map(async ([name, handle]) => {
        if (handle.kind === 'file') {
          directory[name] = 'file';
          handles.push(handle);
        } else if (handle.kind === 'directory') {
          const result = await parseDirectory(handle);
          directory[name] = result.structure;
          handles.push(...result.handles);
        }
      }));

      await new Promise((resolve) => setTimeout(resolve, 0));
    
    }

    return { structure: directory, handles };
  };

  return (
    <Box w="20vw" border="1px solid #333" borderRadius={4}>
      <Tooltip label="Open Folder" aria-label="open folder tooltip">
        <button onClick={handleDirectoryUpload} className="open-folder-button">
          <FaFolder size="1.3em" id="open-folder" />
        </button>
      </Tooltip>

      <Tooltip label="Open File" aria-label="open file tooltip">
        <button onClick={handleFileUpload} className="open-file-button">
          <FaFile size="1.2em" id="open-file" />
        </button>
      </Tooltip>
    </Box>
  );
};

export default InputBar;