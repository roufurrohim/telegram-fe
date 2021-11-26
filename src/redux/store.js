import { createStore, combineReducers, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import userReducer from './reducers/user';

const reducers = combineReducers({
    users: userReducer,
})

const middleware = applyMiddleware(thunk, logger)
const store = createStore(reducers, middleware)

export default store