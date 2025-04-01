// Definição das chaves no localStorage
const MEALS_STORAGE_KEY = "meals";
const MEAL_SEQ_KEY = "meal_sequence";

// Função para obter dados do localStorage
const getData = (key) => JSON.parse(localStorage.getItem(key)) || [];
const saveData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// Função para obter o último ID e incrementar
const getNextId = (key) => {
    const lastId = parseInt(localStorage.getItem(key)) || 0;
    const newId = lastId + 1;
    localStorage.setItem(key, newId);
    return newId;
};

// Renderiza a lista de refeições
function renderMeals() {
    const meals = getData(MEALS_STORAGE_KEY);
    const mealsContainer = document.getElementById("mealsContainer");

    // Se não houver refeições, exibir uma mensagem
    if (meals.length === 0) {
        mealsContainer.innerHTML = "<p class='text-muted'>Nenhuma refeição cadastrada.</p>";
        return;
    }

    // Criar a estrutura HTML para cada refeição
    mealsContainer.innerHTML = meals.map(meal => `
        <div class="card mt-3">
            <div class="card-body d-flex justify-content-between">
                <h6>${meal.description}</h6>
                <div>
                    <button class="btn btn-warning btn-sm" onclick="handleEditMeal(${meal.id})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="handleDeleteMeal(${meal.id})">Excluir</button>
                </div>
            </div>
        </div>
    `).join("");
}

// Adiciona uma nova refeição
function handleAddMeal() {
    const descInput = document.getElementById("mealDescription");
    const description = descInput.value.trim();

    if (!description) {
        alert("A descrição da refeição é obrigatória.");
        return;
    }

    // Criar nova refeição
    const newMeal = {
        id: getNextId(MEAL_SEQ_KEY),
        description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };

    // Salvar no localStorage
    const meals = getData(MEALS_STORAGE_KEY);
    meals.push(newMeal);
    saveData(MEALS_STORAGE_KEY, meals);

    // Limpar input e renderizar novamente
    descInput.value = "";
    renderMeals();
}

// Edita uma refeição
function handleEditMeal(id) {
    const newDescription = prompt("Nova descrição da refeição:");
    if (!newDescription) return;

    let meals = getData(MEALS_STORAGE_KEY);
    meals = meals.map(meal => meal.id === id ? { ...meal, description: newDescription, updated_at: new Date().toISOString() } : meal);

    saveData(MEALS_STORAGE_KEY, meals);
    renderMeals();
}

// Exclui uma refeição
function handleDeleteMeal(id) {
    if (!confirm("Tem certeza que deseja excluir esta refeição?")) return;

    let meals = getData(MEALS_STORAGE_KEY).filter(meal => meal.id !== id);
    saveData(MEALS_STORAGE_KEY, meals);
    renderMeals();
}

// Chamar renderização ao carregar a página
document.addEventListener("DOMContentLoaded", renderMeals);
