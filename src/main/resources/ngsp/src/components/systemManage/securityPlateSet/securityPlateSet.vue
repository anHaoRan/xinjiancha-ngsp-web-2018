<!--证券板块设置-->
<template>
  <div class="securityPlateSet">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <el-card size="mini">
      <div slot="header">
        <span size="mini">查询条件</span>
        <el-button size="small" type="info" @click="emptyClick">清空</el-button>
        <el-button size="small" type="primary" @click="queryClick">搜索</el-button>
      </div>
      <el-row>
        <el-form ref="form" :model="securityPlateModel" :inline="true">
          <el-form-item prop="securityNname" label="证券板块编号：">
            <el-input
              v-model="securityPlateModel.gatherId"
              auto-complete="off"
              placeholder="请选择证券板块编号"
              size="small">
            </el-input>
          </el-form-item>
          <el-form-item prop="securityNname" label="证券板块名称：">
            <el-input
              v-model="securityPlateModel.securityNname"
              auto-complete="off"
              placeholder="请选择证券板块名称"
              size="small">
            </el-input>
          </el-form-item>
        </el-form>
      </el-row>
    </el-card>
    <el-card class="el-card-table">
      <div slot="header">
        <span>证券板块列表</span>
        <!--<el-button size="small" type="primary" @click="handleExport">导出</el-button>-->
        <el-button type="primary" size="small" @click="handleDelete">删除</el-button>
        <el-dialog title="删除证券板块" :visible.sync="deletes" width="700px" left>
          <el-row>
            <el-col>
              <span>是否确定删除？</span>
            </el-col>
            <el-col>
              <div class="dialog-footer">
                <el-button type="primary" size="small" @click="deleteClick">确认</el-button>
                <el-button type="text" size="samll" @click="deletes=false">取消</el-button>
              </div>
            </el-col>
          </el-row>
        </el-dialog>
        <el-button type="primary" size="small" @click="amenClick">修改</el-button>
        <el-dialog :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   title="修改证券板块" :visible.sync="amendk" width="700px" left>
          <el-row>
            <el-col>
              <el-form ref="form" :model="amendPlateNewModel">
                <el-form-item prop="plateNname" label="证券板块名称：" :label-width="formsLabel">
                  <el-col :span="22">
                    <el-input
                      :maxLength="16"
                      placeholder="请输入证券板块名称(不超过16个字符)"
                      v-model="amendPlateNewModel.plateNname"
                      auto-complete="off"
                      @change="plateNnameChange"
                      size="small">
                    </el-input>
                  </el-col>
                </el-form-item>
                <el-form-item prop="plateDesctibe" label="证券板块描述：" :label-width="formsLabel">
                  <el-col :span="22">
                    <el-input
                      type="textarea"
                      :maxLength="128"
                      placeholder="请输入证券板块描述(不超过128个字符)"
                      v-model="amendPlateNewModel.plateDesctibe"
                      auto-complete="off"
                      size="small">
                    </el-input>
                  </el-col>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col>
              <div class="dialog-footer">
                <el-button type="primary" size="small" @click="amendClick">确认</el-button>
                <el-button type="text" size="samll" @click="amendk=false">取消</el-button>
              </div>
            </el-col>
          </el-row>
        </el-dialog>
        <el-button size="small" type="primary" @click="plateSetNew=true">新建</el-button>
        <el-dialog :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   title="新增证券板块" :visible.sync="plateSetNew" width="700px" left>
          <el-row>
            <el-col>
              <el-form ref="form" :model="addPlateNewModel">
                <el-form-item prop="plateNname" label="证券板块名称：" :label-width="formLabel">
                  <el-col :span="22">
                    <el-input
                      v-model="addPlateNewModel.plateNname"
                      auto-complete="off"
                      @change="plateNnameChange"
                      placeholder="请输入证券板块名称(不超过16个字符)"
                      :maxLength="16"
                      size="small">
                    </el-input>
                  </el-col>
                </el-form-item>
                <el-form-item prop="plateDesctibe" label="证券板块描述：" :label-width="formLabel">
                  <el-col :span="22">
                    <el-input
                      type="textarea"
                      v-model="addPlateNewModel.plateDesctibe"
                      auto-complete="off"
                      placeholder="请输入证券板块描述(不超过128个字符)"
                      :maxLength="128"
                      size="small">
                    </el-input>
                  </el-col>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col>
              <div class="dialog-footer">
                <el-button type="primary" size="small" @click="plateSetNewClick">确认</el-button>
                <el-button type="text" size="samll" @click="plateSetNew=false">取消</el-button>
              </div>
            </el-col>
          </el-row>
        </el-dialog>
      </div>
      <el-row>
        <el-col :span="24">
          <el-col :span="24">
            <el-table class="el-card-table"
                      border
                      ref="accountRerf"
                      :data="accountDatas"
                      show-overflow-tooltip
                      v-loading="queryResLoadMain"
                      element-loading-spinner="el-icon-loading"
                      element-loading-text="数据加载中，请耐心等待..."
                      element-loading-background="rgba(0,0,0,0.3)"
                      style="width:100%;">
              <el-table-column width="55" align="center">
                <template slot-scope="scope">
                  <el-radio
                    class="radio" v-model="radio"
                    :label="scope.row.gather_id"
                    @change="getRadio">
                  </el-radio>
                </template>
              </el-table-column>
              <el-table-column
                prop="gather_id"
                label="证券板块编号"
                sortable
                align="left">
                <template slot-scope="scope">
                  <a class="slotScope"
                     type="text" size="small"
                     @click="toDetailA(scope.row)">
                    {{scope.row.gather_id}}
                  </a>
                </template>
              </el-table-column>
              <el-table-column
                prop="gather_name"
                label="证券板块名称"
                align="left">
              </el-table-column>
              <el-table-column
                prop="gather_desc"
                label="证券板块描述"
                align="left">
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="24" style="margin-bottom: 0;">
            <el-pagination
              @size-change="sizeChangeTable"
              @current-change="currentChangeTable"
              :current-page="currentPage"
              :page-sizes="pageSizes"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="tableTotal"
              size="mini">
            </el-pagination>
          </el-col>
        </el-col>
      </el-row>
    </el-card>

  </div>
