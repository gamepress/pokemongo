// (function() {
//   'use strict'

//   angular.module('pogoApp').service('calcData', calcData);
//   angular.module('cpCalc').service('calcData', calcData);
//   angular.module('catchCalc').service('calcData', calcData);
//   angular.module('trainerCalc').service('calcData', calcData);
//   angular.module('pogoAppBlock').service('calcData', calcData);
//   angular.module('bubbleCalc').service('calcData', calcData);
//   angular.module('dittoCalc').service('calcData', calcData);
//   angular.module('raidCalc').service('calcData', calcData);
//   angular.module('raidivCalc').service('calcData', calcData);
//   angular.module('breakpointCalc').service('calcData', calcData);
//   angular.module('bulkpointCalc').service('calcData', calcData);
//   angular.module('berryCalc').service('calcData', calcData);
//   angular.module('leagueCalc').service('calcData', calcData);

//   calcData.$inject = ['$http', '$location', 'gameData'];

// export function calcData($http, $location, gameData) {
//    var gameData = gameData;

//    var service = {
//       results: {},

//       calculate: calculate,
//       refine: refine,
//       calculateCP: calculateCP,
//       getEvolutions: getEvolutions,
//       calculateCatchRate: calculateCatchRate,
//       calculateSingleCatchRate: calculateSingleCatchRate,
//       calculateBubble: calculateBubble,
//       //ditto calc
//       calculateTransformCP: calculateTransformCP,
//       //raid iv calc
//       calculateRaidIVs: calculateRaidIVs,
//       calculateBreakpoint: calculateBreakpoint,
//       calculateBulkpoint: calculateBulkpoint,
//       calculateBerry: calculateBerry,
//       calculateLeague: calculateLeague,
//       floor: floor,
//    };
//    service.resultsCP = {
//       cp: "-",
//       hp: "-",
//       targetCP: "-",
//       targetHP: "-",
//       stardustCost: "-",
//       candyCost: "-",
//       distance: "-",
//       capturesRequired: "-",
//    };
//    service.resultsDitto = {
//       dittoCP: "-",
//       dittoHP: "-",
//       transformCP: "-",
//    };

//    service.resultsBreakpoint = {
//       attack: [],
//       defense: [],
//       color: [],
//       colorRaid: [],
//    };

//    service.resultsBerry = {
//       pinaps: null,
//       silver_pinaps: null,
//       golden_razzes: null,
//       catch_chance: null,
//       candy_haul: null,
//    };
//    service.resultsLeagueKeys = [];
//    return service;

export function calculateLeague(
   pokemonName,
   max_cp,
   max_lvl,
   sort,
   upDown,
   level,
   sta,
   atk,
   def,
) {
   var pokemon = gameData.getPokemon(pokemonName);
   pokemon.atk = parseInt(pokemon.atk);
   pokemon.def = parseInt(pokemon.def);
   pokemon.sta = parseInt(pokemon.sta);

   if (!sta) sta = 0;
   if (!atk) atk = 0;
   if (!def) def = 0;

   //sooo gonna be a lot of permutations here lol

   //and now, with the results, take the highest level with each permutation of atk/def/sta?
   const final_results = {};

   const own_results = {};
   own_results["own"] = {
      data: {},
   };

   //calculate inputted stats if they input them
   // if(level && level <= max_lvl && sta && atk && def){
   //   for(let lvl = level; lvl <= max_lvl; lvl = lvl + 0.5){
   //     const curr_cpm = gameData.getCPM(lvl);
   //     const cp = (curr_cpm * curr_cpm * (pokemon.atk + atk) * Math.sqrt(pokemon.def + def) * Math.sqrt(pokemon.sta + sta))/10
   //     if(cp > max_cp) break;
   //     if(cp < max_cp - 100 && lvl < max_lvl - 1) continue;

   //     const stat_prod_atk = (pokemon.atk + atk) * curr_cpm;
   //     const stat_prod_def = (pokemon.def + def) * curr_cpm;
   //     const stat_prod_sta = Math.floor((pokemon.sta + sta) * curr_cpm);
   //     const final_stat_prod = (stat_prod_atk * stat_prod_def * stat_prod_sta) / 1000;

   //     own_results["own"].data["" + lvl] = {
   //       "cp": cp,
   //       "stat_prod_atk": stat_prod_atk,
   //       "stat_prod_def": stat_prod_def,
   //       "stat_prod_sta": stat_prod_sta,
   //       "final_stat_prod": final_stat_prod
   //     }
   //   }
   // }
   let own_final_stat_prod = null;
   //calculate own pokemon at current level
   own_results["own_unchanged"] = "";
   if (level > max_lvl) {
      own_results["own_unchanged"] = "Your pokemon is over the maximum level.";
   } else {
      const own_curr_cpm = gameData.getCPM(level);
      const own_stat_prod_atk = (pokemon.atk + atk) * own_curr_cpm;
      const own_stat_prod_def = (pokemon.def + def) * own_curr_cpm;
      const own_stat_prod_sta = Math.floor((pokemon.sta + sta) * own_curr_cpm);
      const own_cp =
         (own_curr_cpm *
            own_curr_cpm *
            (pokemon.atk + atk) *
            Math.sqrt(pokemon.def + def) *
            Math.sqrt(pokemon.sta + sta)) /
         10;
      if (own_cp > max_cp) {
         own_results["own_unchanged"] = "Your pokemon is over the maximum CP.";
      } else {
         own_final_stat_prod =
            (own_stat_prod_atk * own_stat_prod_def * own_stat_prod_sta) / 1000;
      }
   }

   final_results[max_cp] = {
      data: {},
      highest: { data: null, value: -999 },
   };
   for (var key in final_results) {
      var max_cp = parseInt(key);
      for (var lvl = 1; lvl <= max_lvl; lvl = lvl + 0.5) {
         var curr_cpm = gameData.getCPM(lvl);
         for (var atk_iv = 0; atk_iv <= 15; atk_iv++) {
            var stat_prod_atk = (pokemon.atk + atk_iv) * curr_cpm;
            for (var def_iv = 0; def_iv <= 15; def_iv++) {
               var stat_prod_def = (pokemon.def + def_iv) * curr_cpm;
               for (var sta_iv = 0; sta_iv <= 15; sta_iv++) {
                  var stat_prod_sta = Math.floor(
                     (pokemon.sta + sta_iv) * curr_cpm,
                  );
                  var cp =
                     (curr_cpm *
                        curr_cpm *
                        (pokemon.atk + atk_iv) *
                        Math.sqrt(pokemon.def + def_iv) *
                        Math.sqrt(pokemon.sta + sta_iv)) /
                     10;
                  cp = Math.floor(cp);
                  if (cp > max_cp) {
                     break; //
                  }
                  if (cp < max_cp - 100 && lvl < max_lvl - 1) {
                     continue;
                  }
                  var final_stat_prod =
                     (stat_prod_atk * stat_prod_def * stat_prod_sta) / 1000;
                  var data_obj = {
                     level: lvl,
                     atk_iv: atk_iv,
                     def_iv: def_iv,
                     sta_iv: sta_iv,
                     cp: cp,
                     stat_prod_atk: stat_prod_atk,
                     stat_prod_def: stat_prod_def,
                     stat_prod_sta: stat_prod_sta,
                     final_stat_prod: final_stat_prod,
                  };
                  var key = atk_iv + "/" + def_iv + "/" + sta_iv;
                  if (!final_results[max_cp].data[key]) {
                     final_results[max_cp].data[key] = data_obj;
                  } else {
                     if (cp > final_results[max_cp].data[key].cp) {
                        final_results[max_cp].data[key] = data_obj;
                     }
                  }
                  if (final_stat_prod > final_results[max_cp].highest.value) {
                     final_results[max_cp].highest.data = data_obj;
                     final_results[max_cp].highest.value = final_stat_prod;
                  }
               }
            }
         }
      }
   }

   var sorted1500 = [];
   for (var key in final_results[max_cp].data) {
      sorted1500[sorted1500.length] = key;
   }
   //first sort to top 50 in terms of stat prod
   sorted1500.sort(function (a, b) {
      var aValue = final_results[max_cp].data[a].final_stat_prod;
      var bValue = final_results[max_cp].data[b].final_stat_prod;
      return bValue - aValue;
   });
   if (own_final_stat_prod) {
      if (
         final_results[max_cp].data[sorted1500[sorted1500.length - 1]]
            .final_stat_prod > own_final_stat_prod
      ) {
         own_results["own_unchanged"] =
            "Your pokemon meets the CP and level requirements, but is not in the top " +
            sorted1500.length +
            " pokemon.";
      } else {
         own_results["own_unchanged"] = calculateRankFromStatProd(
            own_final_stat_prod,
            final_results,
            sorted1500,
            max_cp,
         );
      }
   }
   //and now sort the top 50 by the user's selected sort
   var top50 = sorted1500.slice(0, 50);
   for (var i = 0; i < top50.length; i++) {
      //kinda hack-y way to get a persistent stat prod rank on each element
      var key = top50[i];
      final_results[max_cp].data[key].rank = i + 1;
   }
   top50.sort(function (a, b) {
      if (sort == "ivs") {
         var aSplit = a.split("/");
         var bSplit = b.split("/");
         if (upDown) {
            if (aSplit[0] != bSplit[0]) {
               return aSplit[0] - bSplit[0];
            }
            if (aSplit[1] != bSplit[1]) {
               return aSplit[1] - bSplit[1];
            }
            return aSplit[2] - bSplit[2];
         } else {
            if (aSplit[0] != bSplit[0]) {
               return bSplit[0] - aSplit[0];
            }
            if (aSplit[1] != bSplit[1]) {
               return bSplit[1] - aSplit[1];
            }
            return bSplit[2] - aSplit[2];
         }
      }
      var aValue = final_results[max_cp].data[a][sort];
      var bValue = final_results[max_cp].data[b][sort];
      if (upDown) {
         return aValue - bValue;
      }
      return bValue - aValue;
   });
   service.results = final_results;
   service.resultsLeagueKeys1500 = top50;
   service.resultsOwn = own_results;
}

