const PROXY_URL = 'https://gemini-proxy.vercel.app/api/generate';

export async function evaluateWithAI(imageBase64, mimeType, text, _apiKey, lang = 'es') {
  const languageName = lang === 'en' ? 'English' : 'Spanish';

  const prompt = `
You are an expert English teacher evaluating a student's open description of an image.
You will receive an image and the student's text describing it. 

Student Text: "${text}"

13. Verify if the text ACTUALLY describes the image. If it does not, set isRelevant to false.
14. If it is relevant, determine the student's English CEFR level (A1, A2, B1, B2, C1, or C2).
15. Provide a short, direct, and completely honest assessment phrase (in ${languageName}) about their performance at "encouragement". Do not write fake praise if the text is very basic; be strictly realistic and objective about what they achieved.
16. Write a paragraph detailing their strengths (in ${languageName}) at "strengths".
17. Write a paragraph detailing what to improve (in ${languageName}) at "improvements".
18. Provide three improved examples of how to describe the image better (in English) mapped to "basic", "intermediate", and "advanced" at "improvedExamples".
19. Set "levelName" to a descriptive title in ${languageName} (e.g., "Basic", "Advanced", "Básico").
20. Provide exactly 4 related English vocabulary keywords mapped to the CEFR level regarding the image at "keywords".

Return ONLY a perfectly formatted JSON object with no markdown formatting and no backticks. Use the following schema strictly:
{
  "isRelevant": boolean,
  "level": "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "N/A",
  "levelName": string,
  "encouragement": string,
  "strengths": string,
  "improvements": string,
  "improvedExamples": {
    "basic": string,
    "intermediate": string,
    "advanced": string
  },
  "keywords": string[]
}
  `;

  const requestBody = {
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: mimeType || 'image/jpeg',
              data: imageBase64
            }
          }
        ]
      }
    ]
  };

  const modelsToTry = [
    'gemini-2.0-flash-lite',
    'gemini-2.0-flash',
  ];
  let lastError = null;

  for (const model of modelsToTry) {
    try {
      const response = await fetch(`${PROXY_URL}?model=${model}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch from Gemini API');
      }

      const data = await response.json();
      const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      // Clean up markdown just in case the LLM disobeys "no backticks" rule
      let cleanJson = candidateText.trim();
      if (cleanJson.startsWith('```json')) {
        cleanJson = cleanJson.replace(/^```json/i, '').replace(/```$/, '').trim();
      } else if (cleanJson.startsWith('```')) {
        cleanJson = cleanJson.replace(/^```/, '').replace(/```$/, '').trim();
      }

      const parsed = JSON.parse(cleanJson);
      return parsed; // Si fue exitoso, salimos del bucle y retornamos
      
    } catch (error) {
      console.warn(`[AI Eval] Fallo con ${model}:`, error.message);
      lastError = error;
      
      // No reintentar si el proxy devuelve error fatal (no de cuota)
      if (error.message.toLowerCase().includes('invalid') || error.message.toLowerCase().includes('unauthorized')) {
        throw error;
      }
      
      // Si es sobrecarga ("high demand"), el bucle intentará el siguiente modelo automáticamente
    }
  }

  // Si terminamos todos los modelos y ninguno funcionó
  throw lastError;
}

/**
 * Heuristic CEFR evaluator — runs entirely offline when Gemini is unavailable.
 * Analyses the student's text along several linguistic dimensions:
 *   • Quantity   — word count, sentence count
 *   • Diversity  — type-token ratio (unique / total words)
 *   • Complexity — modals, relative clauses, passive voice, conditionals,
 *                  subordinating conjunctions, discourse markers
 *   • Vocabulary — image-description register (B2) and academic register (C1+)
 *   • Spatial    — prepositional phrases that locate elements in an image
 */
// Basic English vocabulary used to detect if the text is actually English
const BASIC_ENGLISH = new Set([
  'i','see','there','is','are','the','a','an','this','that','it','its','be','am',
  'in','on','at','by','to','of','and','or','with','for','has','have','was','were',
  'been','can','could','will','would','should','may','might','not','no','some','any',
  'man','woman','people','person','child','boy','girl','dog','cat','car','house',
  'tree','water','sky','sun','color','red','blue','green','white','black','yellow',
  'big','small','large','old','new','tall','short','look','looks','stand','sit',
  'walk','run','hold','wear','carry','seems','appear','shows','shown','image','photo',
  'picture','background','foreground','left','right','center','front','back','top',
  'bottom','one','two','three','many','few','several','wearing','holding','sitting',
  'standing','walking','looking','between','around','behind','next','above','below',
  'inside','outside','light','dark','bright','scene','room','street','person','table',
  'chair','window','door','building','sky','ground','floor','wall','hand','head',
]);

