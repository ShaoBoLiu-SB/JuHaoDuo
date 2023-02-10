<template>
  <!-- 整个大盒子是个遮罩层 -->
  <div class="login" v-if="loginShow">
    <!-- 登录框盒子 -->
    <div class="loginBox">
      <!-- 关闭按钮 -->
      <img src="@/assets/icons/close.png" class="close" @click="changeLoginShow" />

      <!-- 弹窗输入提示 -->
      <span v-show="tipOne" class="tip">请输入手机号</span>
      <span v-show="tipTwo" class="tip">手机号格式不正确, 请重新输入</span>
      <span v-show="tipThree" class="tip">请阅读并同意协议</span>
      <span v-show="tipFour" class="tip">请输入密码</span>
      <span v-show="tipFive" class="tip">电话或密码输入不正确</span>
      <span v-show="tipSix" class="tip">请输入验证码</span>

      <!-- 左边的登录注册 -->
      <div class="loginBox">
        <!-- 登录标题 -->
        <div class="loginTitle">
          <div class="shortMessageLoginTitle" :class="{ activeTitle: loginIndex == 0 }" @click="loginIndex = 0">
            短信登录
          </div>
          <div class="accountLoginTitle" :class="{ activeTitle: loginIndex == 1 }" @click="loginIndex = 1">
            账号登录
          </div>
          <div class="scanLoginTitle" :class="{ activeTitle: loginIndex == 2 }" @click="loginIndex = 2;">
            扫码登录
          </div>
        </div>

        <!-- 短信登录输入 -->
        <div class="shortMessageInputsSection" v-show="loginIndex == 0">
          <p>新手机号验证后将自动注册</p>
          <div class="telInputBox">
            <input type="tel" v-model="userTel" placeholder="请输入手机号" />
          </div>
          <div class="checkNumberInputBox">
            <input type="text" v-model="checkNumber" placeholder="请输入验证码" maxlength="6" ref="checkCodeInput" />
            <span @click="getCheckCode" v-show="getCodeShow">获取验证码</span>
            <span class="forbid" v-show="!getCodeShow"><strong>{{ count }} </strong>秒后重新获取验证码</span>
          </div>
        </div>

        <!-- 账号登录输入 -->
        <div class="accountInputSection" v-show="loginIndex == 1">
          <input type="text" placeholder="手机" v-model="accountTel" />
          <input type="password" placeholder="登录密码" v-model="userPassword" />
        </div>

        <!-- 扫码登录 -->
        <div class="scanLoginSection" v-show="loginIndex == 2">
          <!-- 右边的扫码登录 -->
          <div class="qrCodeLogin">
            <!-- 二维码 -->
            <div id="qrCodeBox">
              <iframe src="http://dj.huashengbook.cn/api/login/weixinqr" frameborder="0" height="400"
                ref="iframeBox"></iframe>
            </div>
            <!-- 文字提示 -->
            <div class="loginTip">
              <img src="@/assets/icons/wechat.png" alt="" />
              <span>使用微信扫码登录</span>
            </div>
          </div>
        </div>
        <!-- 登录按钮 -->
        <button class="loginBtn" @click="loginValidate">登录</button>

        <!-- 同意协议盒子 -->
        <div class="agreement">
          <input type="checkbox" v-model="agreement" />
          <span>登录即同意</span>
          <a href="" target="_blank">《用户协议》</a>
          <span>和</span>
          <a>《隐私政策》</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 获取网络请求
