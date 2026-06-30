import { ANCHO, ALTO, ESTADO_INTERMISION2 } from '../constants.js';

export class Tutorial1State {
  constructor(game) { this.game = game; }
  enter() {}
  exit() {}

  update(dt) {
    const g = this.game;
    if (g.input.justPressed('Space')) {
      for (const a of g.astrosGrupo) a.kill();
      if (g.camara) { g.camara.x = ANCHO / 2 - 100; g.camara.y = ALTO / 2 - 70; g.camara._updateCenter(); }
      g.tiempoInicio.intermision2 = g.ticks;
      g.estadoActual = ESTADO_INTERMISION2;
      return;
    }
    if (g.camara) {
      g.camara.automatico();
    }
    if (g.ticks - (g.tiempoInicio.intermision1 || 0) >= 7000) {
      for (const a of g.astrosGrupo) a.kill();
      if (g.camara) { g.camara.x = ANCHO / 2 - 100; g.camara.y = ALTO / 2 - 70; g.camara._updateCenter(); }
      g.tiempoInicio.intermision2 = g.ticks;
      g.estadoActual = ESTADO_INTERMISION2;
    }
  }

  render(ctx) {
    const g = this.game;
    ctx.drawImage(g.assets.getImg('fondo'), 0, 0, ANCHO, ALTO);

    const posV = g.camara ? { x: g.camara.centerX, y: g.camara.centerY } : { x: ANCHO / 2, y: ALTO / 2 };
    for (const a of g.astrosGrupo) {
      a.updateVisual(posV.x, posV.y);
      a.render(ctx);
    }
    if (g.camara) {
      g.camara.render(ctx, g.ticks, false);
    }

    ctx.save();
    ctx.font = '30px Silkscreen';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const ancla = { x: ANCHO / 2, y: Math.floor(ALTO / 1.3) };
    ctx.fillStyle = '#fff';
    ctx.fillText('MUEVE LA CÁMARA Y ENCUENTRA LOS PLANETAS', ancla.x, ancla.y - 80);

    const teclas = [
      { key: 'arrow_up', offX: 0, offY: -50 },
      { key: 'arrow_down', offX: 0, offY: 0 },
      { key: 'arrow_left', offX: -50, offY: 0 },
      { key: 'arrow_right', offX: 50, offY: 0 },
    ];
    for (const t of teclas) {
      const img = g.assets.getImg(t.key);
      if (img) {
        ctx.drawImage(img, ancla.x + t.offX - img.width / 2, ancla.y + t.offY - img.height / 2);
      }
    }
    ctx.restore();
  }
}
