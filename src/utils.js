export const filterBlankLines = (arr) => {
  return arr.filter(
    (line) => !line.split("").every((char) => /\s|\n|\t/.test(char))
  );
};

export const configText = [
  [
    "Bonjour! Je suis Monsieur Clippe. I will aide vous to configure les boutons. Press any touche to continue.",
    "Alors, first please press the touche - ah, I mean the key - that you want to mean OUI.",
    "Très bien! Now please choisir the key to mean NON.",
    "Et finalment, which touche voulez-vous for the bouton défaire? Ah, pardon! Je vais dire the UNDO button.",
    "Bien joué, et au revoir!",
    "Merci!",
    "D'accord",
  ],
  [
    "Guten tag! Ich bin Herr Klip. I will help you zu konfigurieren the buttons. Drücken Sie any key to continue.",
    "Lasst uns beginnen! First please drücken - ah, I mean press - the key that you want to mean JA.",
    "Fantastisch! Please choose the Taste you want to mean NEIN.",
    "Und endlich, which Taste do you want as the Rückgängig? Ach, entschuldige! Ich meine the UNDO button.",
    "Gut gemacht, und auf Wiedersehen!",
    "Danke!",
    "Gut",
  ],
  [
    "Hola! Yo soy Señor Clipedro. I will help you configurar los botones. Press any tecla to continue.",
    "Pues, to start please press the tecla - ay, quiero decir the key - that you want to mean SÍ.",
    "Genial! Ahora, por favor, choose the key to mean NO.",
    "Y al fin, which tecla quieres for the botón deshacer? Aj, disculpe! Eso es the UNDO button.",
    "Bien hecho, y adios!",
    "Gracias!",
    "Vale",
  ],
  [
    "Ciao! Io sono il Signor Clippoli. I will help you configure the pulsanti. Press any key per continuare.",
    "Bene, to start please premere - oh, voglio dire press - the key that you want to mean SÍ.",
    "Fantastico! E ora please choose the tasto to mean NO.",
    "E infine, which tasto vuoi for the Pulsante Annulla? Oh, scusa! I mean the UNDO button.",
    "Ben fatto, e arrivederci!",
    "Grazie!",
    "Va bene",
  ],

  [
    "Hullo, ma name's Mr MacClip. A'm here tae help ye configure the buttons. Press any key tae continue.",
    "Richt then, tae start, press the key ye want tae mean AY.",
    "Guid, now choose the key tae mean NAW.",
    "An finally, which key dae ye want for the UNDAE button?",
    "Hae a guid day, an see ye efter!",
    "Thank ye!",
    "Ay.",
  ],
];

export const animals = [
  "alligator",
  "bear",
  "cat",
  "dog",
  "elephant",
  "fox",
  "goat",
  "horse",
  "iguana",
  "jackrabbit",
  "kangaroo",
  "lemur",
  "moray eel",
  "narhwal",
  "orangutan",
  "pangolin",
  "quail",
  "ram",
  "snake",
  "tapir",
  "ungulates in general",
  "viper",
  "whale",
  "xoloitzcuintle dog",
  "yak",
  "zebra",
];
