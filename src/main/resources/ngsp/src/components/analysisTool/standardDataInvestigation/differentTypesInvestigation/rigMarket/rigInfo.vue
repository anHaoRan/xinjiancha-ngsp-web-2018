<template>
  <div class="rigInfoBox">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" size="small" label-width="100px">
      <el-form-item label="信息操纵：" prop="typeValue">
        <el-select v-model="ruleForm.typeValue" placeholder="请选择类别" clearable style="width:390px"
                   @change="handleChangeTypeVal">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择：" prop="chooseValue">
        <el-select v-model="ruleForm.chooseValue" placeholder="请选择" clearable style="width:110px">
          <el-option
            v-for="item in chooseOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <file-upload
        ref="upload"
        class="uploadBtn"
        :isShowSuccessMessage="true"
        :actionUrl="gfnGetUploadExcelReturnPojoUrl()"
        @getTxtCon="setFileData"
        :limitFileType="['xls', 'xlsx']"
        :uploadOption="{size: 'small',type: 'primary',name: '上传Excel'}"
        :uploadParams="uploadParams"
        style="vertical-align: top;"></file-upload>
      <el-tag :type="uploadStatus"> {{ uploadText }}</el-tag>
      <el-button
        class="uploadBtn"
        @click="downloadExcelMould"
        size="small"
        type="primary"
        style="vertical-align: top;margin-left: 10px;">下载模板
      </el-button>
      <el-form-item class="rightBar">
        <el-button type="primary" :disabled="loading" @click="submitForm('ruleForm')">查询</el-button>
        <el-button type="text" @click="resetForm('ruleForm')">清空</el-button>
        <el-button type="info" plain @click="handleDownload" :disabled="isDownload">导出</el-button>
      </el-form-item>
    </el-form>
    <div v-show="showTable">
      <s-table ref="rigInfo" :height="600" :columns="rigInfoDataColumns" :data="rigInfoData"
               :isPageination="false"></s-table>
    </div>
  </div>
</template>

