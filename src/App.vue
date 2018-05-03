<template>
  <div
    id="app"
    class="rsq-webview">
    <router-view />
    <r-nav
      v-if="isAddNav"
      v-show="isShowNav" />
  </div>
</template>
<script>
  import Nav from 'com/Nav'
  import Guide from 'com/pub/RemindWindow'
  import Start from 'com/me/Start'
  export default {
    name: 'App',
    components: {
      'r-nav': Nav,
      'r-guide': Guide,
      'r-start': Start
    },
    data () {
      return {
        engine: true
      }
    },
    computed: {
      isAddNav () {
        return this.$store.state.env.isAddNav
      },
      isShowNav () {
        return this.$store.state.env.isShowNav
      },
      isShowGuide () {
        return this.$store.state.env.isShowGuide
      }
    },
    mounted () {
      // window.alert('客户端的userAgent: ' + window.navigator.userAgent.toLowerCase())
      //  生产环境下下载动效
      const that = this
      window.setTimeout(
        () => {
          that.engine = false
          //  删除加载动效
          const ele = document.getElementById('splashLoading')
          if (ele) {
            ele.classList.add('ease-hide')
            window.setTimeout(() => {
              ele.parentNode.removeChild(ele)
            }, 200)
          }
        }, 600
      )
    }
  }
</script>
<style>
  .fade-enter-active, .fade-leave-active {
    transition: opacity 1s
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active in below version 2.1.8 */ {
    opacity: 0
  }
  .rsq-webview{
    background-color: #F8F8F8;
    height:100%;
    -webkit-overflow-scrolling: touch;
    overflow: auto;
  }
</style>
