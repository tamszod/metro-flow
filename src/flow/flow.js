import { useEffect, useMemo, useRef, useState } from "react";
import Station from './utils/station'
import ReactFlow, { ControlButton, Controls, ReactFlowProvider } from "reactflow"
import Line from "./utils/line";
import 'reactflow/dist/style.css';
import { SiMetrodeparis } from "react-icons/si";
import { useDispatch, useSelector } from "react-redux";
import { nextRoundAction } from "../state/logic";
import { addTrainToLine, buildLine, nextFrame, restart, revealStation } from "../state/slice";
import { selectDay, selectEdges, selectLinesColors, selectNodes, selectPassengers } from "../state/selectors";
import { areaHeight, areaWidth, pace } from "../config";

const proOptions = { hideAttribution: true };

export const Flow = () => {
    const dispatch = useDispatch();
    const [simulation, setSimulation] = useState(true)
    const passengers = useSelector(selectPassengers);
    const edges = useSelector(selectEdges);
    const nodes = useSelector(selectNodes);
    const round = useSelector(selectDay);
    const linesColors = useSelector(selectLinesColors);
    const [started, setStarted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0)
    const intervalRef = useRef();
    const gameLoopTimer = useRef();

    useEffect(() => {
        if (started){
            if (timeLeft > 0){
                if (simulation){
                    if (timeLeft % pace === 0){
                        dispatch(revealStation());
                    }
                    intervalRef.current = setInterval(() => {
                        setTimeLeft(timeLeft - 1)
                    }, 1000);
                }
                return () => clearInterval(intervalRef.current);
            } 
        }
    }, [timeLeft, started, simulation, dispatch]);

    useEffect(() => {
        //if (started){
            gameLoopTimer.current = setInterval(() => {
                if (simulation){
                    dispatch(nextFrame());
                }
            }, 20);
            return () => clearInterval(gameLoopTimer.current);
        //}
    }, [timeLeft, started, simulation, dispatch]);

    useEffect(() => {
        if (timeLeft === 0){
            setStarted(false);
        }
    }, [timeLeft, setStarted]);

    const nodeTypes = useMemo(() => ({ station: Station }), []);
    const edgeTypes = useMemo(() => ({ line: Line }), []);

    const start = async () => {
        setStarted(true);
        dispatch(nextRoundAction(setTimeLeft));
    }

    return (
        <div style={{
            left:0,
            top:0,
          }}>
            <h2>Day {round}</h2>
            <p 
                    style={{margin:"5px"}}>{started && timeLeft === 0 ?
            <>Loading</>
            :
            <>
                {
                started
            ? 
            <>{timeLeft}s time left</>
                :
                <>
                    <button onClick={event => {start()}}>New Day</button>
                    <button onClick={event => {dispatch(restart())}}>Restart</button>
                </>
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
                }}
            >
                <ReactFlowProvider>
                    <ReactFlow
                        style={{
                        border: "black 2px solid",
                        background:"white"}}
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