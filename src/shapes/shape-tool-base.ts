export class ShapeToolBase {
  protected _color = '#000000'
  protected _thickness = 1

  get color() {
    return this._color
  }

  set color(color: string) {
    this._color = color
  }

  get thickness() {
    return this._thickness
  }

  set thickness(thickness: number) {
    this._thickness = thickness
  }
}
