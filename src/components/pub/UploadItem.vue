<template>
  <li class="task-list">
    <img
      :src="previewImg"
      class="small-img"
      alt="task.img.name">
    <div class="file-name">
      <div class="word">{{ task.img.name }}</div>
      <div class="file-size">{{ format(uploadedSize) }}/{{ format(task.file.size) }}</div>
    </div>
    <v-touch
      class="icon-wrap"
      @tap="triggerDelete">
      <i class="icon2-error delete-comment" />
      <span
        v-show="!task.isShowProgress"
        class="done-text">上传完成</span>
    </v-touch>
    <div
      v-show="task.isShowProgress"
      ref="progressBar"
      :style="progressStyle"
      class="progress-mask" />
  </li>
</template>
<script>
  import util from 'ut/jsUtil'

  export default {
    name: 'UploadItem',
    props: {
      task: {
        type: Object,
        required: true
      }
    },
    data () {
      return {}
    },
    computed: {
      uploadedSize () {
        return Math.ceil(this.task.progress * this.task.file.size / 100)
      },
      progressStyle () {
        var style = 'scaleX(' + this.task.progress + ')'
        return {
          'transform': style,
          '-webkit-transform': style
        }
      },
      //  根据当前task.file的类型，判断需要显示什么样的预览图
      previewImg () {
        var type = this.task.file.type
        if (new RegExp('image/').test(type)) {
          return this.task.img.src
        } else {
          switch (type) {
            case 'application/pdf':
              return 'https://res-front-cdn.timetask.cn/beta/images/pdf.692b9767b9.png'
            case 'application/zip':
              return 'https://res-front-cdn.timetask.cn/beta/images/zip.f9f2049911.png'
            case 'application/ppt':
            case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
              return 'https://res-front-cdn.timetask.cn/beta/images/ppt.2c7e64eb9b.png'
            case 'application/doc':
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
              return 'https://res-front-cdn.timetask.cn/beta/images/word.b44eea8fcf.png'
            default:
              return 'https://res-front-cdn.timetask.cn/beta/images/file.46449ccbd9.png'
          }
        }
      }
    },
    mounted () {
      this.$refs.progressBar.addEventListener('transitionend', this.checkProgressBar)
      this.$refs.progressBar.addEventListener('webkitTransitionEnd', this.checkProgressBar)
    },
    beforeDestroy () {
      this.$refs.progressBar.removeEventListener('transitionend', this.checkProgressBar)
      this.$refs.progressBar.addEventListener('webkitTransitionEnd', this.checkProgressBar)
    },
    methods: {
      format (num) {
        return util.formatUnit(num)
      },
      triggerDelete () {
        this.$emit('upload-item-delete', this.task)
      },
      //  检查进度条是否需要消失
      checkProgressBar () {
        this.task.isShowProgress = (this.task.progress < 100)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .small-img{
    width: 28px;
    height: 36px;
  }
  .icon-wrap {
    position:absolute;top:0;right:0.5rem;bottom:0;overflow:hidden;
  }
  .icon-wrap > * {
    float: right;line-height:1.2rem;
  }
  .delete-comment {
    color: #DEDEDE;
    font-size: 18px;
    z-index:9;
    height: 56px;
    line-height: 56px
  }
  .done-text {
    color: #9B9B9B;font-size: 12px;padding-right:0.3rem;
    height: 56px;
    line-height: 56px
  }
  .file-name {
    font-family:AppleSystemUIFont;
    margin-left: 10px;
    width: 100%;
  }
  .word{
    font-size: 13px;
    color: #3D3D3D;
    width: 60%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .file-size {
    font-size: 12px;color: #9B9B9B;
  }
  .task-list{
    position: relative;
    display:flex;
    align-items: center;
    border-top: 0.5px solid #d4d4d4;
    border-bottom: none;
    background-color: white;
    padding-left: 15px;
    height: 56px;
  }
  .task-list:last-child{
    border-bottom: 0.5px solid #D4D4D4;
  }
  .progress-mask {
    position: absolute; top:0;bottom:0;left:0;width:1%;background: rgba(0,122,255,0.2);
    transition: transform 1s ease-in-out;
    -webkit-transition: -webkit-transform 1s ease-in-out;
    transform-origin: 0 50%;
    -webkit-transform-origin: 0 50%;
  }
</style>
