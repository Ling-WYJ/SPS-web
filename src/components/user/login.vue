
<template>
  <div class="login-wrapper">
    <img class="logo" :src="logo" />
    <el-form
      ref="login"
      :rules="rules"
      :model="form"
      label-width="0"
      style="width: 100%"
      @keydown.enter.native="submit"
    >
      <!-- Github登录方式 -->
      <!-- <el-form-item prop="userID">
       <el-select v-model="form.userID" class="user-selector">
         <el-option
           v-for="index in 30"
           :key="index"
           :label="`user${index-1}`"
           :value="`user${index-1}`"
         ></el-option>
       </el-select>
     </el-form-item>-->
      <!-- 线上版本登录方式 -->
      <el-form-item prop="userID">
        <el-input
          v-model="form.user_name"
          placeholder="请输入用户名"
          type="text"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="form.user_password"
          placeholder="请输入密码"
          type="password"
          show-password
          clearable
        ></el-input>
      </el-form-item>
    </el-form>
    <el-button
      type="primary"
      @click="submit"
      style="width: 100%; margin-top: 6px"
      :loading="loading"
      >登录</el-button
    >
  </div>
</template>

<script>
import { Form, FormItem } from "element-ui";
import logo from "../../assets/image/logo.png";
export default {
  name: "Login",
  components: {
    ElForm: Form,
    ElFormItem: FormItem,
    //ElSelect: Select,
    //ElOption: Option,
  },
  data() {
    // const checkUserID = (rule, value, callback) => {
    //   if (!/^[a-zA-Z][a-zA-Z0-9_]{3,23}$/.test(value)) {
    //     callback(new Error('不合法（字母开头+字母/数字，长度4-24)'))
    //   } else {
    //     callback()
    //   }
    // }

    return {
      form: {
        user_name: "",
        user_password: "",
      },
      rules: {
        user_name: [
          { required: true, message: "请输入 userID", trigger: "blur" },
          //{ validator: checkUserID, trigger: 'blur' }
        ],
        user_password: [
          { required: true, message: "请输入密码", trigger: "blur" },
        ],
      },
      logo: logo,
      registerVisible: false,
      loading: false,
      path: {
        counsellor: "/userManagement/counsellor",
        visitor: "/userManagement/visitor",
        supervisor: "/userManagement/supervisor",
        admin: "/userManagement",
      },
    };
  },
  mounted() {
    window.sessionStorage.clear();
    window.localStorage.clear();
  },
  methods: {
    submit() {
      /*this.$refs['login'].validate(valid => {
        if (valid) {
          this.login()
        }
      })*/
      this.$refs.login.validate((valid) => {
        if (valid) {
          this.$ajax
            .post("/auth", this.form)
            .then((res) => {
              if (res.data) {
                this.login(res.data);
              } else {
                this.$message({
                  type: "error",
                  message: "用户名或密码错误",
                  showClose: true,
                });
              }
            // eslint-disable-next-line handle-callback-err
            })
            .catch((err) => {
              var errmsg = [];
              if (err.response) {
                if (err.response.data.msg) {
                  errmsg.push(err.response.data.msg);
                } else{
                  for (var i = 0; i < err.response.data.errors.length; i++) {
                    errmsg.push(err.response.data.errors[i].msg);
                  }
                }
                this.$store.commit("showMessage", {
                  message: "登录失败：" + errmsg,
                  type: "error",
                });
              } else {
                this.$store.commit('showMessage', {
                  message: '登录失败：' + err.message,
                  type: 'error'
                })
              }
            });
        } else {
          return false;
        }
      });
    },
    login(data) {
      this.loading = true;
      this.tim
        .login({
          userID: this.form.user_name,
          userSig: window.genTestUserSig(this.form.user_name).userSig,
        })
        .then(async () => {
          this.loading = false;
          this.$store.commit("toggleIsLogin", true);
          this.$store.commit("startComputeCurrent");
          this.$store.commit("showMessage", {
            type: "success",
            message: "登录成功",
          });
          this.$store.commit({
            type: "GET_USER_INFO",
            userID: this.form.user_name,
            userSig: window.genTestUserSig(this.form.user_name).userSig,
            sdkAppID: window.genTestUserSig("").SDKAppID,
            role: data.role,
          });
          await sessionStorage.setItem(
            "GET_USER_INFO",
            JSON.stringify({
              userID: this.form.user_name,
              userSig: window.genTestUserSig(this.form.user_name).userSig,
              sdkAppID: window.genTestUserSig("").SDKAppID,
              role: data.role,
            })
          );
          await this.$ajax
            .get("/auth/getInfo", {
              params: { user_name: this.form.user_name },
            })
            .then((res) => {
              if (res.data) {
                sessionStorage.setItem("user_id", res.data.user_id);
              }
            });
          console.warn(this.$store);
          this.$store.commit("showMessage", {
            type: "success",
            message: "登录成功",
          });
          this.$router.push({ path: "/userManagement" });
        })
        .catch((error) => {
          this.loading = false;
          this.$store.commit("showMessage", {
            message: "登录失败：" + error.message,
            type: "error",
          });
        });
    },
  },
};
</script>

<style lang="stylus" scoped>
.login-wrapper {
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 450px;
  background: $white;
  color: $black;
  border-radius: 5px;
  box-shadow: 0 11px 20px 0 rgba(0, 0, 0, 0.3);

  .row-div {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
  }

  .logo {
    width: 110px;
    height: 110px;
  }

  .loginBox {
    width: 320px;
    margin: 0 0 20px 0;

    .send-code {
      width: 112px;
    }

    .login-im-btn {
      width: 100%;
    }
  }

  .loginFooter {
    color: #8c8a8ac7;
    text-align: center;
    padding: 0 0 20px 0;
    cursor: pointer;
  }
}

.login-wrapper {
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 400px;
  padding: 20px 80px 50px;
  background: $white;
  color: $black;
  border-radius: 5px;
  box-shadow: 0 11px 20px 0 rgba(0, 0, 0, 0.3);

  .logo {
    width: 130px;
    height: 130px;
  }

  .register-button {
    width: 100%;
    margin: 6px 0 0 0;
  }

  .user-selector {
    width: 100%;
  }
}
</style>
