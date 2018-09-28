const CL_LV3 = '#FF0000'
const CL_LV2 = '#FF8000'
const CL_LV1 = '#FFFF00'
const CL_LV0 = '#2ECCFA'

export const TH_MAP_ACCOUNT_CODE = 'province_account'
export const TH_MAP_TRADE_CODE = 'province_trade'

export function formatPointerColor (value, code, thresholds) {
  if (value == null) {
    return CL_LV0
  }
  let thld = thresholds == null ? null : thresholds[code]
  return formatColor(value, thld)
}

export function formatLineColor (value, code, thresholds) {
  if (value == null) {
    return CL_LV0
  }
  let thld = thresholds == null ? null : thresholds[code]
  return formatColor(value, thld)
}

export function formatCircleRadius (value, code, thresholds) {
  let thld = thresholds == null ? null : thresholds[code]
  if (thld == null) {
    return 4
  }
  return 3 + 3 * value[2] / thld.LEVEL1
}

function formatColor (value, thld) {
  if (value == null) {
    return CL_LV0
  }
  if (thld == null || thld.LEVEL3 == null) {
    return CL_LV0
  }
  if (value >= thld.LEVEL3) {
    return CL_LV3
  } else if (value >= thld.LEVEL2) {
    return CL_LV2
  } else if (value >= thld.LEVEL1) {
    return CL_LV1
  }
  return CL_LV0
}
