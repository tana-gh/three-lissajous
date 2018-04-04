import THREE = require('three')
import * as Render  from './render'
import * as Rx from 'rxjs'

const possCount = 1000

export interface IInteractions {
    poss   : THREE.Vector2[]
    button1: boolean
    button2: boolean
}

export const initInteract = (threeObjects: Render.IThreeObjects, width: number, height: number) => {
    const canvas = document.getElementById('container')!
                           .appendChild(threeObjects.renderer.domElement)
    
    const interactions = {
        poss   : [],
        button1: false,
        button2: false
    }

    const mouseEvents: Rx.Observable<MouseEvent> = Rx.Observable.merge(
        <Rx.Observable<MouseEvent>>Rx.Observable.fromEvent(canvas, 'mouseup'  ),
        <Rx.Observable<MouseEvent>>Rx.Observable.fromEvent(canvas, 'mousedown'),
        <Rx.Observable<MouseEvent>>Rx.Observable.fromEvent(canvas, 'mousemove')
    )
    return mouseEvents.map(updateInteractions(interactions, width, height))
                      .merge(Rx.Observable.of(<IInteractions>{
                          poss   : [],
                          button1: false,
                          button2: false
                      }))
}

const updateInteractions =
        (interactions: IInteractions, width: number, height: number) => (e: MouseEvent) => {
    
    while (interactions.poss.length > possCount) {
        interactions.poss.pop()
    }
    
    const conv = (offset: number, width: number) => offset / width * 2.0 - 1.0
    const pos = new THREE.Vector2(conv(e.offsetX, width), conv(e.offsetY, height))
    
    interactions.poss.unshift(pos)
    interactions.button1 = (e.buttons & 0x1) !== 0
    interactions.button2 = (e.buttons & 0x2) !== 0

    return interactions
}
