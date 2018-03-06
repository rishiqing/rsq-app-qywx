<template>
  <div>
  <label class="demo--label selectAllheight">
    <input type="checkbox" class="demo--radio" @change="selectAll" ref="selectAll">
    <span class="demo--checkbox demo--radioInput"></span>
    <span class="selectAll">全选</span>
  </label>
  <ul>
    <li v-for="item in memeberList" class="listMember">
      <v-touch class="wrap-member">
        <label class="demo--label">
          <input type="checkbox" class="demo--radio" ref="radioInput"  @change="compute($event, item)">
          <span class="demo--checkbox demo--radioInput"></span>
          <avatar :src="item.realName"
                  :username="item.realName"
                  :size="30">
          </avatar>
          <span class="memberName">{{item.realName}}</span>
        </label>
      </v-touch>
    </li>
  </ul>
  </div>
</template>
<script>
  import Avatar from 'com/pub/TextAvatar'
  export default {
    data () {
      return {
        number: 0
      }
    },
    components: {
      'avatar': Avatar
    },
    computed: {
      memeberList () {
        return this.$store.state.memberList
      },
      selectedMember () {
        return this.$store.state.selectedMember
      }
    },
    methods: {
      compute (e, item) {
        if (e.target.checked) {
          this.number += 1
          this.selectedMember.push(item.id.toString())
        } else {
          this.number -= 1
          var index = this.selectedMember.indexOf(item.id.toString())
          this.selectedMember.push(index, 1)
        }
        console.log(this.number)
      },
      selectAll () {
        console.log('改变了')
        if (this.$refs.selectAll.checked) {
          this.$refs.radioInput.forEach(item => { item.checked = true })
        } else {
          this.$refs.radioInput.forEach(item => { item.checked = false })
        }
      },
      initData () {
      }
    },
    created () {
      this.initData()
    },
    mounted () {
      window.rsqadmg.exec('setTitle', {title: '添加成员'})
      var btnParams
      var that = this
      var content = '已选' + this.number
      btnParams = {
        btns: [{key: 'toInbox', name: content}],
        success (res) {
          if (res.key === 'toInbox') {
            that.$router.push('/inbox')
          }
        }
      }
//      this.fetchUsers()
      window.rsqadmg.execute('setOptionButtons', btnParams)
    },
    beforeRouteLeave (to, from, next) {
      this.$emit('saveMember', this.selectedMember)
      next()
    }
  }
</script>
<style>
  .listMember{
    padding-left: 0.3rem;
    border-bottom: 1px solid #e0e0e0;
    height: 1.5rem;
    display: flex;
    align-items: center;
  }
  .memberName{
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #3D3D3D;
  }
  .selectAllheight{
    height: 1rem;
    margin-top: 1rem;
    border-top: 1px solid #e0e0e0;
    border-bottom: 1px solid #e0e0e0;
    padding-left: 0.3rem;
  }
  .selectAll{
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #3D3D3D;
  }
  .demo--checkbox{
    font-size: 15px;
  }
  .wrap-member{
    display: flex;
    align-items: center;
  }
  input.demo--radio{
    display:none
  }
  label.demo--label{
    display: inline-block;
    display: flex;
    align-items: center;
    width: 100%;
    /*border-bottom: 1px solid #e0e0e0;*/
  }
  .demo--radioInput{
    background-color:#fff;
    border:1px solid rgba(0,0,0,0.15);
    border-radius:50%;
    display:inline-block;
    height:16px;
    margin-right:10px;
    margin-top:-1px;
    vertical-align:middle;
    width:16px;
    line-height:1
  }
  .demo--radio:checked + .demo--radioInput:after{
    background: #3296FA;
    border: 1px solid #3296FA;
    border-radius:50%;
    content:"";
    display:inline-block;
    height:12px;
    margin:1px;
    width:12px
  }
</style>
