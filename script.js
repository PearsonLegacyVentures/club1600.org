const nav=document.querySelector('.nav');
const menu=document.querySelector('.menu-btn');
const siteNav=document.querySelector('#site-nav');
window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',window.scrollY>24),{passive:true});
menu?.addEventListener('click',()=>{
  const open=siteNav.classList.toggle('open');
  menu.setAttribute('aria-expanded',String(open));
});
siteNav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
  siteNav.classList.remove('open');menu?.setAttribute('aria-expanded','false');
}));

const io=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}});
},{threshold:.12,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.reveal').forEach((el,i)=>{el.style.transitionDelay=`${Math.min((i%4)*70,210)}ms`;io.observe(el)});

const cards=[...document.querySelectorAll('.timeline-card')];
const bar=document.querySelector('.timeline-track span');
cards.forEach((card,i)=>{
  card.addEventListener('mouseenter',()=>{
    cards.forEach(c=>c.classList.remove('active'));
    card.classList.add('active');
    if(bar)bar.style.width=`${((i+1)/cards.length)*100}%`;
  });
});

const hero=document.querySelector('.hero-photo');
window.addEventListener('scroll',()=>{
  if(!hero)return;
  const y=Math.min(window.scrollY*.11,60);
  hero.style.transform=`scale(1.04) translateY(${y}px)`;
},{passive:true});

document.querySelectorAll('a[href="#"]').forEach(a=>a.addEventListener('click',e=>e.preventDefault()));