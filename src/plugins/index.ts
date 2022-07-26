import { App } from 'vue'

export default (app: App) => {
  register(app, import.meta.globEager('./**/index.ts'))
}

function register(app: App, modules: Record<string, any>) {
  Object.entries(modules).map(([, module]) => {
    module.default(app)
  })
}
