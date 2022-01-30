import themes from "./themes";
import GamePlay from "./GamePlay";
import PositionedCharacter from "./PositionedCharacter";
import GameState from "./GameState";
import Team from "./Team";

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.themes = themes.prairie;
    this.blockedBoard = false;
    this.userPositions = [];
    this.enemyPositions = [];
    this.selectedCharacter = {};
    this.userTeam = [];
    this.enemyTeam = [];
  }

  init() {
    this.gamePlay.drawUi(this.themes);
    this.gamePlay.addNewGameListener(this.newGame.bind(this));
    this.gamePlay.addSaveGameListener(this.saveGame.bind(this));
    this.gamePlay.addLoadGameListener(this.loadGame.bind(this));
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
  }
  
  addPositionedCharacter(userTeam, enemyTeam) {
    this.userPositions = [];
    this.enemyPositions = [];
    
    userTeam.forEach(element => {
      this.userPositions.push(new PositionedCharacter(element, 0))
    });

    enemyTeam.forEach(element => {
      this.enemyPositions.push(new PositionedCharacter(element, 0))
    });
  };

  onCellClick(index) {
    this.index = index;
    
  }
 
  onCellEnter(index) {
    this.index = index;
    const icons = {
      level: '\u{1F396}',
      attack: '\u{2694}',
      defence: '\u{1F6E1}',
      health: '\u{2764}'
    };

    if (!this.blockedBoard) {
      for (const item of [...this.userPositions, ...this.enemyPositions]) {
        if (item.position === index) {
          let message = `${icons.level}${item.character.level} ${icons.attack}${item.character.attack} ${icons.defence}${item.character.defence} ${icons.health}${item.character.health}`;
          this.gamePlay.showCellTooltip(message, index);
        }
      }
    };
  };

  onCellLeave(index) {
    if (this.selectedCharacter.position !== index) {
      this.gamePlay.deselectCell(index);
    };
    this.gamePlay.hideCellTooltip(index);
  }
};
  