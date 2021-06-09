const userPostsReducer = (state = [], action) => {
  switch (action.type) {
    case "SET_OWN_POSTS":
      return action.payload;

    case "ADD_MORE_POSTS": {
      return [...state, ...action.payload];
    }

    case "CLEAR_PROFILE_POSTS":
      return [];

    default:
      return state;
  }
};

export default userPostsReducer;
