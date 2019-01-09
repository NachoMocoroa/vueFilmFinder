<template>
  <div class="search-container">
    <template v-if="totalResults !== null && totalResults !== undefined">
      <div class="results-data">
        <p class="display-results">
          <span class="outstanding">{{ numberWithDotMiles(totalResults) }}</span> results in <span class="outstanding">{{ numberWithDotMiles(totalPages) }}</span> {{stringOfPages(totalPages)}}
        </p>
        <p class="display-results">
          <span class="outstanding">{{ page }}</span> of <span class="outstanding">{{ numberWithDotMiles(totalPages) }}</span>
        </p>
      </div>
      <template v-if="isPagination">
        <div class="results-buttons">
          <template v-if="paginationActivated">
            <span class="btn-pagination_previous"
            :class="{'events-none': lessClick}"
            @click="prev"></span>
          </template>
          <div class="pagination-numbers">
            <span class="btn-pagination-number"
            @click="pageSelected"
            :data-iterator="1"
            data-selected="true">1</span>
            <template v-if="paginationActivated && pointInit">
              <i class="btn-pagination-ellipsis"
              data-disabled>...</i>
            </template>
            <div class="pagination-numbers-wrapper">
              <span class="btn-pagination-number"
              v-for="(button, index) in paginationButtons"
              :key="index"
              @click="pageSelected"
              :data-iterator="button.number"
              data-selected="false">
                {{ button.number }}
              </span>
            </div>
            <template v-if="paginationActivated && pointEnd">
              <i class="btn-pagination-ellipsis"
              data-disabled>...</i>
              <span class="btn-pagination-number"
              @click="pageSelected"
              :data-iterator="totalPages">
                {{numberWithDotMiles(totalPages)}}
              </span>
            </template>
          </div>
          <template v-if="paginationActivated">
            <span class="btn-pagination_next"
            :class="{'events-none': plusClick}"
            @click="next"></span>
          </template>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
  import EventBus from '../bus';

  export default {
    name: 'SearchPagination',
    data () {
      return {
        totalResults: null,
        pages: [],
        page: 1,
        isPagination: false,
        maxPages: 10,
        paginationActivated: false,
        totalPages: null,
        paginationButtons: null,
        pointInit: false,
        pointEnd: false,
        minimumInit: 3,
        lessClick: false,
        plusClick: false
      }
    },
    mounted() {
      EventBus.$on('send-data', (param) => {
        this.setBus(param);
      });
    },
    methods: {
      setBus(param) {
        if (param.data !== null && param.data !== undefined) {
          const dataJson = JSON.parse(param.data);
          this.totalResults = dataJson.totalResults;
          if (this.totalResults !== null && this.totalResults !== undefined) {
            this.pages = dataJson.Search;
            this.page = param.page;
            this.filterPagination();
          } else {
            // eslint-disable-next-line
            console.log('Data fail: ', this.totalResults);
          }
        }
      },
      resetClick() {
        let itemsNumbers = document.querySelectorAll('.btn-pagination-number');
        for (let i = 0; i < itemsNumbers.length; i++) {
          itemsNumbers[i].dataset.selected = false;
        }
      },
      numberWithDotMiles(num) {
        if (num !== null && num !== undefined) {
          return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
      },
      stringOfPages(num) {
        return num > 0 && num < 2 ? 'page' : 'pages';
      },
      setPointState() {
        const limitInit = this.minimumInit + 3;
        const limitEnd = this.totalPages - (this.minimumInit + 1);
        (this.page >= limitInit) ? this.pointInit = true : this.pointInit = false;
        (this.page >= limitEnd) ? this.pointEnd = false : this.pointEnd = true;
        this.configPagination();
      },
      configPagination() {
        const vm = this;
        let timerClick = null,
          posInit = this.minimumInit + 3,
          posEnd = vm.totalPages - 4,
          refInit = vm.page - 3,
          refEnd = vm.maxPages - 3,
          actualPage = vm.page - 1;

        timerClick = window.setTimeout(function() {
          vm.resetClick();
          if (vm.page < posInit) {
            refInit = 1;
            refEnd = refEnd - 1;
          } else if (vm.page >= posInit && vm.page < posEnd) {
            refEnd = vm.page + 2;
            actualPage = Math.ceil((refEnd - refInit) / 2);
          } else {
            refInit = vm.totalPages - 7;
            refEnd = vm.totalPages;
            actualPage = vm.page - refInit;
          }
          vm.paginationButtons = vm.setPaginationButtons(refInit, refEnd);
          vm.setButtonActive(actualPage);
          window.clearTimeout(timerClick);
        }, 100);
      },
      setButtonActive(param) {
        let timerOut = null;
        timerOut = window.setTimeout(function() {
          document.querySelectorAll('.btn-pagination-number')[param].dataset.selected = true;
          window.clearTimeout(timerOut);
        }, 50);
      },
      setSimplePagination() {
        this.isPagination = false;
        this.paginationActivated = false;
      },
      setMultiplePagination() {
        this.isPagination = true;
        this.totalPages >= this.maxPages ? this.paginationActivated = true : this.paginationActivated = false;
        this.paginationActivated ? this.setPointState() : this.paginationButtons = this.setPaginationButtons(1, this.totalPages);
      },
      filterPagination() {
        let pagesRounded = Math.ceil(this.totalResults / this.maxPages);
        this.totalPages = pagesRounded;
        if (this.totalPages === 1) {
          this.setSimplePagination();
        } else if (this.totalPages > 1) {
          this.setMultiplePagination();
        }
      },
      setPaginationButtons(f, t) {
        let temporalArray = [];
        for (let i = f; i < t; i++) {
          temporalArray.push({ "number": (i + 1) });
        }
        return temporalArray;
      },
      pageSelected(e) {
        this.page = parseInt(e.target.dataset.iterator, 10);
        EventBus.$emit('pagination-data', this.page);
      },
      prev() {
        let step = this.page;
        step--;
        this.plusClick = false;
        if (step < 1) {
          this.page = 1;
          this.lessClick = true;
        } else {
          this.page = step;
          this.lessClick = false;
        }
        EventBus.$emit('pagination-data', this.page);
      },
      next() {
        let step = this.page;
        step++;
        this.lessClick = false;
        if (step > this.totalPages) {
          this.page = this.totalPages;
          this.plusClick = true;
        } else {
          this.page = step;
          this.plusClick = false;
        }
        EventBus.$emit('pagination-data', this.page);
      }
    }
  }
</script>

<style lang="scss" scoped>

  .search-container {
    padding-top: 20px;
    .results-data {
      margin: 0 auto 30px auto;
      width: max-content;
      .display-results {
        text-align: center;
        font-size: var(--font-subtitle-small);
        margin: 0;
        padding: 0;
        & .outstanding {
          font-weight: var(--weight-bold);
          color: var(--blue-normal);
        }
      }
    }
    .results-buttons {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      max-width: 354px;
      margin: 0 auto;
      padding: 20px 0 0 0;
      span[class^="btn-pagination_"] {
        width: 30px;
        height: 30px;
        margin: 0 10px;
        padding: 0;
        border: 1px solid var(--grey-lighter);
        border-radius: 50%;
        background-image: var(--pagination-arrows);
        background-repeat: no-repeat;
        background-position: 0;
        cursor: pointer;
        & [data-disabled] {
          pointer-events: none;
          -webkit-opacity: 0.5;
          opacity: 0.5;
          cursor: default;
        }
      }

      span.btn-pagination_previous {
        margin-left: 0;
        background-position: -15px 5px;
      }
      span.btn-pagination_next {
        margin-right: 0;
        background-position: -35px 5px;
      }
      span.btn-pagination_previous,
      span.btn-pagination_next {
        &.events-none {
          pointer-events: none;
          -webkit-opacity: 0.5;
          opacity: 0.5;
          cursor: default;
        }
      }

      .pagination-numbers {
        position: relative;
        display: flex;
        flex-direction: row;
        overflow: hidden;
        max-width: 270px;
        margin: 0 auto;
        .btn-pagination-number,
        .btn-pagination-ellipsis {
          display: inline-block;
          width: 30px;
          min-width: 30px;
          height: 30px;
          margin: 0;
          padding: 0;
          font-size: var(--font-small);
          line-height: 30px;
          text-align: center;
          color: var(--grey-normal);
          cursor: pointer;
        }
        .btn-pagination-number.events-none {
          pointer-events: none;
        }
        .btn-pagination-number:hover {
          color: var(--white);
          background-color: var(--grey-normal);
        }
        .btn-pagination-number[data-selected="true"] {
          color: var(--white);
          background-color: var(--blue-normal);
          font-weight: var(--weight-bold);
        }
        .btn-pagination-ellipsis {
          display: inline-block;
          width: 30px;
          min-width: 30px;
          vertical-align: middle;
          font-size: var(--font-subtitle);
          cursor: default;
          -webkit-user-select:none;
          -moz-user-select:none;
          -ms-user-select:none;
          -o-user-select:none;
          user-select:none;
          & [data-disabled] {
            display: none;
          }
        }
      }
    }
  }
</style>
