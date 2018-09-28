import { fnExport } from '@/service/analysisTool/MarginTrading/Index'

export default {
  data () {
    return {}
  },
  computed: {},
  created () {

  },
  methods: {
    createElementA (installParams) {
      let params = {}
      for (let key in installParams) {
        params[key] = installParams[key]
      }
      console.log(JSON.stringify(params))
      this.gfnExportFileWithForm(fnExport(), params)
    }
  }
}