export function calculateRankFromStatProd(
   own_final_stat_prod,
   final_results,
   sorted1500,
   max_cp,
) {
   let low = 0,
      high = sorted1500.length; // numElems is the size of the array i.e arr.size()
   while (low != high) {
      let mid = parseInt((low + high) / 2); // Or a fancy way to avoid int overflow
      if (
         final_results[max_cp].data[sorted1500[mid]].final_stat_prod >=
         own_final_stat_prod
      ) {
         /* This index, and everything below it, must not be the first element
          * greater than what we're looking for because this element is no greater
          * than the element.
          */
         low = mid + 1;
      } else {
         /* This element is at least as large as the element, so anything after it can't
          * be the first element that's at least as large.
          */
         high = mid;
      }
   }
   return "Your pokemon is rank #" + low + " out of " + sorted1500.length;
}

//ghetto way of injecting math into angular lol...
export function floor(num) {
   return Math.floor(num);
}

export function calculateBerry(
   pokemonNameRaid,
   balls,
   weather_boosted,
   radius,
   silver_pinap_budget,
   boss_candy_trade,
   boss_candy_base,
   boss_candy_pinap,
) {
   var pokemonRaid = gameData.getPokemon(pokemonNameRaid);

   var c1 = Math.max(balls - silver_pinap_budget, 0);

   var f15 = 0.667934;
   if (!weather_boosted) {
      f15 = 0.5974;
   }

   var catch_rate = parseFloat(pokemonRaid.catch_rate) / 100;
   var f16 = 1 - catch_rate / (2 * f15);
   f16 = Math.pow(f16, 1.7 * 1.3 * (2 - radius));

   var calc_array = {
      p_pinap: [],
      p_silver: [],
      p_golden: [],
      p_catch: [],
      e_candy: [],
   };
   for (var i = 0; i < 25; i++) {
      var curr_pinaps_value = Math.max(c1 - i, 0);
      var curr_silvers_value = silver_pinap_budget;
      var curr_goldens_value = Math.max(c1 - curr_pinaps_value, 0);

      var catchrates_e8 = 1 - f16;
      var e8 = 1 - Math.pow(1 - catchrates_e8, curr_pinaps_value);
      calc_array.p_pinap.push(e8);

      var catchrates_e9 = 1 - Math.pow(f16, 1.8);
      var e9 = (1 - e8) * (1 - Math.pow(1 - catchrates_e9, curr_silvers_value));
      calc_array.p_silver.push(e9);

      var catchrates_e10 = 1 - Math.pow(f16, 2.5);
      var e10 =
         (1 - e9 - e8) * (1 - Math.pow(1 - catchrates_e10, curr_goldens_value));
      calc_array.p_golden.push(e10);

      var e12 = e8 + e9 + e10;
      calc_array.p_catch.push(e12);

      var e13 =
         (boss_candy_pinap + boss_candy_trade) * (e8 + e9) +
         (boss_candy_base + boss_candy_trade) * e10;
      calc_array.e_candy.push(e13);
   }
   let b15 = calc_array.e_candy.indexOf(Math.max(...calc_array.e_candy)) - 1;
   var pinaps_to_use = c1 - b15;
   var silvers_to_use = Math.min(balls, silver_pinap_budget);
   var golds_to_use = b15;

   var b17 = calc_array.e_candy[b15];
   var b18 = calc_array.p_catch[b15];

   service.resultsBerry.pinaps = pinaps_to_use;
   service.resultsBerry.silver_pinaps = silvers_to_use;
   service.resultsBerry.golden_razzes = golds_to_use;
   service.resultsBerry.catch_chance = (b18 * 100).toLocaleString();
   service.resultsBerry.candy_haul = b17.toLocaleString();
}

