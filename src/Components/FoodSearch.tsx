import React from 'react';
import { Search, X } from 'lucide-react';
import { gql } from '@apollo/client';
import { useLazyQuery } from '@apollo/client/react'
import type { TypedDocumentNode } from '@apollo/client';

export type Food = {
    id: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
}

type SearchFoodsData = {
    searchFoods: Food[];
}

type SearchFoodsVars = {
    text: string;
}

type FoodSearchProps = {
    onSelectFood: (food: Food) => void;
}

const SEARCH_FOODS: TypedDocumentNode<SearchFoodsData, SearchFoodsVars> = gql`

    query SearchFoods($text: String!) {
        searchFoods(query: $text) {
            id
            name
            calories
            protein
            carbs
            fats

        }
    
    }
`



export default function FoodSearch(props: FoodSearchProps) {

    const [query, setQuery] = React.useState('');
    const [runSearch, { loading, error, data }] = useLazyQuery(SEARCH_FOODS)
    const [showResults, setShowResults] = React.useState(false);

    function handleSearch(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        if (query.trim()) {
            runSearch({ variables: { text: query.trim() } });
            setShowResults(true);
        }
    }

    return (
        <div className="food-search">
            <form className="food-search-form" onSubmit={handleSearch}>
                <input
                    type="text"
                    value={query}
                    placeholder="Search foods, e.g. banana"
                    aria-label="Search foods"
                    enterKeyHint="search"
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={e => { if (e.key === "Escape") setShowResults(false) }}
                />
                <button type="submit" className="food-search-submit" aria-label="Search">
                    <Search size={18} strokeWidth={2.5} />
                </button>
            </form>

            {loading && <p className="food-search-status">Searching…</p>}
            {error && <p className="food-search-status food-search-status--error">Couldn't search foods. Please try again.</p>}
            {showResults && data?.searchFoods && data.searchFoods.length > 0 && (
                <>
                <div className="food-search-results-header">
                    <span>{data.searchFoods.length} {data.searchFoods.length === 1 ? "result" : "results"}</span>
                    <button
                        type="button"
                        className="food-log-remove"
                        aria-label="Close search results"
                        onClick={() => setShowResults(false)}
                    >
                        <X size={16} strokeWidth={2.5} />
                    </button>
                </div>
                <ul className="food-search-results">
                    {data.searchFoods.map(food => (
                        <li key={food.id}>
                            <button
                                type="button"
                                className="food-search-result"
                                onClick={() => { props.onSelectFood(food); setShowResults(false) }}
                            >
                                <span className="food-search-result-main">
                                    <span className="food-name">{food.name}</span>
                                    <span className="food-calories">{food.calories} kcal / 100g</span>
                                </span>
                                <span className="macro-chips">
                                    <span className="macro-chip macro-chip--protein">{food.protein}g P</span>
                                    <span className="macro-chip macro-chip--carbs">{food.carbs}g C</span>
                                    <span className="macro-chip macro-chip--fats">{food.fats}g F</span>
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
                </>
            )}
            {showResults && data?.searchFoods?.length === 0 && <p className="food-search-status">No foods found.</p>}
        </div>
    )
}