<script>
  import FileUpload from '../../../../common/textUpload'
  import { getDayTradeHis } from '../../../../../service/analysisTool/standardDataInvestigation'

  export default {
    name: 'rig-info',
    components: {
      FileUpload,
      STable: () => import('@/components/base/STable')
    },
    data () {
      return {
        typeOptions: [
          {
            value: 'priorn_nextn',
            label: '指定期间指定股票价量与前后相同交易日期间对比分析表'
          }, {
            value: 'notice_pn',
            label: '信息公告日前后价量对比分析表'
          }
        ],
        chooseOptions: [
          {
            value: '1',
            label: '股东代码'
          }, {
            value: '2',
            label: '身份证'
          }
        ],
        ruleForm: {
          typeValue: '',
          chooseValue: '',
          idNum: '',
          shareHolder: ''
        },
        rules: {
          typeValue: [
            {required: true, message: '请选择类别', trigger: 'change'}
          ],
          chooseValue: [
            {required: true, message: '请选择', trigger: 'change'}
          ],
          idNum: [
            {required: true, message: '请输入身份证', trigger: 'blur'}
            // {min: 18, max: 18, message: '长度为 18 个字符', trigger: 'blur'}
          ],
          shareHolder: [
            {required: true, message: '请输入股东代码', trigger: 'blur'}
          ]
        },
        uploadParams: {
          parseRules: JSON.stringify([
            {
              firstToSkip: 1,
              fields: []
            }
          ])
        },
        uploadExcelData: {},
        uploadText: '未上传',
        uploadStatus: 'danger',
        rigInfoData: {data: []},
        rigInfoDataColumns: [],
        theadList1: [ // 指定期间指定股票价量与前后相同交易日期间对比分析表
          {label: '证券代码', field: '01sec_code', align: 'center', width: '120'},
          {label: '证券简称', field: '02sec_name', align: 'center', width: '120'},
          {label: '统计期间-起始日期', field: '03eff_date', align: 'center', width: '160'},
          {label: '统计期间-截止日期', field: '04end_date', align: 'center', width: '160'},
          {label: '统计期间-交易日数（N）', field: '05days_cnt', align: 'center', width: '160'},
          {label: '统计期间-账户组参与交易天数', field: '06sec_days_cnt', align: 'center', width: '160'},
          {label: '统计期间-账户组买成交股数', field: '07trdvol_b', align: 'center', width: '160'},
          {label: '统计期间-账户组买成交金额', field: '08trdamt_b', align: 'center', width: '160'},
          {label: '统计期间-账户组买成交股数占市场成交量的比例%', field: '09per_vol_b', align: 'center', width: '200'},
          {label: '统计期间-账户组卖成交股数', field: '10trdvol_s', align: 'center', width: '160'},
          {label: '统计期间-账户组卖成交金额', field: '11trdamt_s', align: 'center', width: '160'},
          {label: '统计期间-账户组卖成交股数占市场成交量的比例%', field: '12per_vol_s', align: 'center', width: '200'},
          {label: '统计期间-账户组成交股数', field: '13trdvol', align: 'center', width: '160'},
          {label: '统计期间-账户组成交金额', field: '14trdamt', align: 'center', width: '160'},
          {label: '统计期间-账户组成交股数/(市场成交量*2)%', field: '15per_vol', align: 'center', width: '200'},
          {label: '统计期间-市场成交量', field: '16trdvol_mkt', align: 'center', width: '160'},
          {label: '统计期间-市场成交金额', field: '17trdamt_mkt', align: 'center', width: '160'},
          {label: '统计期间-累计涨跌幅%', field: '18zdf_sum', align: 'center', width: '160'},
          {label: '统计期间-对应板块综指涨跌幅%', field: '19zdf_zs_sum', align: 'center', width: '200'},
          {label: '统计期间-较板块综指偏离%', field: '20zdf_pl_sum', align: 'center', width: '160'},
          {label: '统计期间-累计换手率%', field: '21to_rate_sum', align: 'center', width: '160'},
          {label: '统计期间前N个交易日-起始日期', field: '22eff_pn', align: 'center', width: '200'},
          {label: '统计期间前N个交易日-截止日期', field: '23end_pn', align: 'center', width: '200'},
          {label: '统计期间前N个交易日-账户组参与交易天数', field: '24sec_days_cnt_pn', align: 'center', width: '200'},
          {label: '统计期间前N个交易日-账户组买成交股数', field: '25trdvol_b_pn', align: 'center', width: '200'},
          {label: '统计期间前N个交易日-账户组买成交金额', field: '26trdamt_b_pn', align: 'center', width: '200'},
          {label: '统计期间前N个交易日-账户组买成交股数占市场成交量的比例%', field: '27per_vol_b_pn', align: 'center', width: '240'},
          {label: '统计期间前N个交易日-账户组卖成交股数', field: '28trdvol_s_pn', align: 'center', width: '200'},
          {label: '统计期间前N个交易日-账户组卖成交金额', field: '29trdamt_s_pn', align: 'center', width: '200'},
          {label: '统计期间前N个交易日-账户组卖成交股数占市场成交量的比例%', field: '30per_vol_s_pn', align: 'center', width: '240'},
          {label: '统计期间前N个交易日-账户组成交股数', field: '31trdvol_pn', align: 'center', width: '200'},
          {label: '统计期间前N个交易日-账户组成交金额', field: '32trdamt_pn', align: 'center', width: '200'},
          {label: '统计期间前N个交易日-账户组成交股数/(市场成交量*2)%', field: '33per_vol_pn', align: 'center', width: '200'},
          {label: '统计期间前N个交易日-市场成交量', field: '34trdvol_mkt_pn', align: 'center', width: '200'},
          {label: '统计期间前N个交易日-市场成交金额', field: '35trdamt_mkt_pn', align: 'center', width: '200'},
          {label: '统计期间前N个交易日-累计涨跌幅%', field: '36zdf_sum_pn', align: 'center', width: '200'},
          {label: '统计期间前N个交易日-较板块综指偏离%', field: '37zdf_pl_sum_pn', align: 'center', width: '200'},
          {label: '统计期间前N个交易日-累计换手率%', field: '38to_rate_sum_pn', align: 'center', width: '200'},
          {label: '统计期间后N个交易日-起始日期', field: '39eff_nn', align: 'center', width: '200'},
          {label: '统计期间后N个交易日-截止日期', field: '40end_nn', align: 'center', width: '200'},
          {label: '统计期间后N个交易日-账户组参与交易天数', field: '41sec_days_cnt_nn', align: 'center', width: '200'},
          {label: '统计期间后N个交易日-账户组买成交股数', field: '42trdvol_b_nn', align: 'center', width: '200'},
          {label: '统计期间后N个交易日-账户组买成交金额', field: '43trdamt_b_nn', align: 'center', width: '200'},
          {label: '统计期间后N个交易日-账户组买成交股数占市场成交量的比例%', field: '44per_vol_b_nn', align: 'center', width: '240'},
          {label: '统计期间后N个交易日-账户组卖成交股数', field: '45trdvol_s_nn', align: 'center', width: '200'},
          {label: '统计期间后N个交易日-账户组卖成交金额', field: '46trdamt_s_nn', align: 'center', width: '200'},
          {label: '统计期间后N个交易日-账户组卖成交股数占市场成交量的比例%', field: '47per_vol_s_nn', align: 'center', width: '240'},
          {label: '统计期间后N个交易日-账户组成交股数', field: '48trdvol_nn', align: 'center', width: '200'},
          {label: '统计期间后N个交易日-账户组成交金额', field: '49trdamt_nn', align: 'center', width: '200'},
          {label: '统计期间后N个交易日-账户组成交股数/(市场成交量*2)%', field: '50per_vol_nn', align: 'center', width: '200'},
          {label: '统计期间后N个交易日-市场成交量', field: '51trdvol_mkt_nn', align: 'center', width: '200'},
          {label: '统计期间后N个交易日-市场成交金额', field: '52trdamt_mkt_nn', align: 'center', width: '200'},
          {label: '统计期间后N个交易日-累计换手率%', field: '53to_rate_sum_nn', align: 'center', width: '200'}
        ],
        theadList2: [ // 信息公告日前后价量对比分析表
          {label: '证券代码', field: '01sec_Code', align: 'center', width: '120'},
          {label: '证券简称', field: '02sec_name', align: 'center', width: '120'},
          {label: '公告N日', field: '03para_n', align: 'center', width: '120'},
          {label: '公告日期', field: '04trade_date', align: 'center', width: '120'},
          {label: '公告前N交易日（T-N日）', field: '05last_date_rn', align: 'center', width: '160'},
          {label: '公告前一交易日（T-1日）', field: '06last_date_one', align: 'center', width: '160'},
          {label: '公告后一交易日（T日）', field: '07trade_date_t', align: 'center', width: '160'},
          {label: '公告后N交易日（T+N-1）', field: '08next_date_rn', align: 'center', width: '160'},
          {label: 'T-1日股价涨幅%', field: '09last_one_range', align: 'center', width: '120'},
          {label: 'T日股价涨幅%', field: '10t_range', align: 'center', width: '120'},
          {label: 'T日涨幅相对于T-1日偏离%', field: '11t_last_pianli', align: 'center', width: '160'},
          {label: 'T日对应板块综指涨幅%', field: '12t_sz_fudu', align: 'center', width: '160'},
          {label: 'T日涨跌幅较板块综指偏离度（百分比）', field: '13t_sz_pianli', align: 'center', width: '200'},
          {label: 'T+N-1日股价涨幅%', field: '14next_rn_range', align: 'center', width: '120'},
          {label: 'T+N-1日涨幅相对于T-1日偏离%', field: '15next_rn_pianli', align: 'center', width: '160'},
          {label: '公告前N交易日-账户组竞价买入股数', field: '16last_buy_vol', align: 'center', width: '200'},
          {label: '公告前N交易日-账户组竞价买入金额', field: '17last_buy_amt', align: 'center', width: '200'},
          {label: '公告前N交易日-账户组竞价卖出股数', field: '18last_sell_vol', align: 'center', width: '200'},
          {label: '公告前N交易日-账户组竞价卖出金额', field: '19last_sell_amt', align: 'center', width: '200'},
          {label: '公告前N交易日-账户组大宗买入股数', field: '20last_bt_buy_vol', align: 'center', width: '200'},
          {label: '公告前N交易日-账户组大宗买入金额', field: '21last_bt_buy_amt', align: 'center', width: '200'},
          {label: '公告前N交易日-账户组大宗卖出股数', field: '22last_bt_sell_vol', align: 'center', width: '200'},
          {label: '公告前N交易日-账户组大宗卖出金额', field: '23last_bt_sell_amt', align: 'center', width: '200'},
          {label: '公告前N交易日-市场竞价成交量', field: '24last_rn_trade_vol', align: 'center', width: '200'},
          {label: '公告前N交易日-累计涨幅%', field: '25last_rn_csum_fudu', align: 'center', width: '160'},
          {label: '公告前N交易日-对应板块综指涨幅%', field: '26last_rn_sz_fudu', align: 'center', width: '200'},
          {label: '公告前N交易日-对应板块综指偏离度%', field: '27last_rn_pianli', align: 'center', width: '200'},
          {label: '公告后N交易日-账户组竞价买入股数', field: '28next_buy_vol', align: 'center', width: '200'},
          {label: '公告后N交易日-账户组竞价买入金额', field: '29next_buy_amt', align: 'center', width: '200'},
          {label: '公告后N交易日-账户组竞价卖出股数', field: '30next_sell_vol', align: 'center', width: '200'},
          {label: '公告后N交易日-账户组竞价卖出金额', field: '31next_sell_amt', align: 'center', width: '200'},
          {label: '公告后N交易日-账户组大宗买入股数', field: '32next_bt_buy_vol', align: 'center', width: '200'},
          {label: '公告后N交易日-账户组大宗买入金额', field: '33next_bt_buy_amt', align: 'center', width: '200'},
          {label: '公告后N交易日-账户组大宗卖出股数', field: '34next_bt_sell_vol', align: 'center', width: '200'},
          {label: '公告后N交易日-账户组大宗卖出金额', field: '35next_bt_sell_amt', align: 'center', width: '200'},
          {label: '公告后N交易日-市场竞价成交量', field: '36next_rn_trade_vol', align: 'center', width: '200'},
          {label: '公告后N交易日-累计涨幅%', field: '37next_rn_csum_fudu', align: 'center', width: '200'},
          {label: '公告后N交易日-对应板块综指涨幅%', field: '38next_rn_sz_fudu', align: 'center', width: '200'},
          {label: '公告后N交易日-对应板块综指偏离度%', field: '39pl_n_csum', align: 'center', width: '200'},
          {label: '公告后N交易日-累计涨幅相较于前N日偏离%', field: '40next_csum_pianli', align: 'center', width: '200'}
        ],
        showTable: false,
        loading: false,
        isDownload: true,
        flowid: ''
      }
    },
    methods: {
      handleQueryData () {
        let params = {
          buszId: this.ruleForm.typeValue,
          acct_flag: this.ruleForm.chooseValue,
          queryby: '2',
          uploadParam: this.uploadExcelData
        }
        this.showTable = true
        this.showOrHideLoading(true)
        this.loading = true
        getDayTradeHis(JSON.stringify(params)).then(resp => {
          if (this.ruleForm.typeValue == 'priorn_nextn') {
            this.rigInfoDataColumns = this.theadList1
          } else {
            this.rigInfoDataColumns = this.theadList2
          }
          this.rigInfoData.data = resp.rows
          this.loading = false
          this.flowid = resp.flowId
          if (this.rigInfoData.data.length > 0) {
            this.isDownload = false
          } else {
            this.isDownload = true
          }
          this.showOrHideLoading(false)
        })
      },
      showOrHideLoading (flag) {
        this.$refs.rigInfo.showOrHideLoading(flag)
      },
      handleChangeTypeVal (val) {
        // 切换上传文件解析字段
        switch (val) {
          case 'priorn_nextn':// 指定期间指定股票价量与前后相同交易日期间对比分析表
            this.uploadParams.parseRules = JSON.stringify([
              {
                firstToSkip: 1, // 前置忽略项
                fields: ['acct_id', 'sec_code', 'from_date', 'to_date']
              }
            ])
            break
          case 'notice_pn':// 信息公告日前后价量对比分析表
            this.uploadParams.parseRules = JSON.stringify([
              {
                firstToSkip: 1, // 前置忽略项
                fields: ['acct_id']
              },
              {
                firstToSkip: 1, // 前置忽略项
                fields: ['sec_code', 'trade_date', 'para_n']
              }
            ])
            break
        }
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.handleQueryData()
          } else {
            this.$message.error('查询失败！请补全查询参数~')
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
        this.$nextTick(() => {
          this.$refs.ruleForm.clearValidate()
        })
        this.uploadExcelData = {}
        this.showTable = false
        this.loading = false
        this.uploadText = '未上传'
        this.uploadStatus = 'danger'
        this.isDownload = true
      },
      setFileData (val) {
        this.uploadExcelData = val
        this.uploadText = '已上传'
        this.uploadStatus = 'success'
      },
      handleDownload () {
        this.$message.info('正在导出，请稍等~')
        this.gfnExportFileWithForm('/customqry/dwnfromredis', {flowid: this.flowid})
      },
      downloadExcelMould () {
        if (this.ruleForm.typeValue == '') {
          this.$message.warning('请选择信息操纵类型')
          return
        }
        switch (this.ruleForm.typeValue) {
          case 'priorn_nextn':// 指定期间指定股票价量与前后相同交易日期间对比分析表
            this.gfnDownloadTemplateFile({code: 'stddataqry.priorn_nextn'})
            break
          case 'notice_pn':// 信息公告日前后价量对比分析表
            this.gfnDownloadTemplateFile({code: 'stddataqry.notice_pn'})
            break
        }
      }
    },
    mounted () {
    }
  }
</script>

<style scoped lang="less">
  .rigInfoBox {
    .el-form-item {
      display: inline-block;
      vertical-align: top;
    }
    .uploadBtn {
      display: inline-block;
      margin: 0 10px 0 10px;
    }
    .el-select {
      margin-right: 10px;
    }
    .rightBar {
      float: right;
    }
  }
</style>
