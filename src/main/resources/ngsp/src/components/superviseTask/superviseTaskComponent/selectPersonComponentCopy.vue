<!--分配选人组件-->
<template>
  <div>
    <el-dialog
      title=""
      :visible.sync="selectData.dialogFormVisble"
      center
      width="700px">
      <el-tabs v-model="activeName" style="margin-bottom: 20px;margin-left: 170px;" @tab-click="handleclick">
        <el-tab-pane disabled label="角色" name="role"></el-tab-pane>
        <el-tab-pane disabled label="组" name="group"></el-tab-pane>
        <el-tab-pane disabled label="其他" name="other"></el-tab-pane>
        <el-tab-pane label="所有" name="all"></el-tab-pane>
      </el-tabs>
      <el-transfer v-model="person" :data="userlist" style="margin-left: 90px;"></el-transfer>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="veryfy">确 定</el-button>
        <el-button type="primary" size="small" @click="cancleVeryfy">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>

</style>

<script>
  import { getperson } from '../../../service/superviseTask/index.js'

  export default {
    name: 'selectPersonComponent',
    props: {
      selectData: {type: Object},
    },
    data () {
      return {
        loading: true,
        activeName: 'all',
        dialogFormVisble: false,
        person: [],
        userlist: [],
        selectPerson: [],
      }
    },
    mounted () {
      this.dispalyPerson()
    },
    methods: {
      veryfy () {
        this.selectPerson = []
        for (let i = 0; i < this.userlist.length; i++) {
          for (let j = 0; j < this.person.length; j++)
            if (this.person[j] == this.userlist[i].key) {
              this.selectPerson.push(this.userlist[i].value)
            }
        }
        this.selectData.dialogFormVisble = false
        this.$emit('obdSelectPerson', this.selectPerson)
      },
      cancleVeryfy () {
        this.selectData.dialogFormVisble = false
      },
      handleclick (tab) {
        switch (tab.label) {
          case '角色':
            this.activeName = 'role'
            this.dispalyPerson()
            break
          case '组':
            this.activeName = 'group'
            this.dispalyPerson()
            break
          case '其他':
            this.activeName = 'other'
            this.dispalyPerson()
            break
          case '所有':
            this.activeName = 'all'
            this.dispalyPerson()
            break
        }
      },
      dispalyPerson () {
        this.userlist = []
        let params = {
          'activityName': this.selectData.activityName,
          'instanceId': this.selectData.instanceId,
          'processName': this.selectData.processName,
          'businessData': this.selectData.businessData,
        }
        let isparams = JSON.stringify(params)
        getperson(isparams).then((resp) => {
          if (this.activeName === 'role') {
            let list = resp.roleList
            for (let i = 0; i <= list.length; i++) {
              this.userlist.push({
                key: i,
                label: list[i].fullName,
                value: list[i].userName,
              })
            }

          }
          if (this.activeName === 'group') {
            let list = resp.groupList
            for (let j = 0; j <= list.length; j++) {
              this.userlist.push({
                key: j,
                label: list[j].fullName,
                value: list[j].userName,
              })
            }

          }
          if (this.activeName === 'other') {
            let list = resp.extraUserList
            for (let k = 0; k <= list.length; k++) {
              this.userlist.push({
                key: k,
                label: list[k].fullName,
                value: list[k].userName,
              })
            }

          }
          if (this.activeName === 'all') {
            let list = resp.allUserList
            for (let q = 0; q <= list.length; q++) {
              this.userlist.push({
                key: q,
                label: list[q].fullName,
                value: list[q].userName,
              })
            }

          }
        })
      },
    }
  }
</script>

