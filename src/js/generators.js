/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  const allowedtypes = Math.floor(Math.random() * allowedTypes.length);
  const maxlevel = Math.floor(Math.random() * maxLevel) + 1;

  yield new allowedTypes[allowedtypes](maxlevel);
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const team = [];

  for (let i = 0; i < characterCount; i++) {
    const character = characterGenerator(allowedTypes, maxLevel)
    team.push(character.next().value);
  };
  return team;
}
