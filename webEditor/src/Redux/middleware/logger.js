const loggerMiddleware = store => next => action => {
    const result = next(action);
    console.log('dispatching', action);
    console.log('next state', store.getState());
    return result;
  };
  
export default loggerMiddleware;