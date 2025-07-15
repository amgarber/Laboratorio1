import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../css/RecipeDetail.css';
import LoadingChef from './LoadingChef';
import { toast } from 'react-toastify';
import { useRef } from "react";


function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0 && remainingMinutes > 0) return `${hours}h ${remainingMinutes}m`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    return `${remainingMinutes} min`;
}

function AccordionItem({ title, content, isExpanded, onToggle }) {
    return (
        <div className={`accordion-item ${isExpanded ? 'expanded' : ''}`}>
            <div className="accordion-header" onClick={onToggle}>
                <span className="accordion-title">{title}</span>
                <i className={`bx bx-chevron-right accordion-icon ${isExpanded ? 'rotate' : ''}`}></i>
            </div>
            {isExpanded && <div className="accordion-content"><p>{content}</p></div>}
        </div>
    );
}

function AdminRecipeDetails() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const adminId = JSON.parse(localStorage.getItem('tokenData')).userId

    const fromEmail = location.state?.fromEmail;
    const action = location.state?.action;

    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(null);
    const [expandedId, setExpandedId] = useState(null);
    const [sheetPosition, setSheetPosition] = useState(240);
    const shownToast = useRef(false);


    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const res = await fetch(`/api/admin/recipe/${id}?adminId=${adminId}`);
                if (!res.ok) throw new Error("Error HTTP");
                const data = await res.json();
                setRecipe(data);
            } catch (err) {
                console.error("Error al cargar la receta:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchRecipe();
    }, [id, adminId]);

    // Mostrar toast si se llegó desde el email
    useEffect(() => {
        if (!shownToast.current && fromEmail && action) {
            if (action === "approve") {
                toast.success("✅ Receta aprobada desde el email");
            } else if (action === "reject") {
                toast.error("❌ Receta rechazada desde el email");
            }
            shownToast.current = true;
        }
    }, [fromEmail, action]);

    const handleDrag = (event, info) => {
        const newPosition = sheetPosition - info.delta.y;
        setSheetPosition(Math.max(120, Math.min(newPosition, window.innerHeight * 0.8)));
    };

    const toggleExpand = (stepId) => {
        setExpandedId(expandedId === stepId ? null : stepId);
    };

    const tabs = [
        { id: "tab1", label: "Ingredients" },
        { id: "tab2", label: "Directions" }
    ];

    if (loading) return <div className="recipe-detail-container"><LoadingChef message="Loading a delicious recipe..." /></div>;
    if (!recipe) return <div className="recipe-detail-container"><h2>Receta no disponible</h2><button onClick={() => navigate('/home')}>Volver</button></div>;

    return (
        <div className="recipe-box">
            <button type="button" className="exit-button-RD" onClick={() => navigate(-1)}>
                <img className="exit" src="/assets/exit.svg" alt="exit" />
            </button>

            <img
                className="background-image"
                src={recipe.image?.url || "/assets/placeholder-food.jpg"}
                alt={recipe.name}
                onError={(e) => { e.target.onerror = null; e.target.src = "/assets/placeholder-food.jpg"; }}
            />

            <motion.div
                className="Bottom-sheet"
                drag="y"
                onDrag={handleDrag}
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0.1}
                animate={{ height: sheetPosition }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                <div className="drag-handle" />
                <div className="Sheet-Content">
                    <h2 className="recipe-title2"><span>{recipe.name}</span></h2>
                    <h3 className="recipe-author">By {recipe.user?.username}</h3>

                    <div className="info-bar">
                        <div className="item"><img src="/icons/Time.svg" alt="tiempo" className="Icon-time" /><span>{formatTime(recipe.preparation_time)}</span></div>
                        <div className="item"><img src="/icons/fire.svg" alt="calorías" className="Icon-fire" /><span>{recipe.calories || 'N/A'}</span></div>
                        <div className="item"><img src="/icons/star.svg" alt="rating" className="Icon-star" /><span>{recipe.rating || '4/5'}</span></div>
                    </div>

                    <div className="NatigateOption">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                className={`tab-bottom ${activeTab === tab.id ? 'active-tab' : activeTab === null ? 'neutral-tab' : 'inactive-tab'}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {activeTab === null && (
                        <div className="about-section">
                            <p className="about-title">About the food:</p>
                            <p className="about-description">{recipe.description}</p>
                        </div>
                    )}
                </div>

                {activeTab === "tab1" && (
                    <div className="ingredients-tab">
                        <div className="accordion-wrapper">
                            <h2>Ingredients</h2>
                            {recipe.ingredients?.map((ing, index) => (
                                <div className="ingredient-row" key={index}>
                                    <img
                                        src={ing.ingredient.image?.url || "/assets/placeholder-food.jpg"}
                                        alt={ing.ingredient.name}
                                        className="ingredient-image"
                                        onError={(e) => { e.target.onerror = null; e.target.src = "/assets/placeholder-food.jpg"; }}
                                    />
                                    <span className="ingredient-name">{ing.ingredient.name}</span>
                                    <span className="ingredient-quantity">{ing.quantity} {ing.measurement_unit}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === "tab2" && (
                    <div className="accordion-wrapper">
                        {recipe.instructions?.map((step) => (
                            <AccordionItem
                                key={step.id}
                                title={step.steps_numerations}
                                content={step.Description}
                                isExpanded={expandedId === step.id}
                                onToggle={() => toggleExpand(step.id)}
                            />
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}

export default AdminRecipeDetails;
