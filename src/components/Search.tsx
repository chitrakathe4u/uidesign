import { useParams } from "react-router-dom";
import SearchResults from "./SearchResults";
import Products from "./Products";

function Search() {
  const { query } = useParams();

  if (!query) {
    return <Products />;
  }

  return <SearchResults query={query} />;
}

export default Search;
