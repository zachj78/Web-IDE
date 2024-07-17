import React, { useContext } from 'react';
import { Box, Tooltip } from '@chakra-ui/react';
import { FaFolder, FaFolderPlus } from 'react-icons/fa';
import { FileDirectoryContext } from '../../context/IDEContext';
import { ExplorerErrorHandler } from '../../context/IDEContext';
import { FaFile, FaFileCirclePlus } from "react-icons/fa6";

const InputBar = () => {
    const { files, setFiles } = useContext(FileDirectoryContext);
    const { explorerErrorHandler, setExplorerErrorHandler } = useContext(ExplorerErrorHandler);
    let root = {};

    console.log("ROOT:", root)

    const buildDirectoryObject = (fileArray) => {
        console.log('directory obj being built: ');
    
            // const reader = new FileReader();

            // reader.onload = (e) => {
            //     console.log(e.target.result);
            // };

            // reader.readAsText(fileArray[0]);

            for (let i = 0; i < fileArray.length; i++) {
                const parts = fileArray[i].webkitRelativePath.split('/');
                let current = root;

                parts.forEach((part, index) => {
                    if (!current[part]) {
                        if (index === parts.length - 1) {
                            current[part] = "file";
                        } else {
                            current[part] = {};
                        }
                    }
                    current = current[part];
                });
                console.log('root', JSON.stringify(root, null, 2));
                
        }
        setFiles(root);
    };

    const addToDirectory = (fileArray) => {
        console.log("FILE ADD ARRAY ::", fileArray)
        for(let i = 0; i < fileArray.length; i++) {
            const parts = fileArray[i].webkitRelativePath.split('/');
            let current = root;

            parts.forEach((part, index) => {
                if(!current[part]){
                    if(index === parts.length - 1) {
                        current[part] = 'file'
                    } else {
                        current[part] = {}
                    }
                }
                current = current[part]
            })
        }
        console.log('adding files !!!', JSON.stringify(root, null, 2));
        setFiles(prevState => ({ ...prevState, ...root}));
    }

    const handleInputClickFolder = (e) => {
        e.preventDefault();
        document.getElementById('folder-input').click();
    };

    const handleInputClickFile = (e) => {
        e.preventDefault();
        document.getElementById('file-input').click();
    };

    const handleInputClickAddFolder = (e) => {
        e.preventDefault();
        document.getElementById('folder-add-input').click();
    };

    const handleFolderChange = (e) => {
        const file = Array.from(e.target.files);
        console.log('handleFolderChange: files have been chosen');
        if (file.length > 0) {
            console.log(file);
            buildDirectoryObject(file);
        }
    };

    const handleFileChange = (e) => {
        const file = Array.from(e.target.files);
        console.log('handleFileChange: files have been chosen');
        if (file.length > 0) {
            console.log(file);
            buildDirectoryObject(file);
        }
    };

    const handleFolderAddChange = (e) => {
        const file = Array.from(e.target.files);
        console.log("file", file)
        console.log("FILES: ", files)
        if (file.length > 0) {
            for(let i = 0; i < file.length; i++) {
                const parts = file[i].webkitRelativePath.split('/');

                if(files === null) {
                    buildDirectoryObject(file);
                } else {
                    parts.forEach((part, index) => {
                        function recursiveKeySearch(files, part) {
                            for(let key in files) {
                                    console.log("dir keys: ", key);
                                    console.log("added folder parts ", part, "index --", index)
                                    if(key === part) {
                                        setExplorerErrorHandler("Can't add file - Already added")
                                    }

                                    if (typeof files[key] === "object") {
                                        recursiveKeySearch(files[key], part);
                                    }
                            }
                        }
                        recursiveKeySearch(files, part);
                    })

                    if(!explorerErrorHandler) {
                        console.log("Folder not already uploaded, uploading")
                        addToDirectory(file);
                    }
                }
            }
        }
    };

    return (
        <Box w="20vw" border="1px solid #333" borderRadius={4}>
            <input
                type="file"
                id="folder-input"
                webkitdirectory="true"
                directory=""
                multiple
                style={{ display: 'none', height: '0vh' }}
                onChange={handleFolderChange}
            />
            <Tooltip label="Open Folder" aria-label="open folder tooltip">
                <button onClick={handleInputClickFolder} className="open-folder-button">
                    <FaFolder size="1.3em" />
                </button>
            </Tooltip>

            <input
                type="file"
                id="file-input"
                multiple
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
            <Tooltip label="Open File" aria-label="open file tooltip">
                <button onClick={handleInputClickFile} className="open-file-button">
                    <FaFile size="1.2em" />
                </button>
            </Tooltip>

            <input
                type="file"
                id="folder-add-input"
                multiple
                style={{ display: 'none' }}
                onChange={handleFolderAddChange}
                webkitdirectory="true"
            />
            <Tooltip label="Add Folder" aria-label="add folder tooltip">
                <button onClick={handleInputClickAddFolder} className="add-folder-button">
                    <FaFolderPlus size="1.3em" />
                </button>
            </Tooltip>
        </Box>
    );
};

export default InputBar;