/* ============================================================
   INGER · Bascule FR / EN (i18n léger, sans backend)
   - dictionnaire FR -> EN appliqué aux nœuds texte + attributs
   - mémorise le choix (localStorage) ; met à jour <html lang>
   - évolutif : pour un vrai SEO multilingue, dupliquer en /en/
     avec balises hreflang (voir note bas de fichier).
   ============================================================ */
(function () {
  "use strict";
  if (window.__ingerI18n) return; window.__ingerI18n = true;

  /* ---------- Dictionnaire (FR -> EN) ----------
     Noms propres, clients, codes et fiches de références : non traduits. */
  var DICT = {
    // Nav
    "À propos": "About", "Savoir-faire": "Expertise", "Domaines": "Fields",
    "Références": "Projects", "Expertise": "Credentials", "FAQ": "FAQ",
    "Discuter d'un projet": "Discuss a project", "Nous contacter": "Contact us",
    "Ingénieurs & Experts Réunis": "Engineers & Experts United",
    // Hero
    "Ingénieurs Conseils — Études & Contrôle · Lomé, Togo": "Consulting Engineers — Studies & Supervision · Lomé, Togo",
    "Réaliser,": "Building,", "ensemble": "together",
    "Depuis 2000,": "Since 2000,",
    ", agréé par l'État, accompagne ses clients dans leurs projets d'infrastructure en Bâtiment, Routes, Hydraulique et Assainissement.":
      ", a State-accredited firm, supports its clients on infrastructure projects in Buildings, Roads, Hydraulics and Sanitation.",
    "+ ans": "+ yrs", "Années d'expérience": "Years of experience",
    "+ projets": "+ projects", "Projets livrés": "Projects delivered",
    "Agréments d'État": "State accreditations",
    "FIG.01 — Bâtiment IGH": "FIG.01 — High-rise building",
    "FIG.02 — Réseau hydraulique": "FIG.02 — Water network",
    "FIG.03 — Tracé routier": "FIG.03 — Road alignment",
    "Ministères": "Ministries", "Sociétés d'État": "State-owned companies",
    "Organismes internationaux": "International organisations",
    // About
    "01 / À propos": "01 / About",
    "Votre projet,": "Your project,", "notre": "our", "expertise.": "expertise.",
    "a une maturité en gestion de projet et réunit une expertise pluridisciplinaire pour une réussite totale de vos projets.":
      "brings mature project management and multidisciplinary expertise for the full success of your projects.",
    "Une longue et solide expérience en maîtrise de projets, accumulée depuis l'an 2000.":
      "Long, solid project-management experience built since the year 2000.",
    "Une expertise efficiente, fondée sur un réseau pluridisciplinaire — de professionnels et de firmes partenaires — éfficace.":
      "Efficient expertise, built on a multidisciplinary network of professionals and partner firms.",
    "Un plateau technique et une infrastructure logistique modernes et performants.":
      "Modern, high-performance technical resources and logistics.",
    "Plus de 150 projets livrés.": "More than 150 projects delivered.",
    "est une réponse adaptée et satisfaisante à chaque besoin.": "is a tailored, reliable answer to every need.",
    "... Pour rassurer aujourd'hui,": "... To reassure today,", "garantir": "to guarantee", "demain.": "tomorrow.",
    // Bento
    "Raison sociale": "Legal name", "Ingénieurs et Experts Réunis": "Engineers & Experts United",
    "ingénieurs-conseils en génie civil & équipements.": "consulting engineers in civil works & equipment.",
    "Création": "Founded", "Septembre": "September", "Expérience": "Experience", "ans": "yrs",
    "Bâtir durablement, avec exigence et précision": "Building sustainably, with rigour and precision",
    "Penser les ouvrages de demain": "Designing the works of tomorrow",
    "Une expertise au service des projets ambitieux": "Expertise serving ambitious projects",
    "Réalisations": "Projects", "Agréments": "Accreditations",
    "Siège social": "Head office", "Immeuble inger · Lomé": "inger Building · Lomé",
    "Réseau": "Network", "Réseau international de partenaires": "International partner network",
    "Ingénieurs, experts et firmes partenaires mobilisés selon les exigences de chaque mission.":
      "Engineers, experts and partner firms mobilised to meet the demands of each assignment.",
    // Skills
    "02 / Savoir-faire": "02 / Expertise", "Nos pôles": "Our", "pluridisciplinaire": "multidisciplinary practice",
    "Ingénierie Civile & Conseils": "Civil Engineering & Consulting",
    "Architecture & Design": "Architecture & Design", "Équipements": "Equipment",
    "Maîtrise d'ouvrage délégué / d'Œuvre": "Delegated project & works management",
    "Conception et Planification": "Design & Planning",
    "Études de Faisabilité / d'Exécution": "Feasibility & Detailed studies",
    "Contrôle et Suivi des projets": "Project control & supervision",
    "Expertise et Évaluation": "Expert appraisal & valuation", "Audit": "Audit",
    "Approche": "Approach", "Cinq principes directeurs": "Five guiding principles",
    "Fonctionnalité": "Functionality",
    "Conception minimaliste et ergonomique, orientée performance et durabilité des ouvrages.":
      "Minimalist, ergonomic design focused on performance and durability.",
    "L'aisance au bas mot !": "Comfort, to say the least!",
    "Esthétique": "Aesthetics",
    "Des choix esthètes associant les contextes historique et local, et la vision de chaque client.":
      "Refined choices blending historical and local context with each client's vision.",
    "Vous serez fiers!": "You will be proud!",
    "Stabilité": "Stability",
    "Le nec plus ultra des réponses structurales éprouvées, pour une solidité et performance intemporelle.":
      "The very best in proven structural solutions, for timeless strength and performance.",
    "Vous êtes en sécurité.": "You are safe.",
    "Économie": "Economy",
    "Optimisation rigoureuse des rapports qualité/coût des projets et de leurs réalisations.":
      "Rigorous optimisation of quality/cost ratios across projects and delivery.",
    "Votre investissement est sûr.": "Your investment is secure.",
    "Environnement": "Environment",
    "Immersion dans l'énergie renouvelable et intégration durable dans le tissu urbain et naturel.":
      "Renewable-energy focus and sustainable integration into the urban and natural fabric.",
    "Le vivre ensemble.": "Living well, together.",
    // Domains
    "03 / Prestations": "03 / Services", "Les grands domaines de compétences": "Our core areas of competence",
    "3 pôles,": "3 fields,", "une exigence": "one standard",
    "Agrément n° 02 001 · Cat. A2": "Accreditation No. 02 001 · Cat. A2",
    "Bâtiments": "Buildings", "Ingénierie civile · Architecture & design": "Civil engineering · Architecture & design",
    "Immeubles IGH/ERP — administratifs/sièges/polyvalents": "High-rise / public buildings — offices, headquarters, multi-use",
    "Établissements hôteliers/hospitaliers -& Habitats planifiés": "Hotel & healthcare facilities — planned housing",
    "Pôles industriels - Stades - Centres de jeux/Spectacles": "Industrial hubs - Stadiums - Leisure & event venues",
    "Infrastructures universitaire/scolaire/culturelle et cultuelle": "University, school, cultural & religious facilities",
    "Terminaux de transport & Équipements": "Transport terminals & equipment",
    "Agrément n° 06 001 · Cat. A2": "Accreditation No. 06 001 · Cat. A2",
    "Infrastructures routières": "Road infrastructure", "Ouvrages & voirie · VRD": "Structures & roads · earthworks",
    "Chaussées": "Carriageways & urban roads",
    "Ouvrages de drainage/assainissement": "Drainage & sanitation structures",
    "Ouvrages d'art/de franchissement": "Bridges & crossing structures",
    "Ouvrages de protection/signalisation/sécurité": "Protection, signage & safety structures",
    "Agrément n° 04 001 · Cat. A2": "Accreditation No. 04 001 · Cat. A2",
    "Hydraulique & Assainissement": "Hydraulics & Sanitation", "Eau · Énergie · Environnement": "Water · Energy · Environment",
    "Réseaux secs/humides - Réseaux d'assainissement": "Wet/dry networks - sanitation networks",
    "Alimentation en eau potable": "Drinking-water supply",
    "Hydraulique villageoise": "Rural water supply",
    "Réservoirs/Châteaux d'eau": "Reservoirs & water towers",
    "Retenues d'eau/Barrages - Équipements": "Reservoirs, dams & equipment",
    // Portfolio
    "04 / Portfolio": "04 / Portfolio", "L'étendue d'un": "The breadth of", "savoir-faire": "expertise",
    "Des réalisations qui illustrent l'exigence du savoir-faire de": "Projects that showcase the demanding expertise of",
    "— du complexe industriel multi-filières au cinq-étoiles, du siège corporate à l'ouvrage routier d'envergure.":
      "— from multi-sector industrial complexes to five-star hotels, from corporate headquarters to major road works.",
    "Industriel · Adétikopé, Togo": "Industrial · Adétikopé, Togo",
    "Plateforme Industrielle d'Adétikopé (PIA) — zone industrielle & port sec": "Adétikopé Industrial Platform (PIA) — industrial zone & dry port",
    "Corporate · Lomé": "Corporate · Lomé", "Siège TOGOTELECOM": "TOGOTELECOM Headquarters",
    "Institutionnel · Lomé": "Institutional · Lomé", "Bâtiment R+5 — Siège OTR": "R+5 Building — OTR Headquarters",
    "Siège ANGE — R+10": "ANGE Headquarters — R+10", "Hôtellerie · Lomé": "Hospitality · Lomé",
    "Hôtel ★★★★ St Pérégrin": "★★★★ St Pérégrin Hotel", "Résidentiel · Lomé": "Residential · Lomé",
    "154 villas très haut standing": "154 ultra-high-end villas", "Équipement public · Kara & Dapaong": "Public facility · Kara & Dapaong",
    "Marchés modernes de Kara et Dapaong": "Modern markets of Kara & Dapaong", "Espace public · Lomé": "Public space · Lomé",
    "Place de l'Indépendance — Réhabilitation": "Independence Square — Rehabilitation", "Industriel · Togo": "Industrial · Togo",
    "Brasserie SNB — complexe 6 ha": "SNB Brewery — 6 ha complex", "Hydraulique · Lomé": "Hydraulics · Lomé",
    "2 châteaux d'eau (duo)": "2 water towers (duo)", "Universitaire · Kara": "University · Kara",
    "Bloc pédagogique — Université de Kara": "Teaching block — University of Kara", "Commercial · Lomé": "Commercial · Lomé",
    "Centre commercial Renaissance": "Renaissance shopping centre", "Institutionnel · Lomé & Kara": "Institutional · Lomé & Kara",
    "Palais des Congrès — Réhabilitation": "Congress Palace — Rehabilitation",
    "Faites glisser": "Swipe", "Voir toutes les références": "See all projects",
    // Refs
    "05 / Références": "05 / Projects", "Maîtres d'ouvrage de référence": "Reference clients",
    "Les principales": "Our key", "réalisations": "achievements", "Soumettre un projet": "Submit a project",
    "Bâtiments & VRD": "Buildings & earthworks", "Routes & Hydraulique": "Roads & Hydraulics", "Expertises": "Appraisals",
    "Voir les 50 références": "See all 50 projects", "Voir les 30 références": "See all 30 projects",
    "Voir les 29 références": "See all 29 projects", "Voir les 18 références": "See all 18 projects",
    "Réduire la liste": "Show less",
    // Expertise / agréments
    "Expertise reconnue · L'exigence comme référence": "Recognised expertise · Rigour as a benchmark",
    "Les domaines": "Our strategic", "stratégiques": "fields",
    "Bâtiments Immobiliers": "Building & real estate",
    "Études et contrôle d'entretien, d'aménagement, de réhabilitation et de construction de bâtiments.":
      "Studies and supervision of building maintenance, development, rehabilitation and construction.",
    "Hydraulique Assainissement": "Hydraulics & Sanitation",
    "Études et contrôle d'ouvrages hydrauliques, d'assainissement et d'adduction d'eau potable.":
      "Studies and supervision of hydraulic, sanitation and drinking-water supply works.",
    "Études et contrôle de travaux d'infrastructure routière — entretien, construction et aménagement.":
      "Studies and supervision of road infrastructure — maintenance, construction and development.",
    "Arrêté interministériel n° 006 / MEF-MTP-CNAEBTP — République Togolaise · 20 décembre 2011":
      "Interministerial Order No. 006 / MEF-MTP-CNAEBTP — Republic of Togo · 20 December 2011",
    "Lire notre Politique Qualité": "Read our Quality Policy",
    // Zone
    "06 / Zone d'intervention": "06 / Area of operation", "Présence régionale": "Regional presence",
    "Une ambition": "An international", "internationale": "ambition",
    "Actif au Togo et dans l'espace UEMOA,": "Active in Togo and across the WAEMU area,",
    "développe des partenariats stratégiques pour une présence accrue en Afrique sub-saharienne et un rayonnement à l'international.":
      "develops strategic partnerships for a stronger presence in sub-Saharan Africa and international reach.",
    "Réalisations sur fonds d'investissement nationaux, régionaux et mondiaux.":
      "Projects funded by national, regional and global investment.",
    "États": "States", "Banque Mondiale": "World Bank",
    "LOMÉ · Siège social": "LOMÉ · Head office", "Zone d'activité UEMOA": "WAEMU operating area",
    // FAQ
    "07 / FAQ": "07 / FAQ", "Questions": "Frequently asked", "fréquentes": "questions",
    "Vous avez un projet ou souhaitez mieux comprendre les prestations de inger ?":
      "Have a project, or want to understand inger's services better?",
    "Voici les réponses aux questions les plus fréquemment posées.": "Here are answers to the most common questions.",
    "Contacter inger directement": "Contact inger directly",
    "Quels types de projets inger peut-il prendre en charge ?": "What types of project can inger handle?",
    "inger intervient sur l'ensemble des projets d'infrastructure : bâtiments (IGH, ERP, sièges administratifs, hôtellerie, santé, industrie, équipements scolaires et universitaires), infrastructures routières (chaussées, ouvrages d'art, drainage) ainsi qu'hydraulique et assainissement (AEP, châteaux d'eau, barrages, hydraulique villageoise).":
      "inger covers the full range of infrastructure projects: buildings (high-rise, public-access, head offices, hospitality, healthcare, industry, schools and universities), road infrastructure (carriageways, bridges, drainage), and hydraulics & sanitation (water supply, water towers, dams, rural water supply).",
    "Intervenez-vous en dehors du Togo ?": "Do you work outside Togo?",
    "Oui. inger est actif au Togo et dans l'espace UEMOA, et développe des partenariats stratégiques pour une présence accrue en Afrique sub-saharienne et un rayonnement à l'international.":
      "Yes. inger is active in Togo and across the WAEMU area, and builds strategic partnerships for a stronger presence in sub-Saharan Africa and international reach.",
    "Comment se déroule une mission de contrôle de travaux ?": "How does a works-supervision assignment work?",
    "Une mission de contrôle s'articule autour de la vérification de la conformité technique des ouvrages, du suivi de l'avancement et de la qualité d'exécution, du contrôle des décomptes, et de la production de rapports périodiques — jusqu'à la réception des travaux.":
      "A supervision assignment covers checking the technical compliance of works, monitoring progress and quality of execution, reviewing payment statements, and issuing periodic reports — through to final acceptance.",
    "Travaillez-vous avec des bailleurs de fonds internationaux ?": "Do you work with international funders?",
    "Oui. Nos réalisations s'appuient sur des fonds nationaux, régionaux et mondiaux : États, BOAD, BAD, BID, FED-UE, Banque Mondiale, FIDA, GAFSP — dans le respect des procédures propres à chaque institution.":
      "Yes. Our projects draw on national, regional and global funding: States, BOAD, AfDB, IsDB, EU-EDF, World Bank, IFAD, GAFSP — in line with each institution's own procedures.",
    "Quels logiciels et équipements utilisez-vous ?": "What software and equipment do you use?",
    "inger s'appuie sur un plateau technique et une infrastructure logistique modernes et performants, mobilisés selon les exigences techniques de chaque mission d'étude, de conception et de contrôle.":
      "inger relies on modern, high-performance technical resources and logistics, deployed to meet the technical demands of each study, design and supervision assignment.",
    "Comment soumettre un projet ou demander un devis ?": "How can I submit a project or request a quote?",
    "Vous pouvez nous transmettre votre projet via le formulaire de contact ci-dessous, ou nous joindre directement par téléphone, WhatsApp ou e-mail. Nous revenons vers vous avec une proposition adaptée à vos besoins.":
      "You can send us your project via the contact form below, or reach us directly by phone, WhatsApp or email. We will get back to you with a proposal tailored to your needs.",
    "Quelles sont vos qualifications officielles ?": "What are your official qualifications?",
    "inger est agréé par l'État togolais en catégorie A2 sur trois domaines : Bâtiments (n° 02 001), Hydraulique (n° 04 001) et Routes (n° 06 001) — conformément à l'arrêté interministériel n° 006 / MEF-MTP-CNAEBTP du 20 décembre 2011.":
      "inger is accredited by the Togolese State in category A2 across three fields: Buildings (No. 02 001), Hydraulics (No. 04 001) and Roads (No. 06 001) — under interministerial order No. 006 / MEF-MTP-CNAEBTP of 20 December 2011.",
    // Contact
    "08 / Contact": "08 / Contact", "Parlons-en": "Let's talk", "Donnons vie à votre": "Let's bring your", "projet": "project to life",
    "Adresse": "Address", "Immeuble inger": "inger Building",
    "Téléphone & WhatsApp": "Phone & WhatsApp", "Fixe : +228 22 50 17 30": "Landline: +228 22 50 17 30",
    "Mobile : +228 72 10 55 55": "Mobile: +228 72 10 55 55", "WhatsApp : +228 79 79 00 76": "WhatsApp: +228 79 79 00 76",
    "Email": "Email", "Site web & itinéraire": "Website & directions", "Itinéraire Google Maps →": "Google Maps directions →",
    "Soumettre une demande": "Submit a request",
    "Décrivez votre besoin, nous revenons vers vous rapidement.": "Describe your need — we'll get back to you quickly.",
    "Prénom": "First name", "Nom": "Last name", "Organisation & rôle": "Organisation & role", "Téléphone": "Phone",
    "Prestation recherchée": "Service required", "Sélectionner une prestation": "Select a service",
    "Conseils": "Consulting", "Conception / Planification": "Design / Planning",
    "Études de Faisabilité / Exécution": "Feasibility / Detailed studies",
    "Maîtrise d'Œuvre / Ouvrage délégué": "Works / Delegated project management",
    "Contrôle / Suivi": "Control / Supervision", "Expertise / Évaluation": "Appraisal / Valuation",
    "Domaine": "Field", "Sélectionner un domaine": "Select a field",
    "Hydraulique · Assainissement · AEP": "Hydraulics · Sanitation · Water supply", "Autre (préciser)": "Other (please specify)",
    "Description de votre projet": "Describe your project", "Envoyer la demande": "Send request",
    "Prototype de démonstration — formulaire non connecté.": "Demo prototype — form not connected.",
    // Footer
    "ensemble.": "together.", "Ingénieur-conseil — Études et contrôle.": "Consulting engineers — studies & supervision.",
    "Génie civil & équipements.": "Civil works & equipment.", "Lomé, TOGO.": "Lomé, TOGO.",
    "Bâtiments — Immobilier": "Buildings — Real estate", "Informations": "Information", "Contact": "Contact",
    "© 2026 INGER Sarlu — Ingénieurs et Experts Réunis — Lomé, Togo": "© 2026 INGER Sarlu — Engineers & Experts United — Lomé, Togo",
    "... pour rassurer aujourd'hui,": "... To reassure today,",
    "ingénieurs-conseils": "consulting engineers",
    "- Génie Civil & Équipements.": "- Civil works & equipment.",
    "Ingénieur conseil — Études et contrôle.": "Consulting engineer — studies & supervision.",
    "Contrôle et Suivi": "Control & supervision",
    "La fierté, dans l'absolu !": "Pride, in absolute terms!",
    "La sécurité, sans compromis !": "Safety, no compromise!",
    "Le vivre ensemble serein !": "Serene living together!",
    "L'investissement, avec parcimonie !": "Investment, with prudence!",
    "en harmonie avec l'environnement": "in harmony with the environment",
    "Ingénierie civile · Architecture": "Civil engineering · Architecture",
    "Établissements hôteliers/hospitaliers — Habitats planifiés": "Hotel & healthcare facilities — planned housing",
    "Pôles industriels — Stades — Centres de jeux/Spectacles": "Industrial hubs — Stadiums — Leisure & event venues",
    "Infrastructures universitaire/scolaire/culturelle/cultuelle": "University, school, cultural & religious facilities",
    "Terminaux de transport — Équipements": "Transport terminals — equipment",
    "Routes · VRD": "Roads · earthworks",
    "Ponts & Chaussées": "Bridges & carriageways",
    "Postes de péages/pesage — Équipements": "Toll & weighing stations — equipment",
    "Hydraulique": "Hydraulics",
    "Eau · Énergie": "Water · Energy",
    "Réseaux secs/humides — Réseaux d'assainissement": "Wet/dry networks — sanitation networks",
    "Approvisionement en eau potable & Forage": "Drinking-water supply & boreholes",
    "Retenues d'eau/Barrages": "Reservoirs & dams",
    "Canalisations de transport — Équipements": "Transport pipelines — equipment",
    "L'étendue d'une": "The breadth of",
    "compétence": "expertise",
    "Industriel - Port sec · Lomé, Togo": "Industrial - Dry port · Lomé, Togo",
    "Siège Office Togolais des Recettes (OTR)": "OTR headquarters (Office Togolais des Recettes)",
    "Siège (ANGE) — R+10": "ANGE headquarters — R+10",
    "Hôtel ★★★★ Lamessin (ex St Pérégrin)": "★★★★ Lamessin Hotel (ex St Pérégrin)",
    "Villas très haut standing": "Ultra-high-end villas",
    "Équipement public · Kara": "Public facility · Kara",
    "Marché moderne de Kara": "Modern market of Kara",
    "Équipement public · Dapaong": "Public facility · Dapaong",
    "Marché moderne de Dapaong": "Modern market of Dapaong",
    "Monument · Lomé": "Monument · Lomé",
    "Place de l'Indépendance": "Independence Square",
    "Industriel - Alimentaire · Togo": "Industrial - Food · Togo",
    "Brasserie SNB": "SNB Brewery",
    "Hydraulique - AEP · Lomé": "Hydraulics - Water supply · Lomé",
    "Châteaux d'eau duo": "Twin water towers",
    "03 immeubles": "03 buildings",
    "Conférence · Lomé": "Conference · Lomé",
    "Palais des Congrès": "Congress Palace",
    "Des réalisations triées sur le volet qui illustrent le champ riche en diversités de l'expérience active de": "A carefully curated selection of projects illustrating the rich diversity of the hands-on experience of",
    "En soumettant ce formulaire, je consens au traitement de mes données personnelles pour la gestion de ma demande de contact. Je peux révoquer mon consentement à tout moment en envoyant un email à ingersarlu@inger.tg. Vos données sont traitées de manière confidentielle et uniquement dans le cadre professionnel de votre demande. Nous mettons en œuvre les mesures techniques et organisationnelles nécessaires pour garantir leur sécurité et leur confidentialité.": "By submitting this form, I consent to the processing of my personal data to handle my contact request. I can withdraw my consent at any time by emailing ingersarlu@inger.tg. Your data is processed confidentially and solely in the professional context of your request. We implement the necessary technical and organisational measures to ensure its security and confidentiality.",
    "En savoir plus": "Learn more",
    "Politique de confidentialité": "Privacy policy",
    "Mentions légales": "Legal notice",
    "Carrière · INGER": "Careers · INGER",
    "Construire l'avenir,": "Building the future,",
    "Ingénieurs, projeteurs, conducteurs de travaux : rejoignez un bureau agréé qui façonne les infrastructures du Togo et de l'espace UEMOA.": "Engineers, designers, site managers: join an accredited firm shaping the infrastructure of Togo and the WAEMU region.",
    "Découvrir nos opportunités": "Explore our opportunities",
    "Carrière": "Careers",
    // Approche / piliers (textes mis à jour)
    "qualité, modernité, durabilité, résilience, pérénnité": "quality, modernity, durability, resilience, longevity",
    "Cinq objectifs, Cinq principes directeurs": "Five objectives, five guiding principles",
    "Conception subtile, ergonomique et évolutive, orientée équilibre et performance des ouvrages.":
      "Subtle, ergonomic and scalable design, focused on the balance and performance of every project.",
    "L'aisance, au bas mot !": "Ease, to say the least!",
    "Des choix esthètes réalistes associant les contextes historique et local, en phase avec la vision de chaque client.":
      "Refined, realistic choices blending historical and local context, in tune with each client's vision.",
    "Le nec plus ultra des réponses structurales éprouvées, pensées pour une solidité et performance intemporelles.":
      "The very best in proven structural solutions, engineered for timeless strength and performance.",
    "Optimisation rigoureuse des rapports coût à l'exigence de la qualité et à l'intransigeance des délais des réalisations.":
      "Rigorous optimisation of cost against the demands of quality and the strictness of project deadlines.",
    "Approche écologique / environnementale et immersion dans l'énergie renouvelable, pour une intégration harmonieuse dans le tissu urbain et naturel.":
      "Ecological and environmental approach with a focus on renewable energy, for harmonious integration into the urban and natural fabric.",
    "Le vivre ensemble, dans la sérénité !": "Living together, in serenity!",

    // Portfolio — captions enrichies
    "Industriel - Port sec · Lomé, TOGO": "Industrial - Dry port · Lomé, TOGO",
    "Industriel - Alimentaire · Lomé, TOGO": "Industrial - Food · Lomé, TOGO",
    "Corporate · Lomé, TOGO": "Corporate · Lomé, TOGO",
    "Hôtellerie · Lomé, TOGO": "Hospitality · Lomé, TOGO",
    "Hydraulique - AEP · Lomé, TOGO": "Hydraulics - Water supply · Lomé, TOGO",
    "Conférence · Lomé, TOGO": "Conference · Lomé, TOGO",
    "Bureau au siège de l'OTR": "Office at OTR headquarters",
    "Hôtel ★★★★ Laméssin": "★★★★ Laméssin Hotel",
    "Hôtel ★★★★ Laméssin de l'Hôpital de référence HDL": "★★★★ Laméssin Hotel — HDL Reference Hospital",
    "Immeubles IGH/ERP — Villas": "High-rise / public buildings — Villas",
    "Complexe de 03 immeubles — Habitats & Commerces": "03-building complex — Housing & retail",

    // Variantes hydrauliques / domaines
    "Approvisionement en eau potable & Forages": "Drinking-water supply & boreholes",

    // Identité / footer / hero alternatifs
    "INGER Sarlu — Ingénieurs & Experts Réunis": "INGER Sarlu — Engineers & Experts United",
    "INGER Sarlu — Ingénieurs & Experts Réunis · Lomé, TOGO": "INGER Sarlu — Engineers & Experts United · Lomé, TOGO",
    "INGER · Lomé, TOGO": "INGER · Lomé, TOGO",
    "Ingénieurs Conseils — Études & Contrôle · Lomé, TOGO": "Consulting Engineers — Studies & Supervision · Lomé, TOGO",
    "INGER — SARLU,": "INGER — SARLU,",
    "© 2026 INGER Sarlu — Ingénieurs et Experts Réunis · Lomé, Togo": "© 2026 INGER Sarlu — Engineers & Experts United · Lomé, Togo",

    // FIG / captions techniques
    "FIG.01 — Bâtiment IGH": "FIG.01 — High-rise building",
    "FIG.02 — Réseau hydraulique": "FIG.02 — Water network",
    "FIG.03 — Tracé routier": "FIG.03 — Road alignment",

    // États / pays (UI uniquement, garde les emblèmes de réf intactes)
    "BÉNIN": "BENIN",
    "CÔTE D'IVOIRE": "CÔTE D'IVOIRE",

    // Modale / formulaires — variantes
    "Caisse Nationale de Sécurité Sociale": "National Social Security Fund",
    "Caisse Nationale de Sécurité Sociale - CNSS": "National Social Security Fund - CNSS",
    "Cour Constitutionnelle": "Constitutional Court",
    "Cour Constitutionnelle du TOGO": "Constitutional Court of Togo",
    "Cour d'Appel de Lomé": "Court of Appeal of Lomé",
    "Fonds Routier": "Road Fund",
    "Fonds d'Entretien Routier (actuel SAFER)": "Road Maintenance Fund (now SAFER)",
    "Direction Générale de la Documentation Nationale – DGDN": "Directorate General of National Documentation – DGDN",
    "Africaine de Courtage et d'Assurance (ACA-TOGO)": "African Brokerage & Insurance (ACA-TOGO)",
    "Agence des Travaux d'Infrastructures du Burkina (AGETIB)": "Burkina Infrastructure Works Agency (AGETIB)",
    "Etude de Maître ASSOGBAVI Notaire à Lomé": "Maître ASSOGBAVI Notary Office, Lomé"
  };

  /* ---------- Collecte des nœuds traduisibles ---------- */
  var nodes = []; // {node, fr, en, isAttr, attr, lead, trail}
  function indexTextNodes(root) {
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        var p = n.parentNode; if (!p) return NodeFilter.FILTER_REJECT;
        var tag = p.nodeName; if (tag === "SCRIPT" || tag === "STYLE") return NodeFilter.FILTER_REJECT;
        if (p.closest && p.closest("#ic-panel,#ic-fab,#ic-nudge,.lang-switch")) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var n;
    while ((n = w.nextNode())) {
      var v = n.nodeValue, t = v.trim();
      if (DICT[t]) {
        nodes.push({ node: n, fr: t, en: DICT[t], isAttr: false,
          lead: v.match(/^\s*/)[0], trail: v.match(/\s*$/)[0] });
      }
    }
    // attributs
    var els = root.querySelectorAll("[placeholder],[alt],[aria-label],[title]");
    ["placeholder", "alt", "aria-label", "title"].forEach(function (attr) {
      els.forEach(function (e) {
        if (e.closest(".lang-switch,#ic-panel,#ic-fab,#ic-nudge")) return;
        var val = e.getAttribute(attr); if (!val) return; var t = val.trim();
        if (DICT[t]) nodes.push({ node: e, fr: t, en: DICT[t], isAttr: true, attr: attr, lead: "", trail: "" });
      });
    });
    // Elements with explicit data-fr/data-en attributes (e.g. modal Politique Qualité)
    root.querySelectorAll("[data-fr][data-en]").forEach(function (e) {
      var fr = e.getAttribute("data-fr"), en = e.getAttribute("data-en");
      if (!fr || !en) return;
      nodes.push({ node: e, fr: fr, en: en, isAttr: false, isHTML: true, lead: "", trail: "" });
    });
  }

  function apply(lang) {
    nodes.forEach(function (o) {
      var val = (lang === "en") ? o.en : o.fr;
      if (o.isAttr) o.node.setAttribute(o.attr, val);
      else if (o.isHTML) o.node.innerHTML = val;
      else o.node.nodeValue = o.lead + val + o.trail;
    });
    document.documentElement.setAttribute("lang", lang);
    document.querySelectorAll(".lang-opt").forEach(function (b) {
      var on = b.getAttribute("data-lang") === lang;
      b.classList.toggle("active", on); b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    try { localStorage.setItem("inger_lang", lang); } catch (e) {}
  }

  /* ---------- Init ---------- */
  function init() {
    indexTextNodes(document.body);
    document.querySelectorAll(".lang-opt").forEach(function (b) {
      b.addEventListener("click", function () { apply(b.getAttribute("data-lang")); });
    });
    var saved = "fr";
    try { saved = localStorage.getItem("inger_lang") || "fr"; } catch (e) {}
    apply(saved);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
/* ----------------------------------------------------------------
   NOTE SEO multilingue (évolution recommandée) :
   La bascule ci-dessus est côté client (1 seule URL) — idéale UX,
   neutre pour le SEO. Pour un référencement EN complet :
   1) générer une page /en/ (contenu traduit en dur),
   2) ajouter dans <head> :
      <link rel="alternate" hreflang="fr" href="https://www.inger.tg/">
      <link rel="alternate" hreflang="en" href="https://www.inger.tg/en/">
      <link rel="alternate" hreflang="x-default" href="https://www.inger.tg/">
   ---------------------------------------------------------------- */
