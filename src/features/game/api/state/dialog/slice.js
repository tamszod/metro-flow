import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    LearnToPlay__IsOpen: false,
    DayEnded__IsOpen: false,
    GameOver__IsOpen: false,

}

const DialogSlice = createSlice({
    name: "dialog",
    initialState,
    reducers: {
        LearnToPlay__SetOpen: (state, {payload}) => {
            if (payload == null ){
                state.LearnToPlay__IsOpen = !state.LearnToPlay__IsOpen;
            } else {
                state.LearnToPlay__IsOpen = payload;
            }
        },
    },
    extraReducers: () => {},
});

//Actions
export const { 
    // Learn To Play
    LearnToPlay__SetOpen,

} = DialogSlice.actions

//Reducer
export const DialogReducer = DialogSlice.reducer;