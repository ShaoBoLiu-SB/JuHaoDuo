<template>
  <div class="worksAdmain">
    <div class="scriptTitleBar">
      <div class="leftTitle">
        共创建<span class="countNumber"> {{ scriptNumber }} </span>部剧本
      </div>
      <div class="rightFn">
        <div class="lookAll" @click="$router.push('/author/createnewscript')">
          创建新剧本
          <img src="@/assets/icons/createNewScript.png" alt="" />
        </div>
      </div>
    </div>

    <div class="scriptContainer">
      <div class="script" v-for="(item, index) in passedScript" :key="index">
        <div class="leftScript">
          <div class="imgBox">
            <img :src="item.thumb" alt="" />
            <!-- <div class="altImg">修改封面</div> -->
          </div>
          <div class="textBox">
            <div class="row">
              <div class="scriptName">《{{ item.book_name }}》</div>
              <div class="isPass">{{ item.status_name }}</div>
            </div>
            <div class="tag">{{ item.sort_name }}</div>
            <div class="newestScript">
              最新剧集: 第{{ item.chapter_count }}集
            </div>
            <div class="updateTime">更新时间: {{ item.update_time }}</div>
          </div>
        </div>
        <div class="rightFn">
          <div class="episodeBox">
            <div class="episode">
              <span>{{ item.chapter_count }}</span> 集
            </div>
            <button @click="chapterAdmain(item.id)">剧集管理</button>
          </div>
          <div class="wordCount">
            <div class="count">
              <span>{{ item.word_count }}</span> 字
            </div>
            <button @click="createNewScript(item.id)">+ 新剧集</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页器 -->
    <div class="pageControl" v-if="totalPage">
      <div class="arrowBox" @click="leftArrow" :class="{ forbitArrow: leftForbit }">
        <img src="@/assets/icons/leftArrow.png" alt="" />
      </div>
      {{ curPage }} / {{ totalPage }}
      <div class="arrowBox" @click="rightArrow" :class="{ forbitArrow: rightForbit }">
        <img src="@/assets/icons/rightArrow.png" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
import { myScriptPassed } from "@/requests/author";
export default {
  data() {
    return {
      passedScript: [],
      scriptNumber: 0,
      curPage: 1,
      totalPage: null,
      leftForbit: true,
      rightForbit: false,
    };
  },
  mounted() {
    this.getMyScript();
  },
  methods: {
    // 把请求自己创建的剧本封装起来
    getMyScript(page) {
      myScriptPassed(page).then((res) => {
        // console.log(res);
        if (res.status == 200) {
          this.passedScript = res.data.BookList.data;
          // console.log(this.passedScript);
          this.scriptNumber = res.data.BookList.total;
          this.totalPage = res.data.BookList.last_page;
        }
      });
    },

    // 点击剧集管理,进入管理页面
    chapterAdmain(id) {
      localStorage.setItem('curBookId', id)
      this.$router.push({
        name: "chapteradmain",
        params: { id: id },
      });
    },

    // 点击新剧集,直接跳到编辑器页面
    createNewScript(id) {
      localStorage.setItem('curBookId', id)
      // console.log('当前剧本id:', id);
      // console.log("从作品管理跳转到编辑器,剧本id:", id);
      // 清空vuex里面之前存的章节数据
      this.$store.commit("sendToEditor", {});
      localStorage.setItem("createStatus", false);
      this.$router.push({
        name: "editor",
        params: {
          isCreate: true,
          id: id,
        },
      });
    },

    // 点击左右箭头
    leftArrow() {
      if (this.curPage <= 1) {
        this.leftForbit = true;
        return;
      } else {
        this.curPage -= 1;
        this.rightForbit = false;
        this.leftForbit = false;
        this.getMyScript(this.curPage);
      }
    },
    rightArrow() {
      if (this.curPage >= this.totalPage) {
        this.rightForbit = true;
        return;
      } else {
        this.leftForbit = false;
        this.rightForbit = false;
        this.curPage += 1;
        this.getMyScript(this.curPage);
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import url(@/assets/font.less);

.worksAdmain {
  width: 1080px;

  .scriptContainer {
    margin-top: 24px;

    .script {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #d8d8d8;
      padding: 9px;

      .leftScript {
        display: flex;

        .imgBox {
          width: 102px;
          height: 136px;
          border-radius: 4px;
          position: relative;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 1px solid rgb(234, 234, 234);

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
          display: flex;
          flex-direction: column;
          justify-content: center;

          .row {
            display: flex;
            align-items: center;
            transform: translateX(-8px);

            .scriptName {
              color: #333;
            }

            .isPass {
              padding: 2px 12px;
              vertical-align: middle;
              border-radius: 24px;
              text-align: center;
              color: white;
              background-color: #fa7e02;
              margin-left: 16px;
            }
          }

          .tag {
            display: inline-block;
            width: 36px;
            height: 18px;
            line-height: 18px;
            font-size: 12px;
            padding: 1px 6px;
            border-radius: 2px;
            background-color: #feecd9;
            text-align: center;
            vertical-align: middle;
            color: #f85700;
            margin: 8px 0 18px;
          }

          .newestScript,
          .updateTime {
            color: #9e9e9e;
            font-size: 14px;
          }

          .newestScript {
            margin-bottom: 8px;
          }
        }
      }

      .rightFn {
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;

        .episodeBox,
        .wordCount {
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: center;
          margin-right: 18px;
          color: #9e9e9e;

          span {
            color: #333;
          }

          button {
            padding: 5px 16px;
            border-radius: 100px;
            margin-top: 20px;
            color: #999;
            cursor: pointer;
          }
        }

        .wordCount {
          button {
            background-color: #fe7d1c;
            color: white;
          }
        }
      }
    }
  }

  .pageControl {
    margin-top: 20px;
    text-align: right;
    display: flex;
    align-items: center;
    user-select: none;

    .arrowBox {
      width: 32px;
      height: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #f6f6f6;
      border-radius: 200px;
      cursor: pointer;
    }

    .forbitArrow {
      background-color: transparent;
      cursor: not-allowed;
    }
  }
}

.scriptTitleBar {
  width: 1000px;
  padding-bottom: 12px;
  border-bottom: 1px solid #d8d8d8;
  display: flex;
  justify-content: space-between;

  .leftTitle {
    color: #333;
    font-size: 18px;
    font-weight: bold;

    .countNumber {
      font-family: robota;
    }
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
</style>