<template>
    <div class="content-header">
        <div>
            <div class="header">
                <div class=" font-color-main">
                    <div>【{{data.data.codeAndName}}】</div>
                    <div>{{data.data.title}}</div>
                </div>
                <div>
                    <div :class="formatterSubscription.className"
                         @click="handlerClickSubscription">
                        <img :src="formatterSubscription.img">
                    </div>
                    <div class="subscription0" @click="handlerClickPrint">
                        <img :src="print">
                    </div>
                </div>
            </div>
            <div class="footer">
                <div class="left">
                    <el-tag class="tag" color="rgba(255,255,255,0)" type="success" v-for="(item,index) in tag"
                            :key="index" size="small">{{item}}
                    </el-tag>
                    {{data.data.createDate}}
                    <span>来源：<b>{{'没有'}}</b></span>
                </div>
                <div class="right">
                    <div>
                        <img :src="fire"/>{{'没有'}}
                    </div>
                    <div>
                        <img :src="formatterSurface.img"/>{{formatterSurface.label}}
                    </div>
                    <div>
                        <span>转发（{{data.data.transmitNum}}）</span>
                        <span>媒体（{{data.media.length}}）</span>
                        <span>评论（{{data.data.commentNum}}）</span>
                    </div>
                </div>
            </div>
        </div>
        <div v-html="content">
        </div>
    </div>
</template>

<script>
  import heart_check from '@/assets/images/heart_check.png'
  import heart_nocheck from '@/assets/images/heart_nocheck.png'
  import print from '@/assets/images/print.png'
  import fire from '@/assets/images/fire.png'
  import negative from '@/assets/images/negative.png'
  import neutral from '@/assets/images/neutral.png'
  import positive from '@/assets/images/positive.png'

  export default {
    name: 'content-header',
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
        fire: fire,
        print: print
      }
    },
    computed: {
      tag () {
        let tag = this.data.data.keywords ? this.data.data.keywords.split('|') : []
        return tag
      },
      content () {
        let content = this.data.data.content
        content = content.trim()
        return content.replace(/\s{2,}/g, '</br>')
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
        return map[this.data.data.sentiment ? this.data.data.sentiment : 0]
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
        this.data.data.subscription = this.data.data.subscription == 0 ? 1 : 0
      },
      handlerClickPrint () {
        window.print()
      }
    }
  }
</script>

<style lang="less" scoped>
    .content-header {
        > div:first-child {
            padding: 20px 0;
            border-bottom: 1px solid #fff;
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
                    display: flex;
                    > div {
                        & + div {
                            margin-left: 10px;
                        }
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
            }
            .footer {
                display: flex;
                margin-top: 10px;
                justify-content: space-between;
                .left {
                    display: flex;
                    align-items: flex-end;
                    span:last-child {
                        margin-left: 30px;
                    }
                    span:nth-last-child(2) {
                        margin-right: 30px;
                    }
                    .tag {
                        margin-right: 15px;
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
                            span {
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
        > div:nth-child(2) {
            line-height: 24px;
            font-size: 16px;
            margin: 20px 0;
        }
    }
</style>