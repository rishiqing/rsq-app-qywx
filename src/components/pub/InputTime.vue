<template>
  <v-touch class="" @tap="gotoTodoTime">
    <div class="outer-wrap bottom-border":class="{'hasPadding':newItem}">
      <span class="inner-key">时间</span>
      <span class="inner-value">{{ timeValue }}</span>
      <i class="icon2-arrow-right-small arrow"></i>
    </div>
  </v-touch>
</template>
<style lang="" scoped>
  .outer-wrap{
    display: flex;
    align-items: center;
    position: relative;
    line-height: 1.3rem;
    background-color: white;
  }
  .inner-key{
    display: block;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #333333;
  }
  .inner-value {
    display: block;
    position: absolute;
    top:50%;
    margin-top: -0.65rem;
    right: 0.94rem;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #999999;
    letter-spacing: 0;
  }
  .arrow{
    color: #999999;
    font-size: 21px;
    position: absolute;
    top:50%;
    margin-top: -0.25rem;
    right: 0.2rem;
  }
  .isInbox{
    border-bottom: 1px solid #E3E3E3;
  }
  .hasPadding{
    padding-left: 3%;
  }
  .edit-padding-left{
    left:1.3rem
  }
  .bottom-border{
    border-bottom: 1px solid #E0E0E0;
  }
</style>
<script>
  export default {
    data () {
      return {}
    },
    computed: {
      itemClock () {
        return this.item.clock || {}
      },
      isAllDay () {
        return !this.itemClock.startTime
      },
      timeValue () {
        return this.isAllDay ? '全天' : this.itemClock.startTime + '-' + this.itemClock.endTime
      }
    },
    props: {
      item: Object,
      editTime: Boolean,
      disabled: Boolean,
      newItem: Boolean
    },
    methods: {
      gotoTodoTime () {
//        console.log('进来了')
        if (this.disabled) {
          window.rsqadmg.execute('topTips', {message: '过去的任务不能编辑'})
          return
        }
        this.$emit('time-tap') // 谁来接收它呢
        //  将需要用到的属性设置到currentTodoTime中
        var timeObj = {
          clock: JSON.parse(JSON.stringify(this.itemClock))
        }
//        console.log(JSON.stringify(timeObj))
        this.$store.commit('PUB_TODO_TIME_UPDATE', {data: timeObj})
        this.$router.push('/todoEdit/time')
      }
    },
    created () {}
  }
</script>
