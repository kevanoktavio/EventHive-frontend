<template>
  <div>
    <v-card>
            <div>
                <v-card-subtitle>
                  <v-rating
                  :value="eventReview.numStars"
                  color="amber"
                  dense
                  half-increments
                  readonly
                  size="14"
                  >
                  </v-rating>
                  <p class="mt-2 mb-0 font-weight-medium">{{ eventReview["userName"] }}  </p>

                </v-card-subtitle>
                <v-card-text>  {{ eventReview["reviewText"] }}</v-card-text>
                
            </div>
        </v-card><br/>
  </div>
</template>

<script>
        export default {
        name: 'HostEventReview',
        props: {
          eventReview: {
            type: Object,
            required: true
            
          }
        },
        data: () => ({
        
    }),
    computed: {
      
    },
    }
</script>