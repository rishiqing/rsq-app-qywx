<template>
  <div>
    <textarea
      v-model="content"
      type="text"
      placeholder="请输入评论内容" />
    <div class="icon-wrap">
      <img
        src="../../assets/img/upload.png"
        class="uploadpng">
    </div>
    <r-upload
      @get-file-id="setFileId"
      @remove-file-id="removeFileId"
      @ready-to-upload="isUploading"
      @finish-upload="finishUpload" />
    <div class="btn-group">
      <div class="btn-wrap">
        <v-touch
          tag="a"
          href="javascript:;"
          class="weui-btn weui-btn_primary"
          @tap="submitComment">
          发送
        </v-touch>
      </div>
    </div>
  </div>
</template>
<script>
  import Upload from 'com/pub/Upload'

  export default {
    name: 'Comment',
    components: {
      'r-upload': Upload
    },
    props: {
    },
    data () {
      return {
        content: '',
        fileId: [],
        fileName: [],
        uploadingFile: []
      }
    },
    computed: {
      defaultTaskDate () {
        return this.$store.getters.defaultTaskDate
      }
    },
    mounted () {
      window.rsqadmg.execute('setTitle', {title: '发送讨论'})
    },
    beforeRouteLeave (to, from, next) {
      //  清理回复评论的缓存
      this.$store.commit('REPLY_KANBAN_ITEM_COMMENT_DELETE')
      next()
    },
    methods: {
      setFileId (p) {
        this.fileId.push(p.id)
        this.fileName.push(p.name)
      },
      removeFileId (name) {
        for (var i = 0; i < this.fileName.length; i++) {
          if (this.fileName[i] === name) {
            this.fileId.splice(i, 1)
            this.fileName.splice(i, 1)
          }
        }
      },
      submitComment () {
        const newTitle = this.content
        if (!newTitle && this.fileId.length === 0) {
          return window.rsqadmg.execute('alert', {message: '任务评论不能为空'})
        }
        var that = this
        this.$store.dispatch('createKanbanItemComment',
          {
            commentContent: newTitle,
            fileIds: this.fileId
          })
          .then((com) => {
            that.$router.go(-1)
            window.rsqadmg.exec('hideLoader')
            window.rsqadmg.execute('toast', {message: '保存成功'})
          })
      },
      isUploading (array) {
        this.uploadingFile = array
      },
      finishUpload () {
        this.uploadingFile = []
      }
    }
  }
</script>
<style lang="scss" scoped>
  .icon-wrap{
    position: relative;
  }
  .upload-icon{
    font-size: 26px;
    color:#a3a3a3;
    position: absolute;
    bottom:0.7rem;
    left:0.4rem;
  }
  li{
    position: relative;
    border-bottom: 0.5px solid #E3E3E3;
    line-height: 1.173rem;
    padding-left: 0.4rem;
  }
  textarea{
    display: inline-block;
    padding-left:10px ;
    padding-top:5px ;
    height: 200px;
    width: 100%;
    margin-top: 40px;
    border-top: 0.5px solid #d4d4d4;
    border-bottom: 0.5px solid #d4d4d4;
    resize:none
  }
  ul{
    border-bottom: 0.5px solid #E3E3E3;
    border-top: 0.5px solid #E3E3E3;
    background-color: white;
  }
  .close{
    position: absolute;
    top:31%;
    right:8%;
    color: #DEDEDE;
    font-size: 17px;
  }
  .file{
    position: absolute;
    top:4.468rem;
    left:0.4rem;
    color: #3D3D3D;
    font-size:20px;
  }
  .img{
    color: #3D3D3D;
    position: absolute;
    left:2rem;
    top:4.468rem;
    font-size:20px;
  }
  .uploadpng{
    width: 18px;
    height: 15px;
    display: inline-block;
    position: absolute;
    top: -46px;
    left: 20px;
  }
</style>
