import React from "react";
import Plot from 'react-plotly.js';
import LineGraph from "./LineGraph"


const AnalyticsLineGraph = () => {
    return (
        <div className="rounded-md overflow-hidden w-10/12 h-[500px] shadow-xl bg-base-200">
            <div>
                <LineGraph />
            </div>
        </div>
    );
}

export default AnalyticsLineGraph;