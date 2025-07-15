import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/IngredientsCarousel.css';

function IngredientSelectorCarousel({ onChange }) {
    const [ingredients, setIngredients] = useState([]);
    const [visibleIngredients, setVisibleIngredients] = useState([]);
    const [selected, setSelected] = useState({});

    const pickRandomIngredients = (all, count = 25) => {
        const shuffled = [...all].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                const res = await axios.get('/api/ingredients/all');
                const all = res.data;
                setIngredients(all);
                setVisibleIngredients(pickRandomIngredients(all));
            } catch (error) {
                console.error("Error fetching ingredients:", error);
            }
        };

        fetchIngredients();
    }, []);

    useEffect(() => {
        const selectedIds = Object.keys(selected).filter(id => selected[id]);
        onChange && onChange(selectedIds);
    }, [selected]);

    const toggleSelect = (id) => {
        setSelected(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    return (
        <div className="ingredient-carousel-container">
            {visibleIngredients.map((ingredient) => (
                <div
                    key={ingredient.id}
                    className="ingredient-wrapper"
                    onClick={() => toggleSelect(ingredient.id)}
                >
                    <div className={`ingredient-icon-circle ${selected[ingredient.id] ? 'selected' : ''}`}>
                        <img src={ingredient.imageUrl} alt={ingredient.name} />
                        <div className="ingredient-label" title={ingredient.name}>
                            {ingredient.name.includes(' ')
                                ? (
                                    <>
                                        {ingredient.name.split(' ')[0]}<br />
                                        {ingredient.name.split(' ').slice(1).join(' ')}
                                    </>
                                )
                                : ingredient.name}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default IngredientSelectorCarousel;
