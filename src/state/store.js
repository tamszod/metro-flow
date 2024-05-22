import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { gameReducer } from "./slice";

const reducer = combineReducers({
    game:gameReducer,
});

export const store = configureStore ({
    reducer: reducer,
});