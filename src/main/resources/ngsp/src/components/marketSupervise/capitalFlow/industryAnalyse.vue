<template>
  <div>
    <el-card class='el-card-table'>
      <div slot='header'>
        行业分析
      </div>
      <el-form :inline='true' :model='selectParams' label-width='100px' class='condition'>
        <el-card style='overflow: visible'>
          <el-form-item label='投资者类别'>
            <down-more-select v-model='selectParams.intervalType' @input='getIntervalType'
                              :optionData='orderTypeOption' ref='cancelOrdrtypcod'></down-more-select>
          </el-form-item>
          <el-form-item label='行业'>
            <!--<down-more-select v-model='selectParams.trade' @input='getTradeType'-->
            <!--:optionData='tradeTypeOption' ref='cancelOrdrtypcod'></down-more-select>-->
            <el-select v-model='selectParams.trade' placeholder='请选择' size='small' :clearable='true'
                       style='outline:none'>
              <el-option v-for='item in options' :key='item.value' :label='item.label'
                         :value='item.value'></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label=''>
            <div style='margin-left: 30px'>
              <el-button type='primary' size='small' @click='queryCharts'>查询</el-button>
            </div>
          </el-form-item>
        </el-card>
      </el-form>
      <div id='charts' style='height: 445px'></div>
    </el-card>
  </div>
</template>

