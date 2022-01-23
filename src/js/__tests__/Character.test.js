import Character from "../Character";
import Undead from "../characters/undead";

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
})