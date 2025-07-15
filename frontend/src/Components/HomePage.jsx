import { useNavigate, useLocation } from "react-router-dom";
import '../css/HomePage.css';
import React, { useEffect, useState } from "react";
import MultipleSelectionTag from "./MultipleSelectionTag";
import '../css/MultipleSelectionTag.css';
import IngredientsCarousel from './IngredientsCarousel';
import PinterestLayout from "./PinterestLayout";
import axios from "axios";
import NotificationBell from "./NotificationBell";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ChatbotWidget from "./Chatbot/ChatbotWidget";

function HomePage({ FormHandle }) {
    const navigate = useNavigate();
    const location = useLocation();

    const [query, setQuery] = useState('');
    const [token, setToken] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);

    // Mostrar pop‑up si se aprobó o rechazó una receta (al volver del mail)
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const status = searchParams.get('status');

        if (status === 'approved') {
            toast.success("Recipe approved successfully");
        } else if (status === 'rejected') {
            toast.error("❌ Recipe rejected");
        }

        if (status) {
            const newUrl = window.location.origin + window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
        }
    }, [location.search]);

    // Cargar token de usuario desde localStorage
    useEffect(() => {
        const tokenData = localStorage.getItem('tokenData');
        if (!tokenData) return;
        const decoded = JSON.parse(tokenData);
        setToken(decoded);
    }, []);

    // Traer recetas cada vez que cambian filtros o query
    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const params = {
                    ...(query && { query }),
                    ...(selectedFilters.length > 0 && { filters: selectedFilters.join(',') }),
                    ...(selectedIngredients.length > 0 && { ingredients: selectedIngredients.join(',') })
                };

                console.log("Buscando recetas con:", params);
                const res = await axios.get('http://localhost:3001/api/recipes', { params });
                setRecipes(res.data);
            } catch (err) {
                console.error('Error al traer recetas:', err);
            }
        };

        fetchRecipes();
    }, [query, selectedFilters, selectedIngredients]);

    return (
        <div className="MainContainer">
            <div className="welcome-user">
                <text>Welcome {token.username}!</text>
                <NotificationBell />
            </div>

            <div className="search-bar">
                <img src="/assets/search.svg" alt="Search icon" className="search-bar-icon" />
                <input
                    type="text"
                    placeholder="Search recipes"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                />
            </div>

            <div className="ingredients-carousel">
                <IngredientsCarousel onChange={setSelectedIngredients} />
            </div>

            <div className="foodType-carousel">
                <div className="foodType">
                    <MultipleSelectionTag onChange={setSelectedFilters} />

                    {recipes.length === 0 && (
                        <div className="no-recipes-message">
                            {selectedFilters.length > 0 && selectedIngredients.length === 0 && (
                                <>There are no recipes matching the selected filters.</>
                            )}
                            {selectedIngredients.length > 0 && selectedFilters.length === 0 && (
                                <>There are no recipes with the selected ingredients.</>
                            )}
                            {selectedFilters.length > 0 && selectedIngredients.length > 0 && (
                                <>There are no recipes matching the selected filters and ingredients.</>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="scrollable-recipes">
                {recipes.length > 0 && <PinterestLayout recipes={recipes} />}
            </div>


            <ChatbotWidget />

            <ToastContainer position="top-center" autoClose={3000} />
        </div>
    );
}

export default HomePage;
