import React, { useContext, useEffect } from 'react';
import { Box, Tooltip } from '@chakra-ui/react';
import { FaFolder } from 'react-icons/fa';
import { CachedFileArrayContext, FileDirectoryContext } from '../../context/IDEContext';
import { ExplorerErrorHandler } from '../../context/IDEContext';
import { FaFile } from "react-icons/fa6";

const InputBar = () => {
    const { files, setFiles } = useContext(FileDirectoryContext);
    const { setExplorerErrorHandler } = useContext(ExplorerErrorHandler);
    const { cachedFileArray, setCachedFileArray } = useContext(CachedFileArrayContext);
    let directoryAction = null;
    let root = {};

    const searchFileDirectory = (file) => {
        console.log("searching file directory, existing dir: ", files, " for file(s): ", file);
        for (let i = 0; i < file.length; i++) {
            const parts = file[i].webkitRelativePath.split('/');
            let fileExists = false;

            parts.forEach((part, index) => {
                function recursiveKeySearch(files, part) {
                    console.log("FILE CONTENT : ", files)
                    for (let key in files) {
                        console.log("dir keys: ", key);
                        console.log("added folder parts ", part, "index --", index);
                        if (key === part) {
                            fileExists = true;
                            setExplorerErrorHandler("Can't add file - Already added");
                            console.log("Can't add file - Already added");
                            return;
                        }

                        if (typeof files[key] === "object") {
                            recursiveKeySearch(files[key], part);
                        }
                    }
                }
                recursiveKeySearch(files, part);
            });

            if (fileExists) {
                return;
            }
        }

        console.log("Folder not already uploaded, uploading");
        addToDirectory(file);
    }

    const createUniqueFileArray = (fileArray) => {
        if (cachedFileArray) {
            //merge existing files and new files
            const mergedFiles = [...cachedFileArray, ...fileArray];
            const uniqueFiles = Array.from(new Set(mergedFiles));
            setCachedFileArray(uniqueFiles);
        } else {
            setCachedFileArray(fileArray);
        }
    }

    const handleInputClick = (e) => {
        e.preventDefault();
        const openFolderInput = document.getElementById('folder-input');
        const openFileInput = document.getElementById('file-input');

        let targetElement = e.target;
        while (targetElement && !targetElement.id) {
            targetElement = targetElement.parentElement;
        }

        if (!targetElement) {
            console.error('No target element with an id found');
            return;
        }

        console.log("element id clicked: ", targetElement.id);

        switch (targetElement.id) {
            case "open-folder":
                console.log("Open Folder Button Clicked");
                openFolderInput.click();
                directoryAction = targetElement.id;
                break;
            case "open-file":
                console.log("Open File Button Clicked");
                openFileInput.click();
                directoryAction = targetElement.id;
                break;
            default:
                return;
        }
    }

    const processInput = (e) => {
        const file = Array.from(e.target.files);
        console.log("file info: ", file);

        if (file.length > 0) {
            //creating unique file array
            createUniqueFileArray(file);
            switch (directoryAction) {
                case "open-folder":
                    console.log("action: open folder, uploaded folder, ", file, " existing directory, ", files);
                    files ? searchFileDirectory(file) : buildDirectoryObject(file);
                    break;
                case "open-file":
                    console.log("action: open file, uploaded folder, ", file, " existing directory, ", files);
                    files ? searchFileDirectory(file) : buildDirectoryObject(file);
                    break;
                default:
                    return;
            }
        } else {
            setExplorerErrorHandler("Error! File/Folder must be chosen");
        }

        e.target.value = null;
    };

    const buildDirectoryObject = (fileArray) => {
        console.log('directory obj being built, fileArray:', fileArray);
        if (fileArray.length === 1) {
            console.log("FILE UPLOADED");
            let current = root;
            current[fileArray[0].name] = "file";
            setFiles(root);
        } else {
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
            }
            console.log('root', JSON.stringify(root, null, 2));
            setFiles(root);
        }
    };

    const addToDirectory = (fileArray) => {
        console.log("FILE ADD ARRAY ::", fileArray[0].name)
        if (fileArray.length === 1) {
            console.log("Singular file uploaded");
            const fileName = { [fileArray[0].name]: "file" };
            setFiles(prevState => ({ ...prevState, ...fileName }));
        }

        for (let i = 0; i < fileArray.length; i++) {
            const parts = fileArray[i].webkitRelativePath.split('/');
            let current = root;

            parts.forEach((part, index) => {
                if (!current[part]) {
                    if (index === parts.length - 1) {
                        current[part] = 'file'
                    } else {
                        current[part] = {}
                    }
                }
                current = current[part]
            })
        }
        console.log('adding files !!!', JSON.stringify(root, null, 2));
        setFiles(prevState => ({ ...prevState, ...root }));
    }

    return (
        <Box w="20vw" border="1px solid #333" borderRadius={4}>
            <input
                type="file"
                id="folder-input"
                webkitdirectory="true"
                directory=""
                multiple
                style={{ display: 'none', height: '0vh' }}
                onChange={processInput}
            />
            <Tooltip label="Open Folder" aria-label="open folder tooltip">
                <button onClick={handleInputClick} className="open-folder-button">
                    <FaFolder size="1.3em" id="open-folder" />
                </button>
            </Tooltip>

            <input
                type="file"
                id="file-input"
                multiple
                style={{ display: 'none' }}
                onChange={processInput}
            />
            <Tooltip label="Open File" aria-label="open file tooltip">
                <button onClick={handleInputClick} className="open-file-button">
                    <FaFile size="1.2em" id="open-file" />
                </button>
            </Tooltip>
        </Box>
    );
};

export default InputBar;