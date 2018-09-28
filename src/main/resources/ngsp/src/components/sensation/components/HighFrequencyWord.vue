<template>
    <div class="content-footer">
        <el-card>
            <div slot="header" class="clearfix">
                <span>高频词</span>
            </div>
            <div id="keyWord"></div>
        </el-card>
    </div>
</template>

<script>
  import VueMixin from '../VueMixin'

  require('echarts-wordcloud')
  let json = {'data': [{'key': '2'}, {'key': '盈利'}, {'key': '次新股'}, {'key': 'name1'}, {'key': '多账户'}, {'key': 'chanping1'}, {'key': '2'}, {'key': '盈利'}, {'key': '次新股'}, {'key': 'name1'}, {'key': '多账户'}, {'key': 'chanping1'}, {'key': '2'}, {'key': '盈利'}, {'key': '次新股'}, {'key': 'name1'}, {'key': '多账户'}, {'key': 'chanping1'}, {'key': '2'}, {'key': '盈利'}, {'key': '次新股'}, {'key': 'name1'}, {'key': '多账户'}, {'key': 'chanping1'}, {'key': '2'}, {'key': '盈利'}, {'key': '次新股'}, {'key': 'name1'}, {'key': '多账户'}, {'key': 'chanping1'}]}

  export default {
    name: 'content-footer',
    props: {
      data: {
        type: Object,
        required: true
      }
    },
    components: {},
    mixins: [VueMixin],
    data () {
      return {}
    },
    computed: {},
    watch: {
      data: {
        handler () {
          let data = this.dealWithEchartData(json)
          this.$nextTick(function () {
            this.options.series = [
              {
                name: '',
                type: 'wordCloud',
                size: ['100%', '100%'],
                textRotation: [0, 45, 90, -45],
                textPadding: 0,
                // width: '30%',
                // height:'80%',
                // sizeRange: [14, 60],
                // rotationRange: [-90, 90],
                // rotationStep: 45,
                data: data.keyData
              }
            ]
            this.drawEcharts()
          })
        },
        deep: true,
        immediate: true
      }
    },
    created () {
      this.options = {
        tooltip: {
          show: false
        },
        toolbox: {
          // right: '35%',
          itemSize: 18,
          feature: {
            saveAsImage: {}
          }
        },
        series: []
      }
    },
    mounted () {
      this.initEcharts(`keyWord`)
    },
    beforeDestroy () {
    },
    methods: {
      dealWithEchartData (rawData) {
        let keyData = []
        for (let key of rawData.data) {
          keyData.push(
          {
            name: key.key,
            value: 1000,
            textStyle: this.createRandomltemStyle()
          }
          )
        }
        return {
          keyData
        }
      },
      createRandomltemStyle () {
        return {
          normal: {
            textSize: Math.random() * 100 + 10,
            color: 'rgb(' + [
              Math.round(Math.random() * 256),
              Math.round(Math.random() * 256),
              Math.round(Math.random() * 256)
            ].join(',') + ')'
          }
        }
      },
    }
  }
</script>

<style lang="less" scoped>
    .content-footer {
        #keyWord {
            height: 300px;
            width: 40%;
            margin: 0 auto;
        }
    }
</style>