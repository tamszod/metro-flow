import { Provider } from "react-redux";
import { store } from "./api/state/store";
import { Start } from "../../views/dialogs/Start";
import { LearnToPlay } from "../../views/dialogs/LearnToPlay";
import { GameOver } from "../../views/dialogs/GameOver";
import { DayEnded } from "../../views/dialogs/DayEnded";
import { UI } from "./views/ui/ui";
import { Board } from "./views/board/board";

export default function GameApp() {
	return (
		<Provider store={store}>
			<Start />
			<LearnToPlay />
			<GameOver />
			<DayEnded />
			<UI />
			<Board />
		</Provider>
	);
}