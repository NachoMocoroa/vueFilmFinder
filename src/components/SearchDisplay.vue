<template>
  <div class="search-content">
    <template v-if="selected === null">
      <div class="displayer-notice">
        <p>- No results -</p>
      </div>
    </template>
    <template v-else>
      <div class="displayer-frame"
      :class="{ visible: selected }">
        <div class="displayer-frame-info">
          <table>
            <tr>
              <td>Título:</td>
              <td>{{selected.Title}}</td>
            </tr>
            <tr>
              <td>Año:</td>
              <td>{{ numberWithDotMiles }}</td>
            </tr>
            <tr>
              <td>imdb ID:</td>
              <td>{{selected.imdbID}}</td>
            </tr>
          </table>
        </div>
        <div class="displayer-frame-image">
          <img :src="selected.Poster"
          :alt="selected.Title"
          :title="selected.Title">
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  import EventBus from '../bus';

  export default {
    name: 'SearchDisplay',
    data () {
      return {
        selected: null
      }
    },
    created() {
      EventBus.$on('send-selected', (param) => {
        this.selected = param;
      });
    },
    computed: {
      numberWithDotMiles() {
        if (this.selected.Year !== null && this.selected.Year !== undefined) {
          return this.selected.Year.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .search-content {
    position: relative;
    width: 100%;
    height: 100%;
    .displayer-notice {
      text-align: center;
      font-size: var(--font-title-small);
      font-weight: var(--weight-bold);
      color: var(--error-color);
    }

    .displayer-frame {
      padding: 20px 10px 0 10px;
      -webkit-opacity: 0;
      opacity: 0;
      -webkit-transition: all 0.25s ease-in-out;
      transition: all 0.25s ease-in-out;
      &.visible {
        -webkit-opacity: 1;
        opacity: 1;
      }
      .displayer-frame-info {
        min-height: 110px;
        table {
          border-collapse: collapse;
          width: 100%;
          tr td {
            padding: 5px 10px;
            vertical-align: top;
            &:first-child {
              font-weight: var(--weight-bold);
              width: 30%;
              text-align: right;
            }
            &:last-child {
              width: 70%;
              text-align: left;
            }
          }
          tr:first-child td:last-child {
            font-size: var(--font-subtitle);
            font-weight: var(--weight-bold);
            color: var(--blue-normal);
          }
        }
      }
      .displayer-frame-image {
        text-align: center;
        min-height: 350px;
        img {
          max-width: 200px;
          -webkit-box-shadow: 0px 3px 10px 0px rgba(50, 50, 50, 0.5);
          -moz-box-shadow:    0px 3px 10px 0px rgba(50, 50, 50, 0.5);
          box-shadow:         0px 3px 10px 0px rgba(50, 50, 50, 0.5);
        }
      }
    }
  }

  /* ---------- MEDIA QUERIES --------*/
  @media screen and (min-width: 640px) {
    .displayer-frame {
      display: flex;
      justify-content: space-around;
    }
    .displayer-frame-image {
      text-align: center;
      padding: 0 0 20px 0;
    }
  }
  @media screen and (min-width: 768px) {
    :host {
      margin: 0 0 0 20px;
    }
    .displayer-notice {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .displayer-frame {
      display: block;
    }
    .displayer-frame-info {
      margin: 0 0 20px 0;
    }
  }
</style>
