<template>
  <el-row class="topbar">
    <el-col :span="10">
      <el-col :span="6" class="toggle-area">
        <i class="fa fa-bars" @click="toggleSidebar"></i>
      </el-col>
      <el-col :span="18">
        <el-input
          class="top-input"
          placeholder="请输入搜索内容"
          v-model="searchVal">
          <el-button slot="append" icon="el-icon-search" @click="handleSearchClick"></el-button>
        </el-input>
      </el-col>
    </el-col>
    <el-col :span="14">
      <el-menu class="top-menu" mode="horizontal" @select="handleSelect">
        <el-submenu index="4">
          <template slot="title">
            <span class="head-icon"><img src='../../assets/images/avater.jpg'/></span>
            <label>{{ realname }}</label>
          </template>
          <li>
            <table class="theme-color">
              <tr>
                <!--<td><a @click="changeTheme('theme_light')">皓白</a></td>-->
                <td><a @click="changeTheme('theme_dark')">深蓝</a></td>
                <!--<td><a @click="changeTheme('theme_green')">护眼绿</a></td>-->
                <td><a @click="changeTheme('theme_yahei')">雅黑</a></td>
              </tr>
            </table>
          </li>
          <li @click="logout" class="logout">退出登录</li>
        </el-submenu>
      </el-menu>
    </el-col>
  </el-row>
</template>

<style lang="less">
</style>

<script>
  import { logout } from '../../service/topbar'
  import { removeAuthedInfos } from '../../utils/storageUtil.js'

  export default {
    name: 'top-bar',
    data () {
      return {
        activeIndex: '1',
        activeIndex2: '1',
        searchVal: '',
        skinTheme: 'default',
        subBg: false
      }
    },
    computed: {
      isSidebarNarrow () {
        return this.$store.state.sidebar.isSidebarNarrow
      },
      realname () {
        return this.gfnGetRealName()
      }
    },
    methods: {
      toggleSidebar () {
        if (this.isSidebarNarrow === false) {
          this.$store.state.sidebar.isSidebarNarrow = true
          this.$store.state.sidebar.sidebarStyle = 'sidebar-narrow'
          this.$store.state.sidebar.contentStyle = 'content-wide'
        } else {
          this.$store.state.sidebar.isSidebarNarrow = false
          this.$store.state.sidebar.sidebarStyle = 'sidebar'
          this.$store.state.sidebar.contentStyle = 'content'
        }
      },
      handleSelect (key, keyPath) {
        // console.log(key, keyPath);
      },
      handleSearchClick () {
        // searchInfo().then((resp) => {
        //   alert(JSON.stringify(resp) + "==successData");
        // });
      },
      changeTheme (theme) {
        document.getElementsByTagName('body')[0].className = theme
        // document.getElementById('app').className = theme;
          this.$store.state.sidebar.themeName = theme
        this.gfnSetTheme(theme)
      },
      logout () {
        logout()
        removeAuthedInfos()
        this.$router.push({path: '/login'})
      }
    }
  }
</script>
