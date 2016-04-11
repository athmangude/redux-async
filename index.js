import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import { createStore, applyMiddleware } from 'redux';
import { selectSubreddit, fetch } from './actions';
import rootReducer from './reducers';

const loggerMiddleware = createLogger();

const store = createStore(
    rootReducer,
    applyMiddleware(
        thunkMiddleware, // lets us dispatch() functions
        loggerMiddleware // neat middleware that logs actions
    );
);


store.dispatch(selectSubreddit(selectSubreddit('reactjs')))
store.dispatch(fetchPostsIfNeeded('reactjs'))
    .then(() => console.log(store.getState()));
