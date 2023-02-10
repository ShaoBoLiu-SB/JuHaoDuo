<template>
  <div class="altPhone">
    <div class="titleBar">
      <h2>更改手机号</h2>
    </div>
    <div class="content">
      <!-- 进度条 -->
      <div class="stepBar">
        <div class="one activeStep">1</div>
        <div
          class="lineOne"
          :class="[
            { steppingLine: stepIndex == 1 },
            { fullLine: stepIndex != 1 },
          ]"
        ></div>
        <div class="two" :class="{ activeStep: stepIndex >= 2 }">2</div>
        <div
          class="lineTwo"
          :class="[
            { steppingLine: stepIndex == 2 },
            { fullLine: stepIndex == 3 },
          ]"
        ></div>
        <div class="three" :class="{ activeStep: stepIndex >= 3 }">3</div>
      </div>

      <div class="stepOne" v-if="stepIndex == 1">
        <span>输入密码</span>
        <input type="password" maxlength="18" minlength="6" v-model="pwd" />
      </div>

      <div class="stepTwo" v-if="stepIndex == 2">
        <div class="rowBox">
          <div class="leftText">新手机号</div>
          <input
            type="tel"
            placeholder="手机号"
            v-model="newPhone"
            maxlength="11"
          />
        </div>
        <div class="rowBox">
          <div class="leftText">验证码</div>
          <input
            type="text"
            class="checkCode"
            placeholder="验证码"
            v-model="checkCode"
            maxlength="6"
          />
          <button
            :class="{ activeButton: actCheckCode }"
            @click="getCheckCode"
            v-if="getCodeShow"
          >
            获取验证码
          </button>
          <button v-else style="cursor: not-allowed">
            {{ count }}后重新发送
          </button>
        </div>
        <div class="rowBox">
          <div class="leftText"></div>
          <p>
            验证过程中会用到短信，请注意您的手机提示，我们将保护
            您个人手机号信息。
          </p>
        </div>
      </div>

      <div class="stepThree" v-if="stepIndex == 3">
        <img src="@/assets/icons/bindSuccess.png" alt="" />
        <div class="successTip">
          <img src="@/assets/icons/success..png" alt="" />
          更改成功
        </div>
      </div>
      <button
        @click="nextStep"
        v-if="stepIndex == 1 || stepIndex == 2"
        :class="{ activeButton: actBtn }"
      >
        下一步
      </button>
    </div>
  </div>
</template>

