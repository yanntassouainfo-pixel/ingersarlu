(function(){
  "use strict";
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Nav : scrolled ---------- */
  var nav = document.getElementById('nav');
  function onScroll(){ if(window.scrollY > 30) nav.classList.add('scrolled'); else nav.classList.remove('scrolled'); }
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();

  /* ---------- Menu mobile ---------- */
  var burger = document.getElementById('burger'), mmenu = document.getElementById('mmenu'), mclose = document.getElementById('mclose');
  function setMenu(open){
    if(!mmenu) return;
    mmenu.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if(burger) burger.addEventListener('click', function(){ setMenu(!mmenu.classList.contains('open')); });
  if(mclose) mclose.addEventListener('click', function(){ setMenu(false); });
  if(mmenu) mmenu.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ setMenu(false); }); });
  window.addEventListener('keydown', function(e){ if(e.key === 'Escape') setMenu(false); });

  /* ---------- Barre d'action flottante (mobile) ---------- */
  var abar = document.getElementById('actionbar');
  if(abar){
    var abarShown = false;
    var onAbar = function(){
      var y = window.scrollY, vh = window.innerHeight;
      var docH = document.documentElement.scrollHeight;
      var nearBottom = (y + vh) > (docH - 170);
      var pastHero = y > vh * 0.65;
      var show = pastHero && !nearBottom && !document.body.classList.contains('menu-open');
      if(show !== abarShown){ abar.classList.toggle('show', show); abarShown = show; }
    };
    window.addEventListener('scroll', onAbar, {passive:true});
    window.addEventListener('resize', onAbar, {passive:true});
    onAbar();
  }

  /* ---------- Reveal au scroll ---------- */
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {threshold:0.12, rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });

  /* ---------- Compteur de chiffres ---------- */
  function animCount(el){
    var target = parseInt(el.getAttribute('data-count'),10);
    var pad = parseInt(el.getAttribute('data-pad')||'0',10);
    var cv = el.querySelector('.cv'); var dur = 1500, start = null;
    function frame(t){
      if(!start) start = t; var p = Math.min((t-start)/dur,1);
      var ease = 1 - Math.pow(1-p,3);
      var val = Math.round(ease*target);
      cv.textContent = pad ? String(val).padStart(pad,'0') : val;
      if(p<1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  var counted = false;
  var cio = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting && !counted){
        counted = true;
        document.querySelectorAll('[data-count]').forEach(function(el){ reduce ? (el.querySelector('.cv').textContent = (parseInt(el.getAttribute('data-pad')||'0',10)? String(el.getAttribute('data-count')).padStart(2,'0'):el.getAttribute('data-count'))) : animCount(el); });
      }
    });
  }, {threshold:0.5});
  var firstStat = document.querySelector('[data-count]');
  if(firstStat) cio.observe(firstStat);

  /* ---------- FAQ accordéon ---------- */
  document.querySelectorAll('.faq-item').forEach(function(item){
    var q = item.querySelector('.faq-q'), a = item.querySelector('.faq-a');
    q.addEventListener('click', function(){
      var open = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function(o){ o.classList.remove('open'); o.querySelector('.faq-a').style.maxHeight = null; });
      if(!open){ item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; }
    });
  });

  /* ---------- Onglets références dynamiques + Voir tout ---------- */
  (function(){
    var tabs = document.querySelectorAll('.ref-tab');
    var panels = document.querySelectorAll('.ref-panel');
    if(!tabs.length || !panels.length) return;
    function activate(name){
      tabs.forEach(function(t){
        var on = t.getAttribute('data-panel') === name;
        t.classList.toggle('active', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      panels.forEach(function(p){
        var on = (p.id === 'rp-' + name);
        p.classList.toggle('active', on);
        if(!on){
          p.classList.remove('open');
          var b = p.querySelector('.ref-more');
          if(b) b.setAttribute('aria-expanded','false');
        }
      });
    }
    tabs.forEach(function(t){
      t.addEventListener('click', function(){ activate(t.getAttribute('data-panel')); });
    });
    document.querySelectorAll('.ref-more').forEach(function(btn){
      btn.addEventListener('click', function(){
        var panel = btn.closest('.ref-panel');
        if(!panel) return;
        var open = panel.classList.toggle('open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        if(!open){
          var top = panel.getBoundingClientRect().top + window.scrollY - 90;
          window.scrollTo({top: top, behavior: reduce ? 'auto' : 'smooth'});
        }
      });
    });
  })();

  /* ---------- Curseur custom + magnetic ---------- */
  if(!reduce && window.matchMedia('(hover:hover)').matches && window.innerWidth>860){
    var dot = document.querySelector('.cursor-dot'), ring = document.querySelector('.cursor-ring');
    var mx=0,my=0,rx=0,ry=0;
    window.addEventListener('mousemove', function(e){ mx=e.clientX; my=e.clientY; dot.style.transform='translate('+mx+'px,'+my+'px) translate(-50%,-50%)'; });
    function loop(){ rx+=(mx-rx)*0.18; ry+=(my-ry)*0.18; ring.style.transform='translate('+rx+'px,'+ry+'px) translate(-50%,-50%)'; requestAnimationFrame(loop); }
    loop();
    document.querySelectorAll('[data-cursor], a, button').forEach(function(el){
      el.addEventListener('mouseenter', function(){ ring.classList.add('hover'); });
      el.addEventListener('mouseleave', function(){ ring.classList.remove('hover'); });
    });
  }

  /* ---------- Parallaxe cartes hero ---------- */
  if(!reduce && window.innerWidth>980){
    var hv = document.querySelector('.hero-visual');
    var tilts = document.querySelectorAll('[data-tilt]');
    if(hv){
      hv.addEventListener('mousemove', function(e){
        var r = hv.getBoundingClientRect();
        var px = (e.clientX - r.left)/r.width - 0.5;
        var py = (e.clientY - r.top)/r.height - 0.5;
        tilts.forEach(function(c,i){
          var depth = (i+1)*6;
          c.style.transform = 'translate('+(px*depth)+'px,'+(py*depth)+'px) rotateX('+(-py*4)+'deg) rotateY('+(px*5)+'deg)';
        });
      });
      hv.addEventListener('mouseleave', function(){ tilts.forEach(function(c){ c.style.transform=''; }); });
    }
  }

  /* ---------- Parallaxe glows hero au scroll ---------- */
  if(!reduce){
    var glowA = document.querySelector('.hero-bg .glowA'), glowB = document.querySelector('.hero-bg .glowB');
    window.addEventListener('scroll', function(){
      var y = window.scrollY;
      if(y < window.innerHeight){
        if(glowA) glowA.style.transform = 'translateY('+(y*0.18)+'px)';
        if(glowB) glowB.style.transform = 'translateY('+(y*-0.10)+'px)';
      }
    }, {passive:true});
  }

  /* ---------- Smooth scroll ancres ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      var id = a.getAttribute('href'); if(id.length<2) return;
      var t = document.querySelector(id);
      if(t){ e.preventDefault(); window.scrollTo({top: t.getBoundingClientRect().top + window.scrollY - 76, behavior: reduce?'auto':'smooth'}); }
    });
  });

  /* ---------- Lightbox projets : zoom shared-element ---------- */
  var lb = document.getElementById('lightbox');
  if(lb){
    var lbFig = lb.querySelector('.lb-fig'),
        lbImg = lb.querySelector('.lb-img'),
        lbCat = lb.querySelector('.lb-cat'),
        lbName = lb.querySelector('.lb-name'),
        lbPrev = lb.querySelector('.lb-prev'),
        lbNext = lb.querySelector('.lb-next'),
        lbCloseT = null, navT = null,
        cards = Array.prototype.slice.call(document.querySelectorAll('.pf-card')),
        cur = -1;

    function openLB(card){
      var img = card.querySelector('.slot-img'); if(!img) return;
      var catEl = card.querySelector('.pf-cat'), nameEl = card.querySelector('.pf-name');
      clearTimeout(lbCloseT);
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = img.alt || '';
      lbCat.textContent = catEl ? catEl.textContent : '';
      lbName.textContent = nameEl ? nameEl.textContent : '';
      var s = img.getBoundingClientRect();
      lb.classList.add('open');
      document.body.classList.add('lb-on');
      document.body.style.overflow = 'hidden';

      if(reduce){ requestAnimationFrame(function(){ lb.classList.add('show'); }); return; }

      var place = function(){
        // état naturel pour mesurer la cible
        lbFig.style.transition = 'none';
        lbFig.style.transform = 'none';
        lbFig.style.opacity = '1';
        var t = lbFig.getBoundingClientRect();
        if(!t.width || !t.height){ requestAnimationFrame(place); return; }
        var scale = s.width / t.width;
        var dx = (s.left + s.width/2) - (t.left + t.width/2);
        var dy = (s.top + s.height/2) - (t.top + t.height/2);
        lbFig.style.transformOrigin = 'center center';
        lbFig.style.transform = 'translate('+dx+'px,'+dy+'px) scale('+scale+')';
        lbFig.style.opacity = '.55';
        lbFig.getBoundingClientRect(); // reflow
        lb.classList.add('show');
        lbFig.style.transition = 'transform .6s var(--ease), opacity .45s ease';
        requestAnimationFrame(function(){
          lbFig.style.transform = 'none';
          lbFig.style.opacity = '1';
        });
      };
      if(lbImg.complete && lbImg.naturalWidth){ place(); }
      else { lbImg.onload = place; }
    }

    function closeLB(){
      if(!lb.classList.contains('open')) return;
      lb.classList.remove('show');
      if(reduce){
        lb.classList.remove('open'); document.body.classList.remove('lb-on'); document.body.style.overflow=''; return;
      }
      lbFig.style.transition = 'transform .4s var(--ease), opacity .4s ease';
      lbFig.style.transform = 'scale(.93)';
      lbFig.style.opacity = '0';
      lbCloseT = setTimeout(function(){
        lb.classList.remove('open');
        document.body.classList.remove('lb-on');
        document.body.style.overflow = '';
        lbFig.style.transition = 'none';
        lbFig.style.transform = 'none';
        lbFig.style.opacity = '1';
        lbImg.removeAttribute('src');
      }, 420);
    }

    function navLB(step){
      if(!lb.classList.contains('open') || !cards.length) return;
      cur = (cur + step + cards.length) % cards.length;
      var card = cards[cur], img = card.querySelector('.slot-img'); if(!img) return;
      var catEl = card.querySelector('.pf-cat'), nameEl = card.querySelector('.pf-name'), dir = step>0?1:-1;
      var setContent = function(){
        lbImg.src = img.currentSrc || img.src; lbImg.alt = img.alt || '';
        lbCat.textContent = catEl ? catEl.textContent : ''; lbName.textContent = nameEl ? nameEl.textContent : '';
      };
      if(reduce){ setContent(); return; }
      lbFig.style.transition = 'opacity .2s ease, transform .28s var(--ease)';
      lbFig.style.opacity = '0'; lbFig.style.transform = 'translateX(' + (dir*26) + 'px)';
      clearTimeout(navT);
      navT = setTimeout(function(){
        setContent();
        var show = function(){
          lbFig.style.transform = 'translateX(' + (-dir*26) + 'px)'; lbFig.getBoundingClientRect();
          lbFig.style.transition = 'opacity .26s ease, transform .4s var(--ease)';
          requestAnimationFrame(function(){ lbFig.style.opacity = '1'; lbFig.style.transform = 'none'; });
        };
        if(lbImg.complete && lbImg.naturalWidth){ show(); } else { lbImg.onload = show; }
      }, 190);
    }

    cards.forEach(function(card){
      card.addEventListener('click', function(){ cur = cards.indexOf(card); openLB(card); });
    });
    if(lbPrev) lbPrev.addEventListener('click', function(e){ e.stopPropagation(); navLB(-1); });
    if(lbNext) lbNext.addEventListener('click', function(e){ e.stopPropagation(); navLB(1); });
    lb.addEventListener('click', function(e){
      if(e.target === lb || e.target.closest('.lb-close')) closeLB();
    });
    window.addEventListener('keydown', function(e){
      if(!lb.classList.contains('open')) return;
      if(e.key === 'Escape') closeLB();
      else if(e.key === 'ArrowLeft'){ e.preventDefault(); navLB(-1); }
      else if(e.key === 'ArrowRight'){ e.preventDefault(); navLB(1); }
    });
  }

  /* ---------- Filigrane géométrique du hero (nombre d'or) ---------- */
  (function(){
    var dyn = document.getElementById('heroFilDyn');
    if(!dyn) return;
    var NS = 'http://www.w3.org/2000/svg';
    function E(p,a){ var e=document.createElementNS(NS,p); for(var k in a) e.setAttribute(k,a[k]); return e; }
    function golden(gx,gy,gw,gh){
      dyn.appendChild(E('rect',{x:gx,y:gy,width:gw,height:gh,'stroke-width':.6}));
      for(var i=0;i<8;i++){
        if(gw>=gh){ var s=gh; dyn.appendChild(E('line',{x1:gx+s,y1:gy,x2:gx+s,y2:gy+gh,'stroke-width':.5})); gx+=s; gw-=s; }
        else { var s=gw; dyn.appendChild(E('line',{x1:gx,y1:gy+s,x2:gx+gw,y2:gy+s,'stroke-width':.5})); gy+=s; gh-=s; }
        if(gw<2||gh<2) break;
      }
    }
    function spiral(cx,cy,a,phase,turns,sw){
      var b=Math.log(1.618)/(Math.PI/2), d='';
      for(var t=0;t<=turns;t+=.15){ var r=a*Math.exp(b*t); d+=(t===0?'M':'L')+(cx+r*Math.cos(t+phase)).toFixed(1)+' '+(cy+r*Math.sin(t+phase)).toFixed(1); }
      dyn.appendChild(E('path',{d:d,'stroke-width':sw}));
    }
    function poly(cx,cy,r){
      var pts=[]; for(var k=0;k<5;k++){ var ang=-Math.PI/2+k*2*Math.PI/5; pts.push((cx+r*Math.cos(ang)).toFixed(1)+','+(cy+r*Math.sin(ang)).toFixed(1)); }
      dyn.appendChild(E('circle',{cx:cx,cy:cy,r:r,'stroke-width':.6}));
      dyn.appendChild(E('polygon',{points:pts.join(' '),'stroke-width':.6}));
      var o=[0,2,4,1,3], st=[]; for(var k=0;k<5;k++) st.push(pts[o[k]]);
      dyn.appendChild(E('polygon',{points:st.join(' '),'stroke-width':.5}));
    }
    golden(150,150,246,152);
    spiral(338,226,3.4,2.4,15.2,1.1);
    spiral(560,330,1.6,0.6,12,.7);
    dyn.appendChild(E('circle',{cx:338,cy:226,r:168,'stroke-width':.5}));
  })();

  /* ---------- Portfolio : Voir plus / Voir moins (desktop) ---------- */
  (function(){
    var grid = document.querySelector('.pf-grid');
    var btn  = document.querySelector('.pf-loadmore');
    var wrap = document.querySelector('.pf-loadmore-wrap');
    if(!grid || !btn || !wrap) return;
    var cards = Array.prototype.slice.call(grid.querySelectorAll('.pf-card'));
    var INIT = 4, STEP = 4, shown = INIT;
    var mq = window.matchMedia('(min-width:769px)');
    var L = { fr:{more:'Voir plus de projets', less:'Voir moins'}, en:{more:'Show more projects', less:'Show less'} };
    var tx = btn.querySelector('.pm-t');
    function lang(){ var l=''; try{ l=localStorage.getItem('inger_lang')||''; }catch(e){} l=l||document.documentElement.lang||'fr'; return l.slice(0,2)==='en'?'en':'fr'; }
    function label(){ var full = shown>=cards.length; tx.textContent = L[lang()][full?'less':'more']; btn.classList.toggle('full', full); btn.setAttribute('aria-expanded', full?'true':'false'); }
    function setInit(){
      if(!mq.matches){ cards.forEach(function(c){ c.classList.remove('pf-hidden','pf-out','pf-reveal'); }); grid.classList.remove('pf-collapsed'); wrap.style.display='none'; return; }
      wrap.style.display='';
      cards.forEach(function(c,i){ c.classList.remove('pf-out','pf-reveal'); if(i<INIT){ c.classList.remove('pf-hidden'); } else { c.classList.add('pf-hidden'); } });
      shown = INIT; grid.classList.add('pf-collapsed'); label();
    }
    function more(){
      grid.classList.remove('pf-collapsed');
      var next = Math.min(shown+STEP, cards.length);
      for(var i=shown;i<next;i++){ (function(c){
        c.classList.remove('pf-hidden','pf-out'); c.classList.add('in','pf-reveal');
        c.addEventListener('animationend', function h(){ c.classList.remove('pf-reveal'); c.removeEventListener('animationend',h); });
      })(cards[i]); }
      shown = next; label();
    }
    function less(){
      for(var i=INIT;i<cards.length;i++){ (function(c){
        if(reduce){ c.classList.add('pf-hidden'); return; }
        c.classList.add('pf-out');
        setTimeout(function(){ c.classList.add('pf-hidden'); c.classList.remove('pf-out'); }, 340);
      })(cards[i]); }
      shown = INIT; grid.classList.add('pf-collapsed'); label();
      var sec = document.getElementById('portfolio');
      if(sec){ var y = sec.getBoundingClientRect().top + window.scrollY - 70; window.scrollTo({top:y, behavior: reduce?'auto':'smooth'}); }
    }
    btn.addEventListener('click', function(){ if(shown>=cards.length) less(); else more(); });
    if(mq.addEventListener) mq.addEventListener('change', setInit); else if(mq.addListener) mq.addListener(setInit);
    document.querySelectorAll('.lang-opt').forEach(function(b){ b.addEventListener('click', function(){ setTimeout(label,30); }); });
    setInit();
  })();
})();
