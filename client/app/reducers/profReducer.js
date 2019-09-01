const initialState = {};

export default function(state = initialState, action) {  
  switch (action.type) {
    case "FETCHED_PROFS":
      return action.payload;
    case "CLEARED_PROFS":
      return {};
    default:
      return state;
  }
}
