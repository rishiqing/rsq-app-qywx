<template>
  <li class="child-item">
    <img
      src="../../assets/img/subplan.png"
      class="subplan">
    <span class="child-plan">{{ item.name }}</span>
    <v-touch
      class="down"
      @tap="delayCall('setPlan',$event)">
      <img
        src="../../assets/img/cplan.png"
        class="cplan">
    </v-touch>
  </li>
</template>
<script>
  export default {
    name: 'ChildPlanItem',
    props: {
      item: {
        type: Object,
        required: true
      }
    },
    data () {
      return {}
    },
    computed: {
      currentPlan () {
        return this.$store.state.currentPlan
      }
    },
    mounted () {
    },
    methods: {
      delayCall (func) {
        window.setTimeout(() => {
          this[func].apply(this, Array.prototype.slice.call(arguments, 1))
        }, 50)
      },
      setPlan (e) {
        e.preventDefault()
        var that = this
        window.rsqadmg.exec('actionsheet', {
          buttonArray: ['编辑子计划名称', '删除子计划'],
          className: 'delete_IOS',
          success: function (res) {
            switch (res.buttonIndex) {
              case 0:
                that.$prompt('', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  inputValue: that.item.name,
                  center: true,
                  title: '编辑名称',
                  inputValidator: value => {
                    if (!value) {
                      return '请输入子计划名称'
                    }
                  }
                }).then(({ value }) => {
                  var params = {
                    name: value,
                    id: that.item.id
                  }
                  that.$store.dispatch('updateName', params).then((res) => {
                    that.$store.commit('UPDATE_SUBPLAN_NAME', res)
                  })
                }).catch(() => {})
                break
              case 1:
                that.$store.dispatch('deleteChildPlan', {id: that.item.id})
                break
              default:
                break
            }
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  li{
    padding:0;
    line-height:1.612rem ;
    position: relative;
    border-bottom:1px solid #E0E0E0 ;
  }
  .child-item{
    line-height: 1.412rem;
    border-bottom:1px solid #E3E3E3;
    background: #FFFFFF;
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    border-radius: 0;
  }
  .child-item:last-child{
    border-bottom: none;
  }
  .subplan{
    width: 0.613rem;
    height: 0.5066rem;
    vertical-align: text-bottom;
    line-height: 1.412rem;
  }
  .child-plan{
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #000000;
    height: 100%;
    margin-left: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 46%;
  }
  .down{
    width: 0.5333rem;
    height: 0.5333rem;
    vertical-align: text-bottom;
    float: right;
    margin-right: 0.4rem;
  }
  .cplan{
    width: 20px;
    height: 20px;
    vertical-align: text-bottom;
    margin-top: 4px;
  }
</style>
