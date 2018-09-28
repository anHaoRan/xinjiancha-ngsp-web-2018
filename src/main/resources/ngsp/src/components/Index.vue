<template>
    <div class="main-container">
        <Sidebar :class="sidebarStyleNew" v-if="themeName != 'theme_dark'" :sidebarList="sidebarList"></Sidebar>
        <oldsidebar :class="sidebarStyle" v-else></oldsidebar>
        <div :class="themeName != 'theme_dark' ? contentStyleNew :  contentStyle">
            <topbar v-if="themeName != 'theme_dark'" :sidebarList="sidebarList"></topbar>
            <oldtopbar v-else></oldtopbar>
            <div class="subpage">
                <breadcrumb :breadcrumbList="breadcrumbItems" v-if=" themeName != 'theme_dark' && breadcrumbItems.length > 0" ></breadcrumb>
                <router-view></router-view>
            </div>
        </div>
    </div>

</template>


<script>
    import Topbar from './common/Topbar'
    import Oldtopbar from './common/OldTopbar'
    import Sidebar from './common/Sidebar'
    import Oldsidebar from './common/OldSidebar'
    import breadcrumb from './common/Breadcrumb'
    import {getSidebar} from '../service/sidebar'

    export default {
        name: 'index',
        components: {
            Topbar,
            Sidebar,
            Oldtopbar,
            Oldsidebar,
            breadcrumb
        },
        data() {
            return {
                sidebarList: [],
                types: false,
                routerIndexList: [],
                breadcrumbItems: []
            }
        },
        computed: {
            sidebarStyleNew() {
                return this.$store.state.sidebar.sidebarStyleNew
            },
            contentStyleNew() {
                return this.$store.state.sidebar.contentStyleNew
            },
            sidebarStyle() {
                return this.$store.state.sidebar.sidebarStyle
            },
            contentStyle() {
                return this.$store.state.sidebar.contentStyle
            },
            themeName() {
                return this.$store.state.sidebar.themeName
            },
            routerName() {
                return this.$route.name
            }
        },
        watch: {
            routerName(v) {
                this.changeRouteFname()
            },
        },
        methods: {
            addPopUp() {
                console.log(1)
            },
            getSidebarInfo() {
                getSidebar().then(resp => {
                    this.sidebarList = this.splitColumns(JSON.parse(resp));
                    this.sidebarList.forEach((item, i) => {
                        this.$set(this.sidebarList[i], 'parentType', false)
                    });
                    this.changeRouteFname()
                })
            },
            splitColumns(list) { // eslint-disable-line
                if (list === null || list.length === 0) {
                    list = [];
                    return list
                }

                for (let i = 0; i < list.length; i++) {
                    if (list[i].name !== '市场运行监测' && list[i].name !== '分析工具') {
                        continue
                    }

                    let secondItems = list[i].children;
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
                        list[i].children = secondArray
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
                        list[i].children = secondArray
                    }
                }
                return list
            },
            changeRouteFname() {
                let self = this;
                self.routerIndexList = [];
                self.breadcrumbItems = [];
                this.sidebarList.map((item, i) => {

                    self.types = false;
                    self.forEachs(item);
                    self.$set(this.sidebarList[i], 'parentType', self.types)
                    if (self.types) {
                        self.routerIndexList.push(
                            {
                                router: item.uri,
                                label: item.name
                            })
                        self.routerIndexList.reverse();
                        self.routerIndexList.map(ritem => {
                            let type = true;
                            self.breadcrumbItems.map(bitem => {
                                if (ritem.label == bitem.label && ritem.router == '') type = false
                            })
                            if (type) self.breadcrumbItems.push(ritem)
                        })
                    }

                })
            },

            forEachs(v) {
                let self = this;
                if (typeof v == 'object' && !isNaN(v.length)) {
                    v.map((item) => {
                        self.forEachs(item)
                    })
                } else {
                    if (v.uri == '' || v.uri.substring(1) != self.routerName) {
                        if (v.children.length > 0) {
                            v.children.map((item) => {
                                self.forEachs(item)
                            })
                        }

                    } else if (v.uri.substring(1) == self.routerName) {
                        self.types = true;
                        self.routerIndexList.push(
                            {
                                router: v.uri,
                                label: v.name
                            })
                        self.sidebarList.forEach(item => {
                            this.forEachBreadcrumb(item, v.parentid)
                        })
                    }
                }

            },
            forEachBreadcrumb(v, id) {
                let self = this;
                if (typeof v == 'object' && !isNaN(v.length)) {
                    v.map((item) => {
                        self.forEachBreadcrumb(item, id)
                    })
                } else {
                    if (v.reid != id) {
                        if (v.children.length > 0) {
                            v.children.map((item) => {
                                self.forEachBreadcrumb(item, id)
                            })
                        }
                    } else {
                        self.routerIndexList.push(
                            {
                                router: v.uri,
                                label: v.name
                            })
                    }
                }
            },
        },
        mounted() {
            this.getSidebarInfo()
        }
    }
</script>
