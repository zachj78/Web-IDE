import { createSlice } from '@reduxjs/toolkit';

const activeFilesInitialState = [];
const initialState = "";

const activeFilesSlice = createSlice({
  name: 'activeFiles',
  initialState: activeFilesInitialState,
  reducers: {
    addActiveFiles: (state, action) => {
        const { activeFiles } = action.payload;
        console.log("ACTIVE FILES PAYLOAD: ", activeFiles)
        return [activeFiles, ...state];
    }, 
    updateActiveFiles: (state, action) => {
        const { activeFile } = action.payload;
        console.log("updating active files");

        return activeFile;
    }
  },
});

const clickedFileSlice = createSlice({
    name: 'clickedFile',
    initialState,
    reducers: {
        addClickedFile: (state, action) => {
            const { clickedFile } = action.payload;

            return clickedFile;
        },
        removeClickedFile: (state, action) => {
            return null;
        },
    }
})

const selectedFileSlice = createSlice({
    name: 'selectedFile',
    initialState,
    reducers: {
        addSelectedFile: (state, action) => {
            const { selectedFile } = action.payload;

            return selectedFile;
        }, 
        removeSelectedFile: (state, action) => {
            return null;
        }
    }
})

export const { addActiveFiles, updateActiveFiles } = activeFilesSlice.actions;
export const { addClickedFile, removeClickedFile } = clickedFileSlice.actions;
export const { addSelectedFile, removeSelectedFile } = selectedFileSlice.actions;
export const activeFilesReducer = activeFilesSlice.reducer;
export const clickedFileReducer = clickedFileSlice.reducer;
export const selectedFileReducer = selectedFileSlice.reducer;