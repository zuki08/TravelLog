<script>
	export let doc = {};
	export let docId = '';
	let itinerary = {};
	console.log(doc);
	import MoreInfo from './MoreInfo.svelte';
	import { info, filler } from './store.js';
	filler.subscribe((_s) => {
		if (_s.filter((e) => e.id === docId).length === 0) {
			return;
		}
		itinerary = _s.filter((e) => e.id === docId)[0].itinerary;
	});
	let pView;
	let AddView = 'places';
	let objKey = '';
	let title = '';
    let address = '';
    let city = '';
    let state = '';
    let date = '';
    let time = '';
    let notes = '';
	function setView(name, key) {
		info.update(() => name);
		objKey = key;
	}
	info.subscribe((s) => {
		pView = s;
		if (pView === 'places') {
			objKey = '';
		}
	});
	function postPlan() {
		// if(city === "" || zip === ""){
		//     alert("Required fields: City and Zip");
		//     return;
		// }
		console.log(date);
		fetch(`http://localhost:54211/addPlan/${docId}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ title, address, city, state, date, time, notes })
		})
			.then(() => {
				console.log('DONE');
				fetch('http://localhost:54212/all')
					.then((r) =>
						r
							.json()
							.then((d) => {
								filler.update(() => d);
							})
							.catch((e) => console.error('38: ' + e))
					)
					.catch((e) => console.error('39: ' + e));
			})
			.catch((e) => console.error('40: ' + e));
		AddView = 'places';
		title = '';
		address = '';
		city = '';
		state = '';
		date = '';
		time = '';
		notes = '';
	}
	function delItem(vId) {
		fetch(`http://localhost:54211/${docId}/${vId}`, {
			method: 'DELETE'
		})
			.then(() => {
				console.log('DONE');
				fetch('http://localhost:54212/all')
					.then((r) =>
						r
							.json()
							.then((d) => {
								filler.update(() => d);
							})
							.catch((e) => console.error('55: ' + e))
					)
					.catch((e) => console.error('56: ' + e));
			})
			.catch((e) => console.error('57: ' + e));
	}
	function getDate(dat) {
		date = new Date(dat);
		let day = date.getUTCDate();
		let month = date.getUTCMonth() + 1; // Months are zero-based
		let year = date.getUTCFullYear();
		let formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
		return formattedDate;
	}
</script>

{#if pView === 'places' && AddView !== 'add'}
	<div class="text-center">
		<h3 class="text-pink-400 text-lg font-bold">YOUR TRIP DETAILS</h3>
		{#each Object.entries(itinerary) as [key, value]}
			<div class="flex flex-row justify-center">
				{#if AddView === 'edit'}
					<button class="border-0 bg-transparent" on:click={() => delItem(value.id)}>🗑️</button>
				{/if}
				<div
					class="basis-5/8 border border-pink-400 bg-slate-300 rounded-md text-center text-sm px-2 m-2"
				>
					<p>
						{value.title ? value.title
							: value.address ? value.address
							: value.city ? value.city
							: '...'}
					</p>
					<p>{value.date === '' ? '' : getDate(value.date)}</p>
				</div>
				<button
					class="basis-3/8 border border-slate-500 rounded px-[2px] h-fit mt-2 bg-gray-100 text-sm hover:bg-white"
					on:click={() => setView('loc', key)}
				>
					More Info
				</button>
			</div>
		{/each}
		<div class="flex flex-row justify-center">
			{#if AddView === 'places'}
				<button
					class="border border-slate-500 rounded px-[2px] h-fit mt-2 bg-gray-100 hover:bg-white"
					on:click={() => (AddView = 'add')}>Add Location</button
				>
				<button
					class="border border-slate-500 rounded px-[2px] h-fit mt-2 ml-1 bg-gray-100 hover:bg-white"
					on:click={() => (AddView = 'edit')}>Edit</button
				>
			{:else if AddView === 'edit'}
				<button
					class="border border-slate-500 rounded px-[2px] h-fit mt-2 bg-gray-100 hover:bg-white"
					on:click={() => (AddView = 'places')}>Cancel</button
				>
			{/if}
		</div>
	</div>
{:else if pView === 'loc'}
	<MoreInfo obj={doc} pId={objKey} />
{/if}
{#if AddView === 'add'}
	<div>
		<div class="flex flex-row">
			<label for="title" class="basis-1/3">Title:</label>
			<input id="title" class="basis-1/3" type="text" bind:value={title} />
		</div>
		<div class="flex flex-row">
			<label for="address" class="basis-1/3">Address:</label>
			<input id="address" class="basis-1/3" type="text" bind:value={address} />
		</div>
		<div class="flex flex-row">
			<label for="city" class="basis-1/3">City:</label>
			<input id="city" class="basis-1/3" type="text" bind:value={city} />
		</div>
		<div class="flex flex-row">
			<label for="state" class="basis-1/3">State:</label>
			<input id="state" class="basis-1/3" type="text" bind:value={state} />
		</div>
		<div class="flex flex-row">
			<label for="date" class="basis-1/3">Date:</label>
			<input id="date" class="basis-1/3" type="date" bind:value={date} />
		</div>
		<div class="flex flex-row">
			<label for="time" class="basis-1/3">Time:</label>
			<input id="time" class="basis-1/3" type="time" bind:value={time} />
		</div>
		<div class="flex flex-row">
			<label for="notes" class="basis-1/3">Notes:</label>
			<input id="notes" class="basis-1/3" type="text" bind:value={notes} />
		</div>
		<div class="flex flex-row justify-center">
			<button
				class="border border-slate-500 rounded px-[2px] h-fit mt-2 bg-gray-100 hover:bg-white"
				on:click={() => postPlan()}>Submit</button
			>
			<button
				class="border border-slate-500 rounded px-[2px] h-fit mt-2 ml-1 bg-gray-100 hover:bg-white"
				on:click={() => (AddView = 'places')}>Cancel</button
			>
		</div>
	</div>
{/if}

<style>
	input {
		border: solid 2px;
		border-color: red;
		margin: 5px;
		font-size: 12px;
		text-overflow: ellipsis;
		width: fit-content;
		border-radius: 0.375rem;
	}
</style>
