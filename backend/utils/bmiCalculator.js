// Calculate BMI from weight (kg) and height (cm)
export const calculateBMI = (weight, height) => {
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  return parseFloat(bmi.toFixed(2));
};

// Get BMI category
export const getBMICategory = (bmi) => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi >= 18.5 && bmi < 25) return 'Normal';
  if (bmi >= 25 && bmi < 30) return 'Overweight';
  return 'Obese';
};

// Get diet plan based on BMI category
export const getDietPlan = (bmiCategory) => {
  const dietPlans = {
    Underweight: [
      {
        id: 1,
        food: 'Peanut Butter Sandwich',
        quantity: '2 pieces',
        calories: '~400',
        benefits: 'High calories for weight gain',
        image:
          'https://images.unsplash.com/photo-1585238341710-4913a3f70122?w=400&h=300&fit=crop',
      },
      {
        id: 2,
        food: 'Banana Smoothie with Milk',
        quantity: '1 glass',
        calories: '~350',
        benefits: 'Rich in potassium and protein',
        image:
          'https://images.unsplash.com/photo-1590080876799-cd5e56dbe89c?w=400&h=300&fit=crop',
      },
      {
        id: 3,
        food: 'Eggs (Scrambled)',
        quantity: '2-3 eggs',
        calories: '~155-230',
        benefits: 'Complete protein source',
        image:
          'https://images.unsplash.com/photo-1585238341710-4913a3f70122?w=400&h=300&fit=crop',
      },
      {
        id: 4,
        food: 'Brown Rice with Chicken',
        quantity: '1.5 cups',
        calories: '~450',
        benefits: 'Complex carbs with protein',
        image:
          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
      },
      {
        id: 5,
        food: 'Whole Milk Yogurt',
        quantity: '1 cup',
        calories: '~150',
        benefits: 'Probiotics and calcium',
        image:
          'https://images.unsplash.com/photo-1488477181946-6dd79a34eee7?w=400&h=300&fit=crop',
      },
      {
        id: 6,
        food: 'Almonds and Dry Fruits',
        quantity: '1 handful',
        calories: '~180',
        benefits: 'Healthy fats and minerals',
        image:
          'https://images.unsplash.com/photo-1585707032515-6546c01d9d3a?w=400&h=300&fit=crop',
      },
    ],
    Normal: [
      {
        id: 1,
        food: 'Oatmeal with Berries',
        quantity: '1 bowl',
        calories: '~250',
        benefits: 'Fiber-rich breakfast',
        image:
          'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop',
      },
      {
        id: 2,
        food: 'Grilled Chicken Breast',
        quantity: '100g',
        calories: '~165',
        benefits: 'Lean protein',
        image:
          'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop',
      },
      {
        id: 3,
        food: 'Green Apple',
        quantity: '1 medium',
        calories: '~95',
        benefits: 'Natural sugars and fiber',
        image:
          'https://images.unsplash.com/photo-1560807707-38cc612d91a3?w=400&h=300&fit=crop',
      },
      {
        id: 4,
        food: 'Vegetable Soup',
        quantity: '1 bowl',
        calories: '~120',
        benefits: 'Low-calorie nutrition',
        image:
          'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop',
      },
      {
        id: 5,
        food: 'Whole Wheat Bread',
        quantity: '2 slices',
        calories: '~160',
        benefits: 'Complex carbohydrates',
        image:
          'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop',
      },
      {
        id: 6,
        food: 'Green Tea',
        quantity: '1 cup',
        calories: '~2',
        benefits: 'Antioxidants and metabolism boost',
        image:
          'https://images.unsplash.com/photo-1597318861180-d1c74d22dcd8?w=400&h=300&fit=crop',
      },
    ],
    Overweight: [
      {
        id: 1,
        food: 'Green Salad',
        quantity: '1 large bowl',
        calories: '~50',
        benefits: 'Very low calorie, fiber-rich',
        image:
          'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop',
      },
      {
        id: 2,
        food: 'Boiled Vegetables',
        quantity: '1 bowl',
        calories: '~80',
        benefits: 'Nutrients without extra calories',
        image:
          'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop',
      },
      {
        id: 3,
        food: 'Green Tea',
        quantity: '1 cup',
        calories: '~2',
        benefits: 'Metabolism boosting',
        image:
          'https://images.unsplash.com/photo-1597318861180-d1c74d22dcd8?w=400&h=300&fit=crop',
      },
      {
        id: 4,
        food: 'Grilled Fish',
        quantity: '80g',
        calories: '~120',
        benefits: 'Lean protein with omega-3',
        image:
          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
      },
      {
        id: 5,
        food: 'Lentil Soup',
        quantity: '1 bowl',
        calories: '~150',
        benefits: 'Protein and fiber',
        image:
          'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop',
      },
      {
        id: 6,
        food: 'Watermelon',
        quantity: '1 cup',
        calories: '~46',
        benefits: 'Hydrating and low-calorie',
        image:
          'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
      },
    ],
    Obese: [
      {
        id: 1,
        food: 'Cucumber Salad',
        quantity: '1 large bowl',
        calories: '~45',
        benefits: 'Very low calorie, hydrating',
        image:
          'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop',
      },
      {
        id: 2,
        food: 'Steamed Broccoli',
        quantity: '1 cup',
        calories: '~55',
        benefits: 'Nutrient-dense, low-calorie',
        image:
          'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=400&h=300&fit=crop',
      },
      {
        id: 3,
        food: 'Herbal Tea',
        quantity: '1 cup',
        calories: '~0',
        benefits: 'Zero calories, helps digestion',
        image:
          'https://images.unsplash.com/photo-1597318861180-d1c74d22dcd8?w=400&h=300&fit=crop',
      },
      {
        id: 4,
        food: 'Grilled Chicken (Skinless)',
        quantity: '60g',
        calories: '~100',
        benefits: 'Lean protein, minimal fat',
        image:
          'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop',
      },
      {
        id: 5,
        food: 'Vegetable Broth',
        quantity: '1 bowl',
        calories: '~20',
        benefits: 'Filling, minimal calories',
        image:
          'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop',
      },
      {
        id: 6,
        food: 'Papaya',
        quantity: '1 cup',
        calories: '~55',
        benefits: 'Digestive enzymes',
        image:
          'https://images.unsplash.com/photo-1585664814660-01d3fd3d440c?w=400&h=300&fit=crop',
      },
    ],
  };

  return dietPlans[bmiCategory] || [];
};
