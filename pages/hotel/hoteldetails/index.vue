<template>
  <div class="main">
    <!-- <script
      type="text/javascript"
      src="https://webapi.amap.com/maps?v=1.4.15&key=5201586f697d302f2849a3297284913a"
    ></script>
    <script
      src="https://webapi.amap.com/maps?v=1.4.15&key=5201586f697d302f2849a3297284913a&plugin=AMap.PlaceSearch"
    ></script> -->

    <div class="jiu_dian_name">
      <h4>{{data.name}}</h4>
      <i
        v-if="data.hotellevel"
        v-show="data.hotellevel.level>=1"
        class="iconfont icon-changyongtubiao-mianxing-"
      ></i>
      <i
        v-if="data.hotellevel"
        v-show="data.hotellevel.level>=2"
        class="iconfont icon-changyongtubiao-mianxing-"
      ></i>
      <i
        v-if="data.hotellevel"
        v-show="data.hotellevel.level>=3"
        class="iconfont icon-changyongtubiao-mianxing-"
      ></i>
      <i
        v-if="data.hotellevel"
        v-show="data.hotellevel.level>=4"
        class="iconfont icon-changyongtubiao-mianxing-"
      ></i>
      <i
        v-if="data.hotellevel"
        v-show="data.hotellevel.level>=5"
        class="iconfont icon-changyongtubiao-mianxing-"
      ></i>
    </div>
    <div class="jiu_dian_guan_gao">
      <p>{{data.alias}}</p>
      <i class="iconfont icon-location"></i>
      <span>{{data.address}}</span>
    </div>
    <div class="jiu_dian_img">
      <div class="left_img">
        <img src="/img/hotel-pics/1.jpeg" />
      </div>
      <div class="right_img">
        <img src="/img/hotel-pics/1.jpeg" alt />
        <img src="/img/hotel-pics/2.jpeg" alt />
        <img src="/img/hotel-pics/3.jpeg" alt />
        <img src="/img/hotel-pics/4.jpeg" alt />
        <img src="/img/hotel-pics/5.jpeg" alt />
        <img src="/img/hotel-pics/6.jpeg" alt />
      </div>
    </div>
    <div class="jiu_dian_fang">
      <div class="jia_ge_title">
        <p>价格来源</p>
        <p>低价房型</p>
        <p>最低价格/每晚</p>
      </div>
      <div class="jia_ge_ming" v-for="(item,index) in data.products" :key="index">
        <p>{{item.name}}</p>
        <p>{{item.bestType}}</p>
        <p>
          <span class="yellow">￥{{item.price}}</span>起
          <i class="iconfont icon-changyongtubiao-xianxingdaochu-zhuanqu-"></i>
        </p>
      </div>
    </div>
    <div class="map_big_box" v-loading="loading">
      <div id="container" class="map_box" v-show="activeIndex=='1'"></div>
      <div id="containerb" class="map_box" v-show="activeIndex=='2'"></div>
      <div class="map_list">
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
        >
          <el-menu-item index="1">风景</el-menu-item>
          <el-menu-item index="2">交通</el-menu-item>
        </el-menu>
        <div class="infinite-list-wrapper" style="overflow:auto" v-show="activeIndex==1">
          <ul class="list">
            <li
              v-for="(item,index) in map_listA"
              :key="index"
              class="list-item"
              @mouseenter="handlemove(item)"
            >
              <p>{{item.name}}</p>
              <p>距离{{item.distance}}米</p>
            </li>
          </ul>
        </div>
        <div class="infinite-list-wrapper" style="overflow:auto" v-show="activeIndex==2">
          <ul class="list">
            <li
              v-for="(item,index) in map_listB"
              :key="index"
              class="list-item"
              @mouseenter="handlemoveB(item)"
            >
              <p>{{item.name}}</p>
              <p>距离{{item.distance}}公里</p>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="ji_ben_xin_xi">
      <div class="ji_ben_xin_xi_A">
        <p>基本信息</p>
        <p>{{data.creation_time}}/{{data.renovat_time}}</p>
        <p>酒店规模:{{data.roomCount}}间客房</p>
      </div>
      <div class="ji_ben_xin_xi_B">
        <p>主要设施</p>
        <p v-for="(item,index) in data.hotelassets" :key="index">{{item.name}}</p>
      </div>
      <div>
        <p>提车服务</p>
      </div>
      <div>
        <p>品牌信息</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: {},
      //娱乐
      //获取当前poi的数据
      map_listA: [],
      //map实例对象
      map_dingweiA: {},
      //判断是否存在text
      text: [],
      //交通地图
      map_listB: [],
      //map实例对象
      map_dingweiB: {},
      //判断是否存在text
      textB: [],

      count: 100,
      loading: false,
      activeIndex: "1"
    };
  },
  mounted() {
    this.loading = true;
    this.$axios({
      url: `/hotels?id=${this.$route.query.id}`,
      method: "GET"
    }).then(res => {
      this.data = res.data.data[0];
      setTimeout(() => {
        this.getmapA();
        this.getmapB();
      }, 200);
    });
  },

  methods: {
    handlemove(item) {
      this.map_dingweiA.setCenter([item.location.Q, item.location.P]);
      setTimeout(() => {
        var text = new AMap.Text({
          map: this.map_dingweiA,
          text: item.name,
          anchor: "top-center",
          offset: new AMap.Pixel(0, -35)
        });
        if (this.text.length === 0) {
          this.text.push(text);
        } else {
          this.map_dingweiA.remove(this.text[0]);
          this.text.splice(0, 1);
          this.text.push(text);
        }
      }, 500);
    },
    handlemoveB(item) {
      this.map_dingweiB.setCenter([
        +item.location.split(",")[0],
        +item.location.split(",")[1]
      ]);
      setTimeout(() => {
        var text = new AMap.Text({
          map: this.map_dingweiB,
          text: item.name,
          anchor: "top-center",
          offset: new AMap.Pixel(0, -35)
        });
        if (this.textB.length === 0) {
          this.textB.push(text);
        } else {
          this.map_dingweiB.remove(this.textB[0]);
          this.textB.splice(0, 1);
          this.textB.push(text);
        }
      }, 500);
    },
    handleSelect(i) {
      this.activeIndex = i;
    },
    getmapA() {
      var map = new AMap.Map("container", {
        zoom: 15, //级别
        center: [this.data.location.longitude, this.data.location.latitude] //中心点坐标
      });
      this.map_dingweiA = map;
      var center = [this.data.location.longitude, this.data.location.latitude];
      var city = this.data.real_city;
      AMap.service("AMap.PlaceSearch", () => {
        //回调函数
        //实例化PlaceSearch
        var placeSearch = new AMap.PlaceSearch({
          pageSize: 10,
          pageIndex: 1,
          city: city, //城市
          map: map,
          panel: "result"
        });
        placeSearch.searchNearBy("娱乐", center, 1000, (status, result) => {
          this.map_listA = result.poiList.pois;
          result.poiList.pois.forEach(item => {
            var abcd = new AMap.Marker({
              map: map,
              position: [item.location.Q, item.location.P],
              offset: new AMap.Pixel(-13, -15),
              title: item.address
            });
            abcd.on("mouseover", function(params) {
              map.setCenter([item.location.Q, item.location.P]);
              abcd.setTitle(item.address);
            });
          });
        });
      });
      setTimeout(() => {
        this.loading = false;
      }, 2200);
      map.setFitView();
    },
    getmapB() {
      var center = [118.789841, 32.020905];
      var map = new AMap.Map("containerb", {
        zoom: 12, //级别
        center: center //中心点坐标
      });
      this.map_dingweiB = map;
      var city = this.data.real_city;
      this.$axios({
        url: "https://restapi.amap.com/v3/place/text? ",
        method: "GET",
        params: {
          key: "d9076853818f333b930c9f93b47d5251",
          types: "风景名胜",
          city: "南京",
          page: "1",
          offset: "20"
        }
      }).then(res => {
        res.data.pois.forEach(i => {
          var arr = [+i.location.split(",")[0], +i.location.split(",")[1]];
          i.distance = parseInt(AMap.GeometryUtil.distance(center, arr)) / 1000;
          var abcd = new AMap.Marker({
            map: map,
            position: arr,
            offset: new AMap.Pixel(-13, -15),
            title: i.name
          });
          abcd.on("mouseover", function(params) {
            map.setCenter(arr);
            abcd.setTitle(i.address);
          });
        });
        this.map_listB = res.data.pois;
      });
      map.setFitView();
    }
  }
};
</script>

