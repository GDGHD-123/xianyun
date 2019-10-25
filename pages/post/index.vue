<template>
  <div class="main">
    <el-row type="flex" :gutter="10" class="big_box">
      <el-col :span="6">
        <RecommendCity @getInputCity="getInputCity" />
        <div class="recommend_city_box">推荐城市</div>
        <div class="recommend_city_img_box">
          <img src="/img/pic_sea.jpeg" alt />
        </div>
      </el-col>
      <el-col :offset="1" :span="18">
        <div class="inpu_box">
          <input type="text" placeholder="请输入想去的地方 , 比如 ' 广州 '" v-model="input" />
          <span class="iconfont icon-tubiaolunkuo-" @click="searchCity"></span>
        </div>
        <ul class="recommend_city_some_box">
          <li>推荐 :</li>
          <li @click="()=>{this.input='广州';this.searchCity()}">广州</li>
          <li @click="()=>{this.input='上海';this.searchCity()}">上海</li>
          <li @click="()=>{this.input='北京';this.searchCity()}">北京</li>
        </ul>
        <div class="recommend_strategy">
          <div>提交攻略</div>
          <div>
            <el-button type="primary" icon="el-icon-edit" @click="$router.push('/post/create')">写游记</el-button>
          </div>
        </div>
        <RecommendStrategy v-for="(item,index) in  list.data" :key="index" :data="item" />

        <div class="block">
          <span class="demonstration"></span>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[3, 5, 7, 10]"
            :page-size="3"
            layout="total, sizes, prev, pager, next, jumper"
            :total="list.total"
          ></el-pagination>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import RecommendCity from "@/components/travelStrategy/recommendCity.vue";
import RecommendStrategy from "@/components/travelStrategy/recommendStrategy.vue";
export default {
  components: {
    RecommendCity,
    RecommendStrategy
  },
  data() {
    return {
      total: null,
      list: [],
      currentPage: 1,
      start: 0,
      limit: 3,
      input: ""
    };
  },
  mounted() {
    this.getlist();
  },
  methods: {
    async getlist() {
      const res = await this.$axios({
        url: `/posts?_start=${this.start * this.limit}&_limit=${this.limit}`,
        method: "GET"
      });
      console.log(res.data)
      this.list = res.data;
    },
    handleSizeChange(val) {
      this.limit = val;
      this.getlist();
    },
    handleCurrentChange(val) {
      this.start = val - 1;
      this.getlist();
    },
    getInputCity(city) {
      this.input = city;
      this.searchCity();
    },
    searchCity() {
      this.$axios({
        url: `/posts?city=${this.input}`,
        method: "GET"
      }).then(res => {
        this.list = res.data;
      });
    }
  }
};
</script>

<style scoped lang="less">
.block {
  margin: 20px 0;
}
input {
  background: none;
  outline: none;
  border: none;
}
.main {
  width: 1000px;
  margin: 0 auto;
  .big_box {
    margin-top: 20px;
    .recommend_city_box {
      align-items: center;
      padding: 10px;
      border-bottom: 1px solid #ccc;
    }
    .recommend_city_img_box {
      img {
        margin-top: 20px;
        width: 100%;
      }
    }
    .inpu_box {
      border: 3px solid #ffa90d;
      width: 100%;
      display: flex;
      align-items: center;
      input {
        padding-left: 20px;
        width: 87%;
        height: 41px;
      }
      .icon-tubiaolunkuo- {
        color: #ffa90d;
        font-size: 24px;
        font-weight: 600;
        cursor: pointer;
      }
    }
    .recommend_city_some_box {
      color: #757575;
      li {
        font-size: 14px;
        display: inline-block;
        border-bottom: 1px solid white;
        &:hover {
          &:nth-child(n + 2) {
            cursor: pointer;
            color: #ffa90d;
            border-bottom: 1px solid #ffa90d;
          }
        }
      }
    }
    .recommend_strategy {
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
      div {
        &:first-child {
          color: #ffa90d;
          font-size: 20px;
          border-bottom: 1px solid #ffa90d;
          padding-bottom: 15px;
        }
        &:last-child {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 10px;
          background: #409eff;
          border-radius: 10px;
          span {
            color: white;
            &:last-child {
              margin-left: 5px;
              font-size: 16px;
            }
          }
        }
      }
    }
  }
}
</style>