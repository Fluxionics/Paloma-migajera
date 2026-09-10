const SVG_SYSTEM = (() => {
  const svgCache = new Map();
  
  function createSVGElement(tag, attributes = {}) {
    const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value);
    }
    return element;
  }
  
  function createSVG(width, height, viewBox = `0 0 ${width} ${height}`) {
    const svg = createSVGElement('svg', {
      width: width,
      height: height,
      viewBox: viewBox,
      xmlns: 'http://www.w3.org/2000/svg'
    });
    return svg;
  }
  
  function svgToCanvas(svg, width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
    };
    img.src = url;
    
    return canvas;
  }
  
  function createGradient(defs, id, type, stops) {
    const gradient = createSVGElement(type, { id: id });
    stops.forEach(stop => {
      const stopElement = createSVGElement('stop', {
        offset: stop.offset,
        'stop-color': stop.color,
        'stop-opacity': stop.opacity || 1
      });
      gradient.appendChild(stopElement);
    });
    defs.appendChild(gradient);
    return gradient;
  }
  
  function createPigeonSVG(state = 'idle', facing = 1) {
    const svg = createSVG(30, 28);
    const defs = createSVGElement('defs');
    svg.appendChild(defs);
    
    // Gradients
    createGradient(defs, 'bodyGrad', 'linearGradient', [
      { offset: '0%', color: '#f6f6ff' },
      { offset: '55%', color: '#eaeaf8' },
      { offset: '100%', color: '#c4c6e6' }
    ]);
    
    createGradient(defs, 'wingGrad', 'linearGradient', [
      { offset: '0%', color: '#c0c8e8' },
      { offset: '100%', color: '#8a90c0' }
    ]);
    
    const group = createSVGElement('g', {
      transform: facing < 0 ? 'scale(-1, 1) translate(-30, 0)' : ''
    });
    
    // Body shadow
    const shadow = createSVGElement('path', {
      d: 'M1,12 h9 v6 h-9 z M13,19 h6 v8 h-6 z M7,6 h18 v15 h-18 z M11,-2 h15 v11 h-15 z M12,5 h11 v3 h-11 z',
      fill: '#26263a',
      opacity: '0.3'
    });
    group.appendChild(shadow);
    
    // Tail
    const tail = createSVGElement('path', {
      d: 'M2,13 h7 v4 h-7 z',
      fill: '#7a80b4'
    });
    group.appendChild(tail);
    
    // Wing
    const wingPath = state === 'fly' || state === 'glide' 
      ? 'M10,7 h5 v8 h-5 z'
      : state === 'jump' || state === 'wallslide'
      ? 'M10,8 h4 v8 h-4 z'
      : 'M10,10 h4 v5 h-4 z';
    
    const wing = createSVGElement('path', {
      d: wingPath,
      fill: 'url(#wingGrad)'
    });
    group.appendChild(wing);
    
    // Feet
    const feetPath = state === 'fly' || state === 'jump'
      ? 'M13,20 h2 v3 h-2 z M19,20 h2 v3 h-2 z'
      : 'M13,20 h2 v5 h-2 z M19,20 h2 v5 h-2 z';
    
    const feet = createSVGElement('path', {
      d: feetPath,
      fill: '#e0a838'
    });
    group.appendChild(feet);
    
    // Body
    const body = createSVGElement('rect', {
      x: 8, y: 7, width: 15, height: 13,
      fill: 'url(#bodyGrad)',
      rx: 2
    });
    group.appendChild(body);
    
    // Head
    const head = createSVGElement('ellipse', {
      cx: 18, cy: 4, rx: 6, ry: 4,
      fill: '#eef0ff'
    });
    group.appendChild(head);
    
    // Eye
    const eye = createSVGElement('circle', {
      cx: 22, cy: 3, r: 2,
      fill: '#14141e'
    });
    group.appendChild(eye);
    
    const eyeHighlight = createSVGElement('circle', {
      cx: 23, cy: 2, r: 0.5,
      fill: '#ffffff'
    });
    group.appendChild(eyeHighlight);
    
    // Beak
    const beak = createSVGElement('path', {
      d: 'M23,2 h6 v2 h-6 z M23,4 h5 v2 h-5 z',
      fill: '#e8c040'
    });
    group.appendChild(beak);
    
    svg.appendChild(group);
    return svg;
  }
  
  function createCatSVG(aggro = false) {
    const svg = createSVG(28, 24);
    const defs = createSVGElement('defs');
    svg.appendChild(defs);
    
    const bodyColor = aggro ? '#808070' : '#605868';
    const headColor = aggro ? '#a0a090' : '#787088';
    const eyeColor = aggro ? '#ff3030' : '#ff7070';
    
    // Body
    const body = createSVGElement('rect', {
      x: 6, y: 8, width: 16, height: 14,
      fill: bodyColor,
      rx: 3
    });
    svg.appendChild(body);
    
    // Head
    const head = createSVGElement('rect', {
      x: 7, y: 0, width: 14, height: 9,
      fill: headColor,
      rx: 4
    });
    svg.appendChild(head);
    
    // Ears
    const leftEar = createSVGElement('path', {
      d: 'M6,-2 h4 v4 h-4 z',
      fill: bodyColor
    });
    svg.appendChild(leftEar);
    
    const rightEar = createSVGElement('path', {
      d: 'M18,-2 h4 v4 h-4 z',
      fill: bodyColor
    });
    svg.appendChild(rightEar);
    
    // Ear tips
    const leftEarTip = createSVGElement('rect', {
      x: 7, y: -1, width: 2, height: 2,
      fill: '#c06060'
    });
    svg.appendChild(leftEarTip);
    
    const rightEarTip = createSVGElement('rect', {
      x: 19, y: -1, width: 2, height: 2,
      fill: '#c06060'
    });
    svg.appendChild(rightEarTip);
    
    // Eyes
    const leftEye = createSVGElement('rect', {
      x: 9, y: 3, width: 4, height: 3,
      fill: eyeColor,
      rx: 1
    });
    svg.appendChild(leftEye);
    
    const rightEye = createSVGElement('rect', {
      x: 15, y: 3, width: 4, height: 3,
      fill: eyeColor,
      rx: 1
    });
    svg.appendChild(rightEye);
    
    // Pupils
    const leftPupil = createSVGElement('rect', {
      x: 10, y: 4, width: 2, height: 2,
      fill: '#080808'
    });
    svg.appendChild(leftPupil);
    
    const rightPupil = createSVGElement('rect', {
      x: 16, y: 4, width: 2, height: 2,
      fill: '#080808'
    });
    svg.appendChild(rightPupil);
    
    return svg;
  }
  
  function createRatSVG() {
    const svg = createSVG(20, 16);
    
    // Tail
    const tail = createSVGElement('path', {
      d: 'M1,8 h5 v2 h-5 z M3,6 h3 v2 h-3 z',
      fill: '#5a4030'
    });
    svg.appendChild(tail);
    
    // Body
    const body = createSVGElement('rect', {
      x: 4, y: 4, width: 12, height: 10,
      fill: '#3a301e',
      rx: 3
    });
    svg.appendChild(body);
    
    // Head
    const head = createSVGElement('rect', {
      x: 14, y: 3, width: 6, height: 6,
      fill: '#4a3828',
      rx: 2
    });
    svg.appendChild(head);
    
    // Ears
    const leftEar = createSVGElement('rect', {
      x: 13, y: 0, width: 3, height: 3,
      fill: '#2a2012'
    });
    svg.appendChild(leftEar);
    
    const rightEar = createSVGElement('rect', {
      x: 17, y: 0, width: 3, height: 3,
      fill: '#2a2012'
    });
    svg.appendChild(rightEar);
    
    // Eyes
    const leftEye = createSVGElement('rect', {
      x: 15, y: 4, width: 2, height: 2,
      fill: '#ff4040'
    });
    svg.appendChild(leftEye);
    
    const rightEye = createSVGElement('rect', {
      x: 19, y: 4, width: 2, height: 2,
      fill: '#ff4040'
    });
    svg.appendChild(rightEye);
    
    return svg;
  }
  
  function createCrowSVG(aggro = false) {
    const svg = createSVG(26, 24);
    
    const eyeColor = aggro ? '#c060ff' : '#8040c0';
    
    // Wings
    const leftWing = createSVGElement('rect', {
      x: 3, y: 6, width: 6, height: 10,
      fill: '#202028',
      rx: 2
    });
    svg.appendChild(leftWing);
    
    const rightWing = createSVGElement('rect', {
      x: 17, y: 6, width: 6, height: 10,
      fill: '#202028',
      rx: 2
    });
    svg.appendChild(rightWing);
    
    // Body
    const body = createSVGElement('rect', {
      x: 6, y: 4, width: 14, height: 16,
      fill: '#181822',
      rx: 3
    });
    svg.appendChild(body);
    
    // Head
    const head = createSVGElement('rect', {
      x: 8, y: 0, width: 10, height: 8,
      fill: '#181822',
      rx: 2
    });
    svg.appendChild(head);
    
    // Head feathers
    const feathers = createSVGElement('path', {
      d: 'M9,-3 h2 v5 h-2 z M12,-5 h2 v7 h-2 z M15,-3 h2 v4 h-2 z',
      fill: '#2a2838'
    });
    svg.appendChild(feathers);
    
    // Beak
    const beak = createSVGElement('path', {
      d: 'M16,2 h6 v3 h-6 z M16,5 h5 v2 h-5 z',
      fill: '#a08020'
    });
    svg.appendChild(beak);
    
    // Eye
    const eye = createSVGElement('rect', {
      x: 11, y: 2, width: 3, height: 3,
      fill: eyeColor,
      rx: 1
    });
    svg.appendChild(eye);
    
    return svg;
  }
  
  function createMigajaSVG(size = 1) {
    const sizeMap = { 1: 8, 2: 10, 5: 12 };
    const w = sizeMap[size] || 8;
    const svg = createSVG(w, w);
    
    const main = createSVGElement('rect', {
      x: 1, y: 2, width: w - 2, height: w - 4,
      fill: '#c09028',
      rx: 2
    });
    svg.appendChild(main);
    
    const highlight = createSVGElement('rect', {
      x: 2, y: 3, width: w - 4, height: w - 6,
      fill: '#e8c840',
      rx: 1
    });
    svg.appendChild(highlight);
    
    const center = createSVGElement('rect', {
      x: w/2 - 1, y: w/2 - 1, width: 2, height: 2,
      fill: '#f8e060'
    });
    svg.appendChild(center);
    
    return svg;
  }
  
  function createHeartSVG() {
    const svg = createSVG(12, 12);
    
    const leftHeart = createSVGElement('rect', {
      x: 1, y: 3, width: 3, height: 3,
      fill: '#c03030',
      rx: 1
    });
    svg.appendChild(leftHeart);
    
    const rightHeart = createSVGElement('rect', {
      x: 8, y: 3, width: 3, height: 3,
      fill: '#c03030',
      rx: 1
    });
    svg.appendChild(rightHeart);
    
    const bottom = createSVGElement('rect', {
      x: 2, y: 5, width: 8, height: 5,
      fill: '#c03030',
      rx: 2
    });
    svg.appendChild(bottom);
    
    const highlightLeft = createSVGElement('rect', {
      x: 2, y: 4, width: 3, height: 3,
      fill: '#f06060',
      rx: 1
    });
    svg.appendChild(highlightLeft);
    
    const highlightRight = createSVGElement('rect', {
      x: 7, y: 4, width: 3, height: 3,
      fill: '#f06060',
      rx: 1
    });
    svg.appendChild(highlightRight);
    
    return svg;
  }
  
  function createEnergySVG() {
    const svg = createSVG(10, 14);
    
    const top = createSVGElement('rect', {
      x: 3, y: 2, width: 4, height: 3,
      fill: '#ffe060',
      rx: 1
    });
    svg.appendChild(top);
    
    const middle = createSVGElement('rect', {
      x: 2, y: 5, width: 6, height: 3,
      fill: '#ffe060',
      rx: 1
    });
    svg.appendChild(middle);
    
    const bottom = createSVGElement('rect', {
      x: 3, y: 8, width: 5, height: 2,
      fill: '#ffe060',
      rx: 1
    });
    svg.appendChild(bottom);
    
    const highlight = createSVGElement('rect', {
      x: 3, y: 3, width: 2, height: 2,
      fill: '#fff8a0'
    });
    svg.appendChild(highlight);
    
    return svg;
  }
  
  function getSVG(type, ...args) {
    const cacheKey = `${type}_${args.join('_')}`;
    if (svgCache.has(cacheKey)) {
      return svgCache.get(cacheKey);
    }
    
    let svg;
    switch (type) {
      case 'pigeon':
        svg = createPigeonSVG(...args);
        break;
      case 'cat':
        svg = createCatSVG(...args);
        break;
      case 'rat':
        svg = createRatSVG(...args);
        break;
      case 'crow':
        svg = createCrowSVG(...args);
        break;
      case 'migaja':
        svg = createMigajaSVG(...args);
        break;
      case 'heart':
        svg = createHeartSVG(...args);
        break;
      case 'energy':
        svg = createEnergySVG(...args);
        break;
      default:
        return null;
    }
    
    svgCache.set(cacheKey, svg);
    return svg;
  }
  
  function clearCache() {
    svgCache.clear();
  }
  
  return {
    getSVG,
    svgToCanvas,
    createSVG,
    createSVGElement,
    clearCache
  };
})();

window.SVG_SYSTEM = SVG_SYSTEM;