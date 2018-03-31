import '../sass/style'
import * as Render from './render'

window.onload = () => {
    const width  = window.innerWidth  - 20
    const height = window.innerHeight - 20
    Render.initRender(width, height)
}
