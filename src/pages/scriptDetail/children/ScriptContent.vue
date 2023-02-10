<template>
  <!-- 剧本信息内容 -->
  <div class="scriptContent" v-if="bookChapterMsg">
    <!-- 剧本简介标题 -->
    <div class="title">剧本简介</div>
    <!-- 剧本简介 -->
    <div class="desc">
      {{ bookChapterMsg.intro }}
    </div>
    <!-- 剧本列表 -->
    <div class="scriptList">
      <div class="scriptListTitle">
        <div class="listTitle">剧本列表</div>
        <div class="scriptCount">
          <div class="isEnd">已完结</div>
          <div class="countNumber">
            共 {{ bookChapterMsg.chapter_count }} 集
          </div>
        </div>
      </div>

      <!-- 分集范围tab -->
      <div class="episodeRang" ref="episodeRang" @click="rangTabClick">
        <!-- 三角 -->
        <div
          class="triangle"
          @click="tabShowHide"
          :class="{ rotate: isRangeShow }"
        ></div>
        <!-- 分级range -->
        <div
          class="rangTab"
          v-for="(item, index) in episodeRange"
          :key="index"
          :data-index="index"
          :class="{ activeTab: activeTabIndex == index }"
        >
          {{ item.start }} - {{ item.end }}
        </div>
      </div>

      <div class="listButton" v-if="curPageChapterList">
        <button
          v-for="(item, index) in curPageChapterList"
          :key="index"
          :class="{ activeButton: activeButtonIndex == index }"
          @click="scriptChoice(index, item.chapter_id, item.chapter_order)"
        >
          {{ item.chapter_order }}
        </button>
      </div>
    </div>

    <!-- 章节内容 -->
    <div class="chapterContent">
      <h3>第{{ currentChapter }}集</h3>
      <p
        style="white-space: pre-wrap"
        v-if="chapterContent"
        v-html="chapterContent"
      ></p>
      <div class="mask" v-if="is_vip_chapter">
        <p>本集为付费剧集</p>
        <span>需购买剧本继续观看</span>
        <button>购买剧本</button>
      </div>
    </div>
  </div>
</template>

<script>
import { getScriptList, chapterDetail } from "@/requests/scriptDetail";
export default {
  props: ["bookChapterMsg"],
  data() {
    return {
      activeButtonIndex: 0,
      isRangeShow: false,
      activeTabIndex: 0,
      book_id: null,
      currentChapter: 1,
      chapterContent: null,
      curPageChapterList: [],
      first_chapter_id: null,
      is_vip_chapter: false,
    };
  },

  methods: {
    scriptChoice(index, id, chapter_order) {
      this.activeButtonIndex = Number(index);
      this.currentChapter = chapter_order;
      // this.currentChapter = this.activeTabIndex * 10 + index + 1;
      chapterDetail(this.bookChapterMsg.id, id).then((res) => {
        // console.log(res);
        if (res.data.code == 0) {
          this.is_vip_chapter = false;
          this.chapterContent = res.data.chapterInfo.content;
        } else if (res.data.code == 1001) {
          this.chapterContent = null;
          this.is_vip_chapter = true;
        } else if (res.data.msg == "token错误") {
          this.is_vip_chapter = false;
          // alert("阅读后续内容,请登录");
          this.$message({
            showClose: true,
            duration: 2000,
            type: "warning",
            message: "阅读后续内容,请登录",
          });
        }
      });
    },
    // 点击控制rang栏展开隐藏
    tabShowHide() {
      this.isRangeShow = !this.isRangeShow;
      let episodeRang = this.$refs.episodeRang;
      if (this.isRangeShow) {
        episodeRang.style.height = "auto";
      } else {
        episodeRang.style.height = "20px";
      }
    },

    // 选择的rangetab
    rangTabClick(e) {
      // console.log(e.target.dataset.index);
      this.activeTabIndex = Number(e.target.dataset.index);
      // console.log(this.activeTabIndex);
      getScriptList(this.book_id, this.activeTabIndex + 1).then((res) => {
        // console.log(res, "点击分集范围获取剧集列表");
        this.curPageChapterList = res.data.chapterList.data;
      });
    },
  },

  mounted() {
    setTimeout(() => {
      this.book_id = this.bookChapterMsg.id;

      // 挂载完就获取一下书籍的章节列表
      getScriptList(this.book_id).then(
        (res) => {
          // console.log(res, "挂载完自动获取第一页章节列表");
          this.curPageChapterList = res.data.chapterList.data;
          // 因为挂载的时候要获取第一章的内容, 根据chapter_id获取, 但是这个id不再是1234这个顺序而是有固定的id, 这里存一个第一章节的id, 方便后面挂载时候获取
          this.first_chapter_id = this.curPageChapterList[0].chapter_id;

          chapterDetail(this.bookChapterMsg.id, this.first_chapter_id).then(
            (res) => {
              // console.log(res, "获取章节内容");
              this.chapterContent = res.data.chapterInfo.content;
            }
          );
        },
        (err) => {
          console.log("错误", err);
        }
      );
    }, 700);
  },

  computed: {
    episodeRange() {
      // 创建数组接受剧集范围
      let rangeArr = [];
      // 拿到总集数
      let totalCount = this.bookChapterMsg.chapter_count;
      // 确定满10集的剧集范围
      let tenScriptPage = Math.ceil(totalCount / 10);
      // 计算一下, 是不是有没有余数, 有余数就要加上额外的一个范围页
      let surplusPage = totalCount % 10 == 0 ? 0 : 1;
      tenScriptPage += surplusPage;
      // 总共多少个剧集范围tab页
      // let finalScriptPage = tenScriptPage + surplusPage
      for (let i = 1; i < tenScriptPage; i++) {
        rangeArr.push({ start: i * 10 - 9, end: i * 10 });
      }
      /*       if (surplusPage) {
              // 如果有多余页, 就要最后加上
              let end = totalCount;
              let start = totalCount - (totalCount - tenScriptPage * 10) + 1;
              if (start == end) {
      
              }
              rangeArr.push({ start, end })
            } */
      return rangeArr;
    },
    get_id() {
      this.book_id = this.bookChapterMsg.id;
    },
  },
};
</script>

