/* ============================================================
   INGER · Assistant conversationnel premium (acquisition)
   Bilingue FR / EN — suit le sélecteur de langue (#lang-switch / localStorage 'inger_lang').
   Autonome : injecte CSS + UI + logique. Évolutif : window.INGER_CHAT_ENDPOINT.
   ============================================================ */
(function () {
  "use strict";
  if (window.__ingerChat) return; window.__ingerChat = true;

  var CFG = {
    name: "Solim", org: "INGER Sarlu", wa: "22879790076",
    tel: "+22822501730", mail: "ingersarlu@inger.tg",
    endpoint: window.INGER_CHAT_ENDPOINT || null, delay: 520
  };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var lead = { type: "", besoin: "", nom: "", contact: "" };
  var ask = null;

  function getLang(){ var l=""; try{ l=localStorage.getItem("inger_lang")||""; }catch(e){}
    l = l || document.documentElement.lang || "fr"; return l.slice(0,2)==="en" ? "en" : "fr"; }

  /* ---------- Packs de langue ---------- */
  var S = {
    fr: {
      status:"En ligne · réponse rapide", fab:"Discuter avec "+CFG.name, foot:"INGER · Ingénieurs et Experts Réunis",
      ph:"Écrivez votre message…",
      g1:"Bonjour 👋 Je suis <b>"+CFG.name+"</b>, votre interlocuteur chez <b>INGER</b>.",
      gGen:"Ingénieurs-conseils en bâtiments, routes et hydraulique. Comment puis-je vous accompagner ?",
      mServices:"Découvrir vos services", mDevis:"Demander un devis", mFaq:"Questions fréquentes", mWa:"Parler sur WhatsApp",
      svcIntro:"Nous intervenons sur <b>trois pôles</b>, agréés État togolais (Cat. A2) — études et contrôle technique :",
      svc:{
        bat:{name:"Bâtiments & VRD",desc:"Immeubles IGH/ERP, sièges, hôtellerie & santé, équipements publics, habitats planifiés. Agrément n° 02 001."},
        route:{name:"Infrastructures routières",desc:"Routes, voiries urbaines, ouvrages d'art, drainage et signalisation. Agrément n° 06 001."},
        hydro:{name:"Hydraulique & Assainissement",desc:"Réseaux AEP, forages, réservoirs & châteaux d'eau, assainissement. Agrément n° 04 001."}
      },
      svcQ:"Souhaitez-vous être recontacté pour ce type de projet ?", cOther:"Un autre pôle", cWa:"WhatsApp",
      dStart:"Avec plaisir — 30 secondes pour préparer votre demande. Quel est le <b>type de projet</b> ?",
      dTypes:["Bâtiment","Route / Ouvrage","Hydraulique","Autre"],
      dBesoinQ:"Et votre <b>besoin</b> principal ?",
      dBesoins:["Étude","Contrôle de travaux","Conseil / Expertise","Je ne sais pas encore"], dBesoinX:"À définir",
      dNameQ:"Parfait. À quel <b>nom</b> dois-je préparer la demande ?",
      dContactQ:"Merci {n} ! Laissez-moi votre <b>e-mail ou téléphone</b> — notre équipe revient vers vous sous 24 h.",
      dInvalid:"Pouvez-vous préciser un e-mail ou un numéro valide ? (ex. nom@mail.com ou +228 …)",
      dFinish:"C'est noté ✅ Votre demande est transmise à nos ingénieurs. Pour une réponse <b>immédiate</b>, écrivez-nous sur WhatsApp :",
      cWaOpen:"Ouvrir WhatsApp", cMail:"Envoyer un e-mail", cDone:"Terminer", mMail:"E-mail",
      thanksMe:"Merci !", thanksBot:"Merci de votre confiance. À très vite chez <b>INGER</b>.",
      waBot:"Je vous ouvre WhatsApp 💬 Notre équipe vous répond directement.",
      faqIntro:"Voici les questions les plus posées :", faqHuman:"Parler à un humain",
      faqOther:"Autre question",
      faq:[
        {q:"Intervenez-vous hors du Togo ?",a:"Oui — au Togo, dans l'espace UEMOA, en Afrique subsaharienne et à l'international (Bénin, Burkina Faso…)."},
        {q:"Vos qualifications ?",a:"Bureau agréé par l'État togolais, catégorie A2 : Bâtiments n° 02 001, Hydraulique n° 04 001, Routes n° 06 001."},
        {q:"Travaillez-vous avec des bailleurs ?",a:"Oui : BOAD, BAD, BID, FED-UE, Banque Mondiale, FIDA, GAFSP, ainsi que des États et collectivités."},
        {q:"Comment obtenir un devis ?",a:"Via ce chat, le formulaire de contact, par téléphone, WhatsApp ou e-mail. Réponse adaptée sous 24 h."}
      ],
      hi:"Bonjour 👋 Comment puis-je vous aider ?",
      fallback:"Je peux vous orienter vers le bon service, répondre à vos questions ou préparer un devis. Que souhaitez-vous ?",
      nudge:"Besoin d'un conseil ou d'un devis ? Je suis là 👋",
      hooks:{ domains:"Vous explorez nos pôles d'expertise. Souhaitez-vous être orienté vers le bon service ?",
        refs:"Nos réalisations vous intéressent ? Je peux préparer un projet similaire pour vous.",
        portfolio:"Un projet vous inspire ? Demandons ensemble un devis adapté.",
        expertise:"Bureau agréé Cat. A2. Une question sur nos qualifications ?",
        faq:"Une question fréquente ? Je peux y répondre tout de suite.",
        contact:"Je peux préparer votre demande de devis en 30 secondes." },
      waHello:"Bonjour INGER, je viens de votre site.", waProj:"Projet", waNeed:"Besoin", waName:"Nom", waContact:"Contact"
    },
    en: {
      status:"Online · quick reply", fab:"Chat with "+CFG.name, foot:"INGER · Engineers & Experts United",
      ph:"Type your message…",
      g1:"Hello 👋 I'm <b>"+CFG.name+"</b>, your contact at <b>INGER</b>.",
      gGen:"Consulting engineers in buildings, roads and hydraulics. How can I help you?",
      mServices:"Discover our services", mDevis:"Request a quote", mFaq:"FAQ", mWa:"Chat on WhatsApp",
      svcIntro:"We operate across <b>three fields</b>, accredited by the Togolese State (Cat. A2) — studies and technical supervision:",
      svc:{
        bat:{name:"Buildings & earthworks",desc:"High-rise/public buildings, headquarters, hospitality & healthcare, public facilities, planned housing. Accreditation No. 02 001."},
        route:{name:"Road infrastructure",desc:"Roads, urban streets, bridges, drainage and signage. Accreditation No. 06 001."},
        hydro:{name:"Hydraulics & Sanitation",desc:"Water-supply networks, boreholes, reservoirs & water towers, sanitation. Accreditation No. 04 001."}
      },
      svcQ:"Would you like to be contacted about this type of project?", cOther:"Another field", cWa:"WhatsApp",
      dStart:"With pleasure — 30 seconds to prepare your request. What is the <b>project type</b>?",
      dTypes:["Building","Road / Structure","Hydraulics","Other"],
      dBesoinQ:"And your main <b>need</b>?",
      dBesoins:["Study","Works supervision","Consulting / Appraisal","Not sure yet"], dBesoinX:"To be defined",
      dNameQ:"Great. Under what <b>name</b> should I prepare the request?",
      dContactQ:"Thank you {n}! Leave your <b>email or phone</b> — our team will get back to you within 24h.",
      dInvalid:"Could you provide a valid email or number? (e.g. name@mail.com or +228 …)",
      dFinish:"All set ✅ Your request has been sent to our engineers. For an <b>immediate</b> reply, message us on WhatsApp:",
      cWaOpen:"Open WhatsApp", cMail:"Send an email", cDone:"Finish", mMail:"Email",
      thanksMe:"Thank you!", thanksBot:"Thank you for your trust. See you soon at <b>INGER</b>.",
      waBot:"Opening WhatsApp 💬 Our team will reply to you directly.",
      faqIntro:"Here are the most common questions:", faqHuman:"Talk to a human",
      faqOther:"Another question",
      faq:[
        {q:"Do you work outside Togo?",a:"Yes — in Togo, across the WAEMU area, in sub-Saharan Africa and internationally (Benin, Burkina Faso…)."},
        {q:"Your qualifications?",a:"Firm accredited by the Togolese State, category A2: Buildings No. 02 001, Hydraulics No. 04 001, Roads No. 06 001."},
        {q:"Do you work with funders?",a:"Yes: BOAD, AfDB, IsDB, EU-EDF, World Bank, IFAD, GAFSP, as well as States and local authorities."},
        {q:"How do I get a quote?",a:"Through this chat, the contact form, by phone, WhatsApp or email. Tailored reply within 24h."}
      ],
      hi:"Hello 👋 How can I help you?",
      fallback:"I can point you to the right service, answer your questions or prepare a quote. What would you like?",
      nudge:"Need advice or a quote? I'm here 👋",
      hooks:{ domains:"Exploring our fields of expertise? Shall I point you to the right service?",
        refs:"Interested in our projects? I can prepare a similar one for you.",
        portfolio:"Inspired by a project? Let's request a tailored quote together.",
        expertise:"Accredited firm, Cat. A2. Any question about our qualifications?",
        faq:"A common question? I can answer it right away.",
        contact:"I can prepare your quote request in 30 seconds." },
      waHello:"Hello INGER, I'm coming from your website.", waProj:"Project", waNeed:"Need", waName:"Name", waContact:"Contact"
    }
  };
  function t(){ return S[getLang()]; }

  /* ---------- Styles ---------- */
  var css = `
  #ic-fab,#ic-panel{font-family:var(--mono,'JetBrains Mono',monospace)}
  #ic-fab{position:fixed;right:22px;bottom:24px;z-index:1300;display:flex;align-items:center;gap:0;
    height:58px;width:58px;border:none;border-radius:40px;cursor:pointer;overflow:hidden;
    background:var(--ink,#15171C);color:var(--paper,#F8F6F0);
    box-shadow:0 18px 40px -16px rgba(36,52,68,.55),0 2px 6px rgba(36,52,68,.18);
    transition:width .45s var(--ease,cubic-bezier(.22,1,.36,1)),transform .3s,box-shadow .3s}
  #ic-fab:hover{width:200px;transform:translateY(-2px)}
  #ic-fab .ic-ic{min-width:58px;height:58px;display:grid;place-items:center}
  #ic-fab .ic-ic svg{width:24px;height:24px}
  #ic-fab .ic-tx{white-space:nowrap;font-size:12px;letter-spacing:.04em;opacity:0;
    transform:translateX(-6px);transition:opacity .3s,transform .3s;padding-right:20px}
  #ic-fab:hover .ic-tx{opacity:1;transform:none}
  #ic-fab .ic-dot{position:absolute;top:12px;right:13px;width:9px;height:9px;border-radius:50%;
    background:#7FB39C;box-shadow:0 0 0 3px var(--ink,#15171C)}
  #ic-fab.hide{opacity:0;pointer-events:none;transform:scale(.6)}
  #ic-nudge{position:fixed;right:24px;bottom:92px;z-index:1299;max-width:248px;
    background:var(--paper-2,#fff);color:var(--ink,#15171C);font-family:var(--sans,'Inter',sans-serif);
    font-size:13.5px;line-height:1.5;padding:13px 16px;border-radius:16px 16px 4px 16px;
    border:1px solid var(--line-d,rgba(24,26,31,.10));
    box-shadow:0 20px 46px -24px rgba(36,52,68,.5);opacity:0;transform:translateY(8px) scale(.97);
    transition:all .45s var(--ease,cubic-bezier(.22,1,.36,1));pointer-events:none}
  #ic-nudge.show{opacity:1;transform:none;pointer-events:auto;cursor:pointer}
  #ic-nudge .ic-x{position:absolute;top:-8px;right:-8px;width:22px;height:22px;border-radius:50%;
    background:var(--ink,#15171C);color:#fff;border:none;font-size:13px;cursor:pointer;line-height:1}
  #ic-panel{position:fixed;right:22px;bottom:24px;z-index:1301;width:380px;max-width:calc(100vw - 32px);
    height:600px;max-height:calc(100vh - 40px);display:flex;flex-direction:column;overflow:hidden;
    border-radius:22px;background:var(--paper,#F8F6F0);border:1px solid var(--line-d,rgba(24,26,31,.10));
    box-shadow:0 40px 90px -36px rgba(18,28,38,.6),0 2px 8px rgba(36,52,68,.14);
    opacity:0;transform:translateY(18px) scale(.98);pointer-events:none;
    transition:opacity .4s var(--ease,cubic-bezier(.22,1,.36,1)),transform .4s var(--ease,cubic-bezier(.22,1,.36,1))}
  #ic-panel.open{opacity:1;transform:none;pointer-events:auto}
  .ic-head{position:relative;padding:18px 18px 16px;display:flex;align-items:center;gap:13px;
    background:var(--ink,#15171C);color:var(--paper,#F8F6F0)}
  .ic-av{width:42px;height:42px;border-radius:50%;flex:none;display:grid;place-items:center;
    background:linear-gradient(140deg,var(--steel,#3E5C6E),var(--steel-glow,#2E4A5E));
    font-family:var(--serif,'Fraunces',serif);font-size:17px;color:#fff}
  .ic-h-tx{display:flex;flex-direction:column;line-height:1.25}
  .ic-h-tx .n{font-family:var(--serif,'Fraunces',serif);font-size:16px;letter-spacing:.01em}
  .ic-h-tx .s{font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;opacity:.7;
    display:flex;align-items:center;gap:6px;margin-top:2px}
  .ic-h-tx .s::before{content:"";width:6px;height:6px;border-radius:50%;background:#7FB39C}
  .ic-close{margin-left:auto;background:transparent;border:none;color:var(--paper,#F8F6F0);
    cursor:pointer;width:32px;height:32px;border-radius:50%;font-size:18px;opacity:.8;transition:.3s}
  .ic-close:hover{opacity:1;background:rgba(255,255,255,.1)}
  .ic-log{flex:1;overflow-y:auto;padding:20px 16px 6px;display:flex;flex-direction:column;gap:12px;scrollbar-width:thin}
  .ic-log::-webkit-scrollbar{width:6px}
  .ic-log::-webkit-scrollbar-thumb{background:rgba(24,26,31,.16);border-radius:6px}
  .ic-row{display:flex;max-width:86%}
  .ic-row.bot{align-self:flex-start}
  .ic-row.me{align-self:flex-end;justify-content:flex-end}
  .ic-b{font-family:var(--sans,'Inter',sans-serif);font-size:14px;line-height:1.55;
    padding:11px 15px;border-radius:16px;animation:icIn .4s var(--ease,ease) both}
  .ic-row.bot .ic-b{background:var(--paper-2,#fff);color:var(--ink,#15171C);
    border:1px solid var(--line-d,rgba(24,26,31,.10));border-bottom-left-radius:5px}
  .ic-row.me .ic-b{background:var(--steel,#3E5C6E);color:#fff;border-bottom-right-radius:5px}
  .ic-b a{color:inherit;text-decoration:underline;text-underline-offset:2px}
  @keyframes icIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
  .ic-type{display:inline-flex;gap:4px;padding:13px 15px}
  .ic-type i{width:6px;height:6px;border-radius:50%;background:rgba(24,26,31,.4);animation:icBlink 1.2s infinite}
  .ic-type i:nth-child(2){animation-delay:.18s}.ic-type i:nth-child(3){animation-delay:.36s}
  @keyframes icBlink{0%,60%,100%{opacity:.25;transform:translateY(0)}30%{opacity:1;transform:translateY(-3px)}}
  .ic-quick{display:flex;flex-wrap:wrap;gap:8px;padding:4px 16px 12px}
  .ic-chip{font-family:var(--mono,monospace);font-size:11.5px;letter-spacing:.02em;cursor:pointer;
    padding:9px 14px;border-radius:30px;background:transparent;color:var(--steel-glow,#2E4A5E);
    border:1px solid var(--line-d,rgba(24,26,31,.14));transition:all .3s var(--ease,ease);animation:icIn .4s both}
  .ic-chip:hover{background:var(--ink,#15171C);color:var(--paper,#F8F6F0);border-color:var(--ink,#15171C)}
  .ic-chip.wa{border-color:#25D366;color:#1a8a45}
  .ic-chip.wa:hover{background:#25D366;color:#fff;border-color:#25D366}
  .ic-form{display:flex;gap:8px;padding:12px 14px;border-top:1px solid var(--line-d,rgba(24,26,31,.10));background:var(--paper,#F8F6F0)}
  .ic-form input{flex:1;font-family:var(--sans,'Inter',sans-serif);font-size:14px;padding:11px 14px;border-radius:30px;
    border:1px solid var(--line-d,rgba(24,26,31,.16));background:var(--paper-2,#fff);color:var(--ink,#15171C);outline:none;transition:border .3s}
  .ic-form input:focus{border-color:var(--steel-l,#3E5C6E)}
  .ic-send{flex:none;width:42px;height:42px;border-radius:50%;border:none;cursor:pointer;
    background:var(--ink,#15171C);color:var(--paper,#F8F6F0);display:grid;place-items:center;transition:.3s}
  .ic-send:hover{background:var(--steel-glow,#2E4A5E)}
  .ic-send svg{width:18px;height:18px}
  .ic-foot{text-align:center;font-size:9.5px;letter-spacing:.08em;text-transform:uppercase;
    color:var(--concrete,#6B6860);padding:0 0 9px;background:var(--paper,#F8F6F0)}
  @media(max-width:600px){
    #ic-fab{right:16px;bottom:calc(env(safe-area-inset-bottom,0px) + 84px);height:52px;width:52px}
    #ic-fab .ic-ic{min-width:52px;height:52px}
    #ic-fab:hover{width:52px}#ic-fab .ic-tx{display:none}
    #ic-nudge{right:16px;bottom:calc(env(safe-area-inset-bottom,0px) + 146px)}
    #ic-panel{right:0;left:0;bottom:0;width:100%;max-width:100%;height:88vh;max-height:88vh;border-radius:20px 20px 0 0}
  }`;
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  /* ---------- DOM ---------- */
  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-12.3 7.4L3 21l2.1-5.6A8.4 8.4 0 1 1 21 11.5Z"/></svg>';
  var SEND = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h13M13 6l6 6-6 6"/></svg>';

  var fab = el('button', { id: "ic-fab", "aria-label": CFG.name });
  fab.innerHTML = '<span class="ic-ic">' + ICON + '</span><span class="ic-tx" id="ic-fabtx"></span><span class="ic-dot"></span>';

  var panel = el('div', { id: "ic-panel", role: "dialog", "aria-label": "Assistant INGER" });
  panel.innerHTML =
    '<div class="ic-head"><span class="ic-av">i</span>' +
    '<span class="ic-h-tx"><span class="n">' + CFG.name + ' · ' + CFG.org + '</span><span class="s" id="ic-status"></span></span>' +
    '<button class="ic-close" aria-label="Close">×</button></div>' +
    '<div class="ic-log" id="ic-log"></div>' +
    '<div class="ic-quick" id="ic-quick"></div>' +
    '<form class="ic-form" id="ic-form" autocomplete="on"><input id="ic-in" type="text" aria-label="Message"><button class="ic-send" type="submit" aria-label="Send">' + SEND + '</button></form>' +
    '<div class="ic-foot" id="ic-foot"></div>';

  var nudge = el('div', { id: "ic-nudge" });
  document.body.appendChild(fab); document.body.appendChild(panel); document.body.appendChild(nudge);

  var log = panel.querySelector("#ic-log"), quick = panel.querySelector("#ic-quick"),
      form = panel.querySelector("#ic-form"), input = panel.querySelector("#ic-in");

  function el(tag, a) { var e = document.createElement(tag); for (var k in a) e.setAttribute(k, a[k]); return e; }
  function scroll() { log.scrollTop = log.scrollHeight; }
  function esc(s){ return s.replace(/[<>]/g,function(c){return c==="<"?"&lt;":"&gt;";}); }
  function me(text){ var r=el('div',{class:"ic-row me"}); r.innerHTML='<div class="ic-b">'+esc(text)+'</div>'; log.appendChild(r); scroll(); }
  function typing(){ var r=el('div',{class:"ic-row bot"}); r.innerHTML='<div class="ic-b ic-type"><i></i><i></i><i></i></div>'; log.appendChild(r); scroll(); return r; }
  function bot(html, cb){ var ty=typing(); setTimeout(function(){ ty.remove();
    var r=el('div',{class:"ic-row bot"}); r.innerHTML='<div class="ic-b">'+html+'</div>'; log.appendChild(r); scroll(); if(cb) cb();
  }, reduce ? 60 : CFG.delay + Math.min(html.length*7,700)); }
  function chips(list){ quick.innerHTML="";
    list.forEach(function(c){ var b=el('button',{class:"ic-chip"+(c.wa?" wa":""),type:"button"}); b.textContent=c.label; b.onclick=c.act; quick.appendChild(b); });
  }
  function waLink(){ var T=t();
    var msg=T.waHello+(lead.type?" "+T.waProj+": "+lead.type+".":"")+(lead.besoin?" "+T.waNeed+": "+lead.besoin+".":"")+(lead.nom?" "+T.waName+": "+lead.nom+".":"")+(lead.contact?" "+T.waContact+": "+lead.contact+".":"");
    return "https://wa.me/"+CFG.wa+"?text="+encodeURIComponent(msg);
  }
  function pushLead(){ try{ var a=JSON.parse(localStorage.getItem("inger_leads")||"[]");
    a.push(Object.assign({ts:Date.now(),page:location.pathname+location.hash,lang:getLang()},lead)); localStorage.setItem("inger_leads",JSON.stringify(a)); }catch(e){}
    if(CFG.endpoint){ try{ fetch(CFG.endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(lead)}); }catch(e){} }
    if(typeof window.INGER_CHAT_ON_LEAD==="function") window.INGER_CHAT_ON_LEAD(lead);
  }

  /* ---------- Scénarios ---------- */
  function menu(){ var T=t(); chips([
    {label:T.mServices,act:services},{label:T.mDevis,act:devisStart},
    {label:T.mFaq,act:faqMenu},{label:T.mWa,wa:true,act:function(){me(T.mWa);openWA();}}
  ]); }
  function services(){ var T=t(); me(T.mServices);
    bot(T.svcIntro, function(){ chips([
      {label:T.svc.bat.name,act:function(){svc("bat");}},
      {label:T.svc.route.name,act:function(){svc("route");}},
      {label:T.svc.hydro.name,act:function(){svc("hydro");}}
    ]); });
  }
  function svc(key){ var T=t(), o=T.svc[key]; me(o.name); lead.type=o.name;
    bot("<b>"+o.name+"</b> — "+o.desc, function(){
      bot(T.svcQ, function(){ chips([
        {label:T.mDevis,act:devisStart},{label:T.cOther,act:services},{label:T.cWa,wa:true,act:function(){me(T.cWa);openWA();}}
      ]); });
    });
  }
  function devisStart(){ var T=t(); me(T.mDevis);
    bot(T.dStart, function(){ chips(T.dTypes.map(function(x){ return {label:x,act:function(){devType(x);}}; })); });
  }
  function devType(x){ var T=t(); me(x); lead.type=x;
    bot(T.dBesoinQ, function(){ chips(T.dBesoins.map(function(b,i){ return {label:b,act:function(){ devBesoin(i===3?T.dBesoinX:b); }}; })); });
  }
  function devBesoin(b){ var T=t(); me(b); lead.besoin=b; bot(T.dNameQ, function(){ ask="nom"; quick.innerHTML=""; input.focus(); }); }
  function askContact(){ var T=t(); bot(T.dContactQ.replace("{n}", lead.nom||""), function(){ ask="contact"; input.focus(); }); }
  function finish(){ var T=t(); pushLead();
    bot(T.dFinish, function(){ chips([
      {label:T.cWaOpen,wa:true,act:openWA},
      {label:T.cMail,act:function(){ me(T.mMail); window.location.href="mailto:"+CFG.mail+"?subject="+encodeURIComponent("INGER — "+T.mDevis)+"&body="+encodeURIComponent(T.waProj+": "+lead.type+"\n"+T.waNeed+": "+lead.besoin+"\n"+T.waName+": "+lead.nom+"\n"+T.waContact+": "+lead.contact); }},
      {label:T.cDone,act:function(){ me(T.thanksMe); bot(T.thanksBot, menu); }}
    ]); });
  }
  function openWA(){ var T=t(); window.open(waLink(),"_blank","noopener"); bot(T.waBot, menu); }

  function faqMenu(){ var T=t(); me(T.mFaq);
    bot(T.faqIntro, function(){
      var list=T.faq.map(function(f){ return {label:f.q, act:function(){ me(f.q); bot(f.a, faqMore); }}; });
      list.push({label:T.faqHuman,wa:true,act:function(){ me(T.faqHuman); openWA(); }});
      chips(list);
    });
  }
  function faqMore(){ var T=t(); chips([
    {label:T.faqOther,act:faqMenu},{label:T.mDevis,act:devisStart},{label:T.cWa,wa:true,act:openWA}
  ]); }

  /* ---------- Saisie libre ---------- */
  form.addEventListener("submit", function(e){ e.preventDefault(); var v=input.value.trim(); if(!v) return; input.value=""; me(v); var T=t();
    if(ask==="nom"){ lead.nom=v; ask=null; return askContact(); }
    if(ask==="contact"){ var ok=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)||/[+0-9][0-9 ().\-]{6,}/.test(v); lead.contact=v; ask=null;
      if(!ok) return bot(T.dInvalid, function(){ ask="contact"; }); return finish(); }
    route(v.toLowerCase());
  });
  function route(s){ var T=t();
    if(/devis|quote|prix|tarif|price|co[uû]t|estimat|offre/.test(s)) return devisStart();
    if(/whatsapp|appel|t[ée]l[ée]phone|phone|call|joindre|contact|num[ée]ro/.test(s)) return openWA();
    if(/b[aâ]timent|building|immeuble|igh|erp|construction|villa|h[oô]tel|hotel/.test(s)) return svc("bat");
    if(/route|road|voirie|vrd|pont|bridge|ouvrage|bitum/.test(s)) return svc("route");
    if(/eau|water|hydrau|aep|forage|borehole|assainiss|sanitation|r[ée]servoir|ch[aâ]teau/.test(s)) return svc("hydro");
    if(/togo|uemoa|waemu|[ée]tranger|abroad|international|hors|outside/.test(s)) return bot(T.faq[0].a, faqMore);
    if(/agr[ée]|qualif|cat[ée]gorie|category|certif/.test(s)) return bot(T.faq[1].a, faqMore);
    if(/bailleur|funder|financ|fund|boad|banque|bank|bad\b/.test(s)) return bot(T.faq[2].a, faqMore);
    if(/bonjour|salut|hello|hi|bonsoir|hey/.test(s)) return bot(T.hi, menu);
    bot(T.fallback, menu);
  }

  /* ---------- Ouverture / fermeture ---------- */
  var started=false;
  function applyStatic(){ var T=t();
    document.getElementById("ic-fabtx").textContent=T.fab;
    document.getElementById("ic-status").textContent=T.status;
    document.getElementById("ic-foot").textContent=T.foot;
    input.setAttribute("placeholder",T.ph);
  }
  function open(){ panel.classList.add("open"); fab.classList.add("hide"); hideNudge();
    if(!started){ started=true; greet(); }
    setTimeout(function(){ if(window.innerWidth>600) input.focus(); },300);
  }
  function close(){ panel.classList.remove("open"); fab.classList.remove("hide"); }
  fab.onclick=open; panel.querySelector(".ic-close").onclick=close;
  window.addEventListener("keydown", function(e){ if(e.key==="Escape") close(); });

  function greet(){ var T=t(); bot(T.g1, function(){ bot(pageHook()||T.gGen, menu); }); }

  function pageHook(){ var sec=currentSection(); return sec ? (t().hooks[sec]||null) : null; }
  function currentSection(){ var ids=["contact","faq","expertise","refs","portfolio","domains"];
    for(var i=0;i<ids.length;i++){ var el2=document.getElementById(ids[i]); if(!el2) continue;
      var r=el2.getBoundingClientRect(); if(r.top<window.innerHeight*0.6 && r.bottom>window.innerHeight*0.4) return ids[i]; }
    return null;
  }

  function showNudge(){ if(panel.classList.contains("open")||sessionStorage.getItem("ic_nudged")) return;
    var msg=pageHook()||t().nudge; nudge.innerHTML='<button class="ic-x" aria-label="x">×</button>'+msg;
    nudge.classList.add("show"); sessionStorage.setItem("ic_nudged","1");
    nudge.querySelector(".ic-x").onclick=function(e){ e.stopPropagation(); hideNudge(); }; nudge.onclick=open;
    setTimeout(hideNudge,12000);
  }
  function hideNudge(){ nudge.classList.remove("show"); }

  /* ---------- Réaction au changement de langue ---------- */
  document.querySelectorAll(".lang-opt").forEach(function(b){
    b.addEventListener("click", function(){ setTimeout(applyStatic, 30); });
  });

  applyStatic();
  setTimeout(showNudge, 9000);
})();
