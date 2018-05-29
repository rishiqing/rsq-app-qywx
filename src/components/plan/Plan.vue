<template>
  <li
    ref="slider"
    :style="deleteSlider"
    class="slider"
    @touchstart="touchStart"
    @touchmove="touchMove"
    @touchend="touchEnd">
    <v-touch @tap="toChildPlan">
      <div class="forward-plan">
        <img
          :src="item.cover"
          class="plan-image">
        <span class="plan-name">{{ item.name }}</span>
      </div>
    </v-touch>
    <i
      v-show="item.starMark"
      class="icon2-star-target-2 have-star"/>
    <v-touch
      class="star-main"
      @tap="item.starMark?starOut():starTo()">
      <div
        ref="star"
        :class="{ chose: item.starMark }"
        class="star">
        <span>{{ item.starMark?"取消星标":"设为星标" }}</span>
      </div>
    </v-touch>
  </li>
</template>
<script>
  export default {
    name: 'Plan',
    props: {
      item: {
        type: Object,
        required: true
      },
      flag: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        startX: 0,
        endX: 0,
        moveX: 0,
        disX: 0,
        deleteSlider: '',
        threshold: 0,  //  50的敏感度，在滑动访问为50以内，不进行显示滑动删除
        throttle: null //  节流
      }
    },
    computed: {
      currentPlan () {
        return this.$store.state.currentPlan
      },
      currentSubPlanOfTask () {
        return this.$store.state.currentSubPlan
      }
    },
    watch: {
      flag (newId) {
        if (newId !== this.item.id) {
          this.$refs.slider.style.transform = ''
        }
      }
    },
    methods: {
      toChildPlan () {
        var that = this
        this.$store.dispatch('getChildKanbanList', this.item).then(
          (res) => {
            this.$store.commit('SET_CURRENT_PLAN', res)
            that.$store.commit('SAVE_CHILD_PLAN', res.childKanbanList)
            that.$store.dispatch('getLabels', this.item).then((res) => {
              that.$store.commit('SAVE_LABELS', res)
            }).then(() => {
              this.$store.commit('SET_EMPTY_CURRENT_SUB_PLAN')
              that.$router.push('/plan/' + this.currentPlan.id + '/child-plan')
            })
          })
      },
      touchStart (ev) {
        ev = ev || event
        if (ev.touches.length === 1) {
          // 记录开始位置
          this.startX = ev.touches[0].clientX
        }
      },
      touchMove (ev) {
        if (!this.$refs.star) {
          return
        }
        ev = ev || event
        let wd = this.$refs.star.offsetWidth
        if (ev.touches.length === 1) {
          // 滑动时距离浏览器左侧实时距离
          this.moveX = ev.touches[0].clientX
          this.disX = this.startX - this.moveX
          // 如果是向右滑动或者不滑动，不改变滑块的位置
          if (Math.abs(this.disX) <= this.threshold) {
            return
          }
          if (this.disX < 0 || this.disX === 0) {
            this.deleteSlider = 'transform:translateX(0px)'
          } else if (this.disX > 0) {
            this.deleteSlider = 'transform:translateX(-' + this.disX * 5 + 'px)'
            if (this.disX * 5 >= wd) {
              this.deleteSlider = 'transform:translateX(-' + wd + 'px)'
              this.shrink()
            }
          }
        }
      },
      touchEnd (ev) {
        if (!this.$refs.star) {
          return
        }
        ev = ev || event
        let wd = this.$refs.star.offsetWidth
        if (ev.changedTouches.length === 1) {
          let endX = ev.changedTouches[0].clientX
          this.disX = this.startX - endX
          if (Math.abs(this.disX) <= this.threshold) {
            return
          }
          if ((this.disX * 5) < (wd / 2)) {
            this.deleteSlider = 'transform:translateX(0px)'
          } else {
            this.deleteSlider = 'transform:translateX(-' + wd + 'px)'
          }
        }
      },
      shrink () {
        var that = this
        clearTimeout(this.throttle)
        this.throttle = setTimeout(() => {
          that.$emit('mark', that.item.id)
        }, 100)
      },
      starTo () {
        this.$store.dispatch('saveStar', {kanbanId: this.item.id})
      },
      starOut () {
        this.$store.dispatch('cancelStar', {kanbanId: this.item.id})
      }
    }
  }
</script>
<style lang="scss" scoped>
  .forward-plan{
    display: flex;
    align-items: center;
    height: 100%;
  }
  .plan-image{
    width: 36px;
    height: 36px;
    border-radius: 2px;
  }
  .plan-name{
    width: 7rem;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #3D3D3D;
    margin-left: 0.3rem;
  }
  .slider {
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 0.5px solid #D4D4D4;
    width: 131%;
    position: relative;
    user-select: none;
    transition: transform 0.3s
  }
  .slider  .content{
    z-index: 100;
  transition: 0.3s;
    display: flex;
    align-items: center;
  }
  .slider  .star{
    margin-right: 0;
    width: 100%;
    height:56px;
    background:#F8E71C;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: PingFangSC-Medium;
    font-size: 17px;
    color: #FFFFFF;
  }
  .star-main{
    width:23.4%;
  }
  .have-star{
    color: #F8E71C;
    font-size: 16px;
    margin-right: 0.3rem;
  }
  .slider .chose{
    background:red;
  }
</style>
