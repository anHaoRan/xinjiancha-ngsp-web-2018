<template>
    <div @mouseout="toggleSidebar(true)" @mouseover="toggleSidebar(false)">
        <div class="sidebar-title">
            <img src="../../assets/images/logo_word_white.png"/>
        </div>
        <ul class="sidebar-menu">
            <li
                    v-for="(item, index) in sidebarList"
                    :class="['sidebar-menu-item',{'sidebar-menu-choose':item.parentType}]"
                    :key="index+'-one'"

            >
                <div v-if="item.uri === ''">
                    <span v-if="!isSidebarNarrowNew">{{item.name}}</span>
                    <i class="el-icon-caret-right" v-if="item.uri === ''"></i>
                </div>
                <router-link :to="item.uri" v-if="item.uri != ''" class="sidebar-first-menu-item-a">
                    <span v-if="!isSidebarNarrowNew">{{item.name}}</span>
                    <i class="el-icon-caret-right" v-if="item.uri === ''"></i>
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
                                    <a :href="thirdItem.uri" v-if="thirdItem.uri.indexOf('http')>-1"
                                       target="_blank">{{thirdItem.name}}</a>
                                    <router-link :to="thirdItem.uri" v-if="thirdItem.uri.indexOf('http') < 0">
                                        {{thirdItem.name}}
                                        <span v-if="thirdItem.children != null && thirdItem.children.length > 0"
                                              class="sidebar-sub-menu-tail"
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
                <div class="sidebar-second-sub-menu" v-else-if="item.children.length>0"
                     :style="{width: item.children.length*230 + 'px'}">
                    <ul v-for="(secondArray, secondArrayIdx) in item.children" :key="secondArrayIdx+'-array'"
                        class="sidebar-second-sub-column">
                        <li class="sidebar-second-sub-menu-item"
                            v-for="(secondItem, secondIndex) in item.children[secondArrayIdx]"
                            :key="secondIndex+'-two'">
                            <span>{{secondItem.name}}</span>
                            <ul class="siderbar-third-sub-menu">
                                <li class="sidebar-third-sub-menu-item"
                                    v-for="(thirdItem, thirdIndex) in secondItem.children"
                                    :key="thirdIndex+'-third'">
                                    <a :href="thirdItem.uri" v-if="thirdItem.uri.indexOf('http')>-1"
                                       target="_blank">{{thirdItem.name}}</a>
                                    <router-link :to="thirdItem.uri" v-if="thirdItem.uri.indexOf('http') < 0">
                                        {{thirdItem.name}}
                                        <span v-if="thirdItem.children != null && thirdItem.children.length > 0"
                                              class="sidebar-sub-menu-tail"
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
    export default {
        props:['sidebarList'],
        data() {
            return {}
        },
        computed: {
            isSidebarNarrowNew() {
                return this.$store.state.sidebar.isSidebarNarrowNew
            }
        },
        methods: {
            toggleSidebar(type) {
                this.$store.state.sidebar.isSidebarNarrowNew = type;
                if (type) {
                    this.$store.state.sidebar.sidebarStyleNew = 'sidebar-narrow'
                } else {
                    this.$store.state.sidebar.sidebarStyleNew = 'sidebar'
                }
            },
            checkMultiColumns(children) {
                if (children[0] instanceof Array) {
                    return true
                } else { // eslint-disable-line
                    return false
                }
            },
        },
    }
</script>
