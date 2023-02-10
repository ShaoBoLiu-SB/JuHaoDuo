<template>
  <div class="scriptDetail">
    <!-- 顶部的剧本信息概要 -->
    <brief-desc :scriptBriefDesc="scriptBriefDesc"></brief-desc>

    <!-- 下方的剧本内容啥的 -->
    <div class="scriptContentBox">
      <script-content :bookChapterMsg="scriptBriefDesc"></script-content>
      <connect-and-recommend
        :recommendScript="recommendScript"
      ></connect-and-recommend>
    </div>

    <!-- 收藏剧本 -->
    <!-- 和返回顶部一样, 这里也是不能定死 -->
    <div class="collectArea">
      <div
        class="collectScript"
        @mouseover="mouseoverFn"
        @mouseleave="mouseleaveFn"
        @click="collectFn"
      >
        <div class="hoverShow" v-show="!isCollect">
          <img src="@/assets/icons/collect.png" alt="" v-show="!isHover" />
          <img src="@/assets/icons/collectHover.png" alt="" v-show="isHover" />
        </div>
        <img src="@/assets/icons/collected.png" alt="" v-show="isCollect" />
      </div>
    </div>
    <!-- <div class="collectTip" v-show="isHover">点击收藏</div> -->
  </div>
</template>

<script>
import BriefDesc from "./children/BriefDesc.vue";
import ScriptContent from "./children/ScriptContent.vue";
import ConnectAndRecommend from "./children/ConnectAndRecommend.vue";

// 网络请求, 拿剧本详情简介的
import { reqBookDetail, collectBook } from "@/requests/scriptDetail";
import { computed } from "vue";
export default {
  data() {
    return {
      scriptBriefDesc: null,
      recommendScript: null,
      isHover: false,
    };
  },
  methods: {
    mouseoverFn() {
      this.isHover = true;
    },
    mouseleaveFn() {
      this.isHover = false;
    },
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
  },

  components: {
    BriefDesc,
    ScriptContent,
    ConnectAndRecommend,
  },

  computed: {
    isCollect() {
      return this.$store.state.script.isCollect;
    },
  },

  async mounted() {
    let token = localStorage.getItem("userToken");
    let result = await reqBookDetail(this.$route.query.book_id, token);
    console.log(result, "!");
    if (result.data.code == 0) {
      this.scriptBriefDesc = result.data.data.BookList;
      this.recommendScript = result.data.data.recommend;
    }

    // 点击进来, 其实还是要判断一下当前剧本有没有收藏,
    setTimeout(() => {
      if (this.scriptBriefDesc.is_bookshelf) {
        this.$store.commit("changeColectStatus", true);
      }
    }, 500);
  },
};
</script>
<style lang="less" scoped>
.scriptDetail {
  background-color: #fafafa;

  .scriptContentBox {
    width: 1200px;
    margin: 16px auto;
    display: flex;
    justify-content: space-between;
  }

  .collectArea {
    width: 1200px;
    position: fixed;
    bottom: 130px;
    left: 50%;
    transform: translateX(-50%);
  }

  .collectScript {
    cursor: pointer;
    position: absolute;
    right: -95px;
    bottom: 0px;
    width: 64px;
    height: 64px;
    line-height: 64px;
    background-color: white;
    border-radius: 4px;
    // box-shadow: 0 2px 32px 0 rgba(0, 0, 0, .1);

    img {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .collectTip {
    position: fixed;
    bottom: 145px;
    right: 175px;
    width: 72px;
    height: 28px;
    text-align: center;
    font-size: 14px;
    color: #333;
    line-height: 28px;
    box-shadow: 0 2px 32px 0 rgba(0, 0, 0, 0.1);

    &::before {
      content: "";
      width: 8px;
      height: 8px;
      transform: rotate(45deg);
      background-color: white;
      position: absolute;
      border-radius: 1px;
      left: -3px;
      top: 35%;
    }
  }
}
</style>