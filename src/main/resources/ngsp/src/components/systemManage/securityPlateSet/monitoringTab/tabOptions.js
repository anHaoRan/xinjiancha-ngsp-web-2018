export const tabPanes = [
  {
    tabLabel: '券商',
    tabName: 'memberTab',
    searchForm: [
      {
        field: 'searchCode',
        label: '券商代码',
        type: 'input',
        searchCode: ''
      },
      {
        field: 'searchName',
        label: '券商名称',
        type: 'input',
        searchName: ''
      }
    ],
    leftColumns: [{
      label: '券商代码',
      field: 'member_id'
    }, {
      label: '券商名称',
      field: 'member_name'
    }],
    rightColumns: [{
      label: '券商代码',
      field: 'product_actor_id'
    }, {
      label: '券商名称',
      field: 'member_name'
    }]
  },
  {
    tabLabel: '营业部',
    tabName: 'salePartTab',
    searchForm: [
      {
        field: 'searchCode',
        label: '营业部代码',
        type: 'input',
        searchCode: ''
      },
      {
        field: 'searchName',
        label: '营业部名称',
        type: 'input',
        searchName: ''
      }
    ],
    leftColumns: [{
      label: '营业部代码',
      field: 'branch_id'
    }, {
      label: '营业部名称',
      field: 'branch_name'
    }],
    rightColumns: [{
      label: '营业部代码',
      field: 'product_actor_id'
    }, {
      label: '营业部名称',
      field: 'branch_name'
    }]
  },
  {
    tabLabel: 'PBU',
    tabName: 'pbuTab',
    searchForm: [
      {
        field: 'searchCode',
        label: 'PBU代码',
        type: 'input',
        searchCode: ''
      },
      {
        field: 'searchName',
        label: '会员名称',
        type: 'input',
        searchName: ''
      }
    ],
    leftColumns: [{
      label: 'PBU代码',
      field: 'pbu_id'
    }, {
      label: '会员名称',
      field: 'pbu_name'
    }],
    rightColumns: [{
      label: 'PBU代码',
      field: 'product_actor_id'
    }, {
      label: 'PBU名称',
      field: 'pbu_name'
    }]
  },
  {
    tabLabel: '证券板块',
    tabName: 'securitiesPlateTab',
    searchForm: [
      {
        field: 'searchCode',
        label: '证券板块编号',
        type: 'input',
        searchCode: ''
      },
      {
        field: 'searchName',
        label: '证券板块名称',
        type: 'input',
        searchName: ''
      }
    ],
    leftColumns: [{
      label: '证券板块编号',
      field: 'gather_id'
    }, {
      label: '证券板块名称',
      field: 'gather_name'
    }],
    rightColumns: [{
      label: '证券板块编号',
      field: 'product_actor_id'
    }, {
      label: '证券板块名称',
      field: 'gather_name'
    }]
  },
  {
    tabLabel: '账户组',
    tabName: 'groupaddTab',
    searchForm: [
      {
        field: 'searchCode',
        label: '账户组代码',
        type: 'input',
        searchCode: ''
      },
      {
        field: 'searchName',
        label: '账户组名称',
        type: 'input',
        searchName: ''
      },
      {
        field: 'accountType',
        label: '账户组类型',
        type: 'select',
        options: [],
        accountType: ''
      }
    ],
    leftColumns: [{
      label: '账户组代码',
      field: 'group_id'
    }, {
      label: '账户组名称',
      field: 'group_name'
    }],
    rightColumns: [{
      label: '账户组代码',
      field: 'product_actor_id'
    },
      {
        label: '账户组名称',
        field: 'group_name'
      }]
  }
]
