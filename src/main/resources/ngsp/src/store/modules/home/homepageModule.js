export default {
  state: {
    stockTable: {
      expands: []
    },
    flagIndex: 0,
    stockAnalysisOptions: {}

  },
  mutations: {
    setStockTableInfo (state) {
      // state.stockTable.expands.push(12987122);
      // debugger
      let publicMesInfoDOM = document.getElementById('publicMesInfo').childNodes
      for (let i = 0; i < publicMesInfoDOM.length; i++) {
        publicMesInfoDOM[i].style.backgroundColor = ''
      }
      publicMesInfoDOM[state.flagIndex].style.backgroundColor = '#ccc'
    }
  },
  actions: {},
  getters: {}
}
