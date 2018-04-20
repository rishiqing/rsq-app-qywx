export default {
  //  第三方集成authServer的接口
  'AUTH_TO_RSQID': 'idmap/userid2rsqid',
  'AUTH_TO_USERID': 'idmap/rsqid2userid',
  'SEND_TO_CONV': 'msg/sendtoconversation',
  'SEND_TO_CORP_CONV': 'msg/sendasynccorpmessage',
  'SEND_REMIND': 'msg/remind',
  'SEND_NOTIFY': 'msg/sendNotification',
  'SEND_QYWX_REMIND': 'alert/set',
  'AVATAR_CDN': 'https://rishiqing-avatar.oss-cn-beijing.aliyuncs.com/',
  'SYS_AVATAR_CDN': 'https://rishiqing-images.oss-cn-beijing.aliyuncs.com/avatar/',
  'CHECK_AUTH': 'task/login/authAjax',
  'POST_LOGIN': 'task/j_spring_security_check',
  'GET_LOGOUT': 'task/j_spring_security_logout',
  'GET_INBOX_TODOS': 'task/mainTodoList/getInboxTodos',
  'POST_SUBTODO': 'task/v2/subTodo',
  'POST_SUBTODO_PROP': 'task/v2/subTodo',
  'POST_NEW_TODO': 'task/v2/todo',
  'PUT_TODO_PROP': 'task/v2/todo/:id',
  'DELETE_TODO': 'task/v2/todo/:id',
  'DELETE_REPEAT_TODO': 'task/v2/todo/',
  'DELETE_COMMENT_TODO': 'task/v2/todoComment/:id',
  'DELETE_SUBTODO': 'task/v2/subTodo/:id',
  'GET_TODO': 'task/v2/todo/:id',
  'GET_SCHEDULE_TODOS': 'task/v2/todo/getPeriodTodos',
  'POST_DATES_HAS_TODO': 'task/v2/todo/getDatesHasTodo',
  'POST_NOTE': 'task/v2/todo/:id',
  'GET_STAFF_LIST': 'task/rsqCommonUser/getAllCompanyUserList',
  'GET_TODO_TITLE': 'task/rsqTodoTitle/getAllTodoTitleList',
  'POST_TODO_COMMENT': 'task/v2/todoComment',
  'POST_RECORD_COMMENT': 'task/rsqTodoAction/saveTodoAction',
  'GET_FILE_FROM_AlI': 'task/v2/folders/file/getFileFromAli',
  'GET_RECORD': 'task/v2/todo/getTodoActions',
  'REMIND': 'https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=ACCESS_TOKEN',
  'POST_PLAN': 'task/v2/kanbans/saveKanban',
  'GET_PLAN': '/task/v2/kanban/kanbanList',
  'GET_CHILD_PLAN': '/task/v2/kanbans/:id',
  'GET_CARD': '/task/v2/kanbans/ck/:id',
  'POST_SUB_PLAN': '/task/v2/kanbans/ck',
  'POST_CARD': '/task/kanbanCard',
  'DELETE_CHILD_PLAN': '/task/v2/kanbans/ck/:id',
  'CANCEL_STAR': '/task/v2/kanbans/cancelStar',
  'SAVE_STAR': '/task/v2/kanbans/saveStar',
  'QUIT_PLAN': '/task/v2/kanbans/quit/:id',
  'DELETE_PLAN': '/task/v2/kanbans/:id',
  'FINISH_CARD_ITEM': '/task/kanbanItem/:id',
  'POST_KANBAN_ITEM': '/task/kanbanItem',
  'UPDATE_CARD_NAME': '/task/kanbanCard/:id',
  'GET_LABLES': '/task/kanbanLabelLibrary?kanbanId=:id',
  'GET_COVERLIST': 'task/v2/kanbanTemplate/getCoverList_phone',
  'DELETE_KANBAN_ITEM': 'task/kanbanItem/:id',
  'KANBAN_SUBTODO': 'task/kanbanSubItem'
}
