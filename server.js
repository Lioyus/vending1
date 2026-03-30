const express = require('express');
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// État initial
let motorStatus = {
    action: "idle",
    ms_par_tour: 2000,
    nbr: 1
};

// Routes
app.get('/commande.json', (req, res) => {
    res.json(motorStatus);
});

app.post('/lancer', (req, res) => {
    if (motorStatus.action === "idle") {
        motorStatus.action = "run";
        motorStatus.nbr = parseInt(req.body.nbr) || 1;
        res.json({ success: true });
    } else {
        res.status(400).json({ error: "Moteur déjà en cours" });
    }
});

app.post('/fini', (req, res) => {
    motorStatus.action = "idle";
    console.log("Rotation terminée, interface déverrouillée.");
    res.json({ status: "ok" });
});

// ⚠️ Place le static APRÈS les routes
app.use(express.static(__dirname));

app.listen(port, () => {
    console.log(`Serveur lancé sur port ${port}`);
});