<style lang="less" scoped>
@import url("@/assets/font.less");

.scriptContent {
  background-color: white;
  width: 888px;
  padding: 24px;
  box-sizing: border-box;

  .title {
    padding-bottom: 15px;
    color: #333;
    border-bottom: 1px solid #e5e5e5;
  }

  .desc {
    // padding: 0 12px;
    color: #666666;
    margin-top: 16px;
  }

  .scriptList {
    margin-top: 24px;
    border-bottom: 1px solid #e5e5e5;

    .scriptListTitle {
      display: flex;

      .listTitle {
        color: #333;
        margin-right: 25px;
      }

      .scriptCount {
        display: flex;
        color: #666;

        .isEnd,
        .countNumber {
          padding: 0 8px;
        }

        .isEnd {
          position: relative;

          &::after {
            content: "";
            position: absolute;
            width: 1px;
            height: 16px;
            background-color: #666;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
          }
        }
      }
    }

    .episodeRang {
      position: relative;
      display: grid;
      height: 20px;
      margin: 16px 0;
      overflow: hidden;
      grid-template-columns: repeat(10, auto);
      grid-template-rows: auto;
      z-index: 99;
      border-radius: 5px;
      padding: 3px;
      box-sizing: border-box;

      .triangle {
        position: absolute;
        top: 3px;
        right: 0;
        margin-left: 8px;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        // border-top: 10px solid #333;
        border-bottom: 12px solid #333;
        border-radius: 2px;
        cursor: pointer;
        transition: all 0.3s;
      }

      .rotate {
        transform: rotate(180deg);
      }

      .rangTab {
        flex: 1 0 10%;
        color: #999;
        font-size: 14px;
        font-family: robota;
        margin-bottom: 10px;
        cursor: pointer;
      }

      .activeTab {
        color: #ff801f;
      }
    }

    .listButton {
      margin: 22px 0 30px;

      button {
        font-family: robota;
        color: #333;
        background-color: #f4f4f4;
        padding: 6px 24px;
        border-radius: 50px;
        margin-right: 16px;
        cursor: pointer;
      }

      .activeButton {
        background-color: #ff801f;
        color: white;
      }
    }
  }

  .chapterContent {
    padding: 12px;

    h3 {
      padding: 12px;
    }

    p {
      color: #666666;
      font-size: 14px;
      line-height: 28px;
    }

    .mask {
      width: 100%;
      height: 500px;
      // background-color: pink;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      p {
        color: #666666;
        font-size: 18px;
      }
      span {
        color: #999999;
        font-size: 14px;
        margin-top: 7px;
      }
      button {
        width: 109px;
        height: 36px;
        border-radius: 18px;
        color: white;
        font-size: 14px;
        margin-top: 23px;
        background: linear-gradient(108deg, #ff5533 0%, #ff801f 102%);
        cursor: pointer;
      }
    }
  }
}
</style>