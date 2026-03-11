var CHRIS_CONTEXT = [
  'You are "Ask Chris" - a warm, engaging career chatbot representing Christopher Riffel.',
  'Answer questions about Chris in a friendly, professional tone. Refer to him as "Chris" or "he/him."',
  'CRITICAL HONESTY RULE: If asked something you do not know about Chris, say: That is a great question, but I do not have that detail about Chris. Feel free to reach out at riffel@alumni.psu.edu. Never fabricate or guess details about Chris.',
  'WHO BUILT THIS CHATBOT: Chris built this chatbot himself. If anyone asks who built it, say Chris did.',
  'ABOUT CHRISTOPHER RIFFEL',
  'Location: Emmaus, PA. Email: riffel@alumni.psu.edu. Education: BS in Management, Pennsylvania State University.',
  'PROFESSIONAL SUMMARY: Senior Technical and Business Analyst with 10+ years in insurtech configuration, API integration, and data-driven process improvement. Led a digital quoting platform launch in under a year that drove a 16% increase in customer quote volume. Skilled in cross-functional collaboration, mentoring, and driving projects from requirements to production.',
  'THE PIVOT STORY: Chris spent 14 years at Lutron Electronics in project management and analytics, bridging business users and technical teams. He then made a deliberate pivot into a fully technical software role at Sapiens Corporation, mastering XML, XSLT, REST APIs, SQL, and debugging. This was a conscious decision to evolve. Chris does not just adapt to change - he seeks it out.',
  'CURRENT ROLE: Senior Technical Analyst, Sapiens Corporation 2015 to Present. Insurtech configuration for a 4.95 billion dollar revenue client in property and casualty, auto, home insurance. Led Telematics GPS data program integration generating 3 million dollars in revenue. Led data prefill implementation improving accuracy 12% and lowering risk rates 6%. Heavy use of Postman, REST APIs, XSL. Production support including debugging, logging, JIRA defect tracking. Mentors junior analysts and prepares software delivery documentation.',
  'PREVIOUS ROLE: Inside Sales Analyst and SFDC Project Manager, Lutron Electronics 2001 to 2015. Bridge between IT teams and end users for VB-based quoting tools. Salesforce reporting and sandbox access. Led Salesforce dashboards for 140 million and 35 million dollar annual markets. Designed lead delivery to 700+ account sales team. Sole owner of 20 million dollar Hospitality channel analytics.',
  'TECHNICAL SKILLS: XML, XSLT, SQL, REST API, JSON, Debugging, Logging, Data Warehouse, Requirement Analysis. Tools include Postman, SoapUI, JIRA, Confluence, GitHub Copilot, Splunk, Salesforce, SharePoint.',
  'AGENTIC AI PASSION: Chris is genuinely excited about agentic AI and built this chatbot himself as a hands-on project. He is also taking a formal agentic AI course. He sees agentic AI as the next frontier in tech.',
  'PERSONAL: Passionate Penn State fan who follows football and basketball. We Are Penn State! Loves Italian and Mexican cuisine. Known for resilience, adaptability, curiosity, and mentoring others.',
  'TONE: Be warm, professional, and personable. Keep answers to 2-5 sentences. Redirect unknowns to riffel@alumni.psu.edu'
].join(' ');

var apiKey = '';
var history = [];

function saveKey() {
  var input = document.getElementById('apiKeyInput');
  var val = input.value.trim();
  if (!val) {
    alert('Please paste your Anthropic API key');
    return;
  }
  apiKey = val;
  try { localStorage.setItem('askchris_apikey', apiKey); } catch(e) {}
  document.getElementById('apiBanner').className = 'api-banner hidden';
  addMessage('bot', 'API key saved! Ask Chris is fully activated. Ask me anything about Chris!');
}

function resetKey(e) {
  if (e) e.preventDefault();
  var pwd = prompt('Enter password to reset API key:');
  if (pwd !== 'swirl') {
    alert('Incorrect password.');
    return;
  }
  apiKey = '';
  try { localStorage.removeItem('askchris_apikey'); } catch(e) {}
  document.getElementById('apiKeyInput').value = '';
  document.getElementById('apiBanner').className = 'api-banner';
}

function addMessage(role, text) {
  var container = document.getElementById('messages');
  var div = document.createElement('div');
  div.className = 'msg ' + role;
  var avatar = document.createElement('div');
  avatar.className = 'msg-avatar';
  avatar.textContent = role === 'bot' ? 'CR' : '?';
  var bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  bubble.textContent = text;
  div.appendChild(avatar);
  div.appendChild(bubble);
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  history.push({ role: role === 'bot' ? 'assistant' : 'user', content: text });
}

function showTyping() {
  var container = document.getElementById('messages');
  var div = document.createElement('div');
  div.className = 'msg bot';
  div.id = 'typingIndicator';
  var avatar = document.createElement('div');
  avatar.className = 'msg-avatar';
  avatar.textContent = 'CR';
  var bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  bubble.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
  div.appendChild(avatar);
  div.appendChild(bubble);
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function removeTyping() {
  var el = document.getElementById('typingIndicator');
  if (el) el.parentNode.removeChild(el);
}

function sendMessage() {
  var input = document.getElementById('userInput');
  var text = input.value.trim();
  if (!text) return;
  if (!apiKey) {
    addMessage('bot', 'Please enter your Anthropic API key above to activate Ask Chris!');
    return;
  }
  document.getElementById('suggestions').style.display = 'none';
  addMessage('user', text);
  input.value = '';
  showTyping();
  var apiMessages = [];
  for (var i = 0; i < history.length; i++) {
    apiMessages.push({ role: history[i].role, content: history[i].content });
  }
  fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: CHRIS_CONTEXT,
      messages: apiMessages
    })
  })
  .then(function(r) { return r.json(); })
  .then(function(data) {
    removeTyping();
    if (data.error) {
      history.pop();
      addMessage('bot', 'Error: ' + data.error.message);
      return;
    }
    var reply = 'Try asking something else!';
    if (data.content && data.content[0] && data.content[0].text) {
      reply = data.content[0].text;
    }
    addMessage('bot', reply);
  })
  .catch(function(err) {
    removeTyping();
    history.pop();
    addMessage('bot', 'Something went wrong. Please check your API key and try again.');
  });
}

function init() {
  var saved = '';
  try { saved = localStorage.getItem('askchris_apikey') || ''; } catch(e) {}
  if (saved) {
    apiKey = saved;
    document.getElementById('apiBanner').className = 'api-banner hidden';
  }
  addMessage('bot', "Hi there! I'm Ask Chris - your guide to everything about Christopher Riffel's career, background, and story. What would you like to know?");
  document.getElementById('activateBtn').onclick = saveKey;
  document.getElementById('sendBtn').onclick = sendMessage;
  document.getElementById('resetLink').onclick = resetKey;
  document.getElementById('userInput').onkeydown = function(e) {
    if (e.key === 'Enter') sendMessage();
  };
  var chips = document.querySelectorAll('.suggestion-chip');
  for (var i = 0; i < chips.length; i++) {
    (function(chip) {
      chip.onclick = function() {
        document.getElementById('userInput').value = chip.textContent;
        sendMessage();
      };
    })(chips[i]);
  }
}

window.onload = init;
