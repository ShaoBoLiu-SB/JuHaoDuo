<template>
  <div class="calendar" v-click-outside>
    日历组件
    <input type="text" :value="formatDate">
    <div v-show="isVisible">
      <div class="pannel-nav">
        <span @click="preYear">&lt;</span>
        <span @click="preMonth">&lt;&lt;</span>
        <span>{{ time.year }}年</span>
        <span>{{ (time.month + 1) }}月</span>
        <span @click="nextMonth">&gt;&gt;</span>
        <span @click="nextYear">&gt;</span>
      </div>

      <div class="pannel-content">
        <div class="weekDays">
          <span class="weekDay" v-for="k in 7" :key="`_` + k">{{ weekDays[k - 1] }}</span>
        </div>
        <div class="days">
          <!-- 顶部:星期几 -->
          <div v-for="i in 6" :key="i">
            <span v-for="j in 7" :key="j" class="cell" @click="chooseDay(visibleDays[(i - 1) * 7 + (j - 1)])" :class="[
            { notCurrentMonth: !isCurrentMonth(visibleDays[(i - 1) * 7 + (j - 1)]) },
            { today: isToday(visibleDays[(i - 1) * 7 + (j - 1)]) },
            { select: isSelect(visibleDays[(i - 1) * 7 + (j - 1)]) }]">
              {{ visibleDays[(i - 1) * 7 + (j - 1)].getDate() }}
            </span>
          </div>
        </div>
      </div>

      <div class="pannel-footer" @click="toToday">
        今天
      </div>
    </div>
  </div>
</template>

<script>
import { getYearMonthDay, getDate } from '@/utils/index'
export default {
  props: {
    value: {
      type: Date,
      default: () => new Date() //返回的默认值必须是一个函数类型(data配置项原因)
    }
  },
  // 自定义事件
  directives: {
    // 日历的点击事件
    clickOutside: {
      bind(el, binding, vnode) {
        // 把事件绑定给document上, 看一下点击的是否是当前这个元素内部
        let handler = (e) => {
          // console.log(e.target);
          if (el.contains(e.target)) {
            // 判断一下是否当前面板已经显示出来了
            if (!vnode.context.isVisible) {
              vnode.context.focus();
              console.log('包含');
            }
          } else {
            if (vnode.context.isVisible) {
              vnode.context.blur();
              console.log('不包含');
            }
          }
        }
        el.handler = handler;
        document.addEventListener('click', handler);
      },
      unbind(el) {
        document.removeEventListener('click', el.handler);
      }
    }
  },

  data() {
    let { year, month } = getYearMonthDay(new Date());
    return {
      isVisible: false,
      time: { year, month },
      weekDays: ['日', '一', '二', '三', '四', '五', '六']
    }
  },

  methods: {
    focus() {
      this.isVisible = true
    },
    blur() {
      this.isVisible = false;
    },
    // 判断一下日期它是不是当月的,是当月的就高亮,不是就颜色淡一些
    isCurrentMonth(date) {
      let { year, month } = getYearMonthDay(getDate(this.time.year, this.time.month, 1))
      let { year: y, month: m } = getYearMonthDay(date)
      return year === y && month === m;
    },
    // 当前天高亮
    isToday(date) {
      let { year, month, day } = getYearMonthDay(new Date());
      let { year: y, month: m, day: d } = getYearMonthDay(date);
      return year === y && month === m && day === d;
    },
    // 选择日期，让input的日期跟着改变
    chooseDay(date) {
      this.time = getYearMonthDay(date)
      this.$emit('input', date);
    },
    // 判断当前点击的日期选中
    isSelect(date) {
      // 获取当前的年月日
      let { year, month, day } = getYearMonthDay(this.value);
      let { year: y, month: m, day: d } = getYearMonthDay(date);
      return year === y && month === m && day === d;
    },
    // 点击跳到上一月
    preMonth() {
      let d = getDate(this.time.year, this.time.month, 1);
      console.log(d);
      d.setMonth(d.getMonth() - 1);
      console.log(d);
      this.time = getYearMonthDay(d);
    },
    preYear() {
      let d = getDate(this.time.year, this.time.month, 1);
      console.log(d);
      d.setFullYear(d.getFullYear() -1)
      this.time = getYearMonthDay(d);
    },
    // 下一个月
    nextMonth() {
      let d = getDate(this.time.year, this.time.month, 1);
      d.setMonth(d.getMonth() + 1);
      this.time = getYearMonthDay(d);
    },
    nextYear() {
      let d = getDate(this.time.year, this.time.month, 1);
      d.setFullYear(d.getFullYear() + 1);
      this.time = getYearMonthDay(d);
    },
    // 点击跳到今天
    toToday() {
      this.time = getYearMonthDay(new Date())
    }

  },


  computed: {
    // 格式化时间
    formatDate() {
      let { year, month, day } = getYearMonthDay(this.value);
      return `${year}-${month + 1}-${day}`
    },

    dayMs() {
      return 24 * 60 * 60 * 1000;
    },

    // 高亮显示当前月份日期
    visibleDays() {
      // 先获取当前是周几
      // 先生成一个 当前2019/12/5
      // 获取当前是周几 把天数往前移动几天
      // 循环42天
      let { year, month } = getYearMonthDay(getDate(this.time.year, this.time.month, 1))
      // 获取这个月第一天是几号
      let currentFirstDay = getDate(year, month, 1);
      // getDay方法获取这个月第一天是周几
      let week = currentFirstDay.getDay();
      // 当前页开始的天数
      let startDay = currentFirstDay - week * this.dayMs;
      // 循环42天
      let arr = [];
      for (let i = 0; i < 42; i++) {
        // 依次循环出42天
        arr.push(new Date(startDay + i * this.dayMs))
      }
      // console.log(week); //周一
      return arr;
    }
  }
}
</script>

<style lang="less" scoped>
.calendar {
  input {
    border: .5px solid black;
  }

  .pannel-nav {
    height: 30px;
    width: 310px;
    display: flex;
    justify-content: space-around;

    span {
      cursor: pointer;
      user-select: none;
    }
  }

  .pannel-content {
    display: flex;
    flex-direction: column;

    .weekDays {
      .weekDay {
        display: inline-block;
        margin: 0 5px;
        width: 32px;
        height: 16px;
        font-size: 18px;
        user-select: none;
        text-align: center;
        line-height: 16px;
        font-weight: bold;
      }
    }

    .days {
      display: inline-block;

      .cell {
        display: inline-block !important;
        width: 32px;
        height: 32px;
        // border: .5008px solid gray;
        margin: 5px;
        text-align: center;
        line-height: 32px;
        user-select: none;
        font-weight: bold;

        &:hover {
          cursor: pointer;
          outline: 2px solid cadetblue;
          border-radius: 4px;
        }
      }



      .notCurrentMonth {
        // border-color: #eee;
        color: #ccc;
      }

      .today {
        background-color: cadetblue;
        border-radius: 4px;
        color: white;
      }

      .select {
        outline: 2px solid cadetblue;
        border-radius: 4px;
      }

    }
  }

  .pannel-footer {
    width: 310px;
    height: 30px;
    text-align: center;
  }
}
</style>