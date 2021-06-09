const postsReducer = (state = [], action) => {
  switch (action.type) {
    case "SET_POSTS":
      return action.payload;

    case "ADD_NEW_POST":
      return [action.payload, ...state];

    case "CLEAR_FEED_POSTS":
      return [];

    default:
      return state;
  }
};

export default postsReducer;
