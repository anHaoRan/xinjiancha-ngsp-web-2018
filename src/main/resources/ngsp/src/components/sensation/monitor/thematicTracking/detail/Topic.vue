<template>
    <div class="topic">
        <s-table ref="topic" :isHeader="false" :columns="columns" :data="totalData"
                 @getPageination="getPageination">
            <template slot="tableColumnsUnshift">
                <el-table-column type="selection" width="60" align="center"></el-table-column>
            </template>
            <div slot="tableHeader" class="searchCondition">
                <el-input placeholder="搜索姓名" class="input-search" size="small" v-model="keyWord">
                    <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input>
                <div class="sort">
                    排序：
                    <label :class="{'label-color':item.isActive}" v-for="(item,index) in orderField" :key="index"
                           @click="handlerSort(index)">
                        {{item.label}}<i :class="`el-icon-sort-${item.sortClass}`"></i>
                    </label>
                </div>
            </div>
        </s-table>
    </div>
</template>

<script>
  import Operating from '@/components/base/Operating'
  import TendencyImg from '../components/TendencyImg'

  export default {
    name: 'topic',
    props: [],
    components: {
      STable: () => import('@/components/base/STable'),
    },
    mixins: [],
    data () {
      return {
        columns: [
          {
            field: 'a',
            align: 'left',
            width: '100',
            label: '标题'
          }, {
            field: 'a',
            align: 'left',
            width: '100',
            label: '首发时间'
          }, {
            field: 'a',
            align: 'left',
            width: '100',
            label: '首发媒体'
          }, {
            field: 'a',
            align: 'left',
            width: '100',
            label: '转发数'
          }, {
            field: 'a',
            align: 'left',
            width: '100',
            label: '评论总数'
          }, {
            field: 'a',
            align: 'left',
            width: '100',
            label: '媒体数'
          }, {
            field: 'a',
            align: 'center',
            width: '100',
            label: '情感倾向',
            template: TendencyImg
          }, {
            field: 'a',
            align: 'center',
            label: '操作',
            width: '200',
            template: Operating,
            buttonList: [
              {
                label: '查看',
                func: this.handlerLook
              }, {
                label: '删除',
                func: this.handlerDel
              }
            ]
          }
        ],
        totalData: {
          data: [
            {a: 1}
          ],
          total: 0,
          pageRows: 10,
          pageIndex: 1
        },
        keyWord: '',
        orderField: [
          {
            label: '时间',
            value: 'publishTime',
            sortClass: 'down',
            isActive: true
          },
          {
            label: '转发',
            value: 'transmitNum',
            sortClass: 'down',
            isActive: false
          },
          {
            label: '媒体',
            value: 'transmitMediaNum',
            sortClass: 'down',
            isActive: false
          },
          {
            label: '评论',
            value: 'commentNum',
            sortClass: 'down',
            isActive: false
          },
          // {
          //   label: '热度',
          //   value:'transmitNum',
          //   sortClass: 'down',
          //   isActive: false
          // }
        ],
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
      getPageination (pagination) {

      },
      handlerSort (index) {
        for (let key of this.orderField) {
          if (key.label != this.orderField[index].label) {
            key.sortClass = 'down'
            key.isActive = false
          }
        }
        if (this.orderField[index].isActive) {
          this.orderField[index].sortClass = this.orderField[index].sortClass == 'up' ? 'down' : 'up'
        }
        this.orderField[index].isActive = true
      },
      handlerLook (pms) {},
      handlerDel (pms) {},
    }
  }
</script>

<style lang="less" scoped>
    .topic {
        .searchCondition {
            display: flex;
            align-items: center;
            padding: 10px;
            .input-search {
                width: auto;
            }
            .sort {
                margin-left: 40px;
                display: flex;
                label {
                    cursor: pointer;
                    padding: 0 10px;
                    i {
                        margin-left: 5px;
                    }
                }
                .label-color {
                    color: #1b5eed;
                }
            }
        }
    }
</style>