export function calculateBulkpoint(
   pokemonName,
   pokemonNameRaid,
   quick,
   charge,
   weather,
   hpIV,
   attackIV,
   defenseIV,
   raidTier,
) {
   var table = document.getElementById("bulk-results");
   var noResults = document.getElementById("no-results");
   document.getElementById("bulk-table").style.display = "";
   noResults.innerHTML = "";
   table.innerHTML = "";

   var pokemon = gameData.getPokemon(pokemonName);
   var pokemonRaid = gameData.getPokemon(pokemonNameRaid);

   //move power and type
   var quickData = gameData.getMoveData(quick);
   var chargeData = gameData.getMoveData(charge);

   var quickType = quickData["type"];
   var quickPower = quickData["power"];

   var chargeType = chargeData["type"];
   var chargePower = chargeData["power"];

   //stab
   //TODO fix this function
   var type = gameData.getTypes(pokemonNameRaid);
   var defType = gameData.getTypes(pokemonName);
   var quickStab = 1,
      chargeStab = 1,
      shadowMult = 1;

   if (type.includes(quickType)) {
      quickStab = 1.2;
   }
   if (type.includes(chargeType)) {
      chargeStab = 1.2;
   }

   var shadowMult = 1;
   if (
      pokemon.field_shadow_pokemon_ == "On" ||
      pokemonRaid.field_shadow_pokemon_ == "On"
   ) {
      shadowMult = 1.2;
   }

   //type eff
   var quickEff = getEffectiveness(quickType, defType);
   var chargeEff = getEffectiveness(chargeType, defType);

   //weather boost
   var weathers = {
      Windy: ["Dragon", "Flying", "Psychic"],
      "Sunny/Clear": ["Grass", "Ground", "Fire"],
      Rain: ["Water", "Electric", "Bug"],
      Snow: ["Ice", "Steel"],
      Fog: ["Dark", "Ghost"],
      Cloudy: ["Fairy", "Fighting", "Poison"],
      "Partly Cloudy": ["Normal", "Rock"],
   };
   var types = weathers[weather];
   var quickWeather = getWeather(quickType, types);
   var chargeWeather = getWeather(chargeType, types);

   //cpm
   if (!raidTier) {
      raidTier = gameData.getRaidStatsByName(pokemonNameRaid).tier;
   }
   var raidCpm = 0;
   switch (raidTier) {
      case "1":
      case "2":
         raidCpm = 0.5974;
         break;
      // case "2":
      //   raidCpm = 0.67;
      // break;
      case "3":
      case "4":
         raidCpm = 0.73;
         break;
      // case "4":
      //   raidCpm = 0.79;
      // break;
      case "5":
      case "6":
      case "Mega":
         raidCpm = 0.79;
         break;
   }
   var baseStatsRaid = gameData.getBaseStats(pokemonNameRaid, i, false);
   var raidAttack = raidCpm * (parseInt(baseStatsRaid.bAtk) + 15);

   var types = weathers[weather];
   var quicksTakenArr = {}; //number of quick hits the pokemon can take at each level
   for (var i = 20; i <= 50; i = i + 0.5) {
      var baseStats = gameData.getBaseStats(pokemonName, i, false);
      var cpm = parseFloat(gameData.getCPM(i));
      if (!cpm) {
         continue;
      }

      //user pokemon stats
      var def = (baseStats.bDef + defenseIV) * cpm;
      var hp = (baseStats.bHP + hpIV) * cpm;

      // var currDamage = Math.floor(0.5 * movePower * (pokemonAttack/raidDefense) * stab * megaBoost * shadowMult * typeEff * weatherEff * friendshipBoost) + 1

      var quickDamage =
         Math.floor(
            0.5 *
               quickPower *
               (raidAttack / def) *
               quickStab *
               quickEff *
               quickWeather *
               shadowMult,
         ) + 1;
      var chargeDamage =
         Math.floor(
            0.5 *
               chargePower *
               (raidAttack / def) *
               chargeStab *
               chargeEff *
               chargeWeather *
               shadowMult,
         ) + 1;

      var hpAfterCharge = hp - chargeDamage;
      var quicksTaken = Math.floor(hpAfterCharge / quickDamage);
      var hpRemaining = Math.floor(hpAfterCharge % quickDamage);
      if (hpRemaining == 0 && quicksTaken > 0) {
         //no hp after last hit, so it doesn't count
         quicksTaken--;
         hpRemaining = quickDamage;
      }
      var hpText =
         "<br/>" + pokemonName + " has " + hpRemaining + "hp left.<br/>";
      if (quickDamage >= hpAfterCharge) {
         hpText = "";
      }

      if (quicksTaken == 0 && hpAfterCharge > 0) {
         //means they survived a charge move, but couldn't take any fast moves afterwards
         hpText =
            "<br/>" + pokemonName + " has " + hpAfterCharge + "hp left.<br/>";
      } else if (quicksTaken <= 0) {
         continue; //don't include less than 0 hits
      }

      //calculateCP(pokemonName, pokemon, pokemonLevel, attackIV, defenseIV, hpIV, targetLevel, targetEvolution, evolve, en)
      var cp = calculateCP(
         pokemonName,
         null,
         i,
         attackIV,
         defenseIV,
         hpIV,
         i,
         null,
         null,
         true,
      );

      if (quicksTakenArr["quicks" + quicksTaken] == null) {
         //only take min level to take x hits
         quicksTakenArr["quicks" + quicksTaken] = "done";
         var row = table.insertRow(table.rows.length);

         var levelCell = row.insertCell(0);
         levelCell.innerHTML = "" + i;
         row.appendChild(levelCell);

         var cpCell = row.insertCell(1);
         cpCell.innerHTML = cp;
         row.appendChild(cpCell);

         var numCell = row.insertCell(2);
         numCell.innerHTML = quicksTaken;

         var resultCell = row.insertCell(3);
         resultCell.style.textAlign = "left";
         resultCell.innerHTML =
            quick +
            " does " +
            quickDamage +
            " damage per hit, and " +
            charge +
            " does " +
            chargeDamage +
            " damage per hit." +
            hpText;
         row.appendChild(resultCell);
      }
   } //for levels

   //TODO check if no results
   var count = 0;
   for (var key in quicksTakenArr) {
      count++;
   }
   if (count == 0) {
      document.getElementById("bulk-table").style.display = "none";
      //pokemon always killed after one charge move
      noResults.innerHTML =
         pokemonName +
         " can't survive any hits after one " +
         charge +
         " at any level. <br/>";
   }
}

export function calculateBreakpoint(
   pokemonName,
   pokemonMove,
   pokemonNameRaid,
   pokemonMoveRaid,
   weather,
   friendship,
   ally_mega,
   ally_mega_stab,
   raidTier,
) {
   var pokemon = gameData.getPokemon(pokemonName);
   var pokemonRaid = gameData.getPokemon(pokemonNameRaid);
   var friendshipBoost = parseFloat(friendship);
   //check for stab
   var type = gameData.getTypes(pokemonName);
   var typeRaid = gameData.getTypes(pokemonNameRaid);
   var moveData = gameData.getMoveData(pokemonMove);
   var moveDataRaid = gameData.getMoveData(pokemonMoveRaid);

   var moveType = moveData["type"];
   var movePower = moveData["power"];

   var moveTypeRaid = moveDataRaid["type"];
   var movePowerRaid = moveDataRaid["power"];

   var weathers = {
      Windy: ["Dragon", "Flying", "Psychic"],
      "Sunny/Clear": ["Grass", "Ground", "Fire"],
      Rain: ["Water", "Electric", "Bug"],
      Snow: ["Ice", "Steel"],
      Fog: ["Dark", "Ghost"],
      Cloudy: ["Fairy", "Fighting", "Poison"],
      "Partly Cloudy": ["Normal", "Rock"],
   };

   var types = weathers[weather];

   var stab = 1,
      stabRaid = 1;

   // TODO verify that mega/shadow actually does work like this
   var megaBoost = 1;
   if (type.includes(moveType)) {
      stab = 1.2;
   }

   if (ally_mega) {
      megaBoost = 1.1;
   }
   if (ally_mega && ally_mega_stab) {
      megaBoost = 1.3;
   }

   if (typeRaid.includes(moveTypeRaid)) {
      stabRaid = 1.2;
   }
   var shadowMult = 1;
   if (pokemon.field_shadow_pokemon_ == "On") {
      shadowMult = 1.2;
   }
   if (pokemonRaid.field_shadow_pokemon_ == "On") {
      shadowMult = 1.2;
   }

   var typeEff = getEffectiveness(moveType, typeRaid);
   var weatherEff = getWeather(moveType, types);
   var typeEffRaid = getEffectiveness(moveTypeRaid, type);
   var weatherEffRaid = getWeather(moveTypeRaid, types);
   var attackResults = [];
   for (var i = 5; i <= 51; i = i + 0.5) {
      var baseStats = gameData.getBaseStats(pokemonName, i, false);
      if (!baseStats) {
         continue;
      }
      // if(ally_mega /*|| pokemonName.startsWith("Mega ")*/){
      //   baseStats.bAtk = Math.floor(baseStats.bAtk * 1.1);
      //   baseStats.bDef = Math.floor(baseStats.bDef * 1.1);
      // }

      var baseStatsRaid = gameData.getBaseStats(pokemonNameRaid);
      var raidBaseDef = parseInt(baseStatsRaid.bDef);
      var raidBaseAtk = parseInt(baseStatsRaid.bAtk);
      if (!raidTier) {
         raidTier = gameData.getRaidStatsByName(pokemonNameRaid).tier;
      }
      var raidCpm = 0;
      switch (raidTier) {
         case "1":
         case "2":
            raidCpm = 0.5974;
            break;
         // case "2":
         //   raidCpm = 0.67;
         // break;
         case "3":
         case "4":
            raidCpm = 0.73;
            break;
         // case "4":
         //   raidCpm = 0.79;
         // break;
         case "5":
         case "6":
         case "Mega":
            raidCpm = 0.79;
            break;
      }
      var cpm = parseFloat(gameData.getCPM(i));
      var currDamages = [];
      var currDamagesRaid = [];
      //TODO highlight lowest and highest
      for (var j = 0; j <= 15; j++) {
         var pokemonAttack = (baseStats.bAtk + j) * cpm;
         var pokemonDefense = (baseStats.bDef + j) * cpm;
         var raidAttack = (raidBaseAtk + 15) * raidCpm;
         var raidDefense = (raidBaseDef + 15) * raidCpm;
         var currDamage =
            Math.floor(
               0.5 *
                  movePower *
                  (pokemonAttack / raidDefense) *
                  stab *
                  megaBoost *
                  shadowMult *
                  typeEff *
                  weatherEff *
                  friendshipBoost,
            ) + 1;
         var currDamageRaid =
            Math.floor(
               0.5 *
                  movePowerRaid *
                  (raidAttack / pokemonDefense) *
                  stabRaid *
                  shadowMult *
                  typeEffRaid *
                  weatherEffRaid,
            ) + 1;
         currDamages.push(currDamage);
         currDamagesRaid.push(currDamageRaid);
      }
      service.resultsBreakpoint.attack[i] = currDamages;
      service.resultsBreakpoint.defense[i] = currDamagesRaid;
   }
   var highest = 0,
      nextHighest = 0,
      highestRaid = 0,
      nextHighestRaid = 0;
   var lowest = 9999,
      nextLowest = 0,
      lowestRaid = 9999,
      nextLowestRaid = 0;
   for (var i = 20; i <= 51; i += 0.5) {
      var currAttack = service.resultsBreakpoint.attack[i];
      if (!currAttack) {
         continue;
      }
      var currDef = service.resultsBreakpoint.defense[i];
      for (var j = 0; j < currAttack.length; j++) {
         if (currAttack[j] < lowest) {
            lowest = currAttack[j];
         }
         if (currAttack[j] > highest) {
            highest = currAttack[j];
         }

         if (currDef[j] < lowestRaid) {
            lowestRaid = currDef[j];
         }
         if (currDef[j] > highestRaid) {
            highestRaid = currDef[j];
         }
      }
   }

   var nextHighest = highest - 1;
   var nextLowest = lowest + 1;
   var nextHighestRaid = highestRaid - 1;
   var nextLowestRaid = lowestRaid + 1;
   var darkRed = "#E67C73",
      pink = "#EEA7A1",
      lightgreen = "#ABDDC5",
      darkgreen = "#57BB8A";
   for (var i = 20; i <= 51; i += 0.5) {
      var currAttack = service.resultsBreakpoint.attack[i];
      if (!currAttack) {
         continue;
      }
      var currDef = service.resultsBreakpoint.defense[i];
      var currColors = [],
         currColorsRaid = [];
      for (var j = 0; j < currAttack.length; j++) {
         switch (currAttack[j]) {
            case highest:
               currColors.push(darkgreen);
               break;
            case lowest:
               currColors.push(darkRed);
               break;
            case nextHighest:
               currColors.push(lightgreen);
               break;
            case nextLowest:
               currColors.push(pink);
               break;
            default:
               currColors.push("white");
               break;
         }
         switch (currDef[j]) {
            case highestRaid:
               currColorsRaid.push(darkRed);
               break;
            case lowestRaid:
               currColorsRaid.push(darkgreen);
               break;
            case nextHighestRaid:
               currColorsRaid.push(pink);
               break;
            case nextLowestRaid:
               currColorsRaid.push(lightgreen);
               break;
            default:
               currColorsRaid.push("white");
               break;
         }
      }

      service.resultsBreakpoint["color"][i] = currColors;
      service.resultsBreakpoint["colorRaid"][i] = currColorsRaid;
   }

   // TODO do this for levels x to 20, only do lowest
   var highest = 0,
      nextHighest = 0,
      highestRaid = 0,
      nextHighestRaid = 0;
   var lowest = 9999,
      nextLowest = 0,
      lowestRaid = 9999,
      nextLowestRaid = 0;
   for (var i = 5; i <= 19.5; i += 0.5) {
      var currAttack = service.resultsBreakpoint.attack[i];
      var currDef = service.resultsBreakpoint.defense[i];
      for (var j = 0; j < currAttack.length; j++) {
         if (currAttack[j] < lowest) {
            lowest = currAttack[j];
         }
         if (currAttack[j] > highest) {
            highest = currAttack[j];
         }

         if (currDef[j] < lowestRaid) {
            lowestRaid = currDef[j];
         }
         if (currDef[j] > highestRaid) {
            highestRaid = currDef[j];
         }
      }
   }

   var nextHighest = highest - 1;
   var nextLowest = lowest + 1;
   var nextHighestRaid = highestRaid - 1;
   var nextLowestRaid = lowestRaid + 1;
   var darkRed = "#E67C73",
      pink = "#EEA7A1",
      lightgreen = "#ABDDC5",
      darkgreen = "#57BB8A";
   for (var i = 5; i <= 19.5; i += 0.5) {
      var currAttack = service.resultsBreakpoint.attack[i];
      var currDef = service.resultsBreakpoint.defense[i];
      var currColors = [],
         currColorsRaid = [];
      for (var j = 0; j < currAttack.length; j++) {
         switch (currAttack[j]) {
            case lowest:
               currColors.push(darkRed);
               break;
            case nextLowest:
               currColors.push(pink);
               break;
            default:
               currColors.push("white");
               break;
         }
         switch (currDef[j]) {
            case highestRaid:
               currColorsRaid.push(darkRed);
               break;
            case nextHighestRaid:
               currColorsRaid.push(pink);
               break;
            default:
               currColorsRaid.push("white");
               break;
         }
      }
      service.resultsBreakpoint["color"][i] = currColors;
      service.resultsBreakpoint["colorRaid"][i] = currColorsRaid;
   }
}

