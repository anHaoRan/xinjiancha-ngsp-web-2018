<template>
  <div
    v-loading="loading"
    element-loading-text="正在加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0,0,0,0.8)"
  >
    <el-card>
      <div slot="header">
        账户关键词
      </div>
      <div id='accountKeyWord' style="height: 300px"></div>
    </el-card>
  </div>
</template>

<script>
  import {postIntestorPic} from '../../../service/knowledgeBase/investorPicture/index'
  import echarts from 'echarts'
  import moment from 'moment'

  require('echarts-wordcloud')

  export default {
    components: {},
    data() {
      return {
        loading: true
      }
    },
    props: ['accountId', 'resultData'],
    watch: {
      // accountId: function (param1, param2) {
      //   this.getChartData()
      // },
      resultData: {
        handler: function (param1, param2) {
          this.getChartData()
        },
        deep: true
      },
    },
    mounted() {
      this.getChartData()
    },
    methods: {
      getChartData() {
        this.loading = true
        if (JSON.stringify(this.resultData) != '{}') {
          if (this.resultData.keywords) {
            this.loading = false
            let keyData = []
            this.resultData.keywords.forEach((el) => {
              keyData.push(
                {
                  name: el,
                  value: 1000,
                  textStyle: this.createRandomltemStyle()
                })
            })
            this.drawWordCloudChart('accountKeyWord', keyData)
          } else {
            this.drawWordCloudChart('accountKeyWord', [])
          }
        } else {
          this.drawWordCloudChart('accountKeyWord', [])
        }
      },
      createRandomltemStyle() {
        return {
          normal: {
            color: 'rgb(' + [
              Math.round(Math.random() * 256),
              Math.round(Math.random() * 256),
              Math.round(Math.random() * 256)
            ].join(',') + ')'
          }
        }
      },
      drawWordCloudChart(id, data) {
        let productline = echarts.init(document.getElementById(id));
        productline.setOption({
          tooltip: {
            show: false
          },
          toolbox: {
            right: '5%',
            itemSize: 18,
            feature: {
              saveAsImage: {}
            }
          },
          series: [
            {
              name: '账户关键词',
              type: 'wordCloud',
              size: ['100%', '100%'],
              textRotation: [0, 45, 90, -45],
              textPadding: 0,
              // width:'70%',
              // height:'80%',
              // sizeRange: [14, 60],
              // rotationRange: [-90, 90],
              // rotationStep: 45,
              autoSzie: {
                enable: true,
                minSize: 20
              },
              data: data
            }
          ]
        })
      }
    }
  }
</script>

<style scoped>

</style>
