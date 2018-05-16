<template>
  <v-touch @tap="showSubtodo">
    <div class="outer-wrap has-padding">
      <span class="inner-key">子任务</span>
      <span class="inner-value">{{ subtodoString }}</span>
      <i class="icon2-arrow-right-small arrow"/>
    </div>
  </v-touch>
</template>
<script>
  export default {
    name: 'InputSubtodo',
    props: {
      item: {
        type: Object,
        required: true
      },
      //  是否被禁用编辑
      isDisabled: {
        type: Boolean,
        default: false
      },
      //  被禁用编辑的提示，默认为''，不提示；如果要显示提示文字，需要传入提示的文字
      disabledText: {
        type: String,
        default: ''
      },
      todoType: {
        type: String,
        default: 'sche'
      }
    },
    data () {
      return {}
    },
    computed: {
      subtodoString () {
        let finishedCount = 0
        let unfinishedCount = 0
        let result = null
        const subtodo = this.item.subTodos || this.item.subItems || []

        for (let i = 0; i < subtodo.length; i++) {
          if (subtodo[i].isDone) {
            finishedCount++
          } else {
            unfinishedCount++
          }
        }
        if (finishedCount === 0 && unfinishedCount === 0) {
          return ''
        } else {
          result = finishedCount + '条已完成, ' + unfinishedCount + '条未完成'
          return result
        }
      }
    },
    methods: {
      showSubtodo () {
        if (this.isDisabled) {
          window.rsqadmg.execute('toast', {message: this.disabledText})
          return
        }
        this.$store.commit('PUB_ID_SUB', this.item.id)
        this.$router.push('/' + this.todoType + '/todo/' + this.item.id + '/subtodo')
      }
    }
  }
</script>
<style lang="scss" scoped>
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
  .has-padding{
    padding-left: 3%;
  }
  .edit-padding-left{
    left:1.3rem
  }
  .bottom-border{
    border-bottom: 1px solid #E0E0E0;
  }
</style>
