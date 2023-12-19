<script>
	import Map from "./Map.svelte";
    import {filler, mapLoc} from "./store.js"
    export let obj = {}; // doc
    export let pId = "";
    obj !== undefined ? mapLoc.set(obj.itinerary[pId].coords) : "";
    let dId = obj.id;
    let modal = false;
    function setEdit(option){
        modal = option;
    }
    let title = obj ? obj.itinerary[pId].title:"";
    let address = obj? obj.itinerary[pId].address:"";
    let city = obj? obj.itinerary[pId].city: "";
    let state = obj? obj.itinerary[pId].state: "";
    let date = obj? getDate(obj.itinerary[pId].date): "";
    let time = obj? obj.itinerary[pId].time: "";
    let notes = obj? obj.itinerary[pId].notes: "";
    function updateStore(){
        console.log("Working");
        const id = obj.itinerary[pId].id;
        const nBody = {id, title, address, city, state, date, time, notes};
        // if(city === "" || zip === ""){
        //     alert("Required fields: City and Zip Code");
        //     return;
        // }
        obj.itinerary[id] = nBody;
        console.log(nBody)
        // filler.update((_i) => {
        //     return docs;
        // })
        fetch(`http://localhost:54211/editPlan/${dId}/${id}`,{
            method: "PUT",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(nBody)
        }).then(() => {
            console.log("UPDATED");
            fetch("http://localhost:54212/all")
            .then(r => r.json()
                .then(d => {
                    filler.update((_s) => {
                        obj = d.filter(e => e.id === dId)[0];
                        mapLoc.update((_s) => obj.itinerary[pId].coords);
                        return d;
                    })
                })
            )
        }).catch(e => console.error(e));
        setEdit(false);
    }
    function getDate(dat){
        let date = new Date(dat);
        console.log(date);
        let day = date.getUTCDate();
        let month = date.getUTCMonth() + 1; // Months are zero-based
        let year = date.getUTCFullYear();
        let formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
        return formattedDate;
    }
</script>
 
<div class="basis-1/4 border border-pink-400 bg-slate-300 text-center rounded-md px-2 m-1">
    {#if !modal}
        <h3>{obj.itinerary[pId].title}</h3>
        <p>{obj.itinerary[pId].address}</p>
        <p>{obj.itinerary[pId].city}</p>
        <p>{obj.itinerary[pId].state}</p>
        <p>{obj.itinerary[pId].date === "" ? "" : getDate(obj.itinerary[pId].date)}</p>
        <p>{obj.itinerary[pId].time}</p>
        <p>{obj.itinerary[pId].notes}</p>
        <button class="border border-slate-500 rounded px-[2px] h-fit mt-2 bg-gray-100 hover:bg-white" on:click={() => setEdit(true)}>Edit</button>
    {:else if modal}
    <div class="flex flex-row justify-center">
        <label for="title" class="basis-1/4">Title:</label>
        <input id="title" class="basis-1/3" type="text" bind:value={title} />
    </div>
    <div class="flex flex-row justify-center">
        <label for="address" class="basis-1/4">Address:</label>
        <input id="address" class="basis-1/3" type="text" bind:value={address} />
    </div>
    <div class="flex flex-row justify-center">
        <label for="city" class="basis-1/4">City:</label>
        <input id="city" class="basis-1/3" type="text" bind:value={city} />
    </div>
    <div class="flex flex-row justify-center">
        <label for="state" class="basis-1/4">State</label>
        <input id="state" class="basis-1/3" type="text" bind:value={state} />
    </div>
    <div class="flex flex-row justify-center">
        <label for="date" class="basis-1/4">Date:</label>
        <input id="date" class="basis-1/3" type="date" bind:value={date} />
    </div>
    <div class="flex flex-row justify-center">
        <label for="time" class="basis-1/4">Time:</label>
        <input id="time" class="basis-1/3" type="time" bind:value={time} />
    </div>
    <div class="flex flex-row justify-center">
        <label for="notes" class="basis-1/4">Notes:</label>
        <input id="notes" class="basis-1/3" type="text" bind:value={notes} />
    </div>
    <div class="flex flex-row justify-center">
        <button class="border border-slate-500 rounded px-[2px] h-fit m-1 bg-gray-100 hover:bg-white" on:click={() => updateStore()}>Submit</button>
        <button class="border border-slate-500 rounded px-[2px] h-fit m-1 bg-gray-100 hover:bg-white" on:click={() => setEdit(false)}>Cancel</button>
    </div>
    {/if}
</div>
<div class="basis-1/2 px-2 m-2">
    <Map coords={obj.itinerary[pId].coords}/>
</div>

<style>
    input{
        border: solid 2px;
        border-color: red;
        margin:2px;
        font-size: 12px;
        text-overflow: ellipsis;
        width: fit-content;
        border-radius: 0.375rem;
    }
</style>