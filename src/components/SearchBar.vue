<template>
  <!-- html -->
  <v-hover v-slot="{ hover }">
    <v-container
      class="px-0 mb-3"
      flat
      v-click-outside="hide"
      @click="isAdvanced = true"
    >
      <v-row class="flex-nowrap">
        <v-text-field
          placeholder="Search for anything"
          outlined
          dense
          rounded
          hide-details
          class="search-box"
          v-model="searchText"
          @keyup.enter="search"
          color="greenDark"
        ></v-text-field>
        <v-btn icon small color="greenDark" class="ml-1 my-auto" @click="search"
          ><v-icon>search</v-icon></v-btn
        >
      </v-row>
      <v-row v-if="hover || isAdvanced" class="mr-5">
        <!-- Anytime -->
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          :return-value.sync="dateSelected"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              class="mt-1 col-sm-4"
              v-model="dateRangeText"
              rounded
              outlined
              dense
              hide-details
              placeholder="Anytime"
              readonly
              v-bind="attrs"
              v-on="on"
              color="greenDark"
              @focus="isAdvanced = true"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="dateSelected"
            no-title
            range
            scrollable
            :min="today"
            color="greenDark"
          >
            <v-spacer></v-spacer>
            <v-btn text color="greenDark" @click="clearLocation"> Clear </v-btn>
            <v-btn
              text
              color="greenDark"
              @click="$refs.menu.save(dateSelected)"
            >
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>

        <!-- Anywhere to change to LocationSearchBar -->
        <v-autocomplete
          v-model="locationSelected"
          :loading="loading"
          :items="locationItems"
          :search-input.sync="searchLocation"
          cache-items
          class="mt-1 col-md"
          clearable
          hide-details
          outlined
          dense
          rounded
          placeholder="Anywhere"
          color="greenDark"
        >
          <template v-slot:no-data>
            <v-list-item>
              <v-list-item-title>
                Search for a location
              </v-list-item-title>
            </v-list-item>
          </template>
        </v-autocomplete>

        <!-- check capacity of event -->
        <v-select
          :items="maxGroupSize"
          :menu-props="{ bottom: true, offsetY: true }"
          v-model="groupSizeSelected"
          rounded
          hide-no-data
          hide-details
          clearable
          dense
          placeholder="Any Group Size"
          outlined
          class="mt-1 col-md"
          color="greenDark"
        ></v-select>
      </v-row>
    </v-container>
  </v-hover>
</template>

<script>
// javascript
export default {
  name: "SearchBar",
  data() {
    return {
      menu: false,
      searchText: "",
      isAdvanced: false,
      today: new Date().toISOString().slice(0, 10),
      dateSelected: null,

      loading: false,
      locationSelected: null, // shown on the v-autocomplete
      locationItems: [], // array of locations shown on the dropdown menu
      searchLocation: "",

      groupSizeSelected: null,
      maxGroupSize: ["1", "2 - 4", "5 - 10", "10+"],
    };
  },
  methods: {
    clearLocation() {
      this.dateSelected = "";
      this.$refs.menu.save(this.dateSelected);
      this.$refs.menu = false;
    },
    hide() {
      if (
        (this.dateSelected == null || this.dateSelected == "") &&
        this.locationSelected == null &&
        this.groupSizeSelected == null
      ) {
        this.isAdvanced = false;
      }
    },
    search() {
      // call search page with the search parameters
      console.log("searching");
      console.log(this.dateSelected);
      let startdate =
        this.dateSelected == "" || this.dateSelected == null
          ? ""
          : this.dateSelected[0] > this.dateSelected[1]
          ? this.dateSelected[1]
          : this.dateSelected[0];
      let enddate =
        this.dateSelected == "" || this.dateSelected == null
          ? ""
          : this.dateSelected[1] > this.dateSelected[0]
          ? this.dateSelected[1]
          : this.dateSelected[0];
      let location = this.locationSelected == null ? "" : this.locationSelected;
      let groupsize =
        this.groupSizeSelected == null ? "" : this.groupSizeSelected;

      this.$router.push(
        "/search?name=" +
          this.searchText +
          "&location=" +
          location +
          "&groupSize=" +
          groupsize +
          "&startdate=" +
          startdate +
          "&enddate=" +
          enddate
      );
    },
  },
  computed: {
    dateRangeText() {
      // console.log(this.dateSelected);

      // if no date selected, leave empty
      if (this.dateSelected == null || this.dateSelected == "") {
        return "";
      }

      var today = new Date();

      let [year1, month1, day1] = [
        today.getFullYear(),
        today.getMonth() + 1,
        today.getDate(),
      ];

      // if there is only one date selected, return that one date
      if (
        this.dateSelected.length == 1 ||
        this.dateSelected[0] == this.dateSelected[1]
      ) {
        [year1, month1, day1] = this.dateSelected[0].split("-");
        return `${day1}/${month1}/${year1}`;
      }

      // range of dates (2 dates selected)

      // if there is a start date, get start date
      if (this.dateSelected[0] != "") {
        [year1, month1, day1] = this.dateSelected[0].split("-");
      }

      let [year2, month2, day2] = ["", "", ""];

      // if there is an end date, get end date
      if (this.dateSelected[1] != "") {
        [year2, month2, day2] = this.dateSelected[1].split("-");
        if (this.dateSelected[0] == "") {
          return `${day2}/${month2}/${year2}`;
        }
      }

      // return dates in ascending order
      if (this.dateSelected[0] > this.dateSelected[1]) {
        return (
          `${day2}/${month2}/${year2}` + " - " + `${day1}/${month1}/${year1}`
        );
      } else {
        return (
          `${day1}/${month1}/${year1}` + " - " + `${day2}/${month2}/${year2}`
        );
      }
    },
  },
  watch: {
    searchLocation(val) {
      // console.log("searchLocation" + val);
      this.axios
        .get(
          `https://developers.onemap.sg/commonapi/search?searchVal=${val}&returnGeom=Y&getAddrDetails=Y&pageNum=1`
        )
        .then((response) => {
          this.locationItems = [];
          response.data.results.forEach((result) => {
            this.locationItems.push(result.SEARCHVAL);
            // this.results.push(result);
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>
