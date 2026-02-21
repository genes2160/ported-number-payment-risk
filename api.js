async function fetchVotes() {
    try {
        const res = await fetch("/api/votes");
        const data = await res.json();
        return data
    }
    catch (e) {
        console.log(`Error caught`, err)
        const local = JSON.parse(localStorage.getItem("ghost_votes") || "{}");
        return local
    }
}
async function sendVote(type) {
    try {
        await fetch("/api/votes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type })
        });

    }
    catch (e) {
        // fallback to localStorage if server unavailable
        let votes = JSON.parse(localStorage.getItem("ghost_votes") || "{}");
        votes[type] = (votes[type] || 0) + 1;
        localStorage.setItem("ghost_votes", JSON.stringify(votes));
        return votes
    }
}
