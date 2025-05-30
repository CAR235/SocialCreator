from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import torch
from transformers import pipeline, set_seed, AutoTokenizer, AutoModelForCausalLM
import time
import os
from dotenv import load_dotenv
from huggingface_hub import login
import re

app = Flask(__name__)
CORS(app)

# Carica le variabili d'ambiente dal file .env
load_dotenv()

# Autenticazione con Hugging Face
token = os.getenv("HUGGINGFACE_TOKEN")
if token:
    try:
        print("Autenticazione con Hugging Face...")
        login(token)
        print("Autenticazione completata!")
    except Exception as e:
        print(f"Errore durante l'autenticazione con Hugging Face: {e}")
        print("Continuazione con accesso anonimo...")
else:
    print("Token Hugging Face non trovato. Utilizzo accesso anonimo.")

print("Caricamento del modello di generazione AI...")

# Modelli GRATUITI che FUNZIONANO per la generazione di testo
WORKING_MODELS = [
    "gpt2",                    # GPT-2 base - sempre funziona
    "distilgpt2",             # GPT-2 più veloce
    "microsoft/DialoGPT-small", # Buono per testo conversazionale
    "EleutherAI/gpt-neo-125M"  # GPT-Neo piccolo ma potente
]

generator = None
tokenizer = None

# Prova a caricare il primo modello disponibile
for model_name in WORKING_MODELS:
    try:
        print(f"Tentativo caricamento: {model_name}")
        
        # Carica tokenizer e modello separatamente per maggiore controllo
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        
        # Imposta il pad_token se non esiste
        if tokenizer.pad_token is None:
            tokenizer.pad_token = tokenizer.eos_token
        
        # Crea la pipeline
        generator = pipeline(
            'text-generation',
            model=model_name,
            tokenizer=tokenizer,
            device=-1,  # CPU
            framework="pt"
        )
        
        set_seed(42)
        print(f"✅ Modello {model_name} caricato con successo!")
        break
        
    except Exception as e:
        print(f"❌ Errore caricamento {model_name}: {e}")
        generator = None
        tokenizer = None
        continue

if generator is None:
    print("🚨 ERRORE: Impossibile caricare alcun modello di generazione!")
    exit(1)

def clean_generated_text(text, prompt):
    """Pulisce il testo generato rimuovendo il prompt e caratteri indesiderati"""
    # Rimuovi il prompt originale
    if prompt in text:
        text = text.replace(prompt, "").strip()
    
    # Rimuovi caratteri di controllo e simboli strani
    text = re.sub(r'[^\w\s\.,!?\'\":;()\-–—""''àèéìîòóùúÀÈÉÌÎÒÓÙÚ]', '', text)
    
    # Prendi solo la prima frase/paragrafo sensato
    sentences = re.split(r'[.!?]\s+', text)
    if sentences and len(sentences[0]) > 10:
        result = sentences[0]
        # Aggiungi punto finale se manca
        if not result.endswith(('.', '!', '?')):
            result += '.'
        return result.strip()
    
    # Se non ci sono frasi valide, prendi le prime parole
    words = text.split()
    if len(words) >= 5:
        result = ' '.join(words[:15])
        if not result.endswith(('.', '!', '?')):
            result += '.'
        return result
    
    return text.strip()

def generate_caption(theme):
    """Genera una caption usando AI con prompt migliorati"""
    if generator is None:
        return f"❌ Modello AI non disponibile per il tema: {theme}"
    
    # Prompt più specifici e guidati
    caption_prompts = [
        f"Amazing {theme} moment! ",
        f"Loving this {theme} experience! ",
        f"Perfect {theme} day! ",
        f"Exploring {theme} today! ",
        f"Beautiful {theme} vibes! "
    ]
    
    try:
        # Scegli un prompt casuale
        prompt = random.choice(caption_prompts)
        
        # Genera il testo
        result = generator(
            prompt,
            max_length=len(prompt.split()) + 25,
            min_length=len(prompt.split()) + 8,
            num_return_sequences=1,
            temperature=0.7,  # Meno casualità
            top_k=40,
            top_p=0.8,
            do_sample=True,
            pad_token_id=tokenizer.pad_token_id,
            eos_token_id=tokenizer.eos_token_id,
            repetition_penalty=1.3
        )
        
        generated_text = result[0]['generated_text']
        
        # Pulizia più aggressiva
        caption = generated_text.strip()
        
        # Prendi solo la prima frase sensata
        sentences = re.split(r'[.!?]\s+', caption)
        if sentences and len(sentences[0]) > 10:
            caption = sentences[0]
            if not caption.endswith(('.', '!', '?')):
                caption += '!'
        
        # Limita lunghezza
        if len(caption) > 100:
            words = caption.split()
            caption = ' '.join(words[:15]) + '!'
        
        print(f"📝 Caption generata: {caption}")
        
        # Aggiungi emoji
        emojis = ["📸", "✨", "🔥", "💫", "🌟", "👌", "💯", "🎯"]
        if not any(emoji in caption for emoji in emojis):
            caption = f"{random.choice(emojis)} {caption}"
        
        return caption
        
    except Exception as e:
        print(f"❌ Errore generazione caption: {e}")
        
        # Fallback più intelligente
        fallback_captions = [
            f"📸 Capturing the essence of {theme}!",
            f"✨ {theme} never gets old!",
            f"🔥 This {theme} moment is everything!",
            f"💫 Living for these {theme} vibes!",
            f"🌟 {theme} at its finest!"
        ]
        
        return random.choice(fallback_captions)

