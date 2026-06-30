export class ScoreManager {
  constructor() {
    this.data = this._load();
    this.nombresExistentes = new Set();
    if (this.data.jugadores) {
      this.nombresExistentes = new Set(Object.keys(this.data.jugadores).map(k => k.toLowerCase()));
    }
  }

  _load() {
    try {
      const raw = localStorage.getItem('arcspace_scores');
      if (raw) return JSON.parse(raw);
    } catch(e) {}
    return { jugadores: {}, partidas: [], top_scores: [] };
  }

  _save() {
    try {
      localStorage.setItem('arcspace_scores', JSON.stringify(this.data));
    } catch(e) {
      console.warn('No se pudo guardar puntuaciones');
    }
  }

  registrarResultado(nombre, puntTotal, nivelMax, descubiertos) {
    const ahora = new Date().toISOString().slice(0, 19).replace('T', ' ');
    if (!this.data.jugadores[nombre]) {
      this.data.jugadores[nombre] = {
        puntuacion_total: 0, nivel_maximo: 0,
        astros_descubiertos: [], fecha_hora: '', cantidad_partidas: 0,
      };
    }
    const p = this.data.jugadores[nombre];
    p.cantidad_partidas++;
    if (puntTotal > p.puntuacion_total) {
      p.puntuacion_total = puntTotal;
      p.nivel_maximo = nivelMax;
      p.astros_descubiertos = descubiertos;
      p.fecha_hora = ahora;
    }
    this.data.partidas.push({
      nombre, puntuacion_total: puntTotal,
      nivel_maximo: nivelMax, astros_descubiertos: descubiertos, fecha_hora: ahora,
    });
    const sorted = Object.entries(this.data.jugadores)
      .sort((a, b) => b[1].puntuacion_total - a[1].puntuacion_total);
    this.data.top_scores = sorted.map(([k, v]) => ({ nombre: k, puntos: v.puntuacion_total }));
    this._save();
  }

  getJugadoresOrdenados() {
    return Object.entries(this.data.jugadores)
      .sort((a, b) => b[1].puntuacion_total - a[1].puntuacion_total);
  }

  existeNombre(nombre) {
    return this.nombresExistentes.has(nombre.toLowerCase());
  }

  agregarNombre(nombre) {
    this.nombresExistentes.add(nombre.toLowerCase());
  }
}
