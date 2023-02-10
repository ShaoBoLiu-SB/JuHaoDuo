<template>
  <div class="message">
    <div class="uselessBar">
      <div class="contentBox">
        <span>我的消息</span>
      </div>
    </div>

    <div class="contentArea">
      <div class="content">
        <div class="messageList">
          <div class="listItem" v-for="(item, index) in 8" :key="index" @click="chooseRead(index)"
            :class="{ activeItem: index == actMsgIndex }">
            <div class="leftAvatar">
              <img src="@/assets/icons/sysAvatar.png" alt="">
            </div>
            <div class="rightText">
              <div class="msgType">
                <span>系统消息{{ index }}</span>
                <div class="time">2022/08/04 21:25</div>
              </div>
              <div class="msgDesc">您解锁了作者专区</div>
              <div class="msgShortcut">恭喜您已成功解锁作者专区，首页右上角点击...</div>
            </div>
          </div>
        </div>
        <div class="messageBox">
          <div class="msgTypeBar">
            <div class="sysAvatar">
              <img src="@/assets/icons/sysAvatar.png" alt="">
            </div>
            <span class="msgType">系统消息</span>
          </div>
          <div class="msgContent">
            <div class="sendTime">时间：2022/08/04 21:25</div>
            您解锁了作者专区<br>
            恭喜您已成功解锁创作中心，剧好多首页上方点击&lt;作者专区&gt;即刻体验
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      actMsgIndex: 0,
    }
  },
  methods: {
    chooseRead(index) {
      this.actMsgIndex = index
    },

  },
  computed: {

  }
}
</script>

<style lang="less" scoped>
.message {
  background-color: #fafafa;

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

      img {
        width: 20px;
        margin-right: 10px;
      }
    }
  }

  .contentArea {
    width: 100%;
    height: 80vh;
    background-color: #fafafa;

    .content {
      width: 1200px;
      margin: 24px auto;
      display: flex;
      display: flex;

      .messageList {
        width: 435px;
        height: 684px;
        background-color: white;
        overflow-y: scroll;

        .listItem {
          display: flex;
          width: 100%;
          height: 136px;
          padding: 24px;
          box-sizing: border-box;
          border-bottom: 1px solid #f7f7f7;
          cursor: pointer;

          .leftAvatar {
            margin-right: 12px;
          }

          .rightText {
            display: flex;
            flex-direction: column;

            .msgType {
              display: flex;
              justify-content: space-between;
              align-items: center;
              color: #666;
              font-size: 18px;
              margin-bottom: 16px;

              .time {
                font-size: 16px;
              }
            }

            .msgDesc,
            .msgShortcut {
              color: #333;
              white-space: nowrap;
            }
          }
        }

        .activeItem {
          background-color: #fef5eb;
        }
      }

      .messageBox {
        width: 741px;
        height: 684px;
        overflow-y: auto;
        background-color: #fff;
        margin-left: 24px;

        .msgTypeBar {
          width: 100%;
          height: 80px;
          background-color: #fef5eb;
          display: flex;
          align-items: center;
          padding: 0 24px;
          font-size: 18px;
          color: #666;
          box-sizing: border-box;

          img {
            margin-right: 16px;
          }
        }

        .msgContent {
          padding: 24px;
          box-sizing: border-box;
          color: #333;

          .sendTime {
            color: #999;
            margin-bottom: 20px;
          }

        }
      }
    }

  }
}
</style>