// Category-specific keywords and improved example scenes for heuristic fallback
const CATEGORY_DATA = {
  technology: {
    keywords: { A1: ['computer', 'phone', 'screen', 'button'], A2: ['device', 'keyboard', 'cable', 'charging'], B1: ['software', 'wireless', 'interface', 'display'], B2: ['digital', 'bandwidth', 'processor', 'automated'], C1: ['infrastructure', 'algorithm', 'encrypted', 'integrated'], C2: ['interoperability', 'middleware', 'latency', 'scalable'] },
    scene: { basic: 'There is a computer on a desk. A person is using it.', intermediate: 'The image shows a person working at a computer. There is a keyboard and a screen in front of them. Some cables are visible on the desk.', advanced: 'The image depicts a modern workspace in which a person appears to be engaged with a digital device. Several pieces of technology, including a monitor and peripheral equipment, can be seen arranged on the desk, suggesting a professional environment.' },
  },
  biology: {
    keywords: { A1: ['plant', 'leaf', 'flower', 'tree'], A2: ['cell', 'root', 'grow', 'seed'], B1: ['organism', 'species', 'habitat', 'tissue'], B2: ['ecosystem', 'adaptation', 'microscope', 'specimen'], C1: ['taxonomy', 'biodiversity', 'photosynthesis', 'membrane'], C2: ['mitosis', 'symbiosis', 'chromosome', 'enzyme'] },
    scene: { basic: 'There is a plant with green leaves. It is very big.', intermediate: 'The image shows a detailed view of a plant. The leaves are bright green and the roots can be seen at the bottom. It looks like a natural environment.', advanced: 'The image depicts a botanical specimen whose intricate leaf structure reveals a complex pattern of veins, suggesting a well-developed vascular system characteristic of mature flora in a temperate ecosystem.' },
  },
  work: {
    keywords: { A1: ['office', 'desk', 'chair', 'pen'], A2: ['meeting', 'laptop', 'colleague', 'document'], B1: ['conference', 'presentation', 'deadline', 'client'], B2: ['collaboration', 'strategy', 'productivity', 'negotiate'], C1: ['stakeholder', 'workflow', 'delegation', 'corporate'], C2: ['synergy', 'procurement', 'organizational', 'leverage'] },
    scene: { basic: 'There are people in an office. They are working.', intermediate: 'The image shows a busy office environment where several people are seated at desks working on their computers. Some documents and notebooks are visible on the tables.', advanced: 'The image depicts a contemporary open-plan office in which colleagues appear to be collaborating on a project. The arrangement of workstations and shared resources suggests a focus on teamwork and efficient communication.' },
  },
  sports: {
    keywords: { A1: ['ball', 'run', 'team', 'game'], A2: ['player', 'score', 'court', 'match'], B1: ['athlete', 'compete', 'stadium', 'referee'], B2: ['tournament', 'championship', 'agility', 'strategy'], C1: ['endurance', 'coordination', 'sportsmanship', 'trajectory'], C2: ['biomechanics', 'tactical', 'physiological', 'aerodynamic'] },
    scene: { basic: 'People are playing a sport. They are running fast.', intermediate: 'The image shows athletes competing in a sporting event. One player appears to be in possession of the ball while others are running nearby. The crowd can be seen in the background.', advanced: 'The image captures a dynamic moment during what appears to be a competitive sporting event, in which athletes demonstrate remarkable agility and coordination as they strive to outmaneuver their opponents on the field.' },
  },
  nature: {
    keywords: { A1: ['tree', 'river', 'sky', 'grass'], A2: ['forest', 'mountain', 'cloud', 'sunset'], B1: ['landscape', 'wildlife', 'terrain', 'valley'], B2: ['vegetation', 'altitude', 'erosion', 'habitat'], C1: ['biodiversity', 'watershed', 'ecosystem', 'geological'], C2: ['topography', 'microclimate', 'sedimentary', 'indigenous'] },
    scene: { basic: 'There are trees and a river. The sky is blue.', intermediate: 'The image shows a peaceful natural landscape with tall green trees and a calm river in the foreground. The sky above is bright blue with a few white clouds.', advanced: 'The image depicts an expansive natural landscape in which dense vegetation lines the banks of a gently flowing river. The interplay of light and shadow across the terrain creates a sense of depth and tranquility characteristic of undisturbed wilderness.' },
  },
  animals: {
    keywords: { A1: ['dog', 'cat', 'bird', 'fish'], A2: ['wild', 'fur', 'wings', 'paw'], B1: ['predator', 'habitat', 'species', 'mammal'], B2: ['camouflage', 'nocturnal', 'instinct', 'migration'], C1: ['carnivorous', 'territorial', 'biodiversity', 'adaptation'], C2: ['phylogenetic', 'morphology', 'symbiotic', 'endemic'] },
    scene: { basic: 'There is a big animal. It has four legs.', intermediate: 'The image shows an animal standing in what appears to be its natural habitat. It is looking directly at the camera and its fur or feathers are clearly visible.', advanced: 'The image captures a striking portrait of an animal that appears entirely at ease within its natural environment. Its physical features, including coloring, posture, and expression, reveal subtle adaptations that reflect the demands of its ecosystem.' },
  },
  travel: {
    keywords: { A1: ['map', 'bag', 'plane', 'hotel'], A2: ['luggage', 'airport', 'ticket', 'journey'], B1: ['destination', 'itinerary', 'landmark', 'culture'], B2: ['expedition', 'customs', 'accommodation', 'excursion'], C1: ['cosmopolitan', 'infrastructure', 'heritage', 'immersive'], C2: ['geopolitical', 'nomadic', 'diplomatic', 'itinerant'] },
    scene: { basic: 'A person has a bag. They are at the airport.', intermediate: 'The image shows a traveler at what appears to be an airport or train station. They are carrying luggage and looking at a destination board. Other passengers can be seen in the background.', advanced: 'The image depicts a traveler navigating a busy transportation hub, their luggage suggesting an imminent departure. The surrounding architecture and signage point to an international setting, evoking a sense of cultural curiosity and adventure.' },
  },
  art: {
    keywords: { A1: ['paint', 'color', 'draw', 'brush'], A2: ['canvas', 'gallery', 'artist', 'style'], B1: ['sculpture', 'portrait', 'abstract', 'texture'], B2: ['composition', 'perspective', 'medium', 'technique'], C1: ['aesthetics', 'expressionism', 'patronage', 'curator'], C2: ['iconography', 'semiotics', 'chiaroscuro', 'provenance'] },
    scene: { basic: 'There is a painting on the wall. It has many colors.', intermediate: 'The image shows an artwork displayed in what appears to be a gallery. The painting features bold colors and interesting shapes that draw the viewer\'s eye across the canvas.', advanced: 'The image presents an evocative work of art in which the artist has masterfully employed contrasting tones and dynamic brushwork to create a sense of movement and emotional depth, inviting the viewer to interpret its layered meaning.' },
  },
  music: {
    keywords: { A1: ['song', 'sing', 'drum', 'guitar'], A2: ['concert', 'band', 'melody', 'rhythm'], B1: ['instrument', 'performance', 'audience', 'microphone'], B2: ['harmony', 'composition', 'acoustics', 'genre'], C1: ['orchestration', 'improvisation', 'virtuoso', 'timbre'], C2: ['counterpoint', 'polyrhythm', 'dissonance', 'philharmonic'] },
    scene: { basic: 'A person is playing music. They have a guitar.', intermediate: 'The image shows a musician performing on stage. They are playing a guitar and appear to be fully absorbed in the music. Stage lights illuminate the scene from above.', advanced: 'The image captures a live musical performance in which the musician, bathed in stage lighting, appears entirely immersed in the act of playing. The energy conveyed through their posture and expression suggests a deep emotional connection to the music.' },
  },
  food: {
    keywords: { A1: ['eat', 'dish', 'drink', 'fruit'], A2: ['recipe', 'ingredient', 'cook', 'meal'], B1: ['cuisine', 'flavor', 'portion', 'garnish'], B2: ['culinary', 'seasoning', 'texture', 'presentation'], C1: ['gastronomy', 'fermentation', 'umami', 'artisanal'], C2: ['molecular', 'provenance', 'terroir', 'emulsification'] },
    scene: { basic: 'There is food on a plate. It looks good.', intermediate: 'The image shows a well-presented dish on a dining table. The food appears freshly prepared and is decorated with colorful garnishes. A glass of water can also be seen nearby.', advanced: 'The image depicts an elegantly plated dish whose careful arrangement of ingredients reflects both culinary expertise and aesthetic sensibility. The vibrant colors and varied textures suggest a sophisticated palate and attention to the visual experience of dining.' },
  },
  fashion: {
    keywords: { A1: ['shirt', 'dress', 'shoes', 'hat'], A2: ['outfit', 'style', 'fabric', 'color'], B1: ['fashion', 'trend', 'designer', 'wardrobe'], B2: ['aesthetic', 'silhouette', 'collection', 'tailored'], C1: ['haute couture', 'minimalist', 'embroidered', 'sustainable'], C2: ['avant-garde', 'deconstructed', 'prêt-à-porter', 'sartorial'] },
    scene: { basic: 'A person is wearing nice clothes. The colors are bright.', intermediate: 'The image shows a person dressed in a stylish outfit. They are wearing a combination of colors that works well together, and their overall look appears very fashionable.', advanced: 'The image presents an individual whose carefully curated ensemble reflects a strong personal aesthetic. The interplay of textures, tones, and tailoring conveys a confident sense of style that draws on both contemporary trends and timeless elegance.' },
  },
  movies: {
    keywords: { A1: ['film', 'actor', 'scene', 'watch'], A2: ['director', 'cinema', 'screen', 'character'], B1: ['plot', 'genre', 'dialogue', 'special effects'], B2: ['cinematography', 'narrative', 'screenplay', 'sequence'], C1: ['mise-en-scène', 'protagonist', 'allegory', 'montage'], C2: ['auteur', 'diegetic', 'verisimilitude', 'denouement'] },
    scene: { basic: 'There are actors in a movie. The scene looks exciting.', intermediate: 'The image appears to be a film still showing actors in a dramatic scene. The lighting and camera angle create a tense atmosphere, suggesting an important moment in the story.', advanced: 'The image captures what appears to be a pivotal cinematic moment in which the actors\' expressions and the carefully constructed mise-en-scène combine to generate a palpable sense of tension, inviting the viewer to speculate about the narrative context.' },
  },
  school: {
    keywords: { A1: ['book', 'pen', 'class', 'teacher'], A2: ['student', 'lesson', 'homework', 'board'], B1: ['curriculum', 'lecture', 'assignment', 'campus'], B2: ['academic', 'curriculum', 'discipline', 'syllabus'], C1: ['pedagogy', 'scholarship', 'institution', 'assessment'], C2: ['epistemology', 'didactic', 'cognition', 'discourse'] },
    scene: { basic: 'There is a classroom. Students are reading books.', intermediate: 'The image shows a school classroom where several students are seated at desks. A teacher appears to be writing on the whiteboard at the front of the room.', advanced: 'The image depicts an active learning environment in which students appear engaged with the material being presented. The arrangement of desks and the presence of educational resources suggest a structured yet collaborative approach to instruction.' },
  },
  city: {
    keywords: { A1: ['street', 'car', 'building', 'road'], A2: ['traffic', 'sidewalk', 'bridge', 'bus'], B1: ['urban', 'district', 'pedestrian', 'landmark'], B2: ['metropolitan', 'infrastructure', 'commercial', 'transit'], C1: ['gentrification', 'zoning', 'skyline', 'municipality'], C2: ['urbanization', 'demographic', 'architectural', 'civic'] },
    scene: { basic: 'There are big buildings. Many cars are on the street.', intermediate: 'The image shows a busy city street with tall buildings on both sides. People are walking on the sidewalks and several cars can be seen in the traffic below.', advanced: 'The image captures the dynamic atmosphere of an urban center where the interplay of towering architecture, bustling pedestrian movement, and flowing traffic creates a vivid portrait of contemporary metropolitan life.' },
  },
  beach: {
    keywords: { A1: ['sea', 'sand', 'wave', 'sun'], A2: ['swim', 'coast', 'shore', 'towel'], B1: ['horizon', 'tropical', 'sunbathe', 'coastal'], B2: ['shoreline', 'tidal', 'seafront', 'marine'], C1: ['pristine', 'undulating', 'littoral', 'maritime'], C2: ['bathymetric', 'thalassic', 'pelagic', 'estuary'] },
    scene: { basic: 'There is a beach. The water is blue and the sand is white.', intermediate: 'The image shows a beautiful beach with clear blue water and golden sand. A few people can be seen relaxing near the shore while gentle waves break in the background.', advanced: 'The image depicts a serene coastal scene in which the vast expanse of turquoise water meets a gently curving shoreline. The interplay of light on the water\'s surface and the soft texture of the sand evoke a sense of tranquility and natural beauty.' },
  },
  health: {
    keywords: { A1: ['doctor', 'hospital', 'sick', 'medicine'], A2: ['patient', 'nurse', 'healthy', 'exercise'], B1: ['treatment', 'diagnosis', 'nutrition', 'fitness'], B2: ['symptom', 'prescription', 'therapy', 'prevention'], C1: ['rehabilitation', 'pathology', 'cardiovascular', 'immunology'], C2: ['epidemiology', 'pharmacological', 'oncology', 'prognosis'] },
    scene: { basic: 'A doctor is helping a patient. They are in a hospital.', intermediate: 'The image shows a medical professional attending to a patient in what appears to be a clinic or hospital room. Medical equipment can be seen in the background, and the atmosphere appears calm and professional.', advanced: 'The image depicts a healthcare setting in which a medical professional appears to be conducting an examination or consultation. The clinical environment, with its specialized equipment and sterile surroundings, conveys a sense of focused care and medical expertise.' },
  },
  shopping: {
    keywords: { A1: ['shop', 'buy', 'store', 'price'], A2: ['product', 'customer', 'receipt', 'sale'], B1: ['retailer', 'discount', 'browse', 'checkout'], B2: ['consumer', 'merchandise', 'transaction', 'vendor'], C1: ['procurement', 'commercial', 'expenditure', 'inventory'], C2: ['consumerism', 'commodification', 'retail', 'acquisition'] },
    scene: { basic: 'People are in a shop. There are many things to buy.', intermediate: 'The image shows a busy shopping area where customers are browsing through items on display. Colorful products line the shelves and a cashier can be seen at the counter.', advanced: 'The image depicts a vibrant retail environment in which shoppers navigate aisles stocked with an array of merchandise. The careful arrangement of products and the behavior of the customers suggest a dynamic consumer space designed to encourage exploration and purchase.' },
  },
  family: {
    keywords: { A1: ['mom', 'dad', 'child', 'home'], A2: ['parent', 'sibling', 'together', 'dinner'], B1: ['household', 'gathering', 'relative', 'celebrate'], B2: ['generation', 'nurture', 'bond', 'tradition'], C1: ['kinship', 'upbringing', 'familial', 'heritage'], C2: ['socialization', 'intergenerational', 'lineage', 'matriarchal'] },
    scene: { basic: 'A family is together. They look happy.', intermediate: 'The image shows a family gathered together, possibly for a meal or celebration. Adults and children are smiling and appear to be enjoying each other\'s company in a warm home setting.', advanced: 'The image captures a tender family moment in which members of different generations appear united in a shared activity. The warmth conveyed through their expressions and proximity reflects the deep bonds of affection and mutual support that characterize close family relationships.' },
  },
};

