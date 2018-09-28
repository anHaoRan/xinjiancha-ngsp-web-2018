<template>
  <div class="dataBrowser">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <div>
      <el-card class='el-card-table'>
        <div style="float: right">
          <el-button :icon="btnContent.icon" size="mini" type="info" @click="openTool"> {{btnContent.text}}
          </el-button>
        </div>
        <div style="display: flex" v-if="isShow">
          <div class="toolWrap">
            <div style="display: flex">
              <div class="cursorPointer" @click="getData">
                <i class="fa fa-table iconStyle"></i>
                提取数据
              </div>
            </div>
          </div>
          <div class="toolWrap">
            <div style="display: flex">
              <div class="cursorPointer" @click="exportData">
                <i class="fa fa-file-excel-o export iconStyle"></i>
                导出数据
              </div>
            </div>
          </div>
          <div class="toolWrap">
            <div style="display: flex">
              <div class="cursorPointer" @click="saveBoard">
                <i class="fa fa-floppy-o save iconStyle"></i>
                保存模板
              </div>
            </div>
          </div>
          <div class="toolWrap">
            <div style="display: flex">
              <div class="cursorPointer" @click="deleteRows">
                <i class="fa fa-list-ul export iconStyle"></i>
                删除选中行
              </div>
            </div>
          </div>
          <div class="toolWrap">
            <div style="display: flex">
              <div class="cursorPointer" @click="editParams">
                <i class="fa fa-pencil-square-o iconStyle"></i>
                参数修改
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <el-row :gutter="20">
      <el-col :span="4">
        <el-card class="el-card-table" style="height: 345px;overflow: auto">
          <el-tabs v-model="activeName">
            <el-tab-pane label="维度" name="first">
              <div @dblclick="dimDoubleClick">
                <el-tree
                  :data="treeData"
                  node-key="id"
                  :props="defaultProps"
                  ref="treeData"
                  @node-click="nodeClick"
                >
                </el-tree>
              </div>
            </el-tab-pane>
            <el-tab-pane label="模板" name="second">
              <el-table
                :data='boardData'
                border
                :show-header="false"
                @row-dblclick="rowDbClick"
                style='width: 100%; overflow:visible'>
                <el-table-column
                  v-for='item in boardColumns'
                  :align='item.align'
                  header-align='center'
                  :key='item.field'
                  :prop='item.field'
                  :label='item.label'>
                </el-table-column>
                <el-table-column
                  align='center'
                  label='操作'>
                  <template slot-scope='scope'>
                    <el-button @click='editDetails(scope.row)' type='text' size='small' style='border: none;color:#1b5eed
'>编辑
                    </el-button>
                    <el-button @click='deleteDetails(scope.row)' type='text' size='small' style='border: none;color:#1b5eed
