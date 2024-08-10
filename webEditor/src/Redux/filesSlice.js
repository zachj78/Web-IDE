import { createSlice } from '@reduxjs/toolkit';

const initialState = {};
const explorerErrorHandlerInitState = null;

const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    //structured like this: "{notes: { folder1: { text.js: 'file' }}}"
    addFiles: (state, action) => {
        const { files } = action.payload;
        Object.assign(state, files);
    }, 
    updateFiles: (state, action) => {
        const { parentHandleName, fileHandleName} = action.payload;

        if (!state[parentHandleName]) {
            state[parentHandleName] = {};
        }
    
        state[parentHandleName][fileHandleName] = 'file';
    }
  },
});

const fileHandleSlice = createSlice({
    name: 'fileHandles',
    initialState,
    reducers: {
        //structured like this: {'notes/examplefolder/1.js': file system access api file handle obj}
        addFileHandles: (state, action) => {
            const { fileHandles } = action.payload;

            Object.assign(state, fileHandles);
        }
    }
})

const directoryHandleSlice = createSlice({
    name: 'directoryHandles',
    initialState,
    reducers: {
        //structured like this: { 'notes' : file system access api directory handle obj }
        addDirectoryHandles: (state, action) => {
            const { directoryHandles } = action.payload;

            Object.assign(state, directoryHandles);
        }
    }
})

const explorerErrorHandlerSlice = createSlice({
    name: 'explorerErrorHandler',
    initialState: null, 
    reducers: {
        addError: (state, action) => {
            const { err } = action.payload;

            return err;
        }
    }
})

export const { addFiles, updateFiles } = filesSlice.actions;
export const { addFileHandles } = fileHandleSlice.actions;
export const { addDirectoryHandles } = directoryHandleSlice.actions;
export const { addError } = explorerErrorHandlerSlice.actions;
export const filesReducer = filesSlice.reducer;
export const fileHandlesReducer = fileHandleSlice.reducer;
export const directoryHandlesReducer = directoryHandleSlice.reducer;
export const explorerErrorHandlerReducer = explorerErrorHandlerSlice.reducer;