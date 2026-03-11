var CHRIS_CONTEXT = 'You are Ask Chris, a warm engaging career chatbot for Christopher Riffel. Answer in 2-5 sentences, friendly and professional. HONESTY RULE: If you do not know something about Chris, say: That is a great question but I do not have that detail. Please reach out to Chris at riffel@alumni.psu.edu. WHO BUILT THIS: Chris built this chatbot himself. Say so if asked. ABOUT CHRIS: Location Emmaus PA. Email riffel@alumni.psu.edu. Education BS Management Pennsylvania State University. CAREER SUMMARY: Senior Technical and Business Analyst 10+ years insurtech configuration API integration data-driven process improvement. Led digital quoting platform launch under one year driving 16% increase in customer quote volume. PIVOT STORY: Chris spent 14 years at Lutron Electronics in project management and analytics bridging business and technical teams. He deliberately pivoted into a fully technical software role at Sapiens Corporation mastering XML XSLT REST APIs SQL and debugging. Chris does not just adapt to change he seeks it out. CURRENT ROLE Sapiens Corporation 2015 to present: Insurtech config for 4.95 billion dollar client. Led Telematics integration generating 3 million in revenue. Data prefill improved accuracy 12% lowered risk 6%. Uses Postman REST APIs XSL daily. Production support debugging logging JIRA. Mentors junior analysts. PREVIOUS ROLE Lutron Electronics 2001 to 2015: Bridge between IT and business users. Salesforce dashboards for 140M and 35M markets. Lead delivery to 700+ sales accounts. Owned 20M Hospitality channel analytics. SKILLS: XML XSLT SQL REST API JSON Debugging Logging Data Warehouse. Tools Postman SoapUI JIRA Confluence GitHub Copilot Splunk Salesforce SharePoint. AGENTIC AI: Chris is passionate about agentic AI and built this chatbot himself as a hands-on demonstration. He is taking a formal agentic AI course. PERSONAL: Huge Penn State fan We Are Penn State! Loves Italian and Mexican food. Known for resilience adaptability and mentoring others.';

var apiKey = '';
var chatHistory = [];

function doSaveKey() {
  var el = document.getElementById('apiKeyInput');
  if (!el) { alert('Cannot find input'); return; }
  var val = el.value.trim();
  if (!val) { alert('Please paste your API key'); return; }
  apiKey = val;
  try { localStorage.setItem('askchris_apikey', val); } catch(e) {}
  document.getElementById('apiBanner').style.display = 'none';
  doAddMessage('bot', 'API key saved! Ask Chris is fully activated. Ask me anything!');
}

function doResetKey() {
  var pwd = prompt('Enter password:');
  if (pwd !== 'swirl') { alert('Incorrect password'); return; }
  apiKey = '';
  try { localStorage.removeItem('askchris_apikey'); } catch(e) {}
  document.getElementById('apiKeyInput').value = '';
  document.getElementById('apiBanner').style.display = 'flex';
  return false;
}

function doAddMessage(role, text) {
  var c = document.getElementById('messages');
  var d = document.createElement('div');
  d.className = 'msg ' + role;
  var a = document.createElement('div');
  a.className = 'msg-avatar';
  a.textContent = role === 'bot' ? 'CR' : '?';
  var b = document.createElement('div');
  b.className = 'msg-bubble';
  b.textContent = text;
  d.appendChild(a);
  d.appendChild(b);
  c.appendChild(d);
  c.scrollTop = c.scrollHeight;
  chatHistory.push({ role: role === 'bot' ? 'assistant' : 'user', content: text });
}

function doShowTyping() {
  var c = document.getElementById('messages');
  var d = document.createElement('div');
  d.className = 'msg bot'; d.id = 'typ';
  var a = document.createElement('div');
  a.className = 'msg-avatar'; a.textContent = 'CR';
  var b = document.createElement('div');
  b.className = 'msg-bubble';
  b.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
  d.appendChild(a); d.appendChild(b); c.appendChild(d);
  c.scrollTop = c.scrollHeight;
}

function doRemoveTyping() {
  var el = document.getElementById('typ');
  if (el) el.parentNode.removeChild(el);
}

function doSend() {
  var inp = document.getElementById('userInput');
  var text = inp.value.trim();
  if (!text) return;
  if (!apiKey) { doAddMessage('bot', 'Please enter your API key above first!'); return; }
  document.getElementById('suggestions').style.display = 'none';
  doAddMessage('user', text);
  inp.value = '';
  doShowTyping();
  var msgs = [];
  for (var i = 0; i < chatHistory.length; i++) {
    msgs.push({ role: chatHistory[i].role, content: chatHistory[i].content });
  }
  fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 1000, system: CHRIS_CONTEXT, messages: msgs })
  })
  .then(function(r) { return r.json(); })
  .then(function(data) {
    doRemoveTyping();
    if (data.error) { chatHistory.pop(); doAddMessage('bot', 'Error: ' + data.error.message); return; }
    doAddMessage('bot', data.content && data.content[0] ? data.content[0].text : 'Try asking something else!');
  })
  .catch(function() { doRemoveTyping(); chatHistory.pop(); doAddMessage('bot', 'Connection error. Check your API key and try again.'); });
}

function doChip(text) {
  document.getElementById('userInput').value = text;
  doSend();
}

window.onload = function() {
  var saved = '';
  try { saved = localStorage.getItem('askchris_apikey') || ''; } catch(e) {}
  if (saved) {
    apiKey = saved;
    document.getElementById('apiBanner').style.display = 'none';
  }
  doAddMessage('bot', "Hi! I'm Ask Chris - your guide to Christopher Riffel's career and story. What would you like to know?");
};
