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
          :class="{'is-display-title':itemChecked}"
          class="icon2-selected hide"/>
      </v-touch>
      <input
        ref="titleInput"
        :value="itemTitle"
        :class="{'padding-left-input':isCheckable,'edit-border':isShowBottomBorder}"
        :placeholder="placeholder"
        class="title-input"
        type="text"
        @input="inputChange"
        @blur="inputBlur"
        @focus="checkDisabled">
    </div>
  </div>
</template>
<script>
  export default {
    name: 'InputTitleText',
    props: {
      //  标题的内容，默认为空字符串
      itemTitle: {
        type: String,
        default: ''
      },
      //  是否显示checkbox选择框
      isCheckable: {
        type: Boolean,
        default: false
      },
      //  是否为选中状态
      itemChecked: {
        type: Boolean,
        default: false
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
      //  是否显示底部的border
      isShowBottomBorder: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        placeholder: '输入任务标题'
      }
    },
    computed: {},
    methods: {
      checkDisabled (e) {
        if (this.isDisabled) {
          e.target.blur()
          if (this.disabledText) {
            window.rsqadmg.execute('toast', {message: this.disabledText})
          }
        }
      },
      inputBlur (e) {
        this.$emit('text-blur', e.target.value)
      },
      inputChange (e) {
        this.$emit('text-change', e.target.value)
      },
      clickCheckOut () {
        if (this.isDisabled) {
          window.rsqadmg.execute('toast', {message: this.disabledText})
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
    font-size: 17px;
    display: flex;
    align-items: center;
    position: relative;
    background-color: white;
  }
  .title-input{
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
  .is-display-title{
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
    padding-left: 0.3rem;
  }
  input::-webkit-input-placeholder { /* WebKit browsers */
    font-size: 0.506rem;
    color: #8C8C8C;
    letter-spacing: 0;
    padding-left: 0.1rem;
  }
  input[type='text']{
    height: 64px;
    background: #FFFFFF;
    line-height:24px ;
    padding: 0.3rem;
    border-radius: 0;
    color: #3D3D3D;
  }
</style>
