// Bungalow — Goan premium cuisine
window.BUNGALOW_MENU = {
  categories: [
    { id: "starters", label: "Petiscos" },
    { id: "mains",    label: "Mains" },
    { id: "bowls",    label: "Feasting Platters" },
    { id: "breads",   label: "Breads" },
    { id: "desserts", label: "Doces" },
    { id: "drinks",   label: "Drinks" },
  ],
  items: [
    // Starters — Petiscos
    { id: "s1", cat: "starters", name: "Chouriço Pão",           price: 520, desc: "House-cured Goan pork sausage, toasted poee, pickled onion, bird's-eye chili.",      tags: ["signature","non-veg"], allergens: ["gluten","sulphites"],   tint: "#7a2a1a" },
    { id: "s2", cat: "starters", name: "Rechado Prawn Toast",    price: 560, desc: "Tiger prawns in rechado masala, sourdough, squid-ink aioli.",                       tags: ["non-veg"],             allergens: ["shellfish","gluten","eggs"], tint: "#a8381a" },
    { id: "s3", cat: "starters", name: "Cafreal Quail",          price: 480, desc: "Coriander-marinated quail, green peppercorn jus, cashew crumble.",                 tags: ["signature","non-veg"], allergens: ["nuts"],                 tint: "#3a4a1a" },
    { id: "s4", cat: "starters", name: "Kokum Chèvre Salad",     price: 420, desc: "Whipped goat cheese, kokum gel, heirloom tomato, basil oil.",                     tags: ["veg"],                 allergens: ["dairy"],                tint: "#c94a5a" },
    { id: "s5", cat: "starters", name: "Xacuti Mushroom Croquette", price: 440, desc: "Wild mushroom, roasted coconut-chili xacuti, aioli.",                           tags: ["veg"],                 allergens: ["gluten","eggs","dairy"], tint: "#4a2e18" },
    { id: "s6", cat: "starters", name: "Balchão Arancini",       price: 460, desc: "Risotto cakes bound with prawn balchão, tamarind glaze, curry leaf crisp.",        tags: ["signature","non-veg"], allergens: ["shellfish","dairy","gluten"], tint: "#8b2e1a" },

    // Mains
    { id: "m1", cat: "mains",    name: "Pork Vindaloo",          price: 780, desc: "Heritage recipe, 24-hour marinated pork, red wine vinegar, toddy palm sugar.",    tags: ["signature","non-veg"], allergens: ["sulphites"],            tint: "#4a1a0a" },
    { id: "m2", cat: "mains",    name: "Goan Fish Curry",        price: 820, desc: "Line-caught kingfish, coconut-kokum curry, triple-chili tempering.",              tags: ["signature","non-veg"], allergens: ["fish"],                 tint: "#a85820" },
    { id: "m3", cat: "mains",    name: "Prawn Caldine",          price: 860, desc: "Tiger prawns, gentle coconut-turmeric broth, green mango, steamed rice.",         tags: ["non-veg"],             allergens: ["shellfish"],            tint: "#d4a060" },
    { id: "m4", cat: "mains",    name: "Chicken Cafreal",        price: 680, desc: "Whole poussin, cafreal green masala, burnt butter potatoes.",                     tags: ["non-veg"],             allergens: ["dairy"],                tint: "#3e4a1c" },
    { id: "m5", cat: "mains",    name: "Paneer Xacuti",          price: 620, desc: "Artisan paneer, roasted coconut & poppy xacuti, ash-roasted shallot.",            tags: ["veg"],                 allergens: ["dairy","nuts"],         tint: "#6b3a1c" },
    { id: "m6", cat: "mains",    name: "Okra Foogath",           price: 540, desc: "Charred okra, coconut, curry leaf, Goan vinegar reduction.",                      tags: ["veg"],                 allergens: [],                       tint: "#5a6b2a" },

    // Feasting Platters
    { id: "b1", cat: "bowls",    name: "Susegad Vegetarian Feast", price: 980, desc: "Seven plates: xacuti, caldine, foogath, poee, sol kadi, rice, kheer.",          tags: ["veg","signature"],     allergens: ["dairy","nuts","gluten"],  tint: "#c48a4a" },
    { id: "b2", cat: "bowls",    name: "Fisherman's Platter",    price: 1180, desc: "Kingfish curry, prawn caldine, chouriço rice, sol kadi, poee.",                  tags: ["non-veg","signature"], allergens: ["fish","shellfish","gluten","sulphites"], tint: "#6c2c14" },

    // Breads
    { id: "br1", cat: "breads",  name: "Poee",                   price: 180, desc: "Traditional Goan whole-wheat bread, wood-fired, served warm.",                    tags: ["veg"],                 allergens: ["gluten"],               tint: "#d8b478" },
    { id: "br2", cat: "breads",  name: "Sannas",                 price: 200, desc: "Steamed toddy-risen rice cakes. Three per order.",                                tags: ["veg"],                 allergens: [],                       tint: "#efe0b4" },

    // Desserts — Doces
    { id: "d1", cat: "desserts", name: "Bebinca",                price: 420, desc: "Seven-layer Goan coconut cake, cardamom cream, burnt sugar tuile.",               tags: ["signature","veg"],     allergens: ["dairy","eggs","gluten"], tint: "#4a2a10" },
    { id: "d2", cat: "desserts", name: "Serradura Parfait",      price: 380, desc: "Marie-biscuit crumb, whipped vanilla cream, port wine caramel.",                  tags: ["veg"],                 allergens: ["dairy","gluten","sulphites"], tint: "#c8a070" },

    // Drinks
    { id: "dr1", cat: "drinks",  name: "Sol Kadi",               price: 240, desc: "Chilled kokum-coconut digestif, pink peppercorn, curry leaf.",                     tags: ["veg"],                 allergens: [],                       tint: "#d46a8a" },
    { id: "dr2", cat: "drinks",  name: "Feni Sour",              price: 580, desc: "Cashew feni, lime, egg white, bird's-eye chili oil.",                              tags: ["signature","veg"],     allergens: ["eggs","nuts","alcohol"], tint: "#c9a84a" },
    { id: "dr3", cat: "drinks",  name: "Port Tonic",             price: 540, desc: "White port, Goan tonic, rosemary, orange peel.",                                   tags: ["veg"],                 allergens: ["sulphites","alcohol"],  tint: "#5a3a6a" },
  ],
};

