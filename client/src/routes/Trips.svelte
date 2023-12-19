<script>
    export let trip = {};
    export let dFunc = () => {};
    let location=trip.location , startDate=trip.startDate, endDate=trip.endDate;
    import {info, tripId, filler} from './store.js'
    function setView(name){
        info.update(() => name);
        tripId.update(() => trip.id);
    }
    let editTrip = false;
    function tEdit() {
        fetch(`http://localhost:54213/editTrip/${trip.id}`, {
            method:"PUT",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({id:trip.id, location:location, startDate:startDate, endDate:endDate, itinerary:trip.itinerary})
        }).then(() => {
            console.log("DONE");
            fetch("http://localhost:54212/all")
            .then(r => r.json()
                    .then(d => {
                        filler.update(() => d);
                    })
                    .catch(e => console.error("24: " + e))
            ).catch(e => console.error("25: " + e))
        }).catch(e => console.error("26: " + e));
        editTrip = false;
    }
    function deltrip(){
        dFunc(trip.id);
    }
</script>

<div class="basis-1/3 border border-pink-400 bg-slate-300 m-2 rounded-md text-center">
    {#if !editTrip}
    <h3 class="text-lg font-semibold">{trip.location}</h3>
        <p>Start Date: {trip.startDate}</p>
        <p>End Date: {trip.endDate}</p>
        <button class="border border-slate-500 rounded px-2 py-0 bg-gray-100 hover:bg-white" on:click={() => setView("places")}>Info</button>
        <button class="border border-slate-500 rounded px-2 py-0 bg-gray-100 hover:bg-white" on:click={() => editTrip=true}>Edit</button>
    {:else}
        <div>
            <div class="flex flex-row-reverse">
                <button class="border-0 bg-transparent" on:click={() => deltrip()}>🗑️</button>
            </div>
            <div class="flex flex-row justify-center">
                <label for="location" class="basis-1/5">Trip:</label>
                <input id="location" class="basis-1/5" type="text" bind:value={location} />
            </div>
            <div class="flex flex-row justify-center">
                <label for="start" class="basis-1/5">Start Date:</label>
                <input id="start" class="basis-1/4" type="date" bind:value={startDate} />
            </div>
            <div class="flex flex-row justify-center">
                <label for="end" class="basis-1/5">End Date:</label>
                <input id="end" class="basis-1/4" type="date" bind:value={endDate} />
            </div>
            <div class="flex flex-row justify-center">
                <button class="border border-slate-500 rounded px-[2px] h-fit mt-2 bg-gray-100 hover:bg-white" on:click={() => tEdit()}>Submit</button>
                <button class="border border-slate-500 rounded px-[2px] h-fit mt-2 ml-1 bg-gray-100 hover:bg-white" on:click={() => editTrip=false}>Cancel</button>
            </div>
        </div>
    {/if}
</div>

<style>
    input{
        border: solid 2px;
        border-color: red;
        margin:5px;
        font-size: 12px;
        text-overflow: ellipsis;
        width: fit-content;
        border-radius: 0.375rem;
    }
</style>