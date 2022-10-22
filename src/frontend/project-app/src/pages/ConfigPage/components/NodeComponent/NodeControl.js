import React from "react";
import { IoIosArrowBack, IoIosSave, IoIosAdd, IoIosApps } from "react-icons/io"

import AddNode from './AddNode';
import AddPath from './AddPath';
import AddSpot from './AddSpot';
import ViewNode from './ViewNode';

const NodeControl = () => {
    return (
        <div className="flex flex-row w-28 absolute bottom-4 right-4 justify-between z-10">
            <div>
                <a href="#addNode" className="btn btn-circle btn-primary btn-md shadow-xl">
                    <IoIosAdd className="h-6 w-6"/>
                </a>
            </div>
            
            <div>
                <a href="#viewNode" className="btn btn-circle btn-primary btn-md shadow-xl">
                    <IoIosApps className="h-6 w-6"/>
                </a>
            </div>



            {/* Popout Modals */}
            <AddNode />
                <AddPath />
                <AddSpot />
            <ViewNode />
        </div>
    );
}

export default NodeControl;