const usersReducer = (state = [], action) => {
  switch (action.type) {
    case "ADD_USER":
      return state.some((user) => user.uid === action.payload.uid)
        ? state
        : [...state, action.payload];

    case "UPDATE_USER": {
      let i = state.findIndex((user) => user.uid === action.payload.uid);
      let newState = [...state];
      if (i != -1) newState[i] = action.payload;
      else newState = [...state, action.payload];
      return newState;
    }

    default:
      return state;
  }
};

export default usersReducer;
