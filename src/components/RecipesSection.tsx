import React from 'react';
import { ChefHat, Clock, Sparkles, Plus, Check } from 'lucide-react';
import { RECIPES, RecipeIdea, Product } from '../data/products';
import { Language } from '../types';

interface RecipesSectionProps {
  language: Language;
  onAddMultipleToCart: (products: Product[]) => void;
  allProducts: Product[];
}

export const RecipesSection: React.FC<RecipesSectionProps> = ({
  language,
  onAddMultipleToCart,
  allProducts,
}) => {
  const [addedRecipeId, setAddedRecipeId] = React.useState<string | null>(null);

  const handleAddRecipeIngredients = (recipe: RecipeIdea) => {
    // Find matching products
    const matchedProducts: Product[] = [];
    recipe.ingredientsSw.forEach((ing) => {
      const found = allProducts.find((p) =>
        p.nameSw.toLowerCase().includes(ing.toLowerCase().split(' ')[0]) ||
        p.nameEn.toLowerCase().includes(ing.toLowerCase().split(' ')[0])
      );
      if (found && !matchedProducts.some((mp) => mp.id === found.id)) {
        matchedProducts.push(found);
      }
    });

    if (matchedProducts.length > 0) {
      onAddMultipleToCart(matchedProducts);
      setAddedRecipeId(recipe.id);
      setTimeout(() => setAddedRecipeId(null), 1500);
    }
  };

  return (
    <section className="py-10 sm:py-14 bg-stone-100 border-y border-stone-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
              <ChefHat className="w-4 h-4 text-emerald-700" />
              <span>{language === 'sw' ? 'Jiko la Kitanzania' : 'Swahili Kitchen'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              {language === 'sw' ? 'Pika kwa Mazao Safi ya Sokoni' : 'Cook With Fresh Market Ingredients'}
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm mt-1 max-w-xl">
              {language === 'sw'
                ? 'Mawazo ya mapishi matamu ya kila siku. Unaweza kuongeza viungo vyote kwenye kikapu chako kwa mbofyo mmoja.'
                : 'Delicious traditional home cooking ideas with ingredients sourced directly from our market stall.'}
            </p>
          </div>
        </div>

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {RECIPES.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-stone-200">
                  <img
                    src={recipe.image}
                    alt={recipe.titleSw}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-2 left-2 bg-stone-900/80 backdrop-blur-sm text-white text-[11px] font-medium px-2 py-0.5 rounded flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>{recipe.time}</span>
                    <span aria-hidden="true">·</span>
                    <span>{language === 'sw' ? recipe.difficultySw : recipe.difficultyEn}</span>
                  </div>
                </div>

                <div className="p-4 sm:p-5">
                  <h3 className="font-extrabold text-stone-900 text-base leading-snug">
                    {language === 'sw' ? recipe.titleSw : recipe.titleEn}
                  </h3>
                  <p className="text-stone-600 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                    {language === 'sw' ? recipe.descriptionSw : recipe.descriptionEn}
                  </p>

                  {/* Ingredients Tags */}
                  <div className="mt-3 pt-3 border-t border-stone-100">
                    <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                      {language === 'sw' ? 'Viungo Vikuu:' : 'Key Ingredients:'}
                    </div>
                    <div className="flex flex-wrap gap-1.5 text-xs text-stone-700">
                      {(language === 'sw' ? recipe.ingredientsSw : recipe.ingredientsEn).map((ing, i) => (
                        <span key={i} className="bg-stone-50 border border-stone-200 px-2 py-0.5 rounded text-[11px]">
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Add Ingredients Button */}
              <div className="p-4 sm:p-5 pt-0">
                <button
                  type="button"
                  onClick={() => handleAddRecipeIngredients(recipe)}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    addedRecipeId === recipe.id
                      ? 'bg-emerald-800 text-white'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300'
                  }`}
                >
                  {addedRecipeId === recipe.id ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{language === 'sw' ? 'Viungo Vimeongezwa Kikapuni!' : 'Ingredients Added!'}</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{language === 'sw' ? 'Weka Viungo Vyote Kikapuni' : 'Add All Ingredients to Cart'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
