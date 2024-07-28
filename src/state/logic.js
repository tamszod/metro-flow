import { pace, placeIndicators, roundStartDelay } from "../config";
import { nextRound } from "./slice";

export const nextGrids = (gridIndex) => {
    const grids = [];
    for(let index = -gridIndex+1; index < gridIndex; ++index){
        grids.push({x:index, y:gridIndex});
        grids.push({x:index, y:-gridIndex});
        grids.push({x:gridIndex, y:index});
        grids.push({x:-gridIndex, y:index});
    }
    grids.push({x:gridIndex, y:-gridIndex});
    grids.push({x:gridIndex, y:gridIndex});
    grids.push({x:-gridIndex, y:-gridIndex});
    return grids;
}

export const formatStationName = (raw) => {
    return `${Math.random() < 0.2 ? "St. " : ""}${Math.random() < 0.7 ? `${raw.first} ` : ""}${raw.last}${Math.random() < 0.15 ? "" : ` ${placeIndicators[Math.floor(Math.random(placeIndicators.length)*placeIndicators.length)]}`}`;
}

export const randomizeDestinationForPassenger = (blackListedStationIndex, stations) => {
    const index = Math.floor(Math.random(stations.length-1)*(stations.length-1));
    if (index < blackListedStationIndex){
        return {
            destinationId : stations[index].id,
            color: stations[index].data.color,
        }
    }
    return {
        destinationId : stations[index+1].id,
        color: stations[index+1].data.color,
    }
}

export const nextRoundAction = (setTime) => (dispatch, getState) => {
    dispatch(nextRound()); 
    setTime(getState().game.futureStations.length*pace+roundStartDelay);
}

export const randomNumber = (a, b) => {
    const min = Math.ceil(a);
    const max = Math.floor(b+1);
    return Math.floor(Math.random() * (max - min) + min);
}


export const sGenerateRandomRGBColor = () => {
    return "rgb("+randomNumber(0,255)+","+randomNumber(0,255)+","+randomNumber(0,255)+")"
}

