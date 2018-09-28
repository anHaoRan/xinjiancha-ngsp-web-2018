<template>
  <!--基本资料-->
  <div class="stock-basic-info">
    <el-card>
      <div slot="header">
        查询条件
        <el-button type="primary" size="small" style="float:right;margin-right: 12px" @click="getQueryRes">查询
        </el-button>
        <el-button
          type="info"
          size="small"
          style="float:right; "
          @click="alarmReporting"
          v-if="!queryResLoad">预警记录
        </el-button>
        <el-button
          type="info"
          size="small"
          style="float:right; "
          @click="annotationFile"
          v-if="false">
          <!--v-if="!queryResLoad"-->
          批注文件
        </el-button>
      </div>
      <el-dialog
        title="增加批注和文件"
        :visible.sync="dialogFormVisble"
        center
        width="650px">
        <el-form label-width="70px">
          <el-form-item label="代码：">
            <el-input
              v-model="stockCode"
              size="small"
              class="el-form-input"
              disabled>
            </el-input>
          </el-form-item>
          <el-form-item label="批注：">
            <el-input
              type="textarea"
              :autosize="{minRows:2,maxRows:4}"
              placeholder="请输入备注"
              v-model="remarkCon">
            </el-input>
          </el-form-item>
          <el-form-item label="文件：">

          </el-form-item>
        </el-form>
      </el-dialog>
      <el-row>
        <el-col :span="6" style="margin-left: 10px;">
          <el-col :span="6" class="name"><span class="mustInput name">*</span>证券代码：</el-col>
          <el-col :span="12">
            <el-input
              v-model="stockCode"
              placeholder="请输入证券代码"
              size="small"
              disabled>
            </el-input>
          </el-col>
        </el-col>
      </el-row>
    </el-card>

    <el-card
      v-if="showQueryResult"
      v-loading="queryResLoad"
      element-loading-spinner="el-icon-loading"
      element-loading-text="数据加载中，请耐心等待..."
      element-loading-background="rgba(0,0,0,0.3)"
    >
      <div slot="header">
        <span>查询结果</span>
      </div>
      <div v-if="!emptyResult">
        <div class="queryResult" v-if="commonData.stockCodeType==='equ'">
          <div>
            <el-row class="resultTitle">
              <el-col :offset="1">股票基本资料</el-col>
            </el-row>
            <el-row class="item">
              <el-col :span="11" :offset="2">
                <el-col :span="4">法定代表人：</el-col>
                <el-col :span="18">{{showContent.corporate_deputy}}</el-col>
              </el-col>
            </el-row>
            <el-row class="item">
              <el-col :span="11" :offset="2">
                <el-col :span="4">公司名称：</el-col>
                <el-col :span="18">{{showContent.comp_name}}</el-col>
              </el-col>
              <el-col :span="11">
                <el-col :span="4">所在行业：</el-col>
                <el-col :span="18">{{showContent.industry}}</el-col>
              </el-col>
            </el-row>
            <el-row class="item">
              <el-col :span="11" :offset="2">
                <el-col :span="4">公司地址：</el-col>
                <el-col :span="18">{{showContent.comp_addr}}</el-col>
              </el-col>
              <el-col :span="11">
                <el-col :span="4">电话：</el-col>
                <el-col :span="18">{{showContent.call}}</el-col>
              </el-col>
            </el-row>

            <el-row class="item">
              <el-col :span="11" :offset="2">
                <el-col :span="4">A股代码：</el-col>
                <el-col :span="18">{{showContent.a_share_code}}</el-col>
              </el-col>
              <el-col :span="11">
                <el-col :span="4">A股名称：</el-col>
                <el-col :span="18">{{showContent.a_share_name}}</el-col>
              </el-col>
            </el-row>
            <el-row class="item">
              <el-col :span="11" :offset="2">
                <el-col :span="4">B股代码：</el-col>
                <el-col :span="18">{{showContent.b_share_code}}</el-col>
              </el-col>
              <el-col :span="11">
                <el-col :span="4">B股名称：</el-col>
                <el-col :span="18">{{showContent.b_share_name}}</el-col>
              </el-col>
            </el-row>

            <el-row class="resultTitle">
              <el-col :offset="1">股票当前股本结构</el-col>
            </el-row>
            <el-row class="item">
              <el-col :span="11" :offset="2">
                <el-col :span="4">当前总股本：</el-col>
                <el-col :span="18">{{showContent.total_share}}</el-col>
              </el-col>
            </el-row>
            <el-row class="item">
              <el-col :span="11" :offset="2">
                <el-col :span="4">国家股：</el-col>
                <el-col :span="18">{{showContent.country_share}}</el-col>
              </el-col>
              <el-col :span="11">
                <el-col :span="4">职工股：</el-col>
                <el-col :span="18">{{showContent.employee_share}}</el-col>
              </el-col>
            </el-row>
            <el-row class="item">
              <el-col :span="11" :offset="2">
                <el-col :span="4">境内发起人股：</el-col>
                <el-col :span="18">{{showContent.domestic_init_share}}</el-col>
              </el-col>
              <el-col :span="11">
                <el-col :span="4">战略投资者配售：</el-col>
                <el-col :span="18">{{showContent.strategic_invest_placing}}</el-col>
              </el-col>
            </el-row>
            <el-row class="item">
              <el-col :span="11" :offset="2">
                <el-col :span="4">境外发起人股：</el-col>
                <el-col :span="18">{{showContent.overseas_init_share}}</el-col>
              </el-col>
              <el-col :span="11">
                <el-col :span="4">投资基金配售：</el-col>
                <el-col :span="18">{{showContent.invest_placing}}</el-col>
              </el-col>
            </el-row>
            <el-row class="item">
              <el-col :span="11" :offset="2">
                <el-col :span="4">国有法人股：</el-col>
                <el-col :span="18">{{showContent.country_corporation_share}}</el-col>
              </el-col>
              <el-col :span="11">
                <el-col :span="4">一般法人配售：</el-col>
                <el-col :span="18">{{showContent.corporation_placing}}</el-col>
              </el-col>
            </el-row>
            <el-row class="item">
              <el-col :span="11" :offset="2">
                <el-col :span="4">社会法人股：</el-col>
                <el-col :span="18">{{showContent.society_corporation_share}}</el-col>
              </el-col>
              <el-col :span="11">
                <el-col :span="4">公众A股：</el-col>
                <el-col :span="18">{{showContent.a_share}}</el-col>
              </el-col>
            </el-row>
            <el-row class="item">
              <el-col :span="11" :offset="2">
                <el-col :span="4">转配股：</el-col>
                <el-col :span="18">{{showContent.allot_share}}</el-col>
              </el-col>
              <el-col :span="11">
                <el-col :span="4">优先股：</el-col>
                <el-col :span="18">{{showContent.preferential_share}}</el-col>
              </el-col>
            </el-row>
            <el-row class="item">
              <el-col :span="11" :offset="2">
                <el-col :span="4">B股：</el-col>
                <el-col :span="18">{{showContent.b_share}}</el-col>
              </el-col>
              <el-col :span="11">
                <el-col :span="4">H股：</el-col>
                <el-col :span="18">{{showContent.h_share}}</el-col>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="queryResult" v-if="commonData.stockCodeType==='obd'">
          <el-row class="resultTitle">
            <el-col :offset="1">债券基本资料</el-col>
          </el-row>
          <el-row class="item">
            <el-col :span="11" :offset="2">
              <el-col :span="4">债券代码：</el-col>
              <el-col :span="18">{{showContent.instrument_id}}</el-col>
            </el-col>
            <el-col :span="11">
              <el-col :span="4">债券简称：</el-col>
              <el-col :span="18">{{showContent.instrument_chn_short_name}}</el-col>
            </el-col>
          </el-row>
          <el-row class="item">
            <el-col :span="11" :offset="2">
              <el-col :span="4">债券类型：</el-col>
              <el-col :span="18">{{showContent.bond_type }}</el-col>
            </el-col>
            <el-col :span="11">
              <el-col :span="4">债券面值：</el-col>
              <el-col :span="18">{{showContent.par_value }}</el-col>
            </el-col>
          </el-row>

          <el-row class="item">
            <el-col :span="11" :offset="2">
              <el-col :span="4">发行价格：</el-col>
              <el-col :span="18">{{showContent.offering_price }}</el-col>
            </el-col>
            <el-col :span="11">
              <el-col :span="4">发行总量：</el-col>
              <el-col :span="18">{{showContent.issuing_volume }}</el-col>
            </el-col>
          </el-row>
          <el-row class="item">
            <el-col :span="11" :offset="2">
              <el-col :span="4">票面利率：</el-col>
              <el-col :span="18">{{showContent.interest_rate }}</el-col>
            </el-col>
            <el-col :span="11">
              <el-col :span="4">债券发行日：</el-col>
              <el-col :span="18">{{showContent.issuing_date }}</el-col>
            </el-col>
          </el-row>
          <el-row class="item">
            <el-col :span="11" :offset="2">
              <el-col :span="4">债券上市日：</el-col>
              <el-col :span="18">{{showContent.listing_date }}</el-col>
            </el-col>
            <el-col :span="11">
              <el-col :span="4">到期日：</el-col>
              <el-col :span="18">{{showContent.maturity_date }}</el-col>
            </el-col>
          </el-row>
          <el-row class="item">
            <el-col :span="11" :offset="2">
              <el-col :span="4">评级：</el-col>
              <el-col :span="18">{{showContent.credit_grade }}</el-col>
            </el-col>
            <el-col :span="11">
              <el-col :span="4">估值：</el-col>
              <el-col :span="18">{{showContent.clean_price }}</el-col>
            </el-col>
          </el-row>
          <el-row class="item">
            <el-col :span="11" :offset="2">
              <el-col :span="4">应计利息：</el-col>
              <el-col :span="18">{{showContent.interest}}</el-col>
            </el-col>
            <el-col :span="11">
              <el-col :span="4">年派息次数：</el-col>
              <el-col :span="18">{{showContent.interest_payment_method }}</el-col>
            </el-col>
          </el-row>
          <el-row class="item">
            <el-col :span="11" :offset="2">
              <el-col :span="4">发行人：</el-col>
              <el-col :span="18">{{showContent.company_name }}</el-col>
            </el-col>
            <el-col :span="11">
              <el-col :span="4">前收盘价：</el-col>
              <el-col :span="18">{{showContent.lastprice }}</el-col>
            </el-col>
          </el-row>
        </div>
        <div class="queryResult" v-if="commonData.stockCodeType==='fun'">
          <el-row class="resultTitle">
            <el-col :offset="1">基金基本资料</el-col>
          </el-row>
          <el-row class="item">
            <el-col :span="11" :offset="2">
              <el-col :span="4">基金代码：</el-col>
              <el-col :span="18">{{showContent.instrument_id}}</el-col>
            </el-col>
            <el-col :span="11">
              <el-col :span="4">基金简称：</el-col>
              <el-col :span="18">{{showContent.instrument_chn_short_name}}</el-col>
            </el-col>
          </el-row>
          <el-row class="item">
            <el-col :span="11" :offset="2">
              <el-col :span="4">基金类型：</el-col>
              <el-col :span="18">{{showContent.type}}</el-col>
            </el-col>
            <el-col :span="11">
              <el-col :span="4">上市时间：</el-col>
              <el-col :span="18">{{showContent.listing_day}}</el-col>
            </el-col>
          </el-row>

          <el-row class="item">
            <el-col :span="11" :offset="2">
              <el-col :span="4">基金规模：</el-col>
              <el-col :span="18">{{showContent.f_zfe}}</el-col>
            </el-col>
            <el-col :span="11">
              <el-col :span="4">更新时间：</el-col>
              <el-col :span="18">{{showContent.nav_date}}</el-col>
            </el-col>
          </el-row>
          <el-row class="item">
            <el-col :span="11" :offset="2">
              <el-col :span="4">管理人：</el-col>
              <el-col :span="18">{{showContent.f_jljg}}</el-col>
            </el-col>
            <el-col :span="11">
              <el-col :span="4">基金净值：</el-col>
              <el-col :span="18">{{showContent.nav}}</el-col>
            </el-col>
          </el-row>
          <el-row class="item">
            <el-col :span="11" :offset="2">
              <el-col :span="4">发起人：</el-col>
              <el-col :span="18">{{showContent.f_jjfqr}}</el-col>
            </el-col>
            <el-col :span="11">
              <el-col :span="4">托管人：</el-col>
              <el-col :span="18">{{showContent.f_tgjg}}</el-col>
            </el-col>
          </el-row>
        </div>
      </div>
      <div v-if="emptyResult" class="empty-result" style="width: 100%;height: 200px;">
        查询结果为空
      </div>
      <el-row class="resultTitle" :span="24">
        <el-col :offset="1">批注及文件</el-col>
      </el-row>
      <el-row>
        <el-col :span="22" :offset="1">
          <el-table
            :data="annotationFiletableData"
            border
            style="width: 100%; "
            show-overflow-tooltip>
            <el-table-column
              prop="a"
              label="代码">
            </el-table-column>
            <el-table-column
              prop="b"
              label="操作人">
            </el-table-column>
            <el-table-column
              prop="c"
              label="上传时间">
            </el-table-column>
            <el-table-column
              prop="d"
              label="批注">
            </el-table-column>
            <el-table-column
              prop="e"
              label="附件1">
            </el-table-column>
            <el-table-column
              prop="f"
              label="附件2">
            </el-table-column>
            <el-table-column
              prop="g"
              label="附件3">
            </el-table-column>
            <el-table-column
              prop="h"
              label="附件4">
            </el-table-column>
            <el-table-column
              prop="i"
              label="附件5">
            </el-table-column>

          </el-table>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 0;">
        <el-col :span="22" :offset="1">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="pageSizes"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="resultNum">
          </el-pagination>
        </el-col>
      </el-row>

    </el-card>

  </div>
