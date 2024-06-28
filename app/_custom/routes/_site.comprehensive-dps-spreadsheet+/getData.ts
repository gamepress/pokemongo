import type { Move, Type } from "payload/generated-custom-types";
import { fetchWithCache } from "~/utils/cache.server";

export async function getMoves() {
   let movesFromAPI =
      (
         await fetchWithCache<{ docs: Array<Move> }>(
            "http://localhost:4000/api/moves?limit=0&depth=0",
         )
      )?.docs ?? [];

   let typesFromAPI =
      (
         await fetchWithCache<{ docs: Array<Type> }>(
            "http://localhost:4000/api/types?limit=0",
         )
      )?.docs ?? [];

   let types = {} as Record<string, Type>;

   typesFromAPI.forEach((type) => {
      types[type.id] = type;
   });

   let moves = movesFromAPI.map((move) => {
      let type = move.type as unknown as string;
      let name = move.name?.toLowerCase(),
         pokeType = move.type,
         label = move.name,
         labelLinked = `<a href="/c/moves/${move.slug}">${move.name}</a>`,
         icon = types[type]?.icon?.url,
         power = 0,
         dws = 0,
         duration = 0,
         energyDelta = 0,
         move_category = move.category,
         pve = {
            power: move.pve.power,
            energy: move.pve.energy,
            duration: move.pve.duration,
         },
         pvp = {
            power: move.pvp.power,
            energy: move.pvp.energy,
         };

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
         move_category,
         pve,
         pvp,
      };
   });

   return moves;
}

function parseMoveEffect(move) {
   if (move.subject) {
      let stage_delta = parseInt(move.stage_delta);
      let subj_self = move.subject.includes("Self");
      let subj_targ = move.subject.includes("Opponent");
      let stat_atk = move.stat.includes("Atk");
      let stat_def = move.stat.includes("Def");
      return {
         activation_chance: parseFloat(move.probability),
         self_attack_stage_delta: subj_self && stat_atk ? stage_delta : 0,
         self_defense_stage_delta: subj_self && stat_def ? stage_delta : 0,
         target_attack_stage_delta: subj_targ && stat_atk ? stage_delta : 0,
         target_defense_stage_delta: subj_targ && stat_def ? stage_delta : 0,
      };
   }
   return "";
}

// /**
//  * Fetch move data from GP server.
//  *
//  * @param oncomplete The callback after the fetching is complete.
//  */
// function fetchMoves(oncomplete = function () {}) {
//     // Parse move effect
//     function parseMoveEffect(move) {
//        if (move.subject) {
//           let stage_delta = parseInt(move.stage_delta);
//           let subj_self = move.subject.includes("Self");
//           let subj_targ = move.subject.includes("Opponent");
//           let stat_atk = move.stat.includes("Atk");
//           let stat_def = move.stat.includes("Def");
//           return {
//              activation_chance: parseFloat(move.probability),
//              self_attack_stage_delta: subj_self && stat_atk ? stage_delta : 0,
//              self_defense_stage_delta: subj_self && stat_def ? stage_delta : 0,
//              target_attack_stage_delta: subj_targ && stat_atk ? stage_delta : 0,
//              target_defense_stage_delta: subj_targ && stat_def ? stage_delta : 0,
//           };
//        }
//        return "";
//     }

//     let moves = moveData.map((move) => ({
//        name: move.title.toLowerCase(),
//        pokeType: move.move_type.toLowerCase(),
//        label: toTitleCase(move.title),
//        labelLinked: move.title_linked,
//        icon: getTypeIcon(move.move_type),
//        power: 0,
//        dws: 0,
//        duration: 0,
//        energyDelta: 0,
//        effect: parseMoveEffect(move),
//        regular: {
//           power: parseInt(move.power),
//           dws: parseFloat(move.damage_window.split(" ")[0]) * 1000 || 0,
//           duration: parseFloat(move.cooldown) * 1000,
//           energyDelta:
//              move.move_category == "Fast Move"
//                 ? Math.abs(parseInt(move.energy_gain))
//                 : -Math.abs(parseInt(move.energy_cost)),
//        },
//        combat:
//           move.move_category === "Fast Move"
//              ? {
//                   power: parseInt(move.pvp_fast_power),
//                   dws: 0,
//                   duration: parseInt(move.pvp_fast_duration) + 1,
//                   energyDelta: parseInt(move.pvp_fast_energy),
//                }
//              : {
//                   power: parseInt(move.pvp_charge_damage),
//                   dws: 0,
//                   duration: 0,
//                   energyDelta: parseInt(move.pvp_charge_energy),
//                },
//        moveType: move.move_category === "Fast Move" ? "fast" : "charged",
//     }));

//     // moves could be fast or charged
//     Data.FastMoves = moves
//        .filter((move) => move.moveType == "fast")
//        .sort((a, b) => (a.name < b.name ? -1 : 1));

//     Data.ChargedMoves = moves
//        .filter((move) => move.moveType == "charged")
//        .sort((a, b) => (a.name < b.name ? -1 : 1));

//     //   for (var a in move.regular) {
//     //      move[a] = move.regular[a];
//     //   }

//     Data.FastMoves.sorted = true;
//     Data.ChargedMoves.sorted = true;
//     requiredJSONStatus.Moves = 2;
//     return oncomplete();
//  }

//    // PvEMoves & PvPMoves
//    dst.PvEMoves = [];
//    dst.PvPMoves = [];
//    if (src.FastMoves) {
//       for (let i = 0; i < src.FastMoves.length; ++i) {
//          let move = src.FastMoves[i];
//          let pve_move = {
//             movetype: "fast",
//             name: move.name,
//             pokeType: move.pokeType,
//             power: move.regular.power,
//             energy: move.regular.energyDelta,
//             duration: move.regular.duration,
//             dws: move.regular.dws,
//             icon: move.icon,
//             label: move.label,
//          };
//          let pvp_move = {
//             movetype: "fast",
//             name: move.name,
//             pokeType: move.pokeType,
//             power: move.combat.power,
//             energy: move.combat.energyDelta,
//             duration: Math.round(move.combat.duration / 500),
//             icon: move.icon,
//             label: move.label,
//          };
//          dst.PvEMoves.push(pve_move);
//          dst.PvPMoves.push(pvp_move);
//       }
//    }
//    if (src.ChargedMoves) {
//       for (let i = 0; i < src.ChargedMoves.length; ++i) {
//          let move = src.ChargedMoves[i];
//          let pve_move = {
//             movetype: "charged",
//             name: move.name,
//             pokeType: move.pokeType,
//             power: move.regular.power,
//             energy: move.regular.energyDelta,
//             duration: move.regular.duration,
//             dws: move.regular.dws,
//             icon: move.icon,
//             label: move.label,
//          };
//          let pvp_move = {
//             movetype: "charged",
//             name: move.name,
//             pokeType: move.pokeType,
//             power: move.combat.power,
//             energy: move.combat.energyDelta,
//             effect: move.effect,
//             icon: move.icon,
//             label: move.label,
//          };
//          dst.PvEMoves.push(pve_move);
//          dst.PvPMoves.push(pvp_move);
//       }
//    }
