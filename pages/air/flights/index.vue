<template>
  <section class="contianer">
    <el-row type="flex" justify="space-between">
      <!-- 顶部过滤列表 -->
      <div class="flights-content">
        <!-- 过滤条件 -->
        <FlightsFilters :data="cacheFlightsData" @setDataList="setDataList" />

        <!-- 航班头部布局 -->
        <FlightsListHead />

        <!-- 航班信息 -->
        <FlightsItem v-for="(item, index) in dataList" :key="index" :item="item" />
        <div
          v-if="flightsData.flights.length === 0 && !loading"
          style="padding: 50px; text-align:center"
        >该航班暂无数据</div>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageIndex"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="flightsData.total"
        ></el-pagination>
        <!-- loading等于false表示加载完毕之后才显示 -->
      </div>

      <!-- 侧边栏 -->
      <div class="aside">
        <!-- 侧边栏组件 -->
      </div>
    </el-row>
  </section>
</template>

<script>
import FlightsFilters from "@/components/air/flightsFilters";
import FlightsListHead from "@/components/air/flightsListHead";
import FlightsItem from "@/components/air/flightsItem";
export default {
  data() {
    return {
      // 请求机票列表返回的总数据，包含了flights,info, options,total
      flightsData: {
        flights: [],
        info: {},
        options: {}
      },
      // 声明多一分总数据，`该总数据一旦赋值之后不会再被修改`，也就是第一次赋值完后的值等于
      cacheFlightsData: {
        flights: [],
        info: {},
        options: {}
      },
      // 当前的页数
      pageIndex: 1,
      // 当前的条数
      pageSize: 5,
      // 判断是否正在加载
      loading: true
    };
  },
  components: {
    FlightsListHead,
    FlightsItem,
    FlightsFilters
  },
  computed: {
    // 从flights总列表数据中切割出来数组列表
    dataList() {
      // 从flights总列表数据中切割出来数组列表
      return this.flightsData.flights.slice(
        (this.pageIndex - 1) * this.pageSize,
        this.pageIndex * this.pageSize
      );
    }
  },
  mounted() {
    console.log(this.$store.dispatch)
    // 请求机票列表数据
    this.$axios({
      url: "/airs",
      // params是axios的get的参数
      params: this.$route.query
    }).then(res => {
      // 保存到机票的总数据
      this.flightsData = res.data;
      this.cacheFlightsData = { ...res.data };
      // 请求完毕
      this.loading = false;
    });
  },
  methods: {
    // 分页条数切换时候触发, val是当前的条数
    handleSizeChange(val) {
      this.pageSize = val;
    },
    // 页数切换时候触发, val是当前的页数
    handleCurrentChange(val) {
      // 修改当前的页数
      this.pageIndex = val;
    },
    setDataList(data) {
      var arr = [];
      var num = 0;
      var obj = {
        airSize: "plane_size",
        airport: "org_airport_name",
        company: "airline_name"
      };
      if (!data) {
        this.flightsData.flights = this.cacheFlightsData.flights;
        return;
      }
      data.forEach(v => {
        var key = Object.entries(v)[0];
        if (arr.length === 0 && num === 0) {
          if (key[0] !== "flightTimes") {
            arr = this.getListA(this.cacheFlightsData.flights, obj, key);
          } else {
            arr = this.getListB(this.cacheFlightsData.flights, obj, key);
          }
          num++;
        } else {
          if (key[0] !== "flightTimes") {
            arr = this.getListA(arr, obj, key);
          } else {
            arr = arr = this.getListB(arr, obj, key);
          }
        }
        this.flightsData.flights = arr;
        this.flightsData.total=arr.length
      });
    },
    //优化过多重复代码封装
    getListA(dataArr, obj, key) {
      const arr = dataArr.filter(item => {
        return item[obj[key[0]]] === key[1];
      });
      return arr;
    },
    getListB(dataArr, obj, key) {
      const timeArr = key[1].split(","); // [6, 12]
      const arr = dataArr.filter(v => {
        // 出发时间的小时
        const start = +v.dep_time.split(":")[0];
        // 比较航班出发时间是否在选中的时间段内
        return start >= +timeArr[0] && start < +timeArr[1];
      });
      return arr;
    }
  }
};
</script>

<style scoped lang="less">
.contianer {
  width: 1000px;
  margin: 20px auto;
}
.flights-content {
  width: 745px;
  font-size: 14px;
}
.aside {
  width: 240px;
}
</style> 