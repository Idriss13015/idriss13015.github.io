import os
import shutil
import zipfile

# Configuration
base_dir = "google_ads_variations"
logo_file = "Pikacheck-logo-alt-nobg.svg"
logo_path = os.path.abspath(logo_file)

if os.path.exists(base_dir):
    shutil.rmtree(base_dir)
os.makedirs(base_dir)

# Templates CSS & HTML
def get_html(config):
    bg_color = config.get('bg_color', '#ffffff')
    text_color = config.get('text_color', '#1d1d1f')
    sub_color = config.get('sub_color', '#86868b')
    btn_bg = config.get('btn_bg', '#5a50f3')
    btn_text = config.get('btn_text', '#ffffff')
    
    return f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="ad.size" content="width=320,height=480">
    <title>Pikacheck Ad</title>
    <style>
        body, html {{
            margin: 0;
            padding: 0;
            width: 320px;
            height: 480px;
            overflow: hidden;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: {bg_color};
            cursor: pointer;
        }}
        #ad-container {{
            width: 100%;
            height: 100%;
            position: relative;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            text-align: center;
            padding: 30px 30px 0 30px;
            border: 1px solid #d2d2d7;
        }}
        .logo-container {{
            margin-bottom: 30px;
            opacity: 0;
            animation: fadeIn 0.8s ease-out forwards 0.2s;
        }}
        .logo {{ width: 90px; height: auto; }}
        .headline {{
            color: {text_color};
            font-size: 26px;
            font-weight: 800;
            line-height: 1.2;
            margin-bottom: 15px;
            opacity: 0;
            transform: translateY(20px);
            animation: slideUp 0.8s ease-out forwards 0.5s;
        }}
        .subtitle {{
            color: {sub_color};
            font-size: 17px;
            margin-bottom: 35px;
            line-height: 1.4;
            font-weight: 400;
            opacity: 0;
            transform: translateY(20px);
            animation: slideUp 0.8s ease-out forwards 0.8s;
        }}
        .cta-btn {{
            background-color: {btn_bg};
            color: {btn_text};
            padding: 14px 32px;
            border-radius: 30px;
            text-decoration: none;
            font-weight: 600;
            font-size: 16px;
            opacity: 0;
            transform: scale(0.8);
            animation: popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards 1.1s;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: inline-block;
        }}
        @keyframes fadeIn {{ to {{ opacity: 1; }} }}
        @keyframes slideUp {{ to {{ opacity: 1; transform: translateY(0); }} }}
        @keyframes popIn {{ to {{ opacity: 1; transform: scale(1); }} }}
        #click-area {{
            position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 100;
        }}
    </style>
    <script type="text/javascript">
        var clickTag = "https://app.pikacheck.com"; 
    </script>
</head>
<body>
    <div id="ad-container">
        <a href="javascript:window.open(window.clickTag)" id="click-area"></a>
        <div class="logo-container">
            <img src="Pikacheck-logo-alt-nobg.svg" alt="Pikacheck" class="logo">
        </div>
        <div class="headline">{config['headline']}</div>
        <div class="subtitle">{config['subtitle']}</div>
        <div class="cta-btn">{config['cta']}</div>
    </div>
