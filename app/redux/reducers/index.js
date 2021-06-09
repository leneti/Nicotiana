import { combineReducers } from "redux";
import postsReducer from "./posts";
import userPostsReducer from "./userPosts";
import usersReducer from "./user";

const allReducers = combineReducers({
  posts: postsReducer,
  users: usersReducer,
  userPosts: userPostsReducer,
});

export default allReducers;
