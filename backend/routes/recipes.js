const express = require('express');
const router = express.Router();
const multer = require("multer");

const {
    getAllRecipes,
    getRecipeById,
    addIngredientsAndSteps,
    getPublicRecipesByUser,
    getPrivateRecipesByUser,
    getRecipeImage,
    getAllPublicRecipes,
    getAllPrivateRecipes,
    makeRecipePublic,
    createRecipe
} = require('../controllers/recipeController');

const { makePrivate } = require("../controllers/approvalController");
const {deleteIngredientFromRecipe} = require("../controllers/ingredientController");

const upload = multer({ storage: multer.memoryStorage() });

// Crear receta con imagen
router.post("/", upload.single("image"), createRecipe);

// Agregar ingredientes, pasos y filtros
router.patch("/", addIngredientsAndSteps);

// Obtener recetas propias
router.get('/my-public', getPublicRecipesByUser);
router.get('/my-private', getPrivateRecipesByUser);

// Rutas para admin
router.get('/all-public', getAllPublicRecipes);
router.get('/all-private', getAllPrivateRecipes);
router.patch('/recipes/:id/make-public', makeRecipePublic);

// Rutas compartidas
router.patch('/recipes/:id/make-private', makePrivate);
router.get('/:id/image', getRecipeImage);
router.delete('/recipes/:recipeId/ingredient/:ingredientId', deleteIngredientFromRecipe);


// Ruta general de búsqueda (explorador)
router.get('/', getAllRecipes);

router.get('/:id(\\d+)', getRecipeById);

module.exports = router;
