<script>
    import "../app.css"
    import { onMount } from "svelte";
    import NavBar from "./NavBar.svelte";
    import DashContainer from "./DashContainer.svelte"
    import {state, info, filler} from "./store.js"
    let page;
    let location="", startDate="", endDate="";
    onMount(async () =>{
        let docs = await (await fetch("http://localhost:54212/all")).json();
        filler.update((_p) => {
            _p = docs;
            return _p;
        });
    });
    state.subscribe((_page) => {
        page = _page;
        if(_page === "dash"){
            info.update((i) => "dash");
        }
    })
    function cTrip(){
        fetch(`http://localhost:54213/createTrip`, {
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({location:location, startDate:startDate, endDate:endDate, itinerary:{}})
        }).then(() => {
            console.log("DONE");
            fetch("http://localhost:54212/all")
            .then(r => r.json()
                    .then(d => {
                        filler.update(() => d);
                        state.update(() => "dash");
                    })
                    .catch(e => console.error("36: " + e))
            ).catch(e => console.error("37: " + e))
        }).catch(e => console.error("38: " + e));
        location = startDate = endDate = "";
    }
</script>

<NavBar />
{#if page === "dash"}
    <DashContainer />
{:else if page === "add"}
<div>
    <div class="flex flex-row justify-center">
        <label for="location" class="basis-1/12">Location:</label>
        <input id="location" class="basis-1/8" type="text" bind:value={location} />
    </div>
    <div class="flex flex-row justify-center">
        <label for="start" class="basis-1/12">Start Date:</label>
        <input id="start" class="basis-1/8" type="date" bind:value={startDate} />
    </div>
    <div class="flex flex-row justify-center">
        <label for="end" class="basis-1/12">End Date:</label>
        <input id="end" class="basis-1/8" type="date" bind:value={endDate} />
    </div>
    <div class="flex flex-row justify-center">
        <button class="border border-slate-500 rounded px-[2px] h-fit mt-2 bg-gray-100 hover:bg-white" on:click={() => cTrip()}>Submit</button>
        <button class="border border-slate-500 rounded px-[2px] h-fit mt-2 ml-1 bg-gray-100 hover:bg-white" on:click={() => state.update(() => "dash")}>Cancel</button>
    </div>
</div>
{/if}

<style>
    input{
        border: solid 2px;
        border-color: red;
        margin:5px;
        font-size: 12px;
        text-overflow: ellipsis;
        width: fit-content;
    }
</style>