import { createSlice } from "@reduxjs/toolkit";
import { addEdge } from "reactflow";
import { bfs } from "./utilities/path";
import { hashObject } from "./utilities/hash";
import { formatStationName, nextGrids, randomizeDestinationForPassenger, sGenerateRandomRGBColor } from "./logic";
import { areaHeight, areaWidth, bonusStationsMultiplier, cut, pace, placeHolderNames, roundStartDelay, STARTING_HEAT_TIMER, stationsPerRound } from "../config";

export const fixedStationsPerRound = 9;

export const GAME_STATE = {
    NOT_STARTED : 0,
    STARTED : 1,
    WAITING_FOR_NEXT_ROUND: 2,
    GAME_OVER : 3,
}

const initialState = {
    stations: [], 
    lines: [],
    transportGraph: {},
    transportGraphHash: "null",
    grids: [ 
        {
            x:0,
            y:0
        }
    ],
    gridIndex: 0,
    futureStations: [],
    trains: [],
    round: 0,
    passengers : 0,
    lifeTimeLeft: STARTING_HEAT_TIMER,
    time: 0,
    maxTime: 0,
    gameState : GAME_STATE.NOT_STARTED,
    bHeated: false,
}

const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        mutateGame: (state, {payload}) => {
            return {...state, ...payload};
        },
        restart: (state, {payload}) => {
            return initialState;
        },
        deleteLine: (state, {payload:id}) => {
            let i = 0;
            const lineIndex = state.lines.findIndex(line => line.id === id);
            const line = state.lines[lineIndex];
            while ( i < state.trains.length && 
                ( state.trains[i].currentPos.type !== "line" || state.trains[i].currentPos.id !== id ) &&
                ( state.trains[i].currentPos.type !== "station" || (state.trains[i].currentPos.id !== line.source  && state.trains[i].currentPos.id !== line.target))
            ){
                i++;
            }
            if (i >= state.trains.length){
                state.transportGraph[line.source] = state.transportGraph[line.source].filter(edge => edge !== line.target);
                state.transportGraph[line.target] = state.transportGraph[line.target].filter(edge => edge !== line.source);
                state.transportGraphHash = hashObject(state.transportGraph);
                state.lines = [
                    ...state.lines.slice(0, lineIndex),
                    ...state.lines.slice(lineIndex + 1)
                ]
            } else {
                i = 0;
                while (i < state.lines.length && ( state.lines[i].data.color !== line.data.color || state.lines[i].id === id ) ){
                    i++;
                }
                if (i >= state.lines.length){
                    i = 0;
                    const train_ids = [];
                    while ( i < state.trains.length && ( state.trains[i].traits.color !== line.data.color || state.trains[i].data.passengers.length === 0 )){
                        if (state.trains[i].traits.color === line.data.color){
                            train_ids.push(state.trains[i].id);
                        }
                        i++;
                    }
                    if (i >= state.trains.length){
                        state.trains = state.trains.filter(train => !train_ids.includes(train.id));
                        state.transportGraph[line.source] = state.transportGraph[line.source].filter(edge => edge !== line.target);
                        state.transportGraph[line.target] = state.transportGraph[line.target].filter(edge => edge !== line.source);
                        state.transportGraphHash = hashObject(state.transportGraph);
                        state.lines = [
                            ...state.lines.slice(0, lineIndex),
                            ...state.lines.slice(lineIndex + 1)
                        ]
                    }
                }
            }
        },
        buildLine: (state, {payload}) => {
            if (state.gameState !== GAME_STATE.STARTED){
                return;
            }
            // Remove the last section of a line if it is connectected to itself.
            if (payload.source === payload.target){
                const lineToDelete = state.lines.find(line => line.data.color === payload.sourceHandle && (line.target === payload.source || line.source === payload.source));
                lineToDelete.data.isDeleting = true;
                return;
            }
            //
            if (payload.sourceHandle === "station"){
                const lines = ["yellow", "red", "blue", "green", "pink", "black", "orange"]
                state.lines.forEach(edge => {
                    const index = lines.findIndex(line => line === edge.data.color);
                    if (index !== -1){
                        lines.splice(index,1);
                    }
                })
                if (lines.length > 0){
                    const lineId = `${state.lines.length}`;
                    const sourcePos = state.stations.find(station => station.id===payload.source).position;
                    const targetPos = state.stations.find(station => station.id===payload.target).position;
                    state.lines = addEdge({
                            ...payload,
                            id: lineId,
                            sourceHandle: "station",
                            targetHandle: "station",
                            type: "line",
                            data: {
                                color: lines[0],
                                isDeleting: false,
                                sourcePos,
                                targetPos,
                            }},
                            state.lines
                        );
                    state.trains = [...state.trains, {
                        id: state.trains.length,
                        data : {
                            passengers : [],
                        },
                        currentPos: {
                            id: lineId,  // 
                            type: "line", // Train position in the system. (line or station)
                            data : {
                                distance: 0.0, // Train distance made on the line.
                                source: 0.0, // The train position on the line section.
                                target: 1.0, // Train heading to this point of the line section.
                                translateDeg: 90-Math.atan2((targetPos.x-sourcePos.x),(targetPos.y-sourcePos.y))* (180 / Math.PI),
                            }
                        },
                        lastPos: {
                            type: "station",
                            id: payload.source,
                        },
                        traits: {
                            speed: 80, // km/hr
                            transferSpeed: 10,
                            capicity: 8,
                            color: lines[0],
                        },
                        passengers: [],
                    },
                ];
                } else {
                    alert("You don't have any unused train lines!");
                    return;
                }
            } else {
                if (state.lines.filter(line => (line.source === payload.source || 
                    line.source === payload.target || 
                    line.target === payload.target || 
                    line.target === payload.source) && line.data.color === payload.sourceHandle).length > 1){
                        alert("Circular line is not allowed!");
                        return;
                    }
                state.lines = addEdge({
                    ...payload,
                    sourceHandle: "station",
                    targetHandle: "station",
                    type: "line",
                    data: {
                        color: payload.sourceHandle,
                        isDeleting: false,
                        sourcePos: state.stations.find(station => station.id===payload.source).position,
                        targetPos: state.stations.find(station => station.id===payload.target).position,
                    },},
                    state.lines
                )
            }
            state.transportGraph[payload.source] = [...state.transportGraph[payload.source], payload.target];
            state.transportGraph[payload.target] = [...state.transportGraph[payload.target], payload.source];
            state.transportGraphHash = hashObject(state.transportGraph);
        },
        revealStation: (state, {payload}) => {
            if (state.futureStations.length > 0){
                const newStation = {
                    id: `${state.stations.length + 1}`,
                    type: "station",
                    ...state.futureStations.pop(),
                }
                state.stations = [...state.stations, newStation]
                state.transportGraph = {...state.transportGraph, [newStation.id] : []};
                state.transportGraphHash = hashObject(state.transportGraph);
            }
        },
        nextFrame: (state, {payload}) =>  {
            // Handle train actions
            state.trains = state.trains.map(train => {
                if (train.currentPos.type === "station"){
                    if (train.currentPos.delay > 0){
                        train.currentPos.delay -= 1;
                        return train;
                    } else {
                        train.currentPos.delay = train.traits.transferSpeed;
                    }
                    const station = state.stations.find(station => station.id === train.currentPos.id);
                    let lines = state.lines.filter(line => (line.source === station.id || line.target === station.id) && line.data.color === train.traits.color);
                    let line = null;
                    if (lines.length > 1 && lines[1].id !== train.lastPos.id){
                        line = lines[1];
                    } else {
                        line = lines[0];
                    }
                    let nextStationId = null;
                    nextStationId = line.source === station.id ? line.target : line.source;
                    let bPassangerTransfered = false;
                    let iPassenger = null;
                    let actionPassenger = null;
                    bPassangerTransfered = bPassangerTransfered || train.data.passengers.some((objPassenger, nI) => {
                        if (objPassenger.destinationId === station.id){
                            iPassenger = nI;
                            actionPassenger = "ARRIVED";
                            return true;
                        } else if(objPassenger.travelPlan[objPassenger.travelPlan.length-2] !== nextStationId) {
                            iPassenger = nI;
                            actionPassenger = "DISEMBARKED";
                            return true;
                        }
                        return false;
                    });
                    if (!bPassangerTransfered && train.data.passengers.length < train.traits.capicity){
                        station.data.passengers = station.data.passengers.map((objPassenger, nI) => {
                            if (bPassangerTransfered){
                                return objPassenger;
                            }
                            if (!!!objPassenger.travelPlan || objPassenger.hash !== state.transportGraphHash){ // (Re)create passenger travelPlan if outdated or nonexistent.
                                objPassenger.travelPlan = bfs(state.transportGraph, objPassenger.destinationId, station.id);
                                objPassenger.hash = state.transportGraphHash;
                            }
                            if (objPassenger.travelPlan && objPassenger.travelPlan[objPassenger.travelPlan.length-2] === nextStationId){ // Passenger boards train.
                                iPassenger = nI;
                                actionPassenger = "BOARDED";
                                bPassangerTransfered = true;
                            }
                            return objPassenger;
                        });
                    }
                    if (bPassangerTransfered){
                        if (actionPassenger === "ARRIVED"){
                            //console.log("ARRIVED"); 
                            state.passengers = state.passengers + 1;
                            train.data.passengers = [ 
                                ...train.data.passengers.slice(0, iPassenger),
                                ...train.data.passengers.slice(iPassenger+1 )
                            ];
                        } 
                        else if (actionPassenger === "DISEMBARKED"){
                            //console.log("DISEMBARKED"); 
                            station.data.passengers = [...station.data.passengers, {...train.data.passengers[iPassenger]}];
                            train.data.passengers = [
                                ...train.data.passengers.slice(0, iPassenger),
                                ...train.data.passengers.slice(iPassenger+1 )
                            ];
                        }
                        else if (actionPassenger === "BOARDED"){
                            //console.log("BOARDED"); 
                            train.data.passengers = [...train.data.passengers, {...station.data.passengers[iPassenger]}];
                            station.data.passengers = [
                                ...station.data.passengers.slice(0, iPassenger),
                                ...station.data.passengers.slice(iPassenger+1)
                            ];
                        } else {
                            //console.log("UNKNOWN"); 
                        }
                        return train;
                    }
                    train.data.passengers = train.data.passengers.map(passenger => {
                        passenger.travelPlan = passenger.travelPlan.slice(0, passenger.travelPlan.length-1);
                        return passenger;
                    })

                    train.lastPos = {...train.currentPos};
                    train.currentPos.type = "line";
                    train.currentPos.id = line.id;
                    if (line.source === station.id){
                        train.currentPos.data.source = 0.0;
                        train.currentPos.data.target = 1.0;
                    } else {
                        train.currentPos.data.source = 1.0;
                        train.currentPos.data.target = 0.0;
                    }
                    train.currentPos.data.translateDeg = 90-Math.atan2((line.data.targetPos.x-line.data.sourcePos.x),(line.data.targetPos.y-line.data.sourcePos.y))* (180 / Math.PI)
                    train.currentPos.data.distance = train.currentPos.data.source;
                } else if (train.currentPos.type === "line"){
                    const line = state.lines.find(line => line.id === train.currentPos.id);
                    const distance = (train.traits.speed/100) / Math.sqrt(((line.data.sourcePos.x - line.data.targetPos.x)**2 + (line.data.sourcePos.y - line.data.targetPos.y)**2));
                    if (train.currentPos.data.source < train.currentPos.data.target){
                        train.currentPos.data.distance += distance;
                        if (train.currentPos.data.distance >= 1.0){
                            train.lastPos = {...train.currentPos};
                            train.currentPos.type="station";
                            train.currentPos.id=line.target;
                            train.currentPos.data.delay = train.traits.transferSpeed;
                        }
                    } else {
                        train.currentPos.data.distance -= distance;
                        if (train.currentPos.data.distance <= 0.0){
                            train.lastPos = {...train.currentPos};
                            train.currentPos.type="station";
                            train.currentPos.id=line.source;
                            train.currentPos.data.delay = train.traits.transferSpeed;
                        }
                    }
                }
                return train;
            });
            // Reveal stations
            if (
                (state.round > 1 && (
                    (((state.maxTime-roundStartDelay) / pace) - state.futureStations.length) 
                    < 
                    Math.floor(state.time / pace))
                ) 
                || 
                (state.round === 1 && (
                    (((state.maxTime-roundStartDelay) / 2) - state.futureStations.length) 
                    < 
                    state.time / 2))
                )
            {
                if (state.futureStations.length > 0){
                    const newStation = {
                        id: `${state.stations.length + 1}`,
                        type: "station",
                        ...state.futureStations.pop(),
                    }
                    state.stations = [...state.stations, newStation]
                    state.transportGraph = {...state.transportGraph, [newStation.id] : []};
                    state.transportGraphHash = hashObject(state.transportGraph);
                }
            }
            // Check if too many passengers are waiting!
            state.bHeated = false;
            if (state.stations.find(station => station.data.passengers.length > station.data.passengerLimit )){
                state.bHeated = true;
            }
            if (state.bHeated){
                state.lifeTimeLeft -= payload/1000;
                if (state.lifeTimeLeft < 0-payload/1000){
                    state.gameState = GAME_STATE.GAME_OVER;
                }
            }
            //Adjust game time
            state.time = (state.time + payload/1000)//.toFixed(4);
            if (state.maxTime < state.time){
                state.gameState = GAME_STATE.WAITING_FOR_NEXT_ROUND;
            }
        },
        nextRound: (state) => {
            // Adjust round count
            state.round = state.round + 1;

            // Generate new stations to spawn
            let stationCount = 0
            const totalStations = stationsPerRound+Math.floor(state.round/bonusStationsMultiplier) + state.futureStations.length;
            const newFutureStations = [];
            while (newFutureStations.length < totalStations){
                if (state.grids.length < state.gridIndex+3){
                    state.gridIndex = state.gridIndex + 1;
                    state.grids = [...state.grids, ...nextGrids(state.gridIndex)]
                }

                const grid = state.grids.splice((Math.floor(Math.random(state.grids.length)*state.grids.length)), 1)[0];
                const minX = grid.x * areaWidth + cut;
                const maxX= grid.x * areaWidth + areaWidth - cut;
                const minY = grid.y * areaHeight + cut;
                const maxY = grid.y * areaHeight + areaHeight - cut;

                const position = {
                    x: Math.floor(Math.random() * (maxX - minX) + minX),
                    y: Math.floor(Math.random() * (maxY - minY) + minY),
                }
                newFutureStations.push({position:position});
                stationCount += 1;
            }
            if (stationCount > 0){
                let stationsNames = [];
                //try {
                //   const { data:{results} } = await axios.get(`https://randomuser.me/api/?inc=name&nat=gb,us,es&results=${stationCount}`);
                //    stationsNames = results;
                //} catch (error){
                    stationsNames = newFutureStations.map(station => {
                        return {
                            name : {
                                first: placeHolderNames[Math.floor(Math.random(placeHolderNames.length)*placeHolderNames.length)],
                                last: placeHolderNames[Math.floor(Math.random(placeHolderNames.length)*placeHolderNames.length)],
                            }
                        }
                    })
                //}
                newFutureStations.map(station => {
                    station.data = {
                        name:formatStationName(stationsNames.pop().name),
                        lifetime: 0,
                        color: sGenerateRandomRGBColor(),
                        passengerLimit: 10,
                        passengers: [],
                    }
                    return station;
                });
            }
            state.futureStations = [...state.futureStations, ...newFutureStations];

            // Generate new passengers
            state.stations = state.stations.map((station, stationIndex) => {
                station.data.lifetime += 1;
                station.data.passengers = [...station.data.passengers, ...Array(station.data.lifetime < 3 ? station.data.lifetime : 3 ).fill({}).map(passenger => {
                    const {destinationId, color} = randomizeDestinationForPassenger(stationIndex, state.stations);
                    const travelPlan = bfs(state.transportGraph, destinationId, station.id);
                    const hash = hashObject(state.transportGraph);
                    return {
                        destinationId,
                        travelPlan,
                        hash,
                        color,
                    }
                })]
                return station;
            });

            // Set game time
            if (state.round > 1){
                state.maxTime = state.futureStations.length*pace+roundStartDelay;
            } else {
                state.maxTime = state.futureStations.length+roundStartDelay*2;
            }
            state.time = 0;
            // Set game state
            state.gameState = GAME_STATE.STARTED;
        },
        addTrainToLine: (state, {payload}) => {
            const line = state.lines.find(objLine => objLine.id === payload.id);
            console.log(payload)
            const lines = state.lines.filter(objLine => objLine.data.color === line.data.color);
            const trains = state.trains.filter(objTrain => objTrain.traits.color === line.data.color);
            if (Math.floor(lines.length / 10) < trains.length){
                alert("You have reached the maximum trains you can add to this line!");
                return;
            }
            state.trains = [
                ...state.trains, 
                {
                    id: state.trains.length,
                    data : {
                        passengers : [],
                    },
                    currentPos: {
                        id: line.id,  // 
                        type: "line", // Train position in the system. (line or station)
                        data : {
                            distance: 0.0, // Train distance made on the line.
                            source: 0.0, // The train position on the line section.
                            target: 1.0, // Train heading to this point of the line section.
                            translateDeg: 90-Math.atan2((line.data.targetPos.x-line.data.sourcePos.x),(line.data.targetPos.y-line.data.sourcePos.y))* (180 / Math.PI),
                        }
                    },
                    lastPos: {
                        type: "station",
                        id: payload.source,
                    },
                    traits: {
                        speed: 80, // unit/second
                        transferSpeed: 10,
                        capicity: 8,
                        color: line.data.color,
                    },
                },
            ];
        },
        heat: (state, {payload}) => {
            
        },
    },
    extraReducers: builder => {},
})

//Actions
export const { restart, mutateGame, buildLine, nextRound, deleteLine, nextFrame, addTrainToLine} = gameSlice.actions

//Reducer
export const gameReducer = gameSlice.reducer;