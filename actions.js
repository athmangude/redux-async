import fetch from 'isomorphic-fetch';

export const SELECT_SUBREDDIT = 'SELECT_SUBREDDIT';
export function selectSubreddit(subreddit) {
    return {
        type: SELECT_SUBREDDIT,
        subreddit
    }
}

export const INVALIDATE_SUBREDDIT = 'INVALIDATE_SUBREDDIT';
export function invalidateSubreddit(subreddit) {
    return {
        type: INVALIDATE_SUBREDDIT,
        subreddit
    }
}

export const REQUEST_POSTS = 'REQUEST_POSTS';
export function requestPosts(subreddit) {
    return {
        type: REQUEST_POSTS,
        subreddit
    }
}

export const RECEIVE_POSTS = 'RECEIVE_POSTS';
export function receivePosts(subreddit, json) {
    return {
        type: RECEIVE_POSTS,
        subreddit,
        posts: json.data.children.map(child => child.data),
        receivedAt: Date.now()
    }
}


function fetchPosts(subreddit) {
    // thunk middleware knows how to handle functions,
    // it passes teh dispatch method as an argument to the function,
    // thus making it able to dispatch actions itself

    return dispatch {
        // first dispatch: the app state id updated to inform that the API call is starting
        dispatch(requestPosts(subreddit));

        // the function called by the thunk middleware can return a value,
        // that is passed on as a return valie of the dispatch method

        // In this case we return a promise to wait for

        return fetch(`http://www.reddit.com/r/${subreddit}.json`)
            .then(response => response.json())
            .then(json =>
                //  we can dispatch many times
                // here we update the app state with the results of the API call.

                dispatch(receivePosts(subreddit, json));
            );
    }
}

function shouldFetchPosts(state, subreddit) {
    const posts = state.postsBySubreddit[subreddit];

    if (!posts) {
        return true;
    } else if (posts.isFetching) {
        return false;
    } else {
        return posts.didInvalidate;
    }
}


export function fetchPostsIfNeeded(subreddit) {
    // the function also receives getState()
    // which lets you choose what to dispatch next

    // this is useful for avoding network requests if
    // a cached value is already present

    return (dispatch, getState) => {
        if (shouldFetchPosts(getState(), subreddit)) {
            // dispatch a thunk from thunk!
            return dispatch(fetchPosts(subreddit))
        } else {
            // let the calling code know that there is nothing to wait for
            return Promise.resolve();
        }
    }
}
