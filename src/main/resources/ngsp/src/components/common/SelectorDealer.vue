<template>
  <div class="selector-dealer">
    <el-input :value="val" ref="dealerInput" :clearable="true" @clear="handlerClear" size="small" :disabled="disabled"
              @input="handlerInput" v-popover:popover1 @blur="handleBlur"/>
    <el-popover
      ref="popover1"
      :width="popoverWidth"
      :disabled="disabled"
      trigger="click">
      <div style=" height: 200px;overflow-y: scroll;">
        <el-tree
          ref="selectorDealer"
          :props="props"
          :data="data"
          accordion
          :filter-node-method="filterNode"
          node-key="usercode"
          :default-expanded-keys="defaultExpandedKeys"
          @node-click="handlerNodeClick"
        />
      </div>
    </el-popover>
  </div>
</template>

<script>
  import { getAllRoleOrgs } from '@/service/knowledgeBase/EarlyWarningHistory/Index'

  export default {
    name: 'selector-dealer',
    props: {
      selectPerson: {
        type: String,
        default () {
          return ''
        }
      },
      defaultExpandedKeys: {
        type: Array,
        default () {
          return ['SSE', 'SMD']
        }
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    components: {},
    mixins: [],
    data () {
      return {
        value: '',
        userCode: '',
        popoverWidth: 0,
        props: {
          children: 'children',
          label: 'username'
        },
        data: []
      }
    },
    computed: {
      val: {
        get: function () {
          return this.value
        },
        set: function (value) {
          this.$emit('node-click', this.userCode, value)
        }
      }
    },
    watch: {
      selectPerson: function () {
        this.value = this.selectPerson
      }
    },
    methods: {
      handleBlur () {
        let value = this.$refs['dealerInput']['$refs']['input']['value']
        if (!value) {
          return
        }
        let code = this.getCodeByName(value)
        if (!code) {
          this.$message.error('请输入或选择有效人员')
          this.handlerInput('')
          this.$emit('node-click', '', '')
        } else {
          // 输入姓名
          this.$emit('node-click', code, value)
        }
      },
      getCodeByName (value) {
        let targetCode = ''
        let loop = function (data) {
          data.forEach(v => {
            if (v.children) {
              loop(v.children)
            } else {
              if (v.username === value) {
                targetCode = v.usercode
                return true
              }
            }
          })
        }
        loop(this.data)
        return targetCode
      },
      ajaxGetAllRoleOrgs () {
        getAllRoleOrgs().then(res => {
          this.data = res.children
        })
      },
      handlerInput (val) {
        this.$refs.selectorDealer.filter(val)
      },
      filterNode (value, data) {
        if (!value) return true
        return data.username.indexOf(value) !== -1
      },
      handlerNodeClick (item) {
        if (!item.children) {
          this.value = item.username
          this.userCode = item.usercode
          this.$emit('node-click', item.usercode, item.username)
        }
      },
      handlerClear () {
        this.$emit('node-click', '', '')
      },
      clearValue () {
        this.value = ''
      }
    },
    created () {
      this.ajaxGetAllRoleOrgs()
    },
    mounted () {
      this.popoverWidth = this.$refs.dealerInput.$el.scrollWidth - 40
    },
    beforeDestroy () {
    }
  }
</script>

<style lang="less" scoped>
  .selector-dealer {
  }
</style>
