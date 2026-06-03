// Backend URL – your Render deployed backend
const API_BASE = "https://indsmart-auto.onrender.com";

const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const numbersText = document.getElementById('numbers');
const logArea = document.getElementById('logArea');
const statusBox = document.getElementById('statusBox');

function addLog(msg, type = 'info') {
    const div = document.createElement('div');
    div.className = 'log-entry';
    if (type === 'success') div.classList.add('success');
    if (type === 'error') div.classList.add('error');
    div.textContent = new Date().toLocaleTimeString() + ' - ' + msg;
    logArea.appendChild(div);
    div.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

async function fetchStatus() {
    try {
        const res = await fetch(`${API_BASE}/status`);
        const data = await res.json();
        if (data.isRunning) {
            statusBox.innerHTML = `🟢 Status: Running - ${data.current}/${data.total}`;
        } else {
            statusBox.innerHTML = '⚪ Status: Idle';
        }
    } catch(e) {
        statusBox.innerHTML = '🔴 Status: Backend unreachable';
    }
}
setInterval(fetchStatus, 2000);
fetchStatus();

startBtn.onclick = async () => {
    const numbers = numbersText.value.trim();
    if (!numbers) {
        addLog('❌ Please enter numbers first', 'error');
        return;
    }
    addLog('🚀 Starting automation...', 'info');
    try {
        const res = await fetch(`${API_BASE}/start`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ numbers })
        });
        const data = await res.json();
        if (data.status === 'started') {
            addLog(`✅ Started with ${data.total} numbers`, 'success');
        } else {
            addLog(`⚠️ ${data.msg || data.status}`, 'error');
        }
    } catch(e) {
        addLog('❌ Failed to connect to backend', 'error');
    }
};

stopBtn.onclick = async () => {
    try {
        await fetch(`${API_BASE}/stop`, { method: 'POST' });
        addLog('⏹ Stop command sent', 'info');
    } catch(e) {
        addLog('❌ Stop failed', 'error');
    }
};
