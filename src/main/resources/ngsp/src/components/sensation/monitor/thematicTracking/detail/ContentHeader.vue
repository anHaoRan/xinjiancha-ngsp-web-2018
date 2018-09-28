<template>
    <el-card class="content-header el-card-tabel">
        <h1>{{title}}</h1>
        <div class="title-sub">
            <div v-for="(item,index) of data" :key="index">
                {{item.label+item.value+(item.unit?item.unit:'')}}
            </div>
            <div>
                <img :src="formatterSurface.img">
                <div>{{formatterSurface.label}}</div>
            </div>
        </div>
    </el-card>
</template>

<script>
  import negative from '@/assets/images/negative.png'
  import neutral from '@/assets/images/neutral.png'
  import positive from '@/assets/images/positive.png'

  export default {
    name: 'content-header',
    props: [],
    components: {},
    mixins: [],
    data () {
      return {
        title: '操纵股市',
        data: [
          {
            label: '涉及媒体：',
            value: '171',
            unit: '家'
          },
          {
            label: '主题数：',
            value: '171',
            unit: '个'
          },
          {
            label: '文章数：',
            value: '171',
            unit: '篇'
          },
          {
            label: '评论数：',
            value: '171',
            unit: '条'
          },
          {
            label: '有效期至：',
            value: '2018年8月10日'
          }
        ]
      }
    },
    computed: {
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
        return map['0']
      }
    },
    watch: {},
    created () {
    },
    mounted () {
    },
    beforeDestroy () {
    },
    methods: {}
  }
</script>

<style lang="less" scoped>
    .content-header {
        .title-sub {
            display: flex;
            align-items: center;
            > div {
                display: flex;
                align-items: center;
                padding: 0 30px;
                border-right: 1px solid;
                &:last-child {
                    border-right: 0px;
                }
                &:first-child {
                    padding-left: 0;
                }
                img {
                    height: 30px;
                }
                span {
                    line-height: 30px;
                }
            }
        }
    }
</style>