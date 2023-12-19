<script>
    import {state, info} from "./store.js" 
    let cAdd = ""; 
    state.subscribe(_s => cAdd = _s);
    function setView(name){
        state.update((_page) => {
            _page = name;
            return _page;
        });
        info.update((_s) => {
            return name;
        })
    }
</script>

<div class="flex flex-row-reverse w-full bg-blue-400">
    {#if cAdd === "dash"}
        <button class="border border-white bg-slate-400 rounded m-2 px-2 text-white" on:click={() => setView("add")}>Add Trip</button>
    {:else if cAdd === "add"}
        <button class="border border-white bg-slate-400 rounded m-2 px-2 text-white" on:click={() => setView("dash")}>Cancel</button>
    {/if}
    <button class="border border-white bg-slate-400 rounded m-2 px-2 text-white" on:click={() => setView("dash")}>Dashboard</button>
</div>