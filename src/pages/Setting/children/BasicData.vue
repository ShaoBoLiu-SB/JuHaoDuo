<template>
  <div class="basicData">
    <div class="titleBar">
      <h2>基本资料</h2>
    </div>

    <section class="inputsArea">
      <div class="rowBox">
        <div class="leftText">昵称</div>
        <input
          type="text"
          placeholder="输入您的昵称"
          v-model="userName"
          maxlength="8"
        />
      </div>
      <div class="rowBox">
        <div class="leftText">邮箱</div>
        <input
          type="email"
          placeholder="输入您的邮箱"
          v-model="userMail"
          maxlength="20"
        />
      </div>
      <!-- <div class="rowBox">
        <div class="leftText">手机</div>
        <input type="tel" placeholder="请输入您的手机号码" />
      </div>
      <div class="rowBox">
        <div class="leftText">绑定微信</div>
        <div class="wechatBox">
          <img src="@/assets/icons/wechat.png" alt="" />
          <span>未绑定</span>
        </div>
        <p>绑定微信, 用于微信登录</p>
      </div> -->
      <div class="rowBox">
        <div class="leftText"></div>
        <button @click="saveData">保存</button>
      </div>
    </section>
  </div>
</template>

<script>
import { changeUserData } from "@/requests/mine";
export default {
  data() {
    return {
      userName: null,
      userMail: null,
    };
  },

  methods: {
    saveData() {
      if (
        this.userName == "" ||
        this.userName == null ||
        this.userName == undefined
      ) {
        this.msgTip("请输入您的昵称", "warning");
      } else if (
        this.userMail == "" ||
        this.userMail == null ||
        this.userMail == undefined
      ) {
        this.msgTip("请输入您的邮箱", "warning");
      } else {
        changeUserData(this.userName, this.userMail).then(
          (res) => {
            console.log(res);
            if (res.data.msg == "修改成功") {
              this.msgTip("修改成功", "success");
              localStorage.setItem("userName", this.userName);
              localStorage.setItem("userMail", this.userMail);
              location.reload();
            }else if(res.data.msg == '修改失败') {
              this.msgTip('修改失败', 'warning')
            }
          },
          (err) => {
            console.log(err, "错误!");
          }
        );
      }
    },

    msgTip(msgTip, type) {
      this.$message({
        showClose: true,
        duration: 2000,
        message: msgTip,
        type: type,
      });
    },
  },

  watch: {},
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
    width: 411px;
    margin: 56px auto;

    .rowBox {
      display: flex;
      margin-bottom: 31px;
      font-size: 14px;
      color: #666;
      align-items: center;

      .leftText {
        width: 56px;
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
        width: 265px;
        text-align: right;
      }
      button {
        width: 88px;
        height: 32px;
        border-radius: 50px;
        background-color: #fa7e02;
        color: white;
        cursor: pointer;
      }
    }
  }
}
</style>