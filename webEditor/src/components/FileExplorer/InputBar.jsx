import React, { useContext, useEffect, useState, useRef } from 'react';
import { Box, Tooltip } from '@chakra-ui/react';
import { FaFolder, FaFolderPlus } from 'react-icons/fa';
import { FileDirectoryContext, ExplorerErrorHandler, FileHandleArrayContext, DirectoryHandleArrayContext, ClickedFolderContext } from '../../context/IDEContext';
import { FaFile, FaFileCirclePlus  } from 'react-icons/fa6';
import NewFileInput from './FileFolderCreation/NewFileInput';
import NewFolderInput from './FileFolderCreation/NewFolderInput'
import FileSelectFromDir from './FileSelectFromDir';

const InputBar = () => {
  const { setFiles } = useContext(FileDirectoryContext);
  const { setExplorerErrorHandler } = useContext(ExplorerErrorHandler);
  const { setFileHandles } = useContext(FileHandleArrayContext);
  const { setDirectoryHandles } = useContext(DirectoryHandleArrayContext);
  const [newFileRender, setNewFileRender] = useState(false);
  const [newFolderRender, setNewFolderRender ] = useState(false);
  const [dirFileHandles, setDirFileHandles] = useState([]);
  const [parentHandle, setParentHandle] = useState(null);

  const handleFileUploadFromDirectory = async () => {
    try {
      //user picks folder that contains file
      const directoryHandle = await window.showDirectoryPicker();
  
      /* fileHandles is an array of all 
      file handles w/in selected directory handle*/
      const fileHandles = [];
      for await (const entry of directoryHandle.values()) {
        if (entry.kind === 'file') {
          console.log('Files in directory: ', entry);
          fileHandles.push(entry);
        }
      }
  
      /*Prompts user to select file from 
      file handles array */
      if (fileHandles.length > 0) {
        setDirFileHandles(fileHandles);
        setParentHandle(directoryHandle);
      } else {
        setExplorerErrorHandler("No files found in the selected directory!");
      }
    } catch (err) {
      console.error("Error selecting file from directory:", err);
      setExplorerErrorHandler("Error selecting file, try again");
    }
  };

  const handleDirectoryUpload = async () => {
    try {
      const directoryHandle = await window.showDirectoryPicker();
      const structure = await parseDirectory(directoryHandle);

      setFiles((prevFiles) => ({
        ...prevFiles,
        [directoryHandle.name]: structure
      }));

      const individualFileHandles = {};
      const individualDirectoryHandles = {};

      const mapHandles = async(directoryHandle, path = "") => {
        if(path === "") {
          individualDirectoryHandles[directoryHandle.name] = directoryHandle;
          path = directoryHandle.name;
        }

      for await(const [name, handle] of directoryHandle.entries()) {
        const fullPath = `${path}/${name}`;

        if(handle.kind === 'file') {
          individualFileHandles[fullPath] = handle;
        } else if (handle.kind === 'directory'){
          individualDirectoryHandles[fullPath] = handle;
          await mapHandles(handle, fullPath);
        }
      }
    }

    await mapHandles(directoryHandle);


      setFileHandles((prevHandles) => ({
        ...prevHandles,
        ...individualFileHandles
      }));
      setDirectoryHandles((prevHandles) => ({
        ...prevHandles,
        ...individualDirectoryHandles
      }));
    } catch (err) {
      console.error('Error accessing file system', err);
      setExplorerErrorHandler('Error uploading files, try again');
    }
  };

  const parseDirectory = async (directoryHandle) => {
    const directory = {};
    const chunkSize = 10;

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
        } else if (handle.kind === 'directory') {
          const nestedDir = await parseDirectory(handle);
          directory[name] = nestedDir;
        }
      }));

      await new Promise((resolve) => setTimeout(resolve, 0));
    
    }

    return directory;
  };

  return (
    <Box w="20vw" border="1px solid #333" borderRadius={4}>
      <Tooltip label="Open Folder" aria-label="open folder tooltip">
        <button onClick={handleDirectoryUpload} className="open-folder-button">
          <FaFolder size="1.3em" id="open-folder" />
        </button>
      </Tooltip>

      <Tooltip label="Open File" aria-label="open file tooltip">
        <button onClick={handleFileUploadFromDirectory} className="open-file-button">
          <FaFile size="1.2em" id="open-file" />
        </button>
      </Tooltip>

      { !newFileRender ? <Tooltip label="Create New File" aria-label="create new file tooltip">
        <button onClick={() => setNewFileRender((prevState) => !prevState)} className="open-file-button">
          <FaFileCirclePlus size="1.2em" id="create-file" />
        </button>
      </Tooltip>
      : 
      <NewFileInput setNewFileRender={setNewFileRender}/>}

      { !newFolderRender ? 
        <Tooltip label="Create New Folder" aria-label="create new folder tooltip">
          <button onClick={() => setNewFolderRender((prevState) => !prevState)} className="open-file-button">
            <FaFolderPlus size="1.2em" id="create-folder" />
          </button>
        </Tooltip>
        :
        <NewFolderInput setNewFolderRender={setNewFolderRender}/>
      }

      { dirFileHandles && <FileSelectFromDir parentHandle={parentHandle} dirFileHandles={dirFileHandles}/>}
    </Box>
  );
};

export default InputBar;