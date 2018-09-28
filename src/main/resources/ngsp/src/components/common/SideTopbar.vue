<template>
  <div>
    <ul class="sidebar-menu-top">
      <li v-for="(item, index) in sidebarList"
          :class="['sidebar-menu-top-item',{'sidebar-menu-top-choose':item.parentType,'sidebar-menu-top-a':item.uri != '','sidebar-menu-top-span':item.uri === ''}]">
        <div v-if="item.uri === ''" class="sidebar-first-menu-item-span">
          <span>{{item.name}}</span>
          <i class="el-icon-caret-bottom" v-if="item.uri === ''"></i>
        </div>
        <router-link :to="item.uri" v-if="item.uri != ''" class="sidebar-first-menu-item-a">
          <span>{{item.name}}</span>
          <i class="el-icon-caret-bottom" v-if="item.uri === ''"></i>
        </router-link>
        <div class="sidebar-second-sub-menu-top" v-if="item.children.length>0 && !checkMultiColumns(item.children)"
             :style="{left:'-' + index*95 + 'px'}">
          <ul class="sidebar-second-sub-column">
            <li class="sidebar-second-sub-column-li">
              <ul v-for="(secondItem, secondIndex) in item.children" class="sidebar-third-sub-column">
                <h3>{{secondItem.name}}</h3>
                <li class="sidebar-third-sub-column-li" v-for="(thirdItem,thirdIndex) in secondItem.children">
                  <a :href="thirdItem.uri" v-if="thirdItem.uri.indexOf('http')>-1"
                     target="_blank">{{thirdItem.name}}</a>
                  <router-link :to="thirdItem.uri" v-if="thirdItem.uri.indexOf('http') < 0">
                    {{thirdItem.name}}
                    <span v-if="thirdItem.children != null && thirdItem.children.length > 0"
                          class="sidebar-top-sub-menu-tail"
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
        <div class="sidebar-second-sub-menu-top" v-if="item.children.length>0 && checkMultiColumns(item.children)"
             :style="{left:'-' + index*90 + 'px'}">
          <ul class="sidebar-second-sub-column">
            <li class="sidebar-second-sub-column-li" v-for="(secondItem, secondIndex) in item.children">
              <ul v-for="(thirdItem,thirdIndex) in secondItem" class="sidebar-third-sub-column">
                <h3>{{thirdItem.name}}</h3>
                <li class="sidebar-third-sub-column-li" v-for="(fourthItem, fourthIndex) in thirdItem.children">
                  <a :href="fourthItem.uri" v-if="fourthItem.uri.indexOf('http')>-1"
                     target="_blank">{{fourthItem.name}}</a>
                  <router-link :to="fourthItem.uri" v-if="fourthItem.uri.indexOf('http') < 0">
                    {{fourthItem.name}}
                    <span v-if="fourthItem.children != null && fourthItem.children.length > 0"
                          class="sidebar-top-sub-menu-tail"
                          v-for="(fifthItem, fifthIndex) in fourthItem.children"
                          :key="fifthItem">
                                          <router-link :to="fifthItem.uri">
                                            {{fifthItem.name}}
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
    import ElSubmenu from 'element-ui/packages/menu/src/submenu'

    export default {
        props:['sidebarList'],
        components: {ElSubmenu},
        data () {
            return {}
        },
        computed: {
            isSidebarNarrow () {
                return this.$store.state.sidebar.isSidebarNarrow
            },
        },
        methods: {
            checkMultiColumns (children) {
                if (children[0] instanceof Array) {
                    return true
                } else { // eslint-disable-line
                    return false
                }
            },
        },
    }
</script>
