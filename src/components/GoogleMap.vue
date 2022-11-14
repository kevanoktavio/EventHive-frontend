<template>
<GmapMap
  :center="longLat"
  :zoom="15"
  map-type-id="roadmap"
  style="width: 500px; height: 300px"
  :options="{
   zoomControl: true,
   mapTypeControl: false,
   scaleControl: false,
   streetViewControl: false,
   rotateControl: false,
   fullscreenControl: true,
  //  disableDefaultUi: false
 }"
>
  <GmapMarker
    :position="longLat"
    :clickable="true"
    :draggable="false"
    @click="center=longLat"
    :icon="icon"
  />
</GmapMap>
</template>

<script>
export default {
  name: "GoogleMap",
  async mounted() {
    await this.$gmapApiPromiseLazy();
  },
  props: {
    long: {
      type: String,
      required: true,
    },
    lat: {
      type: String,
      required: true
    },
    locationName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
    }
  },
  computed: {
    longLat() {
      return {lat: Number(this.lat), lng: Number(this.long)}
    },
    icon() {
      return {
        url: 'https://s3uploader-s3uploadbucket-1n437kmzb14jp.s3.ap-southeast-1.amazonaws.com/ezgif-2-b496ff6fde.gif',
        // origin: {x:0,y:-200},
      }
    }
  },
  methods: {
    tilesloadedEvent() {
      console.log('>>>>>>>>>> getCenter', this.$refs.gmap.$mapObject.getCenter())
      console.log('>>>>>>>>>> getZoom', this.$refs.gmap.$mapObject.getZoom())
      console.log('>>>>>>>>>> getBounds', this.$refs.gmap.$mapObject.getBounds())
    }
  }
}
</script>
