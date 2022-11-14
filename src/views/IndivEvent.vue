<template>
    <LoadingScreen v-if="isLoading"></LoadingScreen>
    <div v-else>
      <EventDetails></EventDetails>
      </div>
</template>
<script>
    // import SearchBar from '@/components/SearchBar.vue';
    import LoadingScreen from '@/components/LoadingScreen.vue';
    import EventDetails from '@/components/EventDetails.vue';
    
    export default {
    name: "Home",
    components: { LoadingScreen, EventDetails },

    create() {
        window.addEventListener("load", this.onWindowLoad);
    },

    mounted() {
    setTimeout(() => {
      this.isLoading = false;
    },1500);
    },

    data() {
      return {
        isLoading: true
      }
    },
}

</script>
<!-- <style>


  .EventDetails {
    display: flex;
    flex-direction: row;
    /* justify-content: space-between; */
    margin: 5px;
  }
  
  .EventImage{
    display: flex;
    justify-content: left;
    width: 200px;
    height: 200px;
    object-fit: cover;
    margin-right: 20px;
  }

  .EventInfo{
    display: flex;
    flex-direction: column;
    /* justify-content: space-between; */
    margin: 5px;
    font-family: 'Roboto', sans-serif;
    text-align: left;
  }

.event-datetime{
  font-weight: bold;
  font-size: 110%;
}
.event-name{
    font-size: 300%;
    font-weight: bold;
    /* margin: 10px; */
}

.event-description{
  font-size: 90%;
}

</style> -->