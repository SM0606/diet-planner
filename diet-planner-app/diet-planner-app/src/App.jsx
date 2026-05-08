import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Dumbbell, Utensils, Plus, Trash2, Euro, ClipboardList, Target, Store } from "lucide-react";

export default function App() {
  const [budget, setBudget] = useState(40);
  const [selectedStore, setSelectedStore] = useState("Aldi");
  const [mealName, setMealName] = useState("");
  const [mealCalories, setMealCalories] = useState("");
  const [mealProtein, setMealProtein] = useState("");
  const [exerciseName, setExerciseName] = useState("");
  const [exerciseMinutes, setExerciseMinutes] = useState("");
  const [exerciseCalories, setExerciseCalories] = useState("");

  const [meals, setMeals] = useState([
    { id: 1, name: "Overnight oats", calories: 350, protein: 18 },
    { id: 2, name: "Chicken salad wrap", calories: 430, protein: 32 },
  ]);

  const [exercises, setExercises] = useState([
    { id: 1, name: "Walk", minutes: 35, calories: 150 },
    { id: 2, name: "Home workout", minutes: 20, calories: 120 },
  ]);

  const storeItems = {
    Aldi: [
      { name: "Chicken breast fillets", price: 5.49, category: "Protein" },
      { name: "Greek yoghurt", price: 1.89, category: "Breakfast" },
      { name: "Eggs", price: 2.79, category: "Protein" },
      { name: "Baby potatoes", price: 1.49, category: "Carbs" },
      { name: "Microwave rice", price: 1.09, category: "Carbs" },
      { name: "Frozen mixed veg", price: 1.25, category: "Veg" },
      { name: "Salad bag", price: 1.29, category: "Veg" },
      { name: "Tuna tins", price: 3.99, category: "Protein" },
      { name: "Wraps", price: 1.69, category: "Lunch" },
      { name: "Protein pudding", price: 1.29, category: "Snack" },
    ],
    Lidl: [
      { name: "Turkey mince", price: 3.79, category: "Protein" },
      { name: "Skyr yoghurt", price: 1.49, category: "Breakfast" },
      { name: "Porridge oats", price: 0.99, category: "Breakfast" },
      { name: "Sweet potatoes", price: 1.89, category: "Carbs" },
      { name: "Chicken slices", price: 2.29, category: "Lunch" },
      { name: "Cucumber", price: 0.89, category: "Veg" },
      { name: "Broccoli", price: 0.99, category: "Veg" },
      { name: "Low fat cheese", price: 2.19, category: "Snack" },
      { name: "Wholemeal wraps", price: 1.45, category: "Lunch" },
      { name: "Fruit pack", price: 2.49, category: "Snack" },
    ],
    Tesco: [
      { name: "Chicken stir fry kit", price: 4.5, category: "Dinner" },
      { name: "Ready cooked chicken", price: 3.75, category: "Protein" },
      { name: "Protein yoghurt", price: 1.5, category: "Snack" },
      { name: "Microwave baby potatoes", price: 2.25, category: "Carbs" },
      { name: "Bagels", price: 1.8, category: "Breakfast" },
      { name: "Soup", price: 2.0, category: "Lunch" },
      { name: "Salad bowl", price: 2.75, category: "Lunch" },
      { name: "Frozen berries", price: 3.0, category: "Breakfast" },
      { name: "Egg bites", price: 2.85, category: "Protein" },
      { name: "Rice cakes", price: 1.3, category: "Snack" },
    ],
  };

  const totals = useMemo(() => {
    const calories = meals.reduce((sum, meal) => sum + Number(meal.calories || 0), 0);
    const protein = meals.reduce((sum, meal) => sum + Number(meal.protein || 0), 0);
    const exerciseCalories = exercises.reduce((sum, exercise) => sum + Number(exercise.calories || 0), 0);
    const minutes = exercises.reduce((sum, exercise) => sum + Number(exercise.minutes || 0), 0);
    return { calories, protein, exerciseCalories, minutes };
  }, [meals, exercises]);

  const generatedList = useMemo(() => {
    const items = [...storeItems[selectedStore]];
    const priority = { Protein: 1, Breakfast: 2, Lunch: 3, Dinner: 4, Veg: 5, Carbs: 6, Snack: 7 };
    items.sort((a, b) => priority[a.category] - priority[b.category]);

    let total = 0;
    const chosen = [];

    for (const item of items) {
      if (total + item.price <= Number(budget || 0)) {
        chosen.push(item);
        total += item.price;
      }
    }

    return { chosen, total };
  }, [budget, selectedStore]);

  const addMeal = () => {
    if (!mealName.trim()) return;
    setMeals([...meals, {
      id: Date.now(),
      name: mealName,
      calories: Number(mealCalories || 0),
      protein: Number(mealProtein || 0),
    }]);
    setMealName("");
    setMealCalories("");
    setMealProtein("");
  };

  const addExercise = () => {
    if (!exerciseName.trim()) return;
    setExercises([...exercises, {
      id: Date.now(),
      name: exerciseName,
      minutes: Number(exerciseMinutes || 0),
      calories: Number(exerciseCalories || 0),
    }]);
    setExerciseName("");
    setExerciseMinutes("");
    setExerciseCalories("");
  };

  const removeMeal = (id) => setMeals(meals.filter((meal) => meal.id !== id));
  const removeExercise = (id) => setExercises(exercises.filter((exercise) => exercise.id !== id));

  return (
    <div className="app">
      <div className="container">
        <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="hero">
          <div>
            <p className="eyebrow">Diet Planner Dashboard</p>
            <h1>Meal, exercise & shopping tracker</h1>
            <p className="subtext">
              Track meals, log workouts, and generate a budget-friendly shopping list.
            </p>
          </div>

          <div className="mini-card">
            <Target />
            <div>
              <p>Today’s balance</p>
              <strong>{totals.calories - totals.exerciseCalories} net kcal</strong>
            </div>
          </div>
        </motion.header>

        <section className="stats">
          <StatCard icon={<Utensils />} label="Food calories" value={`${totals.calories} kcal`} />
          <StatCard icon={<Dumbbell />} label="Exercise" value={`${totals.minutes} min`} />
          <StatCard icon={<Target />} label="Protein" value={`${totals.protein}g`} />
          <StatCard icon={<Euro />} label="Budget" value={`€${Number(budget || 0).toFixed(2)}`} />
        </section>

        <section className="grid two">
          <Card title="Meal tracker" icon={<Utensils />}>
            <div className="form-grid">
              <input placeholder="Meal name" value={mealName} onChange={(e) => setMealName(e.target.value)} />
              <input placeholder="Calories" type="number" value={mealCalories} onChange={(e) => setMealCalories(e.target.value)} />
              <input placeholder="Protein g" type="number" value={mealProtein} onChange={(e) => setMealProtein(e.target.value)} />
            </div>

            <button className="btn" onClick={addMeal}><Plus size={16} /> Add meal</button>

            <div className="list">
              {meals.map((meal) => (
                <div key={meal.id} className="list-item">
                  <div>
                    <strong>{meal.name}</strong>
                    <p>{meal.calories} kcal · {meal.protein}g protein</p>
                  </div>
                  <button className="icon-btn" onClick={() => removeMeal(meal.id)}><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Exercise tracker" icon={<Dumbbell />}>
            <div className="form-grid">
              <input placeholder="Exercise" value={exerciseName} onChange={(e) => setExerciseName(e.target.value)} />
              <input placeholder="Minutes" type="number" value={exerciseMinutes} onChange={(e) => setExerciseMinutes(e.target.value)} />
              <input placeholder="Calories burned" type="number" value={exerciseCalories} onChange={(e) => setExerciseCalories(e.target.value)} />
            </div>

            <button className="btn" onClick={addExercise}><Plus size={16} /> Add exercise</button>

            <div className="list">
              {exercises.map((exercise) => (
                <div key={exercise.id} className="list-item">
                  <div>
                    <strong>{exercise.name}</strong>
                    <p>{exercise.minutes} min · {exercise.calories} kcal burned</p>
                  </div>
                  <button className="icon-btn" onClick={() => removeExercise(exercise.id)}><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="card">
          <div className="shopping-header">
            <div className="title-row">
              <ShoppingCart />
              <div>
                <h2>Budget shopping list generator</h2>
                <p>Choose a store and budget. The app picks useful meal-prep items under your limit.</p>
              </div>
            </div>

            <div className="controls">
              <select value={selectedStore} onChange={(e) => setSelectedStore(e.target.value)}>
                {Object.keys(storeItems).map((store) => <option key={store}>{store}</option>)}
              </select>
              <input type="number" min="0" value={budget} onChange={(e) => setBudget(e.target.value)} />
            </div>
          </div>

          <div className="shopping-grid">
            <div className="list">
              {generatedList.chosen.map((item) => (
                <div key={item.name} className="shopping-item">
                  <div className="item-left">
                    <div className="icon-box"><ClipboardList size={16} /></div>
                    <div>
                      <strong>{item.name}</strong>
                      <p>{item.category}</p>
                    </div>
                  </div>
                  <strong>€{item.price.toFixed(2)}</strong>
                </div>
              ))}
            </div>

            <div className="summary">
              <div className="title-row">
                <Store />
                <h3>Shopping summary</h3>
              </div>
              <p>Store: <strong>{selectedStore}</strong></p>
              <p>Items: <strong>{generatedList.chosen.length}</strong></p>
              <p>Estimated total: <strong>€{generatedList.total.toFixed(2)}</strong></p>
              <p>Money left: <strong>€{Math.max(Number(budget || 0) - generatedList.total, 0).toFixed(2)}</strong></p>
              <div className="tip">Tip: add Google Maps or a grocery API later for real nearby stores and live prices.</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="stat-card">
      <div className="icon-box">{icon}</div>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function Card({ title, icon, children }) {
  return (
    <section className="card">
      <div className="title-row">
        {icon}
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}
