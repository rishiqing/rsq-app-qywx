<template>
  <ul class="comment-list">
    <v-touch @tap="changeState">
      <div
        :class="{'isDisplay': !more}"
        class="operation">
        收起操作记录
      </div>
      <div
        :class="{'isDisplay': more}"
        class="operation">
        显示操作记录
      </div>
    </v-touch>
    <r-record-comment
      v-for="item in recordItems"
      :disabled="disabled"
      :item="item"
      :key="item.id"
      :more="more"/>
    <r-todo-comment
      v-for="item in commentItems"
      :disabled="disabled"
      :item="item"
      :key="item.id"
      @comment-file-touch="showAction"
      @click-comment="handleCommentClick"/>
    <div
      v-if="commentCount"
      class="no-comment">
      <img
        src="../../assets/img/nocomment.png"
        alt="">
      <p class="no-comment-content">暂无评论</p>
    </div>
  </ul>
</template>
<script>
  import Previewer from 'com/pub/Previewer'
  import CommentItem from 'com/pub/CommentItem'
  import CommentRecord from 'com/pub/CommentRecord'
  export default {
    name: 'CommentList',
    components: {
      'r-todo-comment': CommentItem,
      'r-record-comment': CommentRecord
    },
    props: {
      disabled: {
        type: Boolean,
        default: false
      },
      items: {
        type: Array,
        required: true
      },
      todoId: {
        type: Number,
        required: true
      },
      todoType: {
        type: String,
        default: 'sche'
      }
    },
    data () {
      return {
        more: false
      }
    },
    computed: {
      recordItems () {
        return this.$store.state.record
//        if (this.items) {
//          return this.items.filter(i => {
//            return i.type !== 0
//          })
//        }
      },
      commentItems () {
        return this.items.filter(i => {
          return i.type === 0
        })
      },
      commentCount () {
        if (this.items === undefined) {
          return
        } else {
          for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].type === 0) {
              return false
            }
          }
          return true
        }
      },
      loginUser () {
        return this.$store.state.loginUser
      },
      rsqUserId () {
        return this.loginUser.rsqUser.id
      }
    },
    methods: {
      getFileName (file) {
        if (!file.name) return ''
        var arr = file.name.split('/')
        return arr[arr.length - 1].substr(14)
      },
      changeState () {
        //  暂时这么处理：日程中的操作记录通过接口获取，计划中的不获取
        if (this.todoType === 'sche') {
          this.$store.dispatch('getRecord', {id: this.todoId})
            .then(() => {
              this.more = !this.more
            })
        } else {
          this.more = !this.more
        }
      },
      showAction (f) {
        var that = this
        const device = window.rsqadmg.exec('checkDevice')
        const btnArray = ['预览文件']
        if (device.os !== 'iOS') {
          btnArray.push('下载文件')
        }
        window.rsqadmg.exec('actionsheet', {
          buttonArray: btnArray,
          success: function (res) {
            switch (res.buttonIndex) {
              case 0:
                Previewer.show({
                  file: f
                })
                break
              case 1:
                that.downloadFile(f)
                break
              default:
                break
            }
          }
        })
      },
      downloadFile (f) {
        var link = document.createElement('a')
        link.download = this.getFileName(f)
        link.href = f.realPath
        link.click()
      },
      handleCommentClick (item) {
        const deleteAction = this.todoType === 'plan' ? 'deleteKanbanItemComment' : 'deleteCommentItem'
        const replyAction = this.todoType === 'plan' ? 'replyKanbanItemComment' : 'replyCommentItem'
        var that = this
        if (this.rsqUserId === item.authorId) {
          window.rsqadmg.exec('confirm', {
            message: '确定要删除此评论？',
            success () {
              that.$store.dispatch(deleteAction, {item: item})
                .then(() => {
                  window.rsqadmg.exec('hideLoader')
                  window.rsqadmg.execute('toast', {message: '删除成功'})
                })
            }
          })
        } else {
          window.rsqadmg.exec('confirm', {
            message: '确定回复此评论？',
            success () {
              that.$store.dispatch(replyAction, {item: item})
                .then(() => {
                  that.$router.push('/' + that.todoType + '/todo/comment')
                })
            }
          })
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .no-comment{
    text-align: center;
    height: 3rem;
    margin-bottom: 2rem;
  }
  .no-comment>img{
    width: 44px;
    height:44px ;
    margin-top: 1.6rem;
  }
  .no-comment-content{
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #55A8FD;
    letter-spacing: 0;
  }
  .isDisplay{
    display: none;
  }
  .comment-list{
    background-color: white;
    margin-top: 10px;
    padding-bottom: 2.9rem;
  }
  .operation{
    line-height:1.083rem;
    padding-left: 0.333rem;
    font-family: PingFangSC-Regular;
    color:#55A8FD;
    font-size:15px ;
    background-color: white;
    border-bottom: 1px solid #E0E0E0;
    border-bottom: 1px solid #E0E0E0;
  }
</style>