export function evaluateWithHeuristics(text, lang = 'es', category = 'all') {
  const isEs = lang === 'es';

  if (!text || text.trim().length < 3) {
    return {
      isRelevant: false,
      level: 'A1',
      levelName: isEs ? 'Sin respuesta' : 'No response',
      encouragement: isEs ? 'No se detectó texto.' : 'No text detected.',
      strengths: '',
      improvements: isEs
        ? 'Escribe una descripción de la imagen.'
        : 'Write a description of the image.',
      improvedExamples: { basic: '', intermediate: '', advanced: '' },
      keywords: [],
      isFallback: true,
    };
  }

  // ── Tokenise ──────────────────────────────────────────────────────────────
  const raw = text.trim();
  const sentences = raw.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = raw.toLowerCase().match(/\b[a-z']+\b/g) || [];
  const uniqueWords = new Set(words);
  const wordCount = words.length;
  const uniqueCount = uniqueWords.size;
  const avgSentLen = sentences.length > 0 ? wordCount / sentences.length : wordCount;
  const ttr = wordCount > 0 ? uniqueCount / wordCount : 0;
  const t = raw.toLowerCase();

  // ── Structural / grammatical patterns ────────────────────────────────────
  const hasContinuous    = /\b(is|are|am)\s+\w+ing\b/.test(t);
  const hasModals        = /\b(can|could|will|would|should|might|may|must|shall)\b/.test(t);
  const hasRelative      = /\b(which|who|whose|whom|that)\b/.test(t);
  const hasB1Connectors  = /\b(because|since|although|while|when|after|before|so that|in order to|however|therefore|also|as well)\b/.test(t);
  const hasPerfect       = /\b(has|have|had)\s+(been\s+)?\w+(ed|en|n)\b/.test(t);
  const hasPassive       = /\b(is|are|was|were|been|being)\s+\w+(ed|en)\b/.test(t);
  const hasConditional   = /\bif\b.{1,80}\b(would|could|might|will)\b/i.test(raw);
  const hasB2Markers     = /\b(furthermore|moreover|nevertheless|consequently|whereas|despite|in contrast|on the other hand|in addition|as a result|notably|in particular)\b/.test(t);
  const hasC1Markers     = /\b(notwithstanding|albeit|insofar|hitherto|therein|whereby|inasmuch|such that|provided that|to the extent that)\b/.test(t);

  // ── Vocabulary registers ──────────────────────────────────────────────────
  const hasB2Vocab = /\b(depicts|portrays|illustrates|conveys|evident|prominent|foreground|background|composition|suggests|implies|appears|occupies|demonstrates|features|visible|situated|positioned|reveals|captures|surrounded|displayed|presented|characterized|dominated|filled|covered)\b/.test(t);
  const hasC1Vocab = /\b(juxtaposition|predominantly|meticulously|exemplifies|connotes|symbolizes|rendered|embodies|encapsulates|accentuates|nuanced|elucidates|manifests|denotes|emblematic|evocative)\b/.test(t);

  // ── Adjective richness ────────────────────────────────────────────────────
  const adjectives = (t.match(/\b(large|small|big|little|old|new|young|beautiful|colorful|bright|dark|tall|short|long|wide|narrow|round|square|red|blue|green|yellow|white|black|wooden|metal|modern|ancient|busy|quiet|crowded|empty|clear|vivid|pale|dense|lush|vast|tiny|enormous|elegant|sleek|rustic|vibrant|gloomy|serene|chaotic|tidy|messy|shiny|transparent|warm|cool|soft|hard|smooth|rough|flat|curved|open|closed|natural|artificial|central|distant|nearby)\b/g) || []);
  const adjCount = adjectives.length;

  // ── Spatial / locative expressions ───────────────────────────────────────
  const hasSpatial = /\b(in front of|behind|next to|on top of|underneath|in the background|in the foreground|to the left|to the right|in the center|at the bottom|at the top|beside|near|around|between|across from|on the left|on the right)\b/.test(t);

  // ── Scoring ───────────────────────────────────────────────────────────────
  let score = 0;

  // Quantity
  if (wordCount >= 5)  score += 1;
  if (wordCount >= 12) score += 1;
  if (wordCount >= 25) score += 1;
  if (wordCount >= 45) score += 1;
  if (wordCount >= 70) score += 1;

  // Diversity
  if (uniqueCount >= 8)  score += 1;
  if (uniqueCount >= 18) score += 1;
  if (ttr > 0.7)         score += 1;

  // Sentence length
  if (avgSentLen >= 7)  score += 1;
  if (avgSentLen >= 11) score += 1;

  // Grammar
  if (hasContinuous)   score += 1;
  if (hasModals)       score += 1;
  if (hasRelative)     score += 2;
  if (hasB1Connectors) score += 1;
  if (hasPerfect)      score += 1;
  if (hasPassive)      score += 2;
  if (hasConditional)  score += 2;
  if (hasB2Markers)    score += 3;
  if (hasC1Markers)    score += 3;

  // Vocabulary
  if (hasB2Vocab)  score += 3;
  if (hasC1Vocab)  score += 4;

  // Richness
  if (adjCount >= 2)         score += 1;
  if (adjCount >= 4)         score += 1;
  if (hasSpatial)            score += 1;
  if (sentences.length >= 3) score += 1;
  if (sentences.length >= 5) score += 1;

  // ── CEFR level ────────────────────────────────────────────────────────────
  let level;
  if      (score <= 4)  level = 'A1';
  else if (score <= 8)  level = 'A2';
  else if (score <= 13) level = 'B1';
  else if (score <= 19) level = 'B2';
  else if (score <= 25) level = 'C1';
  else                  level = 'C2';

  // ── Level names ───────────────────────────────────────────────────────────
  const NAMES = {
    es: { A1: 'Principiante', A2: 'Elemental', B1: 'Intermedio', B2: 'Intermedio-Alto', C1: 'Avanzado', C2: 'Maestría' },
    en: { A1: 'Beginner',     A2: 'Elementary', B1: 'Intermediate', B2: 'Upper-Intermediate', C1: 'Advanced', C2: 'Mastery' },
  };
  const levelName = (isEs ? NAMES.es : NAMES.en)[level];

  // ── Encouragement ─────────────────────────────────────────────────────────
  const suffix = isEs
    ? ' (análisis lingüístico — sin evaluación visual)'
    : ' (linguistic analysis — no visual evaluation)';
  const ENC = {
    es: {
      A1: (wordCount < 5 ? 'Intenta escribir oraciones completas.' : 'Buen comienzo. Añade más detalles.') + suffix,
      A2: 'Vocabulario básico correcto. Combina oraciones con conectores.' + suffix,
      B1: 'Buen inglés cotidiano. Incorpora variedad estructural.' + suffix,
      B2: 'Descripción sólida. Profundiza en voz pasiva y subordinadas.' + suffix,
      C1: 'Excelente dominio. Descripción precisa y articulada.' + suffix,
      C2: 'Nivel de maestría. Sofisticado y expresivo.' + suffix,
    },
    en: {
      A1: (wordCount < 5 ? 'Try to write complete sentences.' : 'Good start! Add more details.') + suffix,
      A2: 'Basic vocabulary used correctly. Combine sentences with connectors.' + suffix,
      B1: 'Good everyday English. Aim for more structural variety.' + suffix,
      B2: 'Solid description. Deepen passive voice and subordinate clauses.' + suffix,
      C1: 'Excellent command. Precise and well-articulated.' + suffix,
      C2: 'Mastery level. Sophisticated and expressive.' + suffix,
    },
  };
  const encouragement = (isEs ? ENC.es : ENC.en)[level];

  // ── Strengths ─────────────────────────────────────────────────────────────
  const strList = [];
  if (wordCount >= 25)   strList.push(isEs ? `Buena extensión: ${wordCount} palabras` : `Good length: ${wordCount} words`);
  if (uniqueCount >= 15) strList.push(isEs ? `Vocabulario variado: ${uniqueCount} palabras distintas` : `Varied vocabulary: ${uniqueCount} unique words`);
  if (hasSpatial)        strList.push(isEs ? 'Usas expresiones de lugar para ubicar elementos (in the foreground, next to, etc.)' : 'You use spatial expressions to locate elements (in the foreground, next to, etc.)');
  if (hasContinuous)     strList.push(isEs ? 'Usas el presente continuo correctamente para describir acciones' : 'You correctly use present continuous to describe ongoing actions');
  if (hasModals)         strList.push(isEs ? 'Los verbos modales añaden matiz e incertidumbre a tu descripción' : 'Modal verbs add nuance and speculation to your description');
  if (hasRelative)       strList.push(isEs ? 'Las cláusulas relativas amplían la información de manera cohesionada' : 'Relative clauses expand information in a cohesive way');
  if (hasPassive)        strList.push(isEs ? 'Empleas la voz pasiva de forma efectiva, propio de un nivel B2' : 'You effectively employ passive voice, characteristic of B2 level');
  if (hasB2Vocab)        strList.push(isEs ? 'Usas vocabulario descriptivo específico para imágenes (depicts, features, visible…)' : 'You use image-specific descriptive vocabulary (depicts, features, visible…)');
  if (hasB2Markers)      strList.push(isEs ? 'Los marcadores discursivos avanzados dan cohesión al texto' : 'Advanced discourse markers give the text cohesion');
  if (adjCount >= 2)     strList.push(isEs ? `Incluyes ${adjCount} adjetivos descriptivos que enriquecen la imagen` : `You include ${adjCount} descriptive adjectives that enrich the picture`);
  if (sentences.length >= 3) strList.push(isEs ? `Estructuras tu respuesta en ${sentences.length} oraciones` : `You structure your answer in ${sentences.length} sentences`);
  if (strList.length === 0) strList.push(isEs ? 'Hiciste un intento por describir la imagen en inglés' : 'You made an attempt to describe the image in English');

  // ── Improvements ─────────────────────────────────────────────────────────
  const impList = [];
  if (wordCount < 20)
    impList.push(isEs
      ? `Amplía tu descripción (actualmente ${wordCount} palabra(s)); apunta a más de 30`
      : `Expand your description (currently ${wordCount} word(s)); aim for 30+`);
  if (!hasSpatial)
    impList.push(isEs
      ? 'Añade expresiones de lugar: "in the foreground", "to the left", "in the background"'
      : 'Add spatial expressions: "in the foreground", "to the left", "in the background"');
  if (!hasModals && ['B1','B2','C1','C2'].includes(level))
    impList.push(isEs
      ? 'Usa modales para especular: "It seems to be…", "There might be…", "This could represent…"'
      : 'Use modals to speculate: "It seems to be…", "There might be…", "This could represent…"');
  if (!hasRelative && ['B1','B2','C1','C2'].includes(level))
    impList.push(isEs
      ? 'Conecta ideas con cláusulas relativas: "…which shows…", "…that appears to…"'
      : 'Connect ideas with relative clauses: "…which shows…", "…that appears to…"');
  if (!hasPassive && ['B2','C1','C2'].includes(level))
    impList.push(isEs
      ? 'Incorpora la voz pasiva: "The image is dominated by…", "Several objects can be seen…"'
      : 'Incorporate passive voice: "The image is dominated by…", "Several objects can be seen…"');
  if (!hasB2Vocab && ['B2','C1','C2'].includes(level))
    impList.push(isEs
      ? 'Usa vocabulario de descripción visual: depicts, portrays, foreground, background, composition'
      : 'Use visual-description vocabulary: depicts, portrays, foreground, background, composition');
  if (!hasB2Markers && ['C1','C2'].includes(level))
    impList.push(isEs
      ? 'Añade marcadores avanzados: "Furthermore", "In contrast", "Consequently", "Nevertheless"'
      : 'Add advanced markers: "Furthermore", "In contrast", "Consequently", "Nevertheless"');
  if (ttr < 0.6 && wordCount > 15)
    impList.push(isEs
      ? 'Evita repetir las mismas palabras; diversifica tu vocabulario'
      : 'Avoid repeating the same words; diversify your vocabulary');
  if (impList.length === 0)
    impList.push(isEs
      ? 'Sigue ampliando descripciones con vocabulario más sofisticado y estructuras variadas'
      : 'Keep expanding descriptions with more sophisticated vocabulary and varied structures');

  // ── Improved examples — category-aware when possible ─────────────────────
  const catData = CATEGORY_DATA[category];
  const improvedExamples = catData
    ? catData.scene
    : {
        basic:
          'There are some people and objects in this picture. The colors are bright and the scene looks busy.',
        intermediate:
          'The image shows a lively scene where several people appear to be engaged in different activities. In the foreground, there are colorful objects that immediately catch the viewer\'s eye, while the background reveals a wider context.',
        advanced:
          'The image depicts a vibrant and dynamic scene in which individuals can be observed interacting with their surroundings. The foreground is dominated by a series of objects that suggest a sense of purposeful activity, while the background, though less defined, provides contextual details that enrich the overall composition and invite further interpretation.',
      };

  // ── Keywords per tab (basic→A1, intermediate→B1, advanced→C1) ───────────
  const LEVEL_KEYWORDS = {
    A1: ['color', 'person', 'big', 'there is'],
    B1: ['appears to', 'in the foreground', 'might be', 'while'],
    C1: ['conveys', 'composition', 'predominantly', 'furthermore'],
  };
  const keywordsByTab = {
    basic:        catData ? catData.keywords['A1'] : LEVEL_KEYWORDS['A1'],
    intermediate: catData ? catData.keywords['B1'] : LEVEL_KEYWORDS['B1'],
    advanced:     catData ? catData.keywords['C1'] : LEVEL_KEYWORDS['C1'],
  };

  // ── isRelevant — detecta texto no inglés o completamente incoherente ────────
  const alphaWords = words.filter(w => /^[a-z]{2,}$/.test(w));
  const knownEnglishCount = alphaWords.filter(w => BASIC_ENGLISH.has(w)).length;

  // Detecta si el texto contiene lenguaje visual (colores, posiciones, objetos, acciones descriptivas)
  const hasVisualContent =
    /\b(red|blue|green|yellow|white|black|orange|purple|brown|pink|gray|grey|dark|light|bright|colorful)\b/.test(t) ||
    /\b(left|right|center|middle|top|bottom|background|foreground|front|back|above|below|beside|next to|in front|behind|near|around)\b/.test(t) ||
    /\b(there is|there are|i can see|you can see|the image|the picture|the photo|shows|show|depicts|features|contains)\b/.test(t) ||
    /\b(standing|sitting|walking|running|holding|wearing|looking|smiling|lying|playing|working|eating|drinking|talking)\b/.test(t) ||
    /\b(person|man|woman|people|child|boy|girl|animal|dog|cat|car|house|tree|building|table|chair|room|street|sky|water|floor|wall|window|hand|face|object)\b/.test(t);

  // Relevante si: ≥4 palabras, ≥1 palabra inglesa reconocida, Y contiene lenguaje visual/descriptivo
  const isRelevant = wordCount >= 4 && knownEnglishCount >= 1 && hasVisualContent;

  if (!isRelevant) {
    return {
      isRelevant: false,
      level: 'N/A',
      levelName: isEs ? 'No válido' : 'Invalid',
      encouragement: isEs
        ? 'Tu texto no parece ser una descripción en inglés. Intenta describir la imagen con palabras en inglés.'
        : 'Your text does not appear to be an English description. Try describing the image in English.',
      strengths: '',
      improvements: isEs
        ? 'Describe lo que ves en la imagen usando inglés: colores, objetos, personas, acciones.'
        : 'Describe what you see in the image using English: colors, objects, people, actions.',
      improvedExamples: { basic: '', intermediate: '', advanced: '' },
      keywords: [],
      isFallback: true,
    };
  }

  return {
    isRelevant: true,
    level,
    levelName,
    encouragement,
    strengths: strList.join('. ') + '.',
    improvements: impList.join('. ') + '.',
    improvedExamples,
    keywordsByTab,
    isFallback: true,
  };
}
