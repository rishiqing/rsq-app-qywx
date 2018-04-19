<template>
  <div class="delete">
    <div class="slider">
      <div class="content"
           @touchstart='touchStart'
           @touchmove='touchMove'
           @touchend='touchEnd'
           :style="deleteSlider"
      >
        <!-- 插槽中放具体项目中需要内容         -->
        <slot></slot>
        <v-touch @tap="deleteItem()">
        <div class="remove" ref='remove'>
            <span>删除</span>
        </div>
        </v-touch>
      </div>
    </div>
  </div>
</template>
<style scoped>
  .slider {
    width: 120%;
    /*height: 20px;*/
    /*height: 200px;*/
    position: relative;
    /*display: flex;*/
    /*align-items: center;*/
    user-select: none;
  }
  .slider  .content{
    /*position: absolute;*/
    /*left: 0;*/
    /*right: 0;*/
    /*top: 0;*/
    /*bottom: 0;*/
    /*background:green;*/
    z-index: 100;
    //    设置过渡动画
    transition: 0.3s;
    width: 120%;
    display: flex;
    align-items: center;
  }
  .slider  .remove{
    /*position: absolute;*/
    width:2rem;
    height:1.612rem;
    background:red;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: PingFangSC-Medium;
    font-size: 17px;
    color: #FFFFFF;
  }

</style>
<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        startX: 0,
        endX: 0,
        moveX: 0,
        disX: 0,
        deleteSlider: '',
        threshold: 50  //  50的敏感度，在滑动访问为50以内，不进行显示滑动删除
      }
    },
    methods: {
      touchStart (ev) {
        ev = ev || event
        if (ev.touches.length === 1) {
          // 记录开始位置
          this.startX = ev.touches[0].clientX
        }
      },
      touchMove (ev) {
        if (!this.$refs.remove) {
          return
        }
        ev = ev || event
        let wd = this.$refs.remove.offsetWidth
        if (ev.touches.length === 1) {
          // 滑动时距离浏览器左侧实时距离
          this.moveX = ev.touches[0].clientX
          this.disX = this.startX - this.moveX
          console.log(this.disX)
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
            }
          }
        }
      },
      touchEnd (ev) {
        if (!this.$refs.remove) {
          return
        }
        ev = ev || event
        let wd = this.$refs.remove.offsetWidth
        if (ev.changedTouches.length === 1) {
          let endX = ev.changedTouches[0].clientX
          this.disX = this.startX - endX
          if (Math.abs(this.disX) <= this.threshold) {
            return
          }
//          console.log(this.disX)
          if ((this.disX * 5) < (wd / 2)) {
            this.deleteSlider = 'transform:translateX(0px)'
          } else {
            this.deleteSlider = 'transform:translateX(-' + wd + 'px)'
          }
        }
      },
      deleteItem () {
//        console.log('sliderdelete到了')
        this.$emit('deleteItem')
      }
    }
  }
</script>
