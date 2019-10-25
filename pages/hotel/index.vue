<template>
  <div class="main">
    <div class="top_box">
      <p>
        <span>南京</span>
        <span>></span>
        <span>南京市酒店预订</span>
      </p>
    </div>
    <SearchCity :loading="loading" @selectedHotle="selectedHotle" :hotel_list="hotel_list" />
    <div v-loading="loading" class="min_box">
      <Hotelitem v-for="(item,index) in hotel_list.data" :key="index" :data="item" />
    </div>
    <div class="block">
      <span class="demonstration"></span>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[3, 5, 7, 10]"
        :page-size="3"
        layout="total, sizes, prev, pager, next, jumper"
        :total="hotel_list.total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import SearchCity from "@/components/hotel/searchCity.vue";
import Hotelitem from "@/components/hotel/hotelitem.vue";
export default {
  data() {
    return {
      hotel_list: {},
      currentPage: 1,
      start: 0,
      limit: 3,
      //加载
      loading: false,
      //所有需要赛选的参数id
      parameter: {
        hotellevel: undefined,
        hoteltype: undefined,
        hotelbrand: undefined,
        hotelasset: undefined,
        scenic: undefined,
        price_in: undefined
      }
    };
  },
  components: {
    SearchCity,
    Hotelitem
  },
  mounted() {
    this.getlist();
  },
  //监听赛选id是否改动
  watch: {
    parameter: {
      deep: true,
      handler() {
        this.start = 0;
        this.getlist();
      }
    }
  },
  methods: {
    getlist() {
      this.loading = true;
      setTimeout(() => {
        var data = {};
        for (var key in this.parameter) {
          if (this.parameter[key]) {
            data[key] = this.parameter[key];
          }
        }
        this.$axios({
          url: `/hotels?_limit=${this.limit}&_start=${this.start * this.limit}`,
          method: "GET",
          params: data
        }).then(res => {
          this.hotel_list = res.data;
          this.loading = false;
        });
      }, 1000);
    },
    handleSizeChange(val) {
      this.limit = val;
      this.getlist();
    },
    handleCurrentChange(val) {
      this.start = val - 1;
      this.getlist();
    },
    //赛选后放回来的对象
    selectedHotle(obj) {
      Object.keys(obj).forEach(key => {
        this.parameter[key] = obj[key];
      });
    }
  }
};
</script>

<style scoped lang="less">
.main {
  width: 1000px;
  margin: 0 auto;
  .top_box {
    margin-top: 20px;
    margin-bottom: 10px;
    font-size: 13px;
    color: rgb(129, 125, 125);
  }
  .min_box {
    min-height: 150px;
  }
}
</style>