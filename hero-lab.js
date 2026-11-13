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
    if(kind==='gesture'){
      const marks=[
        [.10,.38,.11,-.48,210], [.25,.22,.09,.58,175], [.39,.35,.08,-.42,150],
        [.60,.18,.10,.64,175], [.78,.32,.10,-.5,165], [.92,.21,.08,.42,135],
        [.14,.78,.09,.55,150], [.36,.84,.08,-.45,125], [.67,.80,.10,.5,160], [.88,.75,.08,-.55,150]
      ];
      const noise=(n)=>{const v=Math.sin(n*127.1)*43758.5453;return v-Math.floor(v)};
      marks.forEach(([cx,cy,length,tilt,count],m)=>{
        const sway=Math.sin(time*.35+m*1.7)*w*.006;
        for(let i=0;i<count;i++){
          const u=noise(i*7+m*233),v=noise(i*13+m*379);
          const t=(u-.5)*2, widthProfile=Math.max(.05,1-Math.abs(t));
          const along=t*length*w;
          const lateral=(v-.5)*2*widthProfile*w*.014;
          const angle=tilt;
          const x=cx*w+along*Math.cos(angle)-lateral*Math.sin(angle)+sway;
          const y=cy*h+along*Math.sin(angle)+lateral*Math.cos(angle)+Math.sin(time*.3+m)*h*.005;
          const clearance=Math.hypot((x/w-.5)/.31,(y/h-.55)/.18);
          if(clearance<1)continue;
          const radius=.65+noise(i*19+m*101)*1.05;
          const alpha=.25+noise(i*23+m*97)*.58;
          ctx.beginPath();ctx.arc(x,y,radius,0,Math.PI*2);ctx.fillStyle=`rgba(21,22,24,${alpha})`;ctx.fill();
        }
      });
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
