import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showCart, setShowCart] = useState(false);
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );

  useEffect(() => {
    fetch("http://localhost:5001/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    const existingItem = cart.find(
      (item) => item._id === product._id
    );

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item._id === product._id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          ...product,
          quantity: 1,
        },
      ]);
    }
  };

  const increaseQty = (id) => {
    setCart(
      cart.map((item) =>
        item._id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart(
      cart
        .map((item) =>
          item._id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const totalPrice = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>🛍️ CodeAlpha Store</h1>

        <h2>🛒 Cart ({totalItems})</h2>
      </div>

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "10px",
          width: "300px",
          marginRight: "10px",
          marginBottom: "20px",
        }}
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{
          padding: "10px",
          marginBottom: "20px",
        }}
      >
        <option value="All">All</option>
        <option value="Mobile">Mobile</option>
        <option value="Laptop">Laptop</option>
        <option value="Earbuds">Earbuds</option>
        <option value="Watch">Watch</option>
      </select>

      <p>Total Products: {products.length}</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(250px,1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {products
          .filter((product) =>
            category === "All"
              ? true
              : product.category === category
          )
          .filter((product) =>
            product.name
              .toLowerCase()
              .includes(search.toLowerCase())
          )
          .map((product) => (
            <div
              key={product._id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "15px",
                textAlign: "center",
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                width="200"
                height="200"
                style={{
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />

              <h2>{product.name}</h2>

              <p>{product.description}</p>

              <h3>₹{product.price}</h3>

              <p>Stock: {product.stock}</p>

              <button
                onClick={() => addToCart(product)}
                style={{
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  padding: "10px 15px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Add To Cart
              </button>
            </div>
          ))}
      </div>

      <hr style={{ margin: "40px 0" }} />

      <h2>🛒 Shopping Cart</h2>

      {cart.length === 0 ? (
        <p>Cart is Empty</p>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={item._id}
              style={{
                border: "1px solid gray",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "10px",
              }}
            >
              <h3>{item.name}</h3>

              <p>₹{item.price}</p>

              <p>Quantity: {item.quantity}</p>

              <button
                onClick={() =>
                  increaseQty(item._id)
                }
              >
                +
              </button>

              <button
                onClick={() =>
                  decreaseQty(item._id)
                }
                style={{
                  marginLeft: "10px",
                }}
              >
                -
              </button>
            </div>
          ))}

          <h2>Total: ₹{totalPrice}</h2>
        </>
      )}
    </div>
  );
}

export default App;