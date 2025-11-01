/* script.js - Kismat.ai minimal functionality */

// util
const $ = (id)=> document.getElementById(id);

// load fortunes and prompts
let fortunes = [];
let prompts = {};
let horoscopes = {};
let colors = [
  {"name":"Jade Green","hex":"#00A86B","meaning":"Renewal and calm"},
  {"name":"Saffron","hex":"#F4C430","meaning":"Success and energy"},
  {"name":"Peacock Blue","hex":"#0B6E8F","meaning":"Wisdom and balance"},
  {"name":"Vermilion","hex":"#E64A19","meaning":"Passion and action"}
];

async function loadData(){
  fortunes = await (await fetch('data/fortunes.json')).json();
  prompts = await (await fetch('data/prompts.json')).json();
  horoscopes = await (await fetch('data/horoscope.json')).json();
}
loadData();

// Fortune cookie
$('cookieBtn').addEventListener('click', ()=> {
  const f = fortunes[Math.floor(Math.random()*fortunes.length)];
  $('fortuneText').innerText = f;
});

$('saveFortune').addEventListener('click', ()=>{
  const text = $('fortuneText').innerText;
  if(!text || text.includes('Tap the cookie')) return alert('Open a fortune first');
  const saved = JSON.parse(localStorage.getItem('kismat_saved')||'[]');
  saved.push({text, created: new Date().toISOString()});
  localStorage.setItem('kismat_saved', JSON.stringify(saved));
  alert('Saved to local storage');
});

$('saveAllBtn').addEventListener('click', ()=>{
  const saved = JSON.parse(localStorage.getItem('kismat_saved')||'[]');
  if(!saved.length) return alert('No saved items');
  // show saved (simple)
  alert('Saved items:\\n' + saved.map(s=> `${new Date(s.created).toLocaleString()}: ${s.text}`).join('\\n\\n'));
});

// Share fortune (use Web Share if available)
$('shareFortune').addEventListener('click', async ()=>{
  const text = $('fortuneText').innerText;
  if(!text || text.includes('Tap the cookie')) return alert('Open a fortune first');
  if(navigator.share){
    try{
      await navigator.share({title:'My Kismat Fortune', text});
    }catch(e){ console.warn(e) }
    return;
  }
  // fallback copy
  navigator.clipboard.writeText(text);
  alert('Copied fortune to clipboard!');
});

// Lucky number & color
$('revealLuck').addEventListener('click', ()=>{
  const num = Math.floor(Math.random()*99) + 1;
  const c = colors[Math.floor(Math.random()*colors.length)];
  $('luckyNumber').innerText = num;
  $('luckyColor').innerText = `${c.name} — ${c.meaning}`;
});

// Chatbot — simple local responses (can be replaced later by real AI)
const chatWindow = $('chatWindow');
function appendChat(isUser, text){
  const div = document.createElement('div');
  div.className = isUser ? 'msg user' : 'msg bot';
  div.style.margin = '6px 0';
  div.innerHTML = `<div style="padding:8px;border-radius:8px;background:${isUser? '#eaf8ff':'#fff8ef'}">${text}</div>`;
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

$('sendChat').addEventListener('click', ()=> {
  const q = $('chatInput').value.trim();
  if(!q) return;
  appendChat(true,q);
  $('chatInput').value='';
  // simple canned reply logic
  setTimeout(()=> {
    const reply = generateLocalReply(q);
    appendChat(false,reply);
  }, 600);
});

function generateLocalReply(q){
  const qLower = q.toLowerCase();
  if(qLower.includes('love')) return "The stars encourage patience in matters of the heart — kindness opens doors.";
  if(qLower.includes('job') || qLower.includes('career')) return "Show consistent work and small wins accumulate into destiny — network gently today.";
  if(qLower.includes('lucky number')) return "Try meditating on a number you like; sometimes your intuition chooses it for you.";
  return "Luck favors the curious. Be open and kind — the path often reveals itself after a small step.";
}

// AI Prompt Generator — calls serverless function
$('generatePrompt').addEventListener('click', async () => {
  const category = $('categorySelect').value;
  const keywords = $('userKeywords').value.trim();
  // show immediate fallback from static prompts
  const fallback = (prompts[category] && prompts[category][Math.floor(Math.random()*prompts[category].length)]) || "A small tip: smile and try again.";
  $('promptResult').innerText = "Thinking...";

  try{
    // call serverless function
    const res = await fetch('/.netlify/functions/generate', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({category, keywords})
    });
    if(!res.ok) throw new Error('Serverless call failed');
    const data = await res.json();
    $('promptResult').innerText = data.result || fallback;
  }catch(err){
    console.warn(err);
    // fallback
    $('promptResult').innerText = fallback + " (offline suggestion)";
  }
});
