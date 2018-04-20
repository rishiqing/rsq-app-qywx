<template>
  <r-slider-delete @deleteItem="deleteItem">
    <li class="todoItem">
      <v-touch
        style="margin-left: 1rem"
        @tap="clickItem($event)">
        <div
          :class="{'margin-left':!isCheckable}"
          class="title-todo">
          <span
            :class="{'delay-width':isDelay,'common-width':!isDelay, 'text-grey': item.pIsDone, 'text-mid-line': item.pIsDone,'real-width-sche':isMaxlength(item)}"
            class="todo-content-sche" >
            {{ item.pTitle }}
          </span>
          <span
            v-show="isDelay"
            :class="{'is-alert': isDelay}"
            class="delayer">
            延期{{ delayDays }}天
          </span>
          <span
            v-if="!isCheckable"
            v-show="isFromSche"
            class="receive">
            我收到的
          </span>
          <span
            v-if="!isCheckable"
            v-show="isFromKanban"
            class="receive">
            来自计划
          </span>
        </div>
      </v-touch>
      <v-touch
        v-if="isCheckable"
        class="todo-checkbox"
        @tap="clickCheckOut">
        <i
          :class="{'icon-check_box_outline_blank': !item.pIsDone, 'icon-check': item.pIsDone}"
          class="icon2-check-box select"/>
        <div
          :class="{'for-hide':item.pIsDone}"
          class="hide"/>
        <i
          :class="{'isdisplay':item.pIsDone}"
          class="icon2-selected hide"/>
      </v-touch>
    </li>
  </r-slider-delete>
</template>
<style lang="scss" scoped>
  .isfrom{
    display: none;
  }
  .todo-checkbox{
  }
  .receive{
    border: 1px solid #55A8FD;
    border-radius: 2px;
    width: 1.55rem;
    height: 0.594rem;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #55A8FD;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: -0.405rem;
  }
  .contain-tag {position:absolute;left:0;height:20px;width:2px;top:50%;margin-top:-10px;}
  .title-todo{
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
  .margin-left{
    margin-left:-1rem
  }
  .real-width-sche{}
  .todo-content-sche{
    font-family: PingFangSC-Regular;
    font-size: 17px;
    text-overflow: ellipsis;
    overflow: hidden;
    height: 1.6rem;
    white-space:nowrap
  }
  .delay-width{
    width: 70%;
  }
  .common-width{
    width: 95%;
  }
  .hide{
    display: none;
  }
  .isdisplay{
    display: block;
    position:absolute;
    top:0.58rem;
    right: 0.3rem;
    font-size: 15px;
    color:#55A8FD;
  }
  .for-hide{
    position: absolute;
    top:0.52rem;
    left: 0.65rem;
    display: block;
    width: 2px;
    height: 2px;
    background-color: white;
    border: 1px solid white;
  }
  .delayer{
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #FF7A7A;
    letter-spacing: 0;
    margin-right: 0.5rem;
  }
  li{
    padding:0;
    line-height:1.612rem ;
    position: relative;
    border-bottom:1px solid #E0E0E0 ;
  }
  li:last-child{
    border-bottom: none;
  }
  .delete:last-child .slider .content li {
    border-bottom: none;
  }
  .todoItem{
    width: 70%;
    /*display: inline-block;*/
  }
  .todoItem:last-child{
    border-bottom: none;
  }
  .item-title{}
  .select{
    color:#b9b9bc;
    font-size: 17px;
    display: block;
    margin: 0.58rem 0 0 0.3rem;
    /*position: absolute;*/
    /*top:0.58rem;*/
    /*<!--top:50%;-->*/
    /*<!--margin-top: -0.22rem;-->*/
    /*left:0.2rem;*/
    /*background: #FFFFFF;*/
    border-radius: 1px;
  }
  .todo-checkbox {
    position: absolute;
    top: 0;
    left: -0.1rem;
    width: 1rem;
    height: 1.6rem;
  }
</style>
<script>
  import dateUtil from 'ut/dateUtil'
  import SliderDelete from 'com/pub/SliderDelete'
//  import bus from 'com/bus'
  export default {
    name: 'TodoItem',
    components: {
      'r-slider-delete': SliderDelete
    },
    props: {
      item: {
        type: Object,
        required: true
      },
      isCheckable: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {}
    },
    computed: {
      currentTodo () {
        return this.$store.state.todo.currentTodo || {}
      },
      currentDate () { return this.$store.getters.defaultTaskDate },
      isIE () { return this.item.pContainer === 'IE' },
      isIU () { return this.item.pContainer === 'IU' },
      isUE () { return this.item.pContainer === 'UE' },
      isUU () { return this.item.pContainer === 'UU' },
      delayDays () {
        return dateUtil.getDelayDays(this.item, this.currentDate, false)
      },
      isDelay () {
        return this.delayDays
      },
      isFromSche () {
        return this.item.isFrom === 'receive'
      },
      isFromKanban () {
        return this.item.isFrom === 'kanban'
      }
    },
    methods: {
      deleteCurrentTodo (p) {
        return this.$store.dispatch('deleteTodo', p)
      },
      prepareDelete () {
        var that = this
        if (that.currentTodo.isCloseRepeat) {
          window.rsqadmg.exec('confirm', {
            message: '确定要删除此任务？',
            success () {
//              window.rsqadmg.execute('showLoader', {text: '删除中...'})
              that.deleteCurrentTodo({todo: that.currentTodo})
                .then(() => {
                  //                  window.rsqadmg.exec('hideLoader')
                  window.rsqadmg.execute('toast', {message: '删除成功'})
                })
            }
          })
        } else {
          window.rsqadmg.exec('actionsheet', {
            buttonArray: ['仅删除此任务', '删除此任务及以后的任务', '删除所有的重复任务'],
            success: function (res) {
              var promise
              switch (res.buttonIndex) {
                case 0:
                  promise = that.deleteCurrentTodo({todo: that.currentTodo, isRepeat: true, type: 'today'})
                  break
                case 1:
                  promise = that.deleteCurrentTodo({todo: that.currentTodo, isRepeat: true, type: 'after'})
                  break
                case 2:
                  promise = that.deleteCurrentTodo({todo: that.currentTodo, isRepeat: true, type: 'all'})
                  break
                default:
                  break
              }
              promise.then(() => {
                window.rsqadmg.exec('hideLoader')
                window.rsqadmg.execute('toast', {message: '删除成功'})
//                  that.$router.replace(window.history.back())
              })
            }
          })
        }
      },
      deleteItem () {
//        console.log('todoitem到了')
//        bus.$emit('deleteItemList')
//        e.stopPropagation()
        var that = this
        this.$store.dispatch('setCurrentTodo', this.item).then(
          () => {
            that.prepareDelete()
          }
        )
      },
      isMaxlength (item) {
        return item.pTitle.length > 10
      },
      clickItem (e) {
        //  这个是点击跳到编辑界面
        if (!e.target.classList.contains('icon2-check-box')) {
          this.$emit('todo-item-click', this.item)
          e.preventDefault()
        }
      },
      clickCheckOut (e) {
        this.$emit('todo-item-check', this.item, !this.item.pIsDone)
        e.preventDefault()
      }
    }
  }
</script>
