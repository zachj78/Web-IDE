import { Box, Flex, HStack, Text } from '@chakra-ui/react';
import React, { useContext, useState } from 'react';
import InputBar from './InputBar';
import FileTree from './FileTree';
import FileErrorDisplay from './FileErrorDisplay';

const ExplorerWindow = () => {
    return (
        <Box w='20vw' h="90vh">
            <Text mb={4} fontSize='lg'>Explorer</Text>
            <HStack mb={1}>
                <Flex>
                    <InputBar />
                </Flex>
                <Flex>
                    <FileErrorDisplay />
                </Flex>
            </HStack>
            <Box>
                <FileTree />
            </Box>
        </Box>
    );
}
 
export default ExplorerWindow;