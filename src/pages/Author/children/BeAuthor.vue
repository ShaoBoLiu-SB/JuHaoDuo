<template>
  <div class="beAuthor">
    <div class="uselessBar">
      <div class="contentBox">
        <span>申请成为作者</span>
      </div>
    </div>

    <!-- input区域 -->
    <div class="content">
      <!-- 进度条 -->
      <div class="stepBar">
        <div class="one activeStep">1</div>
        <span class="stepTitle">注册协议</span>
        <div
          class="lineOne"
          :class="[
            { steppingLine: stepIndex == 1 },
            { fullLine: stepIndex != 1 },
          ]"
        ></div>
        <div class="two" :class="{ activeStep: stepIndex >= 2 }">2</div>
        <span class="stepTitle">个人信息</span>
        <div
          class="lineTwo"
          :class="[
            { steppingLine: stepIndex == 2 },
            { fullLine: stepIndex == 3 },
          ]"
        ></div>
        <div class="three" :class="{ activeStep: stepIndex >= 3 }">3</div>
        <span class="stepTitle">注册成功</span>
      </div>

      <div class="stepZero" v-if="stepIndex == -1"></div>

      <div class="stepOne" v-if="stepIndex == 1">
        <policy></policy>

        <div class="agreement">
          <input type="checkbox" ref="agreement" />
          <p>我已阅读并同意</p>
          <a>《内容商注册协议》</a>
        </div>
      </div>

      <div class="stepTwo" v-if="stepIndex == 2">
        <div class="inputTitle">作者笔名</div>
        <div class="inputRow">
          <input
            type="text"
            ref="author_name"
            placeholder="(必填) 输入您的笔名"
          />
        </div>
        <br />

        <div class="inputTitle">手机号码</div>
        <div class="inputRow">
          <input
            type="text"
            ref="tel"
            placeholder="(选填) 填写您常用的手机号码"
          />
        </div>
        <br />

        <div class="inputTitle">QQ号码</div>
        <div class="inputRow">
          <input type="text" ref="QQ" placeholder="(选填) 输入您常用的QQ号码" />
        </div>
      </div>

      <div class="stepThree" v-if="stepIndex == 3">
        <div class="successTip">
          <img src="@/assets/icons/greenSuccess.png" alt="" />
          <p>恭喜注册成功</p>
          <button @click="$router.push('/home')">请耐心等待审核</button>
        </div>
      </div>

      <button
        @click="nextStep"
        v-if="stepIndex == 1 || stepIndex == 2"
        class="nextStep"
      >
        下一步
      </button>
    </div>
  </div>
</template>

<script>
import { telTest } from "@/utils/index";
import { authorMsgSubmit } from "@/requests/author";
import Policy from "@/components/Policy/Policy.vue";
export default {
  components: { Policy },
  data() {
    return {
      stepIndex: 1,
      sexType: 2,
      sexInputList: [
        { value: "男", ischeck: false },
        { value: "女", ischeck: false },
        { value: "保密", ischeck: true },
      ],
      userMessage: {}, // 用户填写完表单, 用一个变量接收一下
      userSex: "保密",
    };
  },

  methods: {
    // 这么写重复性太高了，改一下
    errTip(msg) {
      this.$message({
        message: msg,
        type: "warning",
      });
    },

    // 点击到注册的下一步
    nextStep() {
      // 判断当前是第一步， 进行第一步的检测
      if (this.stepIndex == 1) {
        let agreement = this.$refs.agreement.checked;
        if (!agreement) {
          this.errTip("请阅读协议并同意");
        } else {
          this.stepIndex++;
        }
      }
      // 判断当前是第二部，检测：
      if (this.stepIndex == 2) {
        let tel = Number(this.$refs.tel.value);
        let author_name = this.$refs.author_name.value;
        let QQ = this.$refs.QQ.value;
        let isRegTel = telTest(tel);

        if (tel && !isRegTel) {
          this.errTip("手机号格式错误");
        }
        if (!author_name) {
          this.errTip("请输入笔名");
        } else {
          // 第二步验证都过了，继续存储
          this.userMessage.tel = tel || null;
          this.userMessage.author_name = author_name;
          this.userMessage.qq = QQ || null;
          let token = localStorage.getItem("userToken");
          this.userMessage.token = token;
          // console.log(this.userMessage);

          authorMsgSubmit(this.userMessage).then((res) => {
            // console.log(res);
          });

          this.stepIndex++;
        }
      }
    },
  },

  mounted() {
    this.$store.commit("changeActiveIndex", -1);
  },
};
</script>

<style lang="less" scoped>
.uselessBar {
  width: 100%;
  height: 100px;
  line-height: 100px;
  background: url(@/assets/imgs/bg.png) center center;
  background-size: 100% auto;

  .contentBox {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    font-size: 20px;

    img {
      width: 20px;
      margin-right: 10px;
    }
  }
}

.beAuthor {
  background-color: #fafafa;
  height: 102vh;
}

.content {
  margin: 56px auto;
  text-align: center;
  padding: 48px 24px 12px;
  background-color: white;
  width: 800px;
  box-sizing: border-box;
  border-radius: 6px;

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

    .stepTitle {
      margin-left: 8px;
      font-size: 14px;
      color: #333;
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

  .stepOne,
  .stepTwo {
    margin-top: 68px;
    color: #333333;
    font-size: 14px;

    .inputTitle {
      color: #666;
      width: 72px;
      text-align: right;
      display: inline-block;
    }

    .inputRow {
      display: inline-block;
      flex: 1;
      width: 552px;
      height: 36px;

      input {
        width: 100%;
        height: 100%;
        border-radius: 6px;
        background-color: #fafbfb;
        margin-left: 16px;
        text-indent: 1em;
      }
    }

    .sexSelect {
      margin: 30px 0;

      .inputArea {
        display: inline-block;
        margin-left: 26px;
        text-align: left;
        width: 532px;
        vertical-align: baseline;

        .inputBox {
          display: inline-block;
          margin-right: 24px;
          display: inline-block;

          .sexInput {
            width: 16px;
            height: 16px;
            border: none;
            outline: none;
            transform: translateY(3px);
            margin-right: 8px;
          }

          .sexInput:checked + .sexInput:after {
            content: "";
            display: inline-block;
            width: 26px;
            height: 26px;
            background: #f87d00;
            border-radius: 100%;
            margin-top: 5px;
            margin-left: 5px;
          }
        }
      }
    }

    .agreement {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 32px;

      input {
        width: 14px;
        height: 14px;
        border: 1px solid #f87d00;
      }

      p {
        margin: 0 6px 0 8px;
      }

      a {
        color: #f87d00;
        cursor: pointer;
      }
    }
  }

  .stepTwo {
    .inputRow {
      margin-bottom: 24px;
    }
  }

  .stepThree {
    margin: 68px auto 0;

    .successTip {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #333;
      font-size: 18px;

      p {
        margin: 12px 0 40px;
      }

      button {
        color: white;
        width: 320px;
        height: 36px;
        border-radius: 18px;
        background-color: #f87d00;
        font-size: 14px;
        cursor: pointer;
      }
    }
  }

  .nextStep {
    width: 320px;
    height: 36px;
    border-radius: 123px;
    background-color: #f87d00;
    margin: 21px auto;
    color: white;
    cursor: pointer;
  }
}
</style>