import Character from "../Character";
import Undead from "../characters/Undead";
import Vampire from "../characters/Vampire";
import Bowman from "../characters/Bowman";
import Daemon from "../characters/Daemon";
import Swordsman from "../characters/Swordsman";
import Magician from "../characters/Magician";

test('create Character', () => {
    expect(() => new Character()).toThrow();
});

test('crate Undead', () => {
    const received = new Undead(1);
    const expected = {
        attack: 40,
        defence: 10,
        level: 1,
        health: 50,
        type: 'undead',
        distance: 4,
        distanceAttack: 1,
    };

    expect(received).toEqual(expected);
});

test('crate Vampire', () => {
    const received = new Vampire(1);
    const expected = {
        attack: 25,
        defence: 25,
        level: 1,
        health: 50,
        type: 'vampire',
        distance: 2,
        distanceAttack: 2,
    };

    expect(received).toEqual(expected);
});

test('crate Magician', () => {
    const received = new Magician(1);
    const expected = {
        attack: 10,
        defence: 40,
        level: 1,
        health: 50,
        type: 'magician',
        distance: 1,
        distanceAttack: 4,
    };

    expect(received).toEqual(expected);
});

test('crate Swordsman', () => {
    const received = new Swordsman(1);
    const expected = {
        attack: 40,
        defence: 10,
        level: 1,
        health: 50,
        type: 'swordsman',
        distance: 4,
        distanceAttack: 1,
    };

    expect(received).toEqual(expected);
});

test('crate Daemon', () => {
    const received = new Daemon(1);
    const expected = {
        attack: 10,
        defence: 40,
        level: 1,
        health: 50,
        type: 'daemon',
        distance: 1,
        distanceAttack: 4,
    };

    expect(received).toEqual(expected);
});

test('crate Bowman', () => {
    const received = new Bowman(1);
    const expected = {
        attack: 25,
        defence: 25,
        level: 1,
        health: 50,
        type: 'bowman',
        distance: 2,
        distanceAttack: 2,
    };

    expect(received).toEqual(expected);
});