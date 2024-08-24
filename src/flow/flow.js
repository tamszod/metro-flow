import { useEffect, useMemo, useRef, useState } from "react";
import Station from './utils/station'
import ReactFlow, { ControlButton, Controls, MiniMap, ReactFlowProvider } from "reactflow"
import Line from "./utils/line";
import 'reactflow/dist/style.css';
import { SiMetrodeparis } from "react-icons/si";
import { useDispatch, useSelector } from "react-redux";
import { addTrainToLine, buildLine, GAME_STATE, nextFrame, nextRound, restart } from "../state/slice";
import { selectLifeTimeLeft, selectDay, selectEdges, selectLinesColors, selectNodes, selectPassengers, selectGameState, selectTimeLeft } from "../state/selectors";
import { areaHeight, areaWidth } from "../config";
import { LearnToPlay__SetOpen } from "../state/dialog/slice";

const proOptions = { hideAttribution: true };

export const nextFrameMs = 20;
export const heatFrameMs = 50;

export const Flow = () => {
    const dispatch = useDispatch();
    const [simulation, setSimulation] = useState(true)
    const iLifeTimeLeft = useSelector(selectLifeTimeLeft);
    const gameState = useSelector(selectGameState);
    const edges = useSelector(selectEdges);
    const nodes = useSelector(selectNodes);
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

    return (
        <div style={{
            left:0,
            top:0,
            margin:0,
            padding:0
          }}>
            
            
            <div
                style={{
                    width: "100vw",
                    height: "100vh",
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

                        <strong
                            style={{
                                marginLeft:"10px",
                                transform: "translate(-50%, -50%)",
                            }}
                        ></strong>
                        <strong style={{
                            margin:"50px",
                        }}>
                        </strong>
                        <strong
                            style={{
                                color: (iLifeTimeLeft < 10 ? "red" : "black")
                            }}
                        >
                        Life left: {iLifeTimeLeft > 0 ? (iLifeTimeLeft).toFixed(2) : "0.00"}s
                        </strong>
                    <MiniMap></MiniMap>
                    </ReactFlow>
                </ReactFlowProvider>
            </div>
        </div>
    )
}