<template>
  <div id="app" class="search-wrapper">
    <search-http></search-http>
    <section class="search-data">
      <search-input></search-input>
      <search-output></search-output>
      <search-pagination></search-pagination>
    </section>
    <section class="search-data">
      <search-display></search-display>
    </section>
  </div>
</template>

<script>
  import SearchHttp from './components/SearchHttp';
  import SearchInput from './components/SearchInput';
  import SearchOutput from './components/SearchOutput';
  import SearchDisplay from './components/SearchDisplay';
  import SearchPagination from './components/SearchPagination';

  export default {
    name: 'app',
    components: {
      SearchHttp,
      SearchInput,
      SearchOutput,
      SearchDisplay,
      SearchPagination
    }
  }
</script>

<style lang="scss" scoped>
  .search-wrapper {
    width: calc(100% - 40px);
    max-width: var(--max-width);
    margin: 60px auto 0 auto;
    padding: 0;
    text-align: center;
    color: var(--grey-regular);
    .search-data {
      display: flex;
      flex-direction: column;
      width: 100%;
      max-width: unset;
      margin: 0 auto 20px 0;
      padding: 20px 0 0 0;
      outline: 1px solid #dedede;
    }
  }

  /* ---------- MEDIA QUERIES --------*/
  @media screen and (min-width: 768px) {
    .search-wrapper {
      display: grid;
      grid-template-rows: 1fr;
      grid-template-columns: 50% 50%;
      .search-data {
        width: calc(100% - 10px);
        &:first-of-type {
          margin: 0 10px 0 0;
        }
        &:last-of-type {
          margin: 0 0 0 10px;
        }
      }
    }
  }
  /* ---------- fin MEDIA QUERIES --------*/
</style>
