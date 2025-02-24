const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const db = new sqlite3.Database('./gateaux.db', (err) => {
    if (err) console.error(err.message);
    else console.log('Connecté à SQLite.');
});

// Création des tables
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS commandes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom_client TEXT NOT NULL,
        telephone TEXT NOT NULL,
        adresse TEXT NOT NULL,
        date TEXT DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS gateaux_commandes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        commande_id INTEGER NOT NULL,
        nom_gateau TEXT NOT NULL,
        quantite INTEGER NOT NULL,
        FOREIGN KEY (commande_id) REFERENCES commandes(id) ON DELETE CASCADE
    )`);
});

// Route pour récupérer toutes les commandes
app.get('/commandes', (req, res) => {
    const sql = `
        SELECT c.id, c.nom_client, c.telephone, c.adresse, c.date, 
               GROUP_CONCAT(g.nom_gateau || ' x' || g.quantite, ', ') AS gateaux
        FROM commandes c
        LEFT JOIN gateaux_commandes g ON c.id = g.commande_id
        GROUP BY c.id ORDER BY c.date DESC
        LIMIT 500`;

    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        const commande = rows.map(row => ({
            id: row.id,
            nom_client: row.nom_client,
            telephone: row.telephone,
            adresse: row.adresse,
            date: row.date,
            gateaux: row.gateaux ? row.gateaux.split(', ').map(gateau => {
            const [nom, quantite] = gateau.split(' x');
            return { nom, quantite: parseInt(quantite) };
            }) : []
        }));
        res.json(commande);
    });
});

// Route pour ajouter une commande
app.post('/commandes', (req, res) => {
    const { nom_client, telephone, adresse, gateaux } = req.body;

    if (!nom_client || !telephone || !adresse || !Array.isArray(gateaux) || gateaux.length === 0) {
        return res.status(400).json({ error: 'Données invalides' });
    }

    db.run("INSERT INTO commandes (nom_client, telephone, adresse) VALUES (?, ?, ?)", 
        [nom_client, telephone, adresse], 
        function (err) {
            if (err) return res.status(500).json({ error: err.message });

            const commandeId = this.lastID;
            const stmt = db.prepare("INSERT INTO gateaux_commandes (commande_id, nom_gateau, quantite) VALUES (?, ?, ?)");

            gateaux.forEach(gateau => {
                stmt.run(commandeId, gateau.nom, gateau.quantite);
            });

            stmt.finalize(() => {
                const newCommande = { id: commandeId, nom_client, telephone, adresse, gateaux, date: new Date().toISOString() };
                io.emit('nouvelle_commande', newCommande);
                res.status(201).json(newCommande);
            });
        }
    );
});

// Lancement du serveur
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Serveur en écoute sur http://localhost:${PORT}`);
});
