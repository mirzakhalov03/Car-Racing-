import { useRoutes } from "react-router-dom"
import Home from "./garage/Home"
import Winners from "./winners/Winners"

const RouteController = () => {
    return useRoutes([
        {
            path: "",
            element: <Home/>
        },
        {
            path: "winners",
            element: <Winners/>
        }
        
    ])
}

export default RouteController