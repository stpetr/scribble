import {
  BehaviorSubject,
  filter,
  fromEvent,
  map,
  merge,
  withLatestFrom,
} from 'rxjs'

import { createInputStream } from './helpers/streams.ts'
import { shapes$ } from './store.ts'
import {
  canvas,
  setupCanvas,
  clearAuxCanvas,
  clearCanvas,
} from './canvas.ts'

import { LineTool, PenLineTool, RectangleTool, CircleTool, EllipseTool } from './shapes'
import { ShapeTool } from './shapes/types.ts'
import { ShapesSelector } from './tools/shapes-selector.ts'

import './styles/index.scss'

type Tool = 'pen' | 'line' | 'rect' | 'circle' | 'ellipse'

const thicknessControl = document.getElementById('range') as HTMLInputElement
const colorControl = document.getElementById('color') as HTMLInputElement
const usedColorsContainer = document.getElementById('used-colors') as HTMLDivElement
const usedColorsItemTpl = document.getElementById('used-colors-tpl') as HTMLTemplateElement
const clearBtn = document.getElementById('clear-btn') as HTMLButtonElement
const saveImageBtn = document.getElementById('save-image-btn') as HTMLButtonElement
const undoBtn = document.getElementById('undo-btn') as HTMLButtonElement
const redoBtn = document.getElementById('redo-btn') as HTMLButtonElement
const penToolBtn = document.getElementById('tool-pen-btn') as HTMLButtonElement
const lineToolBtn = document.getElementById('tool-line-btn') as HTMLButtonElement
const rectToolBtn = document.getElementById('tool-rect-btn') as HTMLButtonElement
const circleToolBtn = document.getElementById('tool-circle-btn') as HTMLButtonElement
const ellipseToolBtn = document.getElementById('tool-ellipse-btn') as HTMLButtonElement
const selectModeControl = document.getElementById('select-mode') as HTMLInputElement

const toolsButtons = [
  penToolBtn,
  lineToolBtn,
  rectToolBtn,
  circleToolBtn,
  ellipseToolBtn,
]

const colors$ = new BehaviorSubject<string[]>([])
const currentColor$ = new BehaviorSubject(colorControl.value)
const redo$ = new BehaviorSubject<ShapeTool[]>([])
const currentTool$ = new BehaviorSubject<Tool>('pen')

const mouseMove$ = fromEvent<MouseEvent>(canvas, 'mousemove')
const mouseDown$ = fromEvent<MouseEvent>(canvas, 'mousedown')
const mouseUp$ = fromEvent<MouseEvent>(canvas, 'mouseup')
const mouseLeave$ = fromEvent<MouseEvent>(canvas, 'mouseleave')
const thicknessInput$ = createInputStream(thicknessControl)
const usedColorsClick$ = fromEvent<MouseEvent>(usedColorsContainer, 'click')
const clearBtnClick$ = fromEvent<MouseEvent>(clearBtn, 'click')
const saveImageBtnClick$ = fromEvent<MouseEvent>(saveImageBtn, 'click')
const undoBtnClick$ = fromEvent<MouseEvent>(undoBtn, 'click')
const redoBtnClick$ = fromEvent<MouseEvent>(redoBtn, 'click')
const penToolBtnClick$ = fromEvent<MouseEvent>(penToolBtn, 'click')
const lineToolBtnClick$ = fromEvent<MouseEvent>(lineToolBtn, 'click')
const rectToolBtnClick$ = fromEvent<MouseEvent>(rectToolBtn, 'click')
const circleToolBtnClick$ = fromEvent<MouseEvent>(circleToolBtn, 'click')
const ellipseToolBtnClick$ = fromEvent<MouseEvent>(ellipseToolBtn, 'click')
const selectModeChange$ = fromEvent(selectModeControl, 'input')

const activeShape$ = new BehaviorSubject<ShapeTool | null>(null)
const activeMode$ = new BehaviorSubject<'draw' | 'select'>('draw')
const shapesSelector$ = new BehaviorSubject<ShapesSelector>(new ShapesSelector())

setupCanvas()

shapes$
  .subscribe((shapes) => {
    clearCanvas()
    shapes.forEach((shape) => {
      shape.render()
    })
  })

