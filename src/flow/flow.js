import { useEffect, useMemo, useRef, useState } from "react";
import Station from './utils/station'
import ReactFlow, { ControlButton, Controls, ReactFlowProvider } from "reactflow"
import Line from "./utils/line";
import 'reactflow/dist/style.css';
import { SiMetrodeparis } from "react-icons/si";
import { useDispatch, useSelector } from "react-redux";
import { addTrainToLine, buildLine, GAME_STATE, nextFrame, nextRound, restart } from "../state/slice";
import { selectLifeTimeLeft, selectDay, selectEdges, selectLinesColors, selectNodes, selectPassengers, selectGameState, selectTimeLeft } from "../state/selectors";
import { areaHeight, areaWidth } from "../config";

const proOptions = { hideAttribution: true };

export const nextFrameMs = 20;
export const heatFrameMs = 50;

export const Flow = () => {
    const dispatch = useDispatch();
    const [simulation, setSimulation] = useState(true)
    const passengers = useSelector(selectPassengers);
    const iLifeTimeLeft = useSelector(selectLifeTimeLeft);
    const gameState = useSelector(selectGameState);
    const edges = useSelector(selectEdges);
    const nodes = useSelector(selectNodes);
    const round = useSelector(selectDay);
    const timeLeft = useSelector(selectTimeLeft);
    
    const linesColors = useSelector(selectLinesColors);
    const gameLoopTimer = useRef();

    useEffect(() => {
        if (gameState === GAME_STATE.STARTED){
            gameLoopTimer.current = setInterval(() => {
                if (simulation){
                    dispatch(nextFrame(nextFrameMs));
                }
            }, nextFrameMs);
            return () => clearInterval(gameLoopTimer.current);
        }
    }, [gameState, simulation, dispatch]);

    const nodeTypes = useMemo(() => ({ station: Station }), []);
    const edgeTypes = useMemo(() => ({ line: Line }), []);

    const start = async () => {
        dispatch(nextRound());
    }

    const restartButton = async () => {
        if (gameState === GAME_STATE.WAITING_FOR_NEXT_ROUND){
            if (!window.confirm("Are you sure you want to restart the game?")){
                return;
            }
        }
        dispatch(restart())
    }

    return (
        <div style={{
            left:0,
            top:0,
          }}>
            <h2>Day {round}</h2>
            <p 
                    style={{margin:"5px"}}>{gameState === GAME_STATE.STARTED
            ? 
            <>{Math.floor(timeLeft)}s time left</>
                :
                <>
                    {
                        gameState === GAME_STATE.NOT_STARTED || gameState === GAME_STATE.WAITING_FOR_NEXT_ROUND ?  <button onClick={event => {start()}}>New Day</button> : <></>
                    }
                    {
                        gameState === GAME_STATE.GAME_OVER || gameState === GAME_STATE.WAITING_FOR_NEXT_ROUND ? <button onClick={event => {restartButton()}}>Restart</button> : <></>
                    }
                    
                </>
                }
            <>
                {
                    !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ?
                    <button onClick={event => {setSimulation(s => s = !s)}}>Simulation {simulation ? <>OFF</> : <>ON</>}</button>
                    : <></>
                }
            </>
            </p>
            <div
                style={{
                    width: "98vw",
                    height: "74vh",
                    cursor: "default",
                }}
            >
                <ReactFlowProvider
                >
                    <ReactFlow
                        style={{
                        border: "black 2px solid",
                        background:"white",
                        cursor: "default",
                    }}
                        nodeTypes={nodeTypes}
                        edgeTypes={edgeTypes}
                        proOptions={proOptions}
                        nodes={nodes} 
                        edges={edges}
                        connectionMode={"loose"}
                        onConnect={(e) => dispatch(buildLine(e))}
                        defaultViewport={{x:areaWidth*3, y:areaHeight*3, zoom: 1}}
                        onEdgeDoubleClick={(_, line) => dispatch(addTrainToLine(line))}
                        disableKeyboardA11y={false}
                        deleteKeyCode={null}
                    >
                        <strong style={{
                            margin:"50px",
                        }}>
                        Passengers: {passengers}
                        </strong>
                        <strong
                            style={{
                                color: (iLifeTimeLeft < 10 ? "red" : "black")
                            }}
                        >
                        Life left: {iLifeTimeLeft > 0 ? (iLifeTimeLeft).toFixed(2) : "0.00"}s
                        </strong>
                    <Controls 
                        showZoom={false}
                        showFitView={false}
                        showInteractive={false}
                        position="top"
                    >
                        {
                            linesColors.includes("yellow") ?
                            <ControlButton style={{background:"white"}}>
                                <SiMetrodeparis style={
                                    {
                                        color:"yellow",
                                        background:"white",
                                    }
                                    }/>
                            </ControlButton>
                            :
                            <></>
                        }
                        {
                            linesColors.includes("red") ?
                            <ControlButton style={{background:"white"}}>
                                <SiMetrodeparis style={
                                    {
                                        color:"red",
                                        background:"white",
                                    }
                                    }/>
                            </ControlButton>
                            :
                            <></>
                        }
                        {
                            linesColors.includes("blue") ?
                            <ControlButton style={{background:"white"}}>
                                <SiMetrodeparis style={
                                    {
                                        color:"blue",
                                        background:"white",
                                    }
                                    }/>
                            </ControlButton>
                            :
                            <></>
                        }
                        {
                            linesColors.includes("green") ?
                            <ControlButton style={{background:"white"}}>
                                <SiMetrodeparis style={
                                    {
                                        color:"green",
                                        background:"white",
                                    }
                                    }/>
                            </ControlButton>
                            :
                            <></>
                        }
                        {
                            linesColors.includes("pink") ?
                            <ControlButton style={{background:"white"}}>
                                <SiMetrodeparis style={
                                    {
                                        color:"pink",
                                        background:"white",
                                    }
                                    }/>
                            </ControlButton>
                            :
                            <></>
                        }
                        {
                            linesColors.includes("black") ?
                            <ControlButton style={{background:"white"}}>
                                <SiMetrodeparis style={
                                    {
                                        color:"black",
                                        background:"white",
                                    }
                                    }/>
                            </ControlButton>
                            :
                            <></>
                        }
                        {
                            linesColors.includes("orange") ?
                            <ControlButton style={{background:"white"}}>
                                <SiMetrodeparis style={
                                    {
                                        color:"orange",
                                        background:"white",
                                    }
                                    }/>
                            </ControlButton>
                            :
                            <></>
                        }
                    </Controls>
                    </ReactFlow>
                </ReactFlowProvider>
            </div>
        </div>
    )
}