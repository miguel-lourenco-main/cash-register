/**
 * Product manifest for AI photo generation + cloud upload.
 * `subject` is the per-product piece injected into the shared prompt template —
 * everything else (background, table, angle, lighting) is identical across all
 * 27 shots so the grid looks like one coherent photo session.
 */

export const PHOTO_STYLE_TEMPLATE = (subject) =>
  `Professional product photograph for a restaurant menu: ${subject}. ` +
  `The item sits on a rustic light-oak wooden table at a Portuguese village summer festival in the evening. ` +
  `Background: softly blurred warm festive string lights (bokeh) over deep warm dusk tones. ` +
  `Camera: 45-degree three-quarter angle, slightly above eye level, subject perfectly centered with generous margin around it, ` +
  `shallow depth of field focused on the subject. Lighting: warm golden-hour key light from the left with a soft shadow to the right. ` +
  `Square 1:1 composition. Photorealistic, appetizing, high detail. ` +
  `No people, no hands, no text, no logos, no brand labels.`

export const products = [
  // Bebidas
  { id: "cerveja", name: "Cerveja", price: 1.0, category: "bebida", description: "Imperial de cerveja", subject: "a single glass of cold draft lager beer (Portuguese imperial) with a perfect foam head and condensation drops" },
  { id: "metro-cerveja-11-imperiais", name: "Metro de cerveja (11 imperiais)", price: 10.0, category: "bebida", description: "Metro com 11 imperiais", subject: "eleven small draft beer glasses lined up in a neat row on a long narrow wooden plank (a Portuguese 'metro de cerveja'), seen at an angle so the row recedes into the background" },
  { id: "sidra", name: "Sidra", price: 1.5, category: "bebida", description: "Copo de sidra", subject: "a tall glass of sparkling golden cider with fine bubbles and a thin foam ring" },
  { id: "vinho-copo", name: "Vinho (copo)", price: 0.5, category: "bebida", description: "Copo de vinho tinto ou branco", subject: "a short rustic tumbler glass of red wine, the kind served at village festivals" },
  { id: "jarra-vinho", name: "Jarra de Vinho", price: 4.5, category: "bebida", description: "Jarra de vinho para partilhar", subject: "a glass pitcher (jarra) of red wine with two small rustic tumbler glasses beside it" },
  { id: "garrafa-vinho-monte-velho", name: "Garrafa de Vinho Monte Velho", price: 6.5, category: "bebida", description: "Garrafa de vinho Monte Velho", subject: "a corked dark-green bottle of Alentejo red wine with a plain unlabeled body, standing next to a single glass of red wine" },
  { id: "cerveja-sem-alcool", name: "Cerveja s/ álcool", price: 1.5, category: "bebida", description: "Cerveja sem álcool", subject: "a green glass beer bottle without label beside a half-filled small beer glass with light foam" },
  { id: "agua-33cl", name: "Água 33cl", price: 0.8, category: "bebida", description: "Garrafa de água 33cl", subject: "a small clear plastic bottle of still water (33cl) without label, with condensation drops" },
  { id: "agua-com-gas", name: "Água c/ gás", price: 1.2, category: "bebida", description: "Água com gás", subject: "a small glass bottle of sparkling mineral water without label next to a glass with visibly rising bubbles" },
  { id: "coca-cola-ice-tea-sumo", name: "Coca-cola/ Ice Tea/ Sumo lata", price: 1.5, category: "bebida", description: "Refrigerante ou sumo em lata", subject: "three plain unbranded aluminium soda cans in a row — one dark red, one golden yellow, one orange — with condensation drops" },
  { id: "ginja-copo-chocolate", name: "Ginja em copo de chocolate", price: 1.2, category: "bebida", description: "Ginja servida num copo comestível de chocolate", subject: "a tiny edible dark-chocolate cup filled with deep red ginjinha cherry liqueur, with one extra empty chocolate cup beside it" },
  { id: "vinho-porto", name: "Vinho do Porto", price: 1.5, category: "bebida", description: "Copo de vinho do Porto", subject: "a small stemmed glass of ruby port wine, rich dark red color" },
  { id: "favaios", name: "Favaios", price: 1.0, category: "bebida", description: "Copo de vinho moscatel de Favaios", subject: "a small glass of golden amber moscatel sweet wine" },
  { id: "licor-beirao", name: "Licor Beirão", price: 3.0, category: "bebida", description: "Copo de Licor Beirão", subject: "a lowball glass of amber herbal liqueur over large ice cubes" },
  { id: "shot", name: "Shot", price: 1.5, category: "bebida", description: "Shot de licor à escolha", subject: "a single small shot glass filled with bright red liqueur" },
  { id: "caipirao", name: "Caipirão", price: 3.5, category: "bebida", description: "Caipirinha com Licor Beirão", subject: "a caipirinha-style cocktail in a short tumbler full of crushed ice and lime wedges with an amber liqueur, stirrer in the glass" },
  { id: "porto-tonico", name: "Porto tónico", price: 3.5, category: "bebida", description: "Vinho do Porto com tónico", subject: "a tall glass cocktail of pale white port and tonic with ice cubes, a lemon slice and a sprig of mint" },
  { id: "whiskey", name: "Whiskey", price: 3.0, category: "bebida", description: "Copo de whiskey", subject: "a lowball glass of whiskey served neat, amber color glowing in warm light" },
  { id: "whiskey-agua-pedras", name: "Whiskey c/ água das pedras", price: 3.5, category: "bebida", description: "Whiskey com água das pedras", subject: "a lowball glass of whiskey with sparkling mineral water and ice cubes, small unlabeled sparkling water bottle behind it" },
  { id: "gin-tonico", name: "Gin tónico", price: 4.0, category: "bebida", description: "Gin com tónico", subject: "a large balloon glass of gin and tonic with ice cubes, juniper berries and a lime wheel" },
  { id: "cafe-descafeinado", name: "Café/ descafeínado", price: 0.8, category: "bebida", description: "Café ou descafeinado", subject: "a Portuguese espresso (bica) in a small white porcelain cup on a saucer with a plain sugar packet and tiny spoon" },
  // Comida
  { id: "batata-fritas", name: "Batata Fritas", price: 2.4, category: "comida", description: "Porção de batatas fritas", subject: "a paper cone overflowing with golden crispy french fries, a few fries scattered at the base" },
  { id: "bifanas", name: "Bifanas", price: 3.0, category: "comida", description: "Bifana no pão", subject: "a Portuguese bifana — juicy marinated pork cutlets tucked into a crusty white bread roll (papo seco), served on a small paper plate with sauce dripping" },
  { id: "pica-pau", name: "Pica pau", price: 5.0, category: "comida", description: "Prato de carne em cubos com molho", subject: "pica-pau — sautéed beef cubes in a garlicky beer sauce with pickles and olives, served in a shallow terracotta clay dish with toothpicks stuck in a few cubes" },
  { id: "moelas", name: "Moelas", price: 3.5, category: "comida", description: "Moelas de frango em molho picante", subject: "moelas — Portuguese stewed chicken gizzards in a rich red tomato-garlic sauce, served in a small terracotta clay bowl with a slice of rustic bread on the side" },
  { id: "gelado", name: "Gelado", price: 1.5, category: "comida", description: "Gelado individual", subject: "an ice cream cone with two generous scoops, vanilla and strawberry, standing upright in a wooden cone holder" },
  { id: "chupa-caramelo", name: "Chupa, Caramelo", price: 0.5, category: "comida", description: "Chupa-chupa ou caramelo", subject: "a small glass jar filled with colorful wrapped lollipops and golden caramel candies, a few candies spilled on the table" },
]