currentTool$.pipe(
  withLatestFrom(shapesSelector$),
).subscribe(([currentTool, shapesSelector]) => {
  const activeClass = 'red'
  toolsButtons.forEach((btn) => btn.classList.remove(activeClass))
  if (currentTool === 'pen') {
    penToolBtn.classList.add(activeClass)
  } else if (currentTool === 'line') {
    lineToolBtn.classList.add(activeClass)
  } else if (currentTool === 'rect') {
    rectToolBtn.classList.add(activeClass)
  } else if (currentTool === 'circle') {
    circleToolBtn.classList.add(activeClass)
  } else if (currentTool === 'ellipse') {
    ellipseToolBtn.classList.add(activeClass)
  }

  activeMode$.next('draw')
  selectModeControl.checked = false
  shapesSelector.reset()
})

redo$
  .subscribe((redo) => {
    redoBtn.disabled = redo.length === 0
  })

// Draw
mouseDown$
  .pipe(
    withLatestFrom(activeMode$),
    filter(([_, mode]) => mode === 'draw'),
    map(([e]) => e),
    withLatestFrom(currentTool$, thicknessInput$, currentColor$),
    map(([e, currentTool, thickness, color]) => {
      if (currentTool === 'line') {
        return new LineTool(e.offsetX, e.offsetY, +thickness, color)
      } else if (currentTool === 'rect') {
        return new RectangleTool(e.offsetX, e.offsetY, +thickness, color)
      } else if (currentTool === 'circle') {
        return new CircleTool(e.offsetX, e.offsetY, +thickness, color)
      } else if (currentTool === 'ellipse') {
        return new EllipseTool(e.offsetX, e.offsetY, +thickness, color)
      }
      return new PenLineTool(e.offsetX, e.offsetY, +thickness, color)
    }),
  )
  .subscribe((shape) => {
    activeShape$.next(shape)
  })

mouseMove$
  .pipe(
    withLatestFrom(activeMode$),
    filter(([_, mode]) => mode === 'draw'),
    map(([e]) => e),
    withLatestFrom(activeShape$),
  )
  .subscribe(([e, activeShape]) => {
    if (activeShape) {
      activeShape.onMouseMove(e.offsetX, e.offsetY)
    }
  })

merge(mouseUp$, mouseLeave$)
  .pipe(
    withLatestFrom(activeMode$),
    filter(([_, mode]) => mode === 'draw'),
    map(([e]) => e),
    withLatestFrom(activeShape$, shapes$),
  )
  .subscribe(([_, activeShape, shapes]) => {
    if (activeShape) {
      shapes$.next([...shapes, activeShape])
      activeShape$.next(null)
      clearAuxCanvas()
    }
  })

// Select tool
mouseDown$
  .pipe(
    withLatestFrom(activeMode$, shapesSelector$),
    filter(([_, mode]) => mode === 'select'),
    map(([e, _, shapesSelector]) => ({ e, shapesSelector })),
  )
  .subscribe(({ e, shapesSelector}) => {
    if (shapesSelector.mode === 'selected' && shapesSelector.isOverSelectedArea(e.offsetX, e.offsetY)) {
      shapesSelector.startMoving(e.offsetX, e.offsetY)
    } else {
      shapesSelector.startSelecting(e.offsetX, e.offsetY)
    }
  })

mouseMove$
  .pipe(
    withLatestFrom(activeMode$, shapesSelector$, shapes$),
    filter(([_, mode]) => mode === 'select'),
    map(([e, _, shapesSelector, shapes]) => ({ e, shapesSelector, shapes })),
  )
  .subscribe(({e, shapesSelector, shapes}) => {
    shapesSelector.onMouseMove(e.offsetX, e.offsetY)

    if (shapesSelector.mode === 'select') {
      shapesSelector.selectedShapes = shapes.filter((shape) => shape.isWithinRect(shapesSelector.area))
    } else if (shapesSelector.mode === 'move') {
      shapes$.next([...shapes])
    }
  })

mouseUp$
  .pipe(
    withLatestFrom(activeMode$, shapesSelector$),
    filter(([_, mode]) => mode === 'select'),
    map(([_, __, shapesSelector]) => ({ shapesSelector })),
  )
  .subscribe(({ shapesSelector }) => {
    if (shapesSelector.mode === 'move') {
      shapesSelector.stopMoving()
    } else {
      shapesSelector.stopSelecting()
    }
  })

