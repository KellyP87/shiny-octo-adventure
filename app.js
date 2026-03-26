const form = document.getElementById('recipe-form');
const output = document.getElementById('output');

const preferenceProfiles = {
  'high protein': {
    titleHint: 'Power Bowl',
    cookTime: '30-35 minutes',
    addOns: ['Greek yogurt', 'chickpeas', 'eggs'],
    style: 'focused on protein-rich ingredients',
  },
  'quick meal': {
    titleHint: 'Speedy Skillet',
    cookTime: '15-20 minutes',
    addOns: ['olive oil', 'garlic', 'mixed herbs'],
    style: 'kept simple with minimal prep and fast cooking',
  },
  'gut friendly': {
    titleHint: 'Calm & Nourish Plate',
    cookTime: '25-30 minutes',
    addOns: ['ginger', 'spinach', 'plain kefir or yogurt'],
    style: 'designed with fiber and easy-to-digest choices',
  },
};

const mealProfiles = {
  Breakfast: {
    methodStart: 'Start by warming a pan on medium heat and preparing your breakfast ingredients.',
    suffix: 'Breakfast',
  },
  Lunch: {
    methodStart: 'Start by prepping a balanced lunch base with your main ingredients.',
    suffix: 'Lunch Bowl',
  },
  Dinner: {
    methodStart: 'Start by building deeper flavor for dinner in a pan or pot over medium heat.',
    suffix: 'Dinner Plate',
  },
};

function cleanIngredients(rawInput) {
  return rawInput
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 12);
}

function uniqueItems(items) {
  return [...new Set(items.map((item) => item.toLowerCase()))].map(
    (item) => item.charAt(0).toUpperCase() + item.slice(1)
  );
}

function createRecipe({ ingredients, dietary, meal }) {
  const dietaryProfile = preferenceProfiles[dietary];
  const mealProfile = mealProfiles[meal];

  const pantryBoost = uniqueItems([...ingredients, ...dietaryProfile.addOns]).slice(0, 10);
  const recipeName = `${meal} ${dietaryProfile.titleHint} ${mealProfile.suffix}`;

  const steps = [
    mealProfile.methodStart,
    `Combine ${ingredients.slice(0, 3).join(', ')} with basic seasoning (salt, pepper, and your favorite spices).`,
    `Cook everything until tender and well combined; keep it ${dietaryProfile.style}.`,
    `Taste and adjust. Serve warm and top with a fresh element like herbs or lemon juice.`,
  ];

  return {
    name: recipeName,
    ingredientList: pantryBoost,
    steps,
    cookTime: dietaryProfile.cookTime,
  };
}

function renderRecipe(recipe) {
  const ingredientMarkup = recipe.ingredientList.map((item) => `<li>${item}</li>`).join('');
  const stepMarkup = recipe.steps.map((step) => `<li>${step}</li>`).join('');

  output.innerHTML = `
    <h2>${recipe.name}</h2>
    <p class="meta"><strong>Estimated cook time:</strong> ${recipe.cookTime}</p>

    <h3>Ingredient list</h3>
    <ul>${ingredientMarkup}</ul>

    <h3>Step-by-step instructions</h3>
    <ol>${stepMarkup}</ol>
  `;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const ingredientsRaw = formData.get('ingredients');
  const dietary = formData.get('dietary');
  const meal = formData.get('meal');

  const ingredients = cleanIngredients(String(ingredientsRaw));

  if (ingredients.length === 0) {
    output.innerHTML = '<p>Please add at least one ingredient.</p>';
    return;
  }

  const recipe = createRecipe({ ingredients, dietary, meal });
  renderRecipe(recipe);
});
