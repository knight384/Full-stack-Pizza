import { InventoryCategory, InventoryItem, MenuItem } from "./types";

export const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'b1', name: 'Thin Crust', category: InventoryCategory.BASE, quantity: 50, threshold: 20, price: 5 },
  { id: 'b2', name: 'Cheese Burst', category: InventoryCategory.BASE, quantity: 30, threshold: 10, price: 7 },
  { id: 'b3', name: 'Whole Wheat', category: InventoryCategory.BASE, quantity: 40, threshold: 15, price: 6 },
  { id: 'b4', name: 'Gluten Free', category: InventoryCategory.BASE, quantity: 15, threshold: 5, price: 8 },
  { id: 'b5', name: 'Pan Pizza', category: InventoryCategory.BASE, quantity: 50, threshold: 20, price: 5 },
  { id: 's1', name: 'Classic Tomato', category: InventoryCategory.SAUCE, quantity: 100, threshold: 20, price: 1 },
  { id: 's2', name: 'Spicy Arrabbiata', category: InventoryCategory.SAUCE, quantity: 80, threshold: 15, price: 2 },
  { id: 's3', name: 'Pesto', category: InventoryCategory.SAUCE, quantity: 40, threshold: 10, price: 3 },
  { id: 's4', name: 'BBQ', category: InventoryCategory.SAUCE, quantity: 60, threshold: 15, price: 2 },
  { id: 's5', name: 'White Garlic', category: InventoryCategory.SAUCE, quantity: 50, threshold: 10, price: 2 },
  { id: 'c1', name: 'Mozzarella', category: InventoryCategory.CHEESE, quantity: 100, threshold: 20, price: 3 },
  { id: 'c2', name: 'Cheddar', category: InventoryCategory.CHEESE, quantity: 80, threshold: 15, price: 3 },
  { id: 'c3', name: 'Parmesan', category: InventoryCategory.CHEESE, quantity: 60, threshold: 10, price: 4 },
  { id: 'c4', name: 'Vegan Cheese', category: InventoryCategory.CHEESE, quantity: 20, threshold: 5, price: 5 },
  { id: 'v1', name: 'Onion', category: InventoryCategory.VEGGIE, quantity: 200, threshold: 30, price: 1 },
  { id: 'v2', name: 'Tomato', category: InventoryCategory.VEGGIE, quantity: 150, threshold: 30, price: 1 },
  { id: 'v3', name: 'Capsicum', category: InventoryCategory.VEGGIE, quantity: 150, threshold: 30, price: 1 },
  { id: 'v4', name: 'Mushroom', category: InventoryCategory.VEGGIE, quantity: 100, threshold: 20, price: 2 },
  { id: 'v5', name: 'Olives', category: InventoryCategory.VEGGIE, quantity: 80, threshold: 15, price: 2 },
  { id: 'v6', name: 'Jalapeno', category: InventoryCategory.VEGGIE, quantity: 80, threshold: 15, price: 2 },
  { id: 'v7', name: 'Corn', category: InventoryCategory.VEGGIE, quantity: 120, threshold: 25, price: 1 },
];

