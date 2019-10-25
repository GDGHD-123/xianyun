<template>
  <div class="main">
    <el-row type="flex" :gutter="10">
      <el-col :span="18">
        <div class="box_left">
          <div class="top_text">
            <span>旅游攻略</span>
            <span>/</span>
            <span>攻略详情</span>
          </div>
          <div class="title_box">
            <h1>{{data.title}}</h1>
          </div>
          <div class="read_text">
            <span>攻略：{{data.city.created_at}}</span>
            <span>阅读 : {{ data.watch }}</span>
          </div>
          <div v-html="data.content" class="article_text"></div>
          <ul class="ul_operation_box">
            <li style="cursor: pointer;">
              <span class="iconfont icon-pinglun"></span>
              <span>评论({{comment.total}})</span>
            </li>
            <li style="cursor: pointer;">
              <span class="iconfont icon-lunkuodasan-"></span>
              <span>收藏</span>
            </li>
            <li style="cursor: pointer;">
              <span class="iconfont icon-fenxiang-1"></span>
              <span>分享</span>
            </li>
            <li @click="handlelike" style="cursor: pointer;">
              <span class="iconfont icon-dianzan"></span>
              <span>点赞({{data.like}})</span>
            </li>
          </ul>
          <div class="comment_box">
            <p>评论</p>
            <div class="textarea">
              <div class="revert_box" v-show="account.account.nickname">
                <span>回复@{{account.account.nickname}}</span>
                <span class="iconfont icon-shanchu" @click="cancelrevert"></span>
              </div>
              <el-input type="textarea" :rows="2" placeholder="说点什么吧..." v-model="textarea"></el-input>
            </div>
            <div class="from">
              <div class="add_img_box">
                <el-upload
                  :action="$axios.defaults.baseURL+'/upload'"
                  list-type="picture-card"
                  :auto-upload="true"
                  :on-success="handleuploading"
                  name="files"
                  :on-remove="handleRemonve"
                  :file-list="imgfileList"
                >
                  <i slot="default" class="el-icon-plus"></i>
                  <div slot="imgfileList" slot-scope="{imgfileList}">
                    <img class="el-upload-list__item-thumbnail" :src="imgfileList.url" alt />
                  </div>
                </el-upload>
              </div>
              <div class="button_from">
                <el-button type="primary" @click="handleBUtton">发布</el-button>
              </div>
            </div>
            <div class="pinglun">
              <Comment @addrevert="addrevert" />
            </div>
          </div>
        </div>
      </el-col>
      <el-col :offset="1" :span="6">
        <div class="box_rigth">
          <p class="strategy_box">相关攻略</p>
          <div
            class="strategy_img_box"
            v-for="(item,index) in strategy.data"
            :key="index"
            @click="$router.push(`/post/detail?id=${item.id}`)"
          >
            <div>
              <img v-if="item.images" :src="item.images[0]" alt />
            </div>
            <div class="contern">
              <p class="title_text">{{item.title}}</p>
              <p>
                <span>{{format(item.updated_at, "yyyy-MM-dd HH:mm:ss")}}</span>
                <span>{{item.watch}}</span>
              </p>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Comment from "@/components/travelStrategy/comment.vue";
