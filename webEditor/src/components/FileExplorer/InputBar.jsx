import React, { useContext, useEffect, useState, useRef } from 'react';
import { Box, Tooltip } from '@chakra-ui/react';
import { FaFolder } from 'react-icons/fa';
import { FileDirectoryContext, ExplorerErrorHandler, FileHandleArrayContext, DirectoryHandleArrayContext, ClickedFolderContext } from '../../context/IDEContext';
import { FaFile } from 'react-icons/fa6';
import { AiFillFileAdd } from "react-icons/ai";

const InputBar = () => {
  const { files, setFiles } = useContext(FileDirectoryContext);
  const { setExplorerErrorHandler } = useContext(ExplorerErrorHandler);
  const { fileHandles, setFileHandles } = useContext(FileHandleArrayContext);
  const { directoryHandles, setDirectoryHandles } = useContext(DirectoryHandleArrayContext);
  const {clickedFolder} = useContext(ClickedFolderContext);
  const [newFileRender, setNewFileRender] = useState(false);
  let newFileName = useRef();

  useEffect(() => {
    console.log('files handles: ', fileHandles);
    console.log('directory handles : ', directoryHandles);
  }, [fileHandles, directoryHandles]);

  const handleFileCreate = async (e) => {
    e.preventDefault();
  
    try {
      if (!directoryHandles) {
        setExplorerErrorHandler("Please upload a folder first");
        return;
      }
  
      if (!clickedFolder) {
        setExplorerErrorHandler("Selected a folder to create file in");
        return;
      }
  
      for (const [name, handle] of Object.entries(directoryHandles)) {
        console.log("handles", name);
        console.log("clicked folder: ", clickedFolder);
  
        // Check if the last part of the path matches the clicked folder
        const lastPart = name.split('/').pop();
        if (lastPart === clickedFolder) {
          console.log(`FILE BEING CREATED AT : HANDLE(value): ${handle} : name(key) : ${name}`);
          
          const fileName = newFileName.current.value;
          console.log("CREATING NEW FILE : ", fileName);
  
          const fileHandle = await handle.getFileHandle(fileName, { create: true });
  
          const writableStream = await fileHandle.createWritable();
          writableStream.write(' ');
          await writableStream.close();
  
          setNewFileRender(false);
  
          setFileHandles((prevHandles) => ({
            ...prevHandles,
            [fileName]: fileHandle
          }));
  
          // Update files directory object and re-render
        }
      }
    } catch (err) {
      console.error("Error creating file: ", err);
    }
  };
  

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

  //TEST CASE FOR handleDirectoryUpload
  useEffect(() => {
    console.log("file handles: ", fileHandles, " directory handles: ", directoryHandles);
  }, [fileHandles, directoryHandles])

  const handleDirectoryUpload = async () => {
    try {
      console.log('Opening directory picker...');
      const directoryHandle = await window.showDirectoryPicker();
      console.log('Directory selected:', directoryHandle.name);
      const { structure } = await parseDirectory(directoryHandle);
      console.log('Directory structure:', structure);
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
        } else if (handle.kind === 'directory') {
          const result = await parseDirectory(handle);
          directory[name] = result.structure;
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

      { !newFileRender ? <Tooltip label="Create New File" aria-label="create new file tooltip">
        <button onClick={() => setNewFileRender((prevState) => !prevState)} className="open-file-button">
          <AiFillFileAdd size="1.2em" id="open-file" />
        </button>
      </Tooltip>
      : 
      <Box>
        <form onSubmit={handleFileCreate}>
          <input 
          type="text"
          ref={newFileName}
          />
          <button type="submit">Submit</button>
        </form>
      </Box> }
    </Box>
  );
};

export default InputBar;