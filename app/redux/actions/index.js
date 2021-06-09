/* #region  postsReducer */
export const setPosts = (posts) => {
  return {
    type: "SET_POSTS",
    payload: posts,
  };
};

export const addNewPost = (post) => {
  return {
    type: "ADD_NEW_POST",
    payload: post,
  };
};

export const clearFeedPosts = () => {
  return {
    type: "CLEAR_FEED_POSTS",
  };
};
/* #endregion */

/* #region  userPostsReducer */
export const setUserPosts = (posts) => {
  return {
    type: "SET_OWN_POSTS",
    payload: posts,
  };
};

export const addMorePosts = (posts) => {
  return {
    type: "ADD_MORE_POSTS",
    payload: posts,
  };
};

export const clearProfilePosts = () => {
  return {
    type: "CLEAR_PROFILE_POSTS",
  };
};
/* #endregion */

/* #region  userReducer */
export const addUser = (user) => {
  return {
    type: "ADD_USER",
    payload: user,
  };
};

export const updateUser = (user) => {
  return {
    type: "UPDATE_USER",
    payload: user,
  };
};
/* #endregion */
