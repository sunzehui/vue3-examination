import { Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'

//vue框架
export default (plugins: Plugin[], _: any,env: ImportMetaEnv) => {
  plugins.push(vue({ reactivityTransform: true }))
}
