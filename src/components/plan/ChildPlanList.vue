<template>
  <ul
    class="c-plan-list">
    <c-plan-item
      v-for="(item,index) in items"
      :key="index"
      :item="item"/>
  </ul>
</template>
<script>
  import ChildPlanItem from 'com/plan/ChildPlanItem'
  export default {
    name: 'ChildPlanItem',
    components: {
      'c-plan-item': ChildPlanItem
    },
    props: {
      items: {
        type: Array,
        required: true
      }
    },
    data () {
      return {}
    },
    methods: {
    }
  }
</script>
<style lang="scss" scoped>
  .c-plan-list{
    background-color: white;
    border-top:1px solid #DADADA ;
    padding-left: 3%;
    overflow-y: auto;
    overflow-x: hidden;
  }
</style>