</template>

<script>
import {getBasicInfoQuery, getAnnotationFile} from '../../../service/analysisTool/productQuery'
import MinxinVue from './common/MixIn'
export default {
  data() {
    return {
      showContent: {},
      showQueryResult: false,
      stockCode: '',
      queryResLoad: true,
      emptyResult: false,
      annotationFiletableData: [],
      // 文件批注弹出框
      dialogFormVisble: false,
      remarkCon: '',
      currentPage: 1,
      pageSizes: [10, 20, 50, 100],
      pageSize: 10,
      resultNum: 0
    }
  },
  mixins: [MinxinVue],
  props: ['commonData'],
  methods: {
    getStockCode() {
      this.stockCode = this.commonData.stockCode
    },
    getQueryRes() {
      this.showQueryResult = true;
      // 入参处理
      let params = {
        stockCode: this.commonData.stockCode.split(' ')[0],
        // productType: this.commonData.stockCodeType
        productType: this.commonData.stockCodtTypeMoment
      }
      getBasicInfoQuery(params).then((resp) => {
        if (resp.bizData.metaData == '[]') {
          this.emptyResult = true;
        } else {
          this.queryResLoad = false;
          this.showContent = resp.bizData.metaData[0];
          this.emptyResult = false;
        }

        let annotationFileParams = {
          stockCode: this.commonData.stockCode.split(' ')[0],
          pageRows: this.pageSize,
          pageIndex: this.currentPage,
          // productType: this.commonData.stockCodeType
          productType: this.commonData.stockCodtTypeMoment
        }
        getAnnotationFile(annotationFileParams).then((resp) => {
          console.log(resp);
        })
      })
    },

    alarmReporting() {
      window.open(window.location.origin + '/#/alarmList?stockCode=' + this.commonData.stockCode + '&activeName=HistoryAlarmlist');
    },
    annotationFile() {
      this.dialogFormVisble = true
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.stockOrderQueryRes();
    },
    handleCurrentChange(rowNum) {
      this.currentPage = rowNum;
      this.stockOrderQueryRes();
    }
  }
}
</script>

<style lang="less">
  .stock-basic-info {
    .el-card {
      .el-card__body {
        padding: 15px;
      }
      &:nth-child(1) {
        margin-top: 0;
      }
    }
    .queryResult {
      font-size: 14px;
      .item {
        margin-top: 20px;
        margin-bottom: 10px;

      }
    }
    .resultTitle {
      font-size: 16px;
      margin-top: 25px;
      margin-bottom: 15px;
    }
    .empty-result {
      text-align: center;
      padding-top: 150px;
      font-size: 16px;
    }
  }

</style>
