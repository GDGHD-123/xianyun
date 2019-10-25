<template>
  <div class="main">
    <div class="air-column">
      <h2>剩机人</h2>
      <el-form class="member-info">
        <!-- 用户列表可以循环该div -->
        <div class="member-info-item" v-for="(item, index) in users" :key="index">
          <!-- 乘机人列表，select默认值就行 -->
          <el-form-item label="乘机人类型">
            <el-input placeholder="姓名" class="input-with-select" v-model="item.username">
              <el-select slot="prepend" value="1" placeholder="请选择">
                <el-option label="成人" value="1"></el-option>
              </el-select>
            </el-input>
          </el-form-item>

          <el-form-item label="证件类型">
            <el-input placeholder="证件号码" class="input-with-select" v-model="item.id">
              <el-select slot="prepend" value="1" placeholder="请选择">
                <el-option label="身份证" value="1" :checked="true"></el-option>
              </el-select>
            </el-input>
          </el-form-item>

          <span class="delete-user" @click="handleDeleteUser(index)">-</span>
        </div>
      </el-form>

      <!-- 添加乘机人 -->
      <el-button class="add-member" type="primary" @click="handleAddUsers">添加乘机人</el-button>
    </div>

    <div class="air-column">
      <h2>保险</h2>
      <div class="insurance-item" v-for="(item, index) in detail.insurances" :key="index">
        <div class="insurance-item">
          <el-checkbox
            :label="`${item.type}：￥${item.price}/份×1  最高赔付${item.compensation}`"
            border
            @change="handleChange(item.id)"
          ></el-checkbox>
        </div>
      </div>
    </div>
    <div v-show="false">{{allPrice}}</div>
    <div class="air-column">
      <h2>联系人</h2>
      <div class="contact">
        <el-form label-width="60px">
          <el-form-item label="姓名">
            <el-input v-model="contactName"></el-input>
          </el-form-item>

          <el-form-item label="手机">
            <el-input placeholder="请输入内容" v-model="contactPhone">
              <template slot="append">
                <el-button @click="handleSendCaptcha">发送验证码</el-button>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="验证码">
            <el-input v-model="captcha"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="warning" class="submit" @click="handleSubmit">提交订单</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 机票的详情
    detail: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      // 用户的列表
      users: [
        {
          username: "",
          id: ""
        }
      ],
      // 保险id的集合
      insurances: [],
      contactName: "", // 联系人
      contactPhone: "", // 联系电话
      captcha: "", // 验证码
      invoice: false // 发票，写死
    };
  },
  methods: {
    // 添加乘机人
    handleAddUsers() {
      // 给users中添加多一项
      this.users.push({
        username: "",
        id: ""
      });
    },
    // 选择保险时候触发，// id就是保险的id
    handleChange(id) {
      // 需要判断保险数组中是否存在，如果存在要删除，不存在就添加
      var index = this.insurances.indexOf(id);
      if (index === -1) {
        this.insurances.push(id);
      } else {
        this.insurances.splice(index, 1);
      }
    },
    // 移除乘机人
    handleDeleteUser(index) {
      this.users.splice(index, 1);
    },

    // 发送手机验证码
    handleSendCaptcha() {
      // 判断是否有手机号码
      if (!this.contactPhone) {
        this.$message.error("手机号码不能为空");
        return;
      }

      this.$axios({
        url: `/captchas`,
        method: "POST",
        data: {
          tel: this.contactPhone
        }
      }).then(res => {
        const { code } = res.data;
        this.$confirm(`模拟手机验证码为：${code}`, "提示", {
          confirmButtonText: "确定",
          showCancelButton: false,
          type: "warning"
        }).catch(res => {
          this.$message.error(response.data.message);
        });
      });
    },
    // 提交订单
    handleSubmit() {
      const data = {
        users: this.users,
        insurances: this.insurances,
        contactName: this.contactName,
        contactPhone: this.contactPhone,
        captcha: this.captcha,
        invoice: this.invoice,
        seat_xid: this.$route.query.seat_xid,
        air: this.$route.query.id
      };
      //自定义验证
      const rulers = [
        { key: this.users[0].username, message: "请输入乘机人姓名" },
        { key: this.users[0].id, message: "请输入身份证" },
        { key: this.contactName, message: "请输入联系人姓名" },
        { key: this.contactPhone, message: "请输入联系人电话号码" },
        { key: this.captcha, message: "请输入验证码" }
      ];
      var bool = rulers.some(v => {
        if (!v.key) {
          this.$message.warning(v.message);
          return true;
        }
      });
      if (!bool) {
        //   提交订单接口
        this.$axios({
          url: "/airorders",
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.$store.state.user.userInfo.token ||
              "NO TOKEN"}`
          },
          data
        })
          .then(res => {
            const {message,data} = res.data;
            this.$message.success(message);
            // 跳转到付款页 /air/pay?id=505
            this.$router.push({
              path: "/air/pay",
              query: {
                id: data.id
              }
            });
          })
          .catch(res => {
            const { statusCode } = res.response.data;
            if (statusCode == 401) {
            } else {
              this.$message.error(res.response.data.message);
            }
          });
      }
    }
  },

  computed: {
    allPrice() {
      let price = 0;
      let len = this.users.length;

      price += this.detail.seat_infos.org_settle_price * len;

      this.insurances.forEach(v => {
        price += this.detail.insurances[v - 1].price * len;
      });

      price += this.detail.airport_tax_audlet * len;

      // 触发设置总金额事件
      this.$emit("setAllPrice", price);

      return price;
    }
  }
};
</script>

<style scoped lang="less">
.air-column {
  border-bottom: 1px #ddd dashed;
  padding-bottom: 20px;
  margin-bottom: 20px;
}
.air-column h2 {
  margin-bottom: 20px;
  font-size: 22px;
  font-weight: normal;
}
/deep/ .el-select .el-input {
  width: 130px;
}
.input-with-select {
  width: 590px;
}
.input-with-select /deep/ .el-input-group__prepend {
  background-color: #fff;
}
.member-info /deep/ .el-form-item {
  margin-bottom: 0;
}
.member-info-item {
  border-bottom: 1px #eee dashed;
  padding-bottom: 20px;
  position: relative;
  &:first-child {
    .delete-user {
      display: none;
    }
  }
}
.add-member {
  margin-top: 20px;
}
.delete-user {
  display: block;
  background: #ddd;
  width: 16px;
  height: 16px;
  font-size: 14px;
  text-align: center;
  line-height: 16px;
  color: #fff;
  cursor: pointer;
  border-radius: 50px;
  position: absolute;
  right: -30px;
  top: 50%;
}
.insurance {
  > div {
    margin-top: 10px;
  }
}
.insurance-item {
  margin-bottom: 20px;
}
.contact {
  /deep/ .el-input {
    width: 50%;
  }
}
.submit {
  margin: 50px auto;
  display: block;
  width: 250px;
  height: 50px;
}
</style> 