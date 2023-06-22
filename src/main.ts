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

const canvas = document.getElementById('paint') as HTMLCanvasElement
const canvasRect = canvas.getBoundingClientRect()
const canvasCtx = canvas.getContext('2d') as CanvasRenderingContext2D
const thicknessControl = document.getElementById('range') as HTMLInputElement
const colorControl = document.getElementById('color') as HTMLInputElement
const usedColorsContainer = document.getElementById('used-colors') as HTMLDivElement
const usedColorsItemTpl = document.getElementById('used-colors-tpl') as HTMLTemplateElement
const clearBtn = document.getElementById('clear-btn') as HTMLButtonElement
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
const clearBtnClick$ = fromEvent<MouseEvent>(clearBtn, 'click')

const stream$ = mouseDown$.pipe(
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
)

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

clearBtnClick$.subscribe(() => {
  canvasCtx.clearRect(0, 0, canvasRect.width, canvasRect.height)
})

stream$.subscribe(([from, to]) => {
  canvasCtx.lineWidth = +to.options.thickness
  canvasCtx.strokeStyle = to.options.color
  canvasCtx.beginPath()
  canvasCtx.moveTo(from.x, from.y)
  canvasCtx.lineTo(to.x, to.y)
  canvasCtx.stroke()
})
