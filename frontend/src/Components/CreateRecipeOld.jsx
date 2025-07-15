import React, { useState } from "react";
import "../css/CreateRecipe.css";
import RecipeImageUploader from "./RecipeImageUploader";
import { useNavigate } from "react-router-dom";

function CreateRecipeOld() {
    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState(null);
    const [recipeTitle, setRecipeTitle] = useState("");
    const [recipeDescription, setRecipeDescription] = useState("");
    const [cookTimeMinutes, setCookTimeMinutes] = useState("");

    const [createdRecipeId, setCreatedRecipeId] = useState(null); // nuevo estado

    const getFormattedCookTime = () => {
        const mins = parseInt(cookTimeMinutes) || 0;
        if (mins === 0) return "—";
        return `${mins} min${mins === 1 ? "" : "s"}`;
    };

    const handleSubmit = async () => {
        if (!imageFile || !recipeTitle || !recipeDescription) {
            alert("Please complete all fields including the image.");
            return null;
        }

        const formData = new FormData();
        formData.append("recipeTitle", recipeTitle);
        formData.append("recipeDescription", recipeDescription);
        formData.append("cookTimeMinutes", cookTimeMinutes);
        formData.append("image", imageFile);

        const token = localStorage.getItem("token");

        try {
            const response = await fetch("http://localhost:3001/api/recipes", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                alert("Recipe saved successfully!");
                console.log("✅ Receta enviada:", data);
                console.log("Receta ID:", data.data.id);
                setCreatedRecipeId(data.data.id);
                return data.data.id;
            } else {
                alert(`Error: ${data.message || data.error}`);
                return null;
            }
        } catch (error) {
            console.error("❌ Error al enviar receta:", error);
            alert("Ocurrió un error al guardar la receta.");
            return null;
        }
    };

    return (
        <div className="general-div">
            <div className="top-div">
                <button
                type="button"
                className="exit-button"
                onClick={() => navigate('/home')}
            >
                <img className="exit" src="/assets/exit.svg" alt="exit" />
            </button>

                <h2 className="title">Create Recipe</h2>
                <button className="save-button" onClick={handleSubmit}>Save</button>
                <button className="publish-button" onClick={handleSubmit}>Publish</button>
            </div>

            <div className="image-Uploader">
                <RecipeImageUploader onImageSelect={setImageFile} />
            </div>

            <div className="Input-container">
                <div className="input-content">
                    <div className="RecipeTitle">
                        <h3>Title</h3>
                        <input
                            type="text"
                            placeholder="Recipe Title"
                            value={recipeTitle}
                            onChange={(e) => setRecipeTitle(e.target.value)}
                        />
                    </div>

                    <div className="Description">
                        <h3>Description</h3>
                        <input
                            placeholder="Write a short description..."
                            value={recipeDescription}
                            onChange={(e) => setRecipeDescription(e.target.value)}
                        />
                    </div>

                    <div className="CookTime">
                        <h3>Cooking Time</h3>
                        <div className="CookTime-inputs">
                            <div className="time-group">
                                <input
                                    type="number"
                                    min="0"
                                    max="59"
                                    value={cookTimeMinutes}
                                    onChange={(e) => setCookTimeMinutes(e.target.value)}
                                />
                                <span>minute{cookTimeMinutes === "1" ? "" : "s"}</span>
                            </div>
                        </div>
                    </div>

                    <div className="button">
                        <button
                            type="button"
                            className="next-button"
                            onClick={async () => {
                                const id = createdRecipeId || await handleSubmit();  // si no está guardado, lo guarda
                                if (!id) {
                                    alert("Please complete all fields and try again.");
                                    return;
                                }
                                navigate('/SetRecipeStepsAndIngredients', { state: { recipeId: id } });
                            }}
                        >
                            Go to ingredients and steps
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateRecipeOld;
