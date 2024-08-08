// (function() {
//     'use strict'

//     angular.module('pogoApp').service('gameData', gameData);
//     angular.module('cpCalc').service('gameData', gameData);
//     angular.module('catchCalc').service('gameData', gameData);
//     angular.module('trainerCalc').service('gameData', gameData);
//     angular.module('pogoAppBlock').service('gameData', gameData);
//     angular.module('bubbleCalc').service('gameData', gameData);
//     angular.module('dittoCalc').service('gameData', gameData);
//     angular.module('raidCalc').service('gameData', gameData);
//     angular.module('raidivCalc').service('gameData', gameData);
//     angular.module('breakpointCalc').service('gameData', gameData);
//     angular.module('bulkpointCalc').service('gameData', gameData);
//     angular.module('berryCalc').service('gameData', gameData);
//     angular.module('leagueCalc').service('gameData', gameData);

//     var use_dev_paths = false;

//     gameData.$inject = ['$http', '$location'];
//     var devMode = false;
//     var urls = window.location.href;
//     var onUser = urls.includes("user");

//     function gameData($http, $location) {
//       var service = {
//         cpm: {},
//         dustValues: {},
//         teams: {},
//         fetchStats: fetchStats,
//         fetchData: fetchData,
//         fetchLanguage: fetchLanguage,
//         getECpM: getECpM,
//         getBaseStats: getBaseStats,
//         calculateStardustCost: calculateStardustCost,
//         fetchCPMCosts: fetchCPMCosts,
//         getEvolutions: getEvolutions,
//         fetchEvoCosts: fetchEvoCosts,
//         calculateEvolutionCosts: calculateEvolutionCosts,
//         fetchBuddyDistances: fetchBuddyDistances,
//         getBuddyDistance: getBuddyDistance,
//         fetchCatchRates: fetchCatchRates,
//         getCatchRate: getCatchRate,
//         fetchTypes: fetchTypes,
//         getTypes: getTypes,
//         getCPM: getCPM,
//         fetchEntityIds: fetchEntityIds,
//         getEntityId: getEntityId,
//         fetchMoves: fetchMoves,
//         fetchMoveData: fetchMoveData,
//         fetchRaidStats: fetchRaidStats,
//         fetchFamilies: fetchFamilies,
//         getMoveData: getMoveData,
//         getRaidStatsByName: getRaidStatsByName,
//         getPokemon: getPokemon,
//         language: undefined
//       }
//       return service;

// TODO need to change this to only pull once
// doesn't need to be updated since it's only being used for cpm and dustvalues
export function fetchData() {
   var paths = "/assets/data/data.json?67";
   $http.get(paths).then(function (response) {
      if (response.status == 200) {
         service.cpm = response.data.cpm;
         service.dustValues = response.data.dustValues;
      }
   });
}

export function fetchStats(data) {
   service.language = Cookies.get("language");
   //if it's their first load, the cookie isn't set
   if (!service.language) {
      service.language = "en";
   }
   getStats(service.language, data);
}

export function fetchLanguage(data) {
   service.language = Cookies.get("language");
   if (service.language == undefined) {
      service.language = "en";
      Cookies.set("language", "en");
   }

   getRaid(service.language, data);

   paths = "/assets/data/languages/" + service.language + ".json?65";
   return $http.get(paths).then(function (response) {
      if (response.status == 200) {
         service.teams = response.data.teams;
      }
   });
}

export function fetchFamilies(data) {
   getFamilies(service.language, data);
}

export function fetchRaidStats(data) {
   getRaidStats(service.language, data);
}

export function fetchMoveData(data) {
   getMoveData2(service.language, data);
}

export function decodeHtml(html) {
   var txt = document.createElement("textarea");
   txt.innerHTML = html;
   return txt.value;
}

export function cleanTitles(list, field) {
   var cleanList = list;
   for (var i = 0; i < cleanList.length; i++) {
      cleanList[i][field] = decodeHtml(cleanList[i][field]);
   }
   return cleanList;
}

export function fetchCPMCosts(data) {
   var paths = "/assets/data/cpm.json?71";
   $http.get(paths).then(function (response) {
      if (response.status == 200) {
         service.cpmCosts = response.data;
      }
   });
}

export function fetchEvoCosts(data) {
   getEvoCosts(data);
}

export function fetchBuddyDistances(data) {
   getBuddyDistances(data);
}

