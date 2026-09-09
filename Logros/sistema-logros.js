// =============================================
//  SISTEMA DE LOGROS - PALOMA MIGAJERA v4
//  Integrado con el sistema de save del juego
// =============================================

const LOGROS = {
  primer_vuelo: {
    id: 'primer_vuelo',
    nombre: 'Primer Vuelo',
    descripcion: 'Completa el tutorial',
    icono: '',
    condicion: () => {
      const s = getSave();
      return s && s.zonasVisitadas && s.zonasVisitadas.length >= 1;
    }
  },
  recolector: {
    id: 'recolector',
    nombre: 'Recolector Novato',
    descripcion: 'Recoge 50 migajas',
    icono: '',
    condicion: () => {
      const s = getSave();
      return s && s.migajasTotal >= 50;
    }
  },
  maestro_recolector: {
    id: 'maestro_recolector',
    nombre: 'Maestro Recolector',
    descripcion: 'Recoge 500 migajas',
    icono: '',
    condicion: () => {
      const s = getSave();
      return s && s.migajasTotal >= 500;
    }
  },
  explorador: {
    id: 'explorador',
    nombre: 'Explorador',
    descripcion: 'Visita 2 zonas diferentes',
    icono: '',
    condicion: () => {
      const s = getSave();
      return s && s.zonasVisitadas && s.zonasVisitadas.length >= 2;
    }
  },
  superviviente: {
    id: 'superviviente',
    nombre: 'Superviviente',
    descripcion: 'Consigue 3 checkpoints sin morir',
    icono: '',
    condicion: () => false
  },
  cazador: {
    id: 'cazador',
    nombre: 'Cazador',
    descripcion: 'Derrota 10 enemigos',
    icono: '',
    condicion: () => {
      const s = getSave();
      return s && s.enemigosDerrotados >= 10;
    }
  },
  cazador_experto: {
    id: 'cazador_experto',
    nombre: 'Cazador Experto',
    descripcion: 'Derrota 50 enemigos',
    icono: '',
    condicion: () => {
      const s = getSave();
      return s && s.enemigosDerrotados >= 50;
    }
  },
  madrugador: {
    id: 'madrugador',
    nombre: 'Madrugador',
    descripcion: 'Juega entre las 6:00 y 8:00 AM',
    icono: '',
    condicion: () => {
      const hora = new Date().getHours();
      return hora >= 6 && hora < 8;
    }
  },
  noctambulo: {
    id: 'noctambulo',
    nombre: 'Noctambulo',
    descripcion: 'Juega entre medianoche y 2:00 AM',
    icono: '',
    condicion: () => {
      const hora = new Date().getHours();
      return hora >= 0 && hora < 2;
    }
  },
  dedicado: {
    id: 'dedicado',
    nombre: 'Dedicado',
    descripcion: 'Juega durante 1 hora',
    icono: '',
    condicion: () => {
      const s = getSave();
      return s && s.tiempoJugado >= 3600;
    }
  },
  resistente: {
    id: 'resistente',
    nombre: 'Resistente',
    descripcion: 'Sobrevive con 1 HP',
    icono: '',
    condicion: () => {
      const s = getSave();
      return s && s.vida === 1 && s.vidaMax > 1;
    }
  },
  leyenda: {
    id: 'leyenda',
    nombre: 'Leyenda Alada',
    descripcion: 'Desbloquea todos los logros',
    icono: '',
    condicion: () => {
      const logros = cargarLogros();
      const total = Object.keys(LOGROS).length - 1;
      const desbloqueados = Object.keys(logros).length;
      return desbloqueados >= total;
    }
  },
  social: {
    id: 'social',
    nombre: 'Paloma Social',
    descripcion: 'Habla con un NPC',
    icono: '',
    condicion: () => {
      const logros = cargarLogros();
      return logros && logros.social;
    }
  },
  saltarin: {
    id: 'saltarin',
    nombre: 'Saltarin',
    descripcion: 'Realiza 100 saltos',
    icono: '',
    condicion: () => {
      const s = getSave();
      return s && s.saltosTotales >= 100;
    }
  },
  palomaduken_maestro: {
    id: 'palomaduken_maestro',
    nombre: 'Maestro del Palomaduken',
    descripcion: 'Lanza 50 Palomadukens',
    icono: '',
    condicion: () => {
      const s = getSave();
      return s && s.palomadukensLanzados >= 50;
    }
  },
};

const LOGRO_SAVE_KEY = 'pm_v4_logros';

