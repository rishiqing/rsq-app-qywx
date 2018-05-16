import Vue from 'vue'

import BaseSelectMember from './BaseSelectMember.vue'

let SelectMember = Vue.extend(BaseSelectMember)

let selectMember = null
/**
 * selectMember单例模式
 * @returns {ActionSheet}
 */
function getSelectMemberModal () {
  if (!selectMember) {
    selectMember = new SelectMember()
  }
  return selectMember
}

function show (options) {
  options = options || {}
  const vm = getSelectMemberModal()

  // vm.title = options.title || '选择成员'
  vm.idAttribute = options.idAttribute || 'id'
  vm.nameAttribute = options.nameAttribute || 'name'
  vm.avatarAttribute = options.avatarAttribute || 'avatar'
  vm.btnText = options.btnText || '确定'
  vm.maximum = options.maximum || 5
  vm.memberList = options.memberList || []
  vm.selectedIdList = options.selectedIdList || []
  vm.disabledIdList = options.disabledIdList || []
  vm.creatorIdList = options.creatorIdList || []
  vm.success = options.success || function () {}
  vm.cancel = options.cancel || function () {}
  vm.$on('self-close', close)

  //  append to body
  Vue.nextTick(function () {
    vm.$mount()
    document.body.appendChild(vm.$el)
  })
}

function close () {
  const vm = getSelectMemberModal()
  vm.$el.remove()
}

function confirmSelect () {
  const vm = getSelectMemberModal()
  vm.confirmSelect()
}

export default {
  show,
  close,
  confirmSelect
}
