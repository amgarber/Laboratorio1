// backend/controllers/ingredientController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createIngredient = async (req, res) => {
    const { name, imageUrl } = req.body;
    console.log("📦 Body recibido en POST /api/ingredients/create:", req.body);

    if (!name || !imageUrl) {
        return res.status(400).json({ message: 'Name and image URL are required' });
    }

    try {
        // Check if ingredient with same name already exists
        const existingIngredient = await prisma.ingredients.findFirst({
            where: { name: name.toLowerCase() }
        });

        if (existingIngredient) {
            return res.status(409).json({
                message: 'Ingredient with this name already exists',
                existing: existingIngredient
            });
        }

        // Create ingredient (auto-increment will work now)
        const newIngredient = await prisma.ingredients.create({
            data: {
                name: name.toLowerCase(),
                type: "other",
            }
        });

        // Create the image (auto-increment will work now)
        const ingredientImage = await prisma.ingredient_Image.create({
            data: {
                url: imageUrl,
                ingredientId: newIngredient.id
            }
        });

        // Return ingredient with images
        const ingredientWithImages = await prisma.ingredients.findUnique({
            where: { id: newIngredient.id },
            include: { images: true }
        });

        res.status(201).json(ingredientWithImages);
    } catch (error) {
        console.error('Error creating ingredient:', error);

        // Handle specific Prisma errors
        if (error.code === 'P2002') {
            return res.status(409).json({
                message: 'Ingredient already exists or constraint violation',
                field: error.meta?.target
            });
        }

        res.status(500).json({ message: 'Error creating ingredient' });
    }
};
const deleteIngredientFromRecipe = async (req, res) => {
    const { recipeId, ingredientId } = req.params;

    try {
        await prisma.recipe_Ingredient.deleteMany({
            where: {
                id_recipe: parseInt(recipeId),
                id_ingredient: parseInt(ingredientId)
            }
        });

        res.status(200).json({ message: "Ingrediente eliminado de la receta correctamente" });
    } catch (error) {
        console.error("❌ Error al eliminar ingrediente:", error);
        res.status(500).json({ message: "Error al eliminar ingrediente de la receta" });
    }
};

module.exports = { createIngredient, deleteIngredientFromRecipe };