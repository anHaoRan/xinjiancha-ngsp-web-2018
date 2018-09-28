<template>
    <div class="sesation-list-item" @click="handlerClick">
        <div class="header">
            <div class=" font-color-main">
                <div>【{{data.codeAndName}}】</div>
                <div>{{data.title}}</div>
            </div>
            <div :class="formatterSubscription.className"
                 @click.stop="handlerClickSubscription">
                <img :src="formatterSubscription.img">
            </div>
        </div>
        <div class="main">
            {{data.summary+'......'}}
            <span style="color: #FF0000;">查看全文</span>
        </div>
        <div class="footer">
            <div class="left">
                {{data.publishTime}}
                <span>来源：<b>{{'没有'}}</b></span>
                <el-tag class="tag" color="rgba(255,255,255,0)" type="success" v-for="(item,index) in tag"
                        :key="index" size="small">{{item}}
                </el-tag>
            </div>
            <div class="right">
                <div>
                    <img :src="fire"/>{{'没有'}}
                </div>
                <div>
                    <img :src="formatterSurface.img"/>{{formatterSurface.label}}
                </div>
                <div>
                    <span>转发（{{data.transmitNum}}）</span>
                    <span v-if="data.transmitMediaNum==0">媒体（{{data.transmitMediaNum}}）</span>
                    <el-popover
                            v-else
                            popper-class="sensation-display-media"
                            placement="bottom"
                            width="70"
                            trigger="hover">
                        <div>
                            <div class="title">转发媒体</div>
                            <hr/>
                            <div class="media-item">
                                <div v-for="(item,index) in data.transmitMedia" :key="index">
                                    <div>{{item.media}}</div>
                                    <div style="font-size: 10px;">{{item.transmitTime}}</div>
                                    <hr/>
                                </div>
                            </div>
                        </div>
                        <span slot="reference">媒体（{{data.transmitMediaNum}}）</span>
                    </el-popover>
                    <span v-if="data.commentNum==0">评论（{{data.commentNum}}）</span>
                    <el-popover
                            v-else
                            popper-class="sensation-display-comment"
                            placement="bottom"
                            width="350"
                            trigger="hover">
                        <div>
                            <div class="title">评论</div>
                            <hr/>
                            <div class="comment-item">
                                <div v-for="(item,index) in data.comments" :key="index">
                                    <div class="header" style="display: flex">
                                        <div>
                                            <img :src="formatterSurface.img">
                                        </div>
                                        <div>
                                            <div>{{item.time}}</div>
                                            <div style="font-size: 10px;">{{item.time}}</div>
                                        </div>
                                    </div>
                                    <div style="padding-left: 52px;font-size: 12px">
                                        {{item.content}}
                                    </div>
                                    <hr/>
                                </div>
                            </div>
                        </div>
                        <span slot="reference">评论（{{data.commentNum}}）</span>
                    </el-popover>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import heart_check from '@/assets/images/heart_check.png'
  import heart_nocheck from '@/assets/images/heart_nocheck.png'
  import fire from '@/assets/images/fire.png'
  import negative from '@/assets/images/negative.png'
  import neutral from '@/assets/images/neutral.png'
  import positive from '@/assets/images/positive.png'

  export default {
    name: 'sesation-list-item',
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
        fire: fire
      }
    },
    computed: {
      tag () {
        let tag = this.data.keywords ? this.data.keywords.split('|') : []
        return tag
      },
      formatterSurface () {
        let map = {
          '-1': {
            img: negative,
            label: '负面'
          },
          '0': {
            img: neutral,
            label: '中性'
          },
          '1': {
            img: positive,
            label: '正面'
          }
        }
        return map[this.data.sentiment ? this.data.sentiment : 0]
      },
      formatterSubscription () {
        let map = {
          0: {
            img: heart_nocheck,
            className: 'subscription0'
          },
          1: {
            img: heart_check,
            className: 'subscription1'
          }
        }
        //TODO: 没有
        return map[0]
      }
    },
    watch: {},
    created () {
    },
    mounted () {
    },
    beforeDestroy () {
    },
    methods: {
      handlerClickSubscription () {
        this.data.subscription = this.data.subscription == 0 ? 1 : 0
      },
      handlerClick () {
        this.$router.push({path: `/sensationDisplayDetail/${this.data.publicSentimentId}`})
      }
    }
  }
</script>

<style lang="less" scoped>
    .sesation-list-item {
        padding: 20px 0px;
        margin: 0px 20px;
        border-bottom: 1px solid #fff;
        cursor: pointer;
        .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            > div:first-child {
                font-size: 18px;
                line-height: 33px;
                > div {
                    display: inline;
                    &:last-child {
                        color: #FF0000;
                    }
                }
            }
            .subscription0 {
                background: rgba(255, 255, 255, 0);
                border: 1px solid rgba(121, 121, 121, 1);
            }
            .subscription1 {
                background: rgba(255, 0, 51, 1);
                border: 1px solid rgba(255, 0, 51, 1);
            }
            > div:last-child {
                border-radius: 5px;
                text-align: center;
                width: 33px;
                height: 33px;
                cursor: pointer;
                img {
                    margin-top: 7.5px;
                    width: 18px;
                }
            }
        }
        .main {
            line-height: 24px;
            font-size: 13px;
            margin-bottom: 10px;
        }
        .footer {
            display: flex;
            justify-content: space-between;
            .left {
                display: flex;
                align-items: flex-end;
                span {
                    margin-left: 15px;
                }
                .tag {
                    margin-left: 30px;
                    & + .tag {
                        margin-left: 15px;
                    }
                }
            }
            .right {
                display: flex;
                > div {
                    display: flex;
                    align-items: center;
                    padding-right: 15px;
                    &:nth-child(2) {
                        border-right: 1px solid #fff;
                    }
                    &:last-child {
                        padding-right: 0px;
                        > span {
                            &:first-child {
                                margin-left: 20px;
                            }
                            margin-left: 10px;
                        }
                    }
                }
                img {
                    width: 18px;
                    height: 18px;
                    margin-right: 5px;
                }
            }
        }
    }
</style>
<style lang="less">
    .sensation-display-media, .sensation-display-comment {
        padding: 0;
        .title {
            font-size: 16px;
            font-weight: 600;
            padding: 10px 0px 0px 10px;
        }
        .media-item, .comment-item {
            height: 200px;
            overflow-y: auto;
            &::-webkit-scrollbar {
                display: none;
            }
            > div {
                margin-left: 20px;
            }
            .header {
                display: flex;
                align-items: center;
                > div:last-child {
                    margin-left: 10px;
                }
                img {
                    width: 42px;
                    height: 42px;
                }
            }
        }
        .comment-item {
            height: 300px;
        }
    }
</style>