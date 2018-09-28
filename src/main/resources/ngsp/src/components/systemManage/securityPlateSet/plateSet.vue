<!--证券板块列表- 证券板块编号 -->
<template>
  <div class='plateSet'>
    <el-card>
      <div slot='header'>
        <span>查询条件</span>
        <el-button size='small' type='info' :disabled="auto" @click='emptyClick'>清空</el-button>
        <el-button size='small' type='primary' @click='queryClick'>搜索</el-button>
        <el-button size='small' type='primary' :disabled="auto" @click='handleExport'>导出</el-button>
        <div style='display:inline-block;float:right'>
          <file-upload
            style="display:inline-block"
            ref="upload"
            :limitFileType="['xls', 'xlsx']"
            :actionUrl="gfnGetUploadExcelReturnBasicUrl()"
            :uploadOption="{
              size: 'small',
              type: 'primary',
              name: '导入',
              disabledflag: auto
            }"
            :uploadParams="uploadParams"
            @getTxtCon="handleImport"
          >
          </file-upload>
        </div>
      </div>
      <el-row>
        <el-col :span='24'>
          <el-form ref='form' :model='securityModel'>
            <el-col :span='24'>
              <el-col :span='6'>
                <el-form-item prop='dealType' label='交易所种类:'>
                  <el-col :span='17'>
                    <el-select
                      v-model='securityModel.dealType'
                      placeholder='请选择交易所种类'
                      size='small'
                      style='width: 100%;'>
                      <el-option
                        v-for='saleitemT in dealTypeOptions'
                        :key='saleitemT.value'
                        :label='saleitemT.text'
                        :value='saleitemT.value'>
                      </el-option>
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span='6' :offset='1'>
                <el-form-item prop='productType' label='产品类别:'>
                  <el-col :span='17'>
                    <el-select
                      v-model='securityModel.productType'
                      placeholder='请选择产品类别'
                      size='small'
                      style='width: 100%;'>
                      <el-option
                        v-for='saleitemT in productTypeOptions'
                        :key='saleitemT.value'
                        :label='saleitemT.text'
                        :value='saleitemT.value'>
                      </el-option>
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span='6' :offset='1'>
                <el-form-item prop='securityCode' label='证券代码:'>
                  <el-col :span='17'>
                    <el-input
                      v-model='securityModel.securityCode'
                      auto-complete='off'
                      placeholder='请输入证券代码'
                      size='small'>
                    </el-input>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-col>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
    <el-card class='el-card-table'>
      <div slot='header'>
        <span>查询结果</span>
        <el-button size='mini' @click='goBack' type='info' style='float: right'>返回</el-button>
        <!--<el-button size='mini' @click='exportExcel' type='primary' style='float: right'>导出</el-button>-->
        <!--<el-button size='mini' @click='exportExcel' type='primary' style='float: right'>导入</el-button>-->
      </div>
      <el-row>
        <el-col :span='24'>
          <div class='memberLeft'>
            <el-col :span='24'>
              <el-table class='el-card-table'
                        ref='multipleTableLeft'
                        height='450px'
                        :data='tableDataLeft'
                        tooltip-effect='dark'
                        v-loading='queryResLoadMain'
                        element-loading-spinner='el-icon-loading'
                        element-loading-text='数据加载中，请耐心等待...'
                        element-loading-background='rgba(0,0,0,0.3)'
                        @selection-change='memberLeftChange'>
                <el-table-column
                  style='text-align: center;'
                  align='center'
                  type='selection' width='55'>
                </el-table-column>
                <el-table-column
                  sortable
                  prop='instrument_id'
                  label='证券代码 '
                  width='155'>
                </el-table-column>
                <el-table-column
                  sortable
                  prop='instrument_chn_short_name'
                  label='证券名称'
                  show-overflow-tooltip>
                </el-table-column>
              </el-table>
            </el-col>
            <!--分页-->
            <el-col :span='24'>
              <el-pagination
                @size-change='pageSizeLChange'
                @current-change='pageCurrentLChange'
                :current-page='currentPageL'
                :page-sizes='[10,20,50,100]'
                :page-size='pageSizeL'
                layout='total,sizes,prev,pager,next,jumper'
                :total='pageLTotal'
              ></el-pagination>
            </el-col>
          </div>
          <div class='memberBut'>
            <el-col :span='24'>
              <el-button type='text' :disabled='productActorLift.length < 1 || auto'
                         class='el-but-but' size='mini' @click='rightClick'>
                <i class='el-icon-arrow-right'></i>
              </el-button>
            </el-col>
            <el-col :span='24'>
              <el-button type='text' :disabled='productActorRight.length < 1 || auto'
                         class='el-but-but' size='mini'
                         @click='leftClick'>
                <i class='el-icon-arrow-left'></i>
              </el-button>
            </el-col>
          </div>
          <div class='memberRight'>
            <el-col :span='24'>
              <el-table class='el-card-table'
                        height='450px'
                        ref='multipleTableRight'
                        :data='tableDataRight'
                        tooltip-effect='dark'
                        v-loading='queryResLoadMain'
                        element-loading-spinner='el-icon-loading'
                        element-loading-text='数据加载中，请耐心等待...'
                        element-loading-background='rgba(0,0,0,0.3)'
                        @selection-change='memberRightChange'>
                <el-table-column
                  style='text-align: center;'
                  align='center'
                  type='selection' width='55'>
                </el-table-column>
                <el-table-column
                  sortable
                  prop='product_id'
                  label='证券代码 '
                  width='155'>
                </el-table-column>
                <el-table-column
                  sortable
                  prop='instrument_chn_short_name'
                  label='证券名称'
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  sortable
                  prop='instrument_sub_type_code'
                  label='证券类型'
                  show-overflow-tooltip>
                </el-table-column>
              </el-table>
            </el-col>
            <!--分页-->
            <el-col>
              <el-pagination
                @size-change='pageSizeChange'
                @current-change='pageCurrentChange'
                :current-page='currentPage'
                :page-sizes='[10,20,50,100]'
                :page-size='pageSize'
                layout='total,sizes,prev,pager,next,jumper'
                :total='pageTotal'
              ></el-pagination>
            </el-col>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
  import FileUpload from '@/components/common/textUpload'
  import {
    getMonitoringObjectType, // 产品类别下拉框
    postPlateLeft, // 右  // 搜索
    postPlateRight, // 左
    postPlateLeftMove, // 右移
    postPlateRightMove, // 左移
    importSecurity, // 导入
    exportSecurity // 导出
  } from '../../../service/systemManage/securityPlateSet'

  export default {
    name: 'plateSet',
    components: {
      FileUpload
    },
    data () {
      return {
        securityModel: {
          dealType: '1',
          productType: 'ASH',
          securityCode: ''
        },
        dealTypeOptions: [
          {
            value: '1',
            text: '上交所'
          }
        ],
        productTypeOptions: [
          {
            value: 'ASH',
            text: 'A股'
          }
        ],
        // 左右数据
        tableDataLeft: [],
        tableDataRight: [],
        queryResLoadMain: false,
        currentPageL: 1, // 分页当前页
        pageSizeL: 10,
        pageLTotal: 0, // 分页总数
        currentPage: 1, // 分页当前页
        pageSize: 10,
        pageTotal: 0, // 分页总数
        mulitLeft: [],
        mulitRight: [],
        productActorLiftID: [],
        productActorRightID: [],
        productActorLift: [],
        productActorRight: [],
        uploadParams: {
          loading: false,
          label: '上传Excel',
          type: 'primary',
          params: [
            {
              sheetIdx: 0,
              columnIdx: 0,
              firstToSkip: 0,
              lastToAbandon: 0
            }
          ]
        },
        auto: false
      }
    },
    methods: {
      handleExport () {
        exportSecurity(this.$route.query.id)
      },
      handleImport (codes) {
        // 当前对象的类型
        let params = {
          gatherID: this.$route.query.id,
          codes: codes.join(',')
        }
        importSecurity(params).then(resp => {
          const {success, message} = resp
          if (success) {
            this.$message.success(message)
            this.rightDataList()
          } else {
            this.$message.error(message)
          }
        })
      },
      goBack () {
        this.$router.go(-1)
      },
      // 产品类别
      productType () {
        getMonitoringObjectType('productType', 'sysSetting').then((resp) => {
          this.productTypeOptions = resp
        })
      },
      // 导出
      exportExcel () {},
      // 清空
      emptyClick () {
        this.securityModel.dealType = '1'
        this.securityModel.productType = 'ASH'
        this.securityModel.securityCode = ''
      },
      // 搜索
      queryClick () {
        this.queryResLoadMain = true
        let params = {
          'pageIndex': 1, // 页码
          'pageRows': this.pageSizeL, // 每页最多的显示数目
          'gatherID': this.$route.query.id, // 证券板块ID
          'instrumentID': this.securityModel.securityCode, //  证券代码
          'instrumentSubTypeCode': this.securityModel.productType //  证券代码
        }
        postPlateLeft(params).then((resp) => {
          if (resp) {
            this.queryResLoadMain = false
            this.tableDataLeft = resp.buzidata
            this.pageLTotal = resp.totalNum
          }
        })
      },
      // 导入
      importClick () {},
      // 分页
      pageSizeLChange (val) {
        this.currentPageL = 1
        this.pageSizeL = val
        this.leftDataList()
      },
      pageCurrentLChange (val) {
        this.currentPageL = val
        this.leftDataList()
      },
      pageSizeChange (val) {
        this.currentPage = 1
        this.pageSize = val
        this.rightDataList()
      },
      pageCurrentChange (val) {
        this.currentPage = val
        this.rightDataList()
      },
      // 左边数据
      leftDataList () {
        this.queryResLoadMain = true
        let params = {
          'pageIndex': this.currentPageL, // 页码
          'pageRows': this.pageSizeL, // 每页最多的显示数目
          'gatherID': this.$route.query.id, // 证券板块ID
          // 'instrumentID': this.securityModel.securityCode, //  证券代码
          'instrumentSubTypeCode': this.securityModel.productType //  产品类别代码
        }
        postPlateLeft(params).then((resp) => {
          if (resp) {
            this.queryResLoadMain = false
            this.tableDataLeft = resp.buzidata
            this.pageLTotal = resp.totalNum
          }
        })
      },
      // 右边数据
      rightDataList () {
        this.queryResLoadMain = true
        let params = {
          'pageIndex': this.currentPage, // 页码
          'pageRows': this.pageSize, // 每页最多显示数目
          'gatherID': this.$route.query.id // 证券板块ID
        }
        postPlateRight(params).then((resp) => {
          if (resp) {
            this.queryResLoadMain = false
            this.tableDataRight = resp.buzidata
            this.pageTotal = resp.totalNum
          }
        })
      },
      memberLeftChange (val) {
        this.mulitLeft = val
        this.productActorLiftID = []
        this.mulitLeft.forEach((el) => {
          let objVal = {
            gatherID: this.$route.query.id,
            productID: el.instrument_id,
            isInCode: el.isin_code
          }
          this.productActorLiftID.push(objVal)
        })
        this.productActorLift = this.productActorLiftID
      },
      memberRightChange (val) {
        this.mulitRight = val
        this.productActorRightID = []
        this.mulitRight.forEach((el) => {
          let objVal = {
            gatherID: this.$route.query.id,
            productID: el.product_id,
            isInCode: el.instrument_sub_type_code
          }
          this.productActorRightID.push(objVal)
        })
        this.productActorRight = this.productActorRightID
      },
      // (添加--右移)
      rightClick () {
        if ($.isEmptyObject(this.mulitLeft)) {
          this.$message.error('请选择添加数据!')
        } else {
          let params = this.productActorLift
          postPlateLeftMove(JSON.stringify(params)).then((resp) => {
            if (resp) {
              /* 页码 - 1 */
              this.currentPageL = this.currentPageL - 1 || 1
              this.$message.success('操作成功!')
              this.leftDataList()
              this.rightDataList()
            }
          })
        }
      },
      // (移除--左移)
      leftClick () {
        if ($.isEmptyObject(this.mulitRight)) {
          this.$message.error('请选择移除数据!')
        } else {
          let params = this.productActorRight
          postPlateRightMove(JSON.stringify(params)).then((resp) => {
            if (resp) {
              /* 页码 - 1 */
              this.currentPage = this.currentPage - 1 || 1
              this.$message.success('操作成功!')
              this.leftDataList()
              this.rightDataList()
            }
          })
        }
      }
    },
    mounted () {
      this.productType()
      this.leftDataList()
      this.rightDataList()
      const {auto} = this.$route.query
      this.auto = auto
    }
  }

</script>
<style lang='less'>
  .plateSet {
    .colPX {
      margin: 0 20px;
    }
    .memberLeft {
      width: 45%;
      float: left;
    }
    .memberBut {
      width: 10%;
      float: left;
      text-align: center;
      line-height: 4;
      margin-top: 140px;
    }
    .memberRight {
      width: 45%;
      float: right;
    }
    .litiTab {
      color: #fff;
      margin-bottom: 20px;
      padding-left: 20px;
    }
  }

</style>
