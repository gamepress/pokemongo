import path from "path";

import Payload from "payload";

import { manaSlug } from "../../utils/url-slug";

require("dotenv").config();

const { PAYLOADCMS_SECRET } = process.env;

let payload = null as any;

//Start payload instance
const start = async () =>
   await Payload.init({
      secret: PAYLOADCMS_SECRET as any,
      //@ts-ignore
      mongoURL:
         `${process.env.MONGODB_URI}/${process.env.CUSTOM_DB_NAME}` as any,
      local: true,
      onInit: (_payload) => {
         payload = _payload;
         payload.logger.info(`Payload initialized...`);
         mapper();
      },
   });
start();

async function mapper() {
   const familyEvolutionRequests = Array.from({ length: 15 }, (_, i) =>
      fetch(
         `https://pogo.gamepress.gg/family-export?page=${i}&_format=json`,
      ).then((response) => response.json()),
   );

   const familyRequests = Array.from({ length: 15 }, (_, i) =>
      fetch(
         `https://pogo.gamepress.gg/families-feed?page=${i}&_format=json`,
      ).then((response) => response.json()),
   );

   const familyEvolutionRequirements = await Promise.all(
      familyEvolutionRequests,
   );

   const families = await Promise.all(familyRequests);

   try {
      await Promise.all(
         families.map(async (row: any) => {
            try {
               const existingPokemon = await payload.find({
                  collection: "pokemon-families",
                  where: { name: { equals: row?.title } },
               });

               if (existingPokemon.docs.length > 0) {
                  payload.logger.info(
                     `Document already exists for ${row?.title}`,
                  );
                  return;
               }

               const stage2Mons =
                  row.stage_2 &&
                  row.stage_2.split(",").map((stageMon: any) => {
                     const evolutionReqs = familyEvolutionRequirements.find(
                        (lookupMon: any) => {
                           return (
                              lookupMon.field_evolution_chain_pokemon ===
                              stageMon
                           );
                        },
                     );
                     const evoReq = evolutionReqs?.field_evolution_requirements;

                     return {
                        pokemon: manaSlug(row),
                        evolutionRequirements: evoReq
                           .split(",")
                           .map((row: any) => {
                              return manaSlug(row);
                           }),
                     };
                  });

               const stage3Mons =
                  row.stage_3 &&
                  row.stage_3.split(",").map((stageMon: any) => {
                     const evolutionReqs = familyEvolutionRequirements.find(
                        (lookupMon: any) => {
                           return (
                              lookupMon.field_evolution_chain_pokemon ===
                              stageMon
                           );
                        },
                     );
                     const evoReq = evolutionReqs?.field_evolution_requirements;

                     return {
                        pokemon: manaSlug(row),
                        evolutionRequirements: evoReq
                           .split(",")
                           .map((row: any) => {
                              return manaSlug(row);
                           }),
                     };
                  });

               const stage4Mons =
                  row.stage_4 &&
                  row.stage_4.split(",").map((stageMon: any) => {
                     const evolutionReqs = familyEvolutionRequirements.find(
                        (lookupMon: any) => {
                           return (
                              lookupMon.field_evolution_chain_pokemon ===
                              stageMon
                           );
                        },
                     );
                     const evoReq = evolutionReqs?.field_evolution_requirements;

                     return {
                        pokemon: manaSlug(row),
                        evolutionRequirements: evoReq
                           .split(",")
                           .map((row: any) => {
                              return manaSlug(row);
                           }),
                     };
                  });

               await payload.create({
                  collection: "pokemon-families",
                  data: {
                     id: manaSlug(row?.title),
                     pokemonInFamily: [
                        manaSlug(row?.base),
                        ...row.stage_2.split(",").map((row: any) => {
                           return manaSlug(row);
                        }),
                        ...row.stage_3.split(",").map((row: any) => {
                           return manaSlug(row);
                        }),
                        ...row.stage_4.split(",").map((row: any) => {
                           return manaSlug(row);
                        }),
                     ],
                     name: row?.title,
                     slug: manaSlug(row?.title),
                     basePokemon: manaSlug(row?.base),
                     stage2Pokemon: stage2Mons,
                     stage3Pokemon: stage3Mons,
                     stage4Pokemon: stage4Mons,
                  },
               });
               console.log(`Document added successfully`);
            } catch (e) {
               payload.logger.error(`Document failed to update`);

               payload.logger.error(e);
            }
         }),
      );
   } catch (e) {
      payload.logger.error("Something went wrong.");
      payload.logger.error(e);
   }

   console.log("Complete");
   process.exit(0);
}
