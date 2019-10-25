<template>
  <div class="mian">
    <script src="/monent.js"></script>
    <div class="userinfo" v-for="(item,index) in replyList.data" :key="index" :data="item">
      <div class="building_owner">
        <img class="user_img" :src="$axios.defaults.baseURL+item.account.defaultAvatar" />
        <span class="user_name">{{item.account.nickname}}</span>
        <span class="user_time">{{format(item.account.updated_at, "yyyy-MM-dd HH:mm:ss")}}</span>
        <div class="img_box">
          <img
            v-for="(item,index) in item.pics"
            :key="index"
            :src="$axios.defaults.baseURL+ item.url"
            alt
          />
        </div>
        <p>{{item.content}}</p>
        <p class="reply_some_box">
          <span class="reply_text" @click="handlereply(item)">回复</span>
        </p>
      </div>
      <MoreComment
        v-if="item.parent"
        :data="item.parent"
        :father="{'img':item.account.defaultAvatar,'name':item.account.nickname,'id':item.account.id}"
        @handlereply="handlereply"
      />
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
        :total="replyList.total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import MoreComment from "@/components/travelStrategy/moreComment.vue";
export default {
  components: {
    MoreComment
  },
  data() {
    return {
      //获取的评论数组
      replyList: [],
      currentPage: 1,
      start: 0,
      limit: 3
    };
  },
  mounted() {
    this.getlist();
  },
  methods: {
    getlist() {
      const id = this.$route.query.id;
      this.$axios({
        url: `/posts/comments?post=${id}&_limit=${this.limit}&_start=${this
          .start * this.limit}`
      }).then(res => {
        this.replyList = res.data;
      });
    },
    handleSizeChange(val) {
      this.limit = val;
      this.getlist();
    },
    handleCurrentChange(val) {
      this.start = val - 1;
      this.getlist();
    },
    handlereply(item) {
      this.$emit("addrevert", item);
    }
  }
};
</script>

<style scoped lang="less">
.img_box {
  margin: 10px 0;
  img {
    max-width: 20%;
  }
}
.block {
  margin: 20px 0;
}
img {
  max-width: 100%;
}
.clearfix:after {
  /*伪元素是行内元素 正常浏览器清除浮动方法*/
  content: "";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
.clearfix {
  *zoom: 1; /*ie6清除浮动的方式 *号只有IE6-IE7执行，其他浏览器不执行*/
}
.reply_some_box {
  display: flex;
  justify-content: flex-end;
}
.user_img {
  border-radius: 50px;
  width: 20px;
  vertical-align: sub;
}
span {
  font-size: 15px;
}
.user_name {
  color: #386bce;
}
.reply_text {
  cursor: pointer;
  color: #666666;
  &:hover {
    color: #ffa90d;
  }
}
.user_time {
  color: #ccc;
}
.main {
  margin: 20px 0;
  .userinfo {
    padding: 10px;
    .building_owner {
      margin: 10px 0;

      p {
        margin: 10px 0;
      }
    }
    .reply_box {
      margin-left: 20px;
      background: #f7f8fa;
      padding: 10px;
      .reply_conter_text {
        margin: 10px 0;
      }
    }
  }
}
</style>