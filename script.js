document.addEventListener('DOMContentLoaded', function () {
    const categoriesList = document.getElementById('categories-list');
    const recipesList = document.getElementById('recipes-list');
    const recipeDetails = document.getElementById('recipe-details');
    const backButton = document.getElementById('back-to-categories');

    // Enum para definir los estados de la aplicación
    const AppStates = {
        CATEGORIES: 'categories',
        RECIPES: 'recipes',
        RECIPE_DETAILS: 'recipe-details'
    };

    // Variable para rastrear el estado actual
    let currentState = AppStates.CATEGORIES;

    // Function para cambiar de estado
    function changeState(newState) {
        // Ocultar todas las vistas
        categoriesList.style.display = 'none';
        recipesList.style.display = 'none';
        recipeDetails.style.display = 'none';
        // Mostrar la vista correspondiente al nuevo estado
        switch (newState) {
            case AppStates.CATEGORIES:
                categoriesList.style.display = 'flex';
                backButton.style.display = 'none';
                break;
            case AppStates.RECIPES:
                recipesList.style.display = 'flex';
                backButton.style.display = 'block';
                break;
            case AppStates.RECIPE_DETAILS:
                recipeDetails.style.display = 'block';
                backButton.style.display = 'block';
                break;
            default:
                break;
        }
        // Actualizar el estado actual
        currentState = newState;
    }

    // Event listener para el botón "Back"
    backButton.addEventListener('click', () => {
        // Regresar al estado anterior
        switch (currentState) {
            case AppStates.RECIPES:
                changeState(AppStates.CATEGORIES);
                break;
            case AppStates.RECIPE_DETAILS:
                changeState(AppStates.RECIPES);
                break;
            default:
                break;
        }
    });

    // Función para mostrar las recetas por categoría
    function fetchRecipesByCategory(category) {
        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
            .then(response => response.json())
            .then(data => {
                recipesList.innerHTML = ''; // Limpiar recetas anteriores
                data.meals.forEach(recipe => {
                    const recipeElement = document.createElement('div');
                    recipeElement.classList.add('recipe');
                    recipeElement.textContent = recipe.strMeal;
                    recipesList.appendChild(recipeElement);
                    recipeElement.addEventListener('click', () => {
                        fetchRecipeDetails(recipe.idMeal);
                    });
                });
                changeState(AppStates.RECIPES); // Cambiar al estado de recetas
            })
            .catch(error => {
                console.error('Error fetching recipes:', error);
            });
    }

    // Función para mostrar detalles de la receta
    function fetchRecipeDetails(recipeId) {
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`)
            .then(response => response.json())
            .then(data => {
                const recipe = data.meals[0];
                recipeDetails.innerHTML = `
                    <h2>${recipe.strMeal}</h2>
                    <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
                    <p>${recipe.strInstructions}</p>
                `;
                changeState(AppStates.RECIPE_DETAILS); // Cambiar al estado de detalles de receta
            })
            .catch(error => {
                console.error('Error fetching recipe details:', error);
            });
    }

    // Función para mostrar las categorías
    fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
        .then(response => response.json())
        .then(data => {
            const categories = data.categories;
            categories.forEach(category => {
                const categoryElement = document.createElement('div');
                categoryElement.classList.add('category');
                categoryElement.textContent = category.strCategory;
                categoriesList.appendChild(categoryElement);
                categoryElement.addEventListener('click', () => {
                    fetchRecipesByCategory(category.strCategory);
                });
            });
            changeState(AppStates.CATEGORIES); // Cambiar al estado de categorías al cargar la página
        })
        .catch(error => {
            console.error('Error fetching categories:', error);
        });
});
