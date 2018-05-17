<template>
  <div class="inbox-main">
    <div class="topest"/>
    <div class="wrap">
      <input
        v-model="inputTitle"
        class="write"
        type="text"
        placeholder="在这里写下想法">
      <v-touch
        v-show="inputTitle !== ''"
        class="btn-create"
        @tap="saveTodo">
        <div class="create">创建</div>
      </v-touch>
    </div>
    <div class="margin-block"/>
    <div class="inbox-item">
      <r-todo-item-list
        v-if="items != null && items.length > 0"
        :items="items"
        :is-checkable="false"/>
    </div>
    <div class="tips">收纳箱中的任务没有具体的日期，它可能是灵光乍现的想法，可能是同事拜托你的一件小事…</div>
  </div>

</template>
<script>
  import TodoItemList from 'com/sche/TodoItemList'

  export default {
    name: 'InboxMain',
    components: {
      'r-todo-item-list': TodoItemList
    },
    data () {
      return {
        titleName: '收纳箱',
        inputTitle: ''
      }
    },
    computed: {
      items () {
        return this.$store.state.inbox.items
      }
    },
    mounted () {
      this.fetchItems()
      window.rsqadmg.exec('setTitle', {title: this.titleName})
      window.rsqadmg.exec('setOptionButtons', {hide: true})
      this.$store.dispatch('setNav', {isShow: false})
    },
    methods: {
      fetchItems () {
        this.$store.dispatch('fetchInboxItems')
      },
      saveTodo () {
        window.rsqadmg.execute('showLoader', {text: '创建中...'})
        this.$store.dispatch('submitCreateTodoItem', {newItem: {pTitle: this.inputTitle}, todoType: 'inbox'})
          .then(() => {
            this.inputTitle = ''
            window.rsqadmg.exec('hideLoader')
            window.rsqadmg.execute('toast', {message: '创建成功'})
          })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .inbox-main{
    min-height: 100%;
  }
  .tips{
    position: fixed;
    bottom: 3.8%;
    z-index: 0;
    color: #9B9B9B;
    font-size: 14px;
    line-height: 18px;
    width: 93.2%;
    text-align: center;
    margin: 0 auto;
    left: 0;
    right: 0;
    height: 4.9%;
  }
  .inbox-item{
    background-color: white;
    border-bottom:1px solid #E3E3E3 ;
    position: relative;
    z-index: 2;
  }
  .wrap{
    position: fixed;
    height: 1.45rem;
    width: 100%;
    top: 10px;
    left: 0;
    right: 0;
    z-index: 2;
  }
  .topest{
    background-color: #F8F8F8;
    height: 20px;
    z-index: 2;
    position: fixed;
    width: 100%;
  }
  .create{
    box-sizing: border-box;
    display: block;
    text-align: center;
    width:45px;
    height: 26px;
    line-height: 0.66rem;
    border-radius: 2px;
    font-size: 13px;
    color:#fff;
    position: absolute;
    margin-top: -0.33rem;
    top: 50%;
    right:0.35rem;
    z-index: 3;
    line-height: 26px;
    background-color: #2F7DCD;
  }
  .write{
    line-height: 0.612rem;
    height: 56px;
    border-bottom:1px solid #E3E3E3;
    border-top:1px solid #E3E3E3;
    background: #FFFFFF;
    padding-left:0.3rem;
    padding-right: 2.432rem;
    margin-bottom: 0.224rem;
    z-index: 2;
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    border-radius: 0;
  }
  .write::-webkit-input-placeholder { /* WebKit browsers */
    font-family: PingFangSC-Regular;
    font-size: 0.453rem;
    color: #999999;
    height: 1.4rem;
  }
  .margin-block {
    height: 1.9rem;
    z-index: 1;
    margin-bottom: 20px
  }
  .input-panel {
    position: fixed;
    top:0;height: 50px;width:100%;z-index:99999;
  }
  .input-title {
    box-sizing: border-box;
    width: 80%;height:100%;
    padding: 10px;
  }
</style>
