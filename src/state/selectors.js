import { createSelector } from "@reduxjs/toolkit";
import { pace } from "../config";
import { GAME_STATE } from "./slice";

export const selectNodes = (state) => state.game.stations; // TO BE REPLACED SOLELY BY selectStations
export const selectLifeTimeLeft = (state) => state.game.lifeTimeLeft;
export const selectHeated = (state) => state.game.bHeated;
export const selectPassengers = (state) => state.game.passengers;
export const selectStations = (state) => state.game.stations;
export const selectGameState = (state) => state.game.gameState;
export const selectTimeLeft = (state) => state.game.time;
export const selectStation = createSelector(
    [
        selectStations,
        ( state, id ) => id
    ], (stations, id) => {
        return stations.find(station => station.id === id);
    }
)


export const selectEdges = (state) => state.game.lines;
export const selectDay = (state) => state.game.round;
export const selectTrains = (state) => state.game.trains;
export const calculateRoundTime = (state) => state.game.futureStations.length * pace + 1;
export const iFutureStationCount = (state) => state.game.futureStations.length;

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

export const selectLinesColors = createSelector(
    [
        selectEdges,
        ( state, id ) => id
    ], (lines, id) => {
        const colors = [];
        lines.forEach(line => {
            if (!colors.includes(line.data.color)){
                colors.push(line.data.color);
            }
        });
        return colors;
    }
)

// IsGameRunning

export const Game__IsRunning = (state) => state.game.gameState == GAME_STATE.STARTED;