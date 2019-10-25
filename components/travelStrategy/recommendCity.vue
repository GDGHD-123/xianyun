<template>
  <div @mouseleave="mouseleave" class="city_bigBox">
    <div class="city_left">
      <div
        class="city_box"
        @mouseenter="mouseenter(index)"
        v-for="(item,index) in cityArr"
        :key="index"
      >
        <span class="span">{{item.type}}</span>
        <span class="span">></span>
      </div>
    </div>
    <div class="city_rigth" v-show="currentOption">
      <div v-for="(item,index) in some" :key="index" @click="handleCity(item.city)">
        <span>{{index+1}}</span>
        <span>{{item.city}}</span>
        <span>{{item.desc}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cityArr: [],
      currentOption: false,
      some: []
    };
  },
  mounted() {
    setTimeout(() => {
      this.$axios({
        url: "/posts/cities",
        method: "GET"
      }).then(res => {
        const { data } = res.data;
        this.cityArr = data;
      });
    }, 20);
  },
  methods: {
    mouseenter(index) {
      this.currentOption = true;
      this.some = this.cityArr[index].children;
    },
    mouseleave() {
      this.currentOption = false;
    },
    handleCity(city) {
      this.$emit("getInputCity", city);
    }
  }
};
</script>

<style scoped lang="less">
.city_bigBox {
  .city_left {
    display: inline-block;
    width: 100%;
    .city_box {
      border: 1px solid #ccc;
      display: flex;
      justify-content: space-between;
      padding: 8px;
      span {
        transition: all .2s;
        &:first-child {
          margin-left: 20px;
        }
        &:last-child {
          color: #ccc;
          margin-right: 20px;
        }
      }
      &:hover {
        border-right: 0px;
        background: white;
        position: relative;
        margin-right: -2px;
        z-index: 2;
        .span {
          color: #ffa90d !important;
          transform: translate(10px, 0);
        }
      }
    }
  }

  .city_rigth {
    width: 23%;
    display: inline-block;
    z-index: 1;
    padding-left: 20px;
    position: fixed;
    background: white;
    border: 1px solid #ccc;
    &:hover {
      cursor: pointer;
    }
    span {
      color: #ccc;
      &:nth-child(1) {
        font-style: oblique;

        font-size: 24px;
        color: #ffa90d;
      }
      &:nth-child(2) {
        color: #ffa90d;
      }
    }
  }
}
</style>