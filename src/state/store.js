import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { gameReducer } from "./slice";
import { DialogReducer } from "./dialog/slice";

const reducer = combineReducers({
    game:gameReducer,
    dialog:DialogReducer,
});

export const store = configureStore ({
    reducer: reducer,
});