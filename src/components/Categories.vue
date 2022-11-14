<template>
  <v-container class="fluid mt-0 pb-4 px-0">
      <v-row class="d-flex justify-space-around">
        <!-- onClick, redirect to Full Events page with Category filter placed on 
        
          potential: onHover, card increases in size
        -->
        <v-col
          v-if="xsBreakpoint"
          v-for="category in this.$store.state.categories"
          :key="category.title"

          @click="handleClick(category.filter)"
          class="col-6"
        >
        
        <v-hover
        v-slot="{ hover }">
        <v-card class="pa-sm-1 mx-lg-auto" 
        elevation=0
        :color="hover ? '#f2f5f2' : 'white'"
        >

          <font-awesome-icon :icon="category.src" color="#779977"/>
          <div class="greenDark--text font-weight-medium">{{category.title.toUpperCase()}}</div>
          
        </v-card>
        </v-hover>
        </v-col>

        <v-col
          v-if="!xsBreakpoint"
          v-for="category in this.$store.state.categories"
          :key="category.title"

          @click="handleClick(category.filter)"
        >
        
        <v-hover
        v-slot="{ hover }">
        <v-card class="pa-sm-1 mx-lg-auto " 
        elevation=0
        :color="hover ? '#f2f5f2' : 'white'"
        >

          <font-awesome-icon :icon="category.src" color="#779977"/>
          <div class="greenDark--text font-weight-medium">{{category.title.toUpperCase()}}</div>
          
        </v-card>
        </v-hover>
        </v-col>
      </v-row>
    </v-container>
</template>

<script>
  export default {
    data: () => ({
      
    }),
    computed: {
      xsBreakpoint() {
        return this.$vuetify.breakpoint.width <= 700
      }
    },
    methods:{
      handleClick: function (filter){
        this.$router.push({ path:`/events?category=${filter}`})
      }
    }
  }
</script>
