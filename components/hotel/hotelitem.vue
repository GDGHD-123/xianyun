<template>
  <div class="hotle_img_box clearfix">
    <div class="img_box">
      <img :src="data.photos" alt @click="$router.push(`/hotel/hoteldetails?id=${data.id}`)"/>
    </div>
    <div class="hotle_text_box">
      <h4 @click="$router.push(`/hotel/hoteldetails?id=${data.id}`)">{{data.name}}</h4>
      <div class="hotle_text_box_a clearfix">
        <div class="left">
          <div class="xian_xi_text">
            <span>{{data.alias}}</span>
            <i
              v-if="data.hotellevel"
              class="iconfont icon-changyongtubiao-mianxing-"
              v-show="data.hotellevel.level>=1"
            ></i>
            <i
              v-if="data.hotellevel"
              class="iconfont icon-changyongtubiao-mianxing-"
              v-show="data.hotellevel.level>=2"
            ></i>
            <i
              v-if="data.hotellevel"
              class="iconfont icon-changyongtubiao-mianxing-"
              v-show="data.hotellevel.level>=3"
            ></i>
            <i
              v-if="data.hotellevel"
              class="iconfont icon-changyongtubiao-mianxing-"
              v-show="data.hotellevel.level>=4"
            ></i>
            <i
              v-if="data.hotellevel"
              class="iconfont icon-changyongtubiao-mianxing-"
              v-show="data.hotellevel.level>=5"
            ></i>
            <span>{{data.hoteltype.name}}</span>
          </div>
          <div class="ping_fen">
            <el-rate
              v-model="data.stars"
              disabled
              show-score
              text-color="#ff9900"
              score-template="{value}"
            ></el-rate>
            <p>
              <span>222</span>
              <span>评论</span>
            </p>
            <p>
              <span>222</span>
              <span>篇游记</span>
            </p>
          </div>
          <div class="ding_wei">
            <i class="iconfont icon-location"></i>
            <span>位于:{{data.address}}</span>
          </div>
        </div>
        <div class="right">
          <div class="hotle_jia_ge" v-for="(item,index) in data.products" :key="index">
            <div>
              <p>{{item.name}}</p>
            </div>
            <div>
              <p>
                <span>￥{{item.price}}</span>起
              </p>
              <i class="iconfont icon-changyongtubiao-xianxingdaochu-zhuanqu-"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: 3.5
    };
  },
  props: {
    data: {
      type: Object,
      default: {}
    },
  }
};
</script>

<style scoped lang="less">
h4{
  cursor: pointer;
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
.hotle_img_box {
  padding: 25px 0;
  border-bottom: 1px solid #eee;
  position: relative;
  .img_box {
    float: left;
    width: 33.33333%;
    img {
      display: block;
      width: 320px;
      height: 200px;
      -o-object-fit: cover;
      object-fit: cover;
      cursor: pointer;
    }
  }
  .hotle_text_box {
    .hotle_text_box_a {
      .left {
        float: left;
        width: 42%;
        .xian_xi_text {
          color: rgb(145, 142, 142);
          i {
            color: #ff9900;
          }
        }
        div {
          margin: 5px 0;
        }
        .ding_wei {
          color: rgb(145, 142, 142);
        }
        .ping_fen {
          width: 320px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          p {
            span {
              &:first-child {
                color: #ff9900;
              }
            }
          }
        }
      }
      .right {
        float: right;
        .hotle_jia_ge {
          transition: all 0.3s;
          cursor: pointer;
          width: 186px;
          border-bottom: 1px solid #eee;
          padding: 12px 0;
          display: flex;
          justify-content: space-between;
          div {
            color: rgb(131, 130, 130);
            display: flex;
            i {
              margin-top: 3px;
            }
            &:last-child {
              p {
                color: #ff9900;
              }
            }
          }
          &:hover {
            background: #f5f7fa;
          }
        }
      }
    }
  }
}
</style>