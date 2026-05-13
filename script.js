// ===== CURSOR =====
const cursor = document.getElementById('cursor');
const trail = document.getElementById('cursor-trail');
let mx=0,my=0,tx=0,ty=0;
document.addEventListener('mousemove',e=>{
  mx=e.clientX; my=e.clientY;
  cursor.style.left=mx+'px'; cursor.style.top=my+'px';
});
function animateTrail(){
  tx+=(mx-tx)*.12; ty+=(my-ty)*.12;
  trail.style.left=tx+'px'; trail.style.top=ty+'px';
  requestAnimationFrame(animateTrail);
}
animateTrail();
document.querySelectorAll('a,button,.skill-card,.stat-card,.project-card,.achievement-card').forEach(el=>{
  el.addEventListener('mouseenter',()=>{cursor.style.transform='translate(-50%,-50%) scale(2)';trail.style.transform='translate(-50%,-50%) scale(1.5)';});
  el.addEventListener('mouseleave',()=>{cursor.style.transform='translate(-50%,-50%) scale(1)';trail.style.transform='translate(-50%,-50%) scale(1)';});
});

// ===== SCROLL PROGRESS =====
const prog=document.getElementById('scroll-progress');
window.addEventListener('scroll',()=>{
  const p=(window.scrollY/(document.body.scrollHeight-window.innerHeight))*100;
  prog.style.width=p+'%';
});

// ===== NAVBAR SCROLL =====
const nav=document.getElementById('navbar');
window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',window.scrollY>50));

// ===== MOBILE MENU =====
const menuBtn=document.getElementById('menuBtn');
const mobileMenu=document.getElementById('mobileMenu');
menuBtn.addEventListener('click',()=>mobileMenu.classList.toggle('open'));
document.querySelectorAll('.mob-link').forEach(l=>l.addEventListener('click',()=>mobileMenu.classList.remove('open')));

// ===== TYPING ANIMATION =====
const roles=['Software Engineer','React Developer','Frontend Engineer','Mobile App Developer','Full Stack Developer'];
let ri=0,ci=0,del=false;
const typingEl=document.getElementById('typingText');
function typeLoop(){
  const cur=roles[ri];
  if(!del){
    typingEl.textContent=cur.slice(0,ci+1);
    ci++;
    if(ci===cur.length){setTimeout(()=>{del=true;},1800);setTimeout(typeLoop,100);return;}
  } else {
    typingEl.textContent=cur.slice(0,ci-1);
    ci--;
    if(ci===0){del=false;ri=(ri+1)%roles.length;}
  }
  setTimeout(typeLoop,del?60:100);
}
setTimeout(typeLoop,800);

// ===== PARTICLES =====
const canvas=document.getElementById('particles-canvas');
const ctx=canvas.getContext('2d');
let W=canvas.width=window.innerWidth, H=canvas.height=window.innerHeight;
window.addEventListener('resize',()=>{W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight;});
const COLORS=['rgba(139,92,246,.6)','rgba(6,182,212,.6)','rgba(236,72,153,.5)','rgba(59,130,246,.5)'];
class Particle{
  constructor(){this.reset();}
  reset(){
    this.x=Math.random()*W; this.y=Math.random()*H;
    this.r=Math.random()*2+.5;
    this.vx=(Math.random()-.5)*.4; this.vy=(Math.random()-.5)*.4;
    this.color=COLORS[Math.floor(Math.random()*COLORS.length)];
    this.life=0; this.maxLife=200+Math.random()*200;
  }
  update(){
    this.x+=this.vx; this.y+=this.vy; this.life++;
    if(this.life>this.maxLife||this.x<0||this.x>W||this.y<0||this.y>H) this.reset();
  }
  draw(){
    const alpha=Math.sin((this.life/this.maxLife)*Math.PI);
    ctx.globalAlpha=alpha*.8;
    ctx.fillStyle=this.color;
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
    ctx.fill();
  }
}
const particles=Array.from({length:80},()=>new Particle());
function connectParticles(){
  for(let i=0;i<particles.length;i++){
    for(let j=i+1;j<particles.length;j++){
      const dx=particles[i].x-particles[j].x, dy=particles[i].y-particles[j].y;
      const d=Math.sqrt(dx*dx+dy*dy);
      if(d<120){
        ctx.globalAlpha=(1-d/120)*.15;
        ctx.strokeStyle='rgba(139,92,246,1)';
        ctx.lineWidth=.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x,particles[i].y);
        ctx.lineTo(particles[j].x,particles[j].y);
        ctx.stroke();
      }
    }
  }
}
function animateParticles(){
  ctx.clearRect(0,0,W,H);
  particles.forEach(p=>{p.update();p.draw();});
  connectParticles();
  ctx.globalAlpha=1;
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== REVEAL ON SCROLL =====
const revealEls=document.querySelectorAll('.reveal');
const revealObs=new IntersectionObserver((entries)=>{
  entries.forEach((e,i)=>{
    if(e.isIntersecting){
      setTimeout(()=>e.target.classList.add('visible'),i*80);
    }
  });
},{threshold:.1,rootMargin:'0px 0px -60px 0px'});
revealEls.forEach(el=>revealObs.observe(el));

// ===== COUNT-UP STATS =====
const statNums=document.querySelectorAll('.stat-num');
const counterObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting && !e.target.classList.contains('counted')){
      e.target.classList.add('counted');
      const target=+e.target.dataset.target;
      let count=0;
      const step=Math.ceil(target/40);
      const t=setInterval(()=>{
        count=Math.min(count+step,target);
        e.target.textContent=count+(target>10?'+':'');
        if(count>=target)clearInterval(t);
      },40);
    }
  });
},{threshold:.5});
statNums.forEach(el=>counterObs.observe(el));

// ===== SKILL BARS =====
const bars=document.querySelectorAll('.bar-fill');
const barObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting && !e.target.classList.contains('animated')){
      e.target.classList.add('animated');
      setTimeout(()=>e.target.style.width=e.target.dataset.w+'%',200);
    }
  });
},{threshold:.3});
bars.forEach(b=>barObs.observe(b));

// ===== CONTACT FORM =====
document.getElementById('contactForm').addEventListener('submit',function(e){
  e.preventDefault();
  const btn=document.getElementById('submitBtn');
  btn.textContent='Sending... ✨';
  btn.style.opacity='.7';
  setTimeout(()=>{
    btn.textContent='Message Sent! 🎉';
    btn.style.background='linear-gradient(135deg,#10B981,#059669)';
    btn.style.opacity='1';
    this.reset();
    setTimeout(()=>{btn.textContent='Send Message ✈️';btn.style.background='';},3000);
  },1500);
});

// ===== TILT EFFECT ON PROJECT CARDS =====
document.querySelectorAll('.project-card').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    card.style.transform=`translateY(-8px) rotateX(${-y*8}deg) rotateY(${x*8}deg)`;
    card.style.transition='none';
  });
  card.addEventListener('mouseleave',()=>{
    card.style.transform='';
    card.style.transition='all .4s';
  });
});

// ===== SMOOTH ACTIVE NAV LINKS =====
const sections=document.querySelectorAll('section[id]');
const navLinks=document.querySelectorAll('.nav-links a');
window.addEventListener('scroll',()=>{
  let cur='';
  sections.forEach(s=>{if(window.scrollY>=s.offsetTop-200)cur=s.id;});
  navLinks.forEach(a=>{
    a.style.color=a.getAttribute('href')==='#'+cur?'var(--purple)':'';
  });
});