export function fetchCatchRates(data) {
   getCatchRates(data);
}
export function fetchTypes(data) {
   getTypesData(data);
}

export function fetchEntityIds(data) {
   getEntityIds(data);
}

export function fetchMoves() {
   getMoves(service.language);
}

// not used anymore, use the json
export function getECpM(level) {
   if (level == Math.floor(level)) {
      return service.cpm[level];
   } else {
      return Math.sqrt(
         (Math.pow(service.cpm[Math.floor(level)], 2) +
            Math.pow(service.cpm[Math.ceil(level)], 2)) /
            2,
      );
   }
}
// use this instead
export function getCPM(level) {
   level = "" + level;
   for (var i = 0; i < service.cpmCosts.length; i++) {
      if (service.cpmCosts[i].name == level) {
         return service.cpmCosts[i].field_cp_multiplier;
      }
   }
}

export function getBaseStats(pokemonName, pokemonLevel) {
   var index = -1;
   var baseAttack = -1;
   var baseDefense = -1;
   var baseHP = -1;
   var cpm = -1;
   var currPokemon = getPokemon(pokemonName);
   baseAttack = parseInt(currPokemon.atk);
   baseDefense = parseInt(currPokemon.def);
   baseHP = parseInt(currPokemon.sta);
   cpm = service.cpm[pokemonLevel];
   var stats = { bAtk: baseAttack, bDef: baseDefense, bHP: baseHP, cp_m: cpm };
   return stats;
}

export function calculateStardustCost(pokemonLevel, targetLevel) {
   var startingStardust = 0;
   var targetStardust = 0;

   var startingCandy = 0;
   var targetCandy = 0;

   var startingXLCandy = 0,
      targetXLCandy = 0;
   for (var i = 0; i < service.cpmCosts.length; i++) {
      if (service.cpmCosts[i].name == pokemonLevel) {
         startingStardust = service.cpmCosts[i].field_cumulative_stardust;
         startingCandy = service.cpmCosts[i].field_cumulative_candy;
         startingXLCandy = service.cpmCosts[i].field_cumulative_xl_candy
            ? service.cpmCosts[i].field_cumulative_xl_candy
            : 0;
      }

      if (service.cpmCosts[i].name == targetLevel) {
         targetStardust = service.cpmCosts[i].field_cumulative_stardust;
         targetCandy = service.cpmCosts[i].field_cumulative_candy;
         targetXLCandy = service.cpmCosts[i].field_cumulative_xl_candy
            ? service.cpmCosts[i].field_cumulative_xl_candy
            : 0;
      }
   }
   var stardustCost = targetStardust - startingStardust;
   var candyCost = targetCandy - startingCandy;
   var xlCandyCost = targetXLCandy - startingXLCandy;
   var costs = {
      stardust: stardustCost,
      candy: candyCost,
      xlCandy: xlCandyCost,
   };
   return costs;
}

export function getEvolutions(pokemon) {
   var currPokemon = getPokemon(pokemon);
   return getPokemonFamily(pokemon).list;
}

export function getPokemonFamily(pokemon) {
   // check base pokemon, check second stage, check third stage
   //title, field_stage_2_pokemon, field_stage_3_pokemon, respectively
   var evo_array = {
      list: [],
      by_stage: {
         base: [],
         stage_2: [],
         stage_3: [],
         stage_4: [],
      },
   };
   for (var i = 0; i < families.length; i++) {
      var currFamily = families[i];
      var stage_2 = currFamily.stage_2.split(", ");
      var stage_3 = currFamily.stage_3.split(", ");
      var stage_4 = currFamily.stage_4.split(", ");
      if (currFamily.base == pokemon) {
         //matched base pokemon, so return all stage 2 and stage 3 pokemon
         evo_array.by_stage.base = currFamily.base;
         if (currFamily.stage_2) {
            evo_array.list = evo_array.list.concat(stage_2);
            evo_array.by_stage.stage_2 = stage_2;
         }
         if (currFamily.stage_3) {
            evo_array.list = evo_array.list.concat(stage_3);
            evo_array.by_stage.stage_3 = stage_3;
         }
         if (currFamily.stage_4) {
            evo_array.list = evo_array.list.concat(stage_4);
            evo_array.by_stage.stage_4 = stage_4;
         }
         return evo_array;
      } else if (stage_2.includes(pokemon)) {
         evo_array.by_stage.base = currFamily.base;
         if (currFamily.stage_2) {
            evo_array.by_stage.stage_2 = stage_2;
         }
         if (currFamily.stage_3) {
            evo_array.list = evo_array.list.concat(stage_3);
            evo_array.by_stage.stage_3 = stage_3;
         }
         if (currFamily.stage_4) {
            evo_array.list = evo_array.list.concat(stage_4);
            evo_array.by_stage.stage_4 = stage_4;
         }
         return evo_array;
      }
   }
   return false; //no family found, or is max evolution
}

