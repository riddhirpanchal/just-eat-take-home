import { useSelector } from "react-redux";
import { HomePage } from "./pages/HomePage";
import { RestaurantListPage } from "./pages/RestaurantListPage";

function App() {
  const searchStatus = useSelector((state) => state.search.status);

  if (searchStatus === "searched") {
    return <RestaurantListPage />;
  }

  return <HomePage />;
}

export default App;
