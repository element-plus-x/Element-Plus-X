import type { App, Plugin } from 'vue'
import Bubble from './components/Bubble/index.vue'
import BubbleList from './components/BubbleList/index.vue'
import Sender from './components/Sender/index.vue'
import Thinking from './components/Thinking/index.vue'
import Typewriter from './components/Typewriter/index.vue'

export * from './components'
export * from './hooks'

const ElementPlusX: Plugin = {
  install(app: App) {
    app.component('Bubble', Bubble)
    app.component('BubbleList', BubbleList)
    app.component('Sender', Sender)
    app.component('Thinking', Thinking)
    app.component('Typewriter', Typewriter)
  }
}

export default ElementPlusX