'>删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-card>
        <el-card class="el-card-table" style="height: 345px;overflow: auto">
          <div slot="header" class="title">
            指标
          </div>
          <div @dblclick="dicDoubleClick">
            <el-tree
              :data="indexTreeData"
              node-key="id"
              :props="defaultProps"
              ref="treeData"
              @node-click="indexNodeClick"
            >
            </el-tree>
          </div>
        </el-card>
      </el-col>
      <el-col :span="20">
        <el-card class='el-card-table'>
          <div slot="header" class="title">
            数据区
          </div>
          <el-tabs
            v-model="dataTableTabs"
            type="card"
            closable
            @tab-remove="removeTab"
            @tab-click="tabClick"
            class="moreTabs"
          >
            <el-tab-pane
              v-for="item in tabsList"
              :key="item.name"
              :label="item.title"
              :name="item.name"
            >
              <s-table :columns="item.content" :data="item.tableList" :isHeader="false" :isPageination="false"
                       :height="620" :loading="loading" @selection-change="selectionChange">
                <el-table-column
                  width="50px"
                  type='selection'
                  slot="tableColumnsUnshift"
                  align="center">
                </el-table-column>
                <el-table-column
                  width="50px"
                  type="index"
                  label="序号"
                  slot="tableColumnsUnshift"
                  align="center">
                </el-table-column>
              </s-table>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog title="保存模板" class="smallDialog" :visible.sync="dialogFormDetail">
      <el-form :inline="true" :model="dialogParams" class="dialogForm">
        <el-row :gutter="20">
          <el-col :xl="24" style="text-align: center">
            <el-form-item label="模板名称">
              <el-input type="text" v-model="dialogParams.boardName" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="24">
            <div style="text-align: center">
              <el-button type="primary" size="small" @click="sureName">确定</el-button>
              <el-button type="info" size="small" @click="cancleName">取消</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <el-dialog title='删除模板' class="smallDialog" :visible.sync='deleteDialogForm'>
      <div style='text-align: center;'>
        <p>
          是否确认删除？
        </p>
        <el-button type="primary" size="mini" @click="yesDelete">是</el-button>
        <el-button type="info" size="mini" @click="noDelete">否</el-button>
      </div>
    </el-dialog>
    <el-dialog :title='txt' class="smallDialog" :visible.sync='dialogFormVisble'>
      <div style='text-align: center;'>
        <i class='el-icon-success' style='font-size: 40px;color:#339933'></i>
        <p>
          {{txt}}成功！
        </p>
      </div>
    </el-dialog>
    <el-dialog title="参数修改" :visible.sync="editParamsVisble">
      <el-form :inline="true" :model="editDialogParams" class="editDialogForm"
               v-loading="formLoading"
               element-loading-text="正在加载中"
               element-loading-spinner="el-icon-loading"
               element-loading-background="rgba(0,0,0,0.8)">
        <div>
          <el-row>
            <el-col :span="8">
              维度参数
              <el-tree :data="dimParams" :props="defaultProps" style="margin-top: 10px" node-key="id"
                       @node-click="dimParamsNodeClick"></el-tree>
            </el-col>
            <el-col :span="16" class="rightParams">
              <el-form :inline="true" :model="dimDialogParams" class="dialogForm">
                <el-form-item :label="item.name" v-for="(item,index) in dimEditList" :key="index">
                  <el-input type="text" v-model="dimDialogParams[item.field]" size="mini"
                            v-if="item.type=='101'?true:false"></el-input>
                  <el-input type="text" v-model="dimDialogParams[item.field]" size="mini"
                            v-if="item.type=='102'?true:false"></el-input>
                  <el-date-picker v-model="dimDialogParams[item.field]" type="date" value-format='yyyyMMdd'
                                  size="mini" v-if="item.type=='201'?true:false"></el-date-picker>
                  <el-select v-model="dimDialogParams[item.field]" v-if="item.type=='301'?true:false" size="mini">
                    <el-option
                      v-for="option in item.dataList"
                      :key="option.value"
                      :label="option.text"
                      :value="option.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </div>
        <div>
          <el-row>
            <el-col :span="8">
              指标参数
              <el-tree :data="dicParams" :props="defaultProps" style="margin-top: 10px" node-key="id"
                       @node-click="dicParamsNodeClick"></el-tree>
            </el-col>
            <el-col :span="16" class="rightParams">
              <el-form :inline="true" :model="dicDialogParams" class="dialogForm">
                <el-form-item :label="item.name" v-for="(item,index) in dicEditList" :key="index">
                  <el-input type="text" v-model="dicDialogParams[item.field]" size="mini"
                            v-if="item.type=='101'?true:false"></el-input>
                  <el-input type="text" v-model="dicDialogParams[item.field]" size="mini"
                            v-if="item.type=='102'?true:false"></el-input>
                  <el-date-picker v-model="dicDialogParams[item.field]" type="date" value-format='yyyyMMdd'
                                  size="mini" v-if="item.type=='201'?true:false"></el-date-picker>
                  <el-select v-model="dicDialogParams[item.field]" v-if="item.type=='301'?true:false" size="mini">
                    <el-option
                      v-for="option in item.dataList"
                      :key="option.value"
                      :label="option.text"
                      :value="option.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div style="text-align: center;padding: 10px">
        <el-button type="primary" size="small" @click="getSureParams">确定</el-button>
        <el-button type="info" size="small" @click="cancelDialog">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Breadcrumb from '../common/Breadcrumb'
  import {
    getDimensionality,
    getIndex,
    getDimensionalityColum,
    getIndexColum,
    getIndexParams,
    getDimensionalityParams,
    pickUpData,
    saveBoard,
    getBoardList,
    deleteBoard,
    editBoard,
    getBoardData,
    getEditParams,
    getBoardEditParams
  } from '../../service/marketSupervise/dataBrowser/index'

  export default {
    components: {
      Breadcrumb,
      STable: () => import('@/components/base/STable')
    },
    data() {
      return {
        breadcrumbItems: [
          {
            router: '',
            label: '市场运行监测'
          },
          {
            router: '',
            label: '数据浏览器'
          }
        ],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        loading: false,
        treeData: [], // 维度树形数据
        indexTreeData: [], // 指标树形数据
        dataTableTabs: '',
        tabsList: [],
        tabIndex: 0,
        dimTypeId: '', // 维度id
        dicTypeId: '', // 指标id
        paramsId: [], // 维度指标ID存储
        flag: false, // tabs切换存储ID标记
        btnContent: {
          icon: 'fa fa-angle-double-up',
          text: '收起'
        },
        isShow: true,
        selectRow: [],
        activeName: 'first',
        dialogFormDetail: false,
        dialogFormVisble: false,
        deleteDialogForm: false,
        dialogParams: {
          boardName: ''
        },
        boardParams: [],
        boardColumns: [
          {label: '名字', field: 'modname', align: 'center'}
        ],
        boardData: [],
        editFlag: false,
        editCid: '',
        editModContent: '',
        txt: '',
        dimFirstTime: '',
        dimIntervalTime: '',
        addDimParams: {},
        dicFirstTime: '',
        dicIntervalTime: '',
        addDicParams: {},
        tabsActiveName: '',
        templateParams: [],
        editParamsVisble: false,
        editDialogParams: {},
        dimDialogParams: {
          tradeDateBegin: '',
          tradeDateEnd: '',
          indusProvider: '',
          secSubtypeCode: '',
          investorTypeCode: '',
          sortType: '',
          indexCode: ''
        },
        dicDialogParams: {
          tradeDateBegin: '',
          tradeDateEnd: '',
          indusProvider: '',
          secSubtypeCode: '',
          investorTypeCode: '',
          sortType: '',
          indexCode: ''
        },
        dimParams: [],
        dicParams: [],
        dimEditList: [],
        dicParamsList: [],
        dicEditList: [],
        options: [],
        dicTreeParams: {},
        dimTreeParams: {},
        formLoading: true,
        deleteParams: ''
      }
    },
    mounted() {
      getDimensionality().then(res => {
        this.treeData = res.treeData
      })
      this.getBoardData()
    },
    methods: {
      // 修改参数
      editParams() {
        if (!Number(this.dataTableTabs)) {
          this.$message.warning('请先生成模板，再进行参数修改！')
        } else {
          this.formLoading = true
          this.dimEditList = []
          this.dicEditList = []
          let flag = this.dataTableTabs.substring(this.dataTableTabs.length - 5, this.dataTableTabs.length)
          if (flag == 'false') {
            let modelId = this.dataTableTabs.substring(0, this.dataTableTabs.length - 5)
            this.dimParams = []
            this.dicParams = []
            this.editParamsVisble = true
            getBoardEditParams(modelId).then(res => {
              this.formLoading = false
              this.dimParams.push({label: res.dim.dimName, id: res.dim.dimCode})
              res.dim.params.forEach((el) => {
                this.dimDialogParams[el.field] = el.value
              })
              this.dimEditList = res.dim.params
              res.indic.forEach((el) => {
                this.dicParams.push({label: el.indicName, id: el.indicCode})
                this.dicParamsList.push({id: el.indicCode, content: el.params})
              })
              this.dicEditList = res.indic[0].params
              res.indic[0].params.forEach((el) => {
                this.dicDialogParams.indicCode = res.indic[0].indicCode
                this.dicDialogParams[el.field] = el.value
              })
              this.dicTreeParams = res.indic
              this.dimTreeParams = res.dim
            })
          } else {
            this.dimParams = []
            this.dicParams = []
            this.editParamsVisble = true
            let dimTypeId = this.dataTableTabs
            let dicTypeId = ''
            this.paramsId.forEach((el) => {
              if (el.dimTypeId == this.dataTableTabs) {
                dicTypeId = el.dicTypeId
              }
            })
            getEditParams(dimTypeId, dicTypeId).then(res => {
              this.formLoading = false
              this.dimParams.push({label: res.dim.dimName, id: res.dim.dimCode})
              res.dim.params.forEach((el) => {
                this.dimDialogParams[el.field] = el.value
              })
              this.dimEditList = res.dim.params
              res.indic.forEach((el) => {
                this.dicParams.push({label: el.indicName, id: el.indicCode})
                this.dicParamsList.push({id: el.indicCode, content: el.params})
              })
              this.dicEditList = res.indic[0].params
              res.indic[0].params.forEach((el) => {
                this.dicDialogParams.indicCode = res.indic[0].indicCode
                this.dicDialogParams[el.field] = el.value
              })
              this.dicTreeParams = res.indic
            })
          }
        }
      },
      // 取消修改
      cancelDialog() {
        this.editParamsVisble = false
      },
      // 确认修改
      getSureParams() {
        let flag = this.dataTableTabs.substring(this.dataTableTabs.length - 5, this.dataTableTabs.length)
        if (flag == 'false') {
          let contentName = ''
          this.templateParams.forEach((el, index) => {
            if (el.cid == this.dataTableTabs) {
              contentName = this.templateParams[index].name
            }
          })
          this.dicTreeParams.forEach((el, index) => {
            if (el.indicCode == this.dicDialogParams.indicCode) {
              for (let k in this.dicDialogParams) {
                this.dicTreeParams[index].params.forEach((res, n) => {
                  if (res.field == k) {
                    this.dicTreeParams[index].params[n].value = this.dicDialogParams[k]
                  }
                })
              }
            }
          })
          for (let k in this.dimDialogParams) {
            this.dimTreeParams.params.forEach((res, n) => {
              if (res.field == k) {
                this.dimTreeParams.params[n].value = this.dimDialogParams[k]
              }
            })
          }
          let dataParams = {}
          dataParams.dim = JSON.parse(JSON.stringify(this.dimTreeParams))
          dataParams.indic = JSON.parse(JSON.stringify(this.dicTreeParams))
          dataParams.dim.obj = {}
          // 最终维度参数配置
          dataParams.dim.params.forEach((el) => {
            dataParams.dim.obj[el.field] = el.value
          })
          delete dataParams.dim.params
          let lastDim = JSON.parse(JSON.stringify(dataParams.dim).replace(/obj/g, 'params'))
          // 最终指标参数配置
          dataParams.indic.forEach((el) => {
            el.obj = {}
            el.params.forEach((res) => {
              el.obj[res.field] = res.value
            })
            delete el.params
          })
          let lastDic = JSON.parse(JSON.stringify(dataParams.indic).replace(/obj/g, 'params'))
          dataParams.dim = lastDim
          dataParams.indic = lastDic
          let params = {
            cId: this.dataTableTabs.substring(0, this.dataTableTabs.length - 5),
            modName: contentName,
            modContent: JSON.stringify(dataParams)
          }
          this.loading = true
          editBoard(params).then(resp => {
            if (resp.success) {
              getBoardData(this.dataTableTabs.substring(0, this.dataTableTabs.length - 5)).then(res => {
                res.rows.forEach((el) => {
                  res.columns.unitDevide.forEach((resp, num) => {
                    if (resp) {
                      if (!el[res.columns.code[num]]) {
                        el[res.columns.code[num]] = '--'
                      } else {
                        el[res.columns.code[num]] = (el[res.columns.code[num]] / resp).toFixed(res.columns.nPrecision[num])
                      }
                    }
                  })
                })
                this.tabsList.forEach((el, index) => {
                  if (el.dimTypeId == this.dataTableTabs) {
                    this.tabsList[index].tableList.data = res.rows
                  }
                })
                this.loading = false
                this.editParamsVisble = false
              })
            }
          })
        } else {
          let dimTypeId = this.dataTableTabs
          let dicTypeId = ''
          this.paramsId.forEach((el) => {
            if (el.dimTypeId == this.dataTableTabs) {
              dicTypeId = el.dicTypeId
            }
          })
          let params = {}
          this.loading = true
          this.dicTreeParams.forEach((el, index) => {
            if (el.indicCode == this.dicDialogParams.indicCode) {
              for (let k in this.dicDialogParams) {
                this.dicTreeParams[index].params.forEach((res, n) => {
                  if (res.field == k) {
                    this.dicTreeParams[index].params[n].value = this.dicDialogParams[k]
                  }
                })
              }
            }
          })
          getIndexParams(dicTypeId, dimTypeId).then(res => {
            params.indic = res.indic
            params.indic.forEach((el, i) => {
              this.dicTreeParams.forEach((resp, n) => {
                if (el.indicCode == resp.indicCode) {
                  for (let k in params.indic[i].params) {
                    this.dicTreeParams[n].params.forEach((p, m) => {
                      if (p.field == k) {
                        params.indic[i].params[k] = this.dicTreeParams[n].params[m].value
                      }
                    })
                  }
                }
              })
            })
          }).then(() => {
            getDimensionalityParams(dimTypeId).then(res => {
              params.dim = res.dim
              for (let k in params.dim.params) {
                params.dim.params[k] = this.dimDialogParams[k]
              }
            }).then(() => {
              pickUpData(JSON.stringify(params)).then(res => {
                res.rows.forEach((el, index) => {
                  res.columns.unitDevide.forEach((resp, num) => {
                    if (resp) {
                      if (!el[res.columns.code[num]]) {
                        el[res.columns.code[num]] = '--'
                      } else {
                        el[res.columns.code[num]] = (el[res.columns.code[num]] / resp).toFixed(res.columns.nPrecision[num])
                      }
                    }
                  })
                })
                this.tabsList.forEach((el, index) => {
                  if (el.dimTypeId == dimTypeId) {
                    this.tabsList[index].tableList.data = res.rows
                  }
                })
                this.loading = false
                this.editParamsVisble = false
              })
            })
          })
        }
      },
      dimParamsNodeClick(val) {
      },
      dicParamsNodeClick(val) {
        this.dicTreeParams.forEach((el, index) => {
          if (el.indicCode == this.dicDialogParams.indicCode) {
            for (let k in this.dicDialogParams) {
              this.dicTreeParams[index].params.forEach((res, n) => {
                if (res.field == k) {
                  this.dicTreeParams[index].params[n].value = this.dicDialogParams[k]
                }
              })
            }
          }
        })
        this.dicParamsList.forEach((el, index) => {
          if (el.id == val.id) {
            this.dicEditList = this.dicParamsList[index].content
            this.dicParamsList[index].content.forEach((res) => {
              this.dicDialogParams.indicCode = el.id
              this.dicDialogParams[res.field] = res.value
            })
          }
        })
      },
      // 导出数据
      exportData() {
        if (!Number(this.dataTableTabs)) {
          this.$message.warning('没有需要导出的数据！')
        } else {
          let flag = this.dataTableTabs.substring(this.dataTableTabs.length - 5, this.dataTableTabs.length)
          if (flag == 'false') {
            let params = {}
            this.templateParams.forEach((el, index) => {
              if (el.cid == this.dataTableTabs) {
                params = JSON.parse(this.templateParams[index].content)
                params.sheetName = this.templateParams[index].name
              }
            })
            this.gfnExportFileWithForm('/dataviz/v1/export', params)
          } else {
            let dimTypeId = this.dataTableTabs
            let dicTypeId = ''
            this.paramsId.forEach((el) => {
              if (el.dimTypeId == this.dataTableTabs) {
                dicTypeId = el.dicTypeId
              }
            })
            let params = {}
            getIndexParams(dicTypeId, dimTypeId).then(res => {
              params.indic = res.indic
            }).then(() => {
              getDimensionalityParams(dimTypeId).then(res => {
                params.dim = res.dim
                params.sheetName = this.tabsActiveName
                this.gfnExportFileWithForm('/dataviz/v1/export', params)
              })
            })
          }
        }
      },
      // 双击添加维度
      dimDoubleClick() {
        if (this.dimIntervalTime < 300) {
          this.dicTypeId = ''
          // 添加维度列
          getDimensionalityColum(this.addDimParams.id).then(res => {
            let content = []
            if (!this.tabsList.length) {
              res.columns.code.forEach((el, index) => {
                if (!res.columns.unitName[index]) {
                  content.push({
                    label: res.columns.title[index],
                    field: el,
                    align: 'center'
                  })
                } else {
                  content.push({
                    label: res.columns.title[index] + '(' + res.columns.unitName[index] + ')',
                    field: el,
                    align: 'center'
                  })
                }
              })
              this.addTab(this.addDimParams.label, content, this.addDimParams.id)
            } else {
              let index = this.tabsList.findIndex(item => {
                return item.title == this.addDimParams.label
              })
              if (index < 0) {
                res.columns.code.forEach((el, index) => {
                  if (!res.columns.unitName[index]) {
                    content.push({
                      label: res.columns.title[index],
                      field: el,
                      align: 'center'
                    })
                  } else {
                    content.push({
                      label: res.columns.title[index] + '(' + res.columns.unitName[index] + ')',
                      field: el,
                      align: 'center'
                    })
                  }
                })
                this.addTab(this.addDimParams.label, content, this.addDimParams.id)
              } else {
                this.$message.warning('此维度已存在！')
              }
            }
          })
        }
      },
      // 双击添加指标
      dicDoubleClick() {
        // 存储维度指标Id参数
        if (this.dicIntervalTime < 300) {
          if (this.flag) {
            this.paramsId.forEach((el, index) => {
              if (el.dimTypeId == this.dataTableTabs) {
                this.paramsId[index].dicTypeId += ',' + this.addDicParams.id
              }
            })
          } else {
            this.paramsId.forEach((el, num) => {
              if (el.dimTypeId == this.dataTableTabs) {
                this.dicTypeId = this.paramsId[num].dicTypeId
              }
            })
            if (!this.dicTypeId) {
              this.dicTypeId += this.addDicParams.id
            } else {
              this.dicTypeId += ',' + this.addDicParams.id
            }
            // 如果 paramsId 为空，则是第一次新增tabs维度,直接存储
            if (!this.paramsId.length) {
              this.paramsId.push({dimTypeId: this.dataTableTabs, dicTypeId: this.dicTypeId})
            } else {
              let index = this.paramsId.findIndex(item => {
                return item.dimTypeId == this.dataTableTabs
              })
              // index小于0表示该tabs维度属于新增的，直接添加指标；否则找到原来的tabs添加到其指标下
              if (index < 0) {
                this.paramsId.push({dimTypeId: this.dataTableTabs, dicTypeId: this.dicTypeId})
              } else {
                this.paramsId.forEach((el, num) => {
                  if (el.dimTypeId == this.dataTableTabs) {
                    this.paramsId[num].dicTypeId = this.dicTypeId
                  }
                })
              }
            }
          }
          console.log(this.paramsId);
          this.flag = false
          // 添加指标列
          getIndexColum(this.addDicParams.id, this.dataTableTabs).then(res => {
            if (JSON.stringify(res.columns) != '{}') {
              this.tabsList.forEach((el, index) => {
                if (el.dimTypeId == this.dataTableTabs) {
                  let num = this.tabsList[index].content.findIndex(item => {
                    return item.field == res.columns.code[0]
                  })
                  if (num < 0) {
                    res.columns.unitName.forEach((el, n) => {
                      if (!el) {
                        this.tabsList[index].content.push({
                          label: res.columns.title[n],
                          field: res.columns.code[n],
                          align: 'center'
                        })
                      } else {
                        this.tabsList[index].content.push({
                          label: res.columns.title[n] + '(' + el + ')',
                          field: res.columns.code[n],
                          align: 'center'
                        })
                      }
                    })
                  } else {
                    this.$message.warning('该指标已存在！')
                  }
                }
              })
            } else {
              if (!this.addDicParams.children) {
                this.$message.warning('该指标不属于此维度，不能添加！')
              }
            }
          })
        }
      },
      // 调用模板
      rowDbClick(row) {
        let tabsName = row.cid + 'false'
        this.templateParams.push({cid: tabsName, content: row.modcontent, name: row.modname})
        getBoardData(row.cid).then(res => {
          let content = []
          if (!this.tabsList.length) {
            res.columns.code.forEach((el, index) => {
              if (!res.columns.unitName[index]) {
                content.push({
                  label: res.columns.title[index],
                  field: el,
                  align: 'center'
                })
              } else {
                content.push({
                  label: res.columns.title[index] + '(' + res.columns.unitName[index] + ')',
                  field: el,
                  align: 'center'
                })
              }
            })
            this.addTab(row.modname, content, tabsName)
          } else {
            let index = this.tabsList.findIndex(item => {
              return item.title == row.modname
            })
            if (index < 0) {
              res.columns.code.forEach((el, index) => {
                if (!res.columns.unitName[index]) {
                  content.push({
                    label: res.columns.title[index],
                    field: el,
                    align: 'center'
                  })
                } else {
                  content.push({
                    label: res.columns.title[index] + '(' + res.columns.unitName[index] + ')',
                    field: el,
                    align: 'center'
                  })
                }
              })
              this.addTab(row.modname, content, tabsName)
            } else {
              this.$message.warning('此维度已存在！')
            }
          }
          res.rows.forEach((el, index) => {
            res.columns.unitDevide.forEach((resp, num) => {
              if (resp) {
                if (!el[res.columns.code[num]]) {
                  el[res.columns.code[num]] = '--'
                } else {
                  el[res.columns.code[num]] = (el[res.columns.code[num]] / resp).toFixed(res.columns.nPrecision[num])
                }
              }
            })
          })
          this.tabsList.forEach((el, index) => {
            if (el.dimTypeId == this.dataTableTabs) {
              this.tabsList[index].tableList.data = res.rows
            }
          })
        })
      },
      // 获取模板列表
      getBoardData() {
        getBoardList().then(res => {
          this.boardData = res
        })
      },
      // 编辑模板
      editDetails(params) {
        this.dialogParams.boardName = params.modname
        this.dialogFormDetail = true
        this.editFlag = true
        this.editCid = params.cid
        this.editModContent = params.modcontent
      },
      // 删除模板
      deleteDetails(val) {
        this.deleteDialogForm = true
        this.deleteParams = val.cid
      },
      yesDelete() {
        this.deleteDialogForm = false
        let params = {cId: this.deleteParams}
        deleteBoard(params).then(res => {
          if (res.success) {
            this.txt = '删除模板'
            this.dialogFormVisble = true
            this.getBoardData()
            setTimeout(() => {
              this.dialogFormVisble = false
              this.deleteParams = ''
            }, 2000)
          }
        })
      },
      noDelete() {
        this.deleteDialogForm = false
      },
      // 保存模板
      sureName() {
        if (!this.dialogParams.boardName) {
          this.$message.warning('模板名称不能为空！')
        } else {
          if (this.editFlag) {
            let params = {cId: this.editCid, modName: this.dialogParams.boardName, modContent: this.editModContent}
            editBoard(params).then(res => {
              if (res.success) {
                this.txt = '编辑模板'
                this.dialogFormVisble = true
                this.getBoardData()
                setTimeout(() => {
                  this.dialogFormVisble = false
                }, 2000)
              }
            })
          } else {
            let dimTypeId = this.dataTableTabs
            let dicTypeId = ''
            this.paramsId.forEach((el) => {
              if (el.dimTypeId == this.dataTableTabs) {
                dicTypeId = el.dicTypeId
              }
            })
            let params = {}
            getIndexParams(dicTypeId, dimTypeId).then(res => {
              params.indic = res.indic
            }).then(() => {
              getDimensionalityParams(dimTypeId).then(res => {
                params.dim = res.dim
              }).then(() => {
                let boardParams = {modName: this.dialogParams.boardName, modContent: JSON.stringify(params)}
                saveBoard(boardParams).then(res => {
                  if (res.success) {
                    this.dialogParams.boardName = ''
                    this.txt = '保存模板'
                    this.dialogFormVisble = true
                    this.getBoardData()
                    setTimeout(() => {
                      this.dialogFormVisble = false
                    }, 2000)
                  }
                })
              })
            })
          }
        }
        this.dialogFormDetail = false
      },
      cancleName() {
        this.dialogFormDetail = false
      },
      saveBoard() {
        this.dialogFormDetail = true
      },
      openTool() {
        if (this.isShow) {
          this.btnContent.icon = 'fa fa-angle-double-down'
          this.btnContent.text = '展开'
          this.isShow = false
        } else {
          this.btnContent.icon = 'fa fa-angle-double-up'
          this.btnContent.text = '收起'
          this.isShow = true
        }
      },
      // 维度左击
      nodeClick(val) {
        let date = new Date()
        let time = date.getTime()
        let secondTime = ''
        if (this.dimFirstTime) {
          let secondDate = new Date()
          secondTime = secondDate.getTime()
          this.dimIntervalTime = secondTime - this.dimFirstTime
        }
        this.dimFirstTime = time
        this.addDimParams = val
        getIndex(val.id).then(res => {
          this.indexTreeData = res.treeData
        })
      },
      // 指标左击
      indexNodeClick(val) {
        let date = new Date()
        let time = date.getTime()
        let secondTime = ''
        if (this.dicFirstTime) {
          let secondDate = new Date()
          secondTime = secondDate.getTime()
          this.dicIntervalTime = secondTime - this.dicFirstTime
        }
        this.dicFirstTime = time
        this.addDicParams = val
      },
      // 提取数据
      getData() {
        let flag = this.dataTableTabs.substring(this.dataTableTabs.length - 5, this.dataTableTabs.length)
        console.log(this.paramsId);
        if (flag != 'false') {
          let dimTypeId = this.dataTableTabs
          let dicTypeId = ''
          this.paramsId.forEach((el) => {
            if (el.dimTypeId == this.dataTableTabs) {
              dicTypeId = el.dicTypeId
            }
          })
          let params = {}
          this.loading = true
          getIndexParams(dicTypeId, dimTypeId).then(res => {
            params.indic = res.indic
          }).then(() => {
            getDimensionalityParams(dimTypeId).then(res => {
              params.dim = res.dim
            }).then(() => {
              pickUpData(JSON.stringify(params)).then(res => {
                res.rows.forEach((el, index) => {
                  el.id = Math.floor(Math.random() * 10000000000)
                  res.columns.unitDevide.forEach((resp, num) => {
                    if (resp) {
                      if (!el[res.columns.code[num]]) {
                        el[res.columns.code[num]] = '--'
                      } else {
                        el[res.columns.code[num]] = (el[res.columns.code[num]] / resp).toFixed(res.columns.nPrecision[num])
                      }
                    }
                  })
                })
                this.tabsList.forEach((el, index) => {
                  if (el.dimTypeId == dimTypeId) {
                    this.tabsList[index].tableList.data = res.rows
                  }
                })
                this.loading = false
              })
            })
          })
        } else {
          this.$message.warning('数据已生成！')
        }
      },
      // 增加tabs
      addTab(targetName, content, dimTypeId) {
        let newTabName = dimTypeId;
        this.tabsList.push({
          title: targetName,
          name: newTabName,
          content: content,
          dimTypeId: dimTypeId,
          tableList: {
            data: []
          }
        })
        this.dataTableTabs = newTabName
        this.tabsActiveName = targetName
      },
      tabClick(val) {
        getIndex(val.name).then(res => {
          this.indexTreeData = res.treeData
        })
        this.tabsActiveName = val.label
        this.flag = true
      },
      // 删除tabs
      removeTab(targetName) {
        let tabs = this.tabsList
        let activeName = this.dataTableTabs
        if (activeName == targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1]
              if (nextTab) {
                activeName = nextTab.name
              } else {
                activeName = ''
              }
            }
          })
        }
        this.tabsList.forEach((el, index) => {
          if (el.name == activeName) {
            this.tabsActiveName = this.tabsList[index].title
          }
        })
        if (this.tabsList.length == 1) {
          this.dataTableTabs = ''
        } else {
          this.dataTableTabs = activeName
        }
        this.tabsList = tabs.filter(tab => tab.name !== targetName)
      },
      selectionChange(val) {
        this.selectRow = []
        val.forEach((el) => {
          this.selectRow.push(el.id)
        })
      },
      // 删除表格行数据
      deleteRows() {
        this.tabsList.forEach((el, index) => {
          if (el.name == this.dataTableTabs) {
            this.selectRow.forEach((res) => {
              this.tabsList[index].tableList.data.forEach((resp, n) => {
                if (res == resp.id) {
                  this.tabsList[index].tableList.data.splice(n, 1)
                }
              })
            })
          }
        })
      }
    }
  }
