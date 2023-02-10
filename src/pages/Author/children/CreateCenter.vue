<template>
  <div class="createCenter">
    <div class="welecome">下午好，欢迎来到工作台~</div>

    <!-- 作者个人信息 -->
    <div class="messageSection">
      <div class="userMessage">
        <div class="authorBox">
          <img :src="avatar" alt="" v-if="avatar" class="avatar" />
          <img src="@/assets/imgs/avatar1.png" v-else class="avatar" />
          <div class="msgBox">
            <div class="name" v-if="author_name">{{ author_name }}</div>
            <div class="authorId">作者id: {{ userId }}</div>
          </div>
        </div>
        <div class="worksCount">
          作品总数
          <span>{{ scriptNumber }}</span>
        </div>
      </div>
      <div class="moneyMessage">
        <div class="balance">
          <div class="moneyTitle">账户余额</div>
          <span>{{ 0 }}</span>
        </div>
        <div class="payment">
          <div class="moneyTitle">已结算稿费</div>
          <span>{{ 0 }}</span>
        </div>
      </div>
    </div>

    <!-- 剧本标题栏 -->
    <div class="scriptTitleBar">
      <div class="leftTitle">剧本</div>
      <div class="rightFn">
        <div
          class="createNewScript"
          @click="$router.push('/author/createnewscript')"
        >
          创建新剧本
          <img src="@/assets/icons/createNewScript.png" alt="" />
        </div>
      </div>
    </div>

    <!-- 剧本列表内容 -->
    <div class="scriptBox" v-if="passedScript">
      <div class="leftScript">
        <div class="imgBox">
          <img :src="passedScript.thumb" alt="" />
          <!-- <div class="altImg">修改封面</div> -->
        </div>
        <div class="textBox">
          <div class="scriptName">
            {{ passedScript.book_name }}
            <div class="isPass">{{ passedScript.status_name }}</div>
          </div>
          <div class="tag">{{ passedScript.sort_name }}</div>
          <div class="newest">
            最新剧集: 第{{ passedScript.chapter_count }}集
          </div>
          <div class="updateTime">更新时间: {{ passedScript.update_time }}</div>
        </div>
      </div>
      <div class="rightFnBtn">
        <div class="scriptAdmain">
          <div class="episode">
            {{ passedScript.chapter_count }} <span>集</span>
          </div>
          <button @click="chapterControl">剧集管理</button>
        </div>
        <div class="newScript">
          <div class="fontCount">
            {{ passedScript.word_count }} <span>字</span>
          </div>
          <button @click="createNewScript">+ 新剧集</button>
        </div>
      </div>
    </div>

    <!-- 没有剧本的缺省 -->
    <div class="noScirpt" v-if="!passedScript">
      <div class="noScriptBox">暂无剧本</div>
      <div class="textBox">
        <p>您目前还没有作品</p>
        <span>快去创建第一个作品吧</span>
        <button @click="$router.push('/author/createnewscript')">
          创建剧本
        </button>
      </div>
    </div>

    <div class="createCalender">
      <div class="scriptTitleBar">
        <div class="leftTitle">创作日历</div>
        <div class="rightFn">
          <div class="lookAll">
            规则
            <img src="@/assets/icons/attention.png" alt="" />
          </div>
        </div>
      </div>

      <div class="calenderSection">
        <!-- 日历 -->
        <!-- <my-calendar v-model="now"></my-calendar> -->
        <!-- <create-calendar v-model="now"></create-calendar> -->
        <calendar v-model="now" :day_info="writerInfo"></calendar>
        <div class="rightCount">
          <div class="caculateDays">
            <span>累计创作</span>
            <span>{{ createData.createDay }}天</span>
          </div>
          <div class="caculateWords">
            <span>累计字数</span>
            <span>{{ createData.fontCount }}字</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createCenter, myScriptPassed, writeScript } from "@/requests/author";
import Calendar from "@/components/Calendar/Calendar.vue";
export default {
  data() {
    return {
      now: new Date(),
      userInfo: null,
      writerInfo: null,
      passedScript: {}, //这里是审核通过的剧本
      scriptNumber: 0,
      author_name: null,
    };
  },
  components: {
    Calendar,
  },

  mounted() {
    createCenter().then(
      (res) => {
        // console.log(res, "创作中心请求");
        // 判断一下有没有注册成为作者
        if (res.data.code == -5) {
          // 没有就跳转到注册页
          this.$router.push("/beauthor");
          return;
        } else if (res.data.msg == "该作者正在审核中") {
          // 在审核就跳到提示审核页
          this.$router.push("/audit");
          return;
        }
        this.userInfo = res.data.data.userinfo;
        this.writerInfo = res.data.data.writerinfo;
        localStorage.setItem("author_name", this.userInfo.author_name);
        this.author_name = this.userInfo.author_name;
      },
      (err) => {
        console.log(err);
      }
    );

    // 调用请求, 展示我的剧本
    myScriptPassed().then(
      (res) => {
        // console.log(res, "!");
        if (res.status == 200) {
          this.passedScript = res.data.BookList.data[0];
          this.scriptNumber = res.data.BookList.total;
        }
      },
      (err) => {
        console.log("错误!", err);
      }
    );
  },

  methods: {
    // 点击编辑, 去编辑器中修改.
    async writeScript(id) {
      let result = await writeScript(id);
      if (result.data.code == 0) {
        // console.log(result.data.data, "?");
        this.$store.commit("sendToEditor", result.data.data);
        // this.$router.push('/editor')
      }
    },

    // 点击新剧集,创建新剧集
    createNewScript() {
      // 清空vuex里面之前存的章节数据
      localStorage.setItem("curBookId", this.passedScript.id);
      this.$store.commit("sendToEditor", {});
      localStorage.setItem("createStatus", false);
      this.$router.push({
        name: "editor",
        params: {
          isCreate: true,
        },
      });
    },

    // 点击剧集管理, 查看剧集
    chapterControl() {
      localStorage.setItem("curBookId", this.passedScript.id);
      this.$router.push({
        name: "chapteradmain",
        params: { id: this.passedScript.id },
      });
      // console.log(this.passedScript.id);
    },
  },

  computed: {
    avatar() {
      return localStorage.getItem("avatarUrl");
    },

    userId() {
      return localStorage.getItem("uid");
    },

    // 创作记录数据(天,字数)
    createData() {
      let createDay = this.$store.state.createCenter.createDay;
      let fontCount = this.$store.state.createCenter.fontCount;
      return { createDay, fontCount };
    },
  },
};
</script>

