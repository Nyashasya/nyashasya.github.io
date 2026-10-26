const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];

function updateClock(){
  const now = new Date();
  $('#clock').textContent = now.toLocaleTimeString('ru-RU', {hour12:false});
}
updateClock();
setInterval(updateClock, 1000);

const backdrop = $('#windowBackdrop');
const toast = $('#toast');
let toastTimer;
function notify(message){
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>toast.classList.remove('show'), 2200);
}
function openWindow(id){
  $$('.app-window').forEach(win=>win.classList.remove('open'));
  const win = document.getElementById(id);
  if(!win) return;
  win.classList.add('open');
  backdrop.classList.add('open');
}
function closeWindows(){
  $$('.app-window').forEach(win=>win.classList.remove('open'));
  backdrop.classList.remove('open');
}
$$('.desktop-icon').forEach(icon=>icon.addEventListener('click',()=>openWindow(icon.dataset.window)));
$$('.close-window').forEach(btn=>btn.addEventListener('click',closeWindows));
backdrop.addEventListener('click',closeWindows);
document.addEventListener('keydown',e=>{
  if(e.key==='Escape') closeWindows();
  if(e.key==='/' && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)){
    e.preventDefault(); $('#commandInput').focus();
  }
});

$('#bootBtn').addEventListener('click',()=>{
  openWindow('projectsWindow');
  notify('EXPERIENCE INITIALIZED — choose a project tab.');
  printLine('boot', 'Interactive portfolio initialized. Welcome, visitor!');
});

const commands = {
  help: () => ['Available commands: about, projects, skills, contact, clear, help.','Shortcut: press / to focus the command line.'],
  about: () => {openWindow('aboutWindow'); return ['Opening ABOUT_ME.exe...'];},
  projects: () => {openWindow('projectsWindow'); return ['Opening PROJECTS.dir...'];},
  skills: () => {openWindow('skillsWindow'); return ['Opening SKILLS.sys...'];},
  contact: () => {openWindow('contactWindow'); return ['Opening CONTACT.txt...'];},
  clear: () => {$('#consoleOutput').innerHTML=''; return [];},
};
function printLine(kind, message){
  const p=document.createElement('p');
  const label=document.createElement('span');
  label.className='green'; label.textContent=kind;
  const text=document.createElement('span');
  text.className='dim'; text.textContent=' — '+message;
  p.append(label,text); $('#consoleOutput').append(p);
  $('#consoleOutput').scrollTop=$('#consoleOutput').scrollHeight;
}
function runCommand(value){
  const cmd=value.trim().toLowerCase();
  if(!cmd) return;
  printLine('visitor', '$ '+cmd);
  if(commands[cmd]){
    const messages=commands[cmd]();
    messages.forEach(message=>printLine(cmd,message));
  }else{
    printLine('error', `unknown command "${cmd}". Type help to see commands.`);
  }
}
$('#commandForm').addEventListener('submit',e=>{
  e.preventDefault(); runCommand($('#commandInput').value); $('#commandInput').value='';
});
$$('[data-command]').forEach(btn=>btn.addEventListener('click',()=>runCommand(btn.dataset.command)));

const projectData = {
  bot: {
    status:'● EXISTING PROJECT',
    title:'Telegram Search Bot',
    description:'Telegram-бот для поиска информации через внешний API. В проекте использованы Python, aiogram, aiohttp и асинхронные запросы.',
    tags:['PYTHON','AIOGRAM','AIOHTTP'],
    preview:'<span>nastya@dev ~ %</span><br>python bot.py<br><em>✓ external API connected</em><br><em>✓ JSON parsed</em><br><em>✓ async loop running</em>',
    link:true
  },
  expense: {
    status:'○ PLANNED CONCEPT',
    title:'Expense Tracker',
    description:'Идея учебного приложения для учёта доходов и расходов, категорий, расчёта баланса и месячной статистики с сохранением данных в SQLite.',
    tags:['PYTHON','SQLITE','DATETIME'],
    preview:'<span>money.log ~ %</span><br>add expense --food 450<br><em>→ transaction concept</em><br><em>→ balance summary</em><br><em>○ not implemented yet</em>',
    link:false
  },
  url: {
    status:'○ PLANNED CONCEPT',
    title:'URL Shortener',
    description:'Концепция сервиса коротких ссылок: проверка URL, генерация коротких кодов, HTTP-редиректы и подсчёт переходов.',
    tags:['FASTAPI','HTTP','SQL'],
    preview:'<span>short.url ~ %</span><br>shorten https://...<br><em>→ generate short code</em><br><em>→ redirect to original</em><br><em>○ not implemented yet</em>',
    link:false
  }
};
$$('.project-tab').forEach(tab=>tab.addEventListener('click',()=>{
  $$('.project-tab').forEach(t=>t.classList.toggle('active',t===tab));
  const p=projectData[tab.dataset.project];
  const detail=$('#projectDetail');
  detail.querySelector('.project-preview').innerHTML=p.preview;
  detail.querySelector('.project-status').textContent=p.status;
  detail.querySelector('.project-status').style.color=p.link?'#388b22':'#b45a00';
  detail.querySelector('h3').textContent=p.title;
  detail.querySelector('p').textContent=p.description;
  const pills=detail.querySelector('.tech-pills'); pills.innerHTML='';
  p.tags.forEach(tag=>{const span=document.createElement('span');span.textContent=tag;pills.append(span);});
  let link=detail.querySelector('.window-link');
  if(p.link){
    if(!link){link=document.createElement('a');link.className='window-link';link.target='_blank';link.rel='noreferrer';detail.querySelector('div:last-child').append(link);}
    link.href='https://github.com/Nyashasya/competitive_search_bot_beginner';link.textContent='OPEN GITHUB ↗';link.style.display='inline-block';
  }else if(link){link.style.display='none';}
}));

// Optional subtle sound toggle: no audio is played unless implemented later.
$('#soundToggle').addEventListener('click',()=>{
  const btn=$('#soundToggle');
  const on=btn.textContent.includes('OFF');
  btn.textContent=on?'SOUND: ON':'SOUND: OFF';
  notify(on?'Sound mode enabled visually (no audio file is loaded).':'Sound mode off.');
});
