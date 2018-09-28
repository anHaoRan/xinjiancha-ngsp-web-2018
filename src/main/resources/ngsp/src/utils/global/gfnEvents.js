import 'jquery'

let echarts = require('echarts')

function resizeCharts (itemId, newHPx, newWPx) {
  if (itemId == null) {
    return
  }
  let chartDoms = $('#' + itemId).find('[_echarts_instance_]')
  if (chartDoms == null || !chartDoms.length) {
    return
  }
  for (let idx = 0; idx < chartDoms.length; idx++) {
    let domId = $(chartDoms[idx]).attr('id')
    if (domId != null) {
      // let offset1 = computeChartOffset("#"+domId)
      let offset = $(chartDoms[idx]).offset().top - $('#' + itemId).offset().top
      $('#' + domId).height(newHPx - offset - 2)
      echarts.getInstanceByDom(document.getElementById(domId)).resize()
    }
  }
}

function resizeTable (itemId, newHPx, newWPx) {
  if (itemId == null) {
    return
  }
  let chartDoms = $('#' + itemId).find('.el-table')
  if (chartDoms == null || !chartDoms.length) {
    return
  }
  for (let idx = 0; idx < chartDoms.length; idx++) {
    // let offset1 = computeChartOffset(chartDoms[idx])
    let offset = $(chartDoms[idx]).offset().top - $('#' + itemId).offset().top
    $(chartDoms[idx]).height(newHPx - offset - 2)
  }
}
// eslint-disable-next-line
function computeChartOffset (dom) {
  let offset = 0
  let bro = $(dom).prev()
  while (bro != null && bro.length) {
    if ($(bro).css('position') !== 'absolute') {
      offset += $(bro).outerHeight()
    }
    bro = $(bro).prev()
  }
  if (!$(dom).parent().hasClass('vue-grid-item')) {
    offset += computeChartOffset($(dom).parent())
  }
  return offset
}

export default {
  install (Vue, options) {
    // vue-grid-layout 内容自适应
    Vue.prototype.gfnVueGridLayoutResize = (itemId, newHPx, newWPx) => {
      resizeCharts(itemId, newHPx, newWPx)
      resizeTable(itemId, newHPx, newWPx)
    }
  }
}
