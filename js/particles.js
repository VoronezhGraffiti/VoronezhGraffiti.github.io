(function(){
  // ambient particle layer - matches the original particles.json config exactly
  // (80 particles, #f9f3f4 fill, white links up to distance 200, speed 1)
  var canvas = document.getElementById('particles');
  var ctx = canvas.getContext('2d');
  var particles = [];
  var COUNT = 80;
  var LINK_DIST = 200;

  function resize(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  for (var i = 0; i < COUNT; i++){
    var angle = Math.random() * Math.PI * 2;
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: Math.cos(angle) * 0.5,
      vy: Math.sin(angle) * 0.5,
      r: 2,
      o: Math.random() * 0.5
    });
  }

  function step(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < particles.length; i++){
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x + p.r > canvas.width || p.x - p.r < 0) p.vx = -p.vx;
      if (p.y + p.r > canvas.height || p.y - p.r < 0) p.vy = -p.vy;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(249,243,244,' + p.o + ')';
      ctx.fill();
    }

    for (var a = 0; a < particles.length; a++){
      for (var b = a + 1; b < particles.length; b++){
        var dx = particles[a].x - particles[b].x;
        var dy = particles[a].y - particles[b].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DIST){
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.strokeStyle = 'rgba(255,255,255,' + (1 - dist / LINK_DIST) + ')';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(step);
  }

  step();
})();

(function(){
  var photos = [
    { n:'01', alt:'Two large stylized eyes painted across a brick wall, in ochre and brown tones.' },
    { n:'05', alt:'A sports car rendered in red and black spray paint over cracked concrete, with a small cartoon character in the corner.' },
    { n:'06', alt:"The tag \u201cMarco\u201d in orange and blue bubble lettering on a concrete wall in a cleared lot." },
    { n:'07', alt:'A yellow, red, and black bubble-letter piece on weathered brick, with looser tags scrawled beneath it.' },
    { n:'09', alt:'Green and yellow tags layered on brick, with red freehand scrawl underneath.' },
    { n:'10', alt:'A simple black line-art face sketched across old red brick.' },
    { n:'11', alt:'A pink, teal, and white bubble-letter tag against a dark wall.' },
    { n:'12', alt:'A painted skull with crossed paintbrushes, in red, yellow, and black.' },
    { n:'13', alt:'A stencilled Dalmatian, black spots on white, on bare concrete.' },
    { n:'14', alt:"A red and yellow piece ending in \u201c\u2026BOY,\u201d signed and dated 08.01.2014." },
    { n:'15', alt:'A green, multicolor tag on pale concrete, with dry brush at the base of the wall.' },
    { n:'16', alt:'A green bubble-letter tag on a dark wall, surrounded by smaller tags and doodled hearts.' },
    { n:'17', alt:'A black-and-white bubble-letter tag on peeling plaster, with new plant growth at its base.' },
    { n:'18', alt:"Black lettering reading \u201c\u041f\u0420\u0410\u0412\u0414\u0410\u201d (\u201ctruth\u201d) beside a stencilled question mark, with a blue tag below, photographed in snow." },
    { n:'02', alt:'A purple bubble-letter tag flecked with yellow dots, on a rough concrete wall, framed with a decorative photo border.' },
    { n:'03', alt:"The word \u201cGO\u201d in glossy blue bubble letters over a mustard-yellow and cream wall, with a small \u20181\u2019 tag beside it." },
    { n:'08', alt:'A basketball backboard repainted as a bright green, red, and orange abstract mural, hoop still attached.' },
    { n:'19', alt:'Large freestanding letter sculptures at a skate park, covered edge to edge in painted flowers, tags, and handprints.' },
    { n:'20', alt:'A realist mural of horses running across a wall, painted in warm browns and cream.' },
    { n:'21', alt:'A rainbow-colored ring tunnel installation leading down a wooden walkway.' }
  ];

  var current = 0;

  var elLeft = document.getElementById('peek-left');
  var elCenter = document.getElementById('peek-center');
  var elRight = document.getElementById('peek-right');
  var btnPrev = document.getElementById('car-prev');
  var btnNext = document.getElementById('car-next');
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lb-img');
  var lbCap = document.getElementById('lightbox-cap');
  var lbCount = document.getElementById('lightbox-count');

  function setImg(el, photo, fade){
    var img = el.querySelector('img');
    if (fade){
      img.style.opacity = '0';
      setTimeout(function(){
        img.src = 'images/' + photo.n + 's.jpg';
        img.alt = photo.alt;
        img.style.opacity = '1';
      }, 120);
    } else {
      img.src = 'images/' + photo.n + 's.jpg';
      img.alt = photo.alt;
    }
  }

  function preload(n){
    var img = new Image();
    img.src = 'images/' + n + 's.jpg';
  }

  function render(){
    var left = (current - 1 + photos.length) % photos.length;
    var right = (current + 1) % photos.length;
    setImg(elLeft, photos[left]);
    setImg(elCenter, photos[current], true);
    setImg(elRight, photos[right]);
    preload(photos[(left - 1 + photos.length) % photos.length].n);
    preload(photos[(right + 1) % photos.length].n);
  }

  function goPrev(){ current = (current - 1 + photos.length) % photos.length; render(); }
  function goNext(){ current = (current + 1) % photos.length; render(); }
  function activateCenter(){ openLightbox(current); }

  btnPrev.addEventListener('click', goPrev);
  btnNext.addEventListener('click', goNext);
  elLeft.addEventListener('click', goPrev);
  elRight.addEventListener('click', goNext);
  elCenter.addEventListener('click', activateCenter);

  function onActivateKey(handler){
    return function(e){
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar'){
        e.preventDefault();
        handler();
      }
    };
  }
  elLeft.addEventListener('keydown', onActivateKey(goPrev));
  elRight.addEventListener('keydown', onActivateKey(goNext));
  elCenter.addEventListener('keydown', onActivateKey(activateCenter));

  document.addEventListener('keydown', function(e){
    if (lb.classList.contains('open')) return;
    if (e.key === 'ArrowLeft') goPrev();
    if (e.key === 'ArrowRight') goNext();
  });

  render();
  document.getElementById('loading').style.display = 'none';

  function openLightbox(i){
    current = i;
    showCurrent();
    lb.classList.add('open');
  }
  function showCurrent(){
    var p = photos[current];
    lbImg.src = 'images/' + p.n + '.jpg';
    lbImg.alt = p.alt;
    lbCap.textContent = p.alt;
    lbCount.textContent = (current + 1) + ' / ' + photos.length;
  }
  function closeLightbox(){ lb.classList.remove('open'); render(); }
  function lbPrev(){ current = (current - 1 + photos.length) % photos.length; showCurrent(); }
  function lbNext(){ current = (current + 1) % photos.length; showCurrent(); }

  document.getElementById('lb-close').addEventListener('click', closeLightbox);
  document.getElementById('lb-prev').addEventListener('click', lbPrev);
  document.getElementById('lb-next').addEventListener('click', lbNext);
  lb.addEventListener('click', function(e){ if (e.target === lb) closeLightbox(); });
  document.addEventListener('keydown', function(e){
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lbPrev();
    if (e.key === 'ArrowRight') lbNext();
  });
})();