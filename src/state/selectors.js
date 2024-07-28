import { createSelector } from "@reduxjs/toolkit";
import { pace } from "../config";

export const selectNodes = (state) => state.game.stations; // TO BE REPLACED SOLELY BY selectStations

export const selectPassengers = (state) => state.game.passengers;
export const selectStations = (state) => state.game.stations;
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

export const selectWaitingPassengersAtStation = createSelector(
    [
        (state, id) => selectStation(state, id),
        selectStations,

    ], (station, stations) => {
        const waitingPassengersByStation = {};
        station?.data.passengers.forEach(passenger => {
            if (passenger.destinationId in waitingPassengersByStation){
                waitingPassengersByStation[passenger.destinationId].count += 1;
            } else {
                waitingPassengersByStation[passenger.destinationId] = {
                    count : 1,
                    name : !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? passenger.destinationId : stations.find(station => station.id === passenger.destinationId).data.name,
                }
            }
        });
        return Object.keys(waitingPassengersByStation).length > 0 ? waitingPassengersByStation : false;
    }
)