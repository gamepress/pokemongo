import { NavLink } from "@remix-run/react";
import clsx from "clsx";

import { Icon } from "~/components/Icon";
import { Image } from "~/components/Image";
import type {
   Pokemon as PokemonType,
   PokemonFamily as PokemonFamilyType,
   EvolutionRequirement,
} from "~/db/payload-custom-types";

function FamilyItem({
   pokemon,
   evolutionReqs,
}: {
   pokemon: PokemonType | undefined;
   evolutionReqs?: EvolutionRequirement[] | null | undefined;
}) {
   return (
      <NavLink
         to={`/c/pokemon/${pokemon?.slug}`}
         className={({ isActive, isPending }) =>
            clsx(
               "border flex-auto rounded-lg p-2 gap-2 items-center shadow-sm shadow-1",
               isActive
                  ? "dark:bg-dark450 bg-zinc-100 border-zinc-300 dark:border-zinc-600"
                  : "bg-3-sub border-color-sub hover:bg-zinc-50",
            )
         }
      >
         <div className="flex gap-2 items-center">
            <Image
               width={80}
               height={80}
               url={pokemon?.icon?.url}
               className="size-9"
               options="aspect_ratio=1:1"
               alt={pokemon?.name ?? "Icon"}
            />
            <div>
               <span className="font-semibold text-sm">{pokemon?.name}</span>
               {evolutionReqs?.map((row) => (
                  <div className="text-1 text-xs" key={row.id}>
                     {row.name}
                  </div>
               ))}
            </div>
         </div>
      </NavLink>
   );
}

export function PokemonFamily({
   data,
}: {
   data: { pokemon: PokemonType; family: PokemonFamilyType };
}) {
   const family = data.family;

   const stage =
      family?.stage4Pokemon && family.stage4Pokemon?.length > 0
         ? 4
         : family?.stage3Pokemon && family.stage3Pokemon?.length > 0
           ? 3
           : family?.stage2Pokemon && family.stage2Pokemon?.length > 0
             ? 2
             : 1;

   return (
      family && (
         <div className="flex max-laptop:flex-col items-stretch gap-2 laptop:gap-1.5 pb-4 pt-1">
            <FamilyItem pokemon={family?.basePokemon} />
            <div className="flex items-center justify-center">
               <Icon
                  className="w-4 text-1 max-laptop:rotate-90"
                  name="arrow-right"
                  size={20}
               />
            </div>
            {family?.stage2Pokemon?.map((row) => (
               <FamilyItem
                  key={row.id}
                  pokemon={row.pokemon}
                  evolutionReqs={row.evolutionRequirements}
               />
            ))}
            <div className="flex items-center justify-center">
               <Icon
                  className="w-4 text-1 max-laptop:rotate-90"
                  name="arrow-right"
                  size={20}
               />
            </div>
            {family?.stage3Pokemon?.map((row) => (
               <FamilyItem
                  key={row.id}
                  pokemon={row.pokemon}
                  evolutionReqs={row.evolutionRequirements}
               />
            ))}
            <div className="flex items-center justify-center">
               <Icon
                  className="w-4 text-1 max-laptop:rotate-90"
                  name="arrow-right"
                  size={20}
               />
            </div>
            {family?.stage4Pokemon?.map((row) => (
               <FamilyItem
                  key={row.id}
                  pokemon={row.pokemon}
                  evolutionReqs={row.evolutionRequirements}
               />
            ))}
         </div>
      )
   );
}
