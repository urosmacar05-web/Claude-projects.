/* =========================================================
   AL PARCO – JELOVNIK (jedini izvor podataka za meni)
   ---------------------------------------------------------
   • Da dodate cijenu: upišite npr.  price: "14,50 KM"
     (dok je price: null, cijena se ne prikazuje)
   • img: putanja do prave fotografije jela (opciono)
   • featured: true → jelo se prikazuje u karuselu na početnoj
   ========================================================= */
window.AP_MENU = [
  {
    id: "novo",
    sr: "Novo u ponudi", en: "New on the menu",
    items: [
      { sr: ["Potaž od bundeve", "Bundeva, jabuka, začini"],
        en: ["Pumpkin velouté", "Pumpkin, apple, spices"],
        img: "assets/img/jela/potaz-bundeva.webp", featured: true, price: null },
      { sr: ["Punjene prženice", "Šunka, edamer, jaja, feta sir"],
        en: ["Stuffed French toast", "Ham, Edam, eggs, feta cheese"],
        img: "assets/img/jela/przenice.webp", featured: true, price: null },
      { sr: ["Zapečene njoke sa biftekom", "Njoke, biftek, edamer, vrhnje"],
        en: ["Baked gnocchi with beef tenderloin", "Gnocchi, beef tenderloin, Edam, cream"],
        img: "assets/img/jela/njoke-biftek.webp", featured: true, price: null },
      { sr: ["Karamelizirana ćuretina sa medom, gljivama i crnim vinom", "Ćuretina, crno vino, med, gljive"],
        en: ["Caramelised turkey with honey, mushrooms & red wine", "Turkey, red wine, honey, mushrooms"],
        img: "assets/img/jela/curetina-med.webp", featured: true, price: null },
      { sr: ["Pileće kocke u sosu od 5 vrsta sira", "Piletina, vrhnje, sir, pomfrit"],
        en: ["Chicken in a five-cheese sauce", "Chicken, cream, cheese, fries"],
        img: "assets/img/jela/piletina-sir.webp", featured: true, price: null },
      { sr: ["Svinjski file sa suvim šljivama i bademom", "Svinjski file, suve šljive, bademi, džem od šljiva, pekarski krompir"],
        en: ["Pork tenderloin with prunes & almonds", "Pork tenderloin, prunes, almonds, plum jam, roast potatoes"],
        img: "assets/img/jela/svinjski-file.webp", featured: true, price: null },
      { sr: ["Teletina sa bukovačama", "Teletina, bukovače, začini, pekarski krompir"],
        en: ["Veal with oyster mushrooms", "Veal, oyster mushrooms, spices, roast potatoes"],
        img: "assets/img/jela/teletina-bukovace.webp", price: null },
      { sr: ["Biftek sa prelivom od bundeve", "Biftek, pasta od bundeve, vrhnje, povrće"],
        en: ["Beef tenderloin with pumpkin sauce", "Beef tenderloin, pumpkin paste, cream, vegetables"],
        img: "assets/img/jela/biftek-bundeva.webp", featured: true, price: null },
      { sr: ["Ćuretina sa prelivom od bundeve", "Ćuretina, vrhnje, pasta od bundeve, povrće"],
        en: ["Turkey with pumpkin sauce", "Turkey, cream, pumpkin paste, vegetables"],
        img: "assets/img/jela/curetina-bundeva.webp", price: null },
      { sr: ["Brownie sa šumskim voćem i sladoledom", "Čokolada, sladoled, maline, šumsko voće"],
        en: ["Brownie with forest berries & ice cream", "Chocolate, ice cream, raspberries, forest berries"],
        img: "assets/img/jela/brownie.webp", featured: true, price: null },
      { sr: ["Pita od jabuka", "Vrhnje, jabuka, lješnjaci, grožđice"],
        en: ["Apple pie", "Cream, apple, hazelnuts, raisins"],
        img: "assets/img/jela/pita-jabuka.webp", featured: true, price: null }
    ]
  },
  {
    id: "dorucak",
    sr: "Doručak", en: "Breakfast",
    note: { sr: "Svaki dan od 07:00", en: "Every day from 7 am" },
    items: [
      { sr: ["Omlet", "Po izboru: suvo meso, gljive ili Al Parco (kobasice, slanina, povrće)"],
        en: ["Omelette", "Your choice: cured beef, mushrooms or Al Parco (sausages, bacon, vegetables)"], price: null },
      { sr: ["Jaja na oko", "3 jaja, povrće, paradajz"],
        en: ["Fried eggs", "3 eggs, vegetables, tomato"], price: null },
      { sr: ["Uštipci", "Uz suvo meso ili kajmak"],
        en: ["Uštipci", "Traditional fried dough with cured beef or kajmak"], price: null },
      { sr: ["Doručak Al Parco", "Jaje na oko, kobasice, slanina, pršut, povrće, paradajz, krastavci"],
        en: ["Al Parco breakfast", "Fried egg, sausages, bacon, prosciutto, vegetables, tomato, cucumber"], price: null }
    ]
  },
  {
    id: "rizota",
    sr: "Rižota", en: "Risotto",
    items: [
      { sr: ["Rižoto sa piletinom i vrganjima", "Piletina, crni luk, tikvice, vrganji, paradajz"],
        en: ["Chicken & porcini risotto", "Chicken, onion, courgette, porcini, tomato"], price: null },
      { sr: ["Rižoto vege", "Tikvice, vrganji, paprika, rukola"],
        en: ["Vegetable risotto", "Courgette, porcini, peppers, rocket"], price: null },
      { sr: ["Rižoto sa morskim plodovima", "Arborio riža, morski plodovi, rukola, paradajz, crni luk"],
        en: ["Seafood risotto", "Arborio rice, seafood, rocket, tomato, onion"], price: null }
    ]
  },
  {
    id: "paste",
    sr: "Paste", en: "Pasta",
    items: [
      { sr: ["Pene quattro formaggi", "Pene, gorgonzola, dimljeni sir, edamer, parmezan, vrhnje"],
        en: ["Penne quattro formaggi", "Penne, gorgonzola, smoked cheese, Edam, parmesan, cream"], price: null },
      { sr: ["Pene u umaku od gljiva", "Pene, vrhnje, gljive"],
        en: ["Penne in mushroom sauce", "Penne, cream, mushrooms"], price: null },
      { sr: ["Špageti Bolognese", "Špageti, faširano meso, paradajz pire, parmezan"],
        en: ["Spaghetti Bolognese", "Spaghetti, minced meat, tomato purée, parmesan"], price: null },
      { sr: ["Tortelini sa lososom", "Losos, špinat, maskarpone, paradajz, bijeli luk, bijelo vino"],
        en: ["Tortellini with salmon", "Salmon, spinach, mascarpone, tomato, garlic, white wine"], price: null }
    ]
  },
  {
    id: "ribe",
    sr: "Riba", en: "Fish",
    items: [
      { sr: ["Lignje sa žara", "Lignje, blitva, krompir"],
        en: ["Grilled squid", "Squid, Swiss chard, potatoes"], price: null },
      { sr: ["Marinirani file pastrmke", "File pastrmke, maslinovo ulje, maskarpone, kiseli krastavci, jabuka, piccolo paradajz, rukola"],
        en: ["Marinated trout fillet", "Trout fillet, olive oil, mascarpone, pickles, apple, cherry tomatoes, rocket"], price: null },
      { sr: ["Losos sa žara", "Losos, tartar sos, blitva, krompir ili wok povrće"],
        en: ["Grilled salmon", "Salmon, tartare sauce, Swiss chard, potatoes or wok vegetables"], price: null }
    ]
  },
  {
    id: "specijaliteti",
    sr: "Specijaliteti kuće", en: "House specialities",
    items: [
      { sr: ["Teleći file u susamu", "Sos od rukole, pire krompir, mrkva, šparoge"],
        en: ["Veal fillet in sesame", "Rocket sauce, mashed potatoes, carrot, asparagus"], price: null },
      { sr: ["File minjon", "Biftek, pire od špinata, slatka rotkvica, grašak, krompir, mrkva, demi-glace, cvekla, balzamiko"],
        en: ["Filet mignon", "Beef tenderloin, spinach purée, sweet radish, peas, potatoes, carrot, demi-glace, beetroot, balsamic"], price: null }
    ]
  },
  {
    id: "pice",
    sr: "Pice", en: "Pizza",
    items: [
      { sr: ["Focaccia", "Tijesto, parmezan, luk"],
        en: ["Focaccia", "Dough, parmesan, onion"], price: null },
      { sr: ["Capricciosa", "Pelat, edamer, pileća šunka, origano"],
        en: ["Capricciosa", "Tomato, Edam, chicken ham, oregano"], price: null },
      { sr: ["Quattro stagioni", "Pelat, edamer, šunka, šampinjoni, pavlaka"],
        en: ["Quattro stagioni", "Tomato, Edam, ham, mushrooms, sour cream"], price: null },
      { sr: ["Pizza Al Parco", "Pelat, edamer, jaje, suvo meso, šampinjoni, rukola"],
        en: ["Pizza Al Parco", "Tomato, Edam, egg, cured beef, mushrooms, rocket"], price: null }
    ]
  },
  {
    id: "dezerti",
    sr: "Dezerti", en: "Desserts",
    items: [
      { sr: ["Čokoladni sufle sa sladoledom", ""],
        en: ["Chocolate soufflé with ice cream", ""], price: null },
      { sr: ["Palačinke", ""],
        en: ["Crêpes", ""], price: null },
      { sr: ["Panna cotta", ""],
        en: ["Panna cotta", ""], price: null },
      { sr: ["Brownie sa šumskim voćem i sladoledom", "Čokolada, sladoled, maline, šumsko voće"],
        en: ["Brownie with forest berries & ice cream", "Chocolate, ice cream, raspberries, forest berries"], price: null },
      { sr: ["Pita od jabuka", "Vrhnje, jabuka, lješnjaci, grožđice"],
        en: ["Apple pie", "Cream, apple, hazelnuts, raisins"], price: null }
    ]
  },
  {
    id: "pica",
    sr: "Vina i pića", en: "Wine & drinks",
    items: [
      { sr: ["Crvena vina", "Plantaže 13. jul, Vukoje, Tvrdoš"],
        en: ["Red wines", "Plantaže 13. jul, Vukoje, Tvrdoš"], price: null },
      { sr: ["Bijela vina", "Kutjevo, Plantaže 13. jul, Vukoje, Tvrdoš, Kovačević"],
        en: ["White wines", "Kutjevo, Plantaže 13. jul, Vukoje, Tvrdoš, Kovačević"], price: null },
      { sr: ["Pivo", "Nektar, Staropramen, Bavaria, Tuborg, Heineken, Paulaner"],
        en: ["Beer", "Nektar, Staropramen, Bavaria, Tuborg, Heineken, Paulaner"], price: null },
      { sr: ["Viski", "Ballantine's, Johnnie Walker, Jack Daniel's"],
        en: ["Whisky", "Ballantine's, Johnnie Walker, Jack Daniel's"], price: null }
    ]
  }
];
