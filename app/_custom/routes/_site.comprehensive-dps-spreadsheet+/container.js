<div id='moveEditForm' title="Add/Edit Move" style="visibility: hidden;">
	<table name="move" id="moveEditForm-table">
		<tr>
			<th>Scope</th>
			<td>
				<select name='move-scope'>
					<option value='regular'>Regular (PvE)</option>
					<option value='combat'>Combat (PvP)</option>
				</select>
			</td>
		</tr>
		<tr>
			<th>Category</th>
			<td>
				<select name='move-moveType'>
					<option value='fast'>Fast</option>
					<option value='charged'>Charged</option>
				</select>
			</td>
		</tr>
		<tr>
			<th>Name</th>
			<td><input type='text' name='move-name' class='input-with-icon move-input-with-icon'></td>
		</tr>
		<tr>
			<th>Typing</th>
			<td><select name='move-pokeType'></select></td>
		</tr>
		<tr>
			<th>Power</th>
			<td><input type='number' name='move-power'></td>
		</tr>
		<tr>
			<th>EnergyDelta</th>
			<td><input type='number' name='move-energyDelta'></td>
		</tr>
		<tr>
			<th>Duration (in miliseconds)</th>
			<td><input type='number' name='move-duration'></td>
		</tr>
		<tr>
			<th>Damage Window (in miliseconds)</th>
			<td><input type='number' name='move-dws'></td>
		</tr>
		<tr>
			<th>Effect</th>
			<td><input name='move-effect'></td>
		</tr>
	</table>
	<br>

	<div class="container">
		<div class="row">
			<div class="col-sm-6">
				<button id='moveEditForm-submit' class="center_stuff btn btn-primary"><i class="fa fa-check"
						aria-hidden="true"></i> Save</button>
			</div>
			<div class="col-sm-3">
				<button id='moveEditForm-delete' class="center_stuff btn btn-warning"><i class="fa fa-trash"
						aria-hidden="true"></i> Delete</button>
			</div>
			<div class="col-sm-3">
				<button id='moveEditForm-reset' class="center_stuff btn btn-danger"><i class="fa fa-refresh"
						aria-hidden="true"></i> Reset</button>
			</div>
		</div>
	</div>

</div>


<div id='pokemonEditForm' title="Add/Edit Pokemon" style="visibility: hidden;">
	<table name="pokemon" id="pokemonEditForm-table">
		<tr>
			<th>Pokemon Name</th>
			<td><input type='text' name='pokemon-name' class='input-with-icon species-input-with-icon'></td>
		</tr>
		<tr>
			<th>Pokemon Typing 1</th>
			<td><select name='pokemon-pokeType1'></select></td>
		</tr>
		<tr>
			<th>Pokemon Typing 2</th>
			<td><select name='pokemon-pokeType2'></select></td>
		</tr>
		<tr>
			<th>Base Attack</th>
			<td><input type='number' name='pokemon-baseAtk'></td>
		</tr>
		<tr>
			<th>Base Defense</th>
			<td><input type='number' name='pokemon-baseDef'></td>
		</tr>
		<tr>
			<th>Base Stamina</th>
			<td><input type='number' name='pokemon-baseStm'></td>
		</tr>
		<tr>
			<th>Fast Move Pool</th>
			<td><input type='text' name='pokemon-fmoves'></td>
		</tr>
		<tr>
			<th>Charged Move Pool</th>
			<td><input type='text' name='pokemon-cmoves'></td>
		</tr>
	</table>
	<br>

	<div class="container">
		<div class="row">
			<div class="col-sm-6">
				<button id="pokemonEditForm-submit" class="center_stuff btn btn-primary"><i class="fa fa-check"
						aria-hidden="true"></i> Save</button>
			</div>
			<div class="col-sm-3">
				<button id="pokemonEditForm-delete" class="center_stuff btn btn-warning"><i class="fa fa-trash"
						aria-hidden="true"></i> Delete</button>
			</div>
			<div class="col-sm-3">
				<button id="pokemonEditForm-reset" class="center_stuff btn btn-danger"><i class="fa fa-refresh"
						aria-hidden="true"></i> Reset</button>
			</div>
		</div>
	</div>

</div>

<div id="parameterEditForm" title="Edit Battle Settings" style="visibility: hidden;">
	<div style="display:inline-block; overflow-y:scroll; max-height: 40vh; width: 100%;">
		<table id='parameterEditForm-Table'>
			<thead>
				<tr>
					<th>Paramater</th>
					<th>Value</th>
				</tr>
			</thead>
			<tbody>

			</tbody>
		</table>
	</div>

	<br>

	<div class="container">
		<div class="row">
			<div class="col-sm-6">
				<button id="parameterEditForm-submit" class="center_stuff btn btn-primary"><i class="fa fa-check"
						aria-hidden="true"></i> Save</button>
			</div>
			<div class="col-sm-6">
				<button id="parameterEditForm-reset" class="center_stuff btn btn-danger"><i class="fa fa-refresh"
						aria-hidden="true"></i> Reset</button>
			</div>
		</div>
	</div>

	<div id='parameterEditForm-feedback'>
	</div>
</div>


<div id='modEditForm' title="Edit Mods" style="visibility: hidden;">
	<table id='modEditForm-Table'>
		<thead>
			<colgroup>
				<col width="50%">
				<col width="50%">
			</colgroup>
			<tr>
				<th>Mod Name</th>
				<th>Applied</th>
			</tr>
		</thead>
		<tbody id='modEditForm-table-body'>

		</tbody>
	</table>

	<br>

	<div class="container">
		<div class="row">
			<div class="col">
				<button id="modForm-submit" class="center_stuff btn btn-primary">
					<i class="fa fa-check" aria-hidden="true"></i> Save</button>
			</div>
		</div>
	</div>

	<div id='modEditForm-feedback'>
	</div>
