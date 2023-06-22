import {
  BehaviorSubject,
  fromEvent,
  map,
  pairwise,
  switchMap,
  takeUntil,
  withLatestFrom
} from "rxjs"

import { createInputStream } from "./helpers.js"

import './styles/index.scss'

type Line = {
  x: number,
  y: number,
  options: {
    color: string,
    thickness: string,
  }
}

type Stroke = {
  from: Line,
  to: Line,
}

const canvas = document.getElementById('paint') as HTMLCanvasElement
const canvasRect = canvas.getBoundingClientRect()
const canvasCtx = canvas.getContext('2d') as CanvasRenderingContext2D
const thicknessControl = document.getElementById('range') as HTMLInputElement
const colorControl = document.getElementById('color') as HTMLInputElement
const usedColorsContainer = document.getElementById('used-colors') as HTMLDivElement
const usedColorsItemTpl = document.getElementById('used-colors-tpl') as HTMLTemplateElement
const clearBtn = document.getElementById('clear-btn') as HTMLButtonElement
const undoBtn = document.getElementById('undo-btn') as HTMLButtonElement
const redoBtn = document.getElementById('redo-btn') as HTMLButtonElement
const pixelRatio = window.devicePixelRatio

canvas.width = canvasRect.width * pixelRatio
canvas.height = canvasRect.height * pixelRatio
canvasCtx.scale(pixelRatio, pixelRatio)

const mouseMove$ = fromEvent<MouseEvent>(canvas, 'mousemove')
const mouseDown$ = fromEvent<MouseEvent>(canvas, 'mousedown')
const mouseUp$ = fromEvent<MouseEvent>(canvas, 'mouseup')
const mouseLeave$ = fromEvent<MouseEvent>(canvas, 'mouseleave')
const thicknessInput$ = createInputStream(thicknessControl)
const usedColorsClick$ = fromEvent<MouseEvent>(usedColorsContainer, 'click')
const colors$ = new BehaviorSubject<string[]>([])
const currentColor$ = new BehaviorSubject(colorControl.value)
const strokes$ = new BehaviorSubject<Stroke[]>([])
const redoStrokes$ = new BehaviorSubject<Stroke[]>([])
const clearBtnClick$ = fromEvent<MouseEvent>(clearBtn, 'click')
const undoBtnClick$ = fromEvent<MouseEvent>(undoBtn, 'click')
const redoBtnClick$ = fromEvent<MouseEvent>(redoBtn, 'click')

strokes$
  .subscribe((strokes) => {
    canvasCtx.clearRect(0, 0, canvasRect.width, canvasRect.height)
    strokes.forEach(({ from, to }) => {
      canvasCtx.lineWidth = +to.options.thickness
      canvasCtx.strokeStyle = to.options.color
      canvasCtx.beginPath()
      canvasCtx.moveTo(from.x, from.y)
      canvasCtx.lineTo(to.x, to.y)
      canvasCtx.stroke()
    })
    const noStrokes = strokes.length === 0
    undoBtn.disabled = noStrokes
    clearBtn.disabled = noStrokes
  })

redoStrokes$
  .subscribe((redoStrokes) => {
    redoBtn.disabled = redoStrokes.length === 0
  })
mouseDown$
  .pipe(
    withLatestFrom(thicknessInput$, currentColor$),
    map(([_, thickness, color]) => ({ thickness, color })),
    switchMap((options) => {
      return mouseMove$.pipe(
        map((e) => ({
          x: e.offsetX,
          y: e.offsetY,
          options,
        })),
        pairwise(),
        takeUntil(mouseUp$),
        takeUntil(mouseLeave$),
      )
    }),
    withLatestFrom(strokes$),
  )
  .subscribe(([[from, to], strokes]) => {
    strokes$.next([...strokes, { from, to }])
  })

fromEvent<InputEvent>(colorControl, 'blur').pipe(
  map((e) => {
    const target = e.target as HTMLInputElement
    return target.value
  }),
  withLatestFrom(colors$)
).subscribe(([color, colors]) => {
  if (!colors.includes(color)) {
    colors$.next([...colors, color])
  }
  currentColor$.next(color)
})

colors$.subscribe((newColors) => {
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

usedColorsClick$.pipe(
  map((e) => {
    const target = e.target as HTMLInputElement
    const color = target.getAttribute('data-color')
    return color || null
  })
).subscribe((color) => {
  if (color) {
    currentColor$.next(color)
    colorControl.value = color
  }
})

clearBtnClick$
  .subscribe(() => {
    redoStrokes$.next([])
    strokes$.next([])
  })

undoBtnClick$
  .pipe(
    withLatestFrom(strokes$, redoStrokes$),
  )
  .subscribe(([_, strokes, redoStrokes]) => {
    const latestStroke = strokes.slice(-1).pop()
    if (latestStroke) {
      redoStrokes$.next([...redoStrokes, latestStroke])
    }
    strokes$.next(strokes.slice(0, -1))
  })

redoBtnClick$
  .pipe(
    withLatestFrom(strokes$, redoStrokes$)
  )
  .subscribe(([_, strokes, redoStrokes]) => {
    const latestRedoStroke = redoStrokes.slice(-1).pop()
    if (latestRedoStroke) {
      strokes$.next([...strokes, latestRedoStroke])
      redoStrokes$.next(redoStrokes.slice(0, -1))
    }
  })
