<script>
    import {info, filler, tripId} from "./store.js";
    import Trips from "./Trips.svelte";
    import PlaceList from "./PlaceList.svelte";
    let view="";
    let docs = [];
    let docuId = "";
    filler.subscribe((i)=>{
        docs = i;
        console.log("Loaded");
        console.log(docs);
    })
    info.subscribe((s) => {
        view = s;
    });
    tripId.subscribe(_s => docuId = _s);
    function deltrip(id){
        fetch(`http://localhost:54213/${id}`, {
            method:"DELETE",
        }).then(() => {
            console.log("DONE");
            fetch("http://localhost:54212/all")
            .then(r => r.json()
                    .then(d => {
                        docs = [];
                        filler.update(() => d);
                    })
                    .catch(e => console.error(e))
            ).catch(e => console.error(e))
        }).catch(e => console.error(e));
    }
</script>

<!-- {#if view === 'places'}
    <button class="border border-slate-500 rounded px-[2px] h-fit m-2 bg-gray-100 hover:bg-white" on:click={() => info.update(() => "dash")}>Dashboard</button> -->
{#if view === 'loc'}
    <button class="border border-slate-500 rounded px-[2px] h-fit m-2 bg-gray-100 hover:bg-white" on:click={() => info.update(() => "places")}>Back</button>
{/if}
<div class="flex flex-wrap justify-center">
    {#if view === "dash"}
        {#each docs as doc (doc.id)}
            <Trips trip={doc} dFunc={deltrip}/>
        {/each}
    {:else if view === "places" || view === 'loc'}
        <PlaceList doc={docs.filter(e => e.id === docuId)[0]} docId={docuId} />
    {/if}
</div>