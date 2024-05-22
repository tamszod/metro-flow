import { createSelector } from "@reduxjs/toolkit";
import { pace } from "../config";

export const selectNodes = (state) => state.game.stations;
export const selectEdges = (state) => state.game.lines;
export const selectTrains = (state) => state.game.trains;
export const calculateRoundTime = (state) => state.game.futureStations.length * pace + 1;

export const selectSectionTrains = createSelector(
    [
        selectTrains,
        ( state, id ) => id
    ], (trains, id) => {
        return trains.filter(train => train.currentPos.type === "line" && train.currentPos.id === id);
    }
)

export const selectStationTrains = createSelector(
    [
        selectTrains,
        ( state, id ) => id
    ], (trains, id) => {
        return trains.filter(train => train.currentPos.type === "station" && train.currentPos.id === id);
    }
)