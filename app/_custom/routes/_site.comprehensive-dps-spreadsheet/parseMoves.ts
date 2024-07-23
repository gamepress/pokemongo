import type { Move } from "~/db/payload-custom-types";

export function parseMoves(moves: any) {
   return moves?.docs?.map((move: Move) => parseMove(move));
}

export function parseMove(move: Move) {
   let pokeType = move.type as any as keyof typeof moveTypeIcons; //ugly but it works

   let name = move.id,
      label = move.name,
      labelLinked = `<a href=\"/c/moves/${move.slug}\" hreflang=\"en\">${label}</a>`,
      icon = `https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_${moveTypeIcons[pokeType]}.svg`,
      moveType = move.category;

   let power = 0,
      dws = 0,
      duration = 1,
      energyDelta = 0;

   if (move.pve) {
      if (move.pve.power) power = move.pve.power;
      if (move.pve.damageWindowStart) dws = move.pve.damageWindowStart * 1000;
      if (move.pve.duration) duration = move.pve.duration * 1000;
      if (moveType === "fast" && move.pve.energyDeltaCharge)
         energyDelta = parseInt(move.pve.energyDeltaCharge);
      if (moveType === "charge" && move.pvp?.energyDeltaCharge)
         energyDelta = move.pvp?.energyDeltaCharge;
   }

   let regular = {},
      combat = {};

   return {
      name,
      pokeType,
      label,
      labelLinked,
      icon,
      power,
      dws,
      duration,
      energyDelta,
      regular,
      combat,
      moveType,
   };
}

// return of parseMove should look like this:
// {
//     "name": "acid",
//     "pokeType": "poison",
//     "label": "Acid",
//     "labelLinked": "<a href=\"/pokemongo/pokemon-move/acid\" hreflang=\"en\">Acid</a>",
//     "icon": "/pokemongo/sites/pokemongo/files/icon_poison.png",
//     "power": 9,
//     "dws": 400,
//     "duration": 800,
//     "energyDelta": 8,
//     "effect": "",
//     "regular": {
//       "power": 9,
//       "dws": 400,
//       "duration": 800,
//       "energyDelta": 8
//     },
//     "combat": {
//       "power": 6,
//       "dws": 0,
//       "duration": 2,
//       "energyDelta": 5
//     },
//     "moveType": "fast"
//   }

// hardcode this because I'm lazy
const moveTypeIcons = {
   bug: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Bug.svg",
   dark: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Dark.svg",
   dragon: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Dragon.svg",
   electric:
      "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Electric.svg",
   fairy: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Fairy.svg",
   fighting:
      "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Fighting.svg",
   fire: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Fire.svg",
   flying: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Flying.svg",
   ghost: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Ghost.svg",
   grass: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Grass.svg",
   ground: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Ground.svg",
   ice: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Ice.svg",
   normal: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Normal.svg",
   poison: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Poison.svg",
   psychic: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Psychic.svg",
   rock: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Rock.svg",
   steel: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Steel.svg",
   water: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Water.svg",
};
