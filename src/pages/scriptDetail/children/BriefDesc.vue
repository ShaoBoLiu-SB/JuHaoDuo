<template>
  <!-- 上方banner信息栏 -->

  <div class="briefDesc" v-if="scriptBriefDesc">
    <div class="content">
      <!-- 当前的位置导航 -->
      <div class="location">位置: <a @click="$router.push('/script')">剧本</a> / <a>剧本名称</a></div>

      <!-- 剧本信息和作者 -->
      <div class="scriptDesc">
        <div class="scriptImgBox">
          <img :src="scriptBriefDesc.thumb" alt="" />
        </div>

        <div class="leftDesc">
          <div class="scriptMessages">
            <!-- 剧本名字和是否完结标签 -->
            <div class="scriptNameAndEndTag">
              <div class="scriptName">
                剧名: 《{{ scriptBriefDesc.book_name }}》
              </div>
              <div class="endTag">已完结</div>
            </div>
            <div class="latestUpdatTime">
              最近更新: {{ scriptBriefDesc.update_time }}
            </div>
          </div>

          <!-- 剧本标签 收藏数和剧本字数 -->
          <div class="tagsAndScriptData">
            <!-- <div class="tag" v-for="(item, index) in tags" :key="index">{{ item }}</div> -->
            <div class="tag">{{ scriptBriefDesc.sort_name }}</div>
            <div class="scriptFontNumber">
              {{ (scriptBriefDesc.word_count / 10000).toFixed(1) }}万字
            </div>
            <div class="collectNumber">
              {{ scriptBriefDesc.chapter_count }}人收藏
            </div>
          </div>
          <!-- <div class="desc">剧本说明剧本说明剧本说明剧本说明剧本说明剧本说明剧本说明剧本说明</div> -->
          <div class="desc">{{ scriptBriefDesc.intro.trim() }}</div>
          <!-- 价格盒子 -->
          <div class="priceBox">
            <div class="price">
              价格: <b>{{ scriptBriefDesc.price }}</b>
            </div>
            <div class="tip">
              <img src="@/assets/icons/tip.png" alt="" />
              <span>可联系客服商讨价格</span>
            </div>
          </div>
          <div class="buttons">
            <div class="leftBtns">
              <div class="buyButton" @click="buyNow" v-if="!isbuy">立即购买</div>
              <div class="buyButton hasBuy" v-else>已购买!</div>
              <!-- <div class="consultButton">联系客服</div> -->
            </div>
            <div class="collectButton" @click="collectFn">
              <img
                src="@/assets/icons/star.png"
                v-if="!isCollect"
                class="collectIcon"
              />
              <img
                src="@/assets/icons/starfull.png"
                v-if="isCollect"
                class="collectIcon"
              />
              <span>收藏</span>
            </div>
          </div>
        </div>
        <!-- 右边的作者区域 -->
        <div class="rightAuthor">
          <div class="avataBox"></div>
          <div class="authorName">
            <div class="authorTag">作者</div>
            <span class="name"> {{ scriptBriefDesc.author }} </span>
          </div>
          <div class="twoBox">
            <div class="scriptNumber">
              <span>作品数</span>
              <span>2</span>
            </div>
            <div class="scriptNumber">
              <span>作品数</span>
              <span>2</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="qrCodePayBox" v-if="showqrcodePay">
      <!-- 二维码支付盒子 -->
      <div class="imgBox">
        <!-- 关闭支付页面的x号 -->
        <img
          src="@/assets/icons/close.png"
          class="close"
          @click="showqrcodePay = false"
        />

        <!-- 这是支付二维码和支付提示 -->
        <div class="qrcodeAndTip" v-if="payState == 0">
          <div class="qrcodeBox">
            <img :src="base64qrcode" class="qrCode" />
          </div>
          <div class="wechatPayTip">
            <img src="@/assets/icons/wechat.png" alt="" />
            <span>请使用微信扫码支付</span>
          </div>
        </div>

        <!-- 支付超时, 提示刷新 -->
        <p v-if="payState == 2">
          支付超时<a @click="buyNow" class="refresh">点击</a>刷新
        </p>

        <!-- 支付成功, 提示信息 -->
        <div class="paySuccess" v-if="payState == 1">
          <img src="@/assets/icons/greenSuccess.png" alt="" />
          <p>支付成功</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { collectBook } from "@/requests/scriptDetail";
