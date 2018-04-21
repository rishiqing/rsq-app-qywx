<template>
  <ul
    :class="{'itemList':itemcount}"
    class="sche-list">
    <r-todo-item
      v-for="item in items"
      :key="item.id"
      :item="item"
      :is-checkable="isCheckable"
      @todo-item-click="showEdit"
      @todo-item-check="checkTodo"/>
  </ul>
</template>
<script>
  import TodoItem from 'com/sche/TodoItem'
  export default {
    name: 'TodoItemList',
    components: {
      'r-todo-item': TodoItem
    },
    props: {
      items: {
        type: Array,
        required: true
      },
      isCheckable: {
        type: Boolean,
        default: false
      }    //  是否显示完成复选框
    },
    data () {
      return {}
    },
    computed: {
      itemcount () {
        return this.items.length >= 8 && this.isCheckable
      }
    },
    methods: {
      showEdit (item) {
        this.$store.dispatch('setCurrentTodo', item)// 设置当前todo不管是inbox的todo还是ssche的todo
        this.$router.push('/todo/' + item.id)
      },
      checkTodo (item, status) {
        this.$store.dispatch('submitTodoFinish', {item: item, status: status})
            .then(function () {
              this.$store.dispatch('saveTodoAction', {editItem: {status: status}})
                .then(() => {
                })
            })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .sche-list{
    background-color: white;
    border-top:1px solid #DADADA ;
    padding-left: 3%;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .itemList{
    padding-bottom:1.306rem;
  }
</style>
