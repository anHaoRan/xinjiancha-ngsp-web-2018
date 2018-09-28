<template>
  <div style="display: flex;align-items:center;">
    <el-input v-model="scope.row[item.field]" size="small" type="textarea" :autosize="{ minRows: 1, maxRows: 2 }"  maxlength="200" 
    :disabled="JSON.parse(this.$route.params.params).task_status != 'x1' && JSON.parse(this.$route.params.params).task_status != 'x3'"/>
    <!-- <i class="fa fa-lightbulb-o lightbulb-button" :class="{active:isActive}" @click="isActive=!isActive"/> -->
  </div>
</template>

<script>
  export default {
    name: 'reason',
    props: ['scope', 'item'],
    components: {},
    mixins: [],
    data () {
      return {
        isActive: true
      }
    },
    computed: {},
    watch: {},
    methods: {},
    created () {
    },
    mounted () {
    },
    beforeDestroy () {
    }
  }
</script>

<style scoped>

</style>
