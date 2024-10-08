import { createSelector } from "@reduxjs/toolkit";
import { pace, STARTING_HEAT_TIMER } from "../config";
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

export const Game__IsRunning = (state) => state.game.gameState === GAME_STATE.STARTED;

// Timers selector

export const Game__TimeProgress = (state) => state.game.maxTime ? (state.game.time/state.game.maxTime) : 0;
export const Game__HeatTimeProgress = (state) => state.game.lifeTimeLeft / STARTING_HEAT_TIMER;


// Heat
export const Game_IsHeated = (state) => state.game.bHeated;



// Heat
export const Game__IsSimulated = (state) => state.game.simulated;