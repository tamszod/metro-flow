import { useEffect, useMemo, useRef } from "react";
import Station from './components/station'
import { ReactFlow, ReactFlowProvider, MiniMap } from '@xyflow/react';
import Line from "./components/line";
import '@xyflow/react/dist/style.css';
import { useDispatch, useSelector } from "react-redux";
import { addTrainToLine, buildLine, GAME_STATE, nextFrame } from "../../api/state/slice";
import { selectEdges, selectNodes, selectGameState, Game__IsSimulated } from "../../api/state/selectors";
import { areaHeight, areaWidth } from "../../../../config";
//import { MiniMap } from "reactflow";

const proOptions = { hideAttribution: true };

export const nextFrameMs = 20;
export const heatFrameMs = 50;

export const Board = () => {
    const dispatch = useDispatch();
    const IsSumlated = useSelector(Game__IsSimulated);
    const gameState = useSelector(selectGameState);
    const edges = useSelector(selectEdges);
    const nodes = useSelector(selectNodes);
    const gameLoopTimer = useRef();

    useEffect(() => {
        if (gameState === GAME_STATE.STARTED){
            gameLoopTimer.current = setInterval(() => {
                if (IsSumlated){
                    dispatch(nextFrame(nextFrameMs));
                }
            }, nextFrameMs);
            return () => clearInterval(gameLoopTimer.current);
        }
    }, [gameState, IsSumlated, dispatch]);

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
                    <MiniMap />
                    </ReactFlow>
                </ReactFlowProvider>
            </div>
        </div>
    )
}