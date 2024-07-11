import axios from "axios";
import { areaHeight, areaWidth, bonusStationsMultiplier, cut, pace, placeHolderNames, placeIndicators, roundStartDelay, stationsPerRound } from "../config";
import { mutateGame, nextFrame, nextRound } from "./slice";
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
        //try {
         //   const { data:{results} } = await axios.get(`https://randomuser.me/api/?inc=name&nat=gb,us,es&results=${stationCount}`);
        //    stationsNames = results;
        //} catch (error){
            stationsNames = futureStations.map(station => {
                return {
                    name : {
                        first: placeHolderNames[Math.floor(Math.random(placeHolderNames.length)*placeHolderNames.length)],
                        last: placeHolderNames[Math.floor(Math.random(placeHolderNames.length)*placeHolderNames.length)],
                    }
                }
            })
        //}
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

    console.log("dispatch")
    dispatch(mutateGame({grids, gridIndex, futureStations, round, stations}));
    console.log("dispatch succes")
}
/*
export const nextFrameAction = () => async (dispatch, getState) => {
    const game = getState().game;
    let trains = JSON.parse(JSON.stringify(game.trains));
    let lines = JSON.parse(JSON.stringify(game.lines));
    let stations = JSON.parse(JSON.stringify(game.stations));
    let passengers = JSON.parse(JSON.stringify(game.passengers));
    const transportGraph = game.transportGraph;
    const transportGraphHash = game.passengers;
    for (let ti = 0; ti < trains.length; ++ti ){
        if (trains[ti].currentPos.type === "station"){
            const si = stations.findIndex(station => station.id === trains[ti].currentPos.id);
            let li = null; // next line id
            for (let i = 0; i < lines.length; ++i){
                if ((lines[i].source === stations[si].id || lines[i].target === stations[si].id) && lines[i].data.color === trains[ti].traits.color){
                    if (li){
                        if (lines[i].id !== trains[ti].lastPos.id){
                            li = i;
                        }
                        break;
                    } else {
                        li = i;
                    }
                }
            }
            trains[ti].lastPos.type = trains[ti].currentPos.type;
            trains[ti].lastPos.id = trains[ti].currentPos.id;
            trains[ti].currentPos.type = "line";
            trains[ti].currentPos.id = li;
            if (lines[li].source === stations[si].id){
                trains[ti].currentPos.source = 0.0;
                trains[ti].currentPos.target = 1.0;
            } else {
                trains[ti].currentPos.source = 1.0;
                trains[ti].currentPos.target = 0.0;
            }
            lines[li].data.trainPos.push({
                id: ti,
                distance: trains[ti].currentPos.source,
            });
            const nsi = lines[li].source === stations[si].id ? lines[li].target : lines[li].source;
            const allPassengers = [...trains[ti].data.passengers, ...stations[si].data.passengers];
            trains[ti].data.passengers = [];
            stations[si].data.passengers = [];
            allPassengers.forEach(passenger => {
                if (stations[si].id === passenger.destinationId){
                    passengers += 1;
                    return;
                }
                if (passenger.travelPlan && passenger.travelPlan[passenger.travelPlan.length-2] === nsi){
                    passenger.travelPlan = passenger.travelPlan.slice(0, passenger.travelPlan.length-1);
                    trains[ti].data.passengers.push(passenger);
                } else {
                    if (passenger.hash !== transportGraphHash){
                        passenger.travelPlan = bfs(transportGraph, passenger.destinationId, stations[si].id);
                        passenger.hash = transportGraphHash;
                        if (passenger.travelPlan && passenger.travelPlan[passenger.travelPlan.length-2] === nsi){
                            passenger.travelPlan = passenger.travelPlan.slice(0, passenger.travelPlan.length-1);
                            trains[ti].data.passengers.push(passenger);
                            return;
                        } 
                    }
                    stations[si].data.passengers.push(passenger);
                    return;
                }
            });
        } else if (trains[ti].currentPos.type === "line"){
            const li = lines.findIndex(line => line.id === trains[ti].currentPos.id);
            const distance = trains[ti].traits.speed / Math.sqrt(((lines[li].data.sourcePos.x - lines[li].data.targetPos.x)**2 + (lines[li].data.sourcePos.y - lines[li].data.targetPos.y)**2));
            const lpi = lines[li].data.trainPos.findIndex(train => train.id === ti);
            if (trains[ti].currentPos.source < trains[ti].currentPos.target){
                lines[li].data.trainPos[lpi].distance += distance;
                if (lines[li].data.trainPos[lpi].distance >= 1.0){
                    trains[ti].lastPos.type = trains[ti].currentPos.type;
                    trains[ti].lastPos.id = trains[ti].currentPos.id;
                    trains[ti].currentPos.type = "station";
                    trains[ti].currentPos.id = lines[li].target;
                    lines[li].data.trainPos = lines[li].data.trainPos.splice(lpi, 1);
                }
            } else {
                lines[li].data.trainPos[lpi].distance -= distance;
                if (lines[li].data.trainPos[lpi].distance <= 0.0){
                    trains[ti].lastPos.type = trains[ti].currentPos.type;
                    trains[ti].lastPos.id = trains[ti].currentPos.id;
                    trains[ti].currentPos.type = "station";
                    trains[ti].currentPos.id = lines[li].source;
                    lines[li].data.trainPos = lines[li].data.trainPos.splice(lpi, 1);
                }
            }
        }
    }
    dispatch(mutateGame({trains, lines, stations, passengers}));
}
*/
export const nextRoundAction = (setTime) => (dispatch, getState) => {
    dispatch(nextRound()); 
    setTime(getState().game.futureStations.length*pace+roundStartDelay);
}