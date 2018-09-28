<!--重点监控设置-->
<template>
  <div class="emphasisMontioring">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <el-card>
      <div slot="header">
        <span>查询条件</span>
        <el-button size="small" type="info" @click="emptyClick">清空</el-button>
        <el-button size="small" type="primary" @click="queryClick">查询</el-button>
      </div>
      <el-row>
        <el-col :span="24">
          <el-col :span="6" :offset="1">
            <el-form ref="form" :model="securityPlateModel" :rules="rulesFormsecurityPlate">
              <el-form-item prop="securityNname" label="证券板块名称">
                <el-col :span="17">
                  <el-input
                    v-model="securityPlateModel.securityNname"
                    auto-complete="off"
                    @change="securityPlateChange"
                    size="small">
                  </el-input>
                </el-col>
              </el-form-item>
            </el-form>
          </el-col>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="el-card-table">
      <div slot="header">
        <span>证券板块列表</span>
        <!--<el-button type="primary" size="small" @click="deleteClick">删除</el-button>-->
        <el-button type="primary" size="small" @click="amendk=true">修改</el-button>
        <el-dialog title="修改证券板块" :visible.sync="amendk" width="700px" left>
          <el-row>
            <el-col>
              <el-form ref="form" :model="amendPlateNewModel" :rules="rulesFormAmend">
                <el-form-item prop="plateNname" label="证券板块名称：" :label-width="formsLabel">
                  <el-col :span="22">
                    <el-input
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
        <el-button size="small" type="primary" @click="plateSetNew=true">新增</el-button>
        <el-dialog title="新增证券板块" :visible.sync="plateSetNew" width="700px" left>
          <el-row>
            <el-col>
              <el-form ref="form" :model="plateNewModel" :rules="rulesFormDialog">
                <el-form-item prop="plateNname" label="证券板块名称：" :label-width="formLabel">
                  <el-col :span="22">
                    <el-input
                      v-model="plateNewModel.plateNname"
                      auto-complete="off"
                      @change="plateNnameChange"
                      size="mini">
                    </el-input>
                  </el-col>
                </el-form-item>
                <el-form-item prop="plateDesctibe" label="证券板块描述：" :label-width="formLabel">
                  <el-col :span="22">
                    <el-input
                      type="textarea"
                      v-model="plateNewModel.plateDesctibe"
                      auto-complete="off"
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
          <el-table
            height="300"
            border
            ref="accountRerf"
            :data="accountDatas"
            show-overflow-tooltip
            style="width:100%;">
            <el-table-column width="55" align="center">
              <template slot-scope="scope">
                <el-radio
                  class="radio" v-model="radio"
                  :label="scope.$index"
                  @change="getRadio">
                </el-radio>
              </template>
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="证券板块编号"
              align="left">
            </el-table-column>
            <el-table-column
              prop="name"
              label="证券板块名称"
              align="left">
            </el-table-column>
            <el-table-column
              prop="description"
              label="证券板块描述"
              align="left">
            </el-table-column>
          </el-table>
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
    // postAllPlate,         // 查询列表信息
    postPlate,            // 根据名称查询具体板块信息
    postPlateAdd,        // 新增
    postPlateAmend,      // 修改
    getPlateDelete       // 删除
  } from '../../../service/systemManage/securityPlateSet'

  export default {
    components: {
      breadcrumb,
    },
    data () {
      // 证券板块名称
      let securityPlateChange = (rule, value, callback) => {
        if (value.match(/'/g)) {
          this.$message.error('内容不能包含单引号')
        }

        if (!value.trim()) {
          callback(new Error('输入不能为空'))
        } else if (!/^([\u4e00-\u9fa5]|\w)+$/.test(value)) {
          callback(new Error('输入格式不正确'))
        } else {
          callback(new Error(''))
        }
      }
      return {
        breadcrumbItems: [
          {
            router: '/emphasisMontioring',
            label: '系统管理'
          }, {
            router: '/emphasisMontioring',
            label: '设置'
          }, {
            router: '/emphasisMontioring',
            label: '重点监控设置'
          }
        ],
        id: '33',
        rulesFormsecurityPlate: {
          securityNname: [
            {required: true, validator: securityPlateChange, trigger: 'blur'}
          ]
        },
        rulesFormDialog: {},
        rulesFormAmend: {},
        // 证券板块名称弹框宽度
        formsLabel: '120px',
        formLabel: '120px',
        securityPlateModel: {
          securityNname: ''
        },
        plateNewModel: {
          plateNname: '',
          plateDesctibe: ''
        },
        amendPlateNewModel: {
          plateNname: '',
          plateDesctibe: ''
        },
        accountDatas: [],
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        tableTotal: 0,
        // 证券板块名称弹框
        amendk: false,
        plateSetNew: false
      }
    },
    methods: {
      // 证券板块列表
      allPlateData () {
        // postAllPlate().then((resp) => {
        //   this.accountDatas = resp.bizData;
        //   // this.tableTotal = resp.bizData.totalRows;
        //   // console.log(resp);
        // });
      },
      // 证券板块名称
      securityPlateChange (value) {
        console.log(value)
      },
      // 分页
      sizeChangeTable (value) {},
      currentChangeTable (value) {},
      // 清空
      emptyClick (value) {},
      // 查询
      queryClick () {
        // postAllPlate().then((resp) => {
        //   this.accountDatas = resp.bizData.metaData;
        //   this.tableTotal = resp.bizData.totalRows;
        //   console.log(resp);
        // });
      },
      // 新增
      plateSetNewClick (value) {
        let params = {
          name: 'test',
          desc: 'test'
        }
        postPlateAdd(params).then((resp) => {
          this.accountDatas = resp.bizData
          // this.tableTotal = resp.bizData.totalRows;
          // console.log(resp);
        })
      },
      // 修改
      amendClick (value) {
        let params = {
          name: 'test',
          desc: 'test',
          id: '3'
        }
        postPlateAmend(params).then((resp) => {
          this.accountDatas = resp.bizData
          // this.tableTotal = resp.bizData.totalRows;
          // console.log(resp);
          this.radio = ''
        })
      },
      // 删除
      deleteClick (value) {
        getPlateDelete(this.id).then((resp) => {
          console.log(resp)
          this.accountDatas = resp.bizData
          // this.tableTotal = resp.bizData.totalRows;
          // console.log(resp);
        })
      },
      // 证券板块名称
      plateNnameChange (value) {}
    },
    mounted () {
      this.allPlateData()
    }
  }

</script>
<style lang="less">
  .emphasisMontioring {
    .dialog-footer {
      float: left;
      width: 100%;
      text-align: center;
      display: flex;
      justify-content: center;
      margin-top: 20px;
    }
  }

</style>
