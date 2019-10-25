<template>
  <div class="main">
    <el-row type="flex" :gutter="10" class="main_big_box">
      <el-col :span="19">
        <div class="left_big_box">
          <h4>发表新攻略</h4>
          <p class="Atext">分享你的个人游记，让更多人看到哦!</p>
          <el-input class="input" v-model="input" placeholder="请输入标题"></el-input>
          <VueEditor ref="vueEditor" class="vueEditor" :config="config" />
          <div>
            <el-form class="search-form-content" ref="form" label-width="80px">
              <el-form-item label="选中城市">
                <!-- fetch-suggestions 返回输入建议的方法 -->
                <!-- select 点击选中建议项时触发 -->
                <el-autocomplete
                  :fetch-suggestions="queryDepartSearch"
                  placeholder="请选择游玩的城市"
                  @select="(item)=>handleSelect(item,'depart')"
                  class="el-autocomplete"
                  v-model="form.departCity"
                  @blur="handleDepartBlur('depart')"
                ></el-autocomplete>
              </el-form-item>
            </el-form>
          </div>
          <div class="bottom_box">
            <el-button type="primary" @click="handelissue">发布</el-button>
            <span>或者</span>
            <span @click="handledrafts">保存到草稿</span>
          </div>
        </div>
      </el-col>
      <el-col :offset="1" :span="5">
        <div class="rigth_big_box">
          <div class="drafts_box">
            <span>草稿箱({{drafts.length||0}})</span>
            <div class="drafts_text_box" v-for="(item,index) in drafts" :key="index">
              <i class="el-icon-edit" @click="handlewrite(item)"></i>
              <span>{{item.title}}</span>
              <i class="el-icon-delete" @click="handleCleanwrite(item.id)"></i>
              <p>{{item.time}}</p>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import VueEditor from "vue-word-editor";
import "quill/dist/quill.snow.css";
import monent from "moment";
let VueEditor;
if (process.browser) {
  VueEditor = require("vue-word-editor").default;
}
export default {
  data() {
    return {
      input: "",
      draftID: undefined,
      drafts: [],
      config: {
        // 上传图片的配置
        uploadImage: {
          url: "http://127.0.0.1:1337/upload",
          name: "files",
          // res是结果，insert方法会把内容注入到编辑器中，res.data.url是资源地址
          uploadSuccess(res, insert) {
            insert("http://127.0.0.1:1337" + res.data[0].url);
          }
        }
      },
      form: {
        departCity: "" // 出发城市
      },
      // 存放newData的城市的数组
      cities: [{ value: "", sort: "" }]
    };
  },
  components: {
    VueEditor
  },

  mounted() {
    setTimeout(() => {
      this.drafts = this.$store.state.air.drafts;
    }, 100);
  },
  methods: {
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
    handleSelect(item, type) {
      this.form[type + "City"] = item.value;
      this.form[type + "Code"] = item.sort;
    },
    handleDepartBlur(type) {
      if (this.cities.length === 0) return;
      this.form[type + "City"] = this.cities[0].value;
      this.form[type + "Code"] = this.cities[0].sort;
    },
    //保存到草稿箱
    handledrafts() {
      if (this.draftID) {
        this.handledraftsID(this.draftID);
        return;
      }
      var id = undefined;
      if (this.$store.state.air.drafts.length === 0) {
        id = 1;
      } else {
        id = this.$store.state.air.drafts[0].id + 1;
      }
      var obj = {
        title: this.input,
        content: this.$refs.vueEditor.editor.root.innerHTML,
        id,
        time: monent().format("YYYY-MM-DD")
      };
      this.$store.commit("air/setdrafts", obj);
      this.$refs.vueEditor.editor.root.innerHTML = "";
      this.input = "";
    },
    // 判断是否是编写的
    handledraftsID(id) {
      var num = undefined;
      this.drafts.some((item, index) => {
        if (item.id === id) {
          num = index;
          return true;
        }
      });
      var obj = {
        title: this.input,
        content: this.$refs.vueEditor.editor.root.innerHTML,
        id,
        time: monent().format("YYYY-MM-DD")
      };
      this.$store.commit("air/compiledrafts", { index: num, data: obj });
      this.$refs.vueEditor.editor.root.innerHTML = "";
      this.input = "";
      this.form.departCity = "";
      this.draftID = undefined;
    },
    // 点击编写的时候
    handlewrite(item) {
      this.draftID = item.id;
      this.$refs.vueEditor.editor.root.innerHTML = item.content;
      this.input = item.title;
    },
    // 删除草稿箱某一项
    handleCleanwrite(id) {
      var num = undefined;
      this.drafts.some((item, index) => {
        if (item.id === id) {
          num = index;
          return true;
        }
      });
      this.$store.commit("air/cleandrafts", num);
    },
    // 发布
    async handelissue() {
      if (!this.form.departCity) {
        this.$message.warning("请输入城市");
        return;
      }
      if (!this.$store.state.user.userInfo.token) {
        this.$message.warning("请先登陆");
        return;
      }
      const res = await this.$axios({
        url: "/posts",
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.$store.state.user.userInfo.token}`
        },
        data: {
          content: this.$refs.vueEditor.editor.root.innerHTML,
          title: this.input,
          city: this.form.departCity
        }
      });
      if (res.status === 200) {
        this.$message.success(res.data.message);
        this.$refs.vueEditor.editor.root.innerHTML = "";
        this.input = "";
        this.form.departCity = "";
        this.draftID = undefined;
      }
    }
  }
};
</script>

<style scoped lang="less">
.drafts_text_box {
  margin: 5px 0;
  span {
    display: inline-block;
    width: 70%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 15px;
    color: black !important;
  }
  i {
    &:hover {
      color: #ffa500;
    }
  }
  p {
    color: rgb(112, 108, 108);
    font-size: 16px;
  }
}
.bottom_box {
  margin-bottom: 20px;
  span {
    &:last-child {
      cursor: pointer;
      color: #ffa500;
    }
  }
}
/deep/ .vueEditor {
  height: 200px;
  margin-bottom: 50px;
}
.main {
  width: 1000px;
  margin: 0 auto;
  .main_big_box {
    margin-top: 20px;
    .left_big_box {
      h4 {
        font-size: 20px;
      }
      .Atext {
        margin: 10px 0;
        color: rgb(146, 143, 143);
        font-size: 16px;
      }
      .input {
        margin-bottom: 15px;
      }
    }
  }
  .rigth_big_box {
    .drafts_box {
      border: 1px solid #ccc;
      padding: 10px;
      span {
        color: rgb(156, 155, 155);
      }
    }
  }
}
</style>