</div>

<div class="pogo-dps-sheet-container">
   <div name="pokemon" class="container form-group">
      <label class="row-form-label">Enemy Information</label>
      <div class="row">
         <div id="enemy-pokemon-name-container" class="col-sm-6">
            <label class="col-form-label">Species</label>
         </div>
         <div id="pokemon-pokeType1-container" class="col-sm-3">
            <label class="col-form-label">PokeType 1</label>
            <select name='pokemon-pokeType1' id="pokemon-pokeType1" class="form-control"></select>
         </div>
         <div id="pokemon-pokeType2-container" class="col-sm-3">
            <label class="col-form-label">PokeType 2</label>
            <select name='pokemon-pokeType2' id="pokemon-pokeType2" class="form-control"></select>
         </div>
      </div>
      <div class="row">
         <div id="enemy-pokemon-fmove-container" class="col-sm-6">
            <label class="col-form-label">Fast Move</label>
         </div>
         <div id="enemy-pokemon-cmove-container" class="col-sm-6">
            <label class="col-form-label">Charged Move</label>
         </div>
      </div>
      <div class="row">
         <div class="col-sm-6">
            <label class="col-form-label">Weather</label>
            <select id='weather' class="form-control"></select>
         </div>
         <div class="col-sm-6">
            <label class="col-form-label">Controls</label>
            <div class="sub-menu-container">
               <button class='sub-menu-opener btn btn-primary'><i class="fa fa-cog" aria-hidden="true"></i>
               Customize</button>
               <div class='sub-menu'>
                  <button class='player_button' id='moveEditFormOpener'>Move</button>
                  <button class='player_button' id='pokemonEditFormOpener'>Species</button>
                  <button class='player_button' id='parameterEditFormOpener'>Battle Settings</button>
                  <button class='player_button' id='modEditFormOpener'>Mods</button>
               </div>
            </div>
         </div>
      </div>
   </div>
   <div class="container form-group">
      <div class="row">
         <div class="col-sm-6 col-lg-3">
            <div id='ui-swapDiscount' style='width:100%;'><label style='width:100%;font-size:16px;'>Swap
               Dscnt<input type='checkbox' id='ui-swapDiscount-checkbox'></label>
            </div>
         </div>
         <div class="col-sm-6 col-lg-3">
            <div id='ui-use-box' style='width:100%;'><label style='width:100%;font-size:16px;'>My Pokemon<input
               type='checkbox' id='ui-use-box-checkbox' disabled></label></div>
         </div>
         <div class="col-sm-6 col-lg-3">
            <div id='ui-uniqueSpecies' style='width:100%;'><label style='width:100%;font-size:16px;'>Best<input
               type='checkbox' id='ui-uniqueSpecies-checkbox'></label></div>
         </div>
         <div class="col-sm-6 col-lg-3">
            <select id="attacker-level" class="form-control" value="40"></select>
         </div>
      </div>
      <div class="row">
         <div class="col-sm-6 col-md-3">
            <div style='width:100%;'><input id="ui-cpcap" type="number" placeholder="CP Cap"
               class="form-control"></input></div>
         </div>
         <div class="col-sm-6 col-md-3">
            <div id='ui-pvpMode' style='width:100%;'><label style='width:100%;font-size:16px;'>PvP Mode<input
               type='checkbox' id='ui-pvpMode-checkbox'></label></div>
         </div>
         <div class="col-sm-6 col-md-3">       
            <div id='ui-hideUnavail' style='width:100%;'><label style='width:100%;font-size:16px;'>Hide Unavail<input
               type='checkbox' id='ui-hideUnavail-checkbox'></label></div>    
         </div>
         <div class="col-sm-6 col-md-3">
            <button class='btn btn-success' id='refresher'><i class="fa fa-refresh" aria-hidden="true"></i>
            Refresh</button>
         </div>
      </div>
      <div class="row">
         <div class="col-sm-6 col-md-3">
            <div id='ui-allyMega' style='width:100%;'><label style='width:100%;font-size:16px;'>Mega Boost?<input
               type='checkbox' id='ui-allyMega-checkbox'></label></div>
         </div>
         <div class="col-sm-6 col-md-3">
            <div id='ui-allyMegaStab' style='width:100%; display:none;'><label style='width:100%;font-size:16px;'>Mega Stab?<input
               type='checkbox' id='ui-allyMegaStab-checkbox'></label></div>
         </div>
      </div>
   </div>
   <div class="container">
      <div class="row">
         <div class="col">
            <label class="col-form-label">Search</label>
         </div>
      </div>
      <div class="row">
         <div class="col">
            <input id="searchInput" onkeyup="search_trigger()" class="form-control"></input>
         </div>
      </div>
   </div>
   <table id="ranking_table" style="width:100%;">
      <thead></thead>
      <tfoot></tfoot>
      <tbody></tbody>
   </table>
   <br>
   <div class="container">
      <div class="row">
         <div class="col-sm-6">
            <button id="CopyClipboardButton" class="btn btn-info">Copy to Clipboard</button>
         </div>
         <div class="col-sm-6">
            <button id="CopyCSVButton" class="btn btn-info">Export To CSV</button>
         </div>
      </div>
   </div>
</div>

<script>
$(document).ready(DPSCalculatorInit);

</script>