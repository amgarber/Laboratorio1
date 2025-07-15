// routes/ingredientsRoutes.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/ingredients?query=ajo
router.get('/', async (req, res) => {
    const { query } = req.query;
    try {
        const ingredients = await prisma.ingredients.findMany({
            where: {
                name: {
                    contains: query,
                    mode: 'insensitive'
                }
            },
            take: 10,
            include: {
                images: true,
            }
        });
        res.json(ingredients);
    } catch (error) {
        console.error('Error fetching ingredients:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// GET /api/ingredients/all
router.get('/all', async (req, res) => {
    try {
        const ingredients = await prisma.ingredients.findMany({
            include: {
                images: true,
            }
        });

        // Formatear para enviar solo lo necesario
        const formatted = ingredients.map(ingredient => ({
            id: ingredient.id,
            name: ingredient.name,
            imageUrl: ingredient.images[0]?.url || ''
        }));

        res.json(formatted);
    } catch (error) {
        console.error('Error fetching all ingredients:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
