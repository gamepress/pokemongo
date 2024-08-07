import type {
   Pokemon as PokemonType,
   PokemonFamily as PokemonFamilyType,
} from "~/db/payload-custom-types";

export function PokemonFamily({
   data,
}: {
   data: { pokemon: PokemonType; family: PokemonFamilyType };
}) {
   return <>Hello</>;
}
