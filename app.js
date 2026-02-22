
let bank = 5000, tele = 0, mtn = 0
let fbank = 5000, ftele = 0, fmtn = 0
let mode = "broken"
let pendingAction = null;
/* SLIDES */
const slides = [
    ["📤", "You send money", "Everything looks normal"],
    ["🤔", "Receiver says: I didn't get it", "Confusion begins"],
    ["📞", "You argue with each other", "Trust damaged"],
    ["👻", "Money is sitting in a ghost wallet", "Invisible funds"],
    ["📊", "Business accounting mismatch", "Reconciliation nightmare"],
    ["🧠", "No fraud — just system design", "Hardest bugs to detect"],
    ["⚰️", "Owner passes away", "Funds remain forever"],
    ["💰", "Ghost wallet accumulates transfers", "High fraud potential"],
    ["🚨", "Two identities for one number", "No single source of truth"]
];
let slideIndex = 0;
let slideTimer;

async function showTab(id, el) {
    document.querySelectorAll(".view").forEach(v => v.classList.remove("active"))
    document.getElementById(id).classList.add("active")
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"))
    el.classList.add("active")
    if (id === "survey") {
        let votes = await fetchVotes();
        renderSurveyResults(votes);
    }
}

function openConfirm(name, action) {
    modalTitle.innerText = "Confirm Recipient";
    modalMessage.innerText = `Account Name: ${name}`;
    confirmBtn.classList.remove("hidden");
    closeBtn.classList.add("hidden");

    pendingAction = action;
    confirmModal.classList.remove("hidden");
}

function openFailure(message) {
    modalTitle.innerText = "Transaction Failed ❌";
    modalMessage.innerText = message;

    confirmBtn.classList.add("hidden");
    closeBtn.classList.remove("hidden");

    confirmModal.classList.remove("hidden");
}

confirmBtn.onclick = () => {
    confirmModal.classList.add("hidden");
    if (pendingAction) pendingAction();
};

closeBtn.onclick = () => {
    confirmModal.classList.add("hidden");
};

function update() {
    bankBal.innerText = `GHC ${bank.toFixed(2)}`
    teleBal.innerText = `GHC ${tele.toFixed(2)}`
    mtnBal.innerText = `GHC ${mtn.toFixed(2)}`
    f_bankBal.innerText = `GHC ${fbank.toFixed(2)}`
    f_teleBal.innerText = `GHC ${ftele.toFixed(2)}`
    f_mtnBal.innerText = `GHC ${fmtn.toFixed(2)}`
}

function sendBroken() {

    const amountEl = document.getElementById("amount");
    const numberEl = document.getElementById("number");
    const networkEl = document.getElementById("network");

    if (!amountEl || !numberEl || !networkEl) return;

    const amount = Number(amountEl.value);
    const number = numberEl.value.trim();
    const selectedNetwork = networkEl.value.toLowerCase();

    if (!amount || amount <= 0 || !number) return;
    if (bank < amount) {
        flowLog.innerHTML += "<div>Insufficient funds ❌</div>";
        return;
    }

    // STOP here and ask confirmation
    openConfirm("Kwame Mensah", () => executeSendBroken(amount, selectedNetwork));
}
function executeSendBroken(amount, selectedNetwork) {

    bank -= amount;

    if (selectedNetwork === "mtn") {
        mtn += amount;
        mtnLog.innerHTML += `<div>+${amount} silently received 👻</div>`;
        teleLog.innerHTML += "<div>No incoming transaction ❌😳</div>";
    } else {
        tele += amount;
        teleLog.innerHTML += `<div>+${amount} received ✔</div>`;
    }

    flowLog.innerHTML += `
        <div>
        Transfer successful ✅<br>
        You selected: ${selectedNetwork.toUpperCase()}<br>
        Actually delivered: ${selectedNetwork.toUpperCase()} 👻
        </div>
    `;

    update();
}

