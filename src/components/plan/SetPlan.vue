<template>
  <div>
    <div class="plan-set-top">
      <div class="wrap-img">
        <img :src=currentPlan.cover alt="" class="plan-set-img">
        <v-touch class="wrap-name" @tap="showEditName">
          <input class="plan-set-name" v-model="currentPlan.name" :class="{'editState': editState}" @blur="savePlanName"/>
          <img src="../../assets/img/set.png" alt="" class="plan-set-sec-img" v-show="!editState">
        </v-touch>
        <span class="creator-time">由 {{currentPlan.creatorId}} 于{{currentPlan.dateCreated.substr(0, 10)}}创建</span>
      </div>
    </div>
    <div>
      <div></div>
    </div>
    <div class="setStar">
      <span class="plan-set-star">设为星标计划</span>
      <v-touch @tap="toggleAllDay">
        <input class="mui-switch" type="checkbox" :checked=isStar>
      </v-touch>
    </div>
    <v-touch @tap="ifDelPlan">
      <div class="plan-set-bot" v-show="isOwner">删除计划</div>
      <div class="plan-set-bot" v-show="!isOwner">退出计划</div>
    </v-touch>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        editState: false,
        planName: ''
      }
    },
    computed: {
      currentPlan () {
        return this.$store.state.currentPlan
      },
      isStar () {
        return this.currentPlan.starMark
      },
      loginUser () {
        return this.$store.getters.loginUser || {}
      },
      userId () {
        return this.loginUser.authUser.userId ? this.loginUser.authUser.userId : 'dingtalkupload'
      },
      isOwner () {
        return this.userId === this.currentPlan.creatorId
      }
    },
    methods: {
      savePlanName () {
        this.editState = false
        console.log(this.currentPlan.name)
        this.$store.dispatch('updatePlanName', {'name': this.currentPlan.name, 'id': this.currentPlan.id})
      },
      showEditName () {
        this.editState = true
      },
      toggleAllDay () {
//        alert(this.isChecked)
        if (this.isStar) {
          this.$store.dispatch('cancelStar', {kanbanId: this.currentPlan.id})
        } else {
          this.$store.dispatch('saveStar', {kanbanId: this.currentPlan.id})
        }
        this.isChecked = !this.isChecked
      },
      ifDelPlan () {
        if (this.isOwner) {
          var that = this
          this.$store.dispatch('deletePlan', {id: this.currentPlan.id}).then(() => {
            that.$router.replace('/plan/PlanList')
          })
        } else {
          this.$store.dispatch('quitPlan', {id: this.currentPlan.id}).then(() => {
            that.$router.replace('/plan/PlanList')
          })
        }
      }
    },
    mounted () {
      console.log(this.currentPlan.name + ':' + this.editState)
    }
  }
</script>
<style>
  .wrap-name .editState{
    background: #F3F3F3;
    max-width: 5rem;
    /*padding-left: 1rem;*/
  }
  .wrap-name{
    display: flex;
    align-items: center;
    /*margin-left: 1rem;*/
    justify-content: center;
    align-items:center;
  }
  .plan-set-sec-img{
    width: 0.5rem;
    height: 0.5rem;
    margin-left: 0.1rem;
  }
  .plan-set-bot{
    height: 1.4rem;
    background-color: #D34435 ;
    width: 95%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: PingFangSC-Regular;
    font-size: 18px;
    color: #FFFFFF;
    border-radius: 5px;
    margin: 0 auto;
    margin-top: 0.3rem;
  }
  .creator-time{
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: rgba(177,177,177,0.88);
  }
  .plan-set-star{
    margin-left: 0.3rem;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #666666;
  }
  .setStar{
    height: 1.52rem;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    margin-top: 0.3rem;
  }
  .wrap-img{
    text-align: center;
  }
  .plan-set-top{
    display: flex;
    justify-content: center;
    background-color: white;
    height: 3.866rem;
    padding: 0.5rem 1rem;
    margin-top: 0.3rem;
  }
  .plan-set-name{
    outline:none;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #666666;
    opacity: 0.66;
    /*background: #F3F3F3;*/
    border: 0 solid #E4E4E4;
    border-radius: 1px;
    max-width:1.98rem;
    height: 0.645rem;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    /*text-overflow: ellipsis;*/
    /*overflow: hidden;*/
    /*white-space:nowrap;*/
  }
  .plan-set-img{
    width: 1.386rem;
    height: 1.386rem;
    border-radius: 9px;
  }
  .setStar{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>