// Iconos SVG para los logros (se muestran en la notificación)
const LOGRO_ICONS = {
  primer_vuelo: '<svg viewBox="0 0 24 24" width="42" height="42"><ellipse cx="12" cy="14" rx="5" ry="6" fill="#e8e8f8"/><ellipse cx="12" cy="10" rx="4" ry="4" fill="#f0f0ff"/><circle cx="14" cy="9" r="1.5" fill="#080810"/><circle cx="14.5" cy="8.5" r="0.5" fill="#fff"/><rect x="16" y="9" width="3" height="1.5" rx="0.5" fill="#e8c040"/><ellipse cx="8" cy="13" rx="4" ry="3" fill="#c0c0e0"/></svg>',
  recolector: '<svg viewBox="0 0 24 24" width="42" height="42"><ellipse cx="12" cy="14" rx="9" ry="6" fill="#e8c840"/><ellipse cx="12" cy="13" rx="8" ry="5" fill="#f0d860"/><ellipse cx="10" cy="12" rx="3" ry="2" fill="#fff8a0" opacity="0.5"/></svg>',
  maestro_recolector: '<svg viewBox="0 0 24 24" width="42" height="42"><ellipse cx="11" cy="15" rx="9" ry="6" fill="#c09028"/><rect x="12" y="6" width="8" height="10" rx="2" transform="rotate(18 16 11)" fill="#d8aa40"/><circle cx="13" cy="9" r="1.5" fill="#fff8a0" opacity="0.5"/></svg>',
  explorador: '<svg viewBox="0 0 24 24" width="42" height="42" fill="none" stroke="#80a0c0" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2"/><line x1="8" y1="2" x2="8" y2="22"/><line x1="16" y1="2" x2="16" y2="22"/></svg>',
  superviviente: '<svg viewBox="0 0 24 24" width="42" height="42"><path d="M12 21s-8-5-10-9C.5 9 .5 6 3 4.5S8 5 12 9c2-2 5-4.5 7.5-3C22 7.5 22 10.5 19 14c-2 3-4 5-7 7z" fill="#40b860"/></svg>',
  cazador: '<svg viewBox="0 0 24 24" width="42" height="42" fill="#e8e8f8"><path d="M12 2L2 20h6l4-8 4 8h6z" opacity="0.9"/><path d="M12 2L10 12h4z" fill="#606080"/></svg>',
  cazador_experto: '<svg viewBox="0 0 24 24" width="42" height="42" fill="none" stroke="#c0c0e0" stroke-width="2"><path d="M12 2L2 20h6l4-8 4 8h6zM12 2L10 12h4z"/></svg>',
  madrugador: '<svg viewBox="0 0 24 24" width="42" height="42"><circle cx="12" cy="12" r="5" fill="#f0a030"/><path d="M3 15h18M5 19h14M12 3v2M4 7l2 2M20 7l-2 2" stroke="#f0a030" stroke-width="1.5" fill="none"/></svg>',
  noctambulo: '<svg viewBox="0 0 24 24" width="42" height="42"><path d="M14 3c4 1 7 5 7 9 0 5-4 9-9 9-3 0-6-2-8-4 6 1 10-3 10-7 0-3-1-5 0-7z" fill="#a0a0e0"/><circle cx="18" cy="5" r="1.5" fill="#e0e0ff"/></svg>',
  dedicado: '<svg viewBox="0 0 24 24" width="42" height="42" fill="none" stroke="#e0e0f0" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2" fill="#e0e0f0"/><path d="M12 8v4l3 2" stroke-width="1.8"/></svg>',
  resistente: '<svg viewBox="0 0 24 24" width="42" height="42"><path d="M12 21s-8-5-10-9C.5 9 .5 6 3 4.5S8 5 12 9c2-2 5-4.5 7.5-3C22 7.5 22 10.5 19 14c-2 3-4 5-7 7z" fill="#c03030"/><circle cx="12" cy="12" r="1.5" fill="#fff"/></svg>',
  leyenda: '<svg viewBox="0 0 24 24" width="42" height="42"><path d="M2 17l4-10 2 6 2-8 4 14zM12 5l2 6 2-8 6 16H2l4-6z" fill="#e8c840" opacity="0.9"/><circle cx="12" cy="15" r="2" fill="#fff"/></svg>',
  social: '<svg viewBox="0 0 24 24" width="42" height="42" fill="#b0b0d0"><rect x="2" y="4" width="20" height="14" rx="3"/><path d="M6 22l4-4h8l4 4" fill="#606080"/></svg>',
  saltarin: '<svg viewBox="0 0 24 24" width="42" height="42" fill="none" stroke="#e8c840" stroke-width="2"><path d="M4 18c2-8 6-12 16-14-1 8-5 12-12 12M4 18c0 3 3 4 6 3"/></svg>',
  palomaduken_maestro: '<svg viewBox="0 0 24 24" width="42" height="42"><path d="M4 4l16 16M20 4L4 20" stroke="#e8c840" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="6" fill="#6ab0d8" opacity="0.6"/><circle cx="12" cy="12" r="3" fill="#c0e8ff"/></svg>',
  generic: '<svg viewBox="0 0 24 24" width="42" height="42" fill="#e8c840"><path d="M12 2l3 7 7 .5-5 5 1 7-6-4-6 4 1-7-5-5 7-.5z" opacity="0.9"/></svg>',
};

