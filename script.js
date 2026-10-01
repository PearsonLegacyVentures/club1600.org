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

// Gallery filtering
const galleryButtons=[...document.querySelectorAll('[data-filter]')];
const galleryItems=[...document.querySelectorAll('[data-cat]')];
galleryButtons.forEach(btn=>btn.addEventListener('click',()=>{
  galleryButtons.forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  const filter=btn.dataset.filter;
  galleryItems.forEach(item=>item.classList.toggle('hidden',filter!=='all'&&item.dataset.cat!==filter));
}));


// The 62 archive
const presidentGrid=document.querySelector('#president-grid');
if(presidentGrid){
  const known={
    1:{name:'Ernest T. Strachan',term:'Founding President'},
    62:{name:'Azano P. Major',term:'2026–2027'}
  };
  for(let i=1;i<=62;i++){
    const item=known[i];
    const card=document.createElement('article');
    card.className='president-tile'+(item?' known':'');
    card.innerHTML=`<span class="num">${String(i).padStart(2,'0')}</span><small>${item?'ARCHIVE ENTRY':'HISTORICAL RECORD'}</small><h3>${item?item.name:'Name to be added'}</h3><p>${item?item.term:'Term, portrait and contribution to be digitized.'}</p>`;
    presidentGrid.appendChild(card);
  }
}

// Speech Lab
const labOutput=document.querySelector('#speech-lab-output');
const labButtons=[...document.querySelectorAll('[data-lab]')];
const labData={
  speech:{label:'5–7 MINUTE SPEECH',title:'Build one idea. Make it land.',structure:'Hook → central idea → 2–3 supporting beats → meaning → call to action.',timing:'Aim for a clean arc that fits the assigned time. Rehearse until the ending still has room to breathe.',mistake:'Trying to fit three speeches into one because every thought feels important.',drill:'Record one full run. Then cut 15% of the words without losing the meaning.',role:'Prepared Speaker + Speech Evaluator'},
  pitch:{label:'PITCH',title:'Make the idea easy to buy.',structure:'Problem → stakes → solution → proof → ask.',timing:'For a short pitch, earn attention in the first 20–30 seconds and protect time for the ask.',mistake:'Explaining the product before the audience understands why the problem matters.',drill:'Give the pitch to someone unfamiliar with the idea. Ask them to repeat back the problem, solution and ask.',role:'Prepared Speaker + Table Topics'},
  interview:{label:'JOB INTERVIEW',title:'Answer the question they actually asked.',structure:'Point → evidence → result → relevance to the role.',timing:'Most answers should be concise enough to invite a follow-up rather than force one.',mistake:'Giving autobiography instead of evidence.',drill:'Practise five common questions with a 90-second limit and remove every sentence that does not support the answer.',role:'Table Topics + Evaluation'},
  toast:{label:'WEDDING TOAST',title:'Short. Specific. Human.',structure:'Relationship → one story → what it reveals → wish for the couple → raise the glass.',timing:'Usually better at 3–5 minutes than 12. Leave while they still like you.',mistake:'Inside jokes, long backstory or turning the toast into your memoir.',drill:'Tell the story once without notes. Keep only the details that reveal something true about the person or couple.',role:'Storytelling + Prepared Speaking'},
  tribute:{label:'FUNERAL TRIBUTE',title:'Honor the person, not your performance.',structure:'Quality → specific memory → what it meant → what remains with us.',timing:'Let pauses exist. Emotional weight does not need speed.',mistake:'Trying to summarize an entire life instead of making the person recognizable.',drill:'Choose three memories. Keep the two that best reveal character.',role:'Prepared Speaking + Vocal Variety'},
  panel:{label:'PANEL MODERATION',title:'Make other people interesting.',structure:'Context → opening contrast question → follow the strongest thread → balance airtime → synthesis.',timing:'Protect the final 10–15% of the session for synthesis and closing remarks.',mistake:'Asking every prepared question even when the live conversation found something better.',drill:'Write five primary questions and two follow-ups for each. Practise cutting one in real time.',role:'Toastmaster + Table Topics'},
  presentation:{label:'PRESENTATION',title:'Move the audience from information to decision.',structure:'Why this matters → what the evidence says → what it means → what happens next.',timing:'Build slides around decisions, not around how much research you did.',mistake:'Reading the deck or using slides as a teleprompter with prettier fonts.',drill:'Deliver the presentation once with the screen turned off. If it collapses, the message is not ready.',role:'Prepared Speaker + General Evaluator'},
  impromptu:{label:'IMPROMPTU REMARKS',title:'Find the spine fast.',structure:'PREP: Point → Reason → Example → Point. Or Past → Present → Future for reflective prompts.',timing:'Take a beat before starting. A two-second pause costs less than a 90-second ramble.',mistake:'Starting before deciding what you think.',drill:'Pick a random headline or object. Give yourself 10 seconds to choose a position, then speak for 60 seconds.',role:'Table Topics'}
};
function renderLab(key){
  if(!labOutput||!labData[key])return;
  const d=labData[key];
  labOutput.innerHTML=`<small>${d.label}</small><h2>${d.title}</h2><div class="lab-detail-grid"><div><h4>STRUCTURE</h4><p>${d.structure}</p></div><div><h4>TIMING</h4><p>${d.timing}</p></div><div><h4>COMMON MISTAKE</h4><p>${d.mistake}</p></div><div><h4>PRACTICE DRILL</h4><p>${d.drill}</p></div><div><h4>TOASTMASTERS REPS</h4><p>${d.role}</p></div><div><h4>NEXT MOVE</h4><p>Practise it aloud, not in your head. The mouth finds problems the brain politely ignored.</p></div></div>`;
}
if(labOutput){
  renderLab('speech');
  labButtons.forEach(btn=>btn.addEventListener('click',()=>{
    labButtons.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    renderLab(btn.dataset.lab);
  }));
}
