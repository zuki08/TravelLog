import {writable} from 'svelte/store';

const state = writable("dash");
const info = writable("dash");
const filler = writable([]);
const mapLoc = writable([]);
const tripId = writable("");
export{
    state,
    filler,
    info,
    mapLoc,
    tripId
}