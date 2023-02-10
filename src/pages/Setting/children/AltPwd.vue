<template>
  <div class="basicData">
    <div class="titleBar">
      <h2>修改密码(设置密码)</h2>
    </div>

    <section class="inputsArea">
      <div class="rowBox" v-if="havePassowrd">
        <div class="leftText">旧密码</div>
        <input
          type="password"
          placeholder="输入旧密码"
          v-model.lazy="oldPwd"
          maxlength="18"
          minlength="6"
        />
      </div>
      <div class="rowBox">
        <div class="leftText">新密码</div>
        <input
          type="password"
          placeholder="输入新密码"
          v-model.lazy="newPwd"
          maxlength="18"
          minlength="6"
        />
      </div>
      <div class="rowBox">
        <div class="leftText">确认新密码</div>
        <input
          type="password"
          placeholder="确认新密码"
          v-model.lazy="confirmPwd"
          maxlength="18"
        />
      </div>
      <div class="rowBox">
        <div class="leftText">绑定微信</div>
        <div class="wechatBox">
          <img src="@/assets/icons/wechat.png" alt="" />
          <span>未绑定</span>
        </div>
        <p>绑定微信, 用于微信登录</p>
      </div>
      <div class="rowBox">
        <div class="leftText"></div>
        <button @click="savePassword" :class="{ activeBtn: this.actBtn }">
          保存
        </button>
      </div>
    </section>
  </div>
</template>

<script>
import { setPws, altPwd } from "@/requests/mine";
export default {
  data() {
    return {
      oldPwd: "",
      newPwd: "",
      confirmPwd: "",
      actBtn: false,
    };
  },

  methods: {
    // 封装消息提示
    msgTip(type, msg) {
      this.$message({
        showClose: true,
        duration: 2000,
        type,
        message: msg,
      });
    },

    savePassword() {
      // 如果当前按钮是禁止状态, return;不做后面的逻辑了
      if (!this.actBtn) {
        return;
      }
      let uid = localStorage.getItem("uid");

      // console.log(this.oldPwd, this.newPwd, this.confirmPwd, uid);
      // 没有密码, 那就是设置密码
      if (!this.havePassowrd) {
        if (this.newPwd.length < 6 || this.newPwd.length > 18) {
          // alert("密码最短为6位,最长为18位");
          this.msgTip("warning", "密码最短为6位,最长为18位");
        } else if (this.newPwd != this.confirmPwd) {
          alert("两次密码输入不一致");
          this.msgTip("warning", "两次密码输入不一致");
        } else {
          let data = {
            password: this.newPwd,
            rpassword: this.confirmPwd,
            uid,
          };
          // 发送请求设置密码请求
          setPws(data).then(
            (res) => {
              // console.log(res);
              if (res.data.code == 0) {
                // alert(res.data.msg, "请重新登录");
                this.msgTip("success", res.data.msg);

                // 然后退出登录
                this.$store.commit("changeLogin", false);
                localStorage.clear();
                this.$router.push("/home");
              }
            },
            (err) => {
              console.log(err);
            }
          );
        }
      }
      // 如果有密码, 那就是改密码
      else {
        if (!this.oldPwd) {
          // alert("请输入旧密码");
          this.msgTip("warning", "请输入旧密码");
        } else if (this.newPwd.length < 6 || this.newPwd.length > 18) {
          // alert("密码长度最短为6位最长为18位");
          this.msgTip("warning", "密码长度最短为6位最长为18位");
        } else if (this.newPwd != this.confirmPwd) {
          // alert("两次密码输入不一致");
          this.msgTip("warning", "两次密码输入不一致");
        } else {
          let data = {
            opassword: this.oldPwd,
            password: this.newPwd,
            rpassword: this.confirmPwd,
          };
          altPwd(data).then((res) => {
            // console.log(res);
            if (res.data.code == 0) {
              // alert(res.data.msg, "请重新登录");
              this.msgTip("success", "修改成功,请重新登录");

              this.$store.commit("changeLogin", false);
              localStorage.clear();
              // 然后退出登录
              this.$router.push("/home");
            }
          });
        }
      }
    },
  },

  computed: {
    havePassowrd() {
      return localStorage.getItem("passwordLogin");
    },
  },
  watch: {
    confirmPwd() {
      // 通过监视确定密码的值, 决定保存按钮要不要高亮
      // 如果是设置密码模式
      if (!this.havePassowrd) {
        if (
          this.confirmPwd.length >= 8 &&
          this.confirmPwd.length <= 18 &&
          this.newPwd == this.confirmPwd
        ) {
          this.actBtn = true;
        } else {
          this.actBtn = false;
        }
      } else {
        if (
          this.oldPwd &&
          this.confirmPwd.length >= 8 &&
          this.confirmPwd.length <= 18 &&
          this.newPwd == this.confirmPwd
        ) {
          this.actBtn = true;
        } else {
          this.actBtn = false;
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.titleBar {
  h2 {
    border-bottom: 1px solid #d8d8d8;
    color: #333;
    font-size: 18px;
    font-weight: bold;
    padding-bottom: 10px;
  }
}

.basicData {
  width: 950px;

  .inputsArea {
    width: 451px;
    margin: 56px auto;

    .rowBox {
      display: flex;
      margin-bottom: 31px;
      font-size: 14px;
      color: #666;
      align-items: center;

      .leftText {
        width: 86px;
        text-align: right;
        margin-right: 16px;
      }

      input {
        width: 360px;
        height: 36px;
        border-radius: 18px;
        outline: 1px solid #cdaf9b;
        text-indent: 1em;
      }

      ::-webkit-input-placeholder {
        color: #c7c7c7;
        font-size: 14px;
      }

      .wechatBox {
        display: flex;
        align-items: center;

        img {
          margin-right: 4px;
        }
      }

      p {
        width: 275px;
        text-align: right;
      }

      button {
        width: 88px;
        height: 32px;
        border-radius: 50px;
        background-color: #fcbb8b;
        color: white;
        cursor: not-allowed;
      }

      .activeBtn {
        background-color: #fa7e02;
        cursor: pointer;
      }
    }
  }
}
</style>