import themes from "./themes";
import GamePlay from "./GamePlay";
import PositionedCharacter from "./PositionedCharacter";
import GameState from "./GameState";
import Team from "./Team";
import {characterGenerator, generateTeam} from './generators';
import cursors from "./cursors";

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
  };

  init() {
    this.gamePlay.drawUi(this.themes);
    // this.gamePlay.redrawPositions([...this.userPositions, ...this.enemyPositions]);
    this.gamePlay.addNewGameListener(this.newGame.bind(this));
    this.gamePlay.addSaveGameListener(this.saveGame.bind(this));
    this.gamePlay.addLoadGameListener(this.loadGame.bind(this));
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
  };

  async onCellClick(index) {
    this.index = index;
  };
  
 
  onCellEnter(index) {
    this.index = index;
    const icons = {
      level: '\u{1F396}',
      attack: '\u{2694}',
      defence: '\u{1F6E1}',
      health: '\u{2764}',
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

  newGame() {
  
  };

  saveGame() {

  };

  loadGame() {

  };

  nextLevel() {
    if (this.level === 1) { // Если уровень 1
      this.userTeam = Team.getStartUserTeam();
      this.enemyTeam = generateTeam(Team.getEnemyTeam(), 1, 2);
      this.addPositionedCharacter(this.userTeam, this.enemyTeam);
    } else if (this.level === 2) { // Если уровень 2
      this.themes = themes.desert;
      this.userTeam.forEach(item => {
        item.levelUp();
      });
      this.userTeam.push(generateTeam(Team.getUserTeam(), 1, 1)[0]);
      this.enemyTeam = generateTeam(Team.getEnemyTeam(), 2, this.userTeam.length);
      this.addPositionedCharacter(this.userTeam, this.enemyTeam);
    } else if (this.level === 3) { // Если уровень 3
      this.themes = themes.arctic;
      this.userTeam.forEach(item => {
        item.levelUp();
      });
      this.userTeam.push(generateTeam(Team.getUserTeam(), 2, 1)[0]);
      this.enemyTeam = generateTeam(Team.getUserTeam(), 3, this.userTeam.length);
      this.addPositionedCharacter(this.userTeam, this.enemyTeam);
    } else if (this.level === 4) { // Если уровень 4
      this.themes = themes.mountain;
      this.userTeam.forEach(item => {
        item.levelUp();
      });
      this.userTeam.push(generateTeam(Team.getUserTeam(), 3, 1));
      this.enemyTeam = generateTeam(Team.getUserTeam(), 4, this.userTeam.length);
      this.addPositionedCharacter(this.userTeam, this.enemyTeam);
    } else { // Иначе
      this.blockedBoard = true;
      GamePlay.showMessage(`You have ${this.points} points`);
      return;
    };
    const startUser = this.startUserPositions();
    const startEnemy = this.startEnemyPositions();

    for (let i = 0; i < this.userPositions.length; i += 1) {
      this.userPositions[i].position = this.getRandom(startUser);
    };

    for (let i = 0; i < this.enemyPositions.length; i += 1) {
      this.enemyPositions[i].position = this.getRandom(startEnemy);
    };

    this.gamePlay.drawUi(this.themes);
    this.gamePlay.redrawPositions([...this.userPositions, ...this.enemyPositions])
  };

  onCellLeave(index) {
    if (this.selectedCharacter.position !== index) {
      this.gamePlay.deselectCell(index);
    };
    this.gamePlay.hideCellTooltip(index);
    this.gamePlay.setCursor(cursors.auto);
  };

  getRandomPositions(positions) {
    let num = Math.floor(Math.random() * positions.length);
    let random = positions.splice(num, 1);
    return random[0];
  }
};