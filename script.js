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
  const presidents=[
    {n:1,name:'Ernest T. Strachan',term:'1969'},
    {n:2,name:'Alfred T. Maycock',term:'1970'},
    {n:3,name:'E. Pedro Roberts',term:'1971'},
    {n:4,name:'O. H. Michael Smith',term:'1972'},
    {n:5,name:'Patrick Bosfield',term:'1973'},
    {n:6,name:'Lester M. Gibson',term:'1974'},
    {n:7,name:'James A. Rahming',term:'1975'},
    {n:8,name:'Clifford Lockhart',term:'1975'},
    {n:9,name:'Edward J. Carey',term:'1976'},
    {n:10,name:'L. Malachi Lundy',term:'1977'},
    {n:11,name:'Christopher V. Stuart',term:'1978'},
    {n:12,name:'Philip E. Davis',term:'1979'},
    {n:13,name:'Samuel J. Mitchel',term:'1980'},
    {n:14,name:'Samuel J. Bain',term:'1981',note:'Served 2 months'},
    {n:15,name:'Bernard F. Hanna',term:'1981',note:'Served 10 months'},
    {n:16,name:'Kingsley S. Munroe',term:'1982',note:'Served 10 months'},
    {n:17,name:'Gordon Soles',term:'1982',note:'Served 2 months'},
    {n:18,name:'Clement Foster',term:'1983'},
    {n:19,name:'John Adderley',term:'1984'},
    {n:20,name:'James C. Bostwick',term:'1985'},
    {n:21,name:'Keith L. Major',term:'1986'},
    {n:22,name:'Michael Cooper',term:'1987'},
    {n:23,name:'L. Edgar Moxey',term:'1988'},
    {n:24,name:'Kerry Poitier',term:'1989'},
    {n:25,name:'Richard L. Bootle',term:'1990'},
    {n:26,name:'Charles W. Deveaux',term:'1991'},
    {n:27,name:'Bernard F. Hanna',term:'1992',note:'Served six months as Toastmasters International changed its fiscal year from Jan–Dec to Jul–Jun.'},
    {n:28,name:'Harry E. Kemp',term:'1992–1993'},
    {n:29,name:'Arlington A. Hunter',term:'1993–1994'},
    {n:30,name:'Caldwell E. Pratt',term:'1994–1995'},
    {n:31,name:'Lambert N. Rahming',term:'1995–1996'},
    {n:32,name:'Jamal R. Hepburn',term:'1996–1997'},
    {n:33,name:'Anthony J. Longley',term:'1997–1998'},
    {n:34,name:'Dwain A. Wallace',term:'1998–1999'},
    {n:35,name:'Dwayne A. Davis',term:'1999–2000'},
    {n:36,name:'Roderick C. Colebrook',term:'2000–2001'},
    {n:37,name:'Cyprian A. Gibson',term:'2001–2002'},
    {n:38,name:'Dwight R. Burrows',term:'2002–2003'},
    {n:39,name:'Jevon McIntosh',term:'2003–2004'},
    {n:40,name:'George Taylor',term:'2004–2005'},
    {n:41,name:'Charles G. Saunders Jr.',term:'2005–2006'},
    {n:42,name:'Delmaro C. Duncombe',term:'2006–2007'},
    {n:43,name:'Chato R. Outten',term:'2007–2008'},
    {n:44,name:'Dion J. T. Godet',term:'2008–2009'},
    {n:45,name:'Craig F. Ferguson',term:'2009–2010'},
    {n:46,name:'Ernesto Gongora',term:'2010–2011'},
    {n:47,name:'Charles M. Newbold III',term:'2011–2012'},
    {n:48,name:'Pedro A. Young',term:'2012–2013'},
    {n:49,name:'Franklyn G. Winder',term:'2013–2014'},
    {n:50,name:'Valentino Munroe',term:'2014–2015'},
    {n:51,name:'Carlos E. Palacious',term:'2015–2016'},
    {n:52,name:'Chervez W. Brown',term:'2016–2017'},
    {n:53,name:'Dion B. Knowles',term:'2017–2018'},
    {n:54,name:'Osbourne Moxey',term:'2018–2019'},
    {n:55,name:'Ancin B. Munnings',term:'2019–2020'},
    {n:56,name:'Shacoy Mullings',term:'2020–2021'},
    {n:57,name:'Devaughn J. Taylor',term:'2021–2022'},
    {n:58,name:'Ray-Don K. Poitier',term:'2022–2023'},
    {n:59,name:'Stefan C. Bonimy',term:'2023–2024'},
    {n:60,name:'Camron K. Reckley',term:'2024–2025'},
    {n:61,name:'Jamaal Cooper',term:'2025–2026',photo:'assets/jamaal-cooper-cutout.webp'},
    {n:62,name:'Azano P. Major',term:'2026–2027',photo:'assets/azano-major-cutout.webp'}
  ];
  const initials=name=>name.replace(/\b(Jr\.|III|II)\b/g,'').split(/\s+/).filter(Boolean).map(part=>part.replace(/[^A-Za-z]/g,'')[0]).filter(Boolean).slice(0,2).join('');
  presidents.forEach(item=>{
    const card=document.createElement('article');
    card.className='president-tile'+(item.photo?' has-photo':'');
    const portrait=item.photo
      ? `<div class="president-portrait"><img src="${item.photo}" alt="${item.name}, ${item.term} President of Club 1600" loading="lazy"></div>`
      : `<div class="president-portrait portrait-pending"><span>${initials(item.name)}</span><small>PORTRAIT ARCHIVE</small></div>`;
    card.innerHTML=`${portrait}<div class="president-tile-copy"><span class="num">${String(item.n).padStart(2,'0')}</span><small>${item.term}</small><h3>${item.name}</h3>${item.note?`<p>${item.note}</p>`:''}</div>`;
    presidentGrid.appendChild(card);
  });
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


// Bahamas AI Solutions site credit
document.querySelectorAll('.footer-bottom').forEach(footer=>{
  if(footer.querySelector('.site-credit')) return;
  const credit=document.createElement('a');
  credit.className='site-credit';
  credit.href='https://bahamasaisolutions.com/';
  credit.target='_blank';
  credit.rel='noopener';
  credit.setAttribute('aria-label','Website designed by Bahamas AI Solutions');
  credit.innerHTML='Website designed by <strong>Bahamas AI Solutions</strong> ↗';
  footer.appendChild(credit);
});
