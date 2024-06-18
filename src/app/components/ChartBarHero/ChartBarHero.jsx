import React from 'react';
import Chart from './components/Chart';

const ChartBarHero = () => {
    return (
        <div className="relative w-full h-full">
            <div className="absolute inset-0 z-0">
                <video className="w-full h-full object-cover" title="bg-video" autoPlay loop muted>
                    <source src="/vid/horror.mp4" type="video/mp4" />
                </video>
            </div>
            <div id="topBar" className="absolute z-20 p-4 w-1/3 ml-12 left-0 top-0">
        <h1 className="hero__intro-text text-9xl">Horror</h1>
        <h2 className="hero__intro-text text-3xl">The Killer Genre</h2>
        <p className="hero__intro-text text-xl">A look at the numbers behind the screams</p>
        <p className="hero__intro-text text-xl">Presentaiton By Matt Richmond</p>
    </div>

            <div className="relative z-10 mb-24">
                <Chart />
            </div>
            <div className="relative z-30">
                <p className="relative text-2xl font-extrabold text-white mb-5 ml-12 z-50">Horror Genres Have The Best ROI with an average profit/cost of</p>
                <p className="relative text-[18vw] text-white leading-none font-semibold z-10 m-0">
                    200%
                    <sup className="relativw top-1/4 right-0 text-base font-bold text-white underline">1</sup>
                </p>
            </div>
        </div>
    );
};

export default ChartBarHero;
