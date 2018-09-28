export default {
  state: {
    MemberInquiryRadio: '',
    CreditAccountMRadio: '',
    CreditAccountRadio: '',
    FinancingRadio: '',
    SecuritiesRadio: '',
    StandardTicketRadio: '',
    StandardTicketDetail: {}
  },
  getters: {
    getMemberInquiryRadio: state => {
      return state.MemberInquiryRadio
    },
    getCreditAccountMRadio: state => {
      return state.CreditAccountMRadio
    },
    getCreditAccountRadio: state => {
      return state.CreditAccountRadio
    },
    getFinancingRadio: state => {
      return state.FinancingRadio
    },
    getSecuritiesRadio: state => {
      return state.SecuritiesRadio
    },
    getStandardTicketRadio: state => {
      return state.StandardTicketRadio
    },
    getStandardTicketDetail: state => {
      return state.StandardTicketDetail
    }
  },
  mutations: {
    setMemberInquiryRadio: (state, val) => {
      state.MemberInquiryRadio = val
    },
    setCreditAccountMRadio: (state, val) => {
      state.CreditAccountMRadio = val
    },
    setCreditAccountRadio: (state, val) => {
      state.CreditAccountRadio = val
    },
    setFinancingRadio: (state, val) => {
      state.FinancingRadio = val
    },
    setSecuritiesRadio: (state, val) => {
      state.SecuritiesRadio = val
    },
    setStandardTicketRadio: (state, val) => {
      state.StandardTicketRadio = val
    },
    setStandardTicketDetail: (state, val) => {
      state.StandardTicketDetail = val
    }
  },
  actions: {}
}