export default {
  components: {
    Comment
  },
  data() {
    return {
      test: "",
      data: {
        city: {}
      },
      comment: {},
      textarea: "",
      imgfileList: [],
      disabled: false,
      //攻略数据
      strategy: [],
      //@的数据
      account: {
        account: {}
      }
    };
  },
  watch: {
    $route: {
      deep: true,
      handler() {
        this.getdata();
      }
    }
  },
  mounted() {
    this.getdata();
  },
  methods: {
    getdata() {
      const id = this.$route.query.id;
      this.$axios({
        url: `/posts?id=${id}`,
        method: "GET"
      }).then(res => {
        const { data } = res.data;
        this.data = data[0];
      });
      this.$axios({
        url: `/posts/comments?post=${id}`,
        method: "GET"
      }).then(res => {
        this.comment = res.data;
      });
      //获取相关攻略的接口
      this.$axios({
        url: `/posts/recommend?id=${id}`,
        method: "GET"
      }).then(res => {
        this.strategy = res.data;
      });
    },
    //添加图片触发的
    handleuploading(response, file, fileList) {
      this.imgfileList = fileList;
    },
    //发布评论
    //回复评论
    handleBUtton() {
      if (this.account.account.nickname) {
        this.Replytocomment();
        return;
      }
      this.Postacomment();
    },
    //发布评论
    async Postacomment() {
      var pics = [];
      this.imgfileList.forEach(item => {
        pics.push(item.response[0]);
      });
      var data = {
        post: this.$route.query.id,
        pics,
        content: this.textarea
      };
      const res = await this.$axios({
        url: "/comments",
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.$store.state.user.userInfo.token}`
        },
        data
      });
      if (res.status === 200) {
        this.$message.success(res.data.message);
        this.textarea = "";
        this.imgfileList = [];
      }
    },
    //回复评论
    async Replytocomment() {
      const id = this.account.id;
      var pics = [];
      this.imgfileList.forEach(item => {
        pics.push(item.response[0]);
      });
      var data = {
        post: 4,
        pics,
        content: this.textarea,
        follow: id
      };
      const res = await this.$axios({
        url: "/comments",
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.$store.state.user.userInfo.token}`,
        },
        data
      });
      if (res.status === 200) {
        this.$message.success(res.data.message);
        this.textarea = "";
        this.imgfileList = [];
        this.account = {
          account: {}
        };
      }
    },
    //删除图片触发的
    handleRemonve(file, fileList) {
      this.imgfileList = fileList;
    },
    //取消回复
    cancelrevert() {
      this.account = {
        account: {}
      };
    },
    //添加回复评论
    addrevert(account) {
      this.account = account;
      console.log(this.account.account.nickname);
    },
    //文章点赞
    handlelike() {
      this.$axios({
        url: `/posts/like?id=${this.$store.state.user.userInfo.user.id}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.$store.state.user.userInfo.token}`
        }
      })
        .then(res => {
          this.data.like += 1;
        })
        .catch(res => {
          this.$message.warning(res.response.data.message);
        });
    }
  }
};
</script>

<style scoped lang="less">
.revert_box {
  border: 1xp solid #ccc;
  border-radius: 5px;
  background: #f4f4f5;
  padding: 5px;
  color: #837e7e;
  width: 22%;
  margin: 5px 0;
  span {
    &:last-child {
      font-weight: 600;
      cursor: pointer;
      &:hover {
        color: #409eff;
      }
    }
  }
}
.main {
  width: 1000px;
  margin: 20px auto;
  .box_left {
    .comment_box {
      .textarea {
        margin: 12px 0;
        /deep/ textarea {
          margin: 5px 0;
          resize: none;
        }
      }
      .from {
        display: flex;
        justify-content: space-between;
      }
    }
    .top_text {
      span {
        &:first-child {
          transition: all 0.3s;
          cursor: pointer;
          font-weight: 600;
          &:hover {
            color: #409eff;
          }
        }
        &:nth-child(2) {
          color: #ccc;
          font-weight: 700;
        }
        &:nth-child(3) {
          color: rgb(168, 158, 158);
        }
      }
    }
    .article_text {
      /deep/ img {
        max-width: 100%;
      }
    }
    .title_box {
      padding: 15px 0;
      border-bottom: 1px solid #cccccc;
    }
    .read_text {
      display: flex;
      justify-content: flex-end;
      span {
        font-size: 18px;
        margin: 20px 10px;
        color: rgb(161, 156, 156);
      }
    }
    .ul_operation_box {
      margin: 30px 0;
      display: flex;
      justify-content: center;
      li {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 0 20px;
        span {
          display: block;
          &:first-child {
            color: #ffa90d;
            font-size: 35px;
          }
          &:last-child {
            color: rgb(161, 156, 156);
            font-size: 18px;
          }
        }
      }
    }
  }
}
.title_text {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 100%;
}
.strategy_box {
  padding: 10px 0;
  border-bottom: 1px solid #ccc;
}
.strategy_img_box {
  cursor: pointer;
  padding: 10px 0;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  div {
    &:first-child {
      width: 35%;
      margin-right: 5%;
      img {
        width: 100%;
      }
    }
    &:last-child {
      width: 65%;
      display: flex;
      flex-direction: column;
      justify-content: inherit;
      p {
        span {
          font-size: 14px;
          color: #837e7e;
        }
      }
    }
  }
}
</style>