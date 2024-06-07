<script lang="ts">
  import s from "./map.module.scss";

  let mapZone: HTMLDivElement | null = null;
  let isLoaded = false;

  function initMap() {
    const companyLocation = { lat: 50.04545, lng: 30.21682 }; // замініть на координати вашої компанії

    const map = new google.maps.Map(mapZone, {
      zoom: 15,
      center: companyLocation,
    });

    new google.maps.Marker({
      position: companyLocation,
      map: map,
    });

    isLoaded = true;
  }

  $: {
    if (mapZone && !isLoaded) initMap();
  }
</script>

<div class={s.map}>
  <div class={s.mapZone} bind:this={mapZone}></div>
</div>
