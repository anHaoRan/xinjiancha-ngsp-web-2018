<template>
  <div class='date-time-component'>
    <el-col :xl="24" :lg="24" :md="24" :sm="24">
      <el-form-item label="开始日期" prop="startDate"
                    :rules="[{required: dateRequire, validator: validateS}]">
        <el-date-picker
          prop="date"
          v-model="startDate"
          type="date"
          placeholder="请选择日期"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          size="small">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="开始时间" prop="startTime"
                    :rules="[{required: timeRequire, validator: validateST}]"
                    v-if="defaultOption.showTime">
        <el-time-picker
          size="small"
          placeholder="开始时间"
          value-format="HH:mm:ss"
          v-model="startTime"
        ></el-time-picker>
      </el-form-item>
      <el-form-item label="结束日期" prop="endDate"
                    :rules="[{required: dateRequire, validator: validateE}]">
        <el-date-picker
          prop="date"
          v-model="endDate"
          type="date"
          placeholder="请选择日期"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          size="small">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime"
                    :rules="[{required: timeRequire, validator: validateET}]"
                    v-if="defaultOption.showTime">
        <el-time-picker
          size="small"
          placeholder="结束时间"
          format="HH:mm:ss"
          value-format="HH:mm:ss"
          v-model="endTime"
        ></el-time-picker>
      </el-form-item>
    </el-col>
  </div>
</template>

<script>
  import moment from 'moment'

  export default {
    name: 'date-time-component',
    props: {
      defaultOption: {
        type: Object,
        default() {
          return {
            startDate: new Date(),
            endDate: new Date(),
            startTime: new Date(),
            endTime: new Date(),
            showTime: false
          }
        }
      },
      dateRequire: {
        type: Boolean,
        default: true
      },
      timeRequire: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        validateDate: false, // 日期验证通过才校验时间
        dateRequireChild: true, // 若选择其中一个日期，另一个日期也必须选择，否则都不选【当日期为非必选时】,true 表示2个都选值
        timeRequireChild: true, //
      }
    },
    watch: {
      defaultOption: {
        handler() {
          this.setDefaultDate()
        },
        deep: true
      }
    },
    methods: {
      setDefaultDate() {
        this.startDate = this.handleFormat(this.defaultOption.startDate, 'date')
        this.endDate = this.handleFormat(this.defaultOption.endDate, 'date')
        this.startTime = this.handleFormat(this.defaultOption.startTime, 'time')
        this.endTime = this.handleFormat(this.defaultOption.endTime, 'time')
      },
      dateCommon(date, mark, callback) {
        if (mark === 'e' && !this.dateRequire) {
          if ((this.startDate && this.endDate) || (!this.startDate && !this.endDate)) {
            this.dateRequireChild = true
          } else {
            this.dateRequireChild = false
            this.$message.error('请选择开始日期和结束日期')
            return
          }
        }
        if (!date && this.dateRequire) {
          callback(new Error('请选择'))
        } else {
          let sDate = moment(this.startDate)._d.getTime()
          let eDate = moment(this.endDate)._d.getTime()
          if (sDate > eDate) {
            callback(new Error('开始日期不得大于结束日期'))
            this.validateDate = false
          } else {
            if (this.dateRequireChild) {
              callback()
              this.validateDate = true
              this.$emit('getDate', this.startDate, this.endDate)
            }
          }
        }
        callback()
      },
      validateS(rule, value, callback) {
        this.dateCommon(this.startDate, 's', callback)
      },
      validateE(rule, value, callback) {
        this.dateCommon(this.endDate, 'e', callback)
      },
      timeCommon(time, mark,  callback) {
        if (mark === 'e' && !this.timeRequire) {
          if ((this.startTime && this.endTime) || (!this.startTime && !this.endTime)) {
            this.timeRequireChild = true
          } else {
            this.timeRequireChild = false
            this.$message.error('请选择开始时间和结束结束')
            return
          }
        }
        if (!time && this.timeRequire) {
          callback(new Error('请选择'))
        } else {
          if (this.validateDate) {
            let s = `${this.startDate} ${this.startTime}`, e = `${this.endDate} ${this.endTime}`
            let sDate = moment(s)._d.getTime()
            let eDate = moment(e)._d.getTime()
            if (sDate > eDate) {
              callback(new Error(`开始时间不得大于结束时间`))
            } else {
              if (this.timeRequireChild) {
                callback()
                this.$emit('getTime', this.startTime, this.endTime)
              }
            }
          }
        }
        callback()
      },
      validateST(rule, value, callback) {
        this.timeCommon(this.startTime, 's', callback)
      },
      validateET(rule, value, callback) {
        this.timeCommon(this.endTime, 'e', callback)
      },
      handleFormat(val, mark) {
        if (mark === 'date') {
          if (val && val.toString().indexOf('T') > -1) {
            return moment(new Date(val)).format('YYYY-MM-DD')
          } else {
            return val
          }
        } else {
          if (val && val.toString().indexOf('T') > -1) {
            return moment(new Date(val)).format('YYYY-MM-DD HH:mm:ss').split(' ')[1]
          } else {
            return val
          }
        }
      }
    },
    mounted() {
      this.setDefaultDate()
    }
  }
</script>

<style lang='less' scoped>
  .date-time-component {
  }
</style>