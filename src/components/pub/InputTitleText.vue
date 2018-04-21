<template>
  <div class="">
    <div class="edit">
      <v-touch
        v-if="isCheckable"
        class="wrap-icon"
        @tap="clickCheckOut">
        <i
          :class="{'icon-check_box_outline_blank': !itemChecked, 'icon-check': itemChecked}"
          class="icon2-check-box select-title"/>
        <div
          :class="{'for-hide-title':itemChecked}"
          class="hide" />
        <i
          :class="{'isdisplay-title':itemChecked}"
          class="icon2-selected hide"/>
      </v-touch>
      <input
        ref="titleInput"
        :value="itemTitle"
        :class="{'padding-left-input':isCheckable,'real-width':isMaxlength(itemTitle),'new-padding-left':newCheckable,'inbox-padding-left':!isCheckable,'edit-border':isEdit,'edit-text-font':isEdit,'new-text-font':newCheckable}"
        type="text"
        placeholder="输入任务标题"
        @input="inputChange($event.target.value)"
        @blur="inputBlur($event.target.value)"
        @focus="isDisabled($event)">
    </div>
  </div>
</template>
<script>
  export default {
    name: 'InputTitleText',
    props: {
      newCheckable: {
        type: Boolean,
        default: true
      },
      isCheckable: {
        type: Boolean,
        default: false
      },
      itemTitle: {
        type: Boolean,
        required: true
      },
      itemChecked: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
      }
    },
    computed: {},
    methods: {
      onPanMove () {
      },
      isMaxlength (title) {
        title = title || ''
        return title.length > 15
      },
      isDisabled (e) {
        if (this.disabled) {
          e.target.blur()
          window.rsqadmg.execute('topTips', {message: '过去的任务不能编辑'})
        }
      },
      inputBlur (value) {
        this.$emit('text-blur', value)
      },
      inputChange (value) {
        this.$emit('text-change', value)
      },
      clickCheckOut () {
        if (this.disabled) {
          window.rsqadmg.execute('toast', {message: '过去的任务不能编辑'})
          return
        }
        this.$emit('click-checkout', !this.itemChecked)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .edit-text-font{
    font-family: PingFangSC-Medium;
  }
  .new-text-font{
    font-family: PingFangSC-Regular;
  }
  .wrap-icon{
    display: flex;
    align-items: center;
    height: 1.28rem;
    position: relative;
  }
  .edit-text{
    font-family: PingFangSC-Medium;
    font-size: 0.506rem;
    color: #333333;
    letter-spacing: 0;
  }
  .hide{
    display: none;
  }
  .edit-border{
    border-bottom: 1px solid #e0e0e0;
  }
  .edit{
    display: flex;
    align-items: center;
    position: relative;
    background-color: white;
  }
  .real-width{
    text-overflow: ellipsis;
    overflow: hidden;
    white-space:nowrap
  }
  .select-title{
    color:#b1b1b1;
    font-size: 0.506rem;
    top:0.39rem;
    margin-left:0.35rem;
    background: #FFFFFF;
    border-radius: 1px;
  }
  .isdisplay-title{
    display: block;
    position:absolute;
    top:0.34rem;
    left: 0.45rem;
    font-size: 15px;
    color:#55A8FD;
  }
  .for-hide-title{
    position: absolute;
    top:0.35rem;
    left: 0.75rem;
    display: block;
    width: 2px;
    height: 2px;
    background-color: white;
    border: 1px solid white;
  }
  .padding-left-input{
    margin-left: 0.1rem;
    padding-left: 0.2rem;
  }
  .inbox-padding-left{
    padding-left: 0.3rem;
  }
  input::-webkit-input-placeholder { /* WebKit browsers */
    font-size: 0.506rem;
    color: #8C8C8C;
    letter-spacing: 0;
    padding-left: 0.1rem;
  }
  input[type='text']{
    background: #FFFFFF;
    line-height:0.72rem ;
    padding-bottom:0.305rem ;
    padding-top: 0.305rem;
    font-size: 0.506rem;
    border-radius: 0;
    color: #3D3D3D;
  }
  .padding-left-input{
  }
</style>
