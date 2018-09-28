<template>
    <div class="content-footer">
        <el-tabs v-model="activeName" @tab-click="handleTabsClick">
            <el-tab-pane label="主题列表" name="topic">
                <topic></topic>
            </el-tab-pane>
            <el-tab-pane label="媒体发布量统计" name="mediaRelease">
                <media-release></media-release>
            </el-tab-pane>
            <el-tab-pane label="涉及上市公司统计" name="involvingStatistics">
                <involving-statistics></involving-statistics>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
  export default {
    name: 'content-footer',
    props: [],
    components: {
      Topic: () => import('./Topic'),
      MediaRelease: () => import('./MediaRelease'),
      InvolvingStatistics: () => import('./InvolvingStatistics')
    },
    mixins: [],
    data () {
      return {
        activeName: 'topic'
      }
    },
    computed: {},
    watch: {},
    created () {
    },
    mounted () {
    },
    beforeDestroy () {
    },
    methods: {
      handleTabsClick (tab) {}
    }
  }
</script>

<style lang="less" scoped>
    .content-footer {
    }
</style>