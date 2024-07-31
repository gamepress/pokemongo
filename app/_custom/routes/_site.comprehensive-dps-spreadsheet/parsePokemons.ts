import type { Pokemon } from "payload/generated-custom-types";

export function parsePokemons(pokemons: { docs: Pokemon[] }) {
   return pokemons?.docs
      ?.map((pokemon: Pokemon) => parsePokemon(pokemon))
      .sort((a: any, b: any) => (a.id > b.id ? 1 : -1));
}

export function parsePokemon(pokemon: Pokemon) {
   let dex = pokemon.number,
      name = pokemon.name ?? pokemon.slug ?? pokemon.id,
      pokeType1 = pokemon.type?.[0],
      pokeType2 = pokemon.type?.[1],
      baseAtk = pokemon.baseAttack,
      baseDef = pokemon.baseDefense,
      baseStm = pokemon.baseStamina;

   let fastMoves = pokemon.fastMoves?.map((move) => move.move),
      chargeMoves = pokemon.chargeMoves?.map((move) => move.move),
      fastMoves_legacy = [],
      chargeMoves_legacy = [],
      fastMove_exclusive = [],
      chargeMoves_exclusive = [];

   let rating = pokemon.ratings?.attackerRating,
      raidMarker = "",
      nid,
      icon,
      label = name,
      labelLinked = `<a href="/c/pokemon/${pokemon.slug}" hreflang="en">${label}</a>`,
      evolutions,
      unavailable,
      rarity = LegendaryPokemon.includes(name)
         ? "POKEMON_RARITY_LEGENDARY"
         : MythicalPokemon.includes(name)
           ? "POKEMON_RARITY_MYTHIC"
           : undefined;

   return {
      dex,
      name,
      pokeType1,
      pokeType2,
      baseAtk,
      baseDef,
      baseStm,
      fastMoves,
      chargeMoves,
      fastMoves_legacy,
      chargeMoves_legacy,
      fastMove_exclusive,
      chargeMoves_exclusive,
      rating,
      raidMarker,
      nid,
      icon,
      label,
      labelLinked,
      evolutions,
      unavailable,
      rarity,
   };
}

export const LegendaryPokemon = [
   "regice",
   "entei",
   "registeel",
   "suicune",
   "heatran",
   "latias",
   "rayquaza",
   "azelf",
   "moltres",
   "mewtwo",
   "latios",
   "groudon",
   "regirock",
   "dialga",
   "giratina (altered forme)",
   "giratina (origin forme)",
   "mesprit",
   "zapdos",
   "lugia",
   "articuno",
   "ho-oh",
   "kyogre",
   "regigigas",
   "uxie",
   "palkia",
   "cresselia",
   "raikou",
   "tornadus (incarnate forme)",
   "tornadius (therian forme)",
   "landorus (incarnate forme)",
   "landorus (therian forme)",
   "thundurus (incarnate forme)",
   "thundurus (therian forme)",
   "black kyurem",
   "white kyurem",
   "kyurem",
   "reshiram",
   "zekrom",
   "shadow raikou",
];
export const MythicalPokemon = [
   "arceus",
   "darkrai",
   "phione",
   "shaymin",
   "deoxys (attack forme)",
   "deoxys (defense forme)",
   "deoxys (normal forme)",
   "deoxys (speed forme)",
   "manaphy",
   "celebi",
   "mew",
   "meltan",
   "jirachi",
   "melmetal",
];
