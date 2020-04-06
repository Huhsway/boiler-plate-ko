import { combineReducers } from 'redux';
import user from './user_reducer';

const rootReducer = combineReducers({ // 각기 다른 기능의 Reducer를 한번에 합쳐줌
    user
})

export default rootReducer;