export default {
  path: '/pdf-preview/:url',
  name: 'pdf-preview',
  component: function (resolve) {
    require(['@/components/sensation/components/PDFPreview.vue'], resolve)
  }
}
