// Mathematics Module Data (ગુજરાતી ગણિત શિક્ષણ)
export const mathLessons = {
  tables: [
    {
      id: 'table-2',
      title: '૨ નો ઘડિયો (Table of 2)',
      number: 2,
      gujaratiNumeral: '૨',
      signOverview: 'બે નો સંકેત (V આકાર) રાખી ક્રમશઃ ગુણાકાર કરવાનો સાઇન સંકેત.',
      rows: [
        { exp: '૨ × ૧ = ૨', speech: 'બે એકા બે', eng: '2 x 1 = 2', islSign: '૨ x ૧ = ૨ (સાઇન: ૨ દર્શાવો)', result: '૨' },
        { exp: '૨ × ૨ = ૪', speech: 'બે દુ ચાર', eng: '2 x 2 = 4', islSign: '૨ x ૨ = ૪ (સાઇન: ૪ દર્શાવો)', result: '૪' },
        { exp: '૨ × ૩ = ૬', speech: 'બે તેરી છ', eng: '2 x 3 = 6', islSign: '૨ x ૩ = ૬ (સાઇન: ૫ + ૧)', result: '૬' },
        { exp: '૨ × ૪ = ૮', speech: 'બે ચોક આઠ', eng: '2 x 4 = 8', islSign: '૨ x ૪ = ૮ (સાઇન: ૫ + ૩)', result: '૮' },
        { exp: '૨ × ૫ = ૧૦', speech: 'બે પંચા દસ', eng: '2 x 5 = 10', islSign: '૨ x ૫ = ૧૦ (સાઇન: બંને પંજા)', result: '૧૦' },
        { exp: '૨ × ૬ = ૧૨', speech: 'બે છંગ બાર', eng: '2 x 6 = 12', islSign: '૨ x ૬ = ૧૨ (સાઇન: ૧૦ + ૨)', result: '૧૨' },
        { exp: '૨ × ૭ = ૧૪', speech: 'બે સતા ચૌદ', eng: '2 x 7 = 14', islSign: '૨ x ૭ = ૧૪ (સાઇન: ૧૦ + ૪)', result: '૧૪' },
        { exp: '૨ × ૮ = ૧૬', speech: 'બે અઠા સોળ', eng: '2 x 8 = 16', islSign: '૨ x ૮ = ૧૬ (સાઇન: ૧૦ + ૬)', result: '૧૬' },
        { exp: '૨ × ૯ = ૧૮', speech: 'બે નવા અઢાર', eng: '2 x 9 = 18', islSign: '૨ x ૯ = ૧૮ (સાઇન: ૧૦ + ૮)', result: '૧૮' },
        { exp: '૨ × ૧૦ = ૨૦', speech: 'બે દાન વીસ', eng: '2 x 10 = 20', islSign: '૨ x ૧૦ = ૨૦ (સાઇન: ૨ + શૂન્ય)', result: '૨૦' }
      ]
    },
    {
      id: 'table-5',
      title: '૫ નો ઘડિયો (Table of 5)',
      number: 5,
      gujaratiNumeral: '૫',
      signOverview: 'પાંચ નો પંજો ફેલાવી પાંચના જૂથ બનાવવાનો સંકેત.',
      rows: [
        { exp: '૫ × ૧ = ૫', speech: 'પાંચ એકા પાંચ', eng: '5 x 1 = 5', islSign: 'ખુલ્લો પંજો', result: '૫' },
        { exp: '૫ × ૨ = ૧૦', speech: 'પાંચ દુ દસ', eng: '5 x 2 = 10', islSign: 'બંને પંજા', result: '૧૦' },
        { exp: '૫ × ૩ = ૧૫', speech: 'પાંચ તેરી પંદર', eng: '5 x 3 = 15', islSign: '૧૦ + ૫ સંકેત', result: '૧૫' },
        { exp: '૫ × ૪ = ૨૦', speech: 'પાંચ ચોક વીસ', eng: '5 x 4 = 20', islSign: '૨૦ નો સંકેત', result: '૨૦' },
        { exp: '૫ × ૫ = ૨૫', speech: 'પાયો પાયો પચ્ચીસ', eng: '5 x 5 = 25', islSign: '૨૫ નો સંકેત', result: '૨૫' },
        { exp: '૫ × ૬ = ૩૦', speech: 'પાંચ છંગ ત્રીસ', eng: '5 x 6 = 30', islSign: '૩૦ નો સંકેત', result: '૩૦' },
        { exp: '૫ × ૭ = ૩૫', speech: 'પાંચ સતા પાંત્રીસ', eng: '5 x 7 = 35', islSign: '૩૫ નો સંકેત', result: '૩૫' },
        { exp: '૫ × ૮ = ૪૦', speech: 'પાંચ અઠા ચાલીસ', eng: '5 x 8 = 40', islSign: '૪૦ નો સંકેત', result: '૪૦' },
        { exp: '૫ × ૯ = ૪૫', speech: 'પાંચ નવા પિસ્તાલીસ', eng: '5 x 9 = 45', islSign: '૪૫ નો સંકેત', result: '૪૫' },
        { exp: '૫ × ૧૦ = ૫૦', speech: 'પાંચ દાન પચાસ', eng: '5 x 10 = 50', islSign: '૫૦ નો સંકેત', result: '૫૦' }
      ]
    }
  ],
  operations: [
    {
      id: 'addition',
      title: 'સરવાળો (Addition +)',
      symbol: '+',
      concept: 'બે કે તેથી વધુ વસ્તુઓ કે સંખ્યાઓને એકસાથે ભેગી કરવી.',
      signDescription: 'બંને હાથની આંગળીઓને સામસામે લાવી એકસાથે ભેગી કરવાનો સંકેત (સાઇન: "એકત્રિત કરવું").',
      example: '૩ + ૨ = ૫ (ત્રણ સફરજન + બે સફરજન = પાંચ સફરજન)',
      visual: '🍎🍎🍎 + 🍎🍎 = 🍎🍎🍎🍎🍎',
      color: 'bg-emerald-500'
    },
    {
      id: 'subtraction',
      title: 'બાદબાકી (Subtraction -)',
      symbol: '-',
      concept: 'કુલ જથ્થામાંથી અમુક સંખ્યા કે વસ્તુઓ ઓછી કરવી કે કાઢી નાખવી.',
      signDescription: 'એક હાથની હથેળીમાંથી બીજા હાથેથી વસ્તુ ઉપાડી દૂર લઈ જવાનો સંકેત (સાઇન: "ઓછું કરવું / કાઢવું").',
      example: '૫ - ૨ = ૩ (પાંચ ફુગ્ગામાંથી બે ફૂટી ગયા તો ત્રણ વધ્યા)',
      visual: '🎈🎈🎈🎈🎈 - 🎈🎈 = 🎈🎈🎈',
      color: 'bg-amber-500'
    },
    {
      id: 'multiplication',
      title: 'ગુણાકાર (Multiplication ×)',
      symbol: '×',
      concept: 'એક જ સંખ્યાનો વારંવાર પુનરાવર્તિત સરવાળો કરવો.',
      signDescription: 'બંને હાથની તર્જની આંગળીઓ એકબીજા પર ચોકડી (X) આકારે ક્રોસ કરવાનો સંકેત.',
      example: '૩ × ૨ = ૬ (બે ના ત્રણ જૂથ: ૨ + ૨ + ૨ = ૬)',
      visual: '⭐⭐ + ⭐⭐ + ⭐⭐ = ૬ તારા',
      color: 'bg-blue-500'
    },
    {
      id: 'division',
      title: 'ભાગાકાર (Division ÷)',
      symbol: '÷',
      concept: 'કોઈપણ જથ્થાને સરખા ભાગે વહેંચણી કરવી.',
      signDescription: 'બંને હાથની હથેળીઓ વચ્ચેથી બે બાજુ સરખા ભાગે અલગ કરવાનો સંકેત (સાઇન: "સરખા ભાગ").',
      example: '૬ ÷ ૨ = ૩ (છ ચોકલેટ બે બાળકો વચ્ચે સરખે ભાગે વહેંચતા ૩-૩ મળે)',
      visual: '🍫🍫🍫🍫🍫🍫 ÷ ૨ = 🍫🍫🍫 દરેકને',
      color: 'bg-purple-500'
    }
  ]
};

