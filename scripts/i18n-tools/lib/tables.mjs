// Quote metadata that is prose, keyed on the exact English string.
//
// A person's name, a work title, a bibliography title and a locator are all
// printed next to the quotation, so each belongs in the page's language. None
// of them is translated freehand: a row here is the only way a locale may
// differ from English, which is what stops the same source being labelled two
// ways in two files. The guard in check-locale.mjs accepts the English string
// or the row for that locale, and nothing else.
//
// Deliberately absent, and therefore left exactly as English has them:
// page and section numbers (p. 91, pp. 7-26, Part II is here because it is a
// word), archive ids (DCP-LETT-2814), edition names (New Revised Standard
// Version) and English chapter titles quoted as titles ("Rebellion").

// A person or a group of people, as the page credits them.
export const AUTHORS = {
  "Thomas Aquinas": {
    es: "Tomás de Aquino",
    fr: "Thomas d'Aquin",
    de: "Thomas von Aquin",
  },
  "Augustine of Hippo": {
    es: "Agustín de Hipona",
    fr: "Augustin d'Hippone",
    de: "Augustinus von Hippo",
  },
  "John Paul II": {
    es: "Juan Pablo II",
    fr: "Jean-Paul II",
    de: "Johannes Paul II.",
  },
  "Plato": {
    es: "Platón",
    fr: "Platon",
    de: "Platon",
  },
  "Paul of Tarsus": {
    es: "Pablo de Tarso",
    fr: "Paul de Tarse",
    de: "Paulus von Tarsus",
  },
  "Second Vatican Council": {
    es: "Concilio Vaticano II",
    fr: "Concile Vatican II",
    de: "Zweites Vatikanisches Konzil",
  },
  "Fyodor Dostoevsky": {
    es: "Fiódor Dostoyevski",
    fr: "Fiodor Dostoïevski",
    de: "Fjodor Dostojewski",
  },
  "Ivan Karamazov, in Fyodor Dostoevsky": {
    es: "Iván Karamázov, en Fiódor Dostoyevski",
    fr: "Ivan Karamazov, dans Fiodor Dostoïevski",
    de: "Iwan Karamasow, bei Fjodor Dostojewski",
  },
  "Leo Tolstoy": {
    es: "León Tolstói",
    fr: "Léon Tolstoï",
    de: "Leo Tolstoi",
  },
  "Bertrand Russell and Frederick Copleston": {
    es: "Bertrand Russell y Frederick Copleston",
    fr: "Bertrand Russell et Frederick Copleston",
    de: "Bertrand Russell und Frederick Copleston",
  },
  "David L. Edwards and John Stott": {
    es: "David L. Edwards y John Stott",
    fr: "David L. Edwards et John Stott",
    de: "David L. Edwards und John Stott",
  },
  "Robert D. Putnam and David E. Campbell": {
    es: "Robert D. Putnam y David E. Campbell",
    fr: "Robert D. Putnam et David E. Campbell",
    de: "Robert D. Putnam und David E. Campbell",
  },
  "William P. Alston and Evan Fales": {
    es: "William P. Alston y Evan Fales",
    fr: "William P. Alston et Evan Fales",
    de: "William P. Alston und Evan Fales",
  },
  "Matthew Powner, Béatrice Gerland and John Sutherland": {
    es: "Matthew Powner, Béatrice Gerland y John Sutherland",
    fr: "Matthew Powner, Béatrice Gerland et John Sutherland",
    de: "Matthew Powner, Béatrice Gerland und John Sutherland",
  },
  "Matthew W. Powner, Béatrice Gerland and John D. Sutherland": {
    es: "Matthew W. Powner, Béatrice Gerland y John D. Sutherland",
    fr: "Matthew W. Powner, Béatrice Gerland et John D. Sutherland",
    de: "Matthew W. Powner, Béatrice Gerland und John D. Sutherland",
  },
  "Victor Sojo, Barry Herschy, Alexandra Whicher, Eloi Camprubí and Nick Lane": {
    es: "Victor Sojo, Barry Herschy, Alexandra Whicher, Eloi Camprubí y Nick Lane",
    fr: "Victor Sojo, Barry Herschy, Alexandra Whicher, Eloi Camprubí et Nick Lane",
    de: "Victor Sojo, Barry Herschy, Alexandra Whicher, Eloi Camprubí und Nick Lane",
  },
  "R. R. Griffiths, W. A. Richards, U. McCann and R. Jesse": {
    es: "R. R. Griffiths, W. A. Richards, U. McCann y R. Jesse",
    fr: "R. R. Griffiths, W. A. Richards, U. McCann et R. Jesse",
    de: "R. R. Griffiths, W. A. Richards, U. McCann und R. Jesse",
  },
  "R. R. Griffiths and others": {
    es: "R. R. Griffiths y otros",
    fr: "R. R. Griffiths et al.",
    de: "R. R. Griffiths u. a.",
  },
  "Ronald L. Numbers (editor)": {
    es: "Ronald L. Numbers (ed.)",
    fr: "Ronald L. Numbers (dir.)",
    de: "Ronald L. Numbers (Hrsg.)",
  },
};

