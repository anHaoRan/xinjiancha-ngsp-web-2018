<template>
  <el-row class="topbar">
    <div class="topbar-sidebar-title">
      <img src="../../assets/images/logo_word_white.png"/>
    </div>
    <el-col :span="2">
      <el-col :span="2" class="toggle-area toggle-area-choose">
        <!--<i  class="fa fa-bars"></i>-->
        <i class="fa fa-bars" @mouseout="toggleSidebar(true)" @mouseover="toggleSidebar(false)"></i>
      </el-col>
      <!--<el-col :span="18">-->
      <!--<el-input-->
      <!--class="top-input"-->
      <!--placeholder="请输入搜索内容"-->
      <!--v-model="searchVal">-->
      <!--<el-button slot="append" icon="el-icon-search" @click="handleSearchClick"></el-button>-->
      <!--</el-input>-->
      <!--</el-col>-->


    </el-col>
    <el-col :span="18" class="topbar-side topbar-side-choose">
      <SideTopbar :class="sidetopbarStyle" :sidebarList="sidebarList"></SideTopbar>
    </el-col>
    <el-col :span="3" style="float: right">
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
    import SideTopbar from './SideTopbar'

    export default {
        props:['sidebarList'],
        components: {
            SideTopbar
        },
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
            isSidebarNarrowNew () {
                return this.$store.state.sidebar.isSidebarNarrowNew
            },
            sidetopbarStyle () {
                return this.$store.state.sidebar.sidetopbarStyle
            },
            realname () {
                return this.gfnGetRealName()
            }
        },
        methods: {
            toggleSidebar (type) {
                this.$store.state.sidebar.isSidebarNarrowNew = type
                if (type) {
                    this.$store.state.sidebar.sidebarStyleNew = 'sidebar-narrow'
                } else {
                    this.$store.state.sidebar.sidebarStyleNew = 'sidebar'
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