export function getWeather(type, types) {
   if (!types) {
      return 1;
   }
   for (var i = 0; i < types.length; i++) {
      if (types[i] == type) {
         return 1.2;
      }
   }
   return 1;
}

export function calculateSingleCP(
   pokemonName,
   pokemon,
   pokemonLevel,
   attackIV,
   defenseIV,
   hpIV,
   targetLevel,
   targetEvolution,
   evolve,
   en,
   lucky,
) {
   var baseStats = gameData.getBaseStats(pokemonName, pokemonLevel, en);
   var baseStatsTarget = null;
   var evoCost = 0;

   var cpm = gameData.getCPM(pokemonLevel); //might need to check if this is correct
   var targetCpm = gameData.getCPM(targetLevel);

   //CP = CPM^2 * (Base_Attack+Attack IV) * (Base_Defense + Defense_IV)^.5 * (Base_HP +HP_IV)^.5 / 10
   var cp =
      (cpm *
         cpm *
         (baseStats.bAtk + attackIV) *
         Math.sqrt(baseStats.bDef + defenseIV) *
         Math.sqrt(baseStats.bHP + hpIV)) /
      10;
   var hp = cpm * (baseStats.bHP + hpIV);
   var targetCP =
      (targetCpm *
         targetCpm *
         (baseStats.bAtk + attackIV) *
         Math.sqrt(baseStats.bDef + defenseIV) *
         Math.sqrt(baseStats.bHP + hpIV)) /
      10;
   var targetHP = targetCpm * (baseStats.bHP + hpIV);
   if (targetEvolution != null && evolve) {
      baseStatsTarget = gameData.getBaseStats(targetEvolution, pokemonLevel);
      targetCP =
         (targetCpm *
            targetCpm *
            (baseStatsTarget.bAtk + attackIV) *
            Math.sqrt(baseStatsTarget.bDef + defenseIV) *
            Math.sqrt(baseStatsTarget.bHP + hpIV)) /
         10;

      targetHP = targetCpm * (baseStatsTarget.bHP + hpIV);
      evoCost = gameData.calculateEvolutionCosts(pokemonName, targetEvolution);
   }

   cp = Math.floor(cp);
   hp = Math.floor(hp);
   targetCP = Math.floor(targetCP);
   targetHP = Math.floor(targetHP);
   return [cp, hp, targetCP, targetHP];
}

// var levels = ["1", "1.5", "2", "2.5", "3", "3.5", "4", "4.5", "5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9"]

