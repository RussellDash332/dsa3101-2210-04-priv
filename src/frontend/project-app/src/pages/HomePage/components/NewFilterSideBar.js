import React, { useContext, useEffect, useRef, useState } from "react";
import TimeRangeSlider from "react-time-range-slider";
import { DateRange } from "react-date-range";
import format from "date-fns/format";
import { FiFilter } from "react-icons/fi";
import "./Filter.css";
import CameraDataContext from "./CameraDataContext.js";
import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css'; 

const NewFilterSideBar = ({children}) => {

    const {
        data,
        filteredData,
        setFilteredData,
        filterGroupToggle,
        setFilterGroupToggle
    } = useContext(CameraDataContext);

    const changeStartHandler = (time) => {
        console.log("Start Handler Called", time);
    }

    const timeChangeHandler = (time) => {
        setTimeRange(time);
    }

    const changeCompleteHandler = (time) => {
        console.log("Complete Handler Called", time);
    }

    //open close
    const [open, setOpen] = useState(false);

    //get the target element to toggle
    const refOne = useRef(null);

    const hideOnEscape = (e) => {
        if( e.key === "Escape"){
            setOpen(false)
        }
    };

    const hideOnClickOutside = (e) => {
        if( refOne.current && !refOne.current.contains(e.target) ){
            setOpen(false)
        }
    };

    // to toggle 'year' if no existing filter or 
    // untoggle 'year' if its filtered by year and to 
    const updateFilterToggle = (value) => {
        setFilterGroupToggle(value);
    };

    const [dateRange, setRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);

    const [timeRange, setTimeRange] = useState({
        start: "00:00",
        end: "23:59"
    });

    const [submitFilterToggle, setSubmitFilterToggle] = useState(false);

    const clickSubmitFilter = () => {
        setSubmitFilterToggle(true);
    }

    const findSmallestDate = (data) => {
        const flattened_data = flatten_data(data, "smallestDate")
        let currentDate = new Date();

        for (const entry of flattened_data) {
            const dateStr = entry['year_month_day']
            const date = new Date(dateStr.substring(0, 4) + '-' + dateStr.substring(4, 6) + '-' + dateStr.substring(6, 8) + " 00:00");

            if (date < currentDate) {
                currentDate = date;
            }
        }
        return currentDate;
    }

    const flatten_data = (data, source) => {
        const flattened_data = []
        for (const [date, entries] of Object.entries(data)) {
            for (const entry of Object.values(entries)) {
                const newEntry = {...entry}
                newEntry['year_month_day'] = date;
                flattened_data.push(newEntry);
            }
        }
        return flattened_data;
    }

    const format_data = (data) => {
        const new_data = []
        for (const entry of data) {
            const date = entry['year_month_day']
            entry['year'] = date.substring(0, 4);
            entry['year_month'] = date.substring(0, 4) + "-" + date.substring(4, 6);
            entry['year_month_day'] = date.substring(0, 4) + "-" + date.substring(4, 6) + "-" + date.substring(6, 8);
            entry['startDate'] = dateRange[0].startDate
            entry['endDate'] = dateRange[0].endDate

            const timestamp = new Date(entry['timestamp'])
            entry['time'] =  timestamp.getHours() + ":" + timestamp.getMinutes()
            new_data.push(entry)
        }
        return new_data;
    }

    const aggregateByCameraId = (prev, current, index) => {

        const key = current[filterGroupToggle]
        const camera_id = current["camera_id"]
        const direction = current["direction"]
 
        if (!(camera_id in prev)) {
            prev[camera_id] = {}
        }

        if (!(direction in prev[camera_id])) {
            prev[camera_id][direction] = {}
        }

        if (!(key in prev[camera_id][direction])) {
            prev[camera_id][direction][key] = 0;
        }
            
        prev[camera_id][direction][key] += current["count"]

        return prev;
    };

    const stringToTime = (str) => {
        const strArray = str.split(':')
        const hourStr = strArray[0]
        const hour = parseInt(hourStr) 
        const minuteStr = strArray[1]
        const minute = parseInt(minuteStr) 

        return hour*60 + minute;
    };

    const checkValidRange = (dataPoint) => {
        const startDate = dateRange[0].startDate
        const endDate = dateRange[0].endDate    
        const time = dataPoint['time']
        const timestamp = dataPoint['timestamp']
        const calendarDate = new Date(timestamp)

        const tempStartDate = new Date(startDate)
        const tempEndDate = new Date(endDate)
        const tempCalendarDate = new Date(calendarDate)

        return tempStartDate <= tempCalendarDate && tempCalendarDate <= tempEndDate && stringToTime(timeRange.start) <= stringToTime(time) && stringToTime(time) <= stringToTime(timeRange.end);
    };

    const processData = (data) => {
        // 1. processing of data for easier filtering
        const flattened_data = flatten_data(data, "processdata");
        
        // 2. formatting the dates
        const formatted_data = format_data(flattened_data);

        // 3. check if timestamp is within the range
        const filtered_data = formatted_data.filter(checkValidRange);

        // 4. aggregate by camera_id, year
        const aggregated_data = filtered_data.reduce(aggregateByCameraId, {});

        return aggregated_data;
    };

    useEffect(() => {
        // set current date on component load
        document.addEventListener("keydown", hideOnEscape, true)
        document.addEventListener("click", hideOnClickOutside, true)
    },[])

    useEffect(() => {
        if(Object.keys(data).length!==0){
            setRange([{
                    startDate: findSmallestDate(data),
                    endDate: new Date(),
                    key: 'selection'
                }])
        }   
    },[]);

    useEffect(() => {
        if (submitFilterToggle) {
            if(Object.keys(data).length!=0){
                const pdata = processData(data)
                setFilteredData(pdata)
                setSubmitFilterToggle(false);
                document.getElementById("close-filter").click();
            } 
        }
    }, [submitFilterToggle])

    return(
        <div className="drawer drawer-end no-scrollbar h-full w-full">
            <input id="filter-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content no-scrollbar">
                {children}
                <label id="close-filter" htmlFor="filter-drawer" className="drawer-button btn btn-circle btn-primary btn-md shadow-xl absolute bottom-10 right-10 text-white">
                    <FiFilter />
                </label>
            </div> 
            <div className="drawer-side">
                <label htmlFor="filter-drawer" className="drawer-overlay"></label>
                <div className="p-4 w-1/4 min-w-[360px] bg-base-100 text-base-content">
                    {/* start sidebar content  */}
                    {/* title  */}
                    <div className="text-4xl underline underline-offset-8 top-0">
                        <p> Filters </p>
                    </div>
                    <br /><br />
                    
                    {/* calendar filter  */}
                    <div className="calendarWrap w-full">
                        <div className="mb-4 pl-2">
                            <h4>Date Range</h4>
                        </div> 
                        <input
                            value = {` ${format(dateRange[0].startDate, "MM/dd/yyyy")}    to    ${format(dateRange[0].endDate, "MM/dd/yyyy")} ` }
                            readOnly
                            className = "inputBox text-center"
                            onClick={ () => setOpen(open => !open) }
                        />    

                        <div ref={refOne}>
                            {open &&
                            <DateRange
                                onChange = {item => {
                                    setRange(prevState => [item.selection]);
                                }}
                                editableDateInputs = {true}
                                moveRangeOnFirstSelection = {false}
                                ranges = {dateRange}
                                months = {2}
                                direction = "vertical"
                                className = "calendarElement"
                                />
                            }
                        </div>
                        <br />
                    </div>
                    <br />
                    <br />
                    
                    {/* time filter */}
                    <div className="TimeRangeSlider card w-full px-7 py-5 bg-base-200 flex flex-col space-y-4 ">
                        <div>
                            <h4>Time Range</h4>
                        </div> 
                        <TimeRangeSlider
                            disabled={false}
                            format={24}
                            maxValue={"23:59"}
                            minValue={"00:00"}
                            name={"time_range"}
                            onChangeStart={changeStartHandler}
                            onChangeComplete={changeCompleteHandler}
                            onChange={timeChangeHandler}
                            step={10}
                            value={timeRange}/>
                        <div className="flex justify-between">
                            <div>
                                Start Time: {timeRange.start}
                            </div>
                            <div>
                                End Time: {timeRange.end}
                            </div>                     
                        </div>
                    
                    </div>
                    <br />

                    {/* group filter  */}
                    <div className="btn-group btn-group-horizontal justify-center w-full flex space-x-4 card px-7 py-5 bg-base-200 ">
                        <input type="radio" name="options" data-title="year" className="btn" onClick={() => updateFilterToggle("year")} />
                        <input type="radio" name="options" data-title="month" className="btn" onClick={() => updateFilterToggle("year_month")} />
                        <input type="radio" name="options" data-title="day" className="btn" onClick={() => updateFilterToggle("year_month_day")}/>
                    </div>

                    <br/>
                    <br/>

                    <div className="w-full flex justify-center">
                        <label className="btn btn-primary" onClick={clickSubmitFilter}>
                            Filter!
                        </label>
                    </div>
                    
                </div>
            </div>
        </div>
    )

}

export default NewFilterSideBar;