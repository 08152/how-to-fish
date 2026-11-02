// ============================================
// FISH FRENZY - VERTEILER
// ============================================

const Verteiler = (() => {

    const dateien = [
        "insel.js",
        "leuchtturm.js"
    ];

    let geladen = 0;

    const loading = document.getElementById("loading");
    const progress = document.getElementById("progress");
    const status = document.getElementById("status");
    const error = document.getElementById("error");

    function updateProgress() {
        const prozent = Math.round((geladen / dateien.length) * 100);

        if (progress) {
            progress.style.width = prozent + "%";
        }

        if (status) {
            status.textContent =
                `Lade ${geladen} von ${dateien.length} Dateien...`;
        }
    }

    function ladeDatei(datei) {
        return new Promise((resolve, reject) => {

            const script = document.createElement("script");

            script.src = "./" + datei;
            script.async = false;

            script.onload = () => {
                geladen++;
                updateProgress();

                console.log("[VERTEILER] Geladen:", datei);

                resolve();
            };

            script.onerror = () => {
                reject(new Error("Datei konnte nicht geladen werden: " + datei));
            };

            document.body.appendChild(script);
        });
    }

    async function starten() {

        console.log("================================");
        console.log("FISH FRENZY STARTET");
        console.log("================================");

        updateProgress();

        try {

            for (const datei of dateien) {
                if (status) {
                    status.textContent = "Lade " + datei + "...";
                }

                await ladeDatei(datei);
            }

            if (status) {
                status.textContent = "Spielwelt geladen!";
            }

            if (progress) {
                progress.style.width = "100%";
            }

            console.log("[VERTEILER] Alle Dateien geladen.");

            setTimeout(() => {
                if (loading) {
                    loading.style.opacity = "0";

                    setTimeout(() => {
                        loading.style.display = "none";
                    }, 500);
                }
            }, 500);

        } catch (err) {

            console.error("[VERTEILER FEHLER]", err);

            if (status) {
                status.textContent = "Ladefehler!";
            }

            if (error) {
                error.style.display = "block";
                error.textContent = err.message;
            }
        }
    }

    return {
        starten
    };

})();

// ============================================
// START
// ============================================

Verteiler.starten();
