import {createBrowserRouter, Link, Outlet, RouterProvider} from "react-router-dom";
import SignIn from "~/Pages/signin.tsx";
// import Signup from "~/Pages/signup.tsx";
// import NoMatch from "~/Pages/nomatch.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
// import PrivateRoute from "~/Components/private-routes.tsx";
// import Home from "~/Pages/home.tsx";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import {useAuth, UserProvider} from "~/Context/useAuth.tsx";
// import ProtectedRoute from "~/Routes/ProtectedRoute.tsx";

const queryClient = new QueryClient()

// TODO: Update private route.

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout/>,
    // children: [
    //   {
    //     element: <PrivateRoute/>,
    //     children: [
    //       {
    //         index: true,
    //         element: <ProtectedRoute><Home/></ProtectedRoute>,
    //       },
    //       {
    //         path: "/diagram/:subjectId/:subSubjectId",
    //         async lazy() {
    //           // Multiple routes in lazy file
    //           const {DiagramLayout} = await import("~/Pages/diagram");
    //           return {element: <><ProtectedRoute><DiagramLayout/></ProtectedRoute></>}
    //         },
    //       },
    //       {
    //         path: "/previousDiagram/:id",
    //         async lazy() {
    //           // Multiple routes in lazy file
    //           const {DiagramLayout} = await import("~/Pages/previousDiagram");
    //           return {element: <><ProtectedRoute><DiagramLayout/></ProtectedRoute></>}
    //         },
    //       },
    //       {
    //         path: "/plotScore/:subSubjectId",
    //         async lazy() {
    //           // Multiple routes in lazy file
    //           const {PlotScore} = await import("~/Pages/plotScore");
    //           return {element: <><ProtectedRoute><PlotScore/></ProtectedRoute></>}
    //         },
    //       },
    //       {
    //         path: "/SavedMaps",
    //         async lazy() {
    //           // Multiple routes in lazy file
    //           const {HistoricalMaps} = await import("~/Pages/historicalMaps.tsx");
    //           return {element: <><ProtectedRoute><HistoricalMaps/></ProtectedRoute></>}
    //         },
    //       },
    //       {
    //         path: "/conceptInfo/:subSubjectId/:userScoreId",
    //         async lazy() {
    //           // Multiple routes in lazy file
    //           const {ConceptInfoUser} = await import("~/Pages/conceptInfoUser.tsx");
    //           return {element: <><ProtectedRoute><ConceptInfoUser/></ProtectedRoute></>}
    //         },
    //       },
    //     ]
    //   },
    // ],
  },
  {
    path: "/signin",
    element: <SignIn/>
  },
  // {
  //   path: "/signup",
  //   element: <Signup/>
  // },
  // {
  //   path: "*",
  //   element: <NoMatch/>,
  // },
], {
  basename: import.meta.env.PROD ? "/" : "/"
});

export default function App() {

  return (
      <>
        <UserProvider>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} fallbackElement={<p>Loading...</p>}/>
          </QueryClientProvider>
          <ToastContainer/>
        </UserProvider>
      </>
  )
}

function Layout() {
  // const {logout, user} = useAuth();
  return (
      <>
        <Outlet/>
      </>
  );
}