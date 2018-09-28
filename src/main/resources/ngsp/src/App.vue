<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'app'
  }

  // 对store对象做持久化处理,防止刷新问题后状态丢失
  // store.subscribe(() => {
  //   localStorage.setItem('vuexState', JSON.stringify(store.state))
  // })

</script>
