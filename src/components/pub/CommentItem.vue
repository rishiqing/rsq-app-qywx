<template>
  <li
    class="comment"
    @click="clickItem">
    <div class="left">
      <avatar
        :src="item.qywxShowAvatar"
        :username="item.qywxShowName || item.authorName"
        :size="30" />
    </div>
    <div class="right">
      <div class="top">
        <span class="author">{{ item.qywxShowName || item.authorName }}</span>
        <span class="time">{{ item.dateCreated.substring(5,7) }}月{{ item.dateCreated.substring(8,16) }}</span>
      </div>
      <div class="bottom">
        <div
          v-if="ifReplyComment"
          class="comment-content">
          <span
            class="reply-comment"
            v-html="item.commentContent">
            {{ item.commentContent }}
          </span>
        </div>
        <div
          v-else
          class="comment-content"
          v-html="item.commentContent">
          {{ item.commentContent }}
        </div>
        <v-touch
          v-for="file in item.fileList"
          :key="file.id"
          class="comment-item-picture file-touch"
          @tap="fileTouch($event, file)">
          <template v-if="(file.contentType.toUpperCase() === 'PNG'||file.contentType.toUpperCase() === 'JPEG'|| file.contentType.toUpperCase() === 'JPG')">
            <img
              :src="file.realPath"
              class="comment-photo file-touch"
              alt="">
            <span class="file-name file-touch">{{ getFileName(file.name) }}</span>
            <span class="file-size file-touch">{{ getFileSize(file.size) }}</span>
          </template>
          <template v-else-if="file.contentType.toUpperCase() == 'PDF'">
            <img
              class="comment-photo file-touch"
              src="https://res-front-cdn.timetask.cn/beta/images/pdf.692b9767b9.png"
              alt="">
            <span class="file-name file-touch">{{ getFileName(file.name) }}</span>
            <span class="file-size file-touch">{{ getFileSize(file.size) }}</span>
          </template>
          <template v-else-if="file.contentType.toUpperCase() === 'ZIP'">
            <img
              class="comment-photo file-touch"
              src="https://res-front-cdn.timetask.cn/beta/images/zip.f9f2049911.png"
              alt="">
            <span class="file-name file-touch">{{ getFileName(file.name) }}</span>
            <span class="file-size file-touch">{{ getFileSize(file.size) }}</span>
          </template>
          <template v-else-if="file.contentType.toUpperCase() === 'DOC' || file.contentType.toUpperCase() === 'DOC'">
            <img
              class="comment-photo file-touch"
              src="https://res-front-cdn.timetask.cn/beta/images/word.b44eea8fcf.png"
              alt="">
            <span class="file-name file-touch">{{ getFileName(file.name) }}</span>
            <span class="file-size file-touch">{{ getFileSize(file.size) }}</span>
          </template>
          <template v-else-if="file.contentType.toUpperCase() === 'PPT' || file.contentType.toUpperCase() === 'PPTX'">
            <img
              class="comment-photo file-touch"
              src="https://res-front-cdn.timetask.cn/beta/images/ppt.2c7e64eb9b.png"
              alt="">
            <span class="file-name file-touch">{{ getFileName(file.name) }}</span>
            <span class="file-size file-touch">{{ getFileSize(file.size) }}</span>
          </template>
          <template v-else>
            <img
              class="comment-photo file-touch"
              src="https://res-front-cdn.timetask.cn/beta/images/file.46449ccbd9.png"
              alt="">
            <span class="file-name file-touch">{{ getFileName(file.name) }}</span>
            <span class="file-size file-touch">{{ getFileSize(file.size) }}</span>
          </template>
        </v-touch>
      </div>
    </div>
  </li>
</template>
<script>
  import Avatar from 'com/pub/TextAvatar'

  export default {
    name: 'CommentItem',
    components: {
      'avatar': Avatar
    },
    props: {
      disabled: {
        type: Boolean,
        default: false
      },
      item: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
      }
    },
    computed: {
      ifReplyComment () {
        return (this.item.commentContent.indexOf('@') !== -1)
      },
      indexOfBlank () {
        if (this.ifReplyComment) {
          return this.item.commentContent.indexOf('&')
        }
      }
    },
    methods: {
      getFileName (orgName) {
        if (!orgName) return ''
        var arr = orgName.split('/')
        return arr[arr.length - 1].substr(14, 25)
      },
      getFileSize (fileSize) {
        if (fileSize > 1024 && fileSize < 1048576) {
          return parseInt(fileSize / 1024) + 'KB'
        } else if (fileSize > 1048576) {
          return parseInt(fileSize / (1024 * 1024)) + 'MB'
        } else {
          return fileSize + 'B'
        }
      },
      fileTouch (e, file) {
        e.preventDefault()
        this.$emit('comment-file-touch', file)
      },
      clickItem (e) {
        if (this.disabled) return
        if (!e.target.classList.contains('file-touch')) {
          this.$emit('click-comment', this.item)
          // this.deleteComment(this.item)
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .reply-comment{
    background: rgba(0,0,0,.1);
  }
  .comment{
    padding-left: 3%;
    margin-top:0.613rem ;
    margin-bottom: 0.54rem;
    line-height: 0.7rem;
    border-bottom: none;
    display: flex;
  }
  .comment:last-child{
    margin-bottom: 1rem;
  }
  .file-name{
    font-family: PingFangSC-Regular;
    font-size: 13px;
    color: #BFBFBF;
    margin-left: 10px;
    width: 70%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .file-size{
    font-family: PingFangSC-Regular;
    font-size: 13px;
    color: #BFBFBF;
    margin-left:0.4rem;
  }
  .comment-photo{
    width: 25px;
    height: 29px;
  }
  .comment-item-picture{
    display: flex;
    align-items: center;
    padding: 5px;
    background-color: white;
    border: 1px solid #E0E0E0;
    width: 91%;
    margin-top: 5px;
  }
  .comment:after{
    display: block;
    content: '';
    clear: both;
  }
  .time{
    font-size:13px;
    color:#8C8C8C ;
    font-family: PingFangSC-Regular;
  }
  .left{
    width: 1.093rem;
    float: left;
    zoom: 1;
  }
  .right{
    padding: 0;
    border: none;
  }
  .top{
    display: flex;
    align-items: center;
    margin-top: -4px;
    justify-content: space-between;
  }
  .author{
    width: 5.733rem;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #8C8C8C;
    letter-spacing: 0;
  }
  .comment-content{
    width: 94%;
    font-family: STHeitiSC-Light;
    font-size: 15px;
    color: #111111;
    letter-spacing: 0;
    line-height: 21px;
  }
</style>