import { buyBook, buyState } from "@/requests/buy";
export default {
  props: ["scriptBriefDesc"],
  data() {
    return {
      tags: ["家庭", "搞笑"],
      tradNum: null, //从网络请求拿到的交易单号
      base64qrcode: null, //从网络请求拿到的二维码
      showqrcodePay: false, //决定显不显示 支付二维码盒子
      payState: 0, //决定显示二维码 / 超时 /支付成功的变量  0:支付中(显示二维码) 1:支付成功(显示绿色对勾) 2:支付超时(显示支付超时)
    };
  },
  methods: {
    // 点击收藏剧本
    collectFn() {
      // 点击登录按钮
      let userToken = localStorage.getItem("userToken");
      // 先判断登录没有, 没有就提示登录然后return
      if (!userToken) {
        this.$message({
          showClose: true,
          duration: 2000,
          type: "warning",
          message: "请先登录",
        });
        return;
      }
      // 登录就发送请求, 收藏
      collectBook(this.$route.query.book_id, userToken).then((res) => {
        if (res.data.msg == "success") {
          this.$store.commit("changeColectStatus", !this.isCollect);
        }
      });
    },

    // 购买剧本请求
    buyNow() {
      let token = localStorage.getItem("userToken");
      if (token) {
        // 有token就发送请求获取二维码及支付单号
        buyBook(this.scriptBriefDesc.price, this.$route.query.book_id).then(
          (res) => {
            if (res.data.msg == "success") {
              // 如果请求成功, 保存下支付单号和付款二维码
              this.tradNum = res.data.out_trade_no;
              this.base64qrcode = res.data.qrcode;
              // 然后显示这个二维码支付盒子
              this.showqrcodePay = true;
            }
          },
          (err) => {
            console.log(err, "错误!");
          }
        );
      } else {
        // 没登录, 就不允许发这个请求, 提示先登录
        this.$message({
          showClose: true,
          duration: 2000,
          type: "warning",
          message: "请先登录",
        });
      }
    },
  },
  mounted() {
    // 判断当前当前书籍是不是被收藏过了, 挂载的时候, 就显示收藏状态
    setTimeout(() => {
      if (this.scriptBriefDesc.is_bookshelf) {
        this.$store.commit("changeColectStatus", true);
      }
    }, 500);
  },
  computed: {
    // 从vuex里面拿书籍的收藏状态
    isCollect() {
      return this.$store.state.script.isCollect;
    },

    isbuy() {
      return this.scriptBriefDesc.is_sale;
    },
  },

  watch: {
    base64qrcode() {
      // 判断一下, 只有当二维码成功获取, 并且支付盒子展示的时候才会执行网络请求
      if (this.base64qrcode && this.showqrcodePay) {
        // 判断支付状态, 每两秒发一次请求, 请求超时或支付成功都要清除掉定时器
        let reqTimer = setInterval(() => {
          buyState(this.tradNum).then(
            (res) => {
              // console.log(res);
              if (res.data.msg == "支付超时") {
                // 清空支付参数与二维码
                this.tradNum = null;
                this.base64qrcode = null;
                this.payState = 2; //把前端支付状态变成超时!
                // 然后清除定时器
                clearInterval(reqTimer);
              } else if (res.data.msg == "支付成功") {
                // 支付成功也要清除定时器
                clearInterval(reqTimer);
                this.payState = 1; //支付成功把前端支付状态变成成功!
                setTimeout(() => {
                  location.reload();
                }, 2000);
              }
            },
            (err) => {
              console.log(err, "错误!");
            }
          );
        }, 2000);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.briefDesc {
  width: 100%;
  height: 279px;
  background-color: white;
  padding-block: 26px;

  .content {
    width: 1200px;
    margin: 0 auto;

    // 当前位置导航
    .location {
      padding-top: 20px;
      font-size: 12px;
      color: #333;

      a {
        cursor: pointer;

        &:hover {
          color: #fa7e02;
          text-decoration: underline;
        }
      }
    }

    // 剧本信息和作者还有剧本图片
    .scriptDesc {
      margin-top: 21px;
      display: flex;

      .scriptImgBox {
        width: 148px;
        height: 215px;
        border-radius: 8px;
        // background-color: cadetblue;
        margin-right: 16px;
        overflow: hidden;
        display: flex;
        justify-content: center;

        img {
          // width:100%;
          height: 100%;
        }
      }

      .leftDesc {
        width: 730px;

        .scriptMessages {
          display: flex;
          justify-content: space-between;
          width: 707px;

          .scriptNameAndEndTag {
            display: flex;
            align-items: center;

            .scriptName {
              font-size: 20px;
              font-weight: bold;
              color: #333;
            }

            .endTag {
              padding: 2px 8px;
              background-color: #ffecd9;
              color: #fa7e02;
              text-align: center;
              border-radius: 4px;
              font-weight: 500;
            }
          }

          .latestUpdatTime {
            font-size: 14px;
            line-height: 30px;
            color: #333333;
          }
        }

        .tagsAndScriptData {
          display: flex;
          align-items: center;
          margin-top: 8px;

          .tag {
            padding: 2px 8px;
            border-radius: 20px;
            background-color: #f4f4f4;
            color: #666666;
            font-size: 14px;
            text-align: center;
            line-height: 24px;
            margin-right: 8px;
          }

          .tag {
            border: 1px solid white;
          }

          .scriptFontNumber,
          .collectNumber {
            font-size: 14px;
            color: #666666;
            padding: 0 12px;
            height: 20px;
            line-height: 20px;
          }

          .collectNumber {
            position: relative;

            &::before {
              content: "";
              width: 1px;
              height: 16px;
              background-color: #dbdbdb;
              position: absolute;
              left: 0;
              top: 50%;
              transform: translateY(-50%);
            }
          }
        }

        .desc {
          font-size: 14px;
          color: #666666;
          margin-top: 10px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          width: 707px;
        }

        .priceBox {
          width: 707px;
          height: 56px;
          border-radius: 4px;
          background-color: #f4f4f4;
          margin-top: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;

          .price {
            color: #333;
            font-size: 14px;
            margin-left: 12px;

            b {
              color: #fa7e02;
              font-weight: 700 !important;
            }
          }

          .tip {
            display: flex;
            align-items: center;
            margin-right: 12px;
            font-size: 14px;
            color: #666666;

            span {
              margin-left: 8px;
            }
          }
        }

        .buttons {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 707px;
          margin-top: 6px;

          .leftBtns {
            display: flex;
            align-items: flex-end;

            .buyButton {
              cursor: pointer;
              padding: 0 16px;
              height: 36px;
              border-radius: 40px;
              background-color: #fa7e02;
              color: white;
              line-height: 36px;
              text-align: center;
              margin-right: 12px;
            }

            .hasBuy {
              cursor: not-allowed;
            }

            .consultButton {
              cursor: pointer;
              padding: 0 16px;
              height: 32px;
              border-radius: 60px;
              border: 1px solid #fa7e02;
              text-align: center;
              color: #fa7e02;
              line-height: 32px;
            }
          }

          .collectButton {
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            box-sizing: border-box;
            width: 80px;
            height: 36px;
            background-color: white;
            border: 1px solid #fa7e02;
            margin-top: 8px;
            border-radius: 40px;
            color: #fa7e02;
            margin-left: 12px;

            img {
              margin-right: 3px;
              width: 15px;
              height: 15px;
            }

            span {
              margin-left: 3px;
            }
          }
        }
      }

      .rightAuthor {
        height: 215px;
        padding-left: 80px;
        border-left: 1px solid #e5e5e5;
        display: flex;
        flex-direction: column;
        align-items: center;

        .avataBox {
          width: 81px;
          height: 81px;
          border-radius: 52px;
          overflow: hidden;
          background-color: cadetblue;
        }

        .authorName {
          // width: 120px;
          font-size: 18px;
          font-weight: 700;
          color: #333;
          margin-top: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;

          .authorTag {
            width: 47px;
            height: 22px;
            text-align: center;
            line-height: 22px;
            color: white;
            background-color: #fa7e02;
            font-weight: normal;
            font-size: 12px;
            border-radius: 4px;
            margin-right: 5px;
          }
          name {
            margin-left: 5px;
          }
        }

        .twoBox {
          display: flex;
          margin-top: 13px;

          .scriptNumber {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 0 14px;
            color: #9e9e9e;

            span {
              white-space: nowrap;
            }
          }
        }
      }
    }
  }

  .qrCodePayBox {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(42, 42, 42, 0.421);
    z-index: 999;
    .imgBox {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 386px;
      height: 394px;
      border-radius: 8px;
      background-color: white;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .close {
        position: absolute;
        right: 5px;
        top: 5px;
        cursor: pointer;
      }
      .qrcodeBox {
        background-color: #eeeeee;
        width: 180px;
        height: 180px;
        border-radius: 6px;
        display: flex;
        justify-content: center;
        align-items: center;
        .qrCode {
          width: 200px;
          height: 200px;
        }
      }

      .wechatPayTip {
        display: flex;
        align-items: center;
        margin-top: 10px;

        img {
          margin-right: 5px;
        }
      }

      .refresh {
        color: #ff801f;
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }

      .paySuccess {
        display: flex;
        flex-direction: column;
        align-items: center;
        img {
          width: 100px;
          height: 100px;
          margin-bottom: 12px;
        }
      }
    }
  }
}
</style>