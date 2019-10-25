<template>
  <div>
    <div class="big_box" v-if="data.images.length>1">
      <div style="cursor:pointer;" @click="hangleArticle(data.id)">
        <h4>{{data.title}}</h4>
        <div class="text">
          <span>{{data.summary}}</span>
        </div>
        <div class="img_box">
          <img v-for="(item,index) in data.images" :key="index" :src="item" alt v-show="index<3" />
        </div>
      </div>
      <div class="comment">
        <div>
          <span class="iconfont icon-location"></span>
          <span>{{data.cityName}}</span>
          <span>by</span>
          <div class="touxiang">
            <img :src="$axios.defaults.baseURL+data.account.defaultAvatar" alt />
            <span class="yellow">{{data.account.nickname}}</span>
          </div>
          <span class="iconfont icon-yanjing"></span>
          <span>{{data.watch}}</span>
        </div>
        <div class="yellow">{{data.like || 0}}赞</div>
      </div>
    </div>

    <div class="big_box2" v-if="data.images.length<=1">
      <div class="img_box" style="cursor: pointer" @click="hangleArticle(data.id)">
        <img v-if="data.images[0]" :src="data.images[0]" alt />
        <img
          v-else
          src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3826315951,2112473128&fm=26&gp=0.jpg"
          alt
        />
      </div>
      <div class="text_box">
        <div style="cursor: pointer" @click="hangleArticle(data.id)">
          <h4>{{data.title}}</h4>
          <div class="text">
            <span>{{data.summary}}</span>
          </div>
        </div>
        <div class="comment">
          <div>
            <span class="iconfont icon-location"></span>
            <span>{{data.cityName}}</span>
            <span>by</span>
            <div class="touxiang">
              <img :src="$axios.defaults.baseURL+data.account.defaultAvatar" alt />
              <span class="yellow">{{data.account.nickname}}</span>
            </div>
            <span class="iconfont icon-yanjing"></span>
            <span>{{data.watch}}</span>
          </div>
          <div class="yellow">{{data.like || 0}}赞</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: {}
    }
  },
  mounted() {
    //   console.log(this.data.images.length)
  },
  methods: {
    hangleArticle(id) {
      this.$router.push(`/post/detail?id=${id}`);
    }
  }
};
</script>

<style scoped lang="less">
.touxiang {
  img {
    margin-top: -2px;
  }
  display: inline-block;
  cursor: pointer;
}
.yellow {
  color: #ffa90d;
}
.comment {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
  div {
    &:first-child {
      width: 80%;
      font-size: 3 / 360 * 100vw;
      color: #757575;
    }
    img {
      width: 5 / 360 * 100vw;
      vertical-align: middle;
    }
  }
}
.big_box {
  padding: 30px 0;
  border-bottom: 1px solid #ccc;
  h4 {
    cursor: pointer;
    &:hover {
      color: #ffa90d;
    }
  }
  .text {
    height: 80px;
    width: 100%;
    overflow: hidden;
    display: inline-block;
    padding: 10px 0;
    color: #757575;
  }
  .img_box {
    margin: 10px 0;
    display: flex;
    width: 100%;
    justify-content: space-between;
    img {
      display: block;
      width: 33%;
      height: 40 / 360 * 100vw;
      object-fit: cover;
    }
  }
}
.big_box2 {
  padding: 30px 0;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #ccc;
  .text_box {
    width: 65%;
    h4 {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
      &:hover {
        color: #ffa90d;
      }
    }
    .text {
      height: 80px;
      width: 100%;
      overflow: hidden;
      display: inline-block;
      padding: 10px 0;
      color: #757575;
    }
  }
  .img_box {
    width: 33%;
    justify-content: space-between;
    img {
      margin-top: -1 / 360 * 100vw;
      display: block;
      width: 100%;
      height: 40 / 360 * 100vw;
      object-fit: cover;
    }
  }
}
</style>