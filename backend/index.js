require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const ingredientsRoutes = require('./routes/ingredientsRoutes');
const recipeRoutes = require('./routes/recipes');
const ingredientsCreateRoutes = require('./routes/ingredientsCreateRoutes');
const favoritesRoutes = require('./routes/favorites');
const filterRoutes = require('./routes/filters');
const shoppingListRoutes = require('./routes/ShoppingListRoutes');
const dayRecipeRoutes = require('./controllers/dayRecipeRoutes');
const approvalRoutes = require('./routes/approvalRoutes');
const plannerRoutes = require('./controllers/plannerController');
const emailApprovalRoutes = require('./routes/emailApprovalRoutes');


const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());

app.use('/api', authRoutes); // login, register, etc
app.use('/api/recipes', recipeRoutes); // recetas
app.use('/api/ingredients', ingredientsRoutes); // listado ingredientes
app.use('/api/ingredients/create', ingredientsCreateRoutes); // carga ingrediente nuevo
app.use('/api/favorites', favoritesRoutes); // favoritos (con DELETE /:id)
app.use('/api/filters', filterRoutes); // filtros de recetas
app.use('/api/shopping-list', shoppingListRoutes);
app.use('/api/day-recipes', dayRecipeRoutes);
app.use('/api', approvalRoutes);
app.use('/api', recipeRoutes);
app.use('/api/planner', plannerRoutes);
app.use('/api', require('./routes/approvalRoutes'));
app.use('/api', emailApprovalRoutes);
app.use('/api/chatbot', require('./routes/chatbotRoutes'));



app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});