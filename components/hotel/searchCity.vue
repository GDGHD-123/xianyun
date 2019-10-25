<template>
  <div class="seach_big_bix">
    <el-form class="search-form-content" ref="form" label-width="80px">
      <el-autocomplete
        style=" margin-right: 10px;"
        :fetch-suggestions="queryDepartSearch"
        placeholder="搜索城市"
        @select="(item)=>handleSelect(item,'depart')"
        class="el-autocomplete"
        v-model="form.departCity"
        @blur="handleDepartBlur('depart')"
      ></el-autocomplete>
      <el-date-picker
        v-model="value3"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
      <div class="personnel_big_box">
        <el-button class="personnel_box" style="width:240px;" @click="seachpeople=!seachpeople">
          <span>人数未定</span>
          <span class="iconfont icon-fl-renyuan"></span>
        </el-button>
        <transition name="el-fade-in">
          <div class="room_big_box" v-show="seachpeople">
            <span>每间房</span>
            <el-select v-model="value4" placeholder="请选择" class="seach_people">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-select v-model="value5" placeholder="请选择" class="seach_people">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </transition>
        <el-button type="primary" class="monent_text">查看价格</el-button>
      </div>
    </el-form>
    <div class="map_big_box">
      <div class="map_left_box">
        <div class="city_box">
          <div class="quyu">区域:</div>
          <div class="city_conter">
            <div
              class="city_text_name"
              v-for="(item,index) in hotels_options"
              :key="index"
              @click="abcd(item.id,item.city)"
            >{{item.name}}</div>
          </div>
        </div>
        <div class="city_box">
          <div class="quyu">攻略:</div>
          <div
            class="city_conter"
          >北京，你想要的都能在这找到。博古通今，兼容并蓄，天下一城，如是帝都。 景点以故宫为中心向四处辐射；地铁便宜通畅，而且覆盖绝大多数景点。 由于早上有天安门升旗仪式，所以大多数人选择在天安门附近住宿。</div>
        </div>
        <div class="city_box">
          <div class="quyu">均价:</div>
          <div class="city_conter">
            <div>
              <i class="iconfont icon-changyongtubiao-mianxing-"></i>
              <i class="iconfont icon-changyongtubiao-mianxing-"></i>
              <i class="iconfont icon-changyongtubiao-mianxing-"></i>
              <span>￥332</span>
            </div>
            <div>
              <i class="iconfont icon-changyongtubiao-mianxing-"></i>
              <i class="iconfont icon-changyongtubiao-mianxing-"></i>
              <i class="iconfont icon-changyongtubiao-mianxing-"></i>
              <span>￥332</span>
            </div>
            <div>
              <i class="iconfont icon-changyongtubiao-mianxing-"></i>
              <i class="iconfont icon-changyongtubiao-mianxing-"></i>
              <i class="iconfont icon-changyongtubiao-mianxing-"></i>
              <span>￥332</span>
            </div>
          </div>
        </div>
      </div>
      <div id="container" class="map_right_box" v-loading="loading"></div>
    </div>
    <div class="choose_big_box">
      <div class="block_big_progress">
        <div class="price_text">
          <span>价格</span>
          <span>{{value6}}</span>
        </div>
        <div class="block">
          <el-slider v-model="value6" @change="select_jiage" :max="500"></el-slider>
        </div>
      </div>
      <div class="block_big_progress">
        <div class="price_text">
          <span>住宿等级</span>
        </div>
        <el-dropdown class="choose_box_text" @command="(res)=>{handleCommand(res,'hotellevel')}">
          <div>
            <span>{{hotels_search.hotellevel.name}}</span>
            <span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
          </div>
          <el-dropdown-menu slot="dropdown" style="width: 10%;">
            <el-dropdown-item
              v-for="(item,index) in hotels_optionsP.levels"
              :command="item"
              :key="index"
              icon="el-icon-circle-check"
            >{{item.name}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="block_big_progress">
        <div class="price_text">
          <span>住宿类型</span>
        </div>
        <el-dropdown class="choose_box_text" @command="(res)=>{handleCommand(res,'hoteltype')}">
          <div>
            <span>{{hotels_search.hoteltype.name}}</span>
            <span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
          </div>
          <el-dropdown-menu slot="dropdown" style="width: 10%;">
            <el-dropdown-item
              v-for="(item,index) in hotels_optionsP.brands"
              v-show="index<5"
              :command="item"
              :key="index"
              icon="el-icon-circle-check"
            >{{item.name}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="block_big_progress">
        <div class="price_text">
          <span>酒店设施</span>
        </div>
        <el-dropdown class="choose_box_text" @command="(res)=>{handleCommand(res,'hotelasset')}">
          <div>
            <span>{{hotels_search.hotelasset.name}}</span>
            <span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
          </div>
          <el-dropdown-menu slot="dropdown" style="width: 10%;">
            <el-dropdown-item
              v-for="(item,index) in hotels_optionsP.assets"
              :command="item"
              :key="index"
              icon="el-icon-circle-check"
            >{{item.name}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="block_big_progress">
        <div class="price_text">
          <span>酒店品牌</span>
        </div>
        <el-dropdown class="choose_box_text" @command="(res)=>{handleCommand(res,'hotelbrand')}">
          <div>
            <span>{{hotels_search.hotelbrand.name}}</span>
            <span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
          </div>
          <el-dropdown-menu slot="dropdown" style="width: 10%;">
            <el-dropdown-item
              v-for="(item,index) in hotels_optionsP.types"
              :command="item"
              :key="index"
              icon="el-icon-circle-check"
            >{{item.name}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    hotel_list: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      form: {
        departCity: "" // 出发城市
      },
      // 存放newData的城市的数组
      cities: [{ value: "", sort: "" }],
      options: [
        {
          value: "选项1",
          label: "0成人"
        },
        {
          value: "选项2",
          label: "2成人"
        },
        {
          value: "选项3",
          label: "3成人"
        },
        {
          value: "选项4",
          label: "4成人"
        },
        {
          value: "选项5",
          label: "5成人"
        }
      ],
      value3: "",
      value4: "",
      value5: "",
      value6: 0,
      //酒店赛选的数据绑定
      hotels_search: {
        hotellevel: {
          name: "不限"
        },
        hoteltype: {
          name: "不限"
        },
        hotelasset: {
          name: "不限"
        },
        hotelbrand: {
          name: "不限"
        }
      },
      hotels_searchID: {
        hotellevel: undefined,
        hoteltype: undefined,
        hotelasset: undefined,
        hotelbrand: undefined
      },

      //获取循环酒店筛选的数据
      hotels_optionsP: [],
      //选着人数框
      seachpeople: false,
      //酒店选项数据
      hotels_options: []
    };
  },
  watch: {
    hotel_list: {
      deep: true,
      handler() {
        if (!this.hotel_list.data[0] && AMap.Map) {
          return;
        }
        var map = new AMap.Map("container", {
          center: [
            this.hotel_list.data[0].location.longitude,
            this.hotel_list.data[0].location.latitude
          ] //中心点坐标
        });
        this.hotel_list.data.forEach(item => {
          var abcd = new AMap.Marker({
            map: map,
            position: [item.location.longitude, item.location.latitude],
            offset: new AMap.Pixel(-13, -15),
            title: item.name
          });
          abcd.on("mouseover", function(params) {
            map.setCenter([params.lnglat.Q, params.lnglat.P]);
            abcd.setTitle(item.name);
          });
        });
        map.setFitView();
      }
    }
  },
  mounted() {
    this.$axios({
      url: "/cities?name=南京",
      method: "GET"
    }).then(res => {
      this.hotels_options = res.data.data[0].scenics;
    });

    this.$axios({
      url: "/hotels/options",
      method: "GET"
    }).then(res => {
      this.hotels_optionsP = res.data.data;
    });
  },
  methods: {
    //赛选中酒店筛选的数据触发的方法
    handleCommand(value, types) {
      this.hotels_search[types].name = value.name;
      this.hotels_searchID[types] = value.id;
      var obj = {};
      for (var ken in this.hotels_searchID) {
        if (this.hotels_searchID[ken]) {
          obj[ken] = this.hotels_searchID[ken];
        }
      }
      this.$emit("selectedHotle", obj);
    },
    // value 是选中的值，cb是回调函数，接收要展示的列表
    queryDepartSearch(value, cb) {
      if (!value) {
        this.cities = [{ value: "", sort: "" }];
        cb([]);
        return;
      }
      this.$axios({
        url: "/airs/city?name=" + value
      }).then(res => {
        // data是后台返回的城市数组,没有value属性
        const { data } = res.data;
        // 循环给每一项添加value属性
        const newData = data.map(v => {
          v.value = v.name.replace("市", ""); // 乌鲁市齐市
          return v;
        });
        this.cities = newData;
        // 展示到下拉列表
        cb(newData);
      });
    },
    // 目标城市输入框获得焦点时触发
    // value 是选中的值，cb是回调函数，接收要展示的列表
    queryDestSearch(value, cb) {
      this.queryDepartSearch(value, cb);
    },
    // 选中城市下拉选择时触发
    handleSelect(item, type) {
      this.form[type + "City"] = item.value;
      this.form[type + "Code"] = item.sort;
    },
    handleDepartBlur(type) {
      if (this.cities.length === 0) return;
      this.form[type + "City"] = this.cities[0].value;
      this.form[type + "Code"] = this.cities[0].sort;
    },
    //选着攻略地区后执行的方法
    abcd(id, city) {
      var obj = {
        scenic: id
      };
      this.$emit("selectedHotle", obj);
    },
    select_jiage(id) {
      var obj = {
        price_in: id
      };
      this.$emit("selectedHotle", obj);
    }
  }
};
</script>

<style scoped lang="less">
.city_text_name {
  cursor: pointer;
  border-bottom: 1px solid white;
  &:hover {
    color: rgb(40, 177, 219);
    border-bottom: 1px solid rgb(40, 177, 219);
  }
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
.personnel_big_box {
  display: inline-block;
  .room_big_box {
    background: white;
    padding: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    border-radius: 10px;
    margin-top: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    span {
      margin-right: 50px;
    }
    .seach_people {
      width: 120px;
      margin: 0 5px;
    }
  }
  .monent_text {
    margin-left: 10px;
  }
}
.map_big_box {
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
  .map_left_box {
    display: inline-block;
    width: 50%;
    .city_box {
      margin-bottom: 10px;
      display: flex;
      color: rgb(119, 119, 119);
      .quyu {
        width: 11%;
      }
      .city_conter {
        font-size: 15px;
        width: 90%;
        div {
          display: inline-block;
          margin: 0 5px;
        }
        i {
          color: #ff9900;
        }
        span {
          font-size: 15px;
          color: rgb(99, 93, 93);
        }
      }
    }
  }
  .map_right_box {
    height: 380px;
    display: inline-block;
    width: 40%;
  }
}
.choose_big_box {
  border: 1px solid #ccc;
  padding: 10px 0;
  display: flex;
  .block_big_progress {
    padding: 0 20px;
    width: 16%;
    .price_text {
      display: flex;
      justify-content: space-between;
    }
    &:nth-child(n + 2) {
      border-left: 1px solid #ccc;
    }
  }
  /deep/.choose_box_text {
    display: flex;
    justify-content: space-between;
    div {
      margin: 10px 0;
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>