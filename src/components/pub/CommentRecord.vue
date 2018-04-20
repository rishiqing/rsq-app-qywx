<template>
  <li
    :class="{ 'isDisplay': !more}"
    class="list">
    <div
      v-if="item.type === 9"
      class="comment-record">
      <span class="icon"><i class="icon-description"/></span>
      <span class="content">{{ item.commentContent }}</span>
      <div class="time">{{ item.dateCreated.substring(5,7) }}月{{ item.dateCreated.substring(8,16) }}</div>
      <p class="child-item">{{ item.idOrContent }}</p>
    </div>
    <div
      v-else-if="item.type === 5"
      class="comment-record">
      <span class="icon"><i class="icon-check"/></span>
      <span class="content">{{ item.commentContent }}</span>
      <span class="time">{{ item.dateCreated.substring(5,7) }}月{{ item.dateCreated.substring(8,16) }}</span>
    </div>
    <div
      v-else-if="item.type === 7"
      class="comment-record">
      <span class="icon"><i class="icon-format_list_bulleted"/></span>
      <span class="content">{{ item.commentContent }}</span>
      <span class="time">{{ item.dateCreated.substring(5,7) }}月{{ item.dateCreated.substring(8,16) }}</span>
      <p class="child-item">{{ item.idOrContent }}</p>
    </div>
    <div
      v-else-if="item.type === 17"
      class="comment-record">
      <span class="icon"><i class="icon-format_list_bulleted"/></span>
      <span class="content">{{ item.commentContent }}</span>
      <span class="time">{{ item.dateCreated.substring(5,7) }}月{{ item.dateCreated.substring(8,16) }}</span>
    </div>
    <div
      v-else-if="item.type === 10"
      class="comment-record">
      <span class="icon"><i class="icon-format_list_bulleted"/></span>
      <span class="content">{{ item.commentContent }}</span>
      <span class="time">{{ item.dateCreated.substring(5,7) }}月{{ item.dateCreated.substring(8,16) }}</span>
    </div>
    <div
      v-else-if="item.type === 8"
      class="comment-record">
      <span class="icon"><i class="icon-description"/></span>
      <span class="content">{{ item.commentContent }}</span>
      <span class="time">{{ item.dateCreated.substring(5,7) }}月{{ item.dateCreated.substring(8,16) }}</span>
      <p class="child-item">{{ item.idOrContent.substring(3,item.idOrContent.length-4) }}</p>
    </div>
    <div
      v-else-if="item.type === 1"
      class="comment-record">
      <span class="icon"><i class="icon-add_circle"/></span>
      <span class="content">{{ item.commentContent }}</span>
      <span class="time">{{ item.dateCreated.substring(5,7) }}月{{ item.dateCreated.substring(8,16) }}</span>
    </div>
    <div
      v-else-if="item.type === 6"
      class="comment-record">
      <span class="icon"><i class="icon-check_box_outline_blank"/></span>
      <span class="content">{{ item.commentContent }}</span>
      <span class="time">{{ item.dateCreated.substring(5,7) }}月{{ item.dateCreated.substring(8,16) }}</span>
    </div>
    <div
      v-else-if="item.type === 2"
      class="comment-record">
      <span class="icon"><i class="icon-insert_invitation" /></span>
      <span class="content">{{ item.commentContent }}</span>
      <span class="time">{{ item.dateCreated.substring(5,7) }}月{{ item.dateCreated.substring(8,16) }}</span>
    </div>
    <div v-else />
  </li>
</template>
<style scoped>
  .list{
    display: flex;
    align-items: center;
    line-height: 0.7rem;
    border-bottom: none;
    margin-top:10px;
    padding-left: 0.4rem;
  }
  .comment-record{
    display: flex;
    align-items: center;
    width: 100%;
    min-height: 20px;
    flex-wrap: wrap;
  }
  .isDisplay{
    display: none;
  }
  .photo{
    display: inline-block;
  }
  .content,.child-item{
    color: #999999;
    font-size: 13px;
  }
  .child-item{
    margin-left: 1rem;
    margin-bottom: 0;
    background-color: lightyellow;
    width: 84%;
  }
  .content{
    margin-left: 3px;
    width:6rem;
  }
  .icon{
    width: 30px;
    text-align: left;
    font-size: 16px;
    color:#ACACAC;
  }
  .time{
    font-size: 13px;
    color:#999999;
    display: inline-block;
    /*width: 2.133rem;*/
  }
</style>
<script>
  import Avatar from 'com/pub/TextAvatar'
  export default {
    components: {
      'avatar': Avatar
    },
    props: {
      item: {
        type: Object,
        required: true
      },
      more: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
      }
    },
    computed: {
      loginUser () {
        return this.$store.state.loginUser
      }
    },
    methods: {
    }
  }
</script>
