<template>
  <el-form :model="form" ref="form" :rules="rules" class="form">
    <el-form-item class="form-item" prop="username">
      <el-input placeholder="用户名/手机" v-model="form.username"></el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="password">
      <el-input placeholder="密码" type="password" v-model="form.password"></el-input>
    </el-form-item>

    <p class="form-text">
      <nuxt-link to="#">忘记密码</nuxt-link>
    </p>

    <el-button class="submit" type="primary" @click="handleLoginSubmit">登录</el-button>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      // 表单数据
      form: {
        username: "",
        password: ""
      },
      // 表单规则
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入用户名", trigger: "blur" }]
      }
    };
  },
  mounted() {
  },
  methods: {
    // 提交登录
    handleLoginSubmit() {
      this.$refs.form.validate(async v => {
        if (!v) {
          this.$message.error("用户名或者密码不能为空");
          return;
        }
        // 因为如果访问后台 给的数据是错误的话，会抛出错误对象，所有用try cath这个接受，判断是否请求失败
        // try {
        //   var res = await this.$axios({
        //     url: "/accounts/login",
        //     method: "POST",
        //     data: this.form
        //   });
        //   this.$store.commit("user/setUserInfo", res.data);
        //   this.$message.success("登陆成功正在跳转页面...");
        // } catch {
        //   this.$message.error("用户名或者密码错误");
        // }

        this.$axios({
          url: "/accounts/login",
          method: "POST",
          data: this.form
        })
          .then(res => {
            this.$store.commit("user/setUserInfo", res.data);
            this.$message.success("登陆成功");
            this.$router.push("/air")
          })
          .catch(res => {
            this.$message.error(res.response.data.message);
          });
      });
    }
  }
};
</script>

<style scoped lang="less">
.form {
  padding: 25px;
}

.form-item {
  margin-bottom: 20px;
}

.form-text {
  font-size: 12px;
  color: #409eff;
  text-align: right;
  line-height: 1;
}

.submit {
  width: 100%;
  margin-top: 10px;
}
</style>