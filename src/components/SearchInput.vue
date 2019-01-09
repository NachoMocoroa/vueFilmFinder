<template>
  <div class="search-container">
    <div class="search-container-input">
      <input type="text"
      name="form-input"
      placeholder="Write search"
      v-model="search"
      v-on:keyup.enter="searchData">
      <label for="form-input">Search</label>
    </div>
    <div class="search-container-button">
      <span class="btn-search"
      v-on:click="searchData">Search</span>
    </div>
  </div>
</template>

<script>
  import EventBus from '../bus';

  export default {
    name: 'SearchInput',
    data () {
      return {
        search: ''
      }
    },
    methods: {
      searchData() {
        const obj = {
          "search": this.search,
          "page": 1
        }
        EventBus.$emit('search-data', obj);
        this.search = '';
      }
    }
  }
</script>

<style lang="scss" scoped>
  .search-container {
    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 1fr;
    .search-container-input {
      display: inline-block;
      position: relative;
      width: 100%;
      margin-bottom: 10px;
      label, input {
        color: inherit;
        transition: all 0.2s;
        touch-action: manipulation;
      }
      input[has-data] {
        border-bottom: 2px solid var(--blue-normal);
      }
      input {
        width: 100%;
        height: 30px;
        margin: 0 0 0 0;
        padding: 0;
        font-size: var(--font-subtitle);
        border: 0;
        border-bottom: 2px solid var(--grey-lighter);
        font-family: inherit;
        -webkit-appearance: none;
        border-radius: 0;
        cursor: text;
        &:focus {
          outline: 0;
          border-bottom: 2px solid var(--blue-normal);
        }
      }
      label {
        position: absolute;
        top: 5px;
        left: 0;
        text-transform: uppercase;
        pointer-events: none;
        color: var(--grey-light);
      }
      ::-webkit-input-placeholder {
        opacity: 0;
        transition: inherit;
      }

      input:focus::-webkit-input-placeholder {
        opacity: 1;
      }

      input:placeholder-shown + label {
        position: absolute;
        top: 5px;
        left: 0;
        margin: 0;
        font-size: var(--font-subtitle-small);
        cursor: text;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      input:not(:placeholder-shown) + label,
      input[has-data] + label,
      input:active + label,
      input:focus + label {
        top: -20px;
        color: var(--blue-normal);
      }
    }
    .search-container-button {
      display: inline-block;
      width: 100%;
      .btn-search {
        display: block;
        width: 100%;
        max-width: 100px;
        height: 30px;
        margin: 0 auto;
        padding: 0;
        background-color: var(--white);
        color: var(--blue-normal);
        border: 2px solid var(--blue-normal);
        border-radius: 10px;
        font: inherit;
        font-weight: var(--weight-bold);
        line-height: 30px;
        text-transform: uppercase;
        text-align: center;
        cursor: pointer;
        -webkit-transition: all 0.15s ease-in-out;
        transition: all 0.15s ease-in-out;
        &:hover {
          background-color: var(--blue-normal);
          color: var(--white);
        }
      }
    }
  }

  @media screen and (min-width: 768px) {
    .search-container {
      grid-template-rows: 1fr;
      grid-template-columns: 70% 1fr;
    }
  }
</style>
