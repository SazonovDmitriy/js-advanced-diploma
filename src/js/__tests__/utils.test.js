import calcTileType from "../utils";

test('top-left', () => {
    const received = calcTileType(0, 8);
    const expected = 'top-left';

    expect(received).toBe(expected);
});

test('top', () => {
    const received = calcTileType(5, 8);
    const expected = 'top';

    expect(received).toBe(expected);
});

test('top-right', () => {
    const received = calcTileType(7, 8);
    const expected = 'top-right';

    expect(received).toBe(expected);
});

test('bottom-right', () => {
    const received = calcTileType(63, 8);
    const expected = 'bottom-right';

    expect(received).toBe(expected);
});

test('bottom', () => {
    const received = calcTileType(59, 8);
    const expected = 'bottom';

    expect(received).toBe(expected);
});

test('bottom-left', () => {
    const received = calcTileType(56, 8);
    const expected = 'bottom-left';

    expect(received).toBe(expected);
});

test('right', () => {
    const received = calcTileType(31, 8);
    const expected = 'right';

    expect(received).toBe(expected);
});

test('left', () => {
    const received = calcTileType(48, 8);
    const expected = 'left';

    expect(received).toBe(expected);
});

test('center', () => {
    const received = calcTileType(27, 8);
    const expected = 'center';

    expect(received).toBe(expected);
});