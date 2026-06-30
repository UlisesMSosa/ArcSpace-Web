export class InputManager {
  constructor(canvas) {
    this.keys = {};
    this.keysJustPressed = {};
    this._justPressed = {};
    this.mousePos = { x: 0, y: 0 };
    this.mouseClick = null;
    this.scrollDelta = 0;
    this.canvas = canvas;
    this._typedChar = '';
    this._scaleX = 1;
    this._scaleY = 1;
    this._offsetX = 0;
    this._offsetY = 0;

    document.addEventListener('keydown', (e) => {
      if (!this.keys[e.code]) {
        this._justPressed[e.code] = true;
      }
      this.keys[e.code] = true;
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        this._typedChar = e.key;
      }
    });
    document.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
      const my = (e.clientY - rect.top) * (canvas.height / rect.height);
      this.mousePos = { x: mx, y: my };
    });
    canvas.addEventListener('mousedown', (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
      const my = (e.clientY - rect.top) * (canvas.height / rect.height);
      this.mouseClick = { x: mx, y: my, button: e.button };
    });
    canvas.addEventListener('wheel', (e) => {
      // pygame's event.y es positivo cuando la rueda gira "hacia arriba"
      // (alejarse de la pantalla); el deltaY del navegador tiene el signo
      // opuesto (positivo = hacia abajo), así que lo invertimos acá para
      // que consumeScroll() se comporte igual que event.y en main.py.
      this.scrollDelta += e.deltaY > 0 ? -1 : 1;
      e.preventDefault();
    }, { passive: false });
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  isDown(code) {
    return !!this.keys[code];
  }

  justPressed(code) {
    return !!this._justPressed[code];
  }

  consumeClick() {
    const c = this.mouseClick;
    this.mouseClick = null;
    return c;
  }

  consumeScroll() {
    const d = this.scrollDelta;
    this.scrollDelta = 0;
    return d;
  }

  clearJustPressed() {
    this._justPressed = {};
  }

  clearMouseClick() {
    this.mouseClick = null;
  }

  consumeTypedChar() {
    const c = this._typedChar;
    this._typedChar = '';
    return c;
  }
}
