<template>
  <div class="wrapper">
    SearchHttp
  </div>
</template>

<script>
import EventBus from '../bus';
import { utils } from "../utils";

export default {
  name: 'SearchHttp',
  data() {
    return {
      searchWord: null,
      searchString: null,
      searchUrl: null,
      urlPrefix: 'https://www.omdbapi.com/?s=',
      urlSubfix: '&plot=full&apikey=e477ed6a'
    }
  },
  created() {
    EventBus.$on('search-data', (param) => {
      this.proccessData(param);
    });
    EventBus.$on('pagination-data', (param) => {
      const obj = {
        "search": this.searchWord,
        "page": param
      }
      this.proccessData(obj);
    });
  },
  methods: {
    proccessData(param) {
      this.searchWord = param.search;
      this.searchString = this.searchWord;
      if (param.page !== 1) {
        this.searchString += '&page=' + param.page;
      }
      this.searchUrl = this.urlPrefix + this.searchString + this.urlSubfix;
      utils.searchHTTP(this.searchUrl)
        .then(function(response) {
          const objData = {
            "data": response,
            "page": param.page
          }
          EventBus.$emit('send-data', objData);
        }, function(error) {
          console.error("Failed!", error);
        });
    }
  }
}
</script>

<style scoped>
  .wrapper {
    display: none;
  }
</style>
