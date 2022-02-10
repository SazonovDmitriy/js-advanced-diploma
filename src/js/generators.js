/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  const characterLevel = Math.floor((Math.random() * maxLevel) + 1);
  const characterType = Math.floor(Math.random() * allowedTypes.length);

  yield new allowedTypes[characterType](characterLevel);
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const team = [];

  for (let i = 0; i < characterCount; i++) {
    const character = characterGenerator(allowedTypes, maxLevel)
    team.push(character.next().value);
  };
  return team;
}
