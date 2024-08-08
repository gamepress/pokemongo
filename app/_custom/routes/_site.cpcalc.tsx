import { useState } from "react";

export default function CpCalc() {
   const calcData = getCP();
   const [language, switchLanguage] = useState("en");

   return (
      <div
         id="calc-view"
         className="cp-calc"
         ng-controller="CalcController as vm"
      >
         <div className="row">
            <div className="">
               <label>
                  Pok&eacute;mon&nbsp;&nbsp;&nbsp;&nbsp;
                  <button onClick={() => switchLanguage("en")}>
                     <img
                        alt="English"
                        ng-class="{'not-selected' : gameData.language != 'en'}"
                        src="assets/img/blank.png"
                        className="flag flag-gb"
                     />
                  </button>
                  &nbsp;&nbsp;
                  <button onClick={() => switchLanguage("de")}>
                     <img
                        alt="German"
                        ng-class="{'not-selected' : gameData.language != 'de'}"
                        src="assets/img/blank.png"
                        className="flag flag-de"
                     />
                  </button>
                  &nbsp;&nbsp;
                  <button onClick={() => switchLanguage("fr")}>
                     <img
                        alt="French"
                        ng-class="{'not-selected' : gameData.language != 'fr'}"
                        src="assets/img/blank.png"
                        className="flag flag-fr"
                     />
                  </button>
                  &nbsp;&nbsp;
                  <button onClick={() => switchLanguage("it")}>
                     <img
                        alt="Italian"
                        ng-class="{'not-selected' : gameData.language != 'it'}"
                        src="assets/img/blank.png"
                        className="flag flag-it"
                     />
                  </button>
                  &nbsp;&nbsp;
                  <button onClick={() => switchLanguage("es")}>
                     <img
                        alt="Spanish"
                        ng-class="{'not-selected' : gameData.language != 'es'}"
                        src="assets/img/blank.png"
                        className="flag flag-es"
                     />
                  </button>
                  &nbsp;&nbsp;
                  <button onClick={() => switchLanguage("jp")}>
                     <img
                        alt="Japanese"
                        ng-class="{'not-selected' : gameData.language != 'jp'}"
                        src="assets/img/blank.png"
                        className="flag flag-jp"
                     />
                  </button>
                  &nbsp;&nbsp;
                  <button onClick={() => switchLanguage("zh_CN")}>
                     <img
                        alt="Chinese (Simplified)"
                        ng-class="{'not-selected' : gameData.language != 'zh_CN'}"
                        src="assets/img/blank.png"
                        className="flag flag-cn"
                     />
                  </button>
                  &nbsp;&nbsp;
                  <button onClick={() => switchLanguage("zh_TW")}>
                     <img
                        alt="Chinese (Traditional)"
                        ng-class="{'not-selected' : gameData.language != 'zh_TW'}"
                        src="assets/img/blank.png"
                        className="flag flag-cn"
                     />
                  </button>
                  &nbsp;&nbsp;
                  <input
                     className="form-control"
                     data-toggle="dropdown"
                     ng-style="{'background':'no-repeat 0px -4px', 'padding-left':'40px', 'background-image': 'url(./assets/img/sprites/'+vm.backgroundImg+'MS.png?ver1)'}"
                     ng-model="vm.pokemonName"
                     type="text"
                     ng-change="vm.filterList()"
                     ng-focus="vm.inputHasFocus = true; vm.focusedItem = -1;"
                     ng-blur="vm.inputHasFocus = false; vm.checkPokemonName()"
                     ng-keydown="vm.checkDropdownNavigation($event)"
                  />
                  <ul
                     className="dropdown-menu"
                     ng-init="vm.focusedItem = -1"
                     ng-show="vm.pokemonInputChanged && vm.inputHasFocus"
                  >
                     <li
                        ng-repeat="p in vm.filteredList"
                        ng-mouseover="vm.focusItem($index)"
                        ng-class="{'active-item': vm.focusedItem == $index, 'inactive-item': vm.focusedItem != $index}"
                     >
                        <a ng-mousedown="vm.selectPokemon(p)">p</a>
                     </li>
                  </ul>
               </label>
            </div>
            <div className="">
               <label>
                  Pokemon Level{" "}
                  <input
                     className="form-control"
                     ng-model="vm.level"
                     type="number"
                     placeholder="Pokemon Level"
                  />
               </label>
            </div>
            <div className="cp-calc">
               <div className="iv-input">
                  <label>
                     <img
                        src="/sites/pokemongo/themes/gamepressbase/img/fist.png"
                        typeof="foaf:Image"
                        alt="ATK IV"
                     />{" "}
                     ATK IV
                     <input
                        className="form-control"
                        ng-model="vm.attackIV"
                        type="number"
                        placeholder="Attack IVs"
                     />
                  </label>
               </div>
               <div className="iv-input">
                  <label>
                     <img
                        src="/sites/pokemongo/themes/gamepressbase/img/shield.png"
                        typeof="foaf:Image"
                        alt="DEF IV"
                     />{" "}
                     DEF IV
                     <input
                        className="form-control"
                        ng-model="vm.defenseIV"
                        type="number"
                        placeholder="Defense IVs"
                     />
                  </label>
               </div>
               <div className="iv-input">
                  <label>
                     <img
                        src="/sites/pokemongo/themes/gamepressbase/img/like.png"
                        typeof="foaf:Image"
                        alt="HP IV"
                     />{" "}
                     HP IV
                     <input
                        className="form-control"
                        ng-model="vm.hpIV"
                        type="number"
                        placeholder="HP IVs"
                     />
                  </label>
               </div>
            </div>
            <div className="">
               <label>
                  Target Level
                  <input
                     className="form-control"
                     ng-model="vm.targetLevel"
                     type="number"
                     placeholder="Target Level"
                  />
               </label>
            </div>
            <div className="" style={{ float: "left", marginRight: "4%" }}>
               <label>
                  Evolve?
                  <input
                     type="checkbox"
                     className="evolve-check"
                     ng-model="vm.evolve"
                     //    [ng-true-value="true"]
                     //    [ng-false-value="false"]
                     //    [ng-change="show_evolution"]
                  />
               </label>
            </div>
            <div className="" style={{ float: "left", marginRight: "4%" }}>
               <label>
                  Lucky?
                  <input
                     type="checkbox"
                     className="evolve-check"
                     ng-model="vm.lucky"
                     //    [ng-true-value="true"]
                     //    [ng-false-value="false"]
                  />
               </label>
            </div>
            <div
               className=""
               ng-show="vm.is_shadow"
               style={{ float: "left", marginRight: "4%" }}
            >
               <label>
                  Shadow?
                  <input
                     type="checkbox"
                     className="evolve-check"
                     id="shadow-check"
                     ng-model="vm.shadow"
                     ng-change="vm.toggleShadow('s')"
                     //    [ng-true-value="true"]
                     //    [ng-false-value="false"]
                  />
               </label>
            </div>
            <div
               className=""
               ng-show="vm.is_shadow"
               style={{ float: "left", marginRight: "4%" }}
            >
               <label>
                  Purified Shadow?
                  <input
                     type="checkbox"
                     className="evolve-check"
                     id="purified-check"
                     ng-model="vm.purified_shadow"
                     ng-change="vm.toggleShadow('p')"
                     //    [ng-true-value="true"]
                     //    [ng-false-value="false"]
                  />
               </label>
            </div>
            <div
               className=""
               ng-show="vm.shadow || vm.purified_shadow"
               style={{ float: "left" }}
            >
               <label>
                  Add Purify Cost?
                  <input
                     type="checkbox"
                     className="evolve-check"
                     ng-model="vm.purify"
                     //    [ng-true-value="true"]
                     //    [ng-false-value="false"]
                  />
               </label>
            </div>
            <div ng-show="vm.evolve">
               <select
                  ng-model="vm.evolutionTarget"
                  ng-options="item as item for item in vm.availableEvos"
               ></select>
            </div>
         </div>
         <div className="row">
            <div className="">
               <button
                  className="btn btn-primary btn-lg btn-calc"
                  ng-click="vm.calculateCP()"
                  ng-disabled="vm.disableCalc()"
               >
                  Calculate
               </button>
            </div>
         </div>
         <div className="resultsCPTable">
            <table id="cp-calc-table" style={{ marginTop: "10px" }}>
               <tr>
                  <th
                     style={{ borderTop: "1px solid #ebeef2" }}
                     className="resultsCPTitle"
                  >
                     Final CP{" "}
                  </th>
                  <td className="resultsCP">{calcData.resultsCP.targetCP}</td>
               </tr>
               <tr>
                  <th
                     style={{ borderTop: "1px solid #ebeef2" }}
                     className="resultsCPTitle"
                  >
                     Final HP
                  </th>
                  <td className="resultsCP">{calcData.resultsCP.targetHP}</td>
               </tr>
               <tr>
                  <th
                     style={{ borderTop: "1px solid #ebeef2" }}
                     className="resultsCPTitle"
                  >
                     Stardust Required
                  </th>
                  <td className="resultsCP">
                     {calcData.resultsCP.stardustCost}
                  </td>
               </tr>
               <tr>
                  <th
                     style={{ borderTop: "1px solid #ebeef2" }}
                     className="resultsCPTitle"
                  >
                     Candy Required{" "}
                  </th>
                  <td className="resultsCP">{calcData.resultsCP.candyCost}</td>
               </tr>
               <tr>
                  <th
                     style={{ borderTop: "1px solid #ebeef2" }}
                     className="resultsCPTitle"
                  >
                     XL Candy Required{" "}
                  </th>
                  <td className="resultsCP">
                     {calcData.resultsCP.xlCandyCost}
                  </td>
               </tr>
               <tr>
                  <th
                     style={{ borderTop: "1px solid #ebeef2" }}
                     className="resultsCPTitle"
                  >
                     Buddy Distance
                  </th>
                  <td className="resultsCP">{calcData.resultsCP.distance}</td>
               </tr>
               <tr>
                  <th
                     style={{ borderTop: "1px solid #ebeef2" }}
                     className="resultsCPTitle"
                  >
                     Captures
                  </th>
                  <td className="resultsCP">
                     {calcData.resultsCP.capturesRequired}
                  </td>
               </tr>
            </table>
            <button
               id="show-all-cp"
               onClick="$('#all-cp-table-container').toggle();"
               disabled
            >
               Show CP At All Levels
            </button>
            <table id="all-cp-table-container" style={{ display: "none" }}>
               <thead>
                  <th>Level</th>
                  <th>CP</th>
                  <th>HP</th>
               </thead>
               <tbody id="all-cp-table"></tbody>
            </table>
         </div>
      </div>
   );
}

function getCP() {
   return {
      resultsCP: {
         targetCP: 0,
         targetHP: 0,
         stardustCost: 0,
         candyCost: 0,
         xlCandyCost: 0,
         distance: 0,
         capturesRequired: 0,
      },
   };
}
