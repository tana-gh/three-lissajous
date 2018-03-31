import THREE = require('three')
import * as Render  from './render'
import * as Rx from 'rxjs'

const prevCount = 1000

export interface IInteractions {
    current: THREE.Vector2
    prevs  : THREE.Vector2[]
    button1: boolean
    button2: boolean
}

export const initInteract = (threeObjects: Render.IThreeObjects, width: number, height: number) => {
    const canvas = document.getElementById('container')!
                           .appendChild(threeObjects.renderer.domElement)
    
    const interactions = {
        current: new THREE.Vector2(undefined, undefined),
        prevs  : <THREE.Vector2[]>[],
        button1: false,
        button2: false
    }

    const mouseEvents: Rx.Observable<MouseEvent> = Rx.Observable.fromEvent(canvas, 'click')
    
    return mouseEvents.map(updateInteractions(interactions, width, height))
}

const updateInteractions =
        (interactions: IInteractions, width: number, height: number) => (e: MouseEvent) => {
    interactions.prevs.push(interactions.current)
    
    while (interactions.prevs.length > prevCount) {
        interactions.prevs.shift()
    }
    
    const pos = (offset: number, width: number) => offset / width * 2.0 - 1.0

    interactions.current = new THREE.Vector2(pos(e.offsetX, width), pos(e.offsetY, height))
    interactions.button1 = (e.buttons & 0x1) !== 0
    interactions.button2 = (e.buttons & 0x2) !== 0

    return interactions
}