</template>
<script>
  import breadcrumb from '../../../components/common/Breadcrumb'
  import {
    postPlate, // 证券板块设置(列表和查询)
    postPlateAdd, // 新增
    postPlateAmend, // 修改
    getPlateDelete, // 删除
    exportSecurity // 导出
  } from '../../../service/systemManage/securityPlateSet'

  export default {
    components: {
      breadcrumb
    },
    data () {
      return {
        breadcrumbItems: [
          {
            router: '/securityPlateSet',
            label: '系统管理'
          }, {
            router: '/securityPlateSet',
            label: '设置'
          }, {
            router: '/securityPlateSet',
            label: '证券板块设置'
          }
        ],
        // 证券板块名称弹框宽度
        formsLabel: '122px',
        formLabel: '122px',
        securityPlateModel: {
          gatherId: '',
          securityNname: ''
        },
        addPlateNewModel: {
          plateNname: '',
          plateDesctibe: ''
        },
        amendPlateNewModel: {
          plateNname: '',
          plateDesctibe: ''
        },
        queryResLoadMain: false,
        accountDatas: [],
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        tableTotal: 0,
        // 证券板块名称弹框
        amendk: false,
        deletes: false,
        plateSetNew: false,
        radio: '',
        accountDatasID: '',
        gatherId: '',
        gatherName: '',
        gatherDesc: ''
      }
    },
    methods: {
      handleExport () {
        if (!this.gatherId) {
          this.$message.error('请先选择一个证券板块')
          return
        }
        exportSecurity(this.gatherId)
      },
      /* 删除 */
      handleDelete () {
        if (!this.gatherId) {
          this.$message.error('请先选择一个证券板块')
          return
        }
        if (this.gatherDesc && this.gatherDesc.indexOf('自动维护') > -1) {
          this.$message.error('自动维护的证券板块无法删除')
          return
        }
        this.$confirm(`确定删除${this.gatherName}？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          getPlateDelete({id: this.gatherId}).then((res) => {
            if (res.indexOf('DELETE_SUCCESS') > -1) {
              this.$message.success('删除成功')
              this.gatherId = ''
              this.allPlateData()
            } else {
              // this.$message.error('无法删除已关联监控对象的证券板块')
              this.$message.error(res)
            }
          })
        }).catch(() => {})
      },
      getRadio (val) {
        this.radio = val
        let filterItem = this.accountDatas.filter(v => {
          return v.gather_id === val
        })
        this.gatherId = filterItem[0].gather_id
        this.gatherName = filterItem[0].gather_name
        this.gatherDesc = filterItem[0].gather_desc
      },
      // 证券板块列表
      allPlateData () {
        this.queryResLoadMain = true
        let params = {
          gatherName: this.securityPlateModel.securityNname,
          pageIndex: this.currentPage,
          pageRows: this.pageSize
        }
        postPlate(params).then((resp) => {
          this.queryResLoadMain = false
          this.accountDatas = resp.buzidata
          this.tableTotal = resp.totalNum
        })
      },
      // 分页
      sizeChangeTable (val) {
        this.pageSize = val
        this.radio = ''
        this.gatherId = ''
        this.gatherName = ''
        this.gatherDesc = ''
        this.allPlateData()
      },
      // 当前页
      currentChangeTable (val) {
        this.currentPage = val
        this.radio = ''
        this.gatherId = ''
        this.gatherName = ''
        this.gatherDesc = ''
        this.allPlateData()
      },
      // 清空
      emptyClick (value) {
        this.securityPlateModel.securityNname = ''
        this.securityPlateModel.gatherId = ''
      },
      // 查询
      queryClick () {
        this.queryResLoadMain = true
        let params = {
          gatherId: this.securityPlateModel.gatherId,
          gatherName: this.securityPlateModel.securityNname,
          pageIndex: 1,
          pageRows: this.pageSize,
          orderField: '',
          orderType: ''
        }
        postPlate(params).then((resp) => {
          this.queryResLoadMain = false
          this.accountDatas = resp.buzidata
          this.tableTotal = resp.totalNum
          this.radio = ''
          this.gatherId = ''
          this.gatherName = ''
          this.gatherDesc = ''
        })
      },
      // 新增
      plateSetNewClick (value) {
        if (!this.addPlateNewModel.plateNname.trim()) {
          this.$message.error('证券板块名称不能为空!')
        } else {
          this.queryResLoadMain = true
          let params = {
            gatherName: this.addPlateNewModel.plateNname,
            gatherDesc: this.addPlateNewModel.plateDesctibe
          }
          postPlateAdd(params).then((resp) => {
            if (resp) {
              this.queryResLoadMain = false
              this.plateSetNew = false
              this.$message.success('保存成功!')
              this.addPlateNewModel.plateNname = ''
              this.addPlateNewModel.plateDesctibe = ''
              this.allPlateData()
            }
          })
        }
      },
      // 修改
      amenClick () {
        if (!this.gatherId) {
          this.$message.error('请选择记录!')
          this.amendk = false
        } else {
          if (this.gatherDesc && this.gatherDesc.indexOf('自动维护') > -1) {
            this.$message.error('自动维护的证券板块无法修改')
            return
          }
          this.amendk = true
          this.amendPlateNewModel.plateNname = this.gatherName
          this.amendPlateNewModel.plateDesctibe = this.gatherDesc
        }
      },
      amendClick () {
        if (!this.amendPlateNewModel.plateNname || (this.amendPlateNewModel.plateNname && !this.amendPlateNewModel.plateNname.trim())) {
          this.$message.error('证券板块名称不能为空!')
          return
        }
        this.queryResLoadMain = true
        let params = {
          gatherName: this.amendPlateNewModel.plateNname,
          gatherDesc: this.amendPlateNewModel.plateDesctibe,
          gatherId: this.gatherId
        }
        postPlateAmend(params).then((resp) => {
          if (resp) {
            this.queryResLoadMain = false
            this.$message.success('保存成功!')
            this.amendk = false
            this.allPlateData()
            this.radio = ''
            this.gatherId = ''
            this.gatherName = ''
            this.gatherDesc = ''
          }
        })
      },
      deleteClick () {
        if (!this.gatherId) {
          this.$message.error('请选择删除的记录!')
        } else {
          getPlateDelete(this.gatherId).then((resp) => {
            if (resp) {
              this.$message.error('删除成功!')
            } else {
              this.allPlateData()
            }
          })
        }
      },
      // 证券板块编号
      toDetailA (row) {
        this.$router.push({path: '/plateSet', query: {id: row.gather_id, auto: row.gather_desc && row.gather_desc.indexOf('自动维护') > -1}})
      },
      // 新增证券板块名称
      plateNnameChange (value) {}
    },
    mounted () {
      this.allPlateData()
    }
  }
</script>
<style lang="less" scoped>
  .securityPlateSet {
    .el-card {
      width: 100%;
      .el-form {
        width: 100%;
      }
    }
    /deep/ .el-radio__label {
      display: none !important;
    }
    .dialog-footer {
      float: left;
      width: 100%;
      text-align: center;
      display: flex;
      justify-content: center;
      margin-top: 20px;
    }
    .slotScope {
      text-decoration: underline;
      color: #1b5eed;
      cursor: pointer;
    }
  }

</style>
