<template>
  <div class="calendar">
    <!-- 上方时间条 -->
    <div class="timeBox">
      <div class="timeShow">
        <div class="timeBar" @click="timeSelectShow = !timeSelectShow">
          {{ time.year }}年{{ time.month + 1 }}月
        </div>
        <div class="triangle" :class="{ rotate: timeSelectShow }"></div>
        <div class="timeSelect" v-show="timeSelectShow">
          <div class="yearBox">
            <img src="@/assets/icons/preYear.png" @click="preYear" />
            <span>{{ time.year }}年</span>
            <img src="@/assets/icons/nextYear.png" @click="nextYear" />
          </div>
          <div class="monthBox" @click="selectMonth">
            <div
              class="monthItem"
              v-for="item in 12"
              :key="item"
              :data-index="item"
              :class="{ activeMonth: item == activeMonth }"
            >
              {{ item }}月
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 日历星期栏 -->
    <div class="weekBar">
      <span v-for="item in weekDays" :key="item">{{ item }}</span>
    </div>
    <!-- 日历天 -->
    <div class="dateBox" v-if="!noData">
      <div
        class="spaceItem"
        v-for="(item, index) in getSpaceBoxNumber"
        :key="`_` + index"
      ></div>
      <div class="dayItem" v-for="item in calendarData" :key="item.day">
        <div class="dayBox" :class="{ activeDayItem: item.size }">
          {{ item.day }}
        </div>
        <div class="fontCount">{{ item.size }}</div>
      </div>
    </div>
    <div class="noData" v-else>无数据</div>
    <!--  签到打卡-->
    <div class="qiandao" @click="daka">
      <span></span>
      创作打卡
    </div>
  </div>
</template>

