import {createStore, combineReducers, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import map  from './reducers/Map';
import dataReducer  from './reducers/dataReducer';
import uiReducer  from './reducers/uiReducer';
import userReducer  from './reducers/userReducer';
import seenReducer  from './reducers/seenReducer';
import socketReducer  from './reducers/socketReducer';
import authReducer from './reducers/authReducer';
import utilReducer from './reducers/utilReducer';

import createSensitiveStorage from "redux-persist-sensitive-storage";
import { persistStore, persistReducer } from 'redux-persist'

const StorageSensitive = createSensitiveStorage({
  keychainService: "myKeychain",
  sharedPreferencesName: "mySharedPrefs"
})

const persistConfig = {
  key: 'root',
  storage: StorageSensitive,
  whitelist: ['user', 'auth', 'seen', 'data'],
}

const appReducer = combineReducers({
  map: map,
  data: dataReducer,
  ui: uiReducer,
  user: userReducer,
  seen: seenReducer,
  socket: socketReducer,
  auth: authReducer,
  util: utilReducer,
}) 

const rootReducer = (state, action) => {
  // when a logout action is dispatched it will reset redux state
  if (action.type === 'USER_LOGGED_OUT') {
    console.log("logged out")
     // for all keys defined in your persistConfig(s)
     StorageSensitive.removeItem('persist:root')
     // storage.removeItem('persist:otherKey')

     state = undefined;
  }

  return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default () => {
  let store = createStore(persistedReducer, applyMiddleware(thunk));
  let persistor = persistStore(store);
  return { store, persistor }
}
// const store = () => {
//   return createStore(rootReducer,applyMiddleware(thunk));
// }

// export default store;