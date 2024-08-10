import { configureStore } from '@reduxjs/toolkit';
import {filesReducer, 
  fileHandlesReducer, 
  directoryHandlesReducer, 
  explorerErrorHandlerReducer} from './filesSlice';
import { activeFilesReducer, 
  clickedFileReducer, 
  selectedFileReducer } from './fileBarSlice';
import loggerMiddleware from './middleware/logger'
// import other reducers

const store = configureStore({
  reducer: {
    //file/folder upload actions/reducers
    files: filesReducer,
    fileHandles: fileHandlesReducer,
    directoryHandles: directoryHandlesReducer,
    explorerErrorHandler: explorerErrorHandlerReducer,
    //active file bar states/reducers
    activeFiles: activeFilesReducer,
    clickedFile: clickedFileReducer,
    selectedFile: selectedFileReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(loggerMiddleware),
});

export default store;