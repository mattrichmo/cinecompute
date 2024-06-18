// Chart.jsx
"use client"

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import './Chart.css'; // Adjust the CSS import as needed
import { useGSAP } from '@gsap/react';



const Chart = () => {
    const chartRef = useRef();

    const companies = [
        { text: 'Comedy', dataPoint: 43.0 },
        { text: 'Thriller / Horror', dataPoint: 44.67 },
        { text: 'Drama', dataPoint: 26.0 },
        { text: 'Action', dataPoint: 29.7 },
        { text: 'SciFi/Fantasy', dataPoint: 18.7 },
    ].reverse();


    // Calculate the maximum data point
    const maxDataPoint = Math.max(...companies.map(company => company.dataPoint));

    // Function to calculate flex basis correctly, ensuring proportional scaling
    const calculateFlexBasis = (dataPoint) => {
        const proportion = (maxDataPoint - dataPoint) / maxDataPoint;
        return `${(proportion * 100).toFixed(1)}%`; // Invert the proportion and convert to a string with one decimal place
    };

    const formatNumber = (number) => {
        return Number(number).toLocaleString('en-US', { maximumFractionDigits: 1 });
    };

    useGSAP(() => {
        // GSAP animations
        const chartBars = gsap.utils.toArray('.js-chart-bar', chartRef.current);
        const chartNums = gsap.utils.toArray('.js-chart-num', chartRef.current);
        
        const tl = gsap.timeline({
            defaults: {
                duration: 1,
                ease: "power4.out"
            }
        });

        tl.from(chartBars, {
            flexBasis: '0%',
            stagger: 0.3
        });

        tl.from(chartNums, {
            textContent: "0",
            duration: 1.1,
            ease: "power1.inOut",
            stagger: 0.3,
            modifiers: {
                textContent: (num, target) => formatNumber(target.dataset.datapoint)
            }
        }, "<");
    }, [companies]);

    return (

        <div className="chart" ref={chartRef}>




            {companies.map((data, index) => (
                <div key={index} className="chart-bar">
                <div className="chart-bar-left"></div>
                    <div className="chart-bar-top js-chart-bar" style={{ flexBasis: calculateFlexBasis(data.dataPoint) }}>
                        {/* Move the left gradient line inside here */}
                        <p className="chart-bar-data">{data.text}</p>
                        <p className="chart-bar-number">
                            <span className="js-chart-num" data-datapoint={data.dataPoint}>{formatNumber(data.dataPoint)}</span> %
                        </p>
                    </div>
                    <div className="chart-bar-fill"></div>
                    <div className="chart-bar-right"></div>
                </div>
            ))}
            <span className="hero__chart-note text-black">Percentage of Watchers Who Preferred This Genre</span>
        </div>

    );
};

export default Chart;
