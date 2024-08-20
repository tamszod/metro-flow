// Dialog selectors

import { GAME_STATE } from "../slice";

// Start
export const Start__IsOpen = (state) => state.game.gameState == GAME_STATE.NOT_STARTED;

// Learn To Play
export const LearnToPlay__IsOpen = (state) => state.dialog.LearnToPlay__IsOpen;

// Day Ended
export const DayEnded__IsOpen = (state) => state.game.gameState == GAME_STATE.WAITING_FOR_NEXT_ROUND;

// Game Over
export const GameOver__IsOpen = (state) => state.game.gameState == GAME_STATE.GAME_OVER;