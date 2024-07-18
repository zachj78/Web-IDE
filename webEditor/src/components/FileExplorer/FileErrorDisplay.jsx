import React, { useContext, useEffect, useState } from 'react';
import { ExplorerErrorHandler } from '../../context/IDEContext';
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverArrow,
  PopoverCloseButton,
  useDisclosure
} from '@chakra-ui/react';

const FileErrorDisplay = () => {
    const { explorerErrorHandler, setExplorerErrorHandler } = useContext(ExplorerErrorHandler);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [ showPopover, setShowPopover ] = useState(false); 

    useEffect(() => {
        if(explorerErrorHandler) {
            console.log("explorer error handler exists")
            setShowPopover(true);
            setTimeout(() => {
                setShowPopover(false);
                console.log("popover showing...")
            }, 3000)
        } else {
            onClose();
        }
    }, [explorerErrorHandler, onOpen, onClose]);

    return (
        <Popover isOpen={showPopover}>
        <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            { explorerErrorHandler && <PopoverHeader>{explorerErrorHandler}</PopoverHeader> }
        </PopoverContent>
        </Popover> 
    );
}
 
export default FileErrorDisplay;