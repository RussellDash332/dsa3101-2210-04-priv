import React, { useContext } from "react";
import FlowContext from "../FlowComponent/FlowContext";

const ScaleControl = () => {
    const { scale, setScale } = useContext(FlowContext);
    return (
        <div className="form-control w-full max-w-xs rounded-md shadow-2xl absolute bottom-4 left-14 z-10 bg-base-300 px-3">

            {/* Range Labels */}
            <label className="label">
                <span className="label-text-alt font-bold">25%</span>
                <span className="label-text-alt font-bold">50%</span>
                <span className="label-text-alt font-bold">75%</span>
            </label>

            {/* Range Slider */}
            <div className="form-control mb-2 mx-2 items-center">
                <input type="range" 
                    min={25} max={75}
                    value={scale} 
                    onChange={(e) => setScale(e.currentTarget.value)} 
                    className="range range-xs range-primary" /> 
                <span className="label-text-alt font-bold mt-2">Scale Components</span>
            </div>
        </div>
    );
}

export default ScaleControl;