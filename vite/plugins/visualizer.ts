import { Plugin } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'

//显示编译信息
export default (plugins: Plugin[], _:any, env: ImportMetaEnv) => {
  plugins.push(visualizer())
}
