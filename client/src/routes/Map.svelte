<script>
    import { onMount, onDestroy } from 'svelte'
    import { Map, NavigationControl, Marker } from 'maplibre-gl';
    import 'maplibre-gl/dist/maplibre-gl.css';
    import {mapLoc} from './store.js'
    
    let map;
    let mapContainer;
    export let coords = [];

    const apiKey = import.meta.env.VITE_MAP_APIKEY;

    onMount(() => {
      const initialState = { lng: coords[0], lat: coords[1], zoom: 15.5 };
  
      map = new Map({
        container: mapContainer,
        style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${apiKey}`,
        center: [initialState.lng, initialState.lat],
        zoom: initialState.zoom
      });
      map.addControl(new NavigationControl(), 'top-right');
      new Marker({color: "#FF0000"})
      .setLngLat(coords)
      .addTo(map);
      mapLoc.subscribe((_s) => {
        coords = _s;
        map.setCenter(coords);
        // map.addControl(new NavigationControl(), 'top-right');
        new Marker({color: "#FF0000"})
        .setLngLat(coords)
        .addTo(map);
        map.resize(); // Rerender the map
      });
    });
  
    onDestroy(() => {
      map.remove();
    });

  </script>
  
  <div class="map-wrap">
    <a href="https://www.maptiler.com" class="watermark"><img
      src="https://api.maptiler.com/resources/logo.svg" alt="MapTiler logo"/></a>
    <div class="map" bind:this={mapContainer}></div>
  </div>
  
  <style>
    .map-wrap {
      position: relative;
      width: 100%;
      height: calc(100vh - 120%); /* calculate height of the screen minus the heading */
    }
  
    .map {
      position: absolute;
      width: 100%;
      height: 100%;
    }
  
    .watermark {
      position: absolute;
      left: 10px;
      bottom: 10px;
      z-index: 999;
    }
  </style>