<script>
import { getYearMonthDay, getDate } from "@/utils/index";
import { createCalendar, qiandao } from "@/requests/author";
export default {
  props: {
    value: {
      type: Date,
      default: () => Date(),
    },
    day_info: {
      type: Object,
    },
  },
  data() {
    let { year, month } = getYearMonthDay(new Date());
    return {
      time: { year, month },
      weekDays: ["日", "一", "二", "三", "四", "五", "六"],
      timeSelectShow: false,
      activeMonth: month + 1,
      calendarData: null,
      noData: false,
    };
  },

  mounted() {
    // 挂载就调用请求
    this.getCalendarData();
  },

  methods: {
    // 选择月份并修改日历
    selectMonth(e) {
      if (e.target._prevClass == "monthItem") {
        this.activeMonth = e.target.dataset.index;
        let d = getDate(this.time.year, this.time.month, 1);
        d.setMonth(this.activeMonth - 1); //上面为了显示多加了1,这里减掉
        this.time = getYearMonthDay(d);

        // 切换了月份, 重新调用请求
        this.getCalendarData();
      }
    },
    preYear() {
      let d = getDate(this.time.year, this.time.month, 1);
      d.setFullYear(d.getFullYear() - 1);
      this.time = getYearMonthDay(d);
    },
    nextYear() {
      let d = getDate(this.time.year, this.time.month, 1);
      d.setFullYear(d.getFullYear() + 1);
      this.time = getYearMonthDay(d);
    },

    // 切换月份和年份要发送请求,不能放在mounted里面, mounted里面放一下
    async getCalendarData() {
      // console.log(this.time.month, "打印月份");
      // 一步一步来, 先月份+1得到正确数值
      let month = this.time.month + 1;
      month = month < 10 ? "0" + month : month;
      let result = await createCalendar(`${this.time.year}-${month}`);
      // console.log(result, "请求日历结果");
      // 初始化一个月写了多少天和字数
      let countDay = 0;
      let fontCount = 0;

      if (result.data.msg == "success") {
        this.calendarData = result.data.data;
        this.noData = false;

        // 计算出天数和字数然后从存到vuex里面
        this.calendarData.forEach((item) => {
          if (item.size) {
            countDay += 1;
            fontCount += item.size;
          }
        });
        this.$store.commit("changeCreateDay", { countDay, fontCount });
      } else if (result.data.msg == "时间格式有误") {
        this.noData = true;
        this.$store.commit("changeCreateDay", { countDay, fontCount });
      } else if (result.data.msg == "当前时间还未注册") {
        this.noData = true;
        this.$store.commit("changeCreateDay", { countDay, fontCount });
      }
    },

    // 签到打卡, 替换新的日历数据
    async daka() {
      let result = await qiandao();
      if (result.data.msg == "打卡成功") {
        this.calendarData = result.data.data;
        this.$message({
          message: '打卡成功',
          showClose: true,
          duration: 2000,
          type: "success",
        });
      }
      if (result.data.msg == "请勿重复打卡") {
        this.$message({
          message: "请勿重复打卡",
          showClose: true,
          duration: 2000,
          type: "warning",
        });
      }
    },
  },
  computed: {
    // 根据一号是周几,前面就空几个格子
    getSpaceBoxNumber() {
      if (this.calendarData) {
        let firstDay = this.calendarData[0].week;
        // console.log(firstDay);
        if (firstDay == "一") {
          return 1;
        }
        if (firstDay == "二") {
          return 2;
        }
        if (firstDay == "三") {
          return 3;
        }
        if (firstDay == "四") {
          return 4;
        }
        if (firstDay == "五") {
          return 5;
        }
        if (firstDay == "六") {
          return 6;
        }
        if (firstDay == "日") {
          return 0;
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.calendar {
  width: 500px;
}

.timeBox {
  position: relative;
  user-select: none;

  .timeBar {
    display: inline-block;
    cursor: pointer;
    margin-top: 20px;
  }

  .triangle {
    display: inline-block;
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

  .timeSelect {
    position: absolute;
    z-index: 9;
    top: 45px;
    left: 0;
    width: 240px;
    height: 186px;
    border-radius: 4px;
    box-shadow: 0px 2px 15px 0px rgba(0, 0, 0, 0.1);
    background-color: white;
    padding: 16px 20px 32px 20px;
    box-sizing: border-box;

    .yearBox {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: bold;
      padding: 0 20px;

      img {
        width: 12.5px;
        height: 11px;
        cursor: pointer;
      }
    }

    .monthBox {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      color: #666666;

      .monthItem {
        flex: 1 0 33%;
        text-align: center;
        margin: 6px 0;
        cursor: pointer;
      }

      .activeMonth {
        background-color: #fa7e02;
        color: white;
        border-radius: 100px;
      }
    }
  }
}

.weekBar {
  margin: 10px 0;
  display: flex;
  width: 500px;
  transform: translateX(-3px);

  span {
    flex: 1;
    display: inline-block;
    font-size: 14px;
    color: #333;
  }
}

.dateBox {
  display: flex;
  flex-wrap: wrap;
  transform: translateX(-30px);

  .spaceItem,
  .dayItem {
    // flex: 1 0 14.28%;
    height: 49px;
    width: 71px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 10px;
    cursor: pointer;

    .dayBox {
      width: 32px;
      height: 32px;
      color: #333333;
      text-align: center;
      line-height: 32px;
    }

    .fontCount {
      color: #999;
      font-size: 12px;
    }
  }

  .activeDayItem {
    background-color: #fa7e02;
    color: white !important;
    border-radius: 100px;
  }
}

.noData {
  width: 450px;
  height: 400px;
  text-align: center;
  line-height: 400px;
  font-weight: bold;
  font-size: 30px;
}

.qiandao {
  display: flex;
  align-items: center;
  margin-top: 10px;
  cursor: pointer;

  span {
    display: inline-block;
    width: 8px;
    height: 8px;
    background-color: #fa7e02;
    border-radius: 4px;
    margin-right: 8px;
  }

  color: #333;
}
</style>