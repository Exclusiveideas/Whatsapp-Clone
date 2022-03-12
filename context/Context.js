import React from "react";
import { theme } from "../utils";

const GlobaContext = React.createContext({
    theme,
    rooms: [],
    setRooms: () => {},
    unfilteredRooms: [],
    setUnfilteredRooms: () => {}
})

export default GlobaContext;