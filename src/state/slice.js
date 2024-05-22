import { createSlice } from "@reduxjs/toolkit";
import { addEdge, applyEdgeChanges } from "reactflow";

export const areaWidth = 200;
export const areaHeight = 200;
export const fixedStationsPerRound = 9;

const gameSlice = createSlice({
    name: "game",
    initialState: {
        stations: [], 
        lines: [],
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
    },
    reducers: {
        mutateGame: (state, {payload}) => {
            return {...state, ...payload}
        },
        onEdgesChange: (state, {payload}) => {
            state.lines = applyEdgeChanges(payload, state.lines);
        },
        buildLine: (state, {payload}) => {
            if (payload.source === payload.target){
                return;
            }
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
                                trainPos: [],
                            }},
                            state.lines
                        );
                    state.trains = [...state.trains, {
                        id: state.trains.length,
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
                    alert("You don't have any unused train lines!")
                }
            } else {
                state.lines = addEdge({
                    ...payload,
                    sourceHandle: "station",
                    targetHandle: "station",
                    type: "line",
                    data: {
                        color: payload.sourceHandle,
                        trainPos: [],
                    },},
                    state.lines
                )
            }
        },
        revealStation: (state, {payload}) => {
            if (state.futureStations.length > 0){
                const newStation = {
                    id: `${state.stations.length + 1}`,
                    type: "station",
                    ...state.futureStations.pop(),
                }
                state.stations = [...state.stations, newStation]
            }
        },
        shoveTrain: (state, {payload:{sourceX, sourceY, targetX, targetY, id}}) => {
            const train = state.trains.find(train => train.id === id)
            const distancePerTick = train.traits.speed / Math.sqrt(((sourceX - targetX)**2 + (sourceY - targetY)**2));
            if (train.currentPos.distanceFinished < train.currentPos.target){
                train.currentPos.distanceFinished += distancePerTick;
                if (train.currentPos.distanceFinished >= 1){
                    train.currentPos.type="station";
                }
            } else {
                train.currentPos.distanceFinished -= distancePerTick;
                if (train.currentPos.distanceFinished <= 0.0){
                    train.currentPos.type="station";
                }
            }
        },
        trainEntersLineStart: (state, {payload}) => {
            const section = state.lines.find(line => line.id === payload.id)
            section.data.trainPos = [...section.data.trainPos, {
                id: payload.train_id,
                distance:payload.distance,
            }]

        },
        trainMoves: (state, {payload:{sourceX, sourceY, targetX, targetY, train_id, line_id}}) => {
            const train = state.trains.find(train => train.id === train_id)
            const section = state.lines.find(line => line.id === line_id)
            const distance = train.traits.speed / Math.sqrt(((sourceX - targetX)**2 + (sourceY - targetY)**2));
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
            //Handle Passangers...
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

        }, 
    },
    extraReducers: builder => {},
})

//Actions
export const { mutateGame, onEdgesChange, buildLine, revealStation, shoveTrain, trainEntersLineStart, trainMoves, trainEntersStation } = gameSlice.actions


//Reducer
export const gameReducer = gameSlice.reducer;