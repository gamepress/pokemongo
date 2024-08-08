export default function CpCalc() {

    return (
        <div id="calc-view" className="cp-calc" ng-controller="CalcController as vm">
    <div className="row">
        <div className="">
            <label>Pok&eacute;mon&nbsp;&nbsp;&nbsp;&nbsp;
                <a ng-click="vm.switchLanguage('en')"><img ng-class="{'not-selected' : vm.gameData.language != 'en'}" src="assets/img/blank.png" className="flag flag-gb" /></a>&nbsp;&nbsp;
                <a ng-click="vm.switchLanguage('de')"><img ng-class="{'not-selected' : vm.gameData.language != 'de'}" src="assets/img/blank.png" className="flag flag-de" /></a>&nbsp;&nbsp;
                <a ng-click="vm.switchLanguage('fr')"><img ng-class="{'not-selected' : vm.gameData.language != 'fr'}" src="assets/img/blank.png" className="flag flag-fr" /></a>&nbsp;&nbsp;
                <a ng-click="vm.switchLanguage('it')"><img ng-class="{'not-selected' : vm.gameData.language != 'it'}" src="assets/img/blank.png" className="flag flag-it" /></a>&nbsp;&nbsp;
                <a ng-click="vm.switchLanguage('es')"><img ng-class="{'not-selected' : vm.gameData.language != 'es'}" src="assets/img/blank.png" className="flag flag-es" /></a>&nbsp;&nbsp;
                <a ng-click="vm.switchLanguage('jp')"><img ng-class="{'not-selected' : vm.gameData.language != 'jp'}" src="assets/img/blank.png" className="flag flag-jp" /></a>&nbsp;&nbsp;
                <a ng-click="vm.switchLanguage('zh_CN')"><img ng-class="{'not-selected' : vm.gameData.language != 'zh_CN'}" src="assets/img/blank.png" className="flag flag-cn" /></a>&nbsp;&nbsp;
                <a ng-click="vm.switchLanguage('zh_TW')"><img ng-class="{'not-selected' : vm.gameData.language != 'zh_TW'}" src="assets/img/blank.png" className="flag flag-cn" /></a>&nbsp;&nbsp;
                <input className="form-control" data-toggle="dropdown" ng-style="{'background':'no-repeat 0px -4px', 'padding-left':'40px', 'background-image': 'url(./assets/img/sprites/'+vm.backgroundImg+'MS.png?ver1)'}" ng-model="vm.pokemonName" type="text" ng-change="vm.filterList()" ng-focus="vm.inputHasFocus = true; vm.focusedItem = -1;" ng-blur="vm.inputHasFocus = false; vm.checkPokemonName()" ng-keydown="vm.checkDropdownNavigation($event)" />
                <ul className="dropdown-menu" ng-init="vm.focusedItem = -1" ng-show="vm.pokemonInputChanged && vm.inputHasFocus">
                    <li ng-repeat="p in vm.filteredList" ng-mouseover="vm.focusItem($index)" ng-class="{'active-item': vm.focusedItem == $index, 'inactive-item': vm.focusedItem != $index}"><a ng-mousedown="vm.selectPokemon(p)">{{p}}</a></li>
                </ul>
            </label>

        </div>
        <div className="">
                 <label>Pokemon Level <input className="form-control" ng-model="vm.level" type="number" placeholder="Pokemon Level" /></label>
        </div>
        <div className="cp-calc">
            <div className="iv-input">
                <label><img src="/sites/pokemongo/themes/gamepressbase/img/fist.png" typeof="foaf:Image"> ATK IV<input className="form-control" ng-model="vm.attackIV" type="number" placeholder="Attack IVs" /></label>
            </div>
            <div className="iv-input">
                <label><img src="/sites/pokemongo/themes/gamepressbase/img/shield.png" typeof="foaf:Image"> DEF IV<input className="form-control" ng-model="vm.defenseIV" type="number" placeholder="Defense IVs" /></label>
            </div>
            <div className="iv-input">
                <label><img src="/sites/pokemongo/themes/gamepressbase/img/like.png" typeof="foaf:Image"> HP IV<input className="form-control" ng-model="vm.hpIV" type="number" placeholder="HP IVs" /></label>
            </div>
        </div>
        <div className="">
            <label>Target Level<input className="form-control" ng-model="vm.targetLevel" type="number" placeholder="Target Level" /></label>
        </div>
        <div className="" style="float:left; margin-right:4%;">
           <label>Evolve?<input type="checkbox" className="evolve-check"
           ng-model="vm.evolve"
           [ng-true-value="true"]
           [ng-false-value="false"]
           [ng-change="show_evolution"]></label>
        </div>
        <div className="" style="float:left; margin-right:4%;">
           <label>Lucky?<input type="checkbox" className="evolve-check"
           ng-model="vm.lucky"
           [ng-true-value="true"]
           [ng-false-value="false"]></label>
        </div>
        <div className="" ng-show="vm.is_shadow" style="float:left; margin-right:4%;">
           <label>Shadow?<input type="checkbox" className="evolve-check" id="shadow-check"
           ng-model="vm.shadow"
           ng-change="vm.toggleShadow('s')"
           [ng-true-value="true"]
           [ng-false-value="false"]></label>
        </div>
        <div className="" ng-show="vm.is_shadow" style="float:left; margin-right:4%;">
           <label>Purified Shadow?<input type="checkbox" className="evolve-check" id="purified-check"
           ng-model="vm.purified_shadow"
           ng-change="vm.toggleShadow('p')"
           [ng-true-value="true"]
           [ng-false-value="false"]></label>
        </div>
        <div className="" ng-show="vm.shadow || vm.purified_shadow" style="float:left;">
           <label>Add Purify Cost?<input type="checkbox" className="evolve-check"
           ng-model="vm.purify"
           [ng-true-value="true"]
           [ng-false-value="false"]></label>
        </div>
        <div ng-show="vm.evolve">
            <select ng-model="vm.evolutionTarget"
                    ng-options="item as item for item in vm.availableEvos">
            </select>
        </div>
    </div>
    <div className="row">
        <div className="">
            <button className="btn btn-primary btn-lg btn-calc" ng-click="vm.calculateCP()" ng-disabled="vm.disableCalc()">Calculate</button>
        </div>
    </div>
    <div className="resultsCPTable">
        <table id="cp-calc-table" style="margin-top:10px;">
            <tr>
                <th style="border-top: 1px solid #ebeef2;" className="resultsCPTitle">Final CP </th>
                <td className="resultsCP">{{vm.calcData.resultsCP.targetCP}}</td>
            </tr>
            <tr>
                <th style="border-top: 1px solid #ebeef2;" className="resultsCPTitle">Final HP</th>
                <td className="resultsCP">{{vm.calcData.resultsCP.targetHP}}</td>
            </tr>
            <tr>
                <th style="border-top: 1px solid #ebeef2;" className="resultsCPTitle">Stardust Required</th>
                <td className="resultsCP">{{vm.calcData.resultsCP.stardustCost}}</td>
            </tr>
            <tr>
                <th style="border-top: 1px solid #ebeef2;" className="resultsCPTitle">Candy Required </th>
                <td className="resultsCP">{{vm.calcData.resultsCP.candyCost}}</td>
            </tr>
            <tr>
                <th style="border-top: 1px solid #ebeef2;" className="resultsCPTitle">XL Candy Required </th>
                <td className="resultsCP">{{vm.calcData.resultsCP.xlCandyCost}}</td>
            </tr>
            <tr>
                <th style="border-top: 1px solid #ebeef2;" className="resultsCPTitle">Buddy Distance</th>
                <td className="resultsCP">{{vm.calcData.resultsCP.distance}}</td>
            </tr>
            <tr>
                <th style="border-top: 1px solid #ebeef2;" className="resultsCPTitle">Captures</th>
                <td className="resultsCP">{{vm.calcData.resultsCP.capturesRequired}}</td>
            </tr>
        </table>
        <button id="show-all-cp" onclick="$('#all-cp-table-container').toggle();" style="" disabled>Show CP At All Levels</button>
        <table id="all-cp-table-container" style="display:none;">
            <thead>
                <th>Level</th>
                <th>CP</th>
                <th>HP</th>
            </thead>
            <tbody id="all-cp-table">
            </tbody>
        </table>
    </div>
</div>

    )
    }