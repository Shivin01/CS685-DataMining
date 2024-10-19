import {createBrowserRouter, RouterProvider} from "react-router-dom";
import SignIn from "~/Pages/signin.tsx";
import Signup from "~/Pages/signup.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import PrivateRoute from "~/components/private-routes.tsx";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import {UserProvider} from "~/Context/useAuth.tsx";
import {TooltipProvider} from "~/components/ui/tooltip.tsx";
import Home from "~/Pages/home.tsx";
import NoMatch from "~/Pages/nomatch.tsx";
import Sidebar from "~/Pages/sidebar.tsx";
import {ThemeProvider} from "~/provider/theme.tsx";
import ProtectedRoute from "~/Routes/ProtectedRoute.tsx";

const queryClient = new QueryClient()

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout/>,
        children: [
            {
                element: <PrivateRoute/>,
                children: [
                    {
                        index: true,
                        element: <ProtectedRoute><Home/></ProtectedRoute>,
                    }
                ]
            }
        ],
    },
    {
        path: "/signin",
        element: <SignIn/>
    },
    {
        path: "/signup",
        element: <Signup/>
    },
    {
        path: "*",
        element: <NoMatch/>,
    },
], {
    basename: "/"
});

export default function App() {

    return (
        <>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <UserProvider>
                    <QueryClientProvider client={queryClient}>
                        <TooltipProvider>
                            <RouterProvider router={router} fallbackElement={<p>Loading...</p>}/>
                        </TooltipProvider>
                    </QueryClientProvider>
                    <ToastContainer/>
                </UserProvider>
            </ThemeProvider>
        </>
    )
}

function Layout() {
    return <Sidebar />
}