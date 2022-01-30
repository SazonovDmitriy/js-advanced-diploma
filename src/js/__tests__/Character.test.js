import Character from "../Character";
import Undead from "../characters/undead";
import Vampire from "../characters/vampire";
import Bowman from "../characters/bowman";
import Daemon from "../characters/daemon";
import Swordsman from "../characters/swordsman";
import Magician from "../characters/magician";

test('create Character', () => {
    expect(() => new Character()).toThrow();
});

test('crate Undead', () => {
    const received = new Undead(1);
    const expected = {
        attack = 40,
        defence = 10,
        level = 1,
        health = 50,
        type = 'undead',
    };

    expect(received).toEqual(expected);
});

test('crate Vampire', () => {
    const received = new Vampire(1);
    const expected = {
        attack = 25,
        defence = 25,
        level = 1,
        health = 50,
        type = 'vampire',
    };

    expect(received).toEqual(expected);
});

test('crate Magician', () => {
    const received = new Magician(1);
    const expected = {
        attack = 10,
        defence = 40,
        level = 1,
        health = 50,
        type = 'magician',
    };

    expect(received).toEqual(expected);
});

test('crate Swordsman', () => {
    const received = new Swordsman(1);
    const expected = {
        attack = 40,
        defence = 10,
        level = 1,
        health = 50,
        type = 'swordsman',
    };

    expect(received).toEqual(expected);
});

test('crate Daemon', () => {
    const received = new Daemon(1);
    const expected = {
        attack = 10,
        defence = 40,
        level = 1,
        health = 50,
        type = 'daemon',
    };

    expect(received).toEqual(expected);
});

test('crate Bowman', () => {
    const received = new Bowman(1);
    const expected = {
        attack = 25,
        defence = 25,
        level = 1,
        health = 50,
        type = 'bowman',
    };

    expect(received).toEqual(expected);
});