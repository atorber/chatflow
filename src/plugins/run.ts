import fs from 'fs'
import type { Plugin, PluginConfig } from '../mods/interface'

function loadPlugins (app: any) {
  const config: PluginConfig[] = JSON.parse(fs.readFileSync('./config.json', 'utf8'))
  config.forEach((pluginConfig: PluginConfig) => {
    const plugin: Plugin = require(`./plugins/${pluginConfig.name}`)
    plugin.init(app)
    pluginConfig.active ? plugin.enable(app) : plugin.disable(app)
  })
}

const app = {}
// 监听文件
fs.watchFile('./config.json', (curr, prev) => {
  loadPlugins(app)
})
