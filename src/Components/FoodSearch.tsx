import React from 'react';
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
        <div>
            <form onSubmit={handleSearch}>
                <input value={query} placeholder="Search foods" onChange={e => setQuery(e.target.value)} />
                <button type="submit">Search</button>
            </form>

            {loading && <p>Loading...</p>}
            {error && <p>Error occurred while searching for foods.</p>}
            {showResults && data?.searchFoods && (
                <ul>
                    {data.searchFoods.map(food => (
                        <li key={food.id}><button type="button" onClick={() => { props.onSelectFood(food); setShowResults(false) }}>{food.name} - {food.calories} kcal - Protein: {food.protein}g - Carbs: {food.carbs}g - Fats: {food.fats}g</button></li>
                    ))}
                </ul>
            )
            }
            {showResults && data?.searchFoods?.length === 0 && <p>No foods found.</p>}
        </div >
    )
}