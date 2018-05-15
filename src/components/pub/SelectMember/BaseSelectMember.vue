<template>
  <div class="sel-canvas">
    <div class="sel-header">
      <div class="sel-search-wrap">
        <input
          type="text"
          class="sel-search"
          placeholder="搜索">
        <i class="icon2-add-circle add sel-icon-search"/>
        <i class="icon2-add-circle add sel-icon-reset"/>
      </div>
    </div>
    <div class="sel-body">
      <div class="sel-member-list-container">
        <ul
          v-if="true"
          class="sel-member-list">
          <li
            v-for="member in mockList"
            :key="member.id">
            <div class="sel-member-info">
              <div class="sel-member-icon">
                <i class="icon2-add-circle add"/>
              </div>
              <div class="sel-member-avatar">
                <img :src="member.avatar">
              </div>
              <div class="sel-member-name">
                {{ member.name }}
              </div>
            </div>
            <div class="sel-member-tag">
              {{ member.isCreator ? '创建者' : '' }}
            </div>
          </li>
        </ul>
        <div
          v-else
          class="sel-member-blank">
          <div>
            <i class="icon2-add-circle add"/>
          </div>
          <p>搜索无结果</p>
        </div>
      </div>
    </div>
    <div class="sel-footer">
      <div class="sel-footer-list-container">
        <ul class="sel-footer-list">
          <li
            v-for="i in [1,2,3,4,5,6,7,8,9,10,11,12,13,14,16,17,18,19,20,21,22,23]"
            :key="i">
            <img src="http://shp.qpic.cn/bizmp/sfD9v8uDETrX0O6zM5Aw0nkDxHyPPc2on1Ca5qsibmtE6b5lDhvY2TA/">
          </li>
        </ul>
      </div>
      <div class="sel-footer-confirm">确定(100)</div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .sel-canvas {
    position: fixed;
    top: 0;right: 0;bottom: 0;left: 0;
    z-index: 10000;
    background: #FFFFFF;
  }
  .sel-header {
    position: fixed;
    box-sizing: border-box;
    top: 0;right: 0;left:0;height: 51px;
    z-index: 10100;
    background: #F5F5F5;
    padding: 8px 10px;
    box-shadow: inset 0 0 0 0 #D9D9D9;
    border-bottom: solid 1px #E0E0E0;
  }
  .sel-footer {
    position: fixed;
    box-sizing: border-box;
    right: 0;bottom: 0;left:0;height: 51px;
    z-index: 10100;
    background: #FAFAFA;
    border-top: solid 1px #D5D5D5;
  }
  .sel-body {
    overflow: auto;
    padding: 51px 0 51px;
  }
  .sel-search-wrap {
    position: relative;
    box-sizing: border-box;
    width: 100%;height: 100%;
    border-radius: 2px;
    background: #FFFFFF;
    border: solid 1px #D7DADE;
    padding: 2px 36px 2px 24px;
  }
  .sel-search {
    width: 100%;height: 100%;
  }
  .sel-icon-search {
    position: absolute;top: 8px;left: 5px;
  }
  .sel-icon-reset {
    position: absolute;top: 8px;right: 10px;
  }
  .sel-footer-list-container {
    position: absolute;
    left: 0;top: 0;bottom: 0;right: 92px;
    white-space: nowrap;
    overflow-y: auto;
  }
  ul.sel-footer-list {
    height: 100%;
    display: inline-block;
  }
  ul.sel-footer-list li:last-child {
    margin-right: 10px;
  }
  ul.sel-footer-list li {
    display: inline-block;
    margin-left: 10px;
    margin-top: 8px;
  }
  ul.sel-footer-list li img {
    width: 34px;height: 34px;border-radius: 2px;
  }
  .sel-footer-confirm {
    position: absolute;
    top: 0;right: 0;height: 48px;
    width: 92px;
    line-height: 48px;
    text-align: center;
    color: #5176AB;
    font-size: 18px;
    background: #FAFAFA;
  }
  ul.sel-member-list {}
  ul.sel-member-list li {
    position: relative;
    height: 57px;
    padding-left: 15px;
  }
  .sel-member-info {
    box-sizing: border-box;
    height: 100%;
    border-bottom: solid 1px #E3E3E3;
    overflow: hidden;
  }
  .sel-member-info > * {
    float: left;
    height: 100%;
    line-height: 56px;
  }
  .sel-member-icon {}
  .sel-member-avatar {
    margin: 0 10px;
  }
  .sel-member-avatar img {
    width: 36px;height: 36px;margin-top: 10px;
  }
  .sel-member-name {
    font-size: 16px;
  }
  .sel-member-tag {
    position: absolute;
    top: 0;right: 0;height: 100%;
    padding-right: 15px;
    line-height: 56px;color: #4F77AA;
  }
  .sel-member-blank {
    margin: 100px auto 0;
    color: #9B9B9B;
    text-align: center;
  }
  .sel-member-blank i {
    font-size: 76px;
  }
  .sel-member-blank p {
    font-size: 14px;
  }
