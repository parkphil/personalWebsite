(() => {
  const canvases = [...document.querySelectorAll('[data-study]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const sizes = new Map();
  const start = performance.now();
  let frame = 0;

  function dot(ctx,x,y,r,alpha,hue=235){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=`hsla(${hue},48%,55%,${alpha})`;ctx.fill()}
  function paint(canvas,time){
    const {w,h}=sizes.get(canvas);const ctx=canvas.getContext('2d');ctx.clearRect(0,0,w,h);
    const kind=canvas.dataset.study;
    if(kind==='analog'){
      const paths=12, steps=105;
      for(let path=0;path<paths;path++)for(let i=0;i<steps;i++){
        const u=i/(steps-1), x=w*u;
        const base=h*(.08+path*.077);
        const swell=Math.sin(u*5.8+path*.54+time*.24)*h*.045;
        const drift=Math.sin(u*13.5-path*.8-time*.32)*h*.013;
        const hand=Math.sin(i*2.37+path*7.1)*2.2;
        const y=base+swell+drift+hand;
        const clearing=Math.exp(-(((u-.5)/.25)**2+((y/h-.48)/.19)**2));
        const edge=Math.sin(Math.PI*u)**.55;
        const alpha=(.14+.15*Math.sin(u*5+path*.9)**2)*edge*(1-.88*clearing);
        const radius=.85+1.35*(.5+.5*Math.sin(i*1.81+path*3.7));
        dot(ctx,x,y,radius,alpha,216+path*4);
      }
    }else if(kind==='ribbon'){
      for(let band=-3;band<=3;band++)for(let i=0;i<70;i++){const u=i/69;const envelope=Math.sin(Math.PI*u)**1.3;const x=w*(.08+.84*u);const y=h*.74+envelope*(Math.sin(u*7+time*.4)*27+band*8);dot(ctx,x,y,band===0?1.9:1.35,Math.sin(Math.PI*u)*(band===0?.55:.26),220+u*40)}
    }else if(kind==='pulse'){
      for(let y=0;y<20;y++)for(let x=0;x<29;x++){const px=w*(.08+x*.03),py=h*(.39+y*.027),d=Math.hypot(x-14,y-10);const wave=Math.sin(d*.75-time*1.1);dot(ctx,px,py,1.1+Math.max(0,wave)*1.7,.08+Math.max(0,wave)*.25,224+x*.8)}
    }else if(kind==='orbit'){
      for(let ring=0;ring<5;ring++)for(let i=0;i<100;i++){const angle=i/100*Math.PI*2+time*.17*(ring%2?1:-1);const radius=w*(.18+ring*.026);const x=w*.5+Math.cos(angle)*radius;const y=h*.69+Math.sin(angle)*radius*.48;const front=(Math.sin(angle)+1)/2;dot(ctx,x,y,1+front*1.8,.07+front*.28,235+ring*7)}
    }else{
      for(let ring=0;ring<7;ring++)for(let i=0;i<75;i++){const angle=i/74*Math.PI*1.65+Math.PI*.67;const radius=w*(.055+ring*.032)+(reduced.matches?0:Math.sin(time*.5-ring*.5)*3);const x=w*.5+Math.cos(angle)*radius;const y=h*.7+Math.sin(angle)*radius*.72;dot(ctx,x,y,ring===0?1.8:1.25,.3-ring*.026,218+ring*6)}
    }
  }
  function resize(){for(const canvas of canvases){const box=canvas.getBoundingClientRect(),ratio=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(box.width*ratio);canvas.height=Math.round(box.height*ratio);canvas.getContext('2d').setTransform(ratio,0,0,ratio,0,0);sizes.set(canvas,{w:box.width,h:box.height});paint(canvas,0)}}
  function tick(now){if(document.hidden||reduced.matches){frame=0;return}const t=(now-start)/1000;for(const canvas of canvases)paint(canvas,t);frame=requestAnimationFrame(tick)}
  function sync(){cancelAnimationFrame(frame);frame=0;if(reduced.matches){for(const canvas of canvases)paint(canvas,0)}else if(!document.hidden)frame=requestAnimationFrame(tick)}
  addEventListener('resize',resize);document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);resize();sync();
})();
