// function calculateCP(){
//     if (!(vm.showRefine()) || !(vm.disableRefine())) {
//       vm.collapseRefine = true;
//     }
//    vm.calcData.calculateCP(vm.pokemonName, vm.pokemon, vm.level, vm.attackIV, vm.defenseIV, vm.hpIV, vm.targetLevel, vm.evolutionTarget, vm.evolve, null, vm.lucky, vm.shadow, vm.purify, vm.purified_shadow);
//   }

function calculateCP(
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

function calculateSingleCP(
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
