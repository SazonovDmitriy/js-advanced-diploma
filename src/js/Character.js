export default class Character {
  constructor(level, type = 'generic') {
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
    this.distance = 1;
    this.distanceAttack = 1;

    if (new.target.name === 'Character') {
      throw new Error('error create new Character');
    }
  };
  levelUp() {
    this.level += 1;
    this.health += 80;
    if (this.health >= 100) {
      this.health = 100;
    };
    this.attack = Math.max(this.attack, (this.attack * (80 + this.health)) / 100);
    this.defence = Math.max(this.defence, (this.defence * (80 + this.health)) / 100);
  }
};