const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname)); // Pour servir le fichier HTML

// État initial
let motorStatus = {
    action: "idle",
    ms_par_tour: 2000,
    nbr: 1
};

// L'ESP32 appelle cette route pour savoir quoi faire
app.get('/commande.json', (req, res) => {
    res.json(motorStatus);
});

// L'interface Web appelle cette route quand on clique sur le bouton
app.post('/lancer', (req, res) => {
    if (motorStatus.action === "idle") {
        motorStatus.action = "run";
        motorStatus.nbr = parseInt(req.body.nbr) || 1;
        res.json({ success: true });
    } else {
        res.status(400).json({ error: "Moteur déjà en cours" });
    }
});

// L'ESP32 appelle cette route quand il a fini le travail
app.post('/fini', (req, res) => {
    motorStatus.action = "idle";
    console.log("Rotation terminée, interface déverrouillée.");
    res.json({ status: "ok" });
});

app.listen(port, () => {
    console.log(`Serveur lancé sur http://localhost:${port}`);
});