// 全部scss文件引导向对应的文件
declare module '*.scss' {
  const content: { [className: string]: string }
  export default content
}

// 解析vite-plugin-libcss
// declare module 'vite-plugin-libcss' {
//   const css: any
//   export default css
// }