<script>
  import DownMoreSelect from '../../common/downMoreSelect'
  import {DataSet} from 'vis/index-network';
  import vis from 'vis';
  import {
    getInvestorTypeData
  } from '@/service/capitalFlow/index'

  export default {
    components: {
      DownMoreSelect
    },
    props: ['inverstorType'],
    watch: {
      inverstorType: function (param1, param2) {
        console.log(param1);
        this.drawCharts()
      }
    },
    data() {
      return {
        selectParams: {
          intervalType: '',
          trade: ''
        },
        orderTypeOption: [], // 传递给子组件的投资者类型数据
        tradeTypeOption: [], // 传递给子组件的投资者类型数据
        options: [
          {
            value: '1',
            label: '累计净成交'
          },
          {
            value: '2',
            label: '分时净成交'
          },
          {
            value: '3',
            label: '累计主动净成交'
          },
          {
            value: '4',
            label: '分时主动净成交'
          }
        ]
      }
    },
    mounted() {
      // 获取投资者类型
      getInvestorTypeData('investorType', 'all').then(resp => {
        resp.forEach((el) => {
          this.orderTypeOption.push({value: el.value, label: el.text})
        })
      })
      this.drawCharts()
    },
    methods: {
      getIntervalType(val) {
        console.log(val);
      },
      getTradeType(val) {

      },
      queryCharts() {

      },
      drawCharts() {
        let nodes = new vis.DataSet([
          {
            id: 1,
            label: '1829.22\n非银金融',
            color: {
              background: '#502723',
              border: '#502723',
              hover: {
                border: '#502723',
                background: '#502723'
              }
            },
            widthConstraint: 200,
            heightConstraint: 100
          },
          {
            id: 2,
            label: '1620.86\n电子',
            color: {
              background: '#533420',
              border: '#533420',
              hover: {
                border: '#533420',
                background: '#533420'
              }
            },
            widthConstraint: 160,
            heightConstraint: 80
          },
          {
            id: 3,
            label: '1586.23\n家用电器',
            color: {
              background: '#49511e',
              border: '#49511e',
              hover: {
                border: '#49511e',
                background: '#49511e'
              }
            },
            widthConstraint: 120,
            heightConstraint: 60
          },
          {
            id: 4,
            label: '1265.37\n房地产',
            color: {
              background: '#50471e',
              border: '#50471e',
              hover: {
                border: '#50471e',
                background: '#50471e'
              }
            },
            widthConstraint: 100,
            heightConstraint: 50
          },
          {
            id: 10,
            label: '968.00\n汽车',
            color: {
              background: '#1e444f',
              border: '#1e444f',
              hover: {
                border: '#1e444f',
                background: '#1e444f'
              }
            },
            widthConstraint: 100,
            heightConstraint: 50
          },
          {
            id: 5,
            label: '通信',
            color: {
              background: '#2052c1',
              border: '#2052c1',
              hover: {
                border: '#2052c1',
                background: '#2052c1'
              }
            },
            widthConstraint: 150,
            heightConstraint: 75
          },
          {
            id: 6,
            label: '1829.22\n非银金融',
            color: {
              background: '#502723',
              border: '#502723',
              hover: {
                border: '#502723',
                background: '#502723'
              }
            },
            widthConstraint: 200,
            heightConstraint: 100
          },
          {
            id: 7,
            label: '1620.86\n电子',
            color: {
              background: '#533420',
              border: '#533420',
              hover: {
                border: '#533420',
                background: '#533420'
              }
            },
            widthConstraint: 160,
            heightConstraint: 80
          },
          {
            id: 8,
            label: '1586.23\n家用电器',
            color: {
              background: '#49511e',
              border: '#49511e',
              hover: {
                border: '#49511e',
                background: '#49511e'
              }
            },
            widthConstraint: 120,
            heightConstraint: 60
          },
          {
            id: 9,
            label: '1265.37\n房地产',
            color: {
              background: '#50471e',
              border: '#50471e',
              hover: {
                border: '#50471e',
                background: '#50471e'
              }
            },
            widthConstraint: 100,
            heightConstraint: 50
          },
          {
            id: 11,
            label: '968.00\n汽车',
            color: {
              background: '#1e444f',
              border: '#1e444f',
              hover: {
                border: '#1e444f',
                background: '#1e444f'
              }
            },
            widthConstraint: 100,
            heightConstraint: 50
          }
        ]);
        let edges = new vis.DataSet([
          {from: 1, to: 5, color: {color: '#502723', hover: '#502723'}, smooth: {enabled: false}},
          {from: 2, to: 5, color: {color: '#533420', hover: '#533420'}, smooth: {enabled: false}},
          {from: 3, to: 5, color: {color: '#49511e', hover: '#49511e'}, smooth: {enabled: false}},
          {from: 4, to: 5, color: {color: '#50471e', hover: '#50471e'}, smooth: {enabled: false}},
          {from: 10, to: 5, color: {color: '#1e444f', hover: '#1e444f'}, smooth: {enabled: false}},
          {from: 5, to: 6, color: {color: '#502723', hover: '#502723'}, smooth: {enabled: false}},
          {from: 5, to: 7, color: {color: '#533420', hover: '#533420'}, smooth: {enabled: false}},
          {from: 5, to: 8, color: {color: '#49511e', hover: '#49511e'}, smooth: {enabled: false}},
          {from: 5, to: 9, color: {color: '#50471e', hover: '#50471e'}, smooth: {enabled: false}},
          {from: 5, to: 11, color: {color: '#1e444f', hover: '#1e444f'}, smooth: {enabled: false}}
        ])
        let container = document.getElementById('charts');
        let data = {
          nodes: nodes,
          edges: edges
        };
        let options = {
          nodes: {
            borderWidth: 1, // 节点边框的宽度,单位为px
            borderWidthSelected: 2, // 节点被选中时边框的宽度单位为px
            font: {
              color: '#fff',
              size: 24,
              face: 'arial',
              background: 'none',
              align: 'center'
            },
            shape: 'box',
            shapeProperties: {
              borderDashes: false, // 仅用于边框
              interpolation: false, // 仅用于图像和circularImage形状
              useImageSize: false, // 仅用于image和circularImage形状
              useBorderWithImage: false // 仅用于图像形状
            },
            shadow: false
          },
          interaction: {
            dragNodes: false, // 是否能拖动节点
            dragView: false, // 是否能拖动画布
            hideEdgesOnDrag: false, // 拖动画布时是否隐藏连接线
            hideNodesOnDrag: false, // 拖动画布时是否隐藏节点
            hover: true, // 鼠标移过后加粗该节点和连接线
            keyboard: true,
            multiselect: true, // 按ctrl多选
            navigationButtons: true, // 是否显示控制按钮
            selectable: false, // 是否可以点击选择
            selectConnectedEdges: false, // 选择节点后是否显示连接线
            hoverConnectedEdges: false, // 鼠标滑动节点后是否显示连接线
            tooltipDelay: 200,
            zoomView: false // 是否能缩放画布
          },
          layout: {
            randomSeed: 2, // 配置每次生成的节点位置都一样，参数为数字1、2等
            improvedLayout: true,
            hierarchical: {
              levelSeparation: 500, // 关卡之间的距离
              nodeSpacing: 100, // 自由轴上节点之间的最小距离。
              treeSpacing: 100, // 不同树木之间的距离（独立网络）
              direction: 'LR', // UD:上下 DU:下上 LR:左右 RL:右左
              sortMethod: 'directed'
            }
          },
          edges: {
            shadow: false, // 连接线阴影配置
            smooth: true, // 是否显示方向箭头
            arrows: {to: true} // 箭头指向from节点
          }
        };
        let network = new vis.Network(container, data, options);
      }
    }
  }
</script>

<style scoped>

</style>