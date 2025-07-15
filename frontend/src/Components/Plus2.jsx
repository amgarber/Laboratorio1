import React from "react";
import '../css/Plus2.css';
import { useNavigate } from "react-router-dom";


function Plus2(){
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/AddIngredients")
    };

    const handleClick2 = () => {
        navigate("/CreateRecipe")
    };


    return (
        <div className="Main-container">
            {/* Imagen centrada */}
            <div className="background-container">
                <img src="/assets/basket.svg" alt="Basket" className="basket" />
            </div>

            {/* Tarjeta blanca fija inferior */}
            <div className="white-box">
                <div className="title-plus">
                    <h1>Kitchen Story</h1>
                    <p>You don't have a story, learn a new recipe and say it</p>
                </div>
                <div className="button-wrapper">
                    <button className="add-ingredient-button"  onClick={handleClick}>
                        <img src="/assets/plusIcon.svg" alt="PlusIcon" className="plus-icon" />
                        <span className="ingredient-text">Ingredients</span>
                    </button>
                    <button className="add-recipe-button" onClick={handleClick2}>
                        <img src="/assets/plusIcon.svg" alt="PlusIcon" className="plus-icon" />
                        <span className="ingredient-text">Recipe</span>
                    </button>
                </div>
            </div>
        </div>

    );
}

export default Plus2