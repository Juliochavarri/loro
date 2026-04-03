export async function evaluateWithAI(imageBase64, mimeType, text, apiKey, lang = 'es') {
  if (!apiKey) {
    throw new Error('API Key is missing');
  }

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

  const modelsToTry = ['gemini-flash-latest', 'gemini-flash-lite-latest', 'gemini-2.5-flash-lite'];
  let lastError = null;

  for (const model of modelsToTry) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
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
      
      // Si el error indica llave inválida u otro error fatal que no es de sobrecarga, no reintentamos
      if (error.message.toLowerCase().includes('api key not valid')) {
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

export function evaluateWithHeuristics(text, lang = 'es') {
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

  // ── Improved examples (generic, context-independent) ─────────────────────
  const improvedExamples = {
    basic:
      'There are some people and objects in this picture. The colors are bright and the scene looks busy.',
    intermediate:
      'The image shows a lively scene where several people appear to be engaged in different activities. In the foreground, there are colorful objects that immediately catch the viewer\'s eye, while the background reveals a wider context.',
    advanced:
      'The image depicts a vibrant and dynamic scene in which individuals can be observed interacting with their surroundings. The foreground is dominated by a series of objects that suggest a sense of purposeful activity, while the background, though less defined, provides contextual details that enrich the overall composition and invite further interpretation.',
  };

  // ── Keywords by level ─────────────────────────────────────────────────────
  const KEYWORDS = {
    A1: ['color', 'person', 'big', 'there is'],
    A2: ['there are', 'next to', 'wearing', 'looks like'],
    B1: ['appears to', 'in the foreground', 'might be', 'while'],
    B2: ['depicts', 'is surrounded by', 'can be seen', 'in contrast'],
    C1: ['conveys', 'composition', 'predominantly', 'furthermore'],
    C2: ['juxtaposition', 'connotes', 'elucidates', 'cohesion'],
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
    keywords: KEYWORDS[level],
    isFallback: true,
  };
}