export function calculateCP(
   pokemonName,
   pokemon,
   pokemonLevel,
   attackIV,
   defenseIV,
   hpIV,
   targetLevel,
   targetEvolution,
   evolve,
   en,
   lucky,
   shadow,
   purify,
   purified_shadow,
) {
   var baseStats = gameData.getBaseStats(pokemonName, pokemonLevel, en);
   var baseStatsTarget = null;
   var evoCost = 0;

   //shadow pokemon cost 10% less stardust to level up
   var levelCostMult = 1;
   //shadow pokemon cost 20% more stardust to level up
   if (shadow) {
      levelCostMult = 1.2;
   }
   //purified shadow pokemon cost 10% less stardust to level up (assuming this overrides the shadow cost)
   else if (purified_shadow) {
      levelCostMult = 0.9;
   }

   var cpData = calculateSingleCP(
      pokemonName,
      pokemon,
      pokemonLevel,
      attackIV,
      defenseIV,
      hpIV,
      targetLevel,
      targetEvolution,
      evolve,
      en,
      lucky,
   );
   var cp = cpData[0];
   var hp = cpData[1];
   var targetCP = cpData[2];
   var targetHP = cpData[3];

   var currResults = [];
   var currTable = document.getElementById("all-cp-table");
   if (currTable) {
      for (var i = 10; i <= 500; i += 5) {
         var currLevel = i / 10;
         //no .5 increments past 40
         if (currLevel > 50 && Math.floor(currLevel) != currLevel) {
            continue;
         }
         var currData = calculateSingleCP(
            pokemonName,
            pokemon,
            pokemonLevel,
            attackIV,
            defenseIV,
            hpIV,
            currLevel,
            targetEvolution,
            evolve,
            en,
            lucky,
         );
         currResults.push([currData[2], currData[3]]);

         var currRow = currTable.insertRow(0);

         var levelCell = document.createElement("th");
         levelCell.innerHTML = currLevel;
         currRow.appendChild(levelCell);

         var cpCell = currRow.insertCell(1);
         cpCell.innerHTML = currData[2];

         var hpCell = currRow.insertCell(2);
         hpCell.innerHTML = currData[3];
      }
      document.getElementById("show-all-cp").disabled = false;
   }

   var dontShowCP = attackIV == null || defenseIV == null || hpIV == null;
   if (dontShowCP) {
      targetCP = "-";
      targetHP = "-";
   }
   if (pokemonLevel > 50) {
      pokemonLevel -= 1;
   } else {
      pokemonLevel = pokemonLevel - 0.5;
   }
   if (targetLevel > 50) {
      targetLevel -= 1;
   } else {
      targetLevel -= 0.5;
   }
   var costs = gameData.calculateStardustCost(pokemonLevel, targetLevel);
   var stardustCost = costs.stardust * levelCostMult;
   if (lucky) {
      stardustCost = stardustCost / 2;
   }
   if (evolve && targetEvolution) {
      evoCost = gameData.calculateEvolutionCosts(pokemonName, targetEvolution);
   }
   if (purified_shadow) {
      evoCost = evoCost * levelCostMult;
   }
   var candyCost = costs.candy * levelCostMult + evoCost;
   candyCost = Math.ceil(candyCost);

   var xlCandyCost = Math.ceil(costs.xlCandy * levelCostMult);

   //lastly, check if they want to add the purification costs
   if ((shadow || purified_shadow) && purify) {
      if (pokemon.purification_candy) {
         candyCost += parseInt(pokemon.purification_candy);
      }
      if (pokemon.purification_dust) {
         stardustCost += parseInt(pokemon.purification_dust);
      }
   }

   var distance = gameData.getBuddyDistance(pokemonName, candyCost);
   var capturesRequired = Math.ceil(candyCost / 3);
   var showTable = true;

   if (isNaN(targetCP)) {
      targetCP = "-";
   }
   if (isNaN(targetHP)) {
      targetHP = "-";
   }

   if (cp < 10) {
      cp = 10;
   }

   if (targetCP < 10) {
      targetCP = 10;
   }

   if (hp < 10) {
      hp = 10;
   }

   if (targetHP < 10) {
      targetHP = 10;
   }

   if (isNaN(candyCost)) {
      candyCost = "unknown";
   }

   if (isNaN(xlCandyCost)) {
      xlCandyCost = "unknown";
   }

   if (isNaN(distance)) {
      distance = "unknown";
   }

   if (isNaN(capturesRequired)) {
      capturesRequired = "unknown";
   }

   service.resultsCP = {
      cp: cp + " CP",
      hp: hp + " HP",
      targetCP: targetCP + " CP",
      targetHP: targetHP + " HP",
      stardustCost: stardustCost + " Stardust",
      candyCost: candyCost + " Candy",
      distance: distance + " KM",
      capturesRequired: capturesRequired + " Pokemon",
      xlCandyCost: xlCandyCost + " Candy",
   };

   return targetCP;
}

export function getEvolutions(pokemon) {
   return gameData.getEvolutions(pokemon);
}

export function calculateCatchRate(
   pokemonName,
   level,
   ball,
   curve,
   berry,
   goldenBerry,
   silverBerry,
   throwRate,
   medal1,
   medal2,
   type2,
   excludeThrow,
   raid,
   balls,
) {
   //alert(pokemonName + " " + level + " " + ball + " " + curve + " " + berry + " " + throwComment + " " + medals);
   //catch probability =  1 - (1-bcr/ 2 /cpm)^Multipliers
   //multipliers =
   // Ball {Poke Ball, Great Ball, Excellent Ball} = {1, 1.5,2}
   // Curve {Straight, Curve ball} = {1, 1.7}
   // Razz berry {No, Yes} = {1, 1.5}
   // Throws {ordinary, nice, great, excellent} = {1, 1.15, 1.5, 1.825} average,
   // ---actually {2 - color target ring radius/white ring radius} dynamic
   // Medal {none, none/bronze, bronze, bronze/silver, silver, silver/gold, gold}  = {1,1.05,1.1,1.15,1.2,1.25,1.3}
   var ballRate = 0,
      curveRate = 1,
      berryRate = 1,
      medalRate = 0;
   throwRate = 2 - throwRate;
   throwRate = Math.round(throwRate * 100) / 100;
   if (excludeThrow) {
      throwRate = 1;
   }

   switch (ball) {
      case "Ultra Ball":
         ballRate = 2;
         break;
      case "Great Ball":
         ballRate = 1.5;
         break;
      case "Poke Ball":
         ballRate = 1;
         break;
   }

   if (curve == true) {
      curveRate = 1.7;
   }

   if (berry == true) {
      berryRate = 1.5;
   } else if (goldenBerry == true) {
      berryRate = 2.5;
   } else if (silverBerry == true) {
      berryRate = 1.8;
   }

   //easier way: none = 1, bronze = 1.1, silver = 1.2, gold = 1.3
   //take the average between the two typings
   var medalRate1 = getMedalRate(medal1);
   var medalRate2 = getMedalRate(medal2);
   if (medal2 == null) {
      if (type2) {
         //if there's a second type, but they didn't select a medal for it
         //default to the value for "none"
         medalRate = (medalRate1 + 1) / 2;
      } else {
         medalRate = medalRate1;
      }
   } else {
      medalRate = (medalRate1 + medalRate2) / 2;
   }
   medalRate = roundToTwo(medalRate);
   //catch probability =  1 - (1-bcr/ 2 * cpm)^Multipliers
   var enName = gameData.getPokemon(pokemonName).title_1;
   var rates = gameData.getCatchRate(enName);
   var baseCatchRate = rates.catchRate / 100;
   var fleeRate = rates.fleeRate / 100;

   var cpm = parseFloat(gameData.getCPM(level));
   var multiplier = ballRate * curveRate * berryRate * throwRate * medalRate;
   multiplier = Math.round(multiplier * 100) / 100;
   var inner = 1 - Math.min(1, baseCatchRate / (2 * cpm));
   var catchProbability1 = 1 - Math.pow(inner, multiplier); //probability per throw

   //=C21/(1-(1-C21)*(1-C10))
   var overallCatchRate =
      catchProbability1 / (1 - (1 - catchProbability1) * (1 - fleeRate));
   var finalCatchProbability1 = Math.round(catchProbability1 * 100);
   var finalOverallCatchRate = Math.round(overallCatchRate * 100);
   var fleeProbability = 100 - finalOverallCatchRate;
   //=1/(1-(1-C21)*(1-C10))
   var expectedThrows = 1 / (1 - (1 - catchProbability1) * (1 - fleeRate));
   expectedThrows = Math.round(expectedThrows * 100) / 100;

   //layout of first 10 throws
   var catchChances = []; //[0,0,0,0,0,0,0,0,0,0];
   var fleeChances = [];
   var catchByChances = [];
   catchByChances[0] = finalCatchProbability1;
   var currIndex = 0;
   var fleeByChances = [];
   var continueChances = [];
   var chances = 10;
   if (balls) {
      chances = balls;
   }
   for (var i = 1; i <= chances; i++) {
      //chance to catch on this throw
      catchChances[i - 1] =
         Math.pow(1 - catchProbability1, i - 1) *
         Math.pow(1 - fleeRate, i - 1) *
         catchProbability1;
      catchChances[i - 1] = Math.round(catchChances[i - 1] * 100);
      fleeChances[i - 1] =
         Math.pow(1 - catchProbability1, i) *
         Math.pow(1 - fleeRate, i - 1) *
         fleeRate;
      fleeChances[i - 1] = Math.round(fleeChances[i - 1] * 100);

      //since the boss can't flee, just take out flee rate part? (not sure, just guessing)
      if (raid) {
         catchChances[i - 1] =
            Math.pow(1 - catchProbability1, i - 1) * catchProbability1;
         // TODO re-add rounding at the end instead
         catchChances[i - 1] = catchChances[i - 1] * 100;
      }

      var catchByChanceVal = 0;
      var fleeByChanceVal = 0;
      for (var j = 0; j < catchChances.length; j++) {
         catchByChanceVal = catchByChanceVal + catchChances[j];
         fleeByChanceVal = fleeByChanceVal + fleeChances[j];
      }
      catchByChances[i - 1] = catchByChanceVal;
      fleeByChances[i - 1] = fleeByChanceVal;
      if (!raid) {
         continueChances[i - 1] = 100 - catchByChanceVal - fleeByChanceVal;
      }
      //raid bosses can't flee
      else {
         continueChances[i - 1] = 100 - catchByChanceVal;
      }
   }

   //since bosses can't flee, the final catch rate is just how likely you are to catch it by your last ball
   if (raid) {
      finalOverallCatchRate = Math.round(
         catchByChances[catchByChances.length - 1],
      );
      for (var j = 0; j < catchChances.length; j++) {
         catchByChances[j] = Math.round(catchByChances[j]);
         catchChances[j] = Math.round(catchChances[j]);
         continueChances[j] = 100 - catchByChances[j];
      }
   }

   service.results = {
      chancePerThrow: finalCatchProbability1,
      overallCatchRate: finalOverallCatchRate,
      fleeRate: fleeProbability,
      expectedThrows: expectedThrows,
      catchChances: catchChances,
      fleeChances: fleeChances,
      catchByChances: catchByChances,
      fleeByChances: fleeByChances,
      continueChances: continueChances,
      ballRate: ballRate,
      curveRate: curveRate,
      berryRate: berryRate,
      throwRate: throwRate,
      medalRate: medalRate,
      multiplier: multiplier,
      stats: ["0"], //dummy variable that tells the ng-show that we're ready to show the data
   };
}

