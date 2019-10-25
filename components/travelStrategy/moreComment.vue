<template>
  <div class>
    <!-- <div class="clearfix">
      <img
        class="user_img"
        src="http://img2.imgtn.bdimg.com/it/u=320178652,790985626&fm=26&gp=0.jpg"
        alt
      />
      <span class="user_name">用户名字</span>
      <p class="reply_conter_text">回复的评论</p>
      <img src alt />
      <p class="reply_some_box">
        <span class="user_time">回复的时间</span>
        <span class="reply_text">回复</span>
      </p>
    </div>-->
    <div class="clearfix reply_box">
      <img class="user_img" :src="$axios.defaults.baseURL+data.account.defaultAvatar" alt />
      <span class="user_name">{{data.account.nickname}}</span>:
      <span>回复</span>
      <img class="user_img" :src="$axios.defaults.baseURL+father.img" alt />
      <span class="user_name">{{father.name}}</span>:
      <div class="img_box">
        <img
          v-for="(item,index) in data.pics"
          :key="index"
          :src="$axios.defaults.baseURL+ item.url"
          alt
        />
      </div>
      <p class="reply_conter_text">{{data.content}}</p>
      <img src alt />
      <p class="reply_some_box">
        <span class="user_time">{{format(data.account.updated_at, "yyyy-MM-dd HH:mm:ss")}}</span>
        <span class="reply_text" style="cursor: pointer;" @click="hadlehuifu(data)">回复</span>
      </p>
    </div>

    <comment
      v-if="data.parent"
      :data="data.parent"
      :father="{'img':data.account.defaultAvatar,'name':data.account.nickname,'id':data.account.id}"
    />
  </div>
</template>



<script>
export default {
  name: "comment",
  props: {
    data: {
      type: Object,
      default: {}
    },
    father: {
      type: Object,
      default: {}
    }
  },
  methods: {
    hadlehuifu(data) {
      this.$emit("handlereply", data);
    }
  }
};
</script>

<style scoped lang="less" >
.img_box {
  margin: 10px 0;
  img {
    max-width: 20%;
  }
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
  float: right;
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
  color: #666666;
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
      margin: 10px 0;
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