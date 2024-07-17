import { Box, List, ListItem } from '@chakra-ui/react';
import React, { useContext, useState } from 'react';
import { ActiveFileContext, FileDirectoryContext } from '../../context/IDEContext';

const FileTree = () => {
    const { files } = useContext(FileDirectoryContext);
    const { activeFile } = useContext(ActiveFileContext);

    const renderDirectory = (files) => {
        return (
            <List spacing={2} styleType="none" id="list">
                {Object.keys(files).map((key) => (
                    <ListItem key={key}>
                        {typeof files[key] === "object" ? (
                            <Box pl={4} borderLeft="1px solid black">
                                <Box fontWeight="bold" mb={2}>{key}</Box>
                                {renderDirectory(files[key])}
                            </Box>
                        ) : (
                            <Box pl={4}>{key}</Box>
                        )}
                    </ListItem>
                ))}
            </List>
        );
    };

    return (
        <Box w="20vw" overflowY="auto" fontSize="14px" maxH="20vh">
            {files ? renderDirectory(files) : <p>No files uploaded yet</p>}
        </Box>
    );
};

export default FileTree;
