import { createStore, applyMiddleware } from "redux";
import rootReducer from "../reducers";
import thunk from "redux-thunk";
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native


const initialState = {}
const middleware = [thunk];
const persistConfig = {
    key: 'root',
    storage,
}
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));
const persistor = persistStore(store);

// const store = createStore(rootReducer, initialState, applyMiddleware(...middleware));
export { store, persistor }