activeMode$
  .pipe(
    withLatestFrom(shapesSelector$),
  )
  .subscribe(([mode, shapesSelector]) => {
    if (mode !== 'select') {
      shapesSelector.mode = null
    }
  })

fromEvent<InputEvent>(colorControl, 'blur')
  .pipe(
    map((e) => {
      const target = e.target as HTMLInputElement
      return target.value
    }),
    withLatestFrom(colors$)
  )
  .subscribe(([color, colors]) => {
    if (!colors.includes(color)) {
      colors$.next([...colors, color])
    }
    currentColor$.next(color)
  })

penToolBtnClick$
  .subscribe(() => {
    currentTool$.next('pen')
  })

lineToolBtnClick$
  .subscribe(() => {
    currentTool$.next('line')
  })

rectToolBtnClick$
  .subscribe(() => {
    currentTool$.next('rect')
  })

circleToolBtnClick$
  .subscribe(() => {
    currentTool$.next('circle')
  })

ellipseToolBtnClick$
  .subscribe(() => {
    currentTool$.next('ellipse')
  })

colors$
  .subscribe((newColors) => {
    usedColorsContainer.textContent = ''
    newColors.forEach((el) => {
      const tplClone = usedColorsItemTpl.content.cloneNode(true) as Element
      const item = tplClone.querySelector('.used-colors__item') as HTMLSpanElement
      if (item) {
        item.style.backgroundColor = el
        item.setAttribute('data-color', el)
        usedColorsContainer.appendChild(tplClone)
      }
    })
  })

usedColorsClick$
  .pipe(
    map((e) => {
      const target = e.target as HTMLInputElement
      const color = target.getAttribute('data-color')
      return color || null
    }))
  .subscribe((color) => {
    if (color) {
      currentColor$.next(color)
      colorControl.value = color
    }
  })

currentColor$
  .pipe(
    withLatestFrom(shapesSelector$, shapes$),
  )
  .subscribe(([currentColor, shapesSelector, shapes]) => {
    if (shapesSelector.selectedShapes.length) {
      shapesSelector.selectedShapes.forEach((shape) => {
        shape.color = currentColor
      })
      shapes$.next([...shapes])
    }
  })

thicknessInput$
  .pipe(
    withLatestFrom(shapesSelector$, shapes$),
  )
  .subscribe(([thickness, shapesSelector, shapes]) => {

    if (shapesSelector.selectedShapes.length) {
      shapesSelector.selectedShapes.forEach((shape) => {
        shape.thickness = +thickness
      })
      shapes$.next([...shapes])
    }
  })

clearBtnClick$
  .subscribe(() => {
    redo$.next([])
    shapes$.next([])
  })

saveImageBtnClick$
  .subscribe(() => {
    const image = canvas.toDataURL()
    const createEl = document.createElement('a')
    createEl.href = image
    createEl.download = 'my-picture'
    createEl.click()
    createEl.remove()
  })

undoBtnClick$
  .pipe(
    withLatestFrom(shapes$, redo$),
  )
  .subscribe(([_, strokes, redo]) => {
    const latestShape = strokes.slice(-1).pop()
    if (latestShape) {
      redo$.next([...redo, latestShape])
    }
    shapes$.next(strokes.slice(0, -1))
  })

redoBtnClick$
  .pipe(
    withLatestFrom(shapes$, redo$)
  )
  .subscribe(([_, shapes, redo]) => {
    const latestRedo = redo.slice(-1).pop()
    if (latestRedo) {
      shapes$.next([...shapes, latestRedo])
      redo$.next(redo.slice(0, -1))
    }
  })

selectModeChange$
  .pipe(
    withLatestFrom(shapesSelector$),
  )
  .subscribe(([e, shapesSelector]) => {
    const target = e.target as HTMLInputElement
    const nextMode = target.checked ? 'select' : 'draw'
    activeMode$.next(nextMode)
    if (nextMode === 'draw') {
      shapesSelector.reset()
    }
  })

// @todo remove
console.log('Testing runner on dev env')
