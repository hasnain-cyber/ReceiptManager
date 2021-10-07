/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {combineReducers, createStore} from 'redux';
import App from './App';
import {name as appName} from './app.json';

export const reduxTypes = {
  ADD_ITEM: 0,
  DELETE_ITEM: 1,
  INIT_DEFAULTS_ITEMS: 2,
  ADD_BUYER_DETAILS: 3,
  CLEAR_BUYER_DETAILS: 4,
  MODIFY_ITEM: 5,
};

// action
const initDefaults = () => {
  return {
    type: reduxTypes.INIT_DEFAULTS_ITEMS,
    payload: [],
  };
};
export const addItem = itemObject => {
  return {
    type: reduxTypes.ADD_ITEM,
    payload: itemObject,
  };
};
export const deleteItem = deleteName => {
  return {
    type: reduxTypes.DELETE_ITEM,
    payload: deleteName,
  };
};
export const modifyItem = (modifyName, newItemObject) => {
  return {
    type: reduxTypes.MODIFY_ITEM,
    payload: {modifyName, newItemObject},
  };
};
export const addBuyerDetails = buyerObject => {
  return {
    type: reduxTypes.ADD_BUYER_DETAILS,
    payload: buyerObject,
  };
};
export const clearBuyerDetails = () => {
  return {
    type: reduxTypes.CLEAR_BUYER_DETAILS,
  };
};

// reducers
const buyerReducer = (state = [], action) => {
  switch (action.type) {
    case reduxTypes.ADD_BUYER_DETAILS:
      return action.payload;
    case reduxTypes.CLEAR_BUYER_DETAILS:
      return {};
    default:
      return state;
  }
};

const itemsReducer = (state = [], action) => {
  switch (action.type) {
    case reduxTypes.INIT_DEFAULTS_ITEMS:
      return action.payload;
    case reduxTypes.ADD_ITEM:
      const tempList = state;
      tempList.push(action.payload);
      return tempList;
    case reduxTypes.DELETE_ITEM:
      return state.filter(item => item.itemName !== action.payload);
    case reduxTypes.MODIFY_ITEM:
      const tempList2 = [];
      for (const item of state) {
        if (item.itemName === action.payload.modifyName) {
          tempList2.push(action.payload.newItemObject);
        } else {
          tempList2.push(item);
        }
      }
      return tempList2;
    default:
      return [];
  }
};

const combinedReducer = combineReducers({buyerReducer, itemsReducer});
export const store = createStore(combinedReducer);
store.dispatch(initDefaults());

AppRegistry.registerComponent(appName, () => App);
