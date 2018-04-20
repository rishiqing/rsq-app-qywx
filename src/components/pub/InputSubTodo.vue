<template>
  <v-touch class="" @tap="showSubTodo">
    <div class="outer-wrap">
      <span class="inner-key">子任务</span>
      <span class="inner-value">{{subtodoString}}</span>
      <i class="icon2-arrow-right-small arrow"></i>
    </div>
  </v-touch>
  <!--<div class="subtodo">-->
    <!--<v-touch class="" @tap="showSubTodo">-->
      <!--<span class="date">子任务</span>-->
      <!--<span class="now" :class="{'edit-padding-left':editTime}">{{subtodoString}}</span>-->
      <!--<i class="icon2-arrow-right-small arrow"></i>-->
    <!--</v-touch>-->
  <!--</div>-->
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
    props: {
      item: Object,
      editTime: Boolean,
      disabled: Boolean
    },
    computed: {
      subtodoString () {
        var finishcount = 0
        var unfinishcount = 0
        var result = null
        var subtodo = this.item.subTodos
        // console.log('---' + subtodo + '----') // 这一行输出两次
        if (subtodo === undefined) {
          // console.log('果然相等')
          return ''
        } else {
          for (var i = 0; i < subtodo.length; i++) {
            if (subtodo[i].isDone) {
              finishcount++
            } else {
              unfinishcount++
            }
          }
          if (finishcount === 0 && unfinishcount === 0) {
            return ''
          } else {
            result = finishcount + '条已完成, ' + unfinishcount + '条未完成'
            return result
          }
        }
      }
    },
    methods: {
      showSubTodo () {
        if (this.disabled) {
          window.rsqadmg.execute('topTips', {message: '过去的任务不能编辑'})
          return
        }
        this.$router.push('/todo/' + this.item.id + '/subTodo')
      }
    }
  }
</script>