</style>
<script>
  import Avatar from 'com/pub/TextAvatar'

  export default{
    components: {
      'avatar': Avatar
    },
    data () {
      return {
        btnText: '',
        maximum: 0,    //  最多选择的用户数量
        memberList: [],    //  所有用户的列表
        selectedList: [],  //  默认选中的用户列表
        disabledIdList: [],  //  不可更改选择状态的用户id列表
        success: function () {},  //  点击确定按钮的回调
        cancel: function () {},  //  点击取消按钮的回调
        localList: [],
        memberName: '',
        selectCount: 0,
        mockList: [
          {
            id: 1,
            name: '刘磊',
            avatar: 'http://shp.qpic.cn/bizmp/sfD9v8uDETrX0O6zM5Aw0nkDxHyPPc2on1Ca5qsibmtE6b5lDhvY2TA/',
            isCreator: false
          },
          {
            id: 2,
            name: '刘浩',
            avatar: 'http://shp.qpic.cn/bizmp/sfD9v8uDETrX0O6zM5Aw0nkDxHyPPc2on1Ca5qsibmtE6b5lDhvY2TA/',
            isCreator: true
          },
          {
            id: 3,
            name: '刘镇武',
            avatar: 'http://shp.qpic.cn/bizmp/sfD9v8uDETrX0O6zM5Aw0nkDxHyPPc2on1Ca5qsibmtE6b5lDhvY2TA/',
            isCreator: false
          }
        ]
      }
    },
    computed: {
      filteredUsers () {
        var self = this
        return self.localList.filter(function (staff) {
          return staff.name.indexOf(self.memberName) !== -1
        })
      }
    },
    methods: {
      selfClose (e) {
        window.onpopstate = null
        this.cancel()
        this.$emit('self-close')
        e.preventDefault()
      },
      makeLocalList () {
        var selectIds = this.selectedList.map(function (obj) {
          return obj.userId
        })
        var ct = 0
        var list = this.memberList.map(function (mem) {
          var isSelect = (selectIds.indexOf(mem.userId) !== -1)
          if (isSelect) {
            ct += 1
          }
          return {
            id: mem.userId,
            isSelected: isSelect,
            name: mem.name,
            avatar: mem.avatar,
            orgUser: mem
          }
        })
        this.selectCount = ct
        return list
      },
      toggleSelect (mem) {
        if (this.disabledIdList.indexOf(mem.id) !== -1) {
          return
        }
        var c = this.selectCount + (mem.isSelected ? -1 : 1)
        if (c >= this.maximum || c < 0) {
          return window.rsqadmg.exec('alert', {message: '超出最大数量限制'})
        }
        this.selectCount = c
        mem.isSelected = !mem.isSelected
      },
      confirmSelect (e) {
        var arr = []
        this.localList.forEach(function (mem) {
          if (mem.isSelected) {
            arr.push(mem.orgUser)
          }
        })
        this.success(arr)
        this.selfClose()
        e.preventDefault()
      }
    },
    attached () {
      this.localList = this.makeLocalList()
      var that = this
      //  如果通过任意方式跳出页面了，那么关闭当前选择框
      window.onpopstate = function () {
        that.selfClose()
      }
    }
  }
</script>
