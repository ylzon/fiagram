// 全部scss文件引导向对应的文件
declare module '*.scss' {
  const content: { [className: string]: string }
  export default content
}

// algebra.js
declare module 'algebra.js' {
  export const parse: (expression: string) => any
}

export type ValueOf<T> = T[keyof T]