// A work title that takes a parenthetical gloss: the original stays, because a
// title is a retrieval key, and the translation follows it in brackets. Applied
// to `quote.work` and to `sources[].title` alike, so a bibliography entry and
// the quotation citing it cannot disagree.
export const WORKS = {
  "Dialogues Concerning Natural Religion": {
    es: "Dialogues Concerning Natural Religion (Diálogos sobre la religión natural)",
    fr: "Dialogues Concerning Natural Religion (Dialogues sur la religion naturelle)",
    de: "Dialogues Concerning Natural Religion (Dialoge über natürliche Religion)",
  },
  "Why I Am Not a Christian": {
    es: "Why I Am Not a Christian (Por qué no soy cristiano)",
    fr: "Why I Am Not a Christian (Pourquoi je ne suis pas chrétien)",
    de: "Why I Am Not a Christian (Warum ich kein Christ bin)",
  },
  "The Brothers Karamazov, tr. Constance Garnett": {
    es: "The Brothers Karamazov (Los hermanos Karamázov), trad. Constance Garnett",
    fr: "The Brothers Karamazov (Les Frères Karamazov), trad. Constance Garnett",
    de: "The Brothers Karamazov (Die Brüder Karamasow), übers. Constance Garnett",
  },
  "The Problem of Pain": {
    es: "The Problem of Pain (El problema del dolor)",
    fr: "The Problem of Pain (Le Problème de la souffrance)",
    de: "The Problem of Pain (Über den Schmerz)",
  },
  "The Screwtape Letters": {
    es: "The Screwtape Letters (Cartas del diablo a su sobrino)",
    fr: "The Screwtape Letters (Tactique du diable)",
    de: "The Screwtape Letters (Dienstanweisung für einen Unterteufel)",
  },
  "Pensées": {
    es: "Pensées (Pensamientos)",
    fr: "Pensées",
    de: "Pensées (Gedanken)",
  },
  "The Myth of Sisyphus": {
    es: "The Myth of Sisyphus (El mito de Sísifo)",
    fr: "Le Mythe de Sisyphe",
    de: "The Myth of Sisyphus (Der Mythos des Sisyphos)",
  },
  "A Confession": {
    es: "A Confession (Confesión)",
    fr: "A Confession (Ma confession)",
    de: "A Confession (Meine Beichte)",
  },
  "The God Delusion": {
    es: "The God Delusion (El mito de Dios)",
    fr: "The God Delusion (Pour en finir avec Dieu)",
    de: "The God Delusion (Der Gotteswahn)",
  },
  "Daybreak: Thoughts on the Prejudices of Morality": {
    es: "Daybreak: Thoughts on the Prejudices of Morality (Aurora)",
    fr: "Daybreak: Thoughts on the Prejudices of Morality (Aurore)",
    de: "Morgenröthe. Gedanken über die moralischen Vorurtheile",
  },
  "An Enquiry concerning Human Understanding, Section X: Of Miracles": {
    es: "An Enquiry concerning Human Understanding (Investigación sobre el entendimiento humano), sección X: de los milagros",
    fr: "An Enquiry concerning Human Understanding (Enquête sur l'entendement humain), section X : des miracles",
    de: "An Enquiry concerning Human Understanding (Eine Untersuchung über den menschlichen Verstand), Abschnitt X: Von den Wundern",
  },
  "An Enquiry concerning Human Understanding, Section X, Part II": {
    es: "An Enquiry concerning Human Understanding (Investigación sobre el entendimiento humano), sección X, parte II",
    fr: "An Enquiry concerning Human Understanding (Enquête sur l'entendement humain), section X, partie II",
    de: "An Enquiry concerning Human Understanding (Eine Untersuchung über den menschlichen Verstand), Abschnitt X, Teil II",
  },
  "The Varieties of Religious Experience": {
    es: "The Varieties of Religious Experience (Las variedades de la experiencia religiosa)",
    fr: "The Varieties of Religious Experience (L'Expérience religieuse)",
    de: "The Varieties of Religious Experience (Die Vielfalt religiöser Erfahrung)",
  },
};

