<template>
    <div class="participation">
        <div>
            <div class="progress-title">
                <div>{{participation.title}}</div>
                <div>{{participation.percentage}}%</div>
            </div>
            <el-progress :stroke-width="strokeWidth" :show-text="false"
                         :percentage="Number(participation.percentage)"></el-progress>
        </div>
        <div>
            <div class="el-popover">
                {{participation.text}}
                <div class="arrow"></div>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'participation',
    props: ['participation'],
    components: {},
    mixins: [],
    data () {
      return {
        strokeWidth: 15,
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
    methods: {}
  }
</script>

<style lang="less" scoped>
    .participation {
        height: 100px;
        display: flex;
        padding-left: 20px;
        > div {
            &:last-child {
                margin-left: 15px;
                flex: 0.8;
                position: relative;
                top: 10px;
            }
            &:first-child {
                flex: 1;
                position: relative;
                top: 25px;
            }
        }
        .progress-title {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
        }
        .el-popover {
            min-width: auto;
            position: relative;
            z-index: 0;
            .arrow {
                background: transparent;
                position: absolute;
                display: block;
                border: 5px solid transparent;
                border-right-color: #fff;
                width: 0;
                height: 0;
                left: -10px;
                top: 50%;
            }
        }
    }
</style>