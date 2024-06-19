import React from 'react';
import GenreHeatMap from "@/app/components/GenreHeatMap/GenreheatMap";



const filmStripSvgPath="M0 0.0302734V33.9703H96V0.0302734H0ZM85.653 2.93927H87.922V5.20028H85.653V2.93927ZM80.485 2.93927H82.744V5.20028H80.485V2.93927ZM75.316 2.93927H77.576V5.20028H75.316V2.93927ZM70.138 2.93927H72.407V5.20028H70.138V2.93927ZM64.97 2.93927H67.229V5.20028H64.97V2.93927ZM54.623 2.93927H56.892V5.20028H54.623V2.93927ZM49.455 2.93927H51.714V5.20028H49.455V2.93927ZM44.286 2.93927H46.545V5.20028H44.286V2.93927ZM39.108 2.93927H41.377V5.20028H39.108V2.93927ZM33.939 2.93927H36.2V5.20028H33.94L33.939 2.93927ZM23.593 2.93927H25.862V5.20028H23.593V2.93927ZM18.424 2.93927H20.684V5.20028H18.424V2.93927ZM13.256 2.93927H15.515V5.20028H13.256V2.93927ZM8.078 2.93927H10.347V5.20028H8.078V2.93927ZM2.909 2.93927H5.169V5.20028H2.909V2.93927ZM5.169 31.0613H2.909V28.8003H5.169V31.0613ZM10.347 31.0613H8.078V28.8003H10.347V31.0613ZM15.515 31.0613H13.256V28.8003H15.515V31.0613ZM20.684 31.0613H18.424V28.8003H20.684V31.0613ZM25.862 31.0613H23.593V28.8003H25.862V31.0613ZM31.03 31.0613H28.771V28.8003H31.03V31.0613ZM31.03 25.8923H2.909V8.10828H31.03V25.8923ZM31.03 5.19928H28.771V2.93927H31.03V5.19928ZM36.2 31.0613H33.94V28.8003H36.2V31.0613ZM41.378 31.0613H39.108V28.8003H41.377L41.378 31.0613ZM46.546 31.0613H44.286V28.8003H46.545L46.546 31.0613ZM51.715 31.0613H49.455V28.8003H51.714L51.715 31.0613ZM56.893 31.0613H54.623V28.8003H56.892L56.893 31.0613ZM62.062 31.0613H59.8V28.8003H62.06L62.062 31.0613ZM62.062 25.8923H33.939V8.10828H62.061L62.062 25.8923ZM62.062 5.19928H59.8V2.93927H62.06L62.062 5.19928ZM64.97 28.8003H67.229V31.0603H64.97V28.8003ZM70.138 28.8003H72.407V31.0603H70.138V28.8003ZM75.316 28.8003H77.576V31.0603H75.316V28.8003ZM80.485 28.8003H82.744V31.0603H80.485V28.8003ZM85.653 28.8003H87.922V31.0603H85.653V28.8003ZM93.091 31.0603H90.831V28.8003H93.091V31.0603ZM93.091 25.8913H64.97V8.10828H93.091V25.8913ZM93.091 5.19828H90.831V2.93827H93.091V5.19828Z"

const FilmGenreDistribution = () => {
    return (
        <div className="relative min-h-screen bg-black text-gray-300">
            <div className="container mx-auto p-8 mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header text alignment changes based on screen size */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4  lg:text-left md:text-left sm:text-center">
                        Canadian Film <br /> Genre Distribution
                    </h1>

                    {/* SVG alignment changes based on screen size */}
                    <div className="my-12 flex md:content-left sm:content-center  space-x-4">
                        <svg
                            className="block" // Adjust the alignment here
                            width="96"
                            height="18"
                            viewBox="0 0 96 34"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d={filmStripSvgPath} fill="white"/>
                        </svg>
                        <svg
                            className="block" // Adjust the alignment here
                            width="96"
                            height="18"
                            viewBox="0 0 96 34"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d={filmStripSvgPath} fill="white"/>
                        </svg>
                        <svg
                            className="block" // Adjust the alignment here
                            width="96"
                            height="18"
                            viewBox="0 0 96 34"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d={filmStripSvgPath} fill="white"/>
                        </svg>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <p className="text-sm sm:text-base leading-relaxed">
                            This heat map visualizes the distribution of movie genres over the past decade, focusing on films shot in Canada. Understanding genre distribution helps identify trends and shifts in the Canadian film industry, providing valuable insights for producers, filmmakers, and enthusiasts. By analyzing these patterns, stakeholders can make informed decisions about future productions and investments.
                        </p>
                        <p className="text-sm sm:text-base leading-relaxed">
                            The x-axis represents the years, while the y-axis lists the genres. Each cell&apos;s color intensity indicates the number of films produced in that genre for the corresponding year. This dataset was sourced from IMDb, filtered to include only movies filmed in at least one location in Canada and released within the last 10 years. This visualization showcases genre trends and production patterns over time.
                        </p>
                    </div>
                </div>
                <div className="flex justify-center mt-12">
                    <div className="">
                        <GenreHeatMap  />
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