import {
  getCheckCode,
  checkCodeLogin,
  pwdLogin,
  qrCodeLogin,
  getqrCode,
} from "@/requests/login";
// 导入手机号验证函数
export default {
  data() {
    return {
      loginIndex: 0, //判断是短信登录显示还是账号密码显示
      userTel: null, //用户输入的电话号码
      checkNumber: null, //用户输入的验证码
      agreement: false, //是否同意协议
      tipOne: false, //输入手机号提示
      tipTwo: false, //重新输入手机号提示
      tipThree: false, //阅读协议提示
      tipFour: false, //提示输入密码
      tipFive: false, //提示输入电话号码或者密码不正确
      tipSix: false, //提示输入验证码
      count: 60, //获取验证码倒计时
      getCodeShow: true, //判断获取验证码显不显示
      accountTel: null, //这个是用户用账号密码登录输入的电话号码
      userPassword: null, //密码:暂时只是做一个判断,判断用户有没有输入
      qrCodeHtml: null,
    };
  },
  computed: {
    // 从vuex中获取登录框显示状态(靠这个决定登录框显示和隐藏)
    loginShow() {
      return this.$store.state.home.loginShow;
    },
  },
  methods: {
    // 打开或者关闭登录框
    changeLoginShow() {
      this.$store.commit("changeLoginShow", false);
    },

    // 判断手机号是不是空的函数(true为空)
    isTelNull() {
      // 先判断手机号是不是空的
      if (
        this.userTel === "" ||
        this.userTel === undefined ||
        this.userTel === null
      ) {
        return true;
      } else {
        return false;
      }
    },
    // 判断手机号符不符合规则(不符合为true)
    testUserTel() {
      let commonReg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/;
      if (commonReg.test(this.userTel)) {
        return false;
      } else {
        return true;
      }
    },
    // 判断有没有同意协议(不同意为true)
    agreementCheck() {
      if (this.agreement) {
        return false;
      } else {
        return true;
      }
    },
    // 判断有没有输入验证码
    ischeckCodeNull() {
      if (
        this.checkNumber === "" ||
        this.checkNumber === undefined ||
        this.checkNumber === null
      ) {
        return true;
      } else {
        return false;
      }
    },

    // 发送验证码并60秒等待
    async sendCodeAndWait() {
      let result = await getCheckCode(this.userTel);
      if (result.msg == "您获取验证码已超过限制，请不要重复获取") {
        this.$message({
          message: "您获取验证码已超过限制，请不要重复获取",
          showClose: true,
          duration: 2000,
          type: "warning",
        });
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

    // 手机号为空的弹窗
    telToast() {
      this.tipOne = true;
      setTimeout(() => {
        this.tipOne = false;
      }, 1500);
    },
    // 手机号不符合规则弹窗
    telErrorToast() {
      this.tipTwo = true;
      setTimeout(() => {
        this.tipTwo = false;
      }, 1500);
    },
    // 还没有同意协议的弹窗
    agreementToast() {
      this.tipThree = true;
      setTimeout(() => {
        this.tipThree = false;
      }, 1500);
    },
    // 验证码为空的弹窗
    checkCodeToast() {
      this.tipSix = true;
      setTimeout(() => {
        this.tipSix = false;
      }, 1500);
    },

    // 获取验证码,要经过一系列验证
    getCheckCode() {
      let istelNullFlag = this.isTelNull();
      let isTelErrorFlag = this.testUserTel();
      let isAgreementCheckFlag = this.agreementCheck();
      if (istelNullFlag) {
        this.telToast();
      } else {
        if (isTelErrorFlag) {
          this.telErrorToast();
        } else {
          if (isAgreementCheckFlag) {
            this.agreementToast();
          } else {
            this.sendCodeAndWait();
          }
        }
      }
    },

    // 用信息和验证码点击登录的验证
    // 也是进行一系列判断
    async messageLoginValidate() {
      let istelNullFlag = this.isTelNull();
      let isTelErrorFlag = this.testUserTel();
      let isAgreementCheckFlag = this.agreementCheck();
      let ischeckCodeNullFlag = this.ischeckCodeNull();
      if (istelNullFlag) {
        this.telToast();
      } else {
        if (isTelErrorFlag) {
          this.telErrorToast();
        } else {
          if (isAgreementCheckFlag) {
            this.agreementToast();
          } else {
            if (ischeckCodeNullFlag) {
              this.checkCodeToast();
            } else {
              // 携带验证码发送登录请求
              let result = await checkCodeLogin(this.userTel, this.checkNumber);
              // console.log(result, '短信登录结果');
              // 判断一下登录成功了没
              if (result.data.msg == "success") {
                // 成功了, 把token存到本地存储里面
                localStorage.setItem("userToken", result.data.data.token);
                localStorage.setItem("userName", result.data.data.username);
                localStorage.setItem("uid", result.data.data.uid);
                localStorage.setItem("reg", result.data.data.reg);
                localStorage.setItem("avatarUrl", result.data.data.headimg);
                localStorage.setItem("userTel", this.userTel);
                // 验证码返回字段password如果是null, 就设个本地存储,判断不是密码登录的,也就是没有设置密码
                if (result.data.data.password == null) {
                  localStorage.setItem("passwordLogin", false);
                }
                // 修改vuex里面的登录状态
                this.$store.commit("changeLogin", true);
                // 提示登录成功(右上角就变成了用户信息了),再关闭登录框
                this.$store.commit("changeLoginShow");
                location.reload();
              } else if (result.data.msg == "验证码错误，请核对后重新输入") {
                this.$message({
                  showClose: true,
                  duration: 2000,
                  message: "验证码错误，请核对后重新输入",
                  type: "error",
                });
              }
            }
          }
        }
      }
    },

    // 登录验证: 因为只有一个按钮,要判断一下用户在用哪个方式登录
    // 用判断短信或者账号登录的变量来判断
    loginValidate() {
      // 用账号和密码点击登录验证
      // 如果是账号登录
      if (this.loginIndex == 1) {
        // 判断手机号输入正不正确（不做正则验证）
        if (
          this.accountTel === "" ||
          this.accountTel === undefined ||
          this.accountTel === null
        ) {
          this.tipOne = true;
          setTimeout(() => {
            this.tipOne = false;
          }, 1500);
        }
        // 判断密码输入（不做正则）
        else if (
          this.userPassword === "" ||
          this.userPassword === undefined ||
          this.userPassword === null
        ) {
          this.tipFour = true;
          setTimeout(() => {
            this.tipFour = false;
          }, 1500);
        } else if (!this.agreement) {
          this.tipThree = true;
          setTimeout(() => {
            this.tipThree = false;
          }, 1500);
        } else {
          pwdLogin(this.accountTel, this.userPassword).then(
            (res) => {
              if (res.data.msg == "登录成功") {
                // 关闭登录框
                this.$store.commit("changeLoginShow", false);
                // 修改vuex里面的登录状态
                this.$store.commit("changeLogin", true);
                // 成功了, 把token存到本地存储里面
                localStorage.setItem("userToken", res.data.data.token);
                localStorage.setItem("userName", res.data.data.username);
                localStorage.setItem("uid", res.data.data.uid);
                localStorage.setItem("avatarUrl", res.data.data.headimg);
                localStorage.setItem("userTel", res.data.data.mobile);
                // 密码登录的设置本地存储,记录是密码登录的
                localStorage.setItem("passwordLogin", true);
                location.reload();
              } else if (res.data.msg == "用户名或密码不正确") {
                this.$message({
                  showClose: true,
                  duration: 2000,
                  message: "用户名或密码不正确",
                  type: "error",
                });
              }
            },
            (err) => {
              console.log(err);
            }
          );
        }
      }
      // 不然就是短信登录
      else {
        this.messageLoginValidate();
      }
    },



  },
  mounted() {

  },
};
</script>

<style lang="less" scoped>
.login {
  position: fixed;
  z-index: 999;
  left: 0;
  right: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;

  .loginBox {
    position: relative;
    width: 386px;
    // height: 394px;
    background-color: white;
    border-radius: 8px;
    display: flex;
    overflow: hidden;

    // 关闭按钮
    .close {
      position: absolute;
      right: 5px;
      top: 5px;
      width: 40px;
      height: 40px;
      z-index: 9;
      cursor: pointer;
    }

    // 注册
    .signup {
      position: absolute;
      right: 10px;
      top: 10px;
      font-size: 14px;
      color: white;
      z-index: 9;
      cursor: pointer;

      &:after {
        content: "";
        position: absolute;
        top: -110px;
        left: -30px;
        transform: rotate(45deg);
        width: 160px;
        height: 160px;
        background-color: #e9af5b;
        z-index: -1;
      }
    }

    // 登录提示
    .tip {
      z-index: 999;
      display: inline-block;
      height: 30px;
      padding: 0 15px;
      border-radius: 30px;
      text-align: center;
      line-height: 30px;
      color: white;
      background-color: rgba(0, 0, 0, 0.7);
      position: absolute;
      left: 50%;
      top: 50%;
      font-size: 12px;
      transform: translate(-50%, -50%);
    }

    // 登录和注册
    .loginBox {
      display: inline-block;
      width: 438px;
      height: 100%;
      padding: 45px;
      box-sizing: border-box;
      position: relative;

      // background-color: pink;
      &::after {
        width: 10px;
        height: 320px;
        color: #e5e5e5;
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
      }

      // 登录标题
      .loginTitle {
        display: flex;
        justify-content: center;
        margin: 0 auto;

        .shortMessageLoginTitle,
        .accountLoginTitle,
        .scanLoginTitle {
          color: #666666;
          font-size: 18px;
          // margin-right: 33px;
          margin: 0 16px;
          text-align: center;
          cursor: pointer;
          white-space: nowrap;
        }

        .activeTitle {
          color: #ff7b1a;
          font-weight: 700;
          position: relative;

          &::after {
            content: "";
            width: 30px;
            height: 3px;
            border-radius: 2px;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            top: 32px;
            background-color: #ff7b1a;
          }
        }
      }

      // 短信输入
      .shortMessageInputsSection {
        margin-top: 34px;
        margin-bottom: 32px;

        p {
          font-size: 14px;
          color: #9e9e9e;
        }

        .telInputBox {
          padding: 12px 0;

          input {
            height: 36px;
            width: 306px;
            background-color: #f7f7f7;
            text-indent: 1em;
            border-radius: 100px;

            &::-webkit-input-placeholder {
              color: #9e9e9e;
              font-size: 14px;
            }
          }
        }

        .checkNumberInputBox {
          width: 310px;
          padding: 12px 0;
          position: relative;

          input {
            height: 36px;
            width: 306px;
            background-color: #f7f7f7;
            text-indent: 1em;
            border-radius: 100px;

            &::-webkit-input-placeholder {
              color: #9e9e9e;
              font-size: 14px;
            }
          }

          span {
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
            font-size: 14px;
            color: #ff7b1a;
          }

          // 重新获取验证码,鼠标变成禁止的
          .forbid {
            cursor: not-allowed;
          }
        }
      }

      // 账号输入
      .accountInputSection {
        margin: 30px 0;

        input {
          height: 36px;
          width: 306px;
          background-color: #f7f7f7;
          text-indent: 1em;
          border-radius: 100px;
          margin-top: 20px;
        }
      }

      // 登录按钮
      .loginBtn {
        color: white;
        background-color: #ff7b1a;
        width: 306px;
        height: 40px;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.4s;
        font-size: 14px;

        &:hover {
          box-shadow: 0 1px 3px 2px rgb(215, 215, 215);
        }
      }

      // 同意协议
      .agreement {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 18px;

        input {
          margin-right: 3px;
        }

        span {
          color: #999999;
          font-size: 14px;
        }

        a {
          text-decoration: none;
          color: #ff7b1a;
          font-size: 14px;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }

    .qrCodeLogin {
      width: 310px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-top: 25px;

      #qrCodeBox {
        height: 380px;

        img {
          width: 200px;
        }


      }

      .loginTip {
        margin: 20px 0;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top:-50px;;
        background-color: #fff;
        width:200px;
        height:50px;

        span {
          font-size: 14px;
          color: #333333;
          margin-left: 6px;
        }
      }
    }
  }
}
</style>