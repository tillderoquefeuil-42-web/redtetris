export const COUNTER_ACTIONS = {
  INCREMENT : 'COUNTER_INCREMENT',
  DECREMENT : 'COUNTER_DECREMENT'
};

const initialState = {
  count: 0
};

const reducer = (state = initialState , action) => {

  switch(action.type){
    case COUNTER_ACTIONS.INCREMENT:
      return {
        count: state.count + 1
      };
    case COUNTER_ACTIONS.DECREMENT:
      return {
        count: state.count - 1
      };
    default: 
      return state
  }
}

export default reducer