<style lang="less" scoped>
.createCenter {
  .welecome {
    color: #333333;
    font-size: 18px;
  }

  .messageSection {
    display: flex;
    height: 84px;
    justify-content: space-between;
    margin: 35px 0 43px;

    .userMessage {
      width: 660px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .authorBox {
        display: flex;
        align-items: center;

        .avatar {
          width: 80px;
          height: 80px;
          border-radius: 40px;
        }

        .msgBox {
          margin-left: 16px;

          .name {
            color: #333;
            font-size: 18px;
            margin-bottom: 10px;
          }

          .authorId {
            margin-top: 10px;
            color: #999999;
            font-size: 18px;
          }
        }
      }

      .worksCount {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-right: 90px;
        font-size: 18px;
        color: #999;

        span {
          color: #333;
        }
      }
    }

    .moneyMessage {
      width: 340px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;

      &::before {
        content: "";
        position: absolute;
        left: 0;
        width: 1px;
        height: 84px;
        background-color: #d8d8d8;
      }

      .balance {
        margin-left: 100px;
      }

      .balance,
      .payment {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 18px;

        .moneyTitle {
          color: #999999;
        }

        span {
          color: #333;
        }
      }
    }
  }

  .scriptTitleBar {
    width: 1000px;
    margin-top: 48px;
    padding-bottom: 12px;
    border-bottom: 1px solid #d8d8d8;
    display: flex;
    justify-content: space-between;

    .leftTitle {
      color: #333;
      font-size: 18px;
    }

    .rightFn {
      display: flex;
      align-items: center;

      .createNewScript,
      .lookAll {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #9e9e9e;
        cursor: pointer;

        img {
          margin-left: 8px;
        }
      }

      .lookAll {
        margin-left: 24px;
      }
    }
  }

  .scriptBox {
    margin-top: 24px;
    display: flex;
    justify-content: space-between;

    .leftScript {
      display: flex;
      align-items: center;

      .imgBox {
        width: 102px;
        height: 136px;
        border-radius: 4px;
        position: relative;
        overflow: hidden;
        display: flex;
        justify-content: center;

        img {
          height: 100%;
        }

        .altImg {
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 24px;
          font-size: 14px;
          text-align: center;
          line-height: 24px;
          color: white;
          background-color: #0000007f;
          cursor: pointer;
        }
      }

      .textBox {
        margin-left: 16px;
        color: #9e9e9e;
        font-size: 15px;

        .scriptName {
          color: #333;
          display: flex;
          // transform: translateX(-7px);

          .isPass {
            width: 80px;
            height: 24px;
            border-radius: 20px;
            background-color: #fa7e02;
            color: white;
            text-align: center;
            line-height: 24px;
            font-size: 14px;
            margin-left: 6px;
          }
        }

        .tag {
          display: inline-block;
          padding: 1px 6px;
          font-size: 12px;
          box-sizing: border-box;
          background-color: #feecd9;
          color: #f85700;
          margin: 6px 0 16px;
        }

        .newest {
          margin-bottom: 8px;
        }
      }
    }

    .rightFnBtn {
      display: flex;
      align-items: center;

      .newScript,
      .scriptAdmain {
        margin-left: 18px;
        display: flex;
        flex-direction: column;
        align-items: center;

        .episode,
        .fontCount {
          color: #333;
          font-size: 18px;
          font-weight: bold;

          span {
            color: #9e9e9e;
          }
        }

        button {
          width: 88px;
          height: 32px;
          border-radius: 50px;
          font-size: 14px;
          cursor: pointer;
          margin-top: 20px;
        }
      }

      .newScript {
        button {
          background-color: #fe7d1c;
          color: white;
        }
      }

      .scriptAdmain {
        button {
          color: #999999;
          background-color: #f6f6f6;
        }
      }
    }
  }

  .noScirpt {
    margin-top: 24px;
    display: flex;
    .noScriptBox {
      width: 102px;
      height: 136px;
      background-color: #e5e5e5;
      text-align: center;
      line-height: 136px;
      border-radius: 4px;
      font-size: 14px;
      color: #9e9e9e;
    }
    .textBox {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-left: 15px;
      p {
        font-size: 16px;
        color: #333333;
      }
      span {
        color: #9e9e9e;
        font-size: 14px;
        margin: 8px 0 35px;
      }
      button {
        width: 88px;
        height: 32px;
        border-radius: 30px;
        color: white;
        font-size: 14px;
        background-color: #fe7d1c;
        cursor: pointer;
      }
    }
  }

  .calenderSection {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 50px;

    .rightCount {
      width: 400px;
      display: flex;
      justify-content: space-between;

      .caculateDays,
      .caculateWords {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        span {
          margin: 4px 0;
          color: #999;
          font-size: 18px;

          &:last-child {
            color: #333;
            font-size: 24px;
          }
        }
      }
    }
  }
}
</style>