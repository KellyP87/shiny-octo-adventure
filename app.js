const form = document.getElementById('recipe-form');
const output = document.getElementById('output');

const mealProfiles = {
  Breakfast: {
    titleBase: 'Simple Morning Bowl',
    prepLine: 'Gather everything before cooking so breakfast stays easy.',
    finishLine: 'Serve warm with a squeeze of lemon if desired.',
  },
  Lunch: {
    titleBase: 'Simple Midday Plate',
    prepLine: 'Keep prep short by chopping only what is needed.',
    finishLine: 'Plate and add fresh herbs for a clean finish.',
  },
  Dinner: {
    titleBase: 'Simple Evening Skillet',
    prepLine: 'Start with a single pan to keep cleanup minimal.',
    finishLine: 'Let it rest for one minute, then serve warm.',
  },
};

const fixedProfile = {
  titleHint: 'High-Protein Gut-Friendly',
  cookTime: '20-25 minutes',
  pantryBoost: [
    'greek yogurt',
    'cottage cheese',
    'salmon',
    'eggs',
    'spinach',
    'zucchini',
    'ginger',
    'olive oil',
  ],
  cookingNote:
    'Use gentle heat and simple seasoning to keep the meal easy to digest and protein focused.',
};

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function parseIngredients(rawInput) {
  return rawInput
    .split(/[,\n;]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 12);
}

function normalizeUnique(items) {
  const seen = new Set();
  const normalized = [];

  for (const item of items) {
    const key = item.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      normalized.push(key.charAt(0).toUpperCase() + key.slice(1));
    }
  }

  return normalized;
}

function selectMealProfile(meal) {
  return mealProfiles[meal] || mealProfiles.Breakfast;
}

function parseServings(rawServings) {
  const servings = Number(rawServings);
  if (!Number.isFinite(servings)) {
    return 2;
  }

  return Math.min(8, Math.max(1, Math.round(servings)));
}

function roundToQuarter(value) {
  return Math.max(0.25, Math.round(value * 4) / 4);
}

function formatAmount(value) {
  const rounded = roundToQuarter(value);
  if (Number.isInteger(rounded)) {
    return String(rounded);
  }

  return String(rounded).replace(/\.0+$/, '');
}

function getUnitConfig(name) {
  const lower = name.toLowerCase();

  if (/\begg\b/.test(lower)) {
    return { unit: 'egg', base: 1 };
  }
  if (/(garlic|ginger|pepper flakes|paprika|cumin|turmeric|salt|pepper)/.test(lower)) {
    return { unit: 'tsp', base: 0.5 };
  }
  if (/(oil|lemon juice|vinegar|soy sauce|honey|mustard)/.test(lower)) {
    return { unit: 'tbsp', base: 1 };
  }
  if (/(rice|oats|lentils|quinoa|beans|chickpeas|yogurt|milk|broth)/.test(lower)) {
    return { unit: 'cup', base: 0.5 };
  }
  if (/(spinach|kale|lettuce|cabbage|mixed greens|herbs|zucchini|carrot)/.test(lower)) {
    return { unit: 'cup', base: 1 };
  }
  if (/(chicken|turkey|tofu|salmon|tuna|cottage cheese|greek yogurt)/.test(lower)) {
    return { unit: 'oz', base: 4 };
  }

  return { unit: 'cup', base: 0.5 };
}

function pluralizeUnit(unit, amount) {
  if (amount === 1) {
    return unit;
  }

  if (unit === 'tbsp' || unit === 'tsp' || unit === 'oz') {
    return unit;
  }

  return `${unit}s`;
}

function buildMeasuredIngredientList(ingredients, servings) {
  const scale = servings / 2;
  return ingredients.map((name) => {
    const config = getUnitConfig(name);
    const rawAmount = config.base * scale;
    const amount = Number(formatAmount(rawAmount));
    return {
      name,
      amount: formatAmount(rawAmount),
      unit: pluralizeUnit(config.unit, amount),
    };
  });
}

function buildInstructions({ ingredients, meal }) {
  const mealProfile = selectMealProfile(meal);
  const core = ingredients.slice(0, 4);
  const primaryPrep = core.length > 0 ? core.join(', ') : 'your ingredients';

  return [
    mealProfile.prepLine,
    `Chop and portion ${primaryPrep} into simple, even pieces.`,
    `Cook over medium or medium-low heat for 8-12 minutes, stirring as needed. ${fixedProfile.cookingNote}`,
    'Add salt and optional lemon or herbs, then stop once ingredients are just cooked.',
    mealProfile.finishLine,
  ];
}

function createRecipe({ ingredients, meal, servings }) {
  const mealProfile = selectMealProfile(meal);
  const ingredientList = normalizeUnique([...ingredients, ...fixedProfile.pantryBoost]).slice(0, 12);
  const measuredIngredients = buildMeasuredIngredientList(ingredientList, servings);
  const instructions = buildInstructions({ ingredients, meal });

  return {
    name: `${mealProfile.titleBase} ${fixedProfile.titleHint}`,
    cookTime: fixedProfile.cookTime,
    servings,
    ingredientList: measuredIngredients,
    instructions,
  };
}

function renderRecipe(recipe) {
  const ingredientMarkup = recipe.ingredientList
    .map(
      (item) =>
        `<li>${escapeHtml(item.amount)} ${escapeHtml(item.unit)} ${escapeHtml(item.name)}</li>`
    )
    .join('');
  const stepsMarkup = recipe.instructions.map((step) => `<li>${escapeHtml(step)}</li>`).join('');

  output.innerHTML = `
    <h2>${escapeHtml(recipe.name)}</h2>
    <p class="meta"><strong>Estimated cook time:</strong> ${escapeHtml(recipe.cookTime)} | <strong>Servings:</strong> ${escapeHtml(recipe.servings)}</p>

    <h3>Ingredient list with measurements</h3>
    <ul>${ingredientMarkup}</ul>

    <h3>Simple cooking steps</h3>
    <ol>${stepsMarkup}</ol>
  `;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const ingredients = parseIngredients(String(formData.get('ingredients') || ''));
  const meal = String(formData.get('meal') || 'Breakfast');
  const servings = parseServings(String(formData.get('servings') || '2'));

  if (ingredients.length === 0) {
    output.innerHTML = '<p>Please add at least one ingredient.</p>';
    return;
  }

  const recipe = createRecipe({ ingredients, meal, servings });
  renderRecipe(recipe);
});