function setMode(m, el) {
    mode = m
    document.querySelectorAll(".mode").forEach(x => x.classList.remove("active"))
    el.classList.add("active")
}

function runFix() {

    let amount = Number(document.querySelector("#f_amount")?.value);
    let net = document.querySelector("#fnetwork")?.value;

    if (!amount || !net) return;

    openConfirm("Kwame Mensah", () => executeFix(amount, net));
}
function executeFix(f_amount, fnetwork) {

    let portedNetwork = "TELECASH";

    if (fnetwork === 'telecash') {
        fbank -= f_amount; ftele += f_amount; fixLog.innerHTML += `<div>${portedNetwork} received ✔</div>`
    } else if (mode === "broken") {
        fbank -= f_amount; fmtn += f_amount; fixLog.innerHTML += "<div>Ghost wallet received</div>"
    } else if (mode === "reject") {
        fixLog.innerHTML += `<div>Blocked: Number ported please choose ${portedNetwork} network ❌</div>`
        openFailure(`This number has been ported.\nPlease select ${portedNetwork} as the destination network.`);
    } else if (mode === "reroute") {
        fbank -= f_amount; ftele += f_amount; fixLog.innerHTML += `<div>${portedNetwork} received ✔</div>`
    }

    update();
}

function renderSlide() {
    const s = slides[slideIndex];
    slide.innerHTML = `<span class="slideemoji">${s[0]}</span>${s[1]}<br><b>${s[2]}</b>`;
}

function nextSlide() {
    slideIndex = (slideIndex + 1) % slides.length;
    renderSlide();
}

function prevSlide() {
    slideIndex = (slideIndex - 1 + slides.length) % slides.length;
    renderSlide();
}

function startSlides() {
    slideTimer = setInterval(nextSlide, 5000);
}

function stopSlides() {
    clearInterval(slideTimer);
}


async function vote(type) {
    try {
        await sendVote(type)
        votes = await fetchVotes(); // refresh UI from server
    } catch (error) {
        let votes = JSON.parse(localStorage.getItem("ghost_votes") || "{}");
        votes[type] = (votes[type] || 0) + 1;
        localStorage.setItem("ghost_votes", JSON.stringify(votes));
        renderSurveyResults(data);
    }
}

function percent(a, b) {
    const total = (a || 0) + (b || 0);
    if (total === 0) return [0, 0];
    return [Math.round(a / total * 100), Math.round(b / total * 100)];
}

async function renderSurveyResults(votes = {}) {
    if (!votes.useful && !votes.confusing && !votes.affected_yes && !votes.affected_no && !votes.notify_yes && !votes.notify_no) return;
    const [usefulYes, usefulNo] = percent(votes.useful, votes.confusing);
    const [affYes, affNo] = percent(votes.affected_yes, votes.affected_no);
    const [notifyYes, notifyNo] = percent(votes.notify_yes, votes.notify_no);

    surveyLog.innerHTML = `
        <div class="results" >
            <div class="pollGrid">
                <div class="pollCard">
                    <h3>Understanding</h3>
                    ${bar("Useful 👍", usefulYes)}
                    ${bar("Confusing 🤔", usefulNo)}
                </div>

                <div class="pollCard">
                    <h3>Affected</h3>
                    ${bar("Yes ⚠️", affYes)}
                    ${bar("No 🙂", affNo)}
                </div>

                <div class="pollCard">
                    <h3>Next-of-Kin Notification</h3>
                    ${bar("Notify 📨", notifyYes)}
                    ${bar("Do not ❌", notifyNo)}
                </div>
            </div>

        </div>
    `;



}

function bar(label, value) {
    return `     <div class="barRow">         <span>${label}</span>         <div class="bar">             <div class="fill" style="width:${value}%">${value}%</div>         </div>     </div>`;
}


slide.addEventListener("mouseenter", stopSlides);
slide.addEventListener("mouseleave", startSlides);

startSlides();
update()