// A `work` that describes rather than names: "his reply to Alston, in ...",
// "interview with Bill Moyers", "Letter to Asa Gray, 22 May 1860".
export const DESCWORKS = {
  "Did the Universe Have a Beginning?, talk at the State of the Universe meeting, Cambridge": {
    es: "Did the Universe Have a Beginning?, conferencia en el encuentro State of the Universe, Cambridge",
    fr: "Did the Universe Have a Beginning?, conférence à la rencontre State of the Universe, Cambridge",
    de: "Did the Universe Have a Beginning?, Vortrag auf der Tagung State of the Universe, Cambridge",
  },
  "A Universe from Nothing, in interview": {
    es: "A Universe from Nothing, en entrevista",
    fr: "A Universe from Nothing, en entretien",
    de: "A Universe from Nothing, im Interview",
  },
  "Principles of Nature and Grace, Founded on Reason": {
    es: "Principles of Nature and Grace, Founded on Reason (Principios de la naturaleza y de la gracia fundados en la razón)",
    fr: "Principles of Nature and Grace, Founded on Reason (Principes de la nature et de la grâce fondés en raison)",
    de: "Principles of Nature and Grace, Founded on Reason (Vernunftprinzipien der Natur und der Gnade)",
  },
  "Summa Theologiae I, q. 2, a. 3, the Third Way, tr. Fathers of the English Dominican Province": {
    es: "Summa Theologiae I, q. 2, a. 3, la tercera vía, traducción inglesa de los Fathers of the English Dominican Province",
    fr: "Summa Theologiae I, q. 2, a. 3, la troisième voie, traduction anglaise des Fathers of the English Dominican Province",
    de: "Summa Theologiae I, q. 2, a. 3, der dritte Weg, englische Übersetzung der Fathers of the English Dominican Province",
  },
  "Debate with Frederick Copleston, BBC Third Programme": {
    es: "Debate con Frederick Copleston, BBC Third Programme",
    fr: "Débat avec Frederick Copleston, BBC Third Programme",
    de: "Debatte mit Frederick Copleston, BBC Third Programme",
  },
  "Is There an Artificial God?, speech at Digital Biota 2, Cambridge": {
    es: "Is There an Artificial God?, discurso en Digital Biota 2, Cambridge",
    fr: "Is There an Artificial God?, discours à Digital Biota 2, Cambridge",
    de: "Is There an Artificial God?, Rede auf Digital Biota 2, Cambridge",
  },
  "in discussion with Lee Smolin, Edge": {
    es: "en conversación con Lee Smolin, Edge",
    fr: "en discussion avec Lee Smolin, Edge",
    de: "im Gespräch mit Lee Smolin, Edge",
  },
  "interview with Bill Moyers": {
    es: "entrevista con Bill Moyers",
    fr: "entretien avec Bill Moyers",
    de: "Interview mit Bill Moyers",
  },
  "the first premise of the moral argument, as Craig states it": {
    es: "la primera premisa del argumento moral, en la formulación de Craig",
    fr: "la première prémisse de l'argument moral, telle que Craig la formule",
    de: "die erste Prämisse des moralischen Arguments in Craigs Formulierung",
  },
  "The Moral Argument, in The Blackwell Companion to Natural Theology": {
    es: "The Moral Argument, en el volumen The Blackwell Companion to Natural Theology",
    fr: "The Moral Argument, dans le volume The Blackwell Companion to Natural Theology",
    de: "The Moral Argument, im Band The Blackwell Companion to Natural Theology",
  },
  "On What Matters, volume II": {
    es: "On What Matters, volumen II",
    fr: "On What Matters, tome II",
    de: "On What Matters, Band II",
  },
  "Euthyphro": {
    es: "Euthyphro (Eutifrón)",
    fr: "Euthyphro (Euthyphron)",
    de: "Euthyphro (Euthyphron)",
  },
  "Slaughter of the Canaanites (Question of the Week)": {
    es: "Slaughter of the Canaanites (sección Question of the Week)",
    fr: "Slaughter of the Canaanites (rubrique Question of the Week)",
    de: "Slaughter of the Canaanites (Rubrik Question of the Week)",
  },
  "Essentials: A Liberal-Evangelical Dialogue, with David L. Edwards": {
    es: "Essentials: A Liberal-Evangelical Dialogue, en coautoría con David L. Edwards",
    fr: "Essentials: A Liberal-Evangelical Dialogue, en collaboration avec David L. Edwards",
    de: "Essentials: A Liberal-Evangelical Dialogue, gemeinsam mit David L. Edwards",
  },
  "in debate with William Lane Craig, College of the Holy Cross": {
    es: "en debate con William Lane Craig, College of the Holy Cross",
    fr: "en débat avec William Lane Craig, College of the Holy Cross",
    de: "in der Debatte mit William Lane Craig, College of the Holy Cross",
  },
  "the Short Statement, article 2": {
    es: "la Declaración breve, artículo 2",
    fr: "la Déclaration brève, article 2",
    de: "die Kurzerklärung, Artikel 2",
  },
  "interview, The Gospel Coalition": {
    es: "entrevista, The Gospel Coalition",
    fr: "entretien, The Gospel Coalition",
    de: "Interview, The Gospel Coalition",
  },
  "The Ninth Bridgewater Treatise, Appendix Note E, 'On Hume's Argument against Miracles'": {
    es: "The Ninth Bridgewater Treatise, nota E del apéndice, «On Hume's Argument against Miracles»",
    fr: "The Ninth Bridgewater Treatise, note E de l'appendice, « On Hume's Argument against Miracles »",
    de: "The Ninth Bridgewater Treatise, Anhangsnote E, „On Hume’s Argument against Miracles“",
  },
  "An Enquiry concerning Human Understanding, Section X, 'Of Miracles'": {
    es: "An Enquiry concerning Human Understanding (Investigación sobre el entendimiento humano), sección X, «Of Miracles»",
    fr: "An Enquiry concerning Human Understanding (Enquête sur l'entendement humain), section X, « Of Miracles »",
    de: "An Enquiry concerning Human Understanding (Eine Untersuchung über den menschlichen Verstand), Abschnitt X, „Of Miracles“",
  },
  "his standard statement of the historian's problem with miracle, made in print and in debate": {
    es: "su formulación habitual del problema del historiador con el milagro, hecha por escrito y en debate",
    fr: "sa formulation habituelle du problème que le miracle pose à l'historien, faite par écrit et en débat",
    de: "seine gewöhnliche Formulierung des Problems, das das Wunder dem Historiker stellt, im Druck und in Debatten",
  },
  "1 Corinthians 15:14": {
    es: "1 Corintios 15:14",
    fr: "1 Corinthiens 15:14",
    de: "1. Korinther 15,14",
  },
  "his reply to Alston, in Contemporary Debates in Philosophy of Religion": {
    es: "su respuesta a Alston, en Contemporary Debates in Philosophy of Religion",
    fr: "sa réponse à Alston, dans Contemporary Debates in Philosophy of Religion",
    de: "seine Erwiderung auf Alston, in Contemporary Debates in Philosophy of Religion",
  },
  "address to the Conference on Cosmic Design, American Association for the Advancement of Science": {
    es: "conferencia en la Conference on Cosmic Design, American Association for the Advancement of Science",
    fr: "allocution à la Conference on Cosmic Design, American Association for the Advancement of Science",
    de: "Vortrag auf der Conference on Cosmic Design, American Association for the Advancement of Science",
  },
  "Pensées, tr. W. F. Trotter": {
    es: "Pensées (Pensamientos), trad. W. F. Trotter",
    fr: "Pensées, trad. W. F. Trotter",
    de: "Pensées (Gedanken), übers. W. F. Trotter",
  },
  "The Blind Watchmaker": {
    es: "The Blind Watchmaker (El relojero ciego)",
    fr: "The Blind Watchmaker (L'Horloger aveugle)",
    de: "The Blind Watchmaker (Der blinde Uhrmacher)",
  },
  "Letter to Asa Gray, 22 May 1860": {
    es: "Carta a Asa Gray, 22 de mayo de 1860",
    fr: "Lettre à Asa Gray, 22 mai 1860",
    de: "Brief an Asa Gray, 22. Mai 1860",
  },
  "Darwin's Dangerous Idea": {
    es: "Darwin's Dangerous Idea (La peligrosa idea de Darwin)",
    fr: "Darwin's Dangerous Idea (Darwin est-il dangereux ?)",
    de: "Darwin's Dangerous Idea (Darwins gefährliches Erbe)",
  },
  "Summa Theologiae I, q. 68, a. 1, tr. Fathers of the English Dominican Province": {
    es: "Summa Theologiae I, q. 68, a. 1, tr. inglesa de los Fathers of the English Dominican Province",
    fr: "Summa Theologiae I, q. 68, a. 1, trad. anglaise des Fathers of the English Dominican Province",
    de: "Summa Theologiae I, q. 68, a. 1, engl. Übers. der Fathers of the English Dominican Province",
  },
};

