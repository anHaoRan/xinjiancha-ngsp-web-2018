
const ffRex = /(^[1-9](\d+)?(\.\d{1,2})?$)|(^(0){1}$)|(^\d\.\d{1,2}?$)/
const fzRex = /(^-[1-9](\d+)?(\.\d{1,2})?$)|(^(0){1}$)|(^(0)\.00?$)|(^-\d\.\d{1,2}?$)/
export const rulesProps = {
  'SZZZ01': {
    pattern: ffRex,
    message: '只能输入非负数，保留两位小数'
  },
  'BIAS01_UP': {
    pattern: ffRex,
    message: '只能输入非负数，保留两位小数'
  },
  'BIAS01_DOWN': {
    pattern: fzRex,
    message: '只能输入非正数，保留两位小数'
  },
  'OBV_A_UP': {
    pattern: ffRex,
    message: '只能输入非负数，保留两位小数'
  },
  'OBV_A_DOWN': {
    pattern: fzRex,
    message: '只能输入非正数，保留两位小数'
  },
  'OBV_E_UP': {
    pattern: ffRex,
    message: '只能输入非负数，保留两位小数'
  },
  'OBV_E_DOWN': {
    pattern: fzRex,
    message: '只能输入非正数，保留两位小数'
  },
  'OBV_I_UP': {
    pattern: ffRex,
    message: '只能输入非负数，保留两位小数'
  },
  'OBV_I_DOWN': {
    pattern: fzRex,
    message: '只能输入非正数，保留两位小数'
  },
  'OBV_M_UP': {
    pattern: ffRex,
    message: '只能输入非负数，保留两位小数'
  },
  'OBV_M_DOWN': {
    pattern: fzRex,
    message: '只能输入非正数，保留两位小数'
  },
  'OBV_O_UP': {
    pattern: ffRex,
    message: '只能输入非负数，保留两位小数'
  },
  'OBV_O_DOWN': {
    pattern: fzRex,
    message: '只能输入非正数，保留两位小数'
  },
  'OBV_1_UP': {
    pattern: ffRex,
    message: '只能输入非负数，保留两位小数'
  },
  'OBV_1_DOWN': {
    pattern: fzRex,
    message: '只能输入非正数，保留两位小数'
  },
  'OBV_F_UP': {
    pattern: ffRex,
    message: '只能输入非负数，保留两位小数'
  },
  'OBV_F_DOWN': {
    pattern: fzRex,
    message: '只能输入非正数，保留两位小数'
  }
}
