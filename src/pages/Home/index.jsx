import React from "react";
import Filter from "../../components/Filter";
import Products from "../../components/Products";
import "../../style.css";
import { ReactComponent as FilterIcon } from "../../images/filter.svg";
import { ReactComponent as SearchIcon } from "../../images/search.svg";
import MobileFilter from "../../components/Filter/MobileFilter";

const Home = ({ cart, setCart }) => {
  const [openFilter, setOpenFilter] = React.useState(false);
  const [allProducts, setAllProducts] = React.useState([]);
  const [products, setProducts] = React.useState([]);
  const [filters, setFilters] = React.useState({
    color: [],
    gender: [],
    price: [],
    type: [],
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  const addToCart = (data) => {
    if (cart.find((p) => p.id === data.id)) {
      setCart((prev) => prev.filter((p) => p.id !== data.id));
    } else {
      if (data.quantity > 0) {
        setCart([...cart, { ...data, qty: 1 }]);
      } else alert("Sorry, This Item is Out Of Stock");
    }
  };

  const fetchProducts = async () => {
    setIsError(false);
    setIsLoading(true);
    try {
      const result = await fetch(
        "https://geektrust.s3.ap-southeast-1.amazonaws.com/coding-problems/shopping-cart/catalogue.json"
      );
      const data = await result.json();
      setProducts(data);
      setAllProducts(data);
    } catch (error) {
      setIsError(true);
    }
    setIsLoading(false);
  };

  React.useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    const text = e.target.value;
    const filteredProducts = allProducts.filter((product) =>
      product.name.toLowerCase().includes(text.toLowerCase())
    );
    setProducts(filteredProducts);
  };

  const handleFilter = (filter) => {
    const { name, value, isCheck } = filter;
    const newFilters = { ...filters };
    if (isCheck) {
      newFilters[name].push(value);
    }
    if (!isCheck) {
      const index = newFilters[name].indexOf(value);
      newFilters[name].splice(index, 1);
    }
    setFilters(newFilters);

    //
    let filteredProducts = allProducts;
    if (newFilters.color.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        newFilters.color.includes(product.color)
      );
    }
    if (newFilters.gender.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        newFilters.gender.includes(product.gender)
      );
    }

    if (newFilters.type.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        newFilters.type.includes(product.type)
      );
    }

    if (newFilters.price.length > 0) {
      let temp = [];
      newFilters.price.forEach((price) => {
        let min, max;
        price.includes("-")
          ? ([min, max] = price.split("-"))
          : (min = price.split("+")[0]);
        let temp1;
        if (max === undefined) {
          temp1 = filteredProducts.filter((product) => product.price >= min);
        } else {
          temp1 = filteredProducts.filter(
            (product) => product.price >= min && product.price <= max
          );
        }
        temp = [...temp, ...temp1];
      });
      filteredProducts = temp;
    }

    //

    setProducts(filteredProducts);
  };

  const filterOptions = {
    filters,
    handleFilter,
  };

  const productOptions = {
    products,
    cart,
    addToCart,
  };

  return (
    <>
      <div className="global_block">
        <div className="search_input_block">
          <input
            type="text"
            className="search_input"
            onChange={handleSearch}
            placeholder="Search"
          />
          <SearchIcon className="icons" />
          <div className="view_on_small_screen">
            <FilterIcon
              className="icons filter_icon "
              onClick={() => setOpenFilter((prev) => !prev)}
            />
          </div>
        </div>
        {openFilter && <MobileFilter {...filterOptions} />}
        <div className="block">
          <Filter {...filterOptions} />
          <Products {...productOptions} />
        </div>
      </div>
    </>
  );
};

export default Home;
