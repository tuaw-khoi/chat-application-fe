import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AccessPage from "./components/pages/accessPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AccessPage />,
  },
]);
function App() {
  return <RouterProvider router={router} />;
}
export default App;