window.BUNGALOW_DINERS = {
  4: ["Ana", "Ravi", "Meera", "Kabir"],
  3: ["Ana", "Ravi", "Meera"],
  2: ["Ana", "Ravi"],
  5: ["Ana", "Ravi", "Meera", "Kabir", "Sia"],
};

window.BUNGALOW_FLOW_STEPS = [
  { id: "booking",    label: "Booking (phone)" },
  { id: "arrival",    label: "Arrival / Reserved" },
  { id: "seated",     label: "Seated — split screens" },
  { id: "welcome",    label: "Welcome card" },
  { id: "menu",       label: "Menu" },
  { id: "cart",       label: "Cart review" },
  { id: "sending",    label: "Send to kitchen (anim)" },
  { id: "game_prompt",label: "Play a game?" },
  { id: "game_select",label: "Choose a game" },
  { id: "game_play",  label: "Playing Ludo" },
  { id: "food_ready", label: "Food is here" },
  { id: "ambient",    label: "Dining — ambient" },
  { id: "reorder",    label: "Reorder panel (3x tap)" },
  { id: "bill_ask",   label: "Pay the bill?" },
  { id: "bill_split", label: "Split / Pay share" },
  { id: "bill_pay",   label: "Payment method" },
  { id: "thankyou",   label: "Thank you" },
];
