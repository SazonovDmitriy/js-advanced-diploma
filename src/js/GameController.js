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
    this.points = 0;
    this.boardSize = gamePlay.boardSize;
    this.selectedCharacterIndex = 0;
    this.selected = false;
    this.currentMove = 'user';
    this.level = 1;
    this.index = 0;
    this.blockedBoard = false;
    this.userPositions = [];
    this.enemyPositions = [];
    this.selectedCharacter = {};
    this.userTeam = [];
    this.enemyTeam = [];
  };

  init() {
    this.gamePlay.drawUi(this.themes);
    this.nextLevel();
    this.gamePlay.addNewGameListener(this.newGame.bind(this));
    this.gamePlay.addSaveGameListener(this.saveGame.bind(this));
    this.gamePlay.addLoadGameListener(this.loadGame.bind(this));
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
  };

  async onCellClick(index) {
    this.index = index;

    if (!this.blockedBoard) {
      if (this.gamePlay.boardEl.style.cursor === 'not-allowed') {
        GamePlay.showError('Ошибка радиуса')
      } else if (this.getIndex([...this.userPositions]) !== -1) {
        this.gamePlay.deselectCell(this.selectedCharacterIndex); // Снимаем выделенного персонажа
        this.gamePlay.selectCell(index); // Отмечаем выделенного персонажа
        this.selectedCharacterIndex = index; // Индекс выбран
        this.selectedCharacter = [...this.userPositions].find(item => item.position === index); // Отмечаем персонажа по индексу
        this.selected = true; // Персонаж выбран
      } else if (!this.selected && this.getIndex([...this.enemyPositions]) !== -1) {
        GamePlay.showError('Нельзя играть за врага') // Выбран противник, ошибка
      } else if (this.selected && this.gamePlay.boardEl.style.cursor === 'pointer') {
        this.selectedCharacter.position = index;
        this.gamePlay.deselectCell(this.selectedCharacterIndex);
        this.gamePlay.deselectCell(index);
        this.selected = false;
        this.gamePlay.redrawPositions([...this.userPositions, ...this.enemyPositions]);
        this.currentMove = 'enemy';
        this.enemyStrategy();
      } else if (this.selected && this.gamePlay.boardEl.style.cursor === 'crosshair') {
        const thisAttackEnemy = [...this.enemyPositions].find((item) => item.position === index);
        this.gamePlay.deselectCell(this.selectedCharacterIndex);
        this.gamePlay.deselectCell(index);
        this.gamePlay.setCursor(cursors.auto);
        this.selected = false;

        await this.characterAttacking(this.selectedCharacter.character, thisAttackEnemy);
        if (this.enemyPositions.length > 0) {
          this.getEnemyAttack(this.selectedCharacter, thisAttackEnemy);
        }
      }
    }
  };

  getIndex(array) {
    return array.findIndex(item => item.position === this.index);
  };

  async characterAttacking(attacks, target) {
    let damage = Math.floor(Math.max(attacks.attack - target.character.defence, attacks.attack * 0.1));
    await this.gamePlay.showDamage(target.position, damage);
    const targetCharacter = target.character;

    if (targetCharacter.health - damage > 0) {
      targetCharacter.health -= damage;
    } else {
      targetCharacter.health = 0;
    };

    this.currentMove = this.currentMove === 'enemy' ? 'user' : 'enemy';

    if (targetCharacter.health <= 0) {
      this.userPositions = this.userPositions.filter(item => item.position !== target.position);
      this.enemyPositions = this.enemyPositions.filter(item => item.position !== target.position);
    }

    if (this.userPositions.length === 0) {
      GamePlay.showMessage('Game Over');
      this.blockedBoard = true;
    };

    if (this.enemyPositions.length === 0) {
      for (let item of this.userPositions) {
        this.points += item.character.health;
        item.character.levelUp();
      }
      this.level += 1;
      this.nextLevel();
    };

    this.gamePlay.redrawPositions([...this.userPositions, ...this.enemyPositions]);
  }
  
 
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
    if (this.selected) {
      const allowedPosition = this.selectedCharacter.position;
      const allowedDistance = this.selectedCharacter.character.distance;
      const allowedDistanceAttack = this.selectedCharacter.character.distanceAttack;
      const allowedAttack = this.allowedPositions(allowedPosition, allowedDistanceAttack);
      const allowedPositions = this.allowedPositions(allowedPosition, allowedDistance, true);

      if (this.getIndex(this.userPositions) !== -1) {
        this.gamePlay.setCursor(cursors.pointer);
      } else if (this.getIndex(this.enemyPositions) !== -1 && allowedAttack.includes(index)) {
        this.gamePlay.selectCell(index, 'red');
        this.gamePlay.setCursor(cursors.crosshair);
      } else if (this.getIndex([...this.userPositions, this.enemyPositions]) === -1 && allowedPositions.includes(index)) {
        this.gamePlay.selectCell(index, 'green');
        this.gamePlay.setCursor(cursors.pointer);
      } else {
        this.gamePlay.setCursor(cursors.notallowed);
      }
    }
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
    const maxPoint = this.getMaxPoint();
    const gameState = this.stateService.load();

    if (gameState) {
      gameState.maxPoint = maxPoint;
      this.stateService.save(GameState.from(gameState))
    };

    this.userPositions = [];
    this.enemyPositions = [];
    this.level = 1;
    this.points = 0;
    this.themes = themes.prairie;
    this.nextLevel();
  };

  saveGame() {
    const maxPoint = this.getMaxPoint();
    const currentGameState = {
      point: this.points,
      maxPoint,
      level: this.level,
      currentTheme: this.themes,
      userPositions: this.userPositions,
      enemyPositions: this.enemyPositions,
    };
    this.stateService.save(GameState.from(currentGameState));
  };

  loadGame() {
    try {
      const loadGameState = this.stateService.load();
      if (loadGameState) {
        this.point = loadGameState.point;
        this.level = loadGameState.level;
        this.currentTheme = loadGameState.currentTheme;
        this.userPositions = loadGameState.userPositions;
        this.enemyPositions = loadGameState.enemyPositions;
        this.gamePlay.drawUi(this.currentTheme);
        this.gamePlay.redrawPositions([...this.userPositions, ...this.enemyPositions]);
      }
    } catch (e) {
      GamePlay.showMessage('Fail');
      this.newGame();
    }
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
  
  startUserPositions() {
    let positions = [];
    for (let i = 0; i < this.boardSize ** 2; i += 1) {
      if (i % this.boardSize === 0 || i % this.boardSize === 1) {
        positions.push(i);
      }
    }
    return positions;
  };

  startEnemyPositions() {
    let positions = [];
    for (let i = 0; i < this.boardSize ** 2; i += 1) {
      if (i % this.boardSize === 0 || i % this.boardSize === 1) {
        positions.push(i);
      }
    }
    return positions;
  };

  getRandom(positions) {
    let num = Math.floor(Math.random() * positions.length);
    let random = positions.splice(num, 1);
    return random[0];
  };

  getMaxPoint() {
    let maxPoint = 0;
    try {
      const gameStateLoad = this.stateService.load();
      if (gameStateLoad) {
        maxPoint = Math.max(gameStateLoad.maxPoint, this.points);
      }
    } catch(e) {
      maxPoint = this.points;
    }
    return maxPoint;
  };

  allowedPositions(position, distance, isEnemy = false) {
    const allowedPositionsArray = [];
    const itemRow = Math.floor(position / this.boardSize);
    const itemColumn = position % this.boardSize;
    
    for (let i = 0; i <= distance; i += 1) {
      if ((itemColumn + i) < 8) {
        allowedPositionsArray.push((itemRow * 8) + (itemColumn + i));
      } if ((itemRow + i) < 8) {
        allowedPositionsArray.push(((itemRow + i) * 8) + itemColumn);
      } if ((itemColumn - i) >= 0) {
        allowedPositionsArray.push((itemRow * 8) + (itemColumn - i));
      } if ((itemRow - i) >= 0) {
        allowedPositionsArray.push(((itemRow - i) * 8) + itemColumn);
      } if ((itemRow + i) < 8 && (itemColumn + i) < 8) {
        allowedPositionsArray.push(((itemRow + i) * 8) + (itemColumn + i));
      } if ((itemRow + i) < 8 && (itemColumn - i) >= 0) {
        allowedPositionsArray.push(((itemRow + i) * 8) + (itemColumn - i));
      } if ((itemRow - i) >= 0 && (itemColumn - i) >= 0) {
        allowedPositionsArray.push(((itemRow - i) * 8) + (itemColumn - i));
      } if ((itemRow - i) >= 0 && (itemColumn + i) < 8) {
        allowedPositionsArray.push(((itemRow - i) * 8) + (itemColumn + i));
      };
    };
    if (isEnemy === true) {
      let selectedPositions = this.getFilledPositions();

      return allowedPositionsArray.filter(i => selectedPositions.indexOf(i) === -1);
    };
    return allowedPositionsArray;
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
  };

  getFilledPositions() {
    let filledPositions = [];

    for (let i = 0; i < this.userPositions.length; i += 1) {
      filledPositions.push(this.userPositions[i].position)
    };
    for (let i = 0; i < this.enemyPositions.length; i += 1) {
      filledPositions.push(this.enemyPositions[i].position)
    };
    return filledPositions;
  };

  enemyStrategy() {
    if (this.currentMove === 'enemy') {
      let randomEnemy;

      if (this.enemyPositions.length > 1) {
        randomEnemy = this.getRandom([...this.enemyPositions]);
      } else {
        randomEnemy = this.enemyPositions[0];
      }

      const allowedPosition = this. getRandom(this.allowedPositions(randomEnemy.position, randomEnemy.character.distance, true));

      const allowedEnemyDistanceAttack = this.allowedPositions(randomEnemy.position, randomEnemy.character.distanceAttack, true);

      for (let item of [...this.userPositions]) {
        if (allowedEnemyDistanceAttack.includes(item.position)) {
          let attackPromise = this.characterAttacking(randomEnemy.character, item);
        } else {
          randomEnemy.position = allowedPosition;

          this.gamePlay.redrawPositions([...this.userPositions, ...this.enemyPositions]);
          this.currentMove = 'user';
        }
      }
    }
  };

  getEnemyAttack(user, enemy) {
    if (this.currentMove === 'enemy') {
      const allowedEnemyDistanceAttack = this.allowedPositions(enemy.position, enemy.character.distanceAttack);

      if (allowedEnemyDistanceAttack.includes(user.position) && enemy.character.health > 0) {
        let attackPromise = this.characterAttacking(enemy.character, user);

        if (this.userPositions.length === 0) {
          this.blockedBoard = true;
          GamePlay.showMessage('Lose');
        }
      } else {
        enemy.enemyPosition = this.getRandom(this.allowedPositions(enemy.position, enemy.character.distance));
        this.gamePlay.redrawPositions([...this.userPositions, ...this.enemyPositions]);
        this.currentMove = 'user';
      }
    }
  }
};