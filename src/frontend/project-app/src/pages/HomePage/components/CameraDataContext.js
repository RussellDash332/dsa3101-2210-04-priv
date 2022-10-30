import { createContext, useEffect, useState } from "react";
import { subscribeCameraLog } from "../../../api/firebase-db";
import { off } from "firebase/database";

const CameraDataContext = createContext();
export default CameraDataContext;

export const CameraDataContextProvider = ({children}) => {
    const [data, setData] = useState({}); // Raw data from firebase db
    const [filteredData, setFilteredData] = useState({});

    // Initial Listener on data
    useEffect(() => {
        subscribeCameraLog((logData) => {
            // console.log(logData);
            setData(logData);
            // Cannot put find smallest date here because this would be triggered everytime there is new data in the database
        })
    }, [])

    




    return (
        <CameraDataContext.Provider
            value={{
                data,
                filteredData,
                setFilteredData
            }}
        >
            {children}
        </CameraDataContext.Provider>
    );
}




    
    
    
    
    
    
    
    

    


    