export const MENU_ITEMS: MenuItem[] = [
  // 1. Classic Neapolitan & Traditional Italian
  {
    id: 'it1', name: 'Margherita', description: 'San Marzano tomato sauce, fresh mozzarella di bufala, basil.', price: 14.99,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=500&q=80', category: 'ITALIAN', isVeg: true, rating: 4.8
  },
  {
    id: 'it2', name: 'Marinara', description: 'Tomato, garlic, oregano, extra virgin olive oil (no cheese).', price: 12.99,
    image: 'https://images.unsplash.com/photo-1595708684082-a173bb3a06c5?auto=format&fit=crop&w=500&q=80', category: 'ITALIAN', isVeg: true, rating: 4.5
  },
  {
    id: 'it3', name: 'Quattro Formaggi', description: 'A rich blend of Mozzarella, Gorgonzola, Parmesan, and Fontina.', price: 16.99,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80', category: 'ITALIAN', isVeg: true, rating: 4.7
  },
  {
    id: 'it4', name: 'Capricciosa', description: 'Tomato, mozzarella, ham, mushrooms, artichoke, and olives.', price: 17.99,
    image: 'https://images.unsplash.com/photo-1520201163981-8cc95007dd2a?auto=format&fit=crop&w=500&q=80', category: 'ITALIAN', isVeg: false, rating: 4.6
  },
  {
    id: 'it5', name: 'Prosciutto e Funghi', description: 'Simple and elegant: Prosciutto ham and mushrooms.', price: 16.99,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=500&q=80', category: 'ITALIAN', isVeg: false, rating: 4.5
  },

  // 2. Roman, Sicilian & Other Italian Regional
  {
    id: 'reg1', name: 'Sicilian Sfincione', description: 'Thick rectangular crust with onions, anchovies, tomatoes, and strong cheese.', price: 18.99,
    image: 'https://images.unsplash.com/photo-1552539618-7eec9b4d1796?auto=format&fit=crop&w=500&q=80', category: 'ITALIAN_REGIONAL', isVeg: false, rating: 4.4
  },
  {
    id: 'reg2', name: 'Pizza al Taglio', description: 'Roman style rectangular slice sold by weight.', price: 8.99,
    image: 'https://images.unsplash.com/photo-1566843972306-38d8b152e42e?auto=format&fit=crop&w=500&q=80', category: 'ITALIAN_REGIONAL', isVeg: true, rating: 4.5
  },
  {
    id: 'reg3', name: 'Pizza Bianca', description: 'Crispy flatbread with olive oil, rosemary, and salt.', price: 10.99,
    image: 'https://images.unsplash.com/photo-1558138838-6f95c72039a6?auto=format&fit=crop&w=500&q=80', category: 'ITALIAN_REGIONAL', isVeg: true, rating: 4.3
  },
  {
    id: 'reg4', name: 'Pizza con le Patate', description: 'Thin crust topped with thinly sliced potatoes, rosemary, and mozzarella.', price: 14.99,
    image: 'https://images.unsplash.com/photo-1627033196700-74c9644273df?auto=format&fit=crop&w=500&q=80', category: 'ITALIAN_REGIONAL', isVeg: true, rating: 4.4
  },

  // 3. American regional
  {
    id: 'us1', name: 'New York Style', description: 'Large foldable slice with classic tomato sauce and mozzarella.', price: 18.99,
    image: 'https://images.unsplash.com/photo-1514584745646-e4454a0e7771?auto=format&fit=crop&w=500&q=80', category: 'AMERICAN', isVeg: false, rating: 4.6
  },
  {
    id: 'us2', name: 'Chicago Deep Dish', description: 'Tall pan crust layered with cheese, meat, and chunky sauce.', price: 24.99,
    image: 'https://images.unsplash.com/photo-1505571371918-0c358a01681a?auto=format&fit=crop&w=500&q=80', category: 'AMERICAN', isVeg: false, rating: 4.7
  },
  {
    id: 'us3', name: 'Detroit Style', description: 'Rectangular, airy, with caramelized cheese edges.', price: 22.99,
    image: 'https://images.unsplash.com/photo-1604051725102-200a86933751?auto=format&fit=crop&w=500&q=80', category: 'AMERICAN', isVeg: true, rating: 4.5
  },
  {
    id: 'us4', name: 'St. Louis Style', description: 'Ultra-thin cracker crust topped with Provel cheese.', price: 16.99,
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=500&q=80', category: 'AMERICAN', isVeg: false, rating: 4.2
  },
  {
    id: 'us5', name: 'New Haven Apizza', description: 'Charred thin crust, Pecorino Romano, oregano, olive oil.', price: 19.99,
    image: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=500&q=80', category: 'AMERICAN', isVeg: true, rating: 4.6
  },

  // 4. Gourmet / Contemporary
  {
    id: 'gm1', name: 'Truffle Mushroom', description: 'Earthy mushrooms finished with premium white truffle oil.', price: 22.99,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80', category: 'GOURMET', isVeg: true, rating: 4.9
  },
  {
    id: 'gm2', name: 'Fig & Prosciutto', description: 'Sweet figs paired with salty prosciutto and balsamic glaze.', price: 21.99,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500&q=80', category: 'GOURMET', isVeg: false, rating: 4.8
  },
  {
    id: 'gm3', name: 'Pear & Gorgonzola', description: 'Sliced pears, blue cheese, and walnuts on a white base.', price: 20.99,
    image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?auto=format&fit=crop&w=500&q=80', category: 'GOURMET', isVeg: true, rating: 4.6
  },
  {
    id: 'gm4', name: 'Burrata & Heirloom', description: 'Fresh heirloom tomatoes topped with creamy burrata cheese.', price: 23.99,
    image: 'https://images.unsplash.com/photo-1576458088443-04a19bb13da6?auto=format&fit=crop&w=500&q=80', category: 'GOURMET', isVeg: true, rating: 4.9
  },
  {
    id: 'gm5', name: 'Smoked Duck', description: 'Smoked duck breast with hoisin or fruit glaze.', price: 25.99,
    image: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?auto=format&fit=crop&w=500&q=80', category: 'GOURMET', isVeg: false, rating: 4.7
  },

  // 5. Meat-focused
  {
    id: 'mt1', name: 'Pepperoni Feast', description: 'Loaded with double crispy pepperoni slices.', price: 18.99,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=500&q=80', category: 'MEAT', isVeg: false, rating: 4.8
  },
  {
    id: 'mt2', name: 'Meat Lovers Supreme', description: 'Pepperoni, sausage, ham, and bacon.', price: 21.99,
    image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=500&q=80', category: 'MEAT', isVeg: false, rating: 4.7
  },
  {
    id: 'mt3', name: 'Hawaiian Luau', description: 'Classic ham and pineapple. Love it or hate it.', price: 17.99,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500&q=80', category: 'MEAT', isVeg: false, rating: 4.3
  },
  {
    id: 'mt4', name: 'BBQ Pulled Pork', description: 'Tender pulled pork with red onions and bbq drizzle.', price: 20.99,
    image: 'https://images.unsplash.com/photo-1618213837799-2aa6bb7b7176?auto=format&fit=crop&w=500&q=80', category: 'MEAT', isVeg: false, rating: 4.6
  },
  {
    id: 'mt5', name: 'Sausage & Peppers', description: 'Italian sausage with roasted bell peppers.', price: 19.99,
    image: 'https://images.unsplash.com/photo-1589187151053-5ec8818e661b?auto=format&fit=crop&w=500&q=80', category: 'MEAT', isVeg: false, rating: 4.5
  },

  // 6. Vegetarian & Vegan
  {
    id: 'vg1', name: 'Spinach & Ricotta', description: 'Creamy ricotta mounds with wilted fresh spinach.', price: 17.99,
    image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=500&q=80', category: 'VEGGIE', isVeg: true, rating: 4.5
  },
  {
    id: 'vg2', name: 'Caprese', description: 'Fresh tomatoes, mozzarella, and basil. Simple and fresh.', price: 16.99,
    image: 'https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?auto=format&fit=crop&w=500&q=80', category: 'VEGGIE', isVeg: true, rating: 4.6
  },
  {
    id: 'vg3', name: 'Greek Style', description: 'Feta cheese, kalamata olives, red onion, and oregano.', price: 18.99,
    image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=500&q=80', category: 'VEGGIE', isVeg: true, rating: 4.4
  },
  {
    id: 'vg4', name: 'Vegan Margherita', description: 'Classic flavors with dairy-free plant cheese.', price: 16.99,
    image: 'https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?auto=format&fit=crop&w=500&q=80', category: 'VEGGIE', isVeg: true, rating: 4.3
  },
  {
    id: 'vg5', name: 'Roasted Pumpkin & Sage', description: 'Seasonal sweet pumpkin and aromatic sage.', price: 19.99,
    image: 'https://images.unsplash.com/photo-1506354666786-959d6d497f1a?auto=format&fit=crop&w=500&q=80', category: 'VEGGIE', isVeg: true, rating: 4.7
  },

  // 7. Seafood & Coastal
  {
    id: 'sf1', name: 'White Clam Pizza', description: 'New Haven classic with fresh clams, garlic, and olive oil.', price: 21.99,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80', category: 'SEAFOOD', isVeg: false, rating: 4.5
  },
  {
    id: 'sf2', name: 'Shrimp & Garlic', description: 'Juicy shrimp sauteed in garlic butter on a white base.', price: 22.99,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500&q=80', category: 'SEAFOOD', isVeg: false, rating: 4.6
  },
  {
    id: 'sf3', name: 'Smoked Salmon & Dill', description: 'Cold smoked salmon with cream cheese and dill.', price: 24.99,
    image: 'https://images.unsplash.com/photo-1558138838-6f95c72039a6?auto=format&fit=crop&w=500&q=80', category: 'SEAFOOD', isVeg: false, rating: 4.7
  },
  {
    id: 'sf4', name: 'Anchovy & Capers', description: 'Salty anchovies paired with capers and lemon zest.', price: 19.99,
    image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=500&q=80', category: 'SEAFOOD', isVeg: false, rating: 4.2
  },

  // 8. International
  {
    id: 'int1', name: 'Turkish Lahmacun', description: 'Thin flatbread topped with spiced minced meat and herbs.', price: 14.99,
    image: 'https://images.unsplash.com/photo-1626509653294-4360e281577d?auto=format&fit=crop&w=500&q=80', category: 'INTERNATIONAL', isVeg: false, rating: 4.6
  },
  {
    id: 'int2', name: 'Georgian Khachapuri', description: 'Cheese-filled bread boat topped with an egg and butter.', price: 18.99,
    image: 'https://images.unsplash.com/photo-1606624946328-d766b5399587?auto=format&fit=crop&w=500&q=80', category: 'INTERNATIONAL', isVeg: true, rating: 4.9
  },
  {
    id: 'int3', name: 'Manakish Za\'atar', description: 'Levantine flatbread topped with thyme, sesame, and sumac.', price: 11.99,
    image: 'https://images.unsplash.com/photo-1626509653294-4360e281577d?auto=format&fit=crop&w=500&q=80', category: 'INTERNATIONAL', isVeg: true, rating: 4.5
  },
  {
    id: 'int4', name: 'Japanese Corn & Mayo', description: 'Sweet corn and mayonnaise with savory cheese.', price: 15.99,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80', category: 'INTERNATIONAL', isVeg: true, rating: 4.4
  },
  {
    id: 'int5', name: 'Korean Bulgogi', description: 'Sweet marinated beef topping with veggies.', price: 21.99,
    image: 'https://images.unsplash.com/photo-1618213837799-2aa6bb7b7176?auto=format&fit=crop&w=500&q=80', category: 'INTERNATIONAL', isVeg: false, rating: 4.8
  },

  // 9. Specialty Crusts & Formats
  {
    id: 'fmt1', name: 'Classic Calzone', description: 'Folded pizza pocket stuffed with mozzarella and ricotta.', price: 16.99,
    image: 'https://images.unsplash.com/photo-1542283737-f7035eb4457e?auto=format&fit=crop&w=500&q=80', category: 'FORMATS', isVeg: true, rating: 4.6
  },
  {
    id: 'fmt2', name: 'Stuffed Crust Pepperoni', description: 'The classic with a ring of cheese baked into the crust.', price: 21.99,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=500&q=80', category: 'FORMATS', isVeg: false, rating: 4.8
  },
  {
    id: 'fmt3', name: 'Cauliflower Crust Veg', description: 'Low-carb cauliflower base topped with garden veggies.', price: 20.99,
    image: 'https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?auto=format&fit=crop&w=500&q=80', category: 'FORMATS', isVeg: true, rating: 4.4
  },
  {
    id: 'fmt4', name: 'Stromboli', description: 'Rolled pizza loaf filled with meats and cheeses.', price: 17.99,
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=500&q=80', category: 'FORMATS', isVeg: false, rating: 4.5
  },

  // 10. Desserts
  {
    id: 'dst1', name: 'Nutella & Banana', description: 'Warm Nutella spread with fresh banana slices.', price: 12.99,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500&q=80', category: 'DESSERTS', isVeg: true, rating: 4.9
  },
  {
    id: 'dst2', name: 'S\'mores Pizza', description: 'Chocolate chunks, toasted marshmallows, and graham crumbs.', price: 13.99,
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=500&q=80', category: 'DESSERTS', isVeg: true, rating: 4.8
  },
  {
    id: 'dst3', name: 'Apple Crumble Pizza', description: 'Warm cinnamon apples with a sweet streusel topping.', price: 13.99,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80', category: 'DESSERTS', isVeg: true, rating: 4.5
  },
  {
    id: 'dst4', name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with a gooey molten center.', price: 9.99,
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=500&q=80', category: 'DESSERTS', isVeg: true, rating: 4.9
  },
  {
    id: 'dst5', name: 'Fruit Pizza', description: 'A delightful mix of fresh fruits on a sweet cream cheese base.', price: 11.99,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500&q=80', category: 'DESSERTS', isVeg: true, rating: 4.7
  },

  // 11. Fusion & Street
  {
    id: 'fs1', name: 'Chicken Shawarma', description: 'Middle eastern spiced chicken with garlic sauce drizzle.', price: 19.99,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500&q=80', category: 'FUSION', isVeg: false, rating: 4.6
  },
  {
    id: 'fs2', name: 'Breakfast Pizza', description: 'Bacon, eggs, and cheese on a breakfast style crust.', price: 17.99,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80', category: 'FUSION', isVeg: false, rating: 4.5
  },
  {
    id: 'fs3', name: 'Mexican Tostada Style', description: 'Thin crispy base with beans, salsa, and avocado.', price: 18.99,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=500&q=80', category: 'FUSION', isVeg: true, rating: 4.4
  },
  {
    id: 'fs4', name: 'Tandoori Chicken', description: 'Indian tandoori-spiced chicken with red onion and cilantro.', price: 20.99,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500&q=80', category: 'FUSION', isVeg: false, rating: 4.7
  },

  // 12. Seasonal & Holiday
  {
    id: 'sn1', name: 'Summer BBQ Veg', description: 'Grilled summer vegetables with a smoky BBQ sauce.', price: 18.99,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500&q=80', category: 'SEASONAL', isVeg: true, rating: 4.7
  },
  {
    id: 'sn2', name: 'Thanksgiving Feast', description: 'Turkey, cranberry sauce, and stuffing toppings.', price: 22.99,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80', category: 'SEASONAL', isVeg: false, rating: 4.3
  },
  {
    id: 'sn3', name: 'Easter Lamb', description: 'Roast lamb with mint and yogurt drizzle.', price: 24.99,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80', category: 'SEASONAL', isVeg: false, rating: 4.6
  },
  
  // Sides
  {
    id: 'sd1', name: 'Garlic Breadsticks', description: 'Baked to perfection with garlic butter.', price: 8.99,
    image: 'https://images.unsplash.com/photo-1573140247632-f84660f67126?auto=format&fit=crop&w=500&q=80', category: 'SIDES', isVeg: true, rating: 4.9
  }
];