//returns the pokemon object containing all of the pokemon's data
export function getPokemon(pokemonName) {
   //get the pokemon's dex number from the translated list
   var index = -1;
   for (var i = 0; i < pokemonDataFull.length; i++) {
      if (pokemonDataFull[i].title_1 === pokemonName) {
         index = pokemonDataFull[i].number;
         break;
      }
   }
   //get the stats
   for (var i = 0; i < pokemonDataFull.length; i++) {
      var curr = pokemonDataFull[i];
      if (curr.number == index || curr.title_1 == pokemonName) {
         return curr;
      }
   }
}

export function getPokemonByNumber(number) {
   for (var i = 0; i < pokemonDataFull.length; i++) {
      var curr = pokemonDataFull[i];
      if (curr.number == number) {
         return curr;
      }
   }
}

//assumes mega evolutions don't cost anything in the way of candy. if they do end up costing candy, will need to rewrite this function.
export function calculateEvolutionCosts(startPokemon, evolutionTarget) {
   var evolutions = getPokemonFamily(startPokemon).by_stage;
   var cost = 0;
   if (evolutions.base == startPokemon) {
      cost += parseInt(getCostForSingleEvo(startPokemon));
      if (evolutions.stage_3.includes(evolutionTarget)) {
         var evo_idx = evolutions.stage_3.indexOf(evolutionTarget);
         var evo_cost2 = parseInt(
            getCostForSingleEvo(evolutions.stage_2[evo_idx]),
         );
         if (!isNaN(evo_cost2)) {
            cost += evo_cost2;
         }
      }
   } else if (evolutions.stage_2.includes(startPokemon)) {
      cost += parseInt(getCostForSingleEvo(startPokemon));
   }
   return cost;
}

export function getCostForSingleEvo(start) {
   for (var i = 0; i < evoCosts.length; i++) {
      if (evoCosts[i].title == start) {
         return evoCosts[i].field_evolution_requirements;
      }
   }
   return 0;
}

export function getBuddyDistance(pokemonName, candy) {
   //use pokemonname to get km per candy
   var kmString = "0 km";
   var km = 0;
   for (var i = 0; i < buddyDistances.length; i++) {
      if (buddyDistances[i].title == pokemonName) {
         kmString = buddyDistances[i].field_buddy_distance_requirement;
         //get just the number out of km
         var split = kmString.split(" ");
         km = parseInt(split[0]);
         break;
      }
   }
   var distance = km * candy;
   return distance;
}

export function getCatchRate(pokemonName) {
   for (var i = 0; i < pokemonDataFull.length; i++) {
      if (pokemonDataFull[i].title_1 == pokemonName) {
         var catchRate = pokemonDataFull[i].catch_rate;
         var splitt = catchRate.split(" ");
         var numRate = splitt[0];

         var fleeRate = pokemonDataFull[i].field_flee_rate.split(" ")[0];
         var results = { catchRate: numRate, fleeRate: fleeRate };
         return results;
      }
   }
}

//NOTE - this seems to break on farfetch'd? manually changed it on local file, might need to check live
export function getTypes(pokemonName) {
   var typesArr = {};
   for (var i = 0; i < types.length; i++) {
      if (types[i].title == pokemonName) {
         typesArr = types[i].field_pokemon_type;
         return typesArr;
      }
   }
}

export function getEntityId(pokemonName) {
   for (var i = 0; i < entityIds.length; i++) {
      if (entityIds[i].title == pokemonName) {
         return entityIds[i].nid;
      }
   }
}

/**
 * Breakpoint Calc
 */

export function getRaidStatsByName(name) {
   for (var i = 0; i < raidStats.length; i++) {
      if (raidStats[i].title == name) {
         return raidStats[i];
      }
   }
}

export function getMoveData(move) {
   for (var i = 0; i < moves.length; i++) {
      if (decodeHtml(moves[i].title) == move) {
         return {
            type: moves[i].field_move_element,
            power: parseInt(moves[i].field_move_damage),
         };
      }
   }
}

//     }
//   })();
