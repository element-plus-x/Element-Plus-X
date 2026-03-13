import { characterEntities } from 'character-entities';

const own = {}.hasOwnProperty;

export function decodeNamedCharacterReference(value) {
  return own.call(characterEntities, value) ? characterEntities[value] : false;
}
