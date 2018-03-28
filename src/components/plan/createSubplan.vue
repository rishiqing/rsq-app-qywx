<template>
  <div>
    <input placeholder="新建子计划" class="createSubplan" v-model="name" />
    <ul>
      <li v-for="item in childPlanlist">
          <div>{{item.name}}</div>
      </li>
    </ul>
    <v-touch @tap="create">
      <div>提交</div>
    </v-touch>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        name: ''
      }
    },
    computed: {
      childPlanlist () {
        return this.$store.state.childPlanlist
      },
      currentPlan () {
        return this.$store.state.currentPlan
      }
    },
    methods: {
      create () {
        var params = {
          name: this.name,
          kanbanId: this.currentPlan.id
        }
        var that = this
        this.$store.dispatch('postSubPlan', params).then((res) => {
          that.$store.commit('ADD_SUB_PLAN', res)
        })
      }
    }
  }
</script>
