import { Box, Input, FormControl, InputGroup, InputRightElement } from "@chakra-ui/react";
import { FaTimes } from 'react-icons/fa';

const RenameFileInput = ({ 
    setShowRenameInput, 
    renameInputValue,  
    setRenameInputValue,
    originalFilePath
    }) => {

    console.log("renaming file -- ", originalFilePath, "to : ", renameInputValue);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const newFilePath = await createNewFilePath(renameInputValue);
        console.log("attempting rename request");

        try {
            const response = await fetch('http://localhost:3001/rename', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ originalFilePath, newFilePath })
            });
        
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Server error:", errorData);
                throw new Error(errorData.details || "Failed response");
            }
        
            const result = await response.json();
            console.log("Returned data from rename", result);
        } catch (err) {
            console.error("Error during fetch request:", err);
        }
    };

    async function createNewFilePath(renameInputValue) {
        const folderPath = originalFilePath.split('/');
        folderPath.pop();
        
        const joinedPath = folderPath.join('/') + '/' + renameInputValue;
        return joinedPath;
    }

    return (
        <Box>
            <FormControl>
                <form id="renameForm" onSubmit={handleSubmit}>
                    <InputGroup>
                        <Input
                            h="4dvh"
                            value={renameInputValue}
                            onChange={(e) => setRenameInputValue(e.target.value)}
                            autoFocus
                            type="text" // Ensure type is text for proper input
                        />
                        <InputRightElement>
                            <button
                                onClick={() => setShowRenameInput(false)}
                                height="3vh"
                                width="10px"
                                type="button" // Ensure this button doesn't submit the form
                            >
                                <FaTimes size="1em" />
                            </button>
                        </InputRightElement>
                    </InputGroup>
                </form>
            </FormControl>
        </Box>
    );
}

export default RenameFileInput;