function cargarLogros() {
  try { return JSON.parse(localStorage.getItem(LOGRO_SAVE_KEY)) || {}; }
  catch { return {}; }
}

function guardarLogros(logros) {
  localStorage.setItem(LOGRO_SAVE_KEY, JSON.stringify(logros));
}

function verificarLogros() {
  const logrosGuardados = cargarLogros();
  const nuevosLogros = [];

  for (const [id, logro] of Object.entries(LOGROS)) {
    if (logrosGuardados[id]) continue;
    if (logro.condicion()) {
      logrosGuardados[id] = { desbloqueado: true, fecha: new Date().toISOString() };
      nuevosLogros.push(logro);
    }
  }

  if (nuevosLogros.length > 0) {
    guardarLogros(logrosGuardados);
    nuevosLogros.forEach((logro, i) => {
      setTimeout(() => mostrarNotificacionLogro(logro), i * 2500);
    });
  }
  return nuevosLogros;
}

function mostrarNotificacionLogro(logro) {
  const notif = document.createElement('div');
  notif.style.cssText = `
    position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
    background:rgba(8,8,16,0.96);border:2px solid #e8c840;
    padding:28px 38px;z-index:10000;text-align:center;min-width:280px;
    box-shadow:0 0 40px rgba(232,200,64,0.3);
    font-family:'Cinzel',serif;
    animation:logroIn 0.4s ease-out;
  `;
  notif.innerHTML = `
    <div style="margin-bottom:8px;line-height:1;">${LOGRO_ICONS[logro.id] || LOGRO_ICONS.generic}</div>
    <div style="color:#e8c840;font-size:0.65rem;letter-spacing:0.3em;margin-bottom:8px;text-transform:uppercase;">
      ¡LOGRO DESBLOQUEADO!
    </div>
    <div style="color:#e8e8ff;font-size:0.9rem;letter-spacing:0.15em;margin-bottom:5px;">
      ${logro.nombre}
    </div>
    <div style="color:#606080;font-size:0.8rem;font-style:italic;">
      ${logro.descripcion}
    </div>
  `;

  const style = document.createElement('style');
  style.textContent = `
    @keyframes logroIn{0%{transform:translate(-50%,-50%) scale(0.5);opacity:0}60%{transform:translate(-50%,-50%) scale(1.05)}100%{transform:translate(-50%,-50%) scale(1);opacity:1}}
    @keyframes logroOut{0%{opacity:1}100%{opacity:0;transform:translate(-50%,-50%) scale(0.9)}}
  `;
  document.head.appendChild(style);
  document.body.appendChild(notif);

  setTimeout(() => {
    notif.style.animation = 'logroOut 0.4s ease forwards';
    setTimeout(() => notif.remove(), 400);
  }, 3500);
}

function incrementarEnemigoDerrotado() {
  const s = getSave();
  if (!s) return;
  s.enemigosDerrotados = (s.enemigosDerrotados || 0) + 1;
  setSave(s);
  verificarLogros();
}

function incrementarSaltos() {
  const s = getSave();
  if (!s) return;
  s.saltosTotales = (s.saltosTotales || 0) + 1;
  setSave(s);
  verificarLogros();
}

function incrementarPalomaduken() {
  const s = getSave();
  if (!s) return;
  s.palomadukensLanzados = (s.palomadukensLanzados || 0) + 1;
  setSave(s);
  verificarLogros();
}

function registrarAreaDescubierta(areaId) {
  const s = getSave();
  if (!s) return;
  if (!s.zonasVisitadas) s.zonasVisitadas = [];
  if (!s.zonasVisitadas.includes(areaId)) {
    s.zonasVisitadas.push(areaId);
    setSave(s);
  }
  verificarLogros();
}

function registrarNPCConocido(npcName) {
  const s = getSave();
  if (!s) return;
  if (!s.npcsConocidos) s.npcsConocidos = [];
  if (!s.npcsConocidos.includes(npcName)) {
    s.npcsConocidos.push(npcName);
    setSave(s);
  }
  verificarLogros();
}

function obtenerProgreso() {
  const logrosDesbloqueados = Object.keys(cargarLogros()).length;
  const totalLogros = Object.keys(LOGROS).length;
  return {
    desbloqueados: logrosDesbloqueados,
    total: totalLogros,
    porcentaje: Math.floor((logrosDesbloqueados / totalLogros) * 100)
  };
}

// Verificar logros cada 30 segundos
setInterval(() => verificarLogros(), 30000);
window.addEventListener('DOMContentLoaded', () => verificarLogros());

window.PALOMA_LOGROS = {
  LOGROS,
  verificarLogros,
  obtenerProgreso,
  incrementarSaltos,
  incrementarEnemigoDerrotado,
  incrementarPalomaduken,
  registrarAreaDescubierta,
  registrarNPCConocido,
};

console.log('Sistema de logros v4 cargado - ' + Object.keys(LOGROS).length + ' logros');
