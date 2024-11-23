import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AccessPage from "./components/pages/access/accessPage";
import Home from "./components/pages/home/Home";
import Authentication from "./components/pages/Authentication";
import Admin from "./components/pages/admin/Admin";
import PersonProfile from "./components/pages/profile/PersonProfile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Authentication />,
    // children: [{ path: "/login", element: <Home /> }],
  },
  {
    path: "/home",
    element: <Home />,
    // children: [{ path: "/register", element: <Admin /> }],
  },
  {
    path: "/admin",
    element: <Admin />,
    // children: [{ path: "/logout", element: <Authentication /> }],
  },
  {
    path: "/profile/:userId",
    element: <PersonProfile />,
  },
  {
    path: "/profile",
    element: <PersonProfile />,
  },
]);
function App() {
  return <RouterProvider router={router} />;
}
export default App;
