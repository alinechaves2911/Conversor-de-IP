const ip = document.getElementById('ip');
const ips = document.getElementById('ips');
const convertBtn = document.getElementById('convert');
const clearBtn = document.getElementById('clear');
const copyBtn = document.getElementById('copy');
const result = document.getElementById('result');

function convertDotsToUnderscore(text){
    if (typeof text !== 'string') return text;

    text = text.trim();

    if(text.includes('.')){
        return text.split('.').map(octet => octet.trim().padStart(3, '0')).join('_');
    } else {
        return text.padStart(3, '0');
    }
}


function computeAndShow(){
    const raw = ip.value.trim() !== "" ? ip.value : ips.value;
    if(!raw || raw.trim() === ""){
        result.innerHTML = "<p>Aguardando entrada</p>";
        return;
    }


    const lines = raw.split(/\r?\n/).filter(l => l.trim() !== "");
    const converted = lines.map(line => convertDotsToUnderscore(line));


    const ul = document.createElement('ul');
    converted.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        ul.appendChild(li);
    });

    result.innerHTML = '';
    result.appendChild(ul);
}

convertBtn.addEventListener('click', (e) => { e.preventDefault(); computeAndShow(); });

let timer = null

function clearDebounceCompute(){
    clearTimeout(timer)
    timer = setTimeout(computeAndShow, 300)
}

ip.addEventListener('input', clearDebounceCompute);
ips.addEventListener('input', clearDebounceCompute);

clearBtn.addEventListener('click', (e) => {
    e.preventDefault();
    ip.value = "";
    ips.value = "";
    result.innerHTML = "<p>Aguardando entrada</p>";
})

copyBtn.addEventListener('click', async(e) => {
    e.preventDefault();
    const listItems = result.querySelectorAll('li');
    if(!listItems || listItems.length === 0) return;

    const text = Array.from(listItems).map(li => li.textContent).join('\n');

    try{
        await navigator.clipboard.writeText(text);
        alert("Texto copiado para a área de transferência!");
    } catch(err){
        alert("Falha ao copiar o texto: " + err);
    }
})

window.addEventListener("paste", (e)=>{
    const pasted = (e.clipboardData || window.clipboardData).getData('text');
    if(!pasted) return
    if(ip.value.trim() === ""){
        ip.value = pasted;
    }else{
        ips.value = pasted;
    }
})