export function roundToTwo(number) {
   return Math.round(number * 100) / 100;
}

export function calculateSingleCatchRate(
   pokemonName,
   level,
   ball,
   curve,
   berry,
   goldenBerry,
   throwRate,
   medal1,
   medal2,
   type2,
) {
   var ballRate = 1,
      curveRate = 1,
      berryRate = 1,
      medalRate = 1;
   throwRate = 2 - throwRate;
   switch (ball) {
      case "Ultra Ball":
         ballRate = 2;
         break;
      case "Great Ball":
         ballRate = 1.5;
         break;
      case "Poke Ball":
         ballRate = 1;
         break;
   }

   if (berry) {
      berryRate = 1.5;
   } else if (goldenBerry) {
      berryRate = 2.5;
   }

   //catch probability =  1 - (1-bcr/ 2 * cpm)^Multipliers
   var enName = gameData.getPokemon(pokemonName).title_1;
   var rates = gameData.getCatchRate(enName);
   var baseCatchRate = rates.catchRate / 100;

   var cpm = gameData.getCPM(level);
   var inner = 1 - Math.min(1, baseCatchRate / (2 * cpm));
   //since color is affected by berries now
   var exp = ballRate * berryRate;
   var catchProbability1 = 1 - Math.pow(inner, exp); //probability per throw

   var throwComment = "Nice!";
   if (throwRate < 1.3) {
      throwComment = "Nice!";
   } else if (throwRate < 1.7) {
      throwComment = "Great!";
   } else {
      throwComment = "Excellent!";
   }
   var targetInfo = {
      catchProbability1: catchProbability1,
      throwComment: throwComment,
   };
   return targetInfo;
}

export function getMedalRate(medal) {
   switch (medal) {
      case "None":
         return 1;
         break;
      case "Bronze":
         return 1.1;
         break;
      case "Silver":
         return 1.2;
         break;
      case "Gold":
         return 1.3;
         break;
      case "Platinum":
         return 1.4;
         break;
      default:
         return 1;
         break;
   }
}
//lvl 20
//cpm = 0.5974001
export function calculateRaidIVs(pokemonName, pokemon, cp, weather) {
   service.results = {
      name: pokemonName,
      data: pokemon,
      cp: cp,
      hp: hp,
      minIV: 45,
      avgIV: 0,
      maxIV: 0,
      stats: [],
   };
   var LVL = 20;
   var ECpM = 0.59740001;
   if (weather) {
      ECpM = 0.667934;
   }
   //check every combination of IVs for a CP match
   for (var hp = 10; hp <= 15; hp++) {
      for (var atk = 10; atk <= 15; atk++) {
         for (var def = 10; def <= 15; def++) {
            //CP = (Attack * Defense^0.5 * Stamina^0.5 * CP_Multiplier^2) / 10
            var attack = parseInt(pokemon.atk) + atk;
            var defense = parseInt(pokemon.def) + def;
            var stamina = parseInt(pokemon.sta) + hp;
            var currCP =
               attack * Math.sqrt(defense) * Math.sqrt(stamina) * ECpM * ECpM;
            currCP = Math.floor(currCP / 10);
            if (hp == 15 && atk == 15 && def == 15) {
               var def2 = Math.sqrt(defense);
               var sta2 = Math.sqrt(stamina);
               var cpm2 = Math.pow(ECpM, 2);
            }
            if (currCP == cp) {
               var hp2 = Math.floor(ECpM * (parseInt(pokemon.sta) + hp));
               var result = {
                  HPIV: hp,
                  ATK: atk,
                  DEF: def,
                  total: hp + atk + def,
                  CP: cp,
                  HP: hp2,
               };
               service.results.stats.push(result);
            }
         } //def
      } //atk
   } //for var hp
}
// TODO change this to use a dictionary maybe?
export function calculate(
   pokemonName,
   pokemon2,
   cp,
   hp,
   isPoweredUp,
   factor,
   minLevel,
   overall,
   stats,
   highHP,
   highATK,
   highDEF,
   hatched,
   atts,
   hps,
   defs,
   bubble,
   maxLevel,
   lucky,
) {
   var pokemon = gameData.getBaseStats(pokemonName, 10);
   service.results = {
      name: pokemonName,
      data: pokemon,
      cp: cp,
      hp: hp,
      isPoweredUp: isPoweredUp,
      minIV: 45,
      avgIV: 0,
      maxIV: 0,
      stats: [],
   };
   var minATK = 0,
      minHP = 0,
      minDEF = 0;
   var maxATK = 16,
      maxHP = 16,
      maxDEF = 16;
   if (hatched) {
      (minATK = 10), (minHP = 10), (minDEF = 10);
   }
   if (lucky) {
      (minATK = 12), (minHP = 12), (minDEF = 12);
   }

   if (atts) {
      (minATK = atts), (maxATK = atts);
   }
   if (hps) {
      (minHP = hps), (maxHP = hp);
   }
   if (defs) {
      (minDEF = def), (maxDEF = defs);
   }
   var end = minLevel + 1.5;
   if (maxLevel) {
      end = maxLevel;
   }
   for (var i = minLevel; i <= end; i = i + factor) {
      var LVL = i;
      var ECpM = gameData.getCPM(i);
      for (var HP = minHP; HP < maxHP; HP++) {
         var THP = Math.floor(ECpM * (pokemon.bHP + HP));
         THP = THP < 10 ? 10 : THP;

         if (THP == hp) {
            for (var ATK = minATK; ATK < maxATK; ATK++) {
               for (var DEF = minDEF; DEF < maxDEF; DEF++) {
                  var CP = Math.floor(
                     ((pokemon.bAtk + ATK) *
                        Math.pow(pokemon.bDef + DEF, 0.5) *
                        Math.pow(pokemon.bHP + HP, 0.5) *
                        Math.pow(ECpM, 2)) /
                        10,
                  );
                  CP = CP < 10 ? 10 : CP;
                  if (CP == cp) {
                     var result = {
                        level: LVL,
                        HP: HP,
                        ATK: ATK,
                        DEF: DEF,
                        total: HP + ATK + DEF,
                     };
                     var accept = true;

                     //Check Leader Feedback
                     if (overall) {
                        if (
                           overall.min <= result.total &&
                           result.total <= overall.max
                        ) {
                           if (stats) {
                              if (highHP) {
                                 if (
                                    result.HP < result.ATK ||
                                    result.HP < result.DEF
                                 ) {
                                    accept = false;
                                 }
                                 if (result.HP == result.ATK && !highATK) {
                                    accept = false;
                                 }
                                 if (result.HP == result.DEF && !highDEF) {
                                    accept = false;
                                 }
                                 if (
                                    result.HP < stats.min ||
                                    stats.max < result.HP
                                 ) {
                                    accept = false;
                                 }
                              }
                              if (highATK) {
                                 if (
                                    result.ATK < result.HP ||
                                    result.ATK < result.DEF
                                 ) {
                                    accept = false;
                                 }
                                 if (result.ATK == result.HP && !highHP) {
                                    accept = false;
                                 }
                                 if (result.ATK == result.DEF && !highDEF) {
                                    accept = false;
                                 }
                                 if (
                                    result.ATK < stats.min ||
                                    stats.max < result.ATK
                                 ) {
                                    accept = false;
                                 }
                              }
                              if (highDEF) {
                                 if (
                                    result.DEF < result.ATK ||
                                    result.DEF < result.HP
                                 ) {
                                    accept = false;
                                 }
                                 if (result.DEF == result.HP && !highHP) {
                                    accept = false;
                                 }
                                 if (result.DEF == result.ATK && !highATK) {
                                    accept = false;
                                 }
                                 if (
                                    result.DEF < stats.min ||
                                    stats.max < result.DEF
                                 ) {
                                    accept = false;
                                 }
                              }
                           }
                        } else {
                           accept = false;
                        }
                     }

                     if (accept) {
                        if (service.results.minIV > result.total) {
                           service.results.minIV = result.total;
                        }
                        if (service.results.maxIV < result.total) {
                           service.results.maxIV = result.total;
                        }
                        service.results.avgIV =
                           (service.results.minIV + service.results.maxIV) / 2;
                        service.results.stats.push(result);
                     }
                  }
               }
            }
         }
      }
   }
}

