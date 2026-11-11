// Curated Gujarati to ISL Phrasebook & Translation Dictionary
export const phrasebookData = [
  // Greetings & Courtesies
  {
    gujarati: 'નમસ્તે',
    english: 'Namaste / Hello',
    tags: ['greeting', 'daily'],
    signDescription: 'બંને હાથ જોડી છાતી પાસે નમસ્કાર મુદ્રા કરો અને સહેજ નમન કરો.',
    category: 'અભિવાદન',
  },
  {
    gujarati: 'આભાર',
    english: 'Thank You',
    tags: ['greeting', 'daily'],
    signDescription: 'જમણા હાથના ટેરવા રામચીબુક (ચિન) પર મૂકી સ્મિત સાથે આગળની તરફ લંબાવો.',
    category: 'અભિવાદન',
  },
  {
    gujarati: 'શુભ સવાર',
    english: 'Good Morning',
    tags: ['greeting', 'daily'],
    signDescription: 'સૂર્યોદય દર્શાવવા નીચેથી હાથ ઉપર લાવો, પછી સારા હોવાનો અંગૂઠો (Thumbs Up) દર્શાવો.',
    category: 'અભિવાદન',
  },
  {
    gujarati: 'તમારું નામ શું છે?',
    english: 'What is your name?',
    tags: ['daily', 'question'],
    signDescription: 'તમારા તરફ હાથ કરો ("તમારું"), બંને હાથની H આંગળીઓ ટેપ કરો ("નામ"), અને પ્રશ્નાર્થ હાવભાવ સાથે હાથ ફેલાવો ("શું").',
    category: 'પ્રશ્નો',
  },
  {
    gujarati: 'હું વિદ્યાર્થી છું',
    english: 'I am a student',
    tags: ['school', 'student'],
    signDescription: 'છાતી પર હાથ ("હું"), કપાળથી પુસ્તક તરફ સાઇન ("અભ્યાસ કરનાર"), અને વ્યક્તિ નો સંકેત.',
    category: 'શાળા',
  },
  {
    gujarati: 'મને મદદ જોઈએ છે',
    english: 'I need help',
    tags: ['emergency', 'daily'],
    signDescription: 'ડાબી હથેળી પર જમણી મુઠ્ઠી થમ્બ્સ અપ રાખી બંને હાથ એકસાથે ઉપર ઉઠાવો ("મદદ").',
    category: 'જરૂરિયાત',
  },
  {
    gujarati: 'મને સમજાયું',
    english: 'I understood',
    tags: ['learning', 'daily'],
    signDescription: 'તર્જની આંગળી માથા પાસે ઊભી કરી બલ્બ પેટાતો હોય તેમ હકારાત્મક માથું ધુણાવો.',
    category: 'શિક્ષણ',
  },
  {
    gujarati: 'ફરીથી સમજાવો',
    english: 'Please explain again',
    tags: ['learning', 'school'],
    signDescription: 'હાથથી ગોળાકાર પુનરાવર્તન ("ફરીથી") અને બંને હથેળીઓ ખોલી સમજાવવાની મુદ્રા કરો.',
    category: 'શિક્ષણ',
  },

  // General School & Conversational Phrases
  {
    gujarati: 'તમારો પરિચય આપો',
    english: 'Introduce yourself',
    tags: ['daily', 'school', 'introduction'],
    signDescription: 'તમારા તરફ હથેળી દર્શાવી તમારી વિશે જણાવવા માટે બંને હાથ છાતીથી આગળ ખોલો.',
    category: 'પરિચય',
  },
  {
    gujarati: 'તમારો અભ્યાસ શું છે?',
    english: 'What is your qualification / education?',
    tags: ['school', 'education', 'question'],
    signDescription: 'ડિગ્રી ટોપી પહેરવાનો સંકેત અને પ્રશ્નાર્થ હાવભાવ સાથે હાથ ફેલાવો.',
    category: 'શિક્ષણ',
  },
  {
    gujarati: 'તમને કમ્પ્યુટર ચલાવતા આવડે છે?',
    english: 'Do you know how to operate a computer?',
    tags: ['school', 'learning', 'question'],
    signDescription: 'બંને હાથે કીબોર્ડ પર ટાઈપ કરવાનો અભિનય કરો અને આવડે છે નો પ્રશ્નાર્થ પૂછો.',
    category: 'શિક્ષણ',
  }
];

// Prototype test gestures for manual testing (AI landmark model not connected in prototype)
export const recognizedGesturesList = [
  { gesture: 'નમસ્તે (Greeting)', keypoints: '21 hand landmarks, both palms joined' },
  { gesture: 'કમળ (Lotus / ક)', keypoints: 'Fingers blooming outward' },
  { gesture: 'ઘર (House / ઘ)', keypoints: 'Fingertips forming triangle roof' },
  { gesture: 'પાણી (Water)', keypoints: 'W-shape tapping near chin' },
  { gesture: 'આભાર (Thank You)', keypoints: 'Hand moving from chin forward' },
  { gesture: 'સંખ્યા ૧ (One)', keypoints: 'Index finger vertical' },
  { gesture: 'સંખ્યા ૨ (Two)', keypoints: 'Index + Middle finger V shape' },
  { gesture: 'સંખ્યા ૫ (Five)', keypoints: 'All 5 fingers splayed open' }
];

