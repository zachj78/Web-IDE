import React, { useContext, useEffect } from "react";
import { Box, HStack } from "@chakra-ui/react";
import { ClickedFileContext, ActiveFileContext, SelectedFileContext } from "../../context/IDEContext"
import "../../styles/ActiveFileBar.css"

const ActiveFileBar = () => {
    const { activeFiles, setActiveFiles } = useContext(ActiveFileContext)
    const { clickedFiles, setClickedFiles } = useContext(ClickedFileContext);
    const { selectedFile, setSelectedFile } = useContext(SelectedFileContext)

    const handleFileSelect = (selectedFile) => {
        setSelectedFile(selectedFile);
    }

    useEffect(() => {
        console.log("Clicked Files updated!!", clickedFiles)
    }, [clickedFiles])

    return (
        <Box w="45vw" overflowX="auto" overflowY="hidden">
            <HStack spacing="0" margin="0" padding="0" display="flex">
                {clickedFiles && (
                    selectedFile === clickedFiles ? (
                        <div
                            className="file-div clicked-file-div"
                            style={{ backgroundColor: "#444444" }}
                            onClick={() => handleFileSelect(clickedFiles)}
                        >
                            {clickedFiles}
                        </div>
                    ) : (
                        <div
                            className="file-div clicked-file-div"
                            onClick={() => handleFileSelect(clickedFiles)}
                        >
                            {clickedFiles}
                        </div>
                    )
                )}
                    {activeFiles && activeFiles.map((file, index) => (
                        selectedFile === file ? 
                        <div className="file-div active-file-div" style={{backgroundColor:"#444444"}} onClick={() => handleFileSelect(file)}key={index}>{file}</div> 
                        :
                        <div className="file-div active-file-div" onClick={() => handleFileSelect(file)}key={index}>{file}</div> 
                    ))}
            </HStack>
        </Box>
    );
}
 
export default ActiveFileBar;