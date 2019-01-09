<template>
  <div class="search-content">
    <ul class="list-data">
      <li class="list-item"
      data-selected="false"
      v-for="(search, index) in searches"
      :key="index"
      @click="setSelected(index)">
        <span>{{ setIndex(index + 1) }}</span>
        <span>{{ search.Title }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
  import EventBus from '../bus';

  export default {
    name: 'SearchOutput',
    data () {
      return {
        searches: null,
        selected: null,
        selectedValue: false,
        indexValue: null
      }
    },
    mounted() {
      EventBus.$on('send-data', (param) => {
        this.checkData(param);
      });
      EventBus.$on('first-click', () => {
        this.firstClick();
      });
    },
    methods: {
      setIndex(num) {
        let ind = (this.indexValue * 10) - 10;
        if (this.indexValue > 1) {
          return ind + num;
        } else {
          return num;
        }
      },
      checkData(param) {
        if (param.data !== null) {
          const dataJson = JSON.parse(param.data);
          this.indexValue = param.page;
          this.searches = dataJson.Search;
          let timerClick = null;
          timerClick = window.setTimeout(function() {
            EventBus.$emit('first-click');
            window.clearTimeout(timerClick);
          }, 100);
        }
      },
      firstClick() {
        let e = document.createEvent('HTMLEvents');
        e.initEvent('click', false, true);
        document.querySelector('.list-item').dispatchEvent(e);
      },
      setSelected(param) {
        let itemsList = document.querySelectorAll('.list-item'),
          itemsListLength = itemsList.length;

        this.selected = param;
        for (let i = 0; i < itemsListLength; i++) {
          itemsList[i].dataset.selected = false;
        }
        itemsList[this.selected].dataset.selected = true;
        EventBus.$emit('send-selected', this.searches[this.selected]);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .search-content {
    width: 100%;
    min-height: 300px;
    margin-top: 20px;
    .list-data {
      margin: 0;
      padding: 0;
      list-style: none;
      .list-item {
        display: grid;
        grid-template-rows: 1fr;
        grid-template-columns: 50px 1fr;
        min-height: 20px;
        margin: 0;
        padding: 0;
        line-height: 1;
        span {
          margin: 0;
          padding: 5px 10px;
          line-height: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          background-color: var(--white);
          border-bottom: 1px solid var(--grey-lighter);
          color: var(--grey-medium);
          cursor: pointer;
          -webkit-transition: all 0.15s ease-in-out;
          transition: all 0.15s ease-in-out;
          &:first-of-type {
            border-right: 1px solid var(--grey-lighter);
          }
          &:last-of-type {
            text-align: left;
          }
        }
      }
      .list-item:first-child > span {
        border-top: 1px solid var(--grey-lighter);
      }

      .list-item[data-selected="true"] > span {
        background-color: var(--outline-item);
        border-bottom: 1px solid var(--outline-item);
        color: var(--white);
      }

      .list-item[data-selected="false"]:hover > span {
        background-color: var(--grey-light);
        border-bottom: 1px solid var(--grey-light);
        color: var(--white);
      }
    }
  }
</style>
