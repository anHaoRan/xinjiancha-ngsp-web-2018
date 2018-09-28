<template>
    <div class="content-main">
        <h3 class="font-color-main">评论（{{data.data.commentNum}}）</h3>
        <div class="comment-item">
            <div v-for="(item,index) in newComments" :key="index">
                <div class="header" style="display: flex">
                    <div>
                        <img :src="negative">
                    </div>
                    <div>
                        <div>{{item.time}}</div>
                        <div style="font-size: 14px;">{{item.time}}</div>
                    </div>
                </div>
                <div class="main">
                    {{item.content}}
                </div>
            </div>
        </div>
        <div style="text-align: center;margin-top: 20px" v-if="isShow">
            <el-button type="info" @click="handlerMoreLoading">加载更多</el-button>
        </div>
    </div>
</template>

<script>
  import negative from '@/assets/images/negative.png'

  export default {
    name: 'content-main',
    props: {
      data: {
        type: Object,
        required: true
      }
    },
    components: {},
    mixins: [],
    data () {
      return {
        negative: negative,
        newComments: [],
        isShow: true
      }
    },
    computed: {},
    watch: {},
    created () {
    },
    mounted () {
      this.newComments = this.data.data.comments.slice(0, 3)
    },
    beforeDestroy () {
    },
    methods: {
      handlerMoreLoading () {
        this.newComments = this.data.data.comments
        this.isShow = false
      }
    }
  }
</script>

<style lang="less" scoped>
    .content-main {
        h3 {
            padding-bottom: 10px;
            border-bottom: 1px solid #fff;
        }
        .comment-item {
            max-height: 500px;
            overflow-y: auto;
            &::-webkit-scrollbar {
                display: none;
            }
            .header {
                display: flex;
                align-items: center;
                > div:last-child {
                    font-size: 16px;
                    margin-left: 10px;
                }
                img {
                    width: 60px;
                    height: 60px;
                }
            }
            .main {
                margin-left: 70px;
                padding-bottom: 10px;
                border-bottom: 1px solid #fff;
            }
        }
    }
</style>