import themes from "./themes";
import GamePlay from "./GamePlay";

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.themes = themes.prairie;
  }

  init() {
    // TODO: add event listeners to gamePlay events
    this.gamePlay.drawUi(this.themes);
    this.gamePlay.addCellEnterListener(this.onCellEnter);
    this.gamePlay.addCellClickListener(this.onCellClick);
    this.gamePlay.addCellLeaveListener(this.onCellLeave);
    this.gamePlay.addNewGameListener(this.newGame);
    this.gamePlay.addSaveGameListener(this.saveGame);
    this.gamePlay.addLoadGameListener(this.loadGame);
    // TODO: load saved stated from stateService
  }

  onCellClick(index) {
    // TODO: react to click
  }

  onCellEnter(index) {
    this.index = index;
    if (!this.character) {
    this.gamePlay.showCellTooltip(message, index);
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
  }
}
