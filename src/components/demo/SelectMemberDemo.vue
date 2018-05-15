<template>
  <div>
    <div class="btn-group" >
      <div class="btn-wrap">
        <v-touch
          tag="a"
          class="weui-btn weui-btn_primary"
          href="javascript:;"
          @tap="openMemberSelector">
          打开选人框
        </v-touch>
      </div>
    </div>
  </div>
</template>

<script>
  import SelectMember from 'com/pub/SelectMember'

  export default {
    name: 'SelectMemberDemo',
    methods: {
      openMemberSelector () {
        SelectMember.show({
          memberList: this.localList,
          selectedList: this.selectedLocalList,
          disabledIdList: this.disabledLocalList,
          success (selList) {
            // var idArray = util.extractProp(selList, 'emplId')
            // that.$store.dispatch('fetchRsqidFromUserid', {corpId: corpId, idArray: idArray})
            //   .then(function (idMap) {
            //     that.selectedLocalList = util.getMapValuePropArray(idMap)
            //     that.$emit('member-changed', that.selectedLocalList)
            //   })
          },
          cancel () {
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
