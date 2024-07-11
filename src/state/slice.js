import { createSlice } from "@reduxjs/toolkit";
import { addEdge, applyEdgeChanges } from "reactflow";
import { bfs } from "./utilities/path";
import { hashObject } from "./utilities/hash";
import { formatStationName, nextGrids, randomizeDestinationForPassenger } from "./logic";
import { areaHeight, areaWidth, bonusStationsMultiplier, cut, placeHolderNames, stationsPerRound } from "../config";

export const fixedStationsPerRound = 9;

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
            while ( i < state.trains.length && ( state.trains[i].currentPos.type !== "line" || state.trains[i].currentPos.id !== id )){
                i++;
            }
            const lineIndex = state.lines.findIndex(line => line.id === id);
            const line = state.lines[lineIndex];
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
        onEdgesChange: (state, {payload}) => {
            const events = []
            let trainsToDelete = [] 
            payload.forEach( event => {
                if (event.type === "remove"){
                    const line = state.lines.find(line => line.id === event.id)
                    const connections = state.lines.filter( conn => ((
                        line.source === conn.source || 
                        line.source === conn.target || 
                        line.target === conn.target || 
                        line.target === conn.source) && line.data.color === conn.data.color && line.id !== conn.id
                    ))
                    if (connections.length === 1 && line.data.trainPos.length === 0){
                        events.push(event);
                    } else if (connections.length === 0){
                        trainsToDelete = [...trainsToDelete, ...line.data.trainPos.map(train => train.id)];
                        events.push(event);
                    } else if (connections.length === 2) {
                        alert("You can't delete sections from the middle of the line!")
                    }
                } else {
                    events.push(event);
                }
            })
            if (events.length > 0){
                events.forEach(event => {
                    if (event.type === "remove"){
                        const line = state.lines.find(line => line.id === event.id);
                        state.transportGraph[line.source] = state.transportGraph[line.source].filter(edge => edge !== line.target);
                        state.transportGraph[line.target] = state.transportGraph[line.target].filter(edge => edge !== line.source);
                        state.transportGraphHash = hashObject(state.transportGraph);
                    }
                })
                state.lines = applyEdgeChanges(events, state.lines);
                state.trains = state.trains.filter(train => !trainsToDelete.includes(train.id))
            }

        },
        buildLine: (state, {payload}) => {
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
                    state.lines = addEdge({
                            ...payload,
                            id: lineId,
                            sourceHandle: "station",
                            targetHandle: "station",
                            type: "line",
                            data: {
                                color: lines[0],
                                isDeleting: false,
                                trainPos: [
                                    {
                                        id: state.trains.length,
                                        distance: 0.0,
                                    }
                                ],
                                sourcePos: state.stations.find(station => station.id===payload.source).position,
                                targetPos: state.stations.find(station => station.id===payload.target).position,
                            }},
                            state.lines
                        );
                    state.trains = [...state.trains, {
                        id: state.trains.length,
                        data : {
                            passengers : [],
                        },
                        currentPos: {
                            type: "line", // Train position in the system. (line or station)
                            id: lineId,  // «
                            source: 0.0, // The train position on the line section.
                            target: 1.0, // Train heading to this point of the line section.
                        },
                        lastPos: {
                            type: "station",
                            id: payload.source,
                        },
                        traits: {
                            speed: 1, // unit/second
                            color: lines[0],
                        },
                        passengers: [],
                    },
                ]
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
                        trainPos: [],
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
        trainEntersLine: (state, {payload}) => {
            const section = state.lines.find(line => line.id === payload.id)
            section.data.trainPos = [...section.data.trainPos, {
                id: payload.train_id,
                distance:payload.distance,
            }]

        },
        trainMoves: (state, {payload:{train_id}}) => {
            const train = state.trains.find(train => train.id === train_id);
            const section = state.lines.find(line => line.id === train.currentPos.id);
            const distance = train.traits.speed / Math.sqrt(((section.data.sourcePos.x - section.data.targetPos.x)**2 + (section.data.sourcePos.y - section.data.targetPos.y)**2));
            const trainPosOnSection = section.data.trainPos.find(train => train.id === train_id);
            if (train.currentPos.source < train.currentPos.target){
                trainPosOnSection.distance += distance;
                if (trainPosOnSection.distance >= 1){
                    train.lastPos.type=train.currentPos.type;
                    train.lastPos.id=train.currentPos.id;
                    train.currentPos.type="station";
                    train.currentPos.id=section.target;
                    section.data.trainPos = section.data.trainPos.filter(pos => pos.id!== train_id);
                }
            } else {
                trainPosOnSection.distance -= distance;
                if (trainPosOnSection.distance <= 0.0){
                    train.lastPos.type=train.currentPos.type;
                    train.lastPos.id=train.currentPos.id;
                    train.currentPos.type="station";
                    train.currentPos.id=section.source;
                    section.data.trainPos = section.data.trainPos.filter(pos => pos.id!== train_id);
                }
            }
        },
        trainEntersStation: (state, {payload:{id}}) => {
            const train = state.trains.find(train => train.id === id && train.currentPos.type === "station");
            const station = state.stations.find(station => station.id === train.currentPos.id);
            let lines = state.lines.filter(line => (line.source === station.id || line.target === station.id) && line.data.color === train.traits.color);
            if (lines.length > 1){
                lines = lines.filter(line => line.id !== train.lastPos.id);
            }
            train.lastPos.type=train.currentPos.type;
            train.lastPos.id=train.currentPos.id;
            train.currentPos.type="line";
            train.currentPos.id=lines[0].id;
            train.currentPos.source = lines[0].source === station.id ? 0.0 : 1.0;
            train.currentPos.target = train.currentPos.source === 0.0 ? 1.0 : 0.0;
            const nextStation = lines[0].source === station.id ? lines[0].target : lines[0].source;
            const passengers = [...train.data.passengers, ...station.data.passengers];
            train.data.passengers = [];
            station.data.passengers = [];
            passengers.forEach(passenger => {
                if (station.id === passenger.destinationId){
                    state.passengers += 1;
                    return;
                }
                if (passenger.travelPlan && passenger.travelPlan[passenger.travelPlan.length-2] === nextStation){
                    passenger.travelPlan = passenger.travelPlan.slice(0, passenger.travelPlan.length-1);
                    train.data.passengers.push(passenger);
                } else {
                    if (passenger.hash !== state.transportGraphHash){
                        passenger.travelPlan = bfs(state.transportGraph, passenger.destinationId, station.id);
                        passenger.hash = state.transportGraphHash;
                        if (passenger.travelPlan && passenger.travelPlan[passenger.travelPlan.length-2] === nextStation){
                            passenger.travelPlan = passenger.travelPlan.slice(0, passenger.travelPlan.length-1);
                            train.data.passengers.push(passenger);
                            return;
                        } 
                    }
                    station.data.passengers.push(passenger);
                }
            });
        },
        nextFrame: (state) =>  {
            //let trains = JSON.parse(JSON.stringify(game.trains));
            //let lines = JSON.parse(JSON.stringify(game.lines));
            //let stations = JSON.parse(JSON.stringify(game.stations));
            //let passengers = JSON.parse(JSON.stringify(game.passengers));
            //const transportGraph = game.transportGraph;
            //const transportGraphHash = game.transportGraphHash;
            state.trains = state.trains.map(train => {
                if (train.currentPos.type === "station"){
                    const station = state.stations.find(station => station.id === train.currentPos.id);
                    let lines = state.lines.filter(line => (line.source === station.id || line.target === station.id) && line.data.color === train.traits.color);
                    let line = null;
                    if (lines.length > 1 && lines[1].id !== train.lastPos.id){
                        line = lines[1];
                    } else {
                        line = lines[0];
                    }
                    train.lastPos.type = train.currentPos.type;
                    train.lastPos.id = train.currentPos.id;
                    train.currentPos.type = "line";
                    train.currentPos.id = line.id;
                    if (line.source === station.id){
                        train.currentPos.source = 0.0;
                        train.currentPos.target = 1.0;
                    } else {
                        train.currentPos.source = 1.0;
                        train.currentPos.target = 0.0;
                    }
                    line.data.trainPos = [...line.data.trainPos, {
                        id: train.id,
                        distance: train.currentPos.source,
                    }];
                    const nextStation = lines[0].source === station.id ? lines[0].target : lines[0].source;
                    const passengers = [...train.data.passengers, ...station.data.passengers];
                    train.data.passengers = [];
                    station.data.passengers = [];
                    passengers.forEach(passenger => {
                        if (station.id === passenger.destinationId){
                            state.passengers += 1;
                            return;
                        }
                        if (passenger.travelPlan && passenger.travelPlan[passenger.travelPlan.length-2] === nextStation){
                            passenger.travelPlan = passenger.travelPlan.slice(0, passenger.travelPlan.length-1);
                            train.data.passengers.push(passenger);
                        } else {
                            if (passenger.hash !== state.transportGraphHash){
                                passenger.travelPlan = bfs(state.transportGraph, passenger.destinationId, station.id);
                                passenger.hash = state.transportGraphHash;
                                if (passenger.travelPlan && passenger.travelPlan[passenger.travelPlan.length-2] === nextStation){
                                    passenger.travelPlan = passenger.travelPlan.slice(0, passenger.travelPlan.length-1);
                                    train.data.passengers.push(passenger);
                                    return;
                                } 
                            }
                            station.data.passengers.push(passenger);
                        }
                    });
                } else if (train.currentPos.type === "line"){
                    const line = state.lines.find(line => line.id === train.currentPos.id);
                    const distance = train.traits.speed / Math.sqrt(((line.data.sourcePos.x - line.data.targetPos.x)**2 + (line.data.sourcePos.y - line.data.targetPos.y)**2));
                    const trainPosOnSection = line.data.trainPos.find(pos => pos.id === train.id);
                    if (train.currentPos.source < train.currentPos.target){
                        trainPosOnSection.distance += distance;
                        if (trainPosOnSection.distance >= 1){
                            train.lastPos.type=train.currentPos.type;
                            train.lastPos.id=train.currentPos.id;
                            train.currentPos.type="station";
                            train.currentPos.id=line.target;
                            line.data.trainPos = line.data.trainPos.filter(pos => pos.id!== train.id);
                        }
                    } else {
                        trainPosOnSection.distance -= distance;
                        if (trainPosOnSection.distance <= 0.0){
                            train.lastPos.type=train.currentPos.type;
                            train.lastPos.id=train.currentPos.id;
                            train.currentPos.type="station";
                            train.currentPos.id=line.source;
                            line.data.trainPos = line.data.trainPos.filter(pos => pos.id!== train.id);
                        }
                    }
                }
                return train;
            });
        },
        nextRound: (state) => {

            state.round = state.round + 1;
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
                        passengers: [],
                    }
                    return station;
                });
            }

            state.futureStations = [...state.futureStations, ...newFutureStations];

            state.stations = state.stations.map((station, stationIndex) => {
                station.data.lifetime += 1;
                station.data.passengers = [...station.data.passengers, ...Array(station.data.lifetime).fill({}).map(passenger => {
                    const destinationId = randomizeDestinationForPassenger(stationIndex, state.stations);
                    console.log("bfs")
                    const travelPlan = bfs(state.transportGraph, destinationId, station.id);
                    console.log("bfs succeded")
                    const hash = hashObject(state.transportGraph);
                    return {
                        destinationId,
                        travelPlan,
                        hash,
                    }
                })]
                return station;
            });
        },
    },
    extraReducers: builder => {},
})

//Actions
export const { restart, mutateGame, onEdgesChange, buildLine, revealStation, nextRound,
    trainEntersLine, trainMoves, trainEntersStation, deleteLine, nextFrame } = gameSlice.actions


//Reducer
export const gameReducer = gameSlice.reducer;

/*{
            const {trains, lines, stations, passengers} = getNextFrame(state);
            state.trains = trains;
            state.lines = lines;
            state.stations = stations;
            state.passengers = passengers;
        }*/
       