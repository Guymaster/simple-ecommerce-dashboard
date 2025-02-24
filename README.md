# 🎂 API de Commandes de Gâteaux

Cette API permet aux clients de passer des commandes de gâteaux en spécifiant leur nom, leur numéro de téléphone, leur adresse et une liste de gâteaux avec leurs quantités. Une interface web affiche les commandes en temps réel grâce à WebSocket.

---

## 🚀 Installation et Lancement

### 📥 1. Cloner le projet
```bash
git clone https://github.com/Guymaster/simple-ecommerce-dashboard.git
cd simple-ecommerce-dashboard
```

### 📦 2. Installer les dépendances
```bash
npm install
```

### ▶️ 3. Lancer le serveur
```bash
node server.js
```

Le serveur sera accessible sur **http://localhost:3000**.

---

## 📌 Routes API

### 1️⃣ **Ajouter une commande**
**POST /commandes**

#### 📤 Requête (JSON)
```json
{
  "nom_client": "Alice Dupont",
  "telephone": "0601020304",
  "adresse": "12 Rue des Gâteaux, Paris",
  "gateaux": [
    { "nom": "Chocolat", "quantite": 2 },
    { "nom": "Vanille", "quantite": 1 }
  ]
}
```

#### 📥 Réponse (JSON)
```json
{
  "id": 1,
  "nom_client": "Alice Dupont",
  "telephone": "0601020304",
  "adresse": "12 Rue des Gâteaux, Paris",
  "gateaux": [
    { "nom": "Chocolat", "quantite": 2 },
    { "nom": "Vanille", "quantite": 1 }
  ],
  "date": "2025-02-24T12:34:56.789Z"
}
```

#### 🎯 Exemple en JavaScript (`fetch`)
```javascript
fetch("http://localhost:3000/commandes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        nom_client: "Alice Dupont",
        telephone: "0601020304",
        adresse: "12 Rue des Gâteaux, Paris",
        gateaux: [
            { nom: "Chocolat", quantite: 2 },
            { nom: "Vanille", quantite: 1 }
        ]
    })
})
.then(res => res.json())
.then(data => console.log("Commande ajoutée:", data))
.catch(err => console.error("Erreur:", err));
```

---

### 2️⃣ **Récupérer toutes les commandes**
**GET /commandes**

#### 📥 Réponse (JSON)
```json
[
  {
    "id": 1,
    "nom_client": "Alice Dupont",
    "telephone": "0601020304",
    "adresse": "12 Rue des Gâteaux, Paris",
    "gateaux": "Chocolat x2, Vanille x1",
    "date": "2025-02-24T12:34:56.789Z"
  }
]
```

#### 🎯 Exemple en JavaScript (`fetch`)
```javascript
fetch("http://localhost:3000/commandes")
    .then(res => res.json())
    .then(data => console.log("Commandes:", data))
    .catch(err => console.error("Erreur:", err));
```

---

## 🖥 Interface Web

L'interface permet de voir les commandes en direct sur **http://localhost:3000**.