def generate_post_ideas(theme):
    """Genera idee per post usando AI con prompt migliorati"""
    if generator is None:
        return [f"❌ Modello AI non disponibile per: {theme}"]
    
    ideas = []
    
    # Prompt più specifici per idee di post
    idea_starters = [
        f"5 tips for better {theme}",
        f"How to improve your {theme} skills",
        f"The secret to amazing {theme}",
        f"Why {theme} is important",
        f"Common {theme} mistakes to avoid",
        f"Best {theme} techniques for beginners"
    ]
    
    # Genera 5 idee usando starters diversi
    selected_starters = random.sample(idea_starters, min(5, len(idea_starters)))
    
    for starter in selected_starters:
        try:
            result = generator(
                starter,
                max_length=len(starter.split()) + 20,
                temperature=0.6,  # Meno casualità
                top_k=30,
                do_sample=True,
                pad_token_id=tokenizer.pad_token_id,
                repetition_penalty=1.4
            )
            
            generated_text = result[0]['generated_text'].strip()
            
            # Prendi la prima frase sensata
            sentences = re.split(r'[.!?]\s+', generated_text)
            if sentences and len(sentences[0]) > 15:
                idea = sentences[0]
                if not idea.endswith(('.', '!', '?')):
                    idea += '!'
                
                # Limita lunghezza
                if len(idea) > 80:
                    words = idea.split()
                    idea = ' '.join(words[:12]) + '!'
                
                ideas.append(idea)
                print(f"💡 Idea generata: {idea}")
            
        except Exception as e:
            print(f"❌ Errore generazione idea: {e}")
            # Usa il starter originale come fallback
            ideas.append(starter + "!")
    
    # Se non abbiamo abbastanza idee, aggiungi fallback
    fallback_ideas = [
        f"Behind the scenes of {theme}",
        f"My {theme} journey so far",
        f"What I learned about {theme} today",
        f"{theme} inspiration from around the world",
        f"Quick {theme} tips for busy people"
    ]
    
    while len(ideas) < 5:
        ideas.append(random.choice(fallback_ideas))
    
    return ideas[:5]

def generate_hashtags(theme):
    """Genera hashtag usando AI + logica intelligente"""
    hashtags = set()
    
    # Hashtag basati sul tema
    theme_words = re.findall(r'\w+', theme.lower())
    
    for word in theme_words:
        if len(word) > 2:
            hashtags.add(f"#{word}")
            hashtags.add(f"#{word}life")
            hashtags.add(f"#{word}tips")
    
    # Prova a generare hashtag con AI
    if generator:
        try:
            prompt = f"Popular hashtags for {theme}:"
            result = generator(
                prompt,
                max_length=len(prompt.split()) + 20,
                temperature=0.6,
                do_sample=True,
                pad_token_id=tokenizer.pad_token_id
            )
            
            generated_text = result[0]['generated_text']
            # Estrai possibili hashtag dal testo generato
            words = re.findall(r'\w+', generated_text.lower())
            
            for word in words:
                if 3 <= len(word) <= 20 and word not in ['the', 'and', 'for', 'are', 'this', 'that']:
                    hashtags.add(f"#{word}")
                    
        except Exception as e:
            print(f"❌ Errore generazione hashtag AI: {e}")
    
    # Hashtag popolari generici
    popular_tags = [
        "#instagood", "#photooftheday", "#follow", "#like4like",
        "#instadaily", "#picoftheday", "#followme", "#tagsforlikes",
        "#beautiful", "#happy", "#fun", "#smile", "#love"
    ]
    
    hashtags.update(popular_tags)
    
    # Converti in lista e mescola
    final_hashtags = list(hashtags)
    random.shuffle(final_hashtags)
    
    return final_hashtags[:15]

@app.route('/api/generate', methods=['POST'])
def generate_content():
    data = request.get_json()
    
    if not data or 'theme' not in data:
        return jsonify({'error': 'Tema mancante'}), 400
    
    theme = data['theme']
    start_time = time.time()
    
    print(f"🎯 Generazione AI per tema: '{theme}'")
    
    # Genera contenuti con AI
    caption = generate_caption(theme)
    post_ideas = generate_post_ideas(theme)
    hashtags = generate_hashtags(theme)
    
    processing_time = time.time() - start_time
    
    print(f"⏱️ Completato in {processing_time:.2f} secondi")
    
    return jsonify({
        'caption': caption,
        'post_ideas': post_ideas,
        'hashtags': hashtags,
        'ai_powered': True,
        'model_used': generator.model.name_or_path if generator else 'none',
        'processing_time': f"{processing_time:.2f} secondi"
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'ok',
        'ai_model_loaded': generator is not None,
        'model_name': generator.model.name_or_path if generator else 'none',
        'tokenizer_loaded': tokenizer is not None
    })

CORS(app, origins=["https://tuo-progetto.vercel.app"])

# Rimuovi la riga CORS duplicata alla fine
# E sostituisci con:
if __name__ == '__main__':
    print("🚀 Server avviato - Generazione AI attiva!")
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
