<template>
  <div class="itm-edt-fields">
    <div class="input-wrap">
      <input
        ref="titleInput"
        v-model="planName"
        type="text"
        placeholder="计划名称">
    </div>
    <div class="buttons">
      <v-touch
        class="button-wrap"
        @tap="submitPlanName" >
        <a
          href="javascript:;"
          class="weui-btn weui-btn_primary">
          保存
        </a>
      </v-touch>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'PlanNameEdit',
    data () {
      return {
        planName: ''
      }
    },
    computed: {
      currentPlan () {
        return this.$store.state.currentPlan
      }
    },
    created () {
      window.rsqadmg.exec('setTitle', {title: '编辑名称'})
      this.planName = this.currentPlan.name
    },
    methods: {
      submitPlanName () {
        this.$store.dispatch('updatePlanName', {'name': this.planName, 'id': this.currentPlan.id})
        this.$router.go(-1)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .input-wrap {

  }
  .input-wrap > input {
    background: #FFFFFF;
    line-height: 0.72rem;
    padding: 0.305rem;
    font-size: 0.506rem;
    border-radius: 0;
    color: #3D3D3D;
  }
  .buttons {
    padding-top: 0.2rem;
  }
  .button-wrap {
    margin: 0.3rem 0.3rem 0;
  }
</style>
