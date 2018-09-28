<template>
    <div class="index">
        <content-header></content-header>
        <content-main></content-main>
        <content-footer></content-footer>
        <high-frequency-word :data="{a:1}"></high-frequency-word>
    </div>
</template>

<script>
  export default {
    name: 'index',
    props: [],
    components: {
      ContentHeader: () => import('./ContentHeader'),
      ContentMain: () => import('./ContentMain'),
      ContentFooter: () => import('./ContentFooter'),
      HighFrequencyWord: () => import('../../../components/HighFrequencyWord')
    },
    mixins: [],
    data () {
      return {}
    },
    computed: {},
    watch: {},
    created () {
    },
    mounted () {
    },
    beforeDestroy () {
    },
    methods: {}
  }
</script>

<style lang="less" scoped>
    .index {
    }
</style>