</body>
</html>"""

# Variations Data
variations = [
    # Focus: Scanner
    {"headline": "Scannez vos cartes<br>instantanément", "subtitle": "Reconnaissance visuelle<br>rapide et précise", "cta": "Scanner Maintenant"},
    {"headline": "Quelle est cette<br>carte Pokémon ?", "subtitle": "Identifiez-la en 1 seconde<br>avec Pikacheck", "cta": "Essayer le Scanner"},
    
    # Focus: Valeur / Prix
    {"headline": "Combien vaut<br>votre collection ?", "subtitle": "Suivi des prix Cardmarket<br>& eBay en temps réel", "cta": "Voir la Valeur", "bg_color": "#f5f5f7"},
    {"headline": "Suivez la cote<br>de vos cartes", "subtitle": "Graphiques et historique<br>de prix détaillés", "cta": "Consulter les cotes"},
    {"headline": "Stop aux<br>tableurs Excel", "subtitle": "Gérez votre portefeuille TCG<br>comme un pro", "cta": "Télécharger l'App", "bg_color": "#f0f4ff", "btn_bg": "#1d1d1f"},
    
    # Focus: Sealed Products
    {"headline": "Vous collectionnez<br>le scellé ?", "subtitle": "Suivi ETB, Displays et<br>Coffrets Pokémon", "cta": "Ajouter ma collection"},
    {"headline": "Boosters & ETB<br>dans votre poche", "subtitle": "Gérez votre stock de<br>produits scellés", "cta": "Gérer mon stock"},
    
    # Focus: Alerts & News
    {"headline": "Ne ratez aucune<br>sortie Pokémon", "subtitle": "Calendrier des sorties<br>& alertes de stock", "cta": "Activer les alertes", "bg_color": "#1d1d1f", "text_color": "#ffffff", "sub_color": "#a1a1a6"},
    {"headline": "Précommandes<br>& Restocks", "subtitle": "Soyez notifié avant<br>tout le monde", "cta": "Être notifié", "btn_bg": "#ffcc00", "btn_text": "#000000"},
    
    # Focus: Organization
    {"headline": "Organisez vos<br>classeurs", "subtitle": "L'outil ultime pour<br>les collectionneurs", "cta": "Organiser tout"},
    {"headline": "Toute votre collection<br>au même endroit", "subtitle": "Cartes, Scellé, Prix,<br>Alertes et plus", "cta": "Installer Gratuitement"},
    
    # Focus: Authority/Trust
    {"headline": "L'App N°1 pour<br>Collectionneurs", "subtitle": "Rejoignez plus de<br>30 000 passionnés", "cta": "Rejoindre la commu"},
    {"headline": "Données de prix<br>fiables", "subtitle": "Basé sur les ventes réelles<br>Cardmarket & eBay", "cta": "Vérifier un prix", "bg_color": "#f5f5f7"},
    
    # Focus: Features Mix
    {"headline": "Scanner.<br>Suivre.<br>Collectionner.", "subtitle": "L'application tout-en-un<br>100% Gratuite", "cta": "Télécharger", "btn_bg": "#000000"},
    {"headline": "Votre Pokédex<br>Financier", "subtitle": "Analysez la valeur de<br>chaque carte possédée", "cta": "Analyser"},
    
    # Visual / Short
    {"headline": "Collectionneur<br>Pokémon ?", "subtitle": "Vous avez besoin<br>de cette application", "cta": "C'est Gratuit"},
    {"headline": "Pikacheck", "subtitle": "Le compagnon ultime<br>de votre collection", "cta": "Ouvrir l'App", "btn_bg": "#5a50f3"},
    
    # Investment angle
    {"headline": "Investissez<br>intelligemment", "subtitle": "Indicateurs de tendance<br>et opportunités d'achat", "cta": "Voir les opportunités"},
    
    # Final strong CTA
    {"headline": "Disponible sur<br>iOS et Android", "subtitle": "Commencez votre collection<br>digitale aujourd'hui", "cta": "Installer maintenant"}
]

# Generation Loop
created_files = []

for i, config in enumerate(variations):
    version_num = i + 2 # Start at v2
    folder_name = f"pikacheck_ad_320x480_v{version_num}"
    folder_path = os.path.join(base_dir, folder_name)
    
    os.makedirs(folder_path, exist_ok=True)
    
    # Write HTML
    with open(os.path.join(folder_path, "index.html"), "w") as f:
        f.write(get_html(config))
        
    # Copy Logo
    shutil.copy(logo_path, os.path.join(folder_path, logo_file))
    
    # Zip it
    zip_name = f"{folder_name}.zip"
    zip_path = os.path.join(base_dir, zip_name)
    
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        zipf.write(os.path.join(folder_path, "index.html"), "index.html")
        zipf.write(os.path.join(folder_path, logo_file), logo_file)
    
    created_files.append(zip_name)

print(f"Generated {len(created_files)} variations.")
