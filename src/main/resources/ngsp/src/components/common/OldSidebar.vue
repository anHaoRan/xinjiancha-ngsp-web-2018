<template>
  <div>
    <div class="sidebar-title">
      <img v-if="!isSidebarNarrow" src="../../assets/images/logo_word_white.png"/>
      <img v-if="isSidebarNarrow" src="../../assets/images/logo_white.png"/>
    </div>
    <ul class="sidebar-menu">
      <li class="sidebar-menu-item"
          v-for="(item, index) in sidebarList"
          :key="index+'-one'">
        <div v-if="item.uri === ''">
          <i :class="item.code"></i>
          <span v-if="!isSidebarNarrow">{{item.name}}</span>
        </div>
        <router-link :to="item.uri" v-if="item.uri != ''" class="sidebar-first-menu-item-a">
          <i :class="item.code"></i>
          <span v-if="!isSidebarNarrow">{{item.name}}</span>
        </router-link>
        <div class="sidebar-second-sub-menu" v-if="item.children.length>0 && !checkMultiColumns(item.children)">
          <ul class="sidebar-second-sub-column">
            <li class="sidebar-second-sub-menu-item"
                v-for="(secondItem, secondIndex) in item.children"
                :key="secondIndex+'-two'">
              <span>{{secondItem.name}}</span>
              <ul class="siderbar-third-sub-menu">
                <li class="sidebar-third-sub-menu-item"
                    v-for="(thirdItem, thirdIndex) in secondItem.children"
                    :key="thirdIndex+'-third'">
                  <a :href="thirdItem.uri" v-if="thirdItem.uri.indexOf('http')>-1" target="_blank">{{thirdItem.name}}</a>
                  <router-link :to="thirdItem.uri" v-if="thirdItem.uri.indexOf('http') < 0">
                    {{thirdItem.name}}
                    <span v-if="thirdItem.children != null && thirdItem.children.length > 0" class="sidebar-sub-menu-tail"
                      v-for="(fourthItem, fourthIndex) in thirdItem.children"
                      :key="fourthIndex">
                      <router-link :to="fourthItem.uri">
                        {{fourthItem.name}}
                      </router-link>
                    </span>
                  </router-link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div class="sidebar-second-sub-menu" v-else-if="item.children.length>0" :style="{width: item.children.length*280 + 'px'}">
          <ul v-for="(secondArray, secondArrayIdx) in item.children" :key="secondArrayIdx+'-array'" class="sidebar-second-sub-column">
            <li class="sidebar-second-sub-menu-item"
                v-for="(secondItem, secondIndex) in item.children[secondArrayIdx]"
                :key="secondIndex+'-two'">
              <span>{{secondItem.name}}</span>
              <ul class="siderbar-third-sub-menu">
                <li class="sidebar-third-sub-menu-item"
                    v-for="(thirdItem, thirdIndex) in secondItem.children"
                    :key="thirdIndex+'-third'">
                  <a :href="thirdItem.uri" v-if="thirdItem.uri.indexOf('http')>-1" target="_blank">{{thirdItem.name}}</a>
                  <router-link :to="thirdItem.uri" v-if="thirdItem.uri.indexOf('http') < 0">
                    {{thirdItem.name}}
                    <span v-if="thirdItem.children != null && thirdItem.children.length > 0" class="sidebar-sub-menu-tail"
                      v-for="(fourthItem, fourthIndex) in thirdItem.children"
                      :key="fourthIndex">
                      <router-link :to="fourthItem.uri">
                        {{fourthItem.name}}
                      </router-link>
                    </span>
                  </router-link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="less">
</style>

<script>
  import {getSidebar} from '../../service/sidebar'

  export default {
    data() {
      return {
        sidebarList: [],
        showSubmenuList: []
      }
    },
    computed: {
      isSidebarNarrow() {
        return this.$store.state.sidebar.isSidebarNarrow;
      }
    },
    methods: {
      getSidebarInfo () {
        getSidebar().then(resp => {
          this.sidebarList = this.splitColumns(JSON.parse(resp));
        });
      },
      checkMultiColumns (children) {
        if (children[0] instanceof Array) {
          return true
        } else { // eslint-disable-line
          return false
        }
      },
      splitColumns(list) { // eslint-disable-line
        if (list === null || list.length === 0) {
          list = [];
          return list
        }

        for (let i = 0; i < list.length; i++) {
          if (list[i].name !== '市场运行监测' && list[i].name !== '分析工具') {
            continue;
          }

          let secondItems = list[i].children
          if (secondItems == null || secondItems.length === 0) {
            continue
          }

          if (list[i].name === '市场运行监测') {
            let secondArray = [];
            let arrayIdx = 0;
            secondArray[arrayIdx] = [];
            for (let j = 0; j < secondItems.length; j++) {
              let secondItem = secondItems[j];
              if (secondItem.name === '专项监测工作') {
                arrayIdx++;
                secondArray[arrayIdx] = []
              }
              secondArray[arrayIdx].push(JSON.parse(JSON.stringify(secondItem)))
            }
            list[i].children = secondArray;
          } else if (list[i].name === '分析工具') {
            let secondArray = [];
            let arrayIdx = 0;
            secondArray[arrayIdx] = [];
            for (let j = 0; j < secondItems.length; j++) {
              let secondItem = secondItems[j];
              if (secondItem.name === '特定分析工具') {
                arrayIdx++;
                secondArray[arrayIdx] = []
              }
              if (secondItem.name === '综合查询') {
                arrayIdx++;
                secondArray[arrayIdx] = []
              }
              secondArray[arrayIdx].push(JSON.parse(JSON.stringify(secondItem)))
            }
            list[i].children = secondArray;
          }
        }
        return list
      }
      // showSubmenu (index) {
      //   let swapList = [];
      //   swapList[index] = true;
      //   this.showSubmenuList = swapList;
      // },
      // hideSubmenu(index) {
      //   let swapList = [];
      //   swapList[index] = false;
      //   this.showSubmenuList = swapList;
      // }
    },
    mounted() {
      this.getSidebarInfo();
    }
  }
</script>