</script>
<style lang="less">
  .dataBrowser {
    .toolTitle {
      display: flex;
      align-items: center;
      .el-col:nth-child(1) {
        border-right: 1px solid #ccc;
      }
      .el-col:nth-child(3) {
        border-left: 1px solid #ccc;
        border-right: 1px solid #ccc;
      }
      .tool {
        writing-mode: horizontal-tb;
        font-size: 14px;
        color: #fff
      }
    }
    .btnWrap {
      .el-button {
        display: block;
        font-size: 14px;
        margin-left: 0px;
        border: none;
        color: #fff
      }
      .el-button:hover {
        background-color: rgba(0, 0, 0, 0.3);
      }
    }
    .el-tree {
      background-color: transparent;
      color: #7b8fb9;
      .el-tree-node:focus > .el-tree-node__content {
        background-color: transparent;
      }
      .el-tree-node.is-current.is-focusable {
        background-color: rgba(0, 0, 0, 0.08);
      }
      .el-tree-node__content:hover {
        background-color: transparent;
      }
    }
    .moreTabs {
      .el-tabs__nav-wrap {
        padding: 0px !important;
        .el-tabs__nav-scroll {
          padding-left: 0px !important;
        }
      }
    }
    .toolWrap {
      padding: 10px;
      .cursorPointer {
        cursor: pointer;
      }
      .iconStyle {
        display: block;
        font-size: 34px;
        text-align: center;
        padding: 5px 0px;
        color: #fff
      }
    }
    .smallDialog {
      .el-dialog {
        width: 20%;
      }
    }
    .editDialogForm {
      border: 1px solid rgba(255, 255, 255, 0.1);
      > div:nth-child(1) {
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }
      .el-col {
        padding: 10px 30px;
      }
      .rightParams {
        border-left: 1px solid rgba(255, 255, 255, 0.1);
      }
      .el-form-item {
        display: block;
        margin-bottom: 0px;
      }
    }
    .el-button--text {
      padding: 0px;
    }
  }
</style>
