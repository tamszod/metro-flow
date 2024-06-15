import axios from "axios";
import { areaHeight, areaWidth, bonusStationsMultiplier, cut, pace, placeHolderNames, placeIndicators, roundStartDelay, stationsPerRound } from "../config";
import { mutateGame } from "./slice";
import { bfs } from "./utilities/path";
import { hashObject } from "./utilities/hash";

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

const randomizeDestinationForPassenger = (blackListedStationIndex, stations) => {
    const index = Math.floor(Math.random(stations.length-1)*(stations.length-1));
    return index < blackListedStationIndex ? stations[index].id : stations[index+1].id;
}

export const startRoundAction = async (setTime) => async (dispatch, getState) => {
    const game = getState().game;
    const grids = JSON.parse(JSON.stringify(game.grids));
    let gridIndex = game.gridIndex;
    const stations = JSON.parse(JSON.stringify(game.stations));
    const futureStations = JSON.parse(JSON.stringify(game.futureStations));
    const transportGraph = game.transportGraph;
    let round = game.round+1;

    let stationCount = 0
    const totalStations = stationsPerRound+Math.floor(round/bonusStationsMultiplier);
    while (futureStations.length < totalStations){

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
        let stationsNames = [];
        try {
            const { data:{results} } = await axios.get(`https://randomuser.me/api/?inc=name&nat=gb,us,es&results=${stationCount}`);
            stationsNames = results;
        } catch (error){
            stationsNames = futureStations.map(station => {
                return {
                    name : {
                        first: placeHolderNames[Math.floor(Math.random(placeHolderNames.length)*placeHolderNames.length)],
                        last: placeHolderNames[Math.floor(Math.random(placeHolderNames.length)*placeHolderNames.length)],
                    }
                }
            })
        }
        futureStations.map(station => {
            station.data = {
                name:formatStationName(stationsNames.pop().name),
                lifetime: 0,
                passengers: [],
            }
            return station;
        });
    }

    stations.map((station, stationIndex) => {
        station.data.lifetime += 1;
        station.data.passengers = [...station.data.passengers, ...Array(station.data.lifetime).fill({}).map(passenger => {
            const destinationId = randomizeDestinationForPassenger(stationIndex, stations);
            const travelPlan = bfs(transportGraph, destinationId, station.id);
            const hash = hashObject(transportGraph);
            return {
                destinationId,
                travelPlan,
                hash,
            }
        })]
        return station;
    })

    setTime(futureStations.length*pace+roundStartDelay);

    dispatch(mutateGame({grids, gridIndex, futureStations, round, stations}));
}