<script>
// 导入验证密码和更改密码的接口
import { checkPwd, altPhone } from "@/requests/mine";
// 导入获取验证码的接口
import { getCheckCode } from "@/requests/login";
// 导入验证手机号的正则方法
import { telTest } from "@/utils/index";
export default {
  data() {
    return {
      stepIndex: 1,
      actBtn: false,
      pwd: "",
      actBtn: false, //拿来判断button要不要高亮的变量
      actCheckCode: false, //判断获取验证码按钮要不要高亮
      newPhone: null,
      checkCode: null,
      count: 60,
      getCodeShow: true,
    };
  },
  methods: {
    // 封装message提示
    msgTip(msg, type) {
      this.$message({
        message: msg,
        type: type,
      });
    },

    // 获取验证码, 单独拎出来,写成方法
    getCheckCode() {
      let telCheckRes = telTest(this.newPhone);
      if (telCheckRes) {
        // 发送验证码并60秒等待
        getCheckCode(this.newPhone).then(
          (res) => {
            if (res.data.msg == "您获取验证码已超过限制，请不要重复获取") {
              this.msgTip("您获取验证码已超过限制，请不要重复获取", "warning");
            }

            // 然后再做60秒的验证等待
            this.getCodeShow = false; //隐藏获取验证码
            var timer = setInterval(() => {
              this.count -= 1;
              if (this.count < 1) {
                clearInterval(timer);
                this.count = 60;
                this.getCodeShow = true;
              }
            }, 1000);
          },
          (res) => {
            console.log(err, "错误!");
          }
        );
      } else {
        this.msgTip("手机号不符合规则", "warning");
      }
    },

    nextStep() {
      // 如果按钮没有高亮, 那就不走逻辑!
      if (!this.actBtn) {
        return;
      }
      // 第一部验证密码
      if (this.stepIndex == 1) {
        checkPwd(this.pwd).then(
          (res) => {
            if (res.data.msg == "验证成功") {
              this.stepIndex++;
              this.actBtn = false;
            }
          },
          (err) => {
            console.log(err, "错误");
          }
        );
      }
      // 第二步验证
      else if (this.stepIndex == 2) {
        let formData = new FormData();
        formData.append("phone", this.newPhone);
        formData.append("code", this.checkCode);

        altPhone(formData).then(
          (res) => {
            console.log(res);
            this.msgTip(res.data.msg, "warning");
            if (res.data.msg == "修改成功") {
              // 修改成功 退出登录
              this.stepIndex++;
              // 然后清空本地, 改变登录状态, 回到首页
              setTimeout(() => {
                localStorage.clear();
                this.$store.commit("changeLogin", false);
                this.$router.push("/home");
              }, 1500);
            }
          },
          (err) => {
            console.log(err, "错误!");
          }
        );
      }
    },
  },
  computed: {},
  watch: {
    // 监视密码输入, 有密码就让下一步亮起来
    pwd() {
      if (this.pwd) {
        this.actBtn = true;
      } else {
        this.actBtn = false;
      }
    },

    // 监视验证码和手机号, 这两个都有才能让下一步亮起来 还有手机号得符合规则,
    checkCode() {
      if (this.stepIndex == 2 && this.checkCode) {
        this.actBtn = true;
      } else {
        this.actBtn = false;
      }
    },

    // 监视手机号输入, 有手机号,就让请求验证码亮起来;
    newPhone() {
      if (this.newPhone) {
        this.actCheckCode = true;
      } else {
        this.actCheckCode = false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import url("@/assets/font.less");

.titleBar {
  h2 {
    border-bottom: 1px solid #d8d8d8;
    color: #333;
    font-size: 18px;
    font-weight: bold;
    padding-bottom: 10px;
  }
}

.altPhone {
  width: 950px;

  .content {
    margin: 56px auto;
    text-align: center;

    .stepBar {
      display: flex;
      justify-content: center;
      align-items: center;

      .one,
      .two,
      .three {
        font-family: robota;
        width: 40px;
        height: 40px;
        border-radius: 20px;
        background-color: #d4d4d4;
        text-align: center;
        line-height: 40px;
        color: white;
        font-size: 18px;
        position: relative;
      }

      .one,
      .two,
      .three {
        &::after {
          position: absolute;
          display: inline-block;
          content: "验证密码";
          color: #333;
          width: 80px;
          font-size: 14px;
          top: 40px;
          left: 50%;
          transform: translateX(-50%);
        }
      }

      .two {
        &::after {
          content: "绑定新号码";
        }
      }

      .three {
        &::after {
          content: "绑定成功";
        }
      }

      .activeStep {
        background-color: #f87d00;
      }

      .lineOne,
      .lineTwo {
        width: 120px;
        height: 2px;
        background-color: #d8d8d8;
        margin: 0 16px;
        transition: all 0.5s;
      }

      .steppingLine {
        background: linear-gradient(90deg, #f87d00 0%, #ffe1c3 99%);
      }

      .fullLine {
        background-color: #f87d00;
      }
    }

    .stepOne {
      margin-top: 68px;
      color: #333333;
      font-size: 14px;

      input {
        width: 360px;
        height: 36px;
        border-radius: 18px;
        outline: 1px solid #cdaf9b;
        margin-left: 16px;
        text-indent: 1em;
      }
    }

    .stepTwo {
      width: 450px;
      margin: 68px auto 0;
      .rowBox {
        display: flex;
        align-items: center;
        margin-bottom: 24px;
        .leftText {
          width: 75px;
          text-align: right;
          margin-right: 16px;
          font-size: 14px;
          color: #333;
        }
        input {
          width: 360px;
          height: 36px;
          border-radius: 18px;
          outline: 1px solid #cdaf9b;
          text-indent: 1em;
        }
        .checkCode {
          width: 230px;
        }
        button {
          margin: 0;
          transform: none;
          width: 118px;
          height: 36px;
          margin-left: 14px;
        }

        p {
          text-align: left;
          margin-left: 25px;
          color: #9e9e9e;
        }
      }
    }

    .stepThree {
      margin: 68px auto 0;
      .successTip {
        display: flex;
        justify-content: center;
        align-items: center;
        color: #333;
        font-size: 18px;
        img {
          margin-right: 8px;
        }
      }
    }

    button {
      width: 88px;
      height: 32px;
      border-radius: 123px;
      background-color: #fcbb8b;
      margin-top: 24px;
      color: white;
      transform: translateX(-100px);
      cursor: not-allowed;
    }

    .activeButton {
      background-color: #f87d00;
      cursor: pointer;
    }
  }
}
</style>