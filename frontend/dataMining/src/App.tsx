// App.tsx
import React from 'react';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
// import Signup from '~/components/Signup';
// import Login from '~/components/Login';
import Home from '~/components/home';
import Sidebar from "~/components/sidebar";
// import { AuthProvider, useAuth } from './contexts/AuthContext';
import {TooltipProvider} from "@/components/ui/tooltip.tsx";
import {ThemeProvider} from "@/provider/theme.tsx";
import NoMatch from "@/components/noMatch.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout/>,
        children: [
            {
                children: [
                    {
                        index: true,
                        element: <Home />,
                    }
                ]
            },
        ],
    },
    {
        path: "*",
        element: <NoMatch/>,
    },
]);

const App: React.FC = () => {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            {/*<QueryClientProvider client={queryClient}>*/}
                <TooltipProvider>
                    <RouterProvider router={router} fallbackElement={<p>Loading...</p>}/>
                </TooltipProvider>
            {/*</QueryClientProvider>*/}
        </ThemeProvider>
    );
};

function Layout() {
    return <Sidebar/>;
}

export default App;