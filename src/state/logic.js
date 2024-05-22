import axios from "axios";
import { areaHeight, areaWidth, cut, pace, placeIndicators, roundStartDelay, stationsPerRound } from "../config";
import { mutateGame } from "./slice";

const generateNextGrids = (gridIndex, grids) => {
    for(let index = -gridIndex+1; index < gridIndex; ++index){
        grids.push({x:index, y:gridIndex});
        grids.push({x:index, y:-gridIndex});
        grids.push({x:gridIndex, y:index});
        grids.push({x:-gridIndex, y:index});
    }
    grids.push({x:gridIndex, y:-gridIndex});
    grids.push({x:gridIndex, y:gridIndex});
    grids.push({x:-gridIndex, y:-gridIndex});
}

const formatStationName = (raw) => {
    return `${Math.random() < 0.2 ? "St. " : ""}${Math.random() < 0.7 ? `${raw.first} ` : ""}${raw.last}${Math.random() < 0.15 ? "" : ` ${placeIndicators[Math.floor(Math.random(placeIndicators.length)*placeIndicators.length)]}`}`;
}

export const startRoundAction = async (setTime) => async (dispatch, getState) => {
    const game = getState().game;
    const grids = JSON.parse(JSON.stringify(game.grids));
    let gridIndex = game.gridIndex;
    const futureStations = JSON.parse(JSON.stringify(game.futureStations));

    let stationCount = 0
    while (futureStations.length < stationsPerRound){

        if (grids.length < gridIndex+3){
            generateNextGrids(++gridIndex, grids)
        }

        const grid = grids.splice((Math.floor(Math.random(grids.length)*grids.length)), 1)[0];
        const minX = grid.x * areaWidth + cut;
        const maxX= grid.x * areaWidth + areaWidth - cut;
        const minY = grid.y * areaHeight + cut;
        const maxY = grid.y * areaHeight + areaHeight - cut;

        const position = {
            x: Math.floor(Math.random() * (maxX - minX) + minX),
            y: Math.floor(Math.random() * (maxY - minY) + minY),
        }
        futureStations.push({position:position});
        stationCount += 1;
    }

    if (stationCount > 0){
        try {
            const { data:{results} } = await axios.get(`https://randomuser.me/api/?inc=name&results=${stationCount}`);
            futureStations.map(station => {
                station.data = {name:formatStationName(results.pop().name)}
                return station;
            });
        } catch (error){
            futureStations.map(station => {
                station.data = {name:"Station At " + station.position.x + " " + station.position.y}
                return station;
            });
        }
    }

    setTime(futureStations.length*pace+roundStartDelay);

    dispatch(mutateGame({grids, gridIndex, futureStations}));
}