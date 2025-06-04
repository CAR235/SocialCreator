# Social Creator AI Toolkit

Un'applicazione web fullstack che aiuta micro-influencer e content creator a generare automaticamente caption, idee per post e hashtag social basati su un tema o parola chiave inserita dall'utente.

## Caratteristiche

- **Generazione di caption**: crea caption brevi e accattivanti per i tuoi post social
- **Idee per contenuti**: ottieni 5 idee creative per post o video basate sul tuo tema
- **Hashtag pertinenti**: genera fino a 10 hashtag rilevanti per aumentare la visibilità dei tuoi contenuti
- **Interfaccia intuitiva**: design moderno e reattivo con Tailwind CSS

## Struttura del Progetto

```
social-creator-ai-toolkit/
├── backend/
│   ├── app.py                # Server Flask con l'endpoint API
│   └── requirements.txt      # Dipendenze Python
├── frontend/
│   ├── public/
│   │   ├── index.html       # File HTML principale
│   │   ├── manifest.json    # Manifest per PWA
│   │   └── logo.svg         # Logo dell'applicazione
│   ├── src/
│   │   ├── App.jsx          # Componente principale React
│   │   ├── index.js         # Punto di ingresso React
│   │   └── index.css        # Stili CSS con Tailwind
│   ├── package.json         # Dipendenze npm
│   ├── tailwind.config.js   # Configurazione Tailwind CSS
│   └── postcss.config.js    # Configurazione PostCSS
└── README.md                # Documentazione del progetto
```

## Requisiti

- Node.js (v14 o superiore)
- npm o yarn
- Python (v3.7 o superiore)
- pip (gestore pacchetti Python)

## Installazione

### Backend (Flask)

1. Naviga nella directory del progetto:
   ```bash
   cd social-creator-ai-toolkit
   ```

2. Crea un ambiente virtuale Python (opzionale ma consigliato):
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate
   
   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Installa le dipendenze Python:
   ```bash
   pip install -r requirements.txt
   ```

4. Avvia il server Flask:
   ```bash
   python app.py
   ```
   Il server sarà in esecuzione su http://localhost:5000

### Frontend (React)

1. In una nuova finestra del terminale, naviga nella directory del progetto:
   ```bash
   cd social-creator-ai-toolkit
   ```

2. Installa le dipendenze npm:
   ```bash
   npm install
   ```

3. Avvia l'applicazione React:
   ```bash
   npm start
   ```
   L'applicazione sarà disponibile su http://localhost:3000

## Utilizzo

1. Apri il browser e vai su http://localhost:3000
2. Inserisci un tema o una parola chiave nel campo di input (es. "fitness", "cucina vegana", "fotografia di viaggio")
3. Clicca sul pulsante "Genera Contenuti"
4. Visualizza e utilizza la caption, le idee per post e gli hashtag generati

## Personalizzazione

### Backend

Puoi personalizzare le funzioni di generazione in `app.py` per adattarle al tuo stile o aggiungere nuove funzionalità:

- `generate_caption()`: modifica o aggiungi nuovi template per le caption
- `generate_post_ideas()`: aggiungi nuove idee di contenuto
- `generate_hashtags()`: personalizza la logica di generazione degli hashtag

### Frontend

Puoi modificare l'interfaccia utente in `App.jsx` e personalizzare lo stile in `tailwind.config.js`:

- Cambia i colori del tema modificando l'oggetto `colors` in `tailwind.config.js`
- Aggiorna il layout o aggiungi nuovi componenti in `App.jsx`
- Modifica i font o aggiungi nuovi stili in `index.css`

## Deployment

### Backend

Per il deployment del backend, puoi utilizzare servizi come:
- Heroku
- PythonAnywhere
- AWS Elastic Beanstalk
- Google Cloud Run

### Frontend

Per il deployment del frontend, puoi utilizzare:
- Vercel
- Netlify
- GitHub Pages
- Firebase Hosting

Ricorda di aggiornare l'URL dell'API nel file `App.jsx` per puntare al tuo backend deployato.

## Licenza

Questo progetto è rilasciato con licenza MIT.

## Contatti

Per domande o suggerimenti, apri un issue su GitHub o contatta l'autore.

---

Creato con ❤️ per aiutare i content creator a brillare sui social media.
