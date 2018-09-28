<template>
    <div class="tendency-img">
        <img :src="formatterSurface" style="height: 23px;"/>
    </div>
</template>

<script>
  import negative from '@/assets/images/negative.png'
  import neutral from '@/assets/images/neutral.png'
  import positive from '@/assets/images/positive.png'

  export default {
    name: 'tendency-img',
    props: ['scope', 'item'],
    components: {},
    mixins: [],
    data () {
      return {}
    },
    computed: {
      formatterSurface () {
        let map = {
          '-1': negative,
          '0': neutral,
          '1': positive
        }
        return map[this.scope.row[this.item.field]]
      },
    },
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
    .tendency-img {
    }
</style>