// A `locator`: where in the source the quotation sits, and for a paraphrase the
// disclaimer that the wording is ours. content.config.ts refuses a paraphrase
// whose locator does not say so, per locale, so these rows are load-bearing.
export const LOCATORS = {
  "the argument as Craig states it, defended at length in his later writings": {
    es: "el argumento en la formulación de Craig, defendido con detalle en sus escritos posteriores",
    fr: "l'argument tel que Craig le formule, défendu longuement dans ses écrits ultérieurs",
    de: "das Argument in Craigs Formulierung, in seinen späteren Schriften ausführlich verteidigt",
  },
  "our summary of the essentially-ordered argument as Feser states it; not his wording": {
    es: "nuestro resumen del argumento de la serie esencialmente ordenada tal como lo expone Feser; no sus palabras",
    fr: "notre résumé de l'argument de la série essentiellement ordonnée tel que Feser l'expose ; non ses mots",
    de: "unsere Zusammenfassung des Arguments der wesentlich geordneten Reihe, wie Feser es darlegt; nicht sein Wortlaut",
  },
  "our summary of the position Carroll defends in this essay; not his wording": {
    es: "nuestro resumen de la posición que Carroll defiende en este ensayo; no sus palabras",
    fr: "notre résumé de la position que Carroll défend dans cet essai ; non ses mots",
    de: "unsere Zusammenfassung der Position, die Carroll in diesem Essay verteidigt; nicht sein Wortlaut",
  },
  "on whether essence and existence are the same in God": {
    es: "sobre si en Dios la esencia y la existencia son lo mismo",
    fr: "sur la question de savoir si en Dieu l'essence et l'existence sont identiques",
    de: "darüber, ob in Gott Wesen und Existenz dasselbe sind",
  },
  "Part IX, spoken by Cleanthes": {
    es: "parte IX, en boca de Cleantes",
    fr: "partie IX, dans la bouche de Cléanthe",
    de: "Teil IX, gesprochen von Kleanthes",
  },
  "Part X, spoken by Philo": {
    es: "parte X, en boca de Filón",
    fr: "partie X, dans la bouche de Philon",
    de: "Teil X, gesprochen von Philo",
  },
  "§91, 'God's honesty'": {
    es: "§91, «La honradez de Dios»",
    fr: "§91, « L'honnêteté de Dieu »",
    de: "§91, „Die Redlichkeit Gottes“",
  },
  "our summary of the hiddenness argument as Schellenberg sets it out; not his wording": {
    es: "nuestro resumen del argumento del ocultamiento tal como lo expone Schellenberg; no sus palabras",
    fr: "notre résumé de l'argument du Dieu caché tel que Schellenberg l'expose ; non ses mots",
    de: "unsere Zusammenfassung des Verborgenheitsarguments, wie Schellenberg es darlegt; nicht sein Wortlaut",
  },
  "our summary of the argument as Maitzen sets it out; not his wording": {
    es: "nuestro resumen del argumento tal como lo expone Maitzen; no sus palabras",
    fr: "notre résumé de l'argument tel que Maitzen l'expose ; non ses mots",
    de: "unsere Zusammenfassung des Arguments, wie Maitzen es darlegt; nicht sein Wortlaut",
  },
  "our summary of the position Page argues for; not his wording": {
    es: "nuestro resumen de la posición que Page defiende; no sus palabras",
    fr: "notre résumé de la position que Page défend ; non ses mots",
    de: "unsere Zusammenfassung der Position, für die Page argumentiert; nicht sein Wortlaut",
  },
  "Part V, spoken by Philo": {
    es: "parte V, en boca de Filón",
    fr: "partie V, dans la bouche de Philon",
    de: "Teil V, gesprochen von Philo",
  },
  "a formulation used across Answers in Genesis material": {
    es: "una formulación empleada en los materiales de Answers in Genesis",
    fr: "une formulation employée dans les documents d’Answers in Genesis",
    de: "eine in den Materialien von Answers in Genesis verwendete Formulierung",
  },
  "preface, p. ix": {
    es: "prefacio, p. ix",
    fr: "préface, p. ix",
    de: "Vorwort, S. ix",
  },
  "the design inference as Meyer states it; the same argument runs through Signature in the Cell (2009)": {
    es: "la inferencia de diseño en la formulación de Meyer; el mismo argumento recorre Signature in the Cell (2009)",
    fr: "l'inférence de conception telle que Meyer la formule ; le même argument parcourt Signature in the Cell (2009)",
    de: "der Designschluss in Meyers Formulierung; dasselbe Argument durchzieht Signature in the Cell (2009)",
  },
  "the popular statement of the estimate published in the Journal of Molecular Biology, 2004": {
    es: "la formulación divulgativa de la estimación publicada en el Journal of Molecular Biology, 2004",
    fr: "l'énoncé de vulgarisation de l'estimation publiée dans le Journal of Molecular Biology, 2004",
    de: "die populäre Fassung der 2004 im Journal of Molecular Biology veröffentlichten Schätzung",
  },
  "the asphalt paradox, one of several the paper sets out": {
    es: "la paradoja del asfalto, una de las varias que expone el artículo",
    fr: "le paradoxe de l'asphalte, l'un des plusieurs que l'article expose",
    de: "das Asphaltparadox, eines von mehreren, die der Aufsatz darlegt",
  },
  "the thesis defended at length in The Evolution of the Soul (1986)": {
    es: "la tesis defendida con detalle en The Evolution of the Soul (1986)",
    fr: "la thèse défendue longuement dans The Evolution of the Soul (1986)",
    de: "die in The Evolution of the Soul (1986) ausführlich verteidigte These",
  },
  "the conditional the book sets out to defend": {
    es: "el condicional que el libro se propone defender",
    fr: "le conditionnel que le livre entreprend de défendre",
    de: "die Konditionalaussage, die das Buch verteidigen will",
  },
  "spoken; a false start has been elided": {
    es: "oral; se ha omitido un comienzo en falso",
    fr: "à l’oral ; un faux départ a été élidé",
    de: "mündlich; ein abgebrochener Satzanfang ist ausgelassen",
  },
  "the causal exclusion principle, as stated in the supervenience argument": {
    es: "el principio de exclusión causal, tal como se enuncia en el argumento de la superveniencia",
    fr: "le principe d'exclusion causale, tel qu'il est énoncé dans l'argument de la survenance",
    de: "das Prinzip der kausalen Ausschließung, wie es im Supervenienzargument formuliert ist",
  },
  "our summary of the agent-causal account the book defends; not O'Connor's wording": {
    es: "nuestro resumen de la explicación por causalidad del agente que defiende el libro; no las palabras de O’Connor",
    fr: "notre résumé de la théorie de la causalité de l'agent que défend le livre ; non les mots d'O'Connor",
    de: "unsere Zusammenfassung der agenskausalen Darstellung, die das Buch verteidigt; nicht O’Connors Wortlaut",
  },
  "Dennett describing the book's aim, in the preface to the revised edition": {
    es: "Dennett describe el propósito del libro, en el prefacio a la edición revisada",
    fr: "Dennett décrit le but du livre, dans la préface à l'édition revue",
    de: "Dennett beschreibt das Ziel des Buches, im Vorwort zur überarbeiteten Ausgabe",
  },
  "the book's thesis, stated in its opening pages": {
    es: "la tesis del libro, enunciada en sus primeras páginas",
    fr: "la thèse du livre, énoncée dans ses premières pages",
    de: "die These des Buches, auf seinen ersten Seiten formuliert",
  },
  "Craig defines 'objective' as 'valid and binding independently of whether anybody believes in it or not'": {
    es: "Craig define «objetivo» como «válido y obligatorio independientemente de que alguien crea en ello o no»",
    fr: "Craig définit « objectif » comme « valide et contraignant indépendamment du fait que quiconque y croie ou non »",
    de: "Craig bestimmt „objektiv“ als „gültig und verbindlich, unabhängig davon, ob irgendwer daran glaubt oder nicht“",
  },
  "the first precept of the natural law": {
    es: "el primer precepto de la ley natural",
    fr: "le premier précepte de la loi naturelle",
    de: "das erste Gebot des Naturgesetzes",
  },
  "the thesis of moral concurrentism, quoted in the Notre Dame Philosophical Reviews notice": {
    es: "la tesis del concurrentismo moral, citada en la reseña de Notre Dame Philosophical Reviews",
    fr: "la thèse du concurrentisme moral, citée dans la notice des Notre Dame Philosophical Reviews",
    de: "die These des moralischen Konkurrentismus, zitiert in der Besprechung der Notre Dame Philosophical Reviews",
  },
  "our summary of the evolutionary argument against naturalistic moral realism, pp. 391-448; not Linville's wording. At the top of VERIFICATION.md for a primary check": {
    es: "nuestro resumen del argumento evolutivo contra el realismo moral naturalista, pp. 391-448; no las palabras de Linville. Figura al principio de VERIFICATION.md para una comprobación primaria",
    fr: "notre résumé de l'argument évolutionniste contre le réalisme moral naturaliste, pp. 391-448 ; non les mots de Linville. En tête de VERIFICATION.md pour une vérification primaire",
    de: "unsere Zusammenfassung des evolutionären Arguments gegen den naturalistischen moralischen Realismus, pp. 391-448; nicht Linvilles Wortlaut. Steht oben in VERIFICATION.md für eine primäre Prüfung",
  },
  "the position Parfit calls Non-Metaphysical Non-Naturalist Normative Cognitivism": {
    es: "la posición que Parfit llama Non-Metaphysical Non-Naturalist Normative Cognitivism",
    fr: "la position que Parfit nomme Non-Metaphysical Non-Naturalist Normative Cognitivism",
    de: "die Position, die Parfit Non-Metaphysical Non-Naturalist Normative Cognitivism nennt",
  },
  "the opening sentence of chapter 1, 'The Subjectivity of Values'": {
    es: "la primera frase del capítulo 1, «The Subjectivity of Values»",
    fr: "la première phrase du chapitre 1, « The Subjectivity of Values »",
    de: "der erste Satz von Kapitel 1, „The Subjectivity of Values“",
  },
  "10a; Socrates to Euthyphro": {
    es: "10a; Sócrates a Eutifrón",
    fr: "10a ; Socrate à Euthyphron",
    de: "10a; Sokrates zu Euthyphron",
  },
  "our summary of the cruciform thesis; not Boyd's wording": {
    es: "nuestro resumen de la tesis cruciforme; no las palabras de Boyd",
    fr: "notre résumé de la thèse cruciforme ; non les mots de Boyd",
    de: "unsere Zusammenfassung der kruziformen These; nicht Boyds Wortlaut",
  },
  "the thesis of the book, in the author's summary of it": {
    es: "la tesis del libro, en el resumen que hace de ella el propio autor",
    fr: "la thèse du livre, dans le résumé qu'en donne l'auteur",
    de: "die These des Buches, in der Zusammenfassung des Autors selbst",
  },
  "Enns reporting the consensus among biblical archaeologists": {
    es: "Enns informa del consenso entre los arqueólogos bíblicos",
    fr: "Enns rapporte le consensus des archéologues bibliques",
    de: "Enns berichtet über den Konsens unter den Bibelarchäologen",
  },
  "Stott's call to evangelicals to reconsider whether conditional immortality better fits the biblical evidence": {
    es: "la llamada de Stott a los evangélicos para que reconsideren si la inmortalidad condicional encaja mejor con la evidencia bíblica",
    fr: "l'appel de Stott aux évangéliques à reconsidérer si l'immortalité conditionnelle s'accorde mieux aux données bibliques",
    de: "Stotts Aufruf an die Evangelikalen, neu zu erwägen, ob die bedingte Unsterblichkeit besser zu den biblischen Befunden passt",
  },
  "on God's overriding a decisive rejection": {
    es: "sobre si Dios pasaría por encima de un rechazo decisivo",
    fr: "sur le fait que Dieu passerait outre un refus décisif",
    de: "darüber, dass Gott eine entschiedene Ablehnung überginge",
  },
  "a lecture delivered at Battersea Town Hall, 6 March 1927": {
    es: "conferencia pronunciada en el Battersea Town Hall, 6 de marzo de 1927",
    fr: "conférence donnée au Battersea Town Hall, le 6 mars 1927",
    de: "Vortrag, gehalten in der Battersea Town Hall, 6. März 1927",
  },
  "the notion of basic desert Pereboom argues nobody satisfies": {
    es: "la noción de mérito básico que, según Pereboom, nadie satisface",
    fr: "la notion de mérite fondamental que, selon Pereboom, personne ne satisfait",
    de: "der Begriff des grundlegenden Verdienstes, den nach Pereboom niemand erfüllt",
  },
  "pp. 58-68; our summary of the argument, not Sider's wording": {
    es: "pp. 58-68; nuestro resumen del argumento, no las palabras de Sider",
    fr: "pp. 58-68 ; notre résumé de l'argument, non les mots de Sider",
    de: "pp. 58-68; unsere Zusammenfassung des Arguments, nicht Siders Wortlaut",
  },
  "on the absence of any second-temple expectation of an individual messianic resurrection": {
    es: "sobre la ausencia, en el judaísmo del segundo templo, de toda expectativa de una resurrección mesiánica individual",
    fr: "sur l'absence, dans le judaïsme du second Temple, de toute attente d'une résurrection messianique individuelle",
    de: "über das Fehlen jeder Erwartung einer individuellen messianischen Auferstehung im Judentum des Zweiten Tempels",
  },
  "Habermas on the criterion for admitting a datum to the list": {
    es: "Habermas sobre el criterio para admitir un dato en la lista",
    fr: "Habermas sur le critère d'admission d'une donnée dans la liste",
    de: "Habermas über das Kriterium, nach dem ein Datum in die Liste aufgenommen wird",
  },
  "our summary of the vision hypothesis as Lüdemann develops it; not his wording": {
    es: "nuestro resumen de la hipótesis de las visiones tal como la desarrolla Lüdemann; no sus palabras",
    fr: "notre résumé de l'hypothèse des visions telle que Lüdemann la développe ; non ses mots",
    de: "unsere Zusammenfassung der Visionshypothese, wie Lüdemann sie entwickelt; nicht sein Wortlaut",
  },
  "Ehrman is an agnostic and a critic of the gospels' reliability": {
    es: "Ehrman es agnóstico y crítico de la fiabilidad de los evangelios",
    fr: "Ehrman est agnostique et critique de la fiabilité des évangiles",
    de: "Ehrman ist Agnostiker und ein Kritiker der Zuverlässigkeit der Evangelien",
  },
  "drafted by more than two hundred evangelical leaders at the International Council on Biblical Inerrancy": {
    es: "redactada por más de doscientos líderes evangélicos en el International Council on Biblical Inerrancy",
    fr: "rédigée par plus de deux cents responsables évangéliques à l'International Council on Biblical Inerrancy",
    de: "von mehr als zweihundert evangelikalen Führungsleuten beim International Council on Biblical Inerrancy verfasst",
  },
  "Enns applying the model to the hardest case for it; see topic 11": {
    es: "Enns aplica el modelo a su caso más difícil; véase el tema 11",
    fr: "Enns applique le modèle à son cas le plus difficile ; voir le sujet 11",
    de: "Enns wendet das Modell auf den für es schwierigsten Fall an; siehe Thema 11",
  },
  "our summary of the book's thesis as its publisher and its reviewers describe it; not Thompson's wording": {
    es: "nuestro resumen de la tesis del libro tal como la describen su editorial y sus reseñas; no las palabras de Thompson",
    fr: "notre résumé de la thèse du livre telle que son éditeur et ses recenseurs la décrivent ; non les mots de Thompson",
    de: "unsere Zusammenfassung der These des Buches, wie sein Verlag und seine Rezensenten sie beschreiben; nicht Thompsons Wortlaut",
  },
  "cited here for the transmission point only; the literary-dependence argument on this page is the standard two-source position in New Testament studies and is not a quotation from anyone": {
    es: "se cita aquí solo por el punto sobre la transmisión; el argumento de la dependencia literaria de esta página es la posición estándar de las dos fuentes en los estudios neotestamentarios y no es cita de nadie",
    fr: "cité ici seulement pour le point sur la transmission ; l'argument de la dépendance littéraire sur cette page est la position standard des deux sources dans les études néotestamentaires et n'est la citation de personne",
    de: "hier nur wegen des Punktes zur Überlieferung zitiert; das Argument der literarischen Abhängigkeit auf dieser Seite ist die übliche Zweiquellenposition der neutestamentlichen Forschung und ist kein Zitat von jemandem",
  },
  "second edition, appendix note E": {
    es: "segunda edición, nota E del apéndice",
    fr: "deuxième édition, note E de l'appendice",
    de: "zweite Auflage, Anhangsnote E",
  },
  "Swinburne's definition of a violation of a law of nature, as quoted in the Stanford Encyclopedia of Philosophy entry on miracles": {
    es: "la definición de Swinburne de la violación de una ley de la naturaleza, citada en el artículo sobre los milagros de la Stanford Encyclopedia of Philosophy",
    fr: "la définition par Swinburne d'une violation d'une loi de la nature, citée dans l'article sur les miracles de la Stanford Encyclopedia of Philosophy",
    de: "Swinburnes Bestimmung der Verletzung eines Naturgesetzes, zitiert im Artikel über Wunder der Stanford Encyclopedia of Philosophy",
  },
  "the survey chapters; the figure is built from a 2006 ten-country Pew survey of Pentecostal and charismatic experience": {
    es: "los capítulos de encuesta; la cifra se construye a partir de una encuesta Pew de 2006 en diez países sobre la experiencia pentecostal y carismática",
    fr: "les chapitres d'enquête ; le chiffre est construit à partir d'une enquête Pew de 2006 dans dix pays sur l'expérience pentecôtiste et charismatique",
    de: "die Umfragekapitel; die Zahl beruht auf einer Pew-Umfrage von 2006 in zehn Ländern zur pfingstlerischen und charismatischen Erfahrung",
  },
  "Part I; Hume calls it a general maxim worthy of attention": {
    es: "parte I; Hume la llama una máxima general digna de atención",
    fr: "partie I ; Hume la nomme une maxime générale digne d’attention",
    de: "Teil I; Hume nennt es eine allgemeine, der Aufmerksamkeit würdige Maxime",
  },
  "the formulation recurs across his debates and his blog; no single canonical page": {
    es: "la formulación reaparece en sus debates y en su blog; no hay una página canónica única",
    fr: "la formulation revient dans ses débats et sur son blog ; pas de page canonique unique",
    de: "die Formulierung kehrt in seinen Debatten und in seinem Blog wieder; keine einzelne kanonische Stelle",
  },
  "the chapter on miracles and testimony": {
    es: "el capítulo sobre los milagros y el testimonio",
    fr: "le chapitre sur les miracles et le témoignage",
    de: "das Kapitel über Wunder und Zeugnis",
  },
  "article 2": {
    es: "artículo 2",
    fr: "article 2",
    de: "Artikel 2",
  },
  "the introduction, where he names the assumption 'Godthink'": {
    es: "la introducción, donde llama al supuesto «Godthink»",
    fr: "l'introduction, où il nomme le présupposé « Godthink »",
    de: "die Einleitung, in der er die Voraussetzung „Godthink“ nennt",
  },
  "his standard formulation of the test, repeated in the book and in his paper of the same name": {
    es: "su formulación habitual de la prueba, repetida en el libro y en su artículo del mismo título",
    fr: "sa formulation habituelle du test, reprise dans le livre et dans son article du même titre",
    de: "seine gewöhnliche Formulierung des Tests, wiederholt im Buch und in seinem gleichnamigen Aufsatz",
  },
  "Part II": {
    es: "parte II",
    fr: "partie II",
    de: "Teil II",
  },
  "our summary of the symmetry argument as the book's reviewers set it out; not Kitcher's wording": {
    es: "nuestro resumen del argumento de la simetría tal como lo exponen las reseñas del libro; no las palabras de Kitcher",
    fr: "notre résumé de l'argument de la symétrie tel que les recenseurs du livre l'exposent ; non les mots de Kitcher",
    de: "unsere Zusammenfassung des Symmetriearguments, wie die Rezensenten des Buches es darlegen; nicht Kitchers Wortlaut",
  },
  "the statement of the pluralistic hypothesis": {
    es: "el enunciado de la hipótesis pluralista",
    fr: "l'énoncé de l'hypothèse pluraliste",
    de: "die Darlegung der pluralistischen Hypothese",
  },
  "the statement of the principle of credulity; the wording is the one quoted in the secondary literature, which cites the revised edition": {
    es: "el enunciado del principio de credulidad; la formulación es la que cita la literatura secundaria, que remite a la edición revisada",
    fr: "l'énoncé du principe de crédulité ; la formulation est celle que cite la littérature secondaire, qui renvoie à l'édition revue",
    de: "die Formulierung des Prinzips der Gutgläubigkeit; der Wortlaut ist der in der Sekundärliteratur zitierte, die sich auf die überarbeitete Auflage bezieht",
  },
  "Lectures XVI-XVII, 'Mysticism', in the summary of his conclusions": {
    es: "lecciones XVI-XVII, «Mysticism», en el resumen de sus conclusiones",
    fr: "leçons XVI-XVII, « Mysticism », dans le résumé de ses conclusions",
    de: "Vorlesungen XVI-XVII, „Mysticism“, in der Zusammenfassung seiner Schlüsse",
  },
  "our summary of the book's central argument as its critics and commentators state it; not Alston's wording": {
    es: "nuestro resumen del argumento central del libro tal como lo formulan sus críticos y comentaristas; no las palabras de Alston",
    fr: "notre résumé de l'argument central du livre tel que ses critiques et commentateurs le formulent ; non les mots d'Alston",
    de: "unsere Zusammenfassung des zentralen Arguments des Buches, wie seine Kritiker und Kommentatoren es formulieren; nicht Alstons Wortlaut",
  },
  "the cross-checking argument against mystical perception": {
    es: "el argumento de la contrastación contra la percepción mística",
    fr: "l'argument du contre-examen contre la perception mystique",
    de: "das Gegenprüfungsargument gegen die mystische Wahrnehmung",
  },
  "the conclusions of the abstract": {
    es: "las conclusiones del resumen",
    fr: "les conclusions du résumé",
    de: "die Schlüsse der Zusammenfassung",
  },
  "the essay's central thesis; Katz is a scholar of Jewish mysticism arguing about experience, and does not draw the conclusion this side draws from it": {
    es: "la tesis central del ensayo; Katz es un estudioso de la mística judía que argumenta sobre la experiencia, y no extrae la conclusión que este lado extrae de ella",
    fr: "la thèse centrale de l'essai ; Katz est un spécialiste de la mystique juive qui argumente sur l'expérience, et il ne tire pas la conclusion que ce camp en tire",
    de: "die zentrale These des Aufsatzes; Katz ist ein Forscher der jüdischen Mystik, der über die Erfahrung argumentiert, und zieht nicht den Schluss, den diese Seite daraus zieht",
  },
  "the introduction, where he describes changing his mind; Holland writes as a non-believer": {
    es: "la introducción, donde describe cómo cambió de opinión; Holland escribe como no creyente",
    fr: "l'introduction, où il décrit son changement d'avis ; Holland écrit en non-croyant",
    de: "die Einleitung, in der er beschreibt, wie er seine Meinung änderte; Holland schreibt als Nichtglaubender",
  },
  "the book's central finding on religion and civic behaviour": {
    es: "el hallazgo central del libro sobre la religión y la conducta civil",
    fr: "le résultat central du livre sur la religion et le comportement civique",
    de: "der zentrale Befund des Buches zu Religion und bürgerlichem Verhalten",
  },
  "his definition of the myth the book is about": {
    es: "su definición del mito del que trata el libro",
    fr: "sa définition du mythe dont traite le livre",
    de: "seine Bestimmung des Mythos, um den es im Buch geht",
  },
  "the closing of the talk, after a passage on religious defences of slavery": {
    es: "el cierre de la conferencia, tras un pasaje sobre las defensas religiosas de la esclavitud",
    fr: "la clôture de la conférence, après un passage sur les défenses religieuses de l'esclavage",
    de: "der Schluss des Vortrags, nach einer Passage über religiöse Verteidigungen der Sklaverei",
  },
  "the chapter on the problem with religious moderation": {
    es: "el capítulo sobre el problema de la moderación religiosa",
    fr: "le chapitre sur le problème de la modération religieuse",
    de: "das Kapitel über das Problem der religiösen Mäßigung",
  },
  "the opening chapter's statement of the charge": {
    es: "la formulación del cargo en el capítulo inicial",
    fr: "l'énoncé de l'accusation dans le chapitre d'ouverture",
    de: "die Formulierung des Vorwurfs im ersten Kapitel",
  },
  "the statement of non-overlapping magisteria, first published as an essay in 1997; Gould was an agnostic": {
    es: "el enunciado de los magisterios no superpuestos, publicado primero como ensayo en 1997; Gould era agnóstico",
    fr: "l'énoncé des magistères non recouvrants, paru d'abord comme essai en 1997 ; Gould était agnostique",
    de: "die Darlegung der nicht überschneidenden Magisterien, zuerst 1997 als Essay veröffentlicht; Gould war Agnostiker",
  },
  "the chapter on the origins of modern science": {
    es: "el capítulo sobre los orígenes de la ciencia moderna",
    fr: "le chapitre sur les origines de la science moderne",
    de: "das Kapitel über die Ursprünge der modernen Wissenschaft",
  },
  "our summary of the study's headline findings as the publisher's page and its reviewers state them; not Ecklund's wording": {
    es: "nuestro resumen de los hallazgos principales del estudio tal como los enuncian la página de la editorial y sus reseñas; no las palabras de Ecklund",
    fr: "notre résumé des principaux résultats de l'étude tels que la page de l'éditeur et ses recenseurs les énoncent ; non les mots d'Ecklund",
    de: "unsere Zusammenfassung der wichtigsten Befunde der Studie, wie die Seite des Verlags und ihre Rezensenten sie formulieren; nicht Ecklunds Wortlaut",
  },
  "the chapter arguing against non-overlapping magisteria": {
    es: "el capítulo que argumenta contra los magisterios no superpuestos",
    fr: "le chapitre qui argumente contre les magistères non recouvrants",
    de: "das Kapitel, das gegen die nicht überschneidenden Magisterien argumentiert",
  },
  "on the reinterpretation of scriptural claims": {
    es: "sobre la reinterpretación de las afirmaciones de la Escritura",
    fr: "sur la réinterprétation des affirmations de l'Écriture",
    de: "über die Neudeutung biblischer Behauptungen",
  },
  "chapter 5, where he states the question that nearly killed him": {
    es: "capítulo 5, donde formula la pregunta que casi lo mató",
    fr: "chapitre 5, où il formule la question qui a failli le tuer",
    de: "Kapitel 5, in dem er die Frage ausspricht, die ihn fast umbrachte",
  },
  "the account of the classical teleological scheme, chapter 5": {
    es: "la exposición del esquema teleológico clásico, capítulo 5",
    fr: "l’exposé du schéma téléologique classique, chapitre 5",
    de: "die Darstellung des klassischen teleologischen Schemas, Kapitel 5",
  },
  "the essay's statement of the consequence, developed at length in the surrounding pages": {
    es: "el ensayo enuncia la consecuencia, desarrollada con detalle en las páginas circundantes",
    fr: "l'essai énonce la conséquence, développée longuement dans les pages qui l'entourent",
    de: "der Aufsatz formuliert die Folge, in den umliegenden Seiten ausführlich entwickelt",
  },
  "her own summary of the Fitting Fulfillment view": {
    es: "su propio resumen de la tesis de la realización ajustada",
    fr: "son propre résumé de la vue de l'accomplissement ajusté",
    de: "ihre eigene Zusammenfassung der Auffassung der passenden Erfüllung",
  },
  "the closing lines of the essay": {
    es: "las líneas finales del ensayo",
    fr: "les dernières lignes de l'essai",
    de: "die Schlusszeilen des Aufsatzes",
  },
};

