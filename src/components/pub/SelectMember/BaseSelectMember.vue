<template>
  <div class="sel-canvas">
    <div class="sel-header">
      <div class="sel-search-wrap">
        <input
          v-model="nameSearch"
          type="text"
          class="sel-search"
          placeholder="搜索">
        <i class="icon2-search sel-icon-search"/>
        <v-touch
          v-show="nameSearch"
          tag="i"
          class="icon2-error sel-icon-reset"
          @tap="clearNameSearch"/>
      </div>
    </div>
    <div class="sel-body">
      <div class="sel-member-list-container">
        <ul
          v-if="filteredUsers.length !== 0"
          class="sel-member-list">
          <li
            v-for="member in filteredUsers"
            :key="member.id">
            <v-touch
              class="sel-member-info"
              @tap="changeSelect(member, !member.isSelected)">
              <div
                :class="{'sel-selected': member.isSelected}"
                class="sel-member-icon">
                <div class="sel-icon-selected-bg" />
                <i class="icon2-selected sel-icon-selected"/>
              </div>
              <div class="sel-member-avatar">
                <avatar
                  :src="member.avatar"
                  :username="member.name"
                  :size="36"
                  :round-radius="'2px'"
                  :background-color="'#4A90E2'"/>
              </div>
              <div
                :class="{'sel-disabled': member.isDisabled}"
                class="sel-member-name">
                {{ member.name }}
              </div>
            </v-touch>
            <div class="sel-member-tag">
              {{ member.isCreator ? '创建者' : '' }}
            </div>
          </li>
        </ul>
        <div
          v-else
          class="sel-member-blank">
          <div>
            <i class="icon2-search"/>
          </div>
          <p>搜索无结果</p>
        </div>
      </div>
    </div>
    <div class="sel-footer">
      <div class="sel-footer-list-container">
        <ul class="sel-footer-list">
          <v-touch
            v-for="m in localSelectedList"
            :key="m.id"
            tag="li"
            @tap="changeSelect(m, false)">
            <avatar
              :src="m.avatar"
              :username="m.name"
              :size="34"
              :round-radius="'2px'"
              :background-color="'#4A90E2'"/>
          </v-touch>
        </ul>
      </div>
      <v-touch
        class="sel-footer-confirm"
        @tap="confirmSelect">
        确定({{ selectedCount }})
      </v-touch>
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
    position: absolute;top: 8px;right: 10px;color: #8D8D92;
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
    vertical-align: top;
    margin-left: 10px;
    margin-top: 8px;
  }
  .sel-footer-confirm {
    position: absolute;
    top: 0;right: 0;height: 50px;
    width: 92px;
    line-height: 50px;
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
  .sel-member-icon {
    position: relative;width: 16px;
  }
  .sel-icon-selected-bg {
    box-sizing: border-box;
    position: absolute;
    top: 50%; margin-top: -8px;
    width: 16px;height: 16px;border-radius: 50%;
    border: solid 1px #DADADE;
    background: #FEFEFE;
  }
  .sel-selected .sel-icon-selected-bg {
    border: solid 1px #5684BA;
    background: #5684BA;
  }
  .sel-icon-selected {
    display: none;
    font-size: 10px;
    padding: 3px;
  }
  .sel-selected .sel-icon-selected {
    display: block;
    color: #FFFFFF;
    position: absolute;
    top: 50%; margin-top: -8px;
  }
  .sel-member-avatar {
    box-sizing: border-box;padding: 10px;
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
  .sel-disabled {
    color: #999999;
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
        //  ------------------------------------------
        //  传入的参数，只读，不要修改
        btnText: '',
        idAttribute: '',
        nameAttribute: '',
        avatarAttribute: '',
        maximum: 0,    //  最多选择的用户数量
        memberList: [],    //  所有用户的列表
        selectedIdList: [],  //  默认选中的用户列表
        disabledIdList: [],  //  不可更改选择状态的用户id列表
        creatorIdList: [],  //  任务创建者的id列表
        success: function () {},  //  点击确定按钮的回调
        cancel: function () {},  //  点击取消按钮的回调
        //  -------------------------------------------
        //  选择框操作的临时存储对象
        localList: [],
        localSelectedList: [],
        nameSearch: ''
      }
    },
    computed: {
      filteredUsers () {
        if (!this.nameSearch) {
          return this.localList
        } else {
          return this.localList.filter(staff => {
            return staff.name.indexOf(this.nameSearch) !== -1
          })
        }
      },
      selectedCount () {
        return this.localSelectedList.length
      }
    },
    mounted () {
      this.makeLocalList()
      //  如果通过任意方式跳出页面了，那么关闭当前选择框
      window.onpopstate = () => {
        this.selfClose()
      }
    },
    methods: {
      selfClose () {
        window.onpopstate = null
        this.cancel()
        this.$emit('self-close')
      },
      clearNameSearch () {
        this.nameSearch = ''
      },
      /**
       * 将memberList/selectedIdList/disabledIdList/creatorIdList整合成localList的对象格式。
       * localList中单个对象的格式如下：
       * {
       *   id: 123，
       *   name: 'aaa',
       *   avatar: 'xxxxx',
       *   isSelected: false,
       *   isDisabled: false,
       *   isCreator: false,
       *   orgUser: {}
       * }
       * 其中orgUser表示的是memberList中的原始对象的指针，用来方便获取用户的选择，不要修改原始对象中的数据！
       * @returns {any[]}
       */
      makeLocalList () {
        this.nameSearch = ''
        this.localSelectedList = []
        this.localList = this.memberList.map(mem => {
          const id = mem[this.idAttribute]
          const isSelect = this.selectedIdList.indexOf(id) !== -1
          const isDisabled = this.disabledIdList.indexOf(id) !== -1
          const isCreator = this.creatorIdList.indexOf(id) !== -1
          const obj = {
            id: id,
            name: mem[this.nameAttribute],
            avatar: mem[this.avatarAttribute],
            isSelected: isSelect,
            isDisabled: isDisabled,
            isCreator: isCreator,
            orgUser: mem
          }
          if (isSelect) {
            this.localSelectedList.push(obj)
          }
          return obj
        })
      },
      changeSelect (mem, isSelect) {
        if (mem.isDisabled) {
          return
        }
        if (this.selectedCount >= this.maximum) {
          return window.rsqadmg.exec('alert', {message: '超出最大数量限制'})
        }
        mem.isSelected = isSelect
        if (isSelect) {
          this.localSelectedList.push(mem)
        } else {
          const index = this.localSelectedList.indexOf(mem)
          if (index !== -1) {
            this.localSelectedList.splice(index, 1)
          }
        }
      },
      confirmSelect () {
        const arr = this.localSelectedList.map(mem => {
          return mem.orgUser
        })
        this.success(arr)
        this.selfClose()
      }
    }
  }
</script>
