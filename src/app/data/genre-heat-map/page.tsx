import React from 'react';
import GenreHeatMap from "@/app/components/GenreHeatMap/GenreheatMap";

const FilmGenreDistribution = () => {
    return (
        <div className="relative min-h-screen bg-black text-gray-300">
            <div className="container mx-auto p-8 mt-12">
                <div className="flex flex-col items-center text-center">
                    <h1 className="text-6xl font-bold mb-3 " style={{ lineHeight: '1.2' }}
                    >
                    Canadian Film <br /> Genre Distribution
                    </h1>                    
                    <p
                    className="text-md mt-4 max-w-4xl"
                    style={{ lineHeight: '1.2' }}
                    >
                    This heat map visualizes the distribution of movie genres over the past decade, focusing on films shot in Canada. The x-axis represents the years, while the y-axis lists the genres. Each cell&apos;s color intensity indicates the number of films produced in that genre for the corresponding year. This dataset was sourced from IMDb, filtered to include only movies filmed in at least one location in Canada and released within the last 10 years. This visualization provides insights into genre trends and production patterns over time.
                    </p>
                </div>
                <div className="flex justify-center mt-12">
                    <div className="border border-gray-700 rounded-lg shadow-lg p-4 bg-gray-800">
                        <GenreHeatMap />
                    </div>
                </div>
            </div>
            <footer className="bg-gray-900 text-gray-500 py-4 mt-12">
                <div className="container mx-auto text-center text-xs">
                    <p>&copy; 2024 CineCompute. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default FilmGenreDistribution;