<style scoped lang="less">
.icon-changyongtubiao-mianxing-,
.icon-changyongtubiao-xianxingdaochu-zhuanqu-,
.yellow {
  color: #ff9900 !important;
}
.clearfix:after,
.clearfix:before {
  content: "";
  display: table;
}
.clearfix:after {
  clear: both;
}
.clearfix {
  *zoom: 1;
}
.main {
  width: 1000px;
  margin: 0 auto;
  .jiu_dian_name {
    margin-top: 20px;
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    h4 {
      font-size: 25px;
    }
  }
  .jiu_dian_guan_gao {
    font-size: 15px;
    color: #666666;
  }
  .jiu_dian_img {
    display: flex;
    justify-content: space-between;
    padding: 30px 0;
    .left_img {
      img {
        width: 619px;
        height: 388px;
        -o-object-fit: cover;
        object-fit: cover;
      }
    }
    .right_img {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-evenly;
      img {
        &:nth-child(n + 3) {
          margin-top: 19px;
        }
        width: 162px;
        height: 115px;
        -o-object-fit: cover;
        object-fit: cover;
      }
    }
  }
  .jiu_dian_fang {
    margin: 20px 0;
    .jia_ge_title {
      display: flex;
      font-size: 18px;
      padding: 10px 5px;
      color: #707070;
      justify-content: space-between;
    }
    .jia_ge_ming {
      display: flex;
      padding: 10px 5px;
      font-size: 18px;
      color: #707070;
      cursor: pointer;
      &:hover {
        background: #dce3ee;
      }
      p {
        &:first-child {
          width: 44%;
        }
        &:nth-child(2) {
          width: 45%;
        }
        &:nth-child(3) {
          width: 10%;
        }
      }
    }
  }

  .map_big_box {
    margin: 20px 0;
    display: flex;
    justify-content: space-between;
    .map_box {
      height: 400px;
      width: 60%;
    }
    .map_list {
      width: 35%;
      div {
        height: 339px;
        li {
          display: flex;
          justify-content: space-between;
          padding: 10px 5px;
          p {
            font-size: 15px;
            color: #707070;
          }
          &:hover {
            background: #cef0f1;
          }
        }
      }
    }
  }
  .ji_ben_xin_xi {
    margin: 20px 0;
    div {
      padding: 20px 8px;
      display: flex;
      border-bottom: 1px solid #eeeeee;
      p {
        &:first-child {
          width: 17%;
        }
      }
    }
    .ji_ben_xin_xi_A {
      p {
        &:nth-child(n + 2) {
          margin: 0 10px;
        }
      }
    }
    .ji_ben_xin_xi_B {
      p {
        &:nth-child(n + 2) {
          padding: 5px;
          background: #eeeeee;
          margin: 0 10px;
        }
      }
    }
  }
}
</style>