export function refine(pokemonName, pokemon, refine) {
   var stats = service.results.stats;
   service.results = {
      name: pokemonName,
      data: pokemon,
      minIV: 45,
      avgIV: 0,
      maxIV: 0,
      stats: [],
   };

   for (var i = 0; i < stats.length; i++) {
      var factor = refine.isPoweredUp ? 0.5 : 1;
      var minLevel = refine.minLevel;
      var result = stats[i];
      var end = minLevel + 1.5;
      if (refine.maxLevel) {
         end = refine.maxLevel;
      }
      for (var i = minLevel; i <= end; i = i + factor) {
         var ECpM = gameData.getCPM(j);
         var HP = Math.floor(ECpM * (parseInt(pokemon.sta) + result.HP));
         var CP = Math.floor(
            ((parseInt(pokemon.atk) + result.ATK) *
               Math.pow(parseInt(pokemon.def) + result.DEF, 0.5) *
               Math.pow(parseInt(pokemon.sta) + result.HP, 0.5) *
               Math.pow(ECpM, 2)) /
               10,
         );
         if (CP == refine.cp && HP == refine.hp) {
            if (service.results.minIV > result.total) {
               service.results.minIV = result.total;
            }
            if (service.results.maxIV < result.total) {
               service.results.maxIV = result.total;
            }
            service.results.avgIV =
               (service.results.minIV + service.results.maxIV) / 2;
            service.results.stats.push(result);
         }
      }
   }
}

/**
    Bubble Calc
    */
export function calculateBubble(
   pokemon,
   pokemonName,
   move,
   attIV,
   defIV,
   hpIV,
   level,
   moves,
   movesEN,
   calcIVs,
   cp,
   hp2,
   isPoweredUp,
   factor,
   minLevel,
   overall,
   stats,
   highHP,
   highATK,
   highDEF,
   hatched,
) {
   var cooldown = move.field_move_cooldown * 1000;
   var attDelay = 899;
   var totalDelay = cooldown + attDelay;

   //Floor(½*Power*(Atk/Def)*STAB*Effective)+1
   //attack = (baseattack + attackiv) * cpm
   //defense = (basedefense + defenseiv) * cpm
   //hp = floor( (basestamina + hpiv) * cpm)

   //calculate defender's defense and hp

   var defenderType = gameData.getTypes(pokemonName);
   var defenderCPs = [];
   var ivsToCheck = [];
   var defsToCheck = [];
   var hpsToCheck = [];
   var noIVsMessage = "";

   if (calcIVs) {
      calculate(
         pokemonName,
         pokemon,
         cp,
         hp2,
         isPoweredUp,
         factor,
         minLevel,
         overall,
         stats,
         highHP,
         highATK,
         highDEF,
         hatched,
         attIV,
         hpIV,
         defIV,
         true,
      );
      ivsToCheck = service.results.stats;
      for (var i = 0; i < ivsToCheck.length; i++) {
         var defenderCP = calculateCP(
            pokemonName,
            pokemon,
            ivsToCheck[i].level,
            ivsToCheck[i].ATK,
            ivsToCheck[i].DEF,
            ivsToCheck[i].HP,
            ivsToCheck[i].level,
            null,
            false,
            false,
         );
         if (defenderCP < 10) {
            defenderCP = 10;
         }
         var defense =
            (pokemon.BDEF + ivsToCheck[i].DEF) *
            gameData.getCPM(ivsToCheck[i].level);
         var hp = Math.floor(
            (pokemon.BHP + ivsToCheck[i].HP) *
               gameData.getCPM(ivsToCheck[i].level),
         );
         if (hp < 10) {
            hp = 10;
         }
         hp = hp * 2;
         defsToCheck.push(defense);
         hpsToCheck.push(hp);
         var defenderStats = {
            cp: defenderCP,
            hp: hp,
            atkIV: ivsToCheck[i].ATK,
            defIV: ivsToCheck[i].DEF,
            hpIV: ivsToCheck[i].HP,
         };
         if (defenderCPs.length == 0) {
            defenderCPs.push(defenderStats);
         } else {
            var found = false;
            for (var k = 0; k < defenderCPs.length; k++) {
               if (defenderCPs[k].defIV == defenderStats.defIV) {
                  //don't need atk/hp ivs, so only differentiate by def ivs to improve execution time
                  found = true;
                  break;
               }
            }
            if (!found) {
               defenderCPs.push(defenderStats);
            }
         }

         //46 seconds without
      }
      if (defenderCPs.length == 0) {
         noIVsMessage = "No possible IV spreads found for the Pokemon entered.";
      }
   } else {
      var defense = (pokemon.BDEF + defIV) * gameData.getCPM(level);
      var hp = Math.floor((pokemon.BHP + hpIV) * gameData.getCPM(level));
      if (hp < 10) {
         hp = 10;
      }
      hp = hp * 2;
      defsToCheck.push(defense);
      hpsToCheck.push(hp);
      var defenderCP = calculateCP(
         pokemonName,
         pokemon,
         level,
         attIV,
         defIV,
         hpIV,
         level,
         null,
         false,
         false,
      );
      if (defenderCP < 10) {
         defenderCP = 10;
      }
      var defenderStats = {
         cp: defenderCP,
         hp: hp,
         atkIV: attIV,
         defIV: defIV,
         hpIV: hpIV,
      };
      defenderCPs.push(defenderStats);
   }

   //calculate damage and hits for each pokemon in gamedata.attackers
   var successful2 = [];
   var prestiges = [];
   var exps = [];
   var ivs = [];
   var defIVs = [];
   var count = [];
   var doneCombos = [];
   var countIdx = 0;
   for (var defCPs = 0; defCPs < defenderCPs.length; defCPs++) {
      var successful = [];
      var defIVs2 = [];
      var prestiges2 = [];
      var count2 = [];
      var exps2 = [];
      var ivs2 = [];
      for (var attackIVs = 0; attackIVs < 16; attackIVs++) {
         for (var i = 0; i < gameData.attackers.length; i++) {
            var attacker = gameData.attackers[i];
            if (includes(successful, attacker)) {
               continue;
            }
            //calc attack value
            var pokemonNameAtt = capitalizeFirstLetter(attacker.Attacker);

            var baseStats = gameData.getBaseStats(
               pokemonNameAtt,
               attacker.Lvl,
               true,
            );
            var attack =
               (baseStats.bAtk + attackIVs) * gameData.getCPM(attacker.Lvl);

            var power = -1;
            var moveType = "placeholder xxxxxxx";
            var moveCooldown = -1;
            //get move power
            for (var j = 0; j < movesEN.length; j++) {
               if (movesEN[j].title == attacker.move) {
                  power = movesEN[j].field_move_damage;
                  moveType = movesEN[j].field_move_element;
                  moveCooldown = movesEN[j].field_move_cooldown * 1000;
                  break;
               }
            }
            //get stab multiplier
            var stab = 1;
            var attackerType = gameData.getTypes(pokemonNameAtt);
            if (attackerType.indexOf(moveType) != -1) {
               stab = 1.25;
            }

            //get type effectiveness
            var typeEff = getEffectiveness(moveType, defenderType);

            //calculate damage per hit
            //0.5 * 6 * (9.87/10.27) * 1.25 * 1
            var damage =
               Math.floor(
                  0.5 * power * (attack / defsToCheck[defCPs]) * stab * typeEff,
               ) + 1;

            //calculate how many attacks can be done
            var numAttacks = Math.floor(totalDelay / moveCooldown);

            //check if defender can be killed before first attack
            var totalDamage = damage * numAttacks;

            if (totalDamage >= hp) {
               //check if prestige is over 250
               //calculate cp of attacker and defender
               //function calculateCP(pokemonName, pokemon, pokemonLevel, attackIV, defenseIV, hpIV, targetLevel, targetEvolution, evolve){
               var attackerCP = calculateCP(
                  pokemonNameAtt,
                  "blah",
                  attacker.Lvl,
                  attackIVs,
                  0,
                  0,
                  attacker.Lvl,
                  null,
                  false,
                  true,
               );
               if (attackerCP < 10) {
                  attackerCP = 10;
               }

               var prestige = -1;
               var exp = -1;
               if (attackerCP <= defenderCPs[defCPs].cp) {
                  //calculate prestige 500 * D/A (500 max)
                  prestige = 500 * (defenderCPs[defCPs].cp / attackerCP);
                  if (prestige > 1000) {
                     prestige = 1000;
                  }
                  exp = 50 * (defenderCPs[defCPs].cp / attackerCP);
                  if (exp > 100) {
                     exp = 100;
                  }
               } else {
                  //310 * D/A - 27 (100 min)
                  prestige = 310 * (defenderCPs[defCPs].cp / attackerCP);
                  if (prestige < 100) {
                     prestige = 100;
                  }
                  exp = 31 * (defenderCPs[defCPs].cp / attackerCP) - 5;
                  if (exp < 10) {
                     exp = 10;
                  }
               }
               var testt = {};
               //if prestige is over 500, add it to results
               if (prestige >= 500) {
                  successful.push(attacker);
                  ivs2.push(attackIVs);
                  prestige = Math.floor(prestige);
                  prestiges2.push(prestige);
                  count2.push(countIdx);
                  exp = Math.floor(exp);
                  exps2.push(exp);
                  defIVs2.push([
                     defenderCPs[defCPs].atkIV,
                     defenderCPs[defCPs].defIV,
                     defenderCPs[defCPs].hpIV,
                  ]);
                  countIdx++;
               }
            }
         }
      }
      for (var i = 0; i < successful.length; i++) {
         successful2.push(successful[i]);
         defIVs.push(defIVs2[i]);
         prestiges.push(prestiges2[i]);
         count.push(count2[i]);
         exps.push(exps2[i]);
         ivs.push(ivs2[i]);
      }
      successful = [];
   } //defivs for loop
   var list = [];
   for (var j in prestiges)
      list.push({
         name: prestiges[j],
         age: successful2[j],
         exps2: exps[j],
         ivs2: ivs[j],
         ivs3: defIVs[j],
      });

   //2) sort:
   list.sort(function (a, b) {
      return a.name > b.name ? -1 : a.name == b.name ? 0 : 1;
      //Sort could be modified to, for example, sort on the age
      // if the name is the same.
   });

   //3) separate them back out:
   for (var k = 0; k < list.length; k++) {
      prestiges[k] = list[k].name;
      successful2[k] = list[k].age;
      exps[k] = list[k].exps2;
      ivs[k] = list[k].ivs2;
      defIVs[k] = list[k].ivs3;
   }
   var failed = false;
   if (successful2.length == 0) {
      failed = true;
   }
   service.results = {
      resultsArr: successful2,
      ivs: ivs,
      prestiges: prestiges,
      count: count,
      exps: exps,
      defIVs: defIVs,
      defenders: defenderCPs,
      failed: failed,
      noIVs: noIVsMessage,
   };
}

