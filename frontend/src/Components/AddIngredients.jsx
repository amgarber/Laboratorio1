import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/IngredientSelector.css";

const availableImages = [
    { url: "https://em-content.zobj.net/source/apple/391/red-apple_1f34e.png", name: "Red Apple" },
    { url: "https://em-content.zobj.net/source/apple/391/green-apple_1f34f.png", name: "Green Apple" },
    { url: "https://em-content.zobj.net/source/apple/391/grapes_1f347.png", name: "Grapes" },
    { url: "https://em-content.zobj.net/source/apple/391/watermelon_1f349.png", name: "Watermelon" },
    { url: "https://em-content.zobj.net/source/apple/391/tangerine_1f34a.png", name: "Tangerine" },
    { url: "https://em-content.zobj.net/source/apple/391/banana_1f34c.png", name: "Banana" },
    { url: "https://em-content.zobj.net/source/apple/391/pineapple_1f34d.png", name: "Pineapple" },
    { url: "https://em-content.zobj.net/source/apple/391/mango_1f96d.png", name: "Mango" },
    { url: "https://em-content.zobj.net/source/apple/391/strawberry_1f353.png", name: "Strawberry" },
    { url: "https://em-content.zobj.net/source/apple/391/cherries_1f352.png", name: "Cherries" },
    { url: "https://em-content.zobj.net/source/apple/391/peach_1f351.png", name: "Peach" },
    { url: "https://em-content.zobj.net/source/apple/391/blueberries_1fad0.png", name: "Blueberries" },
    { url: "https://em-content.zobj.net/source/apple/391/kiwi-fruit_1f95d.png", name: "Kiwi" },
    { url: "https://em-content.zobj.net/source/apple/391/tomato_1f345.png", name: "Tomato" },
    { url: "https://em-content.zobj.net/source/apple/391/cucumber_1f952.png", name: "Cucumber" },
    { url: "https://em-content.zobj.net/source/apple/391/carrot_1f955.png", name: "Carrot" },
    { url: "https://em-content.zobj.net/source/apple/391/broccoli_1f966.png", name: "Broccoli" },
    { url: "https://em-content.zobj.net/source/apple/391/leafy-green_1f96c.png", name: "Leafy Greens" },
    { url: "https://em-content.zobj.net/source/apple/391/mushroom_1f344.png", name: "Mushroom" },
    { url: "https://em-content.zobj.net/source/apple/391/cheese-wedge_1f9c0.png", name: "Cheese" },
    { url: "https://em-content.zobj.net/source/apple/391/egg_1f95a.png", name: "Egg" },
    { url: "https://em-content.zobj.net/source/apple/391/cooked-rice_1f35a.png", name: "Cooked Rice" },
    { url: "https://em-content.zobj.net/source/apple/391/spaghetti_1f35d.png", name: "Spaghetti" },
    { url: "https://em-content.zobj.net/source/apple/391/bread_1f35e.png", name: "Bread" },
    { url: "https://em-content.zobj.net/source/apple/391/croissant_1f950.png", name: "Croissant" },
    { url: "https://em-content.zobj.net/source/apple/391/burrito_1f32f.png", name: "Burrito" },
    { url: "https://em-content.zobj.net/source/apple/391/taco_1f32e.png", name: "Taco" },
    { url: "https://em-content.zobj.net/source/apple/391/pizza_1f355.png", name: "Pizza" },
    { url: "https://em-content.zobj.net/source/apple/391/hamburger_1f354.png", name: "Hamburger" },
    { url: "https://em-content.zobj.net/source/apple/391/french-fries_1f35f.png", name: "French Fries" },
    { url: "https://em-content.zobj.net/source/apple/391/hot-dog_1f32d.png", name: "Hot Dog" },
    { url: "https://em-content.zobj.net/source/apple/391/sushi_1f363.png", name: "Sushi" },
    { url: "https://em-content.zobj.net/source/apple/391/shortcake_1f370.png", name: "Shortcake" },
    { url: "https://em-content.zobj.net/source/apple/391/cupcake_1f9c1.png", name: "Cupcake" },
    { url: "https://em-content.zobj.net/source/apple/391/chocolate-bar_1f36b.png", name: "Chocolate Bar" },
    { url: "https://em-content.zobj.net/source/apple/391/ice-cream_1f368.png", name: "Ice Cream" },
    { url: "https://em-content.zobj.net/source/apple/391/shaved-ice_1f367.png", name: "Shaved Ice" }
];

const IngredientSelector = () => {
    const [selectedImageUrl, setSelectedImageUrl] = useState(null);
    const [ingredientName, setIngredientName] = useState("");

    const handleImageClick = (url) => {
        setSelectedImageUrl(url);
    };

    const handleAddIngredient = async () => {
        if (!selectedImageUrl || !ingredientName.trim()) {
            toast.warning("Seleccioná una imagen y escribí el nombre.");
            return;
        }

        try {
            await axios.post("http://localhost:3001/api/ingredients/create", {
                name: ingredientName,
                imageUrl: selectedImageUrl,
            });

            toast.success("Ingredient added successfully");
            setSelectedImageUrl(null);
            setIngredientName("");
        } catch (error) {
            console.error("Error adding ingredient:", error);
            toast.error("No se pudo agregar el ingrediente 😓");
        }
    };

    return (
        <div className="ingredient-selector-container">
            <h2>Ingredients</h2>

            <div className="images-container">
                <div className="images-grid">
                    {availableImages.map((img, index) => (
                        <img
                            key={index}
                            src={img.url}
                            alt={img.name}
                            className={`ingredient-image ${selectedImageUrl === img.url ? "selected" : ""}`}
                            onClick={() => handleImageClick(img.url)}
                        />
                    ))}
                </div>
            </div>

            {selectedImageUrl && (
                <div className="input-section">
                    <input
                        type="text"
                        placeholder="Ingredient Name..."
                        value={ingredientName}
                        onChange={(e) => setIngredientName(e.target.value)}
                        className="name-input"
                    />
                    <button onClick={handleAddIngredient} className="add-button">
                        ADD ITEM
                    </button>
                </div>
            )}
        </div>
    );
};

export default IngredientSelector;
