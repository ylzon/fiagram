// 全部scss文件引导向对应的文件
declare module '*.scss' {
  const content: { [className: string]: string }
  export default content
}
