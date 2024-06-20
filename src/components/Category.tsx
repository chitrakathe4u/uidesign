import { useLocation, useParams } from "react-router-dom";
import SearchResults from "./SearchResults";

function Category() {
  const { query } = useParams();
  const location = useLocation();
  const { pathname } = location;

  if (!query) {
    return (
      <SearchResults
        query={
          pathname.includes("category/women")
            ? "search=female"
            : pathname.includes("category/men")
            ? "search=male"
            : "search=disabled"
        }
      />
    );
  }
  return (
    <SearchResults
      query={
        pathname.includes("women")
          ? "search=" + query + "&gender=female+disabled"
          : pathname.includes("men")
          ? "search=" + query + "&gender=male+disabled"
          : "search=" + query
      }
    />
  );
}

export default Category;