export function include(arr, obj) {
   return arr.indexOf(obj) != -1;
}

export function includes(arr, obj) {
   return arr.indexOf(obj) != -1;
}

export function capitalizeFirstLetter(string) {
   return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getEffectiveness(attackerType, defenderType) {
   var testAttType = attackerType.toLowerCase();
   var testDefType = defenderType.toLowerCase();
   var type1 = testDefType;
   var type2 = null;
   if (testDefType.indexOf(",") != -1) {
      var split = testDefType.split(",");
      type1 = split[0];
      type2 = split[1].substring(1);
   }
   var typechart = {};
   typechart.normal = "00222221201222222222";
   typechart.fighting = "01421124104222214241";
   typechart.flying = "02242221421224122222";
   typechart.poison = "03222111210224222224";
   typechart.ground = "04220424124421422222";
   typechart.rock = "05214212421422224222";
   typechart.bug = "06211122211124242241";
   typechart.ghost = "07022222242222242212";
   typechart.steel = "08222224221112124224";
   typechart.fire = "09222221424114224122";
   typechart.water = "10222244222411222122";
   typechart.grass = "11221144121141222122";
   typechart.electric = "12224202222241122122";
   typechart.psychic = "13242422221222212202";
   typechart.ice = "14224242221114221422";
   typechart.dragon = "15222222221222222420";
   typechart.dark = "16212222242222242211";
   typechart.fairy = "17242122221122222442";

   var defenderIdx = typechart[type1].substring(0, 2);
   var intIdx = parseInt(defenderIdx) + 2;
   var effectiveness =
      parseInt(typechart[testAttType].substring(intIdx, intIdx + 1)) / 2;
   effectiveness = checkEff(effectiveness);

   var effectiveness2 = 1;

   if (type2 != null) {
      defenderIdx = typechart[type2].substring(0, 2);
      intIdx = parseInt(defenderIdx) + 2;
      effectiveness2 =
         parseInt(typechart[testAttType].substring(intIdx, intIdx + 1)) / 2;
      effectiveness2 = checkEff(effectiveness2);
   }
   return effectiveness * effectiveness2;
}

export function checkEff(eff) {
   switch (eff) {
      case 0:
         return 0.39;
         break;

      case 0.5:
         return 0.625;
         break;

      case 1:
         return 1;
         break;

      case 2:
         return 1.6;
         break;
   }
}

//ditto calc stuff
export function calculateTransformCP(
   targetPokemonName,
   targetPokemon,
   level,
   hpIV,
   attIV,
   defIV,
) {
   /**
    copying the opponent's:
    Quick and charge moves
    Base stats
    Pokemon type(s)
    The following are unchanged for Ditto after transform:

    HP and base stamina
    Level
    Individual values (IVs)
    */
   //hardcoded Ditto's base stats for now
   var dittoBase = {
      atk: 91,
      def: 91,
      sta: 96,
   };
   var baseAttack = parseInt(targetPokemon.atk),
      baseDefense = parseInt(targetPokemon.def),
      baseHP = parseInt(targetPokemon.sta);
   //CP = CPM^2 * (Base_Attack+Attack IV) * (Base_Defense + Defense_IV)^.5 * (Base_HP +HP_IV)^.5 / 10
   var cpm = gameData.getCPM(level);
   var cp =
      (cpm *
         cpm *
         (baseAttack + attIV) *
         Math.sqrt(baseDefense + defIV) *
         Math.sqrt(baseHP + hpIV)) /
      10;
   var hp = cpm * (dittoBase.sta + hpIV);
   var dittoCP =
      (cpm *
         cpm *
         (dittoBase.atk + attIV) *
         Math.sqrt(dittoBase.def + defIV) *
         Math.sqrt(dittoBase.sta + hpIV)) /
      10;
   dittoCP = Math.floor(dittoCP);
   hp = Math.floor(hp);
   cp = Math.floor(cp);
   if (cp < 10) {
      cp = 10;
   }
   if (dittoCP < 10) {
      dittoCP = 10;
   }
   if (hp < 10) {
      hp = 10;
   }
   service.resultsDitto = {
      dittoCP: dittoCP,
      dittoHP: hp,
      transformCP: cp,
   };
}
// }

// })();
