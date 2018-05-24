<template>
  <div class="inbox-main">
    <div class="wrap">
      <v-touch
        class="new"
        @tap="delayCall('saveTodo',$event)">
        <img
          src="../../assets/img/card.png"
          class="add">
        <span class="new-child-plan">新建子计划</span>
      </v-touch>
    </div>
    <div class="margin-block"/>
    <div class="child-item">
      <c-item-list
        :items="childPlanList"/>
    </div>
  </div>

</template>
<script>
  import ChildPlanList from 'com/plan/ChildPlanList'

  export default {
    name: 'EditChildPlan',
    components: {
      'c-item-list': ChildPlanList
    },
    data () {
      return {
        titleName: '子计划'
      }
    },
    computed: {
      childPlanList () {
        return this.$store.state.childPlanList
      },
      currentPlan () {
        return this.$store.state.currentPlan
      }
    },
    mounted () {
      window.rsqadmg.exec('setTitle', {title: this.titleName})
    },
    methods: {
      saveTodo () {
        this.initialState = !this.initialState
        this.$prompt('', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true,
          title: '新建子计划',
          inputPlaceholder: '请输入子计划名称',
          inputValidator: value => {
            if (!value || /^\s+$/.test(value)) {
              return '请输入子计划名称'
            }
          }
        }).then(({ value }) => {
          var params = {
            name: value,
            kanbanId: this.currentPlan.id
          }
          var that = this
          this.$store.dispatch('postSubPlan', params).then((res) => {
            that.$store.commit('ADD_SUB_PLAN', res)
          })
        }).catch(() => {})
      },
      delayCall (func) {
        window.setTimeout(() => {
          this[func].apply(this, Array.prototype.slice.call(arguments, 1))
        }, 50)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .child-item{
    background-color: white;
    border-bottom:1px solid #E3E3E3 ;
    position: relative;
    z-index: 2;
  }
  .wrap{
    width: 100%;
    margin-top: 20px;
  }
  .topest{
    background-color: #F5F5F5;
    height: 10px;
    z-index: 2;
    position: fixed;
    width: 100%;
  }
  .create{
    box-sizing: border-box;
    display: block;
    text-align: center;
    width:1.413rem;
    height: 0.66rem;
    line-height: 0.66rem;
    border: 1px solid #55A8FD;
    border-radius: 2px;
    font-size: 15px;
    color:#55A8FD;
    position: absolute;
    margin-top: -0.33rem;
    top: 50%;
    right:0.35rem;
    z-index: 3;
  }
  .new{
    line-height: 0.612rem;
    padding-bottom: 0.4rem;
    padding-top: 0.4rem;
    border-bottom:1px solid #E3E3E3;
    border-top:1px solid #E3E3E3;
    background: #FFFFFF;
    margin-bottom: 0.224rem;
    z-index: 2;
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    border-radius: 0;
  }
  .new::-webkit-input-placeholder { /* WebKit browsers */
    font-family: PingFangSC-Regular;
    font-size: 0.453rem;
    color: #999999;
    height: 1.4rem;
  }
  .margin-block {
    height: 0.5333rem;
    z-index: 1;
  }
  .add{
    width: 0.533rem;
    height: 0.533rem;
    vertical-align: text-bottom;
    margin-left: 0.4rem;
  }
  .new-child-plan{
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #000000;
    line-height: 0.8rem;
  }
</style>
