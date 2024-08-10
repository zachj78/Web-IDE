import { Box, VStack, Text, Button } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { createPortal } from "react-dom";

const FileContextMenu = ({ fileContextMenuPos, fileContextMenuItems, fileContextMenuVisible, setFileContextMenuVisible }) => {
  useEffect(() => {
    const handleClickOutside = (e) => {
      e.preventDefault();
      if (fileContextMenuVisible) {
        setFileContextMenuVisible(false);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [fileContextMenuVisible]);

  if (!fileContextMenuVisible) return null;

  return createPortal(
    <Box
      position="absolute"
      top={`${fileContextMenuPos.y}px`}
      left={`${fileContextMenuPos.x}px`}
      backgroundColor="gray.800"
      borderRadius={2}
      zIndex="1000"
      boxShadow="md"
      p={2}
    >
      <VStack bgColor="gray.800" p={0} m={0}>
        {fileContextMenuItems.map((item, index) => (
          <Text 
          fontSize="1.8dvh"
          color="gray.200" 
          pl={3}
          pr={3}
          cursor="pointer"
          key={index} 
          onClick={item.onClick}>
            {item.label}
          </Text>
        ))}
      </VStack>
    </Box>,
    document.body
  );
};

export default FileContextMenu;
