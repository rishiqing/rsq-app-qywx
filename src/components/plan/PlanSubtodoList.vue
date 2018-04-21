<template>
  <div class="">
    <div class="for-cover"/>
    <div class="wrap">
      <input
        v-model="inputTitle"
        class="write"
        type="text"
        placeholder="输入子任务标题">
      <v-touch
        v-show="inputTitle !== ''"
        class="btn-create"
        @tap="saveTodo">
        <button class="create" >创建</button>
      </v-touch>
    </div>
    <div class="margin-block"/>
    <ul
      :class="{'has-border': hasChild}"
      class="sublist">
      <template v-if="subItems">
        <li
          v-for="item in subItems"
          :key="item.id"
          class="sublist-item">
          <v-touch
            class="wrap-sub-icon"
            @tap="clickCheckOut(item)">
            <i class="icon2-check-box select-sub"/>
            <div
              :class="{'for-hide-sub':item.isDone}"
              class="hide"/>
            <i
              :class="{'is-display-sub':item.isDone}"
              class="icon2-selected hide"/>
          </v-touch>
          <v-touch
            class="wrap-input"
            @tap="showEditSubtodo(item)">
            <span
              ref="titleInput"
              :class="{ 'text-grey': item.isDone, 'text-mid-line': item.isDone}"
              class="list-below">
              {{ item.name }}
            </span>
          </v-touch>
        </li>
      </template>
    </ul>
  </div>
</template>
<script>
  import TodoItemList from 'com/sche/TodoItemList'
  export default {
    components: {
      'r-todo-item-list': TodoItemList
    },
    data () {
      return {
        titleName: '子任务',
        inputTitle: '',
        seen: true,
        judge: false
      }
    },
    computed: {
      currentKanbanItem () {
        return this.$store.state.plan.currentKanbanItem
      },
      subItems () {
        return this.currentKanbanItem.subItems || []
      },
      kanbanItemId () {
        return this.currentKanbanItem.id
      },
      hasChild () {
        return this.subItems.length !== 0
      }
    },
    mounted () {
      window.rsqadmg.exec('setTitle', {title: this.titleName})
    },
    methods: {
      showEditSubtodo (item) {
        this.$store.dispatch('setCurrentSubtodo', item)
        this.$router.push('/plan/todo/' + this.currentKanbanItem.id + '/subtodo/' + item.id)
      },
      saveTodo () {
        window.rsqadmg.execute('showLoader', {text: '创建中...'})
        this.$store.dispatch('createKanbanSubtodo', {name: this.inputTitle, kanbanItemId: this.kanbanItemId})
          .then(() => {
            this.inputTitle = ''
            window.rsqadmg.exec('hideLoader')
            window.rsqadmg.execute('toast', {message: '创建成功'})
          })
      },
      clickCheckOut (item) {
        this.$store.dispatch('updateKanbanSubtodo', {id: item.id, isDone: !item.isDone})
            .then(function () {
              // this.$store.dispatch('saveTodoAction', {editItem: {status: !item.isDone, type: 17}})
              //   .then(() => {
              //   })
            })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .is-editable{
    disabled:true
  }
  .is-display-remind{
    display: none;
  }
  .remind-subtodo{
    font-family: PingFangSC-Regular;
    color:#A3A3A3;
    font-size: 0.32rem;
    margin-top:0.16rem ;
    padding-left: 0.6rem;
  }
  .wrap-sub-icon{
    height: 1.22rem;
    display: flex;
    align-items: center;
    position: relative;
  }
  .wrap-input{
    display: flex;
    align-items: center;
    width: 90%;
  }
  .for-cover{
    height: 0.266rem;
    z-index:1;
    width: 100%;
    background-color: #F8F8F8;
    position: fixed;
  }
  .wrap {
    position: fixed;
    width: 100%;
    top: 10px;
    left: 0;
    right: 0;
    z-index: 2;
  }
  input::-webkit-input-placeholder { /* WebKit browsers */
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #999999;
  }
  .select-sub{
    color: #B1B1B1;
  }
  .sublist{
    background-color: white;
    padding-left: 0.6rem;
    z-index: 0;
  }
  .has-border{
    border-top:1px solid #E0E0E0;
    border-bottom:1px solid #E0E0E0;
  }
  .list-below{
    border:none;
    margin-left: 0.35rem;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    width: 98%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space:nowrap;
  }
  .sublist-item:last-child{
    border-bottom: none;
  }
  .sublist-item{
    position: relative;
    border-bottom:1px solid #DADADA ;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    height: 1.22rem;
    display: flex;
    align-items: center;
  }
  .top-subtodo{
    position:fixed;
    background-color: white;
    line-height: 1.226rem;;
    top:0.266rem;
    padding-left:5%;
    width:100%;
    z-index: 1;
  }
  .add{
    position: absolute;
    top:0.4rem;
    font-size: 0.4rem;
    background-color: #55A8FD;
    color:white;
    border: 1px solid #55A8FD;
    border-radius: 50%;
    left:0.55rem;
    -webkit-appearance: none;
  }
  .title-todo input{
    border: none;
  }
  .top{
    border-bottom:1px solid #DADADA ;
    border-top:1px solid #DADADA ;
  }
  .top>span{
    display: block;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #55A8FD;
  }
  .new-create{
    display: block;
    margin-left: 0.8rem;
    font-family:PingFangSC-Regular;
    font-size: 17px;
    color: #55A8FD;
  }
  .hide{
    display: none;
  }
  .todo-content{
    margin-left: 0.6rem;
  }
  ul{
    position: relative;
    margin-top:0.666rem;
    padding-left: 5%;
  }
  li{

  }
  li:first-child{
  }
  .is-display-sub{
    display: block;
    position:absolute;
    top:0.36rem;
    left: 0.05rem;
    font-size: 15px;
    color:#55A8FD;
  }
  .for-hide-sub{
    position: absolute;
    top:0.36rem;
    left: 0.39rem;
    display: block;
    width: 2px;
    height: 2px;
    background-color: white;
    border: 1px solid white;
  }
  .create{
    box-sizing: border-box;
    text-align: center;
    border: 1px solid #55A8FD;
    border-radius: 2px;
    width:1.413rem;
    height: 0.66rem;
    line-height: 0.66rem;
    font-size: 0.35rem;
    color:#55A8FD;
    position: absolute;
    top:50%;
    right:0.35rem;
    margin-top: -0.33rem;
    z-index:2;
    background-color: white;
  }
  .write{
    background: #FFFFFF;
    border-bottom:1px solid #E3E3E3;
    border-top:1px solid #E3E3E3;
    top: 0.266rem;
    padding-left:0.6rem;
    z-index: 1;
    line-height: 0.6rem;
    padding-right: 2.432rem;
    padding-top: 0.313rem;
    padding-bottom: 0.313rem;
  }
  .margin-block {
    height: 50px;
    z-index: 3;
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
