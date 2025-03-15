import type { App, Directive } from 'vue'
import copy from './modules/copy'
import waterMarker from './modules/waterMarker'

const directivesList: { [key: string]: Directive } = {
  copy,
  waterMarker
}

const directives = {
  install: function (app: App<Element>) {
    Object.keys(directivesList).forEach((key) => {
      app.directive(key, directivesList[key])
    })
  }
}

export default directives