// Converts 12 -> '૧૨'
export const toGujaratiDigits = (n) => String(n).replace(/\d/g, d => '૦૧૨૩૪૫૬૭૮૯'[d]);

// Tables 2 and 5 keep their hand-written traditional recitation; the rest are generated.
const makeTable = (n) => ({
  id: `table-${n}`,
  title: `${toGujaratiDigits(n)} નો ઘડિયો (Table of ${n})`,
  number: n,
  gujaratiNumeral: toGujaratiDigits(n),
  signOverview: `${toGujaratiDigits(n)} નો સંકેત રાખી ક્રમશઃ ગુણાકાર કરવાનો સાઇન સંકેત.`,
  rows: Array.from({ length: 10 }, (_, i) => {
    const [a, b, c] = [n, i + 1, n * (i + 1)].map(toGujaratiDigits);
    return { exp: `${a} × ${b} = ${c}`, speech: `${a} ગુણ્યા ${b} બરાબર ${c}`, eng: `${n} x ${i + 1} = ${n * (i + 1)}`, result: c };
  })
});
mathLessons.tables = Array.from({ length: 9 }, (_, i) => i + 2)
  .map(n => mathLessons.tables.find(t => t.number === n) || makeTable(n));

const OPS = {
  addition: { symbol: '+', word: 'વત્તા' },
  subtraction: { symbol: '-', word: 'ઓછા' },
  multiplication: { symbol: '×', word: 'ગુણ્યા' },
  division: { symbol: '÷', word: 'ભાગ્યા' }
};
const rand = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));

// Random practice problem with a whole-number answer. type: one of OPS keys, or random.
export const generateProblem = (type = Object.keys(OPS)[rand(0, 3)]) => {
  let a, b, answer;
  if (type === 'addition') { a = rand(1, 20); b = rand(1, 20); answer = a + b; }
  if (type === 'subtraction') { a = rand(2, 20); b = rand(1, a); answer = a - b; }
  if (type === 'multiplication') { a = rand(2, 10); b = rand(1, 10); answer = a * b; }
  if (type === 'division') { b = rand(2, 10); answer = rand(1, 10); a = b * answer; }
  const [ga, gb, gans] = [a, b, answer].map(toGujaratiDigits);
  const op = OPS[type];
  return {
    id: `${type}-${a}-${b}-${Date.now()}`,
    type,
    question: `${ga} ${op.symbol} ${gb} = ?`,
    questionGujarati: `${ga} ${op.word} ${gb} બરાબર કેટલા?`,
    correctAnswer: gans,
    explanation: `${ga} ${op.symbol} ${gb} = ${gans}. સાચો જવાબ ${gans} છે.`,
    signHint: mathLessons.operations.find(o => o.id === type).signDescription
  };
};
