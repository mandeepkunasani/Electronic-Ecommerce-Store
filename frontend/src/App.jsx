import { useEffect, useState } from "react";
import "./App.css";
import { Link } from "react-router-dom";

function App() {
  const user = JSON.parse(
  localStorage.getItem("user")
);

const isLoggedIn = !!user;

const userName = user?.name || "";
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedProduct, setSelectedProduct] =
  useState(null);
  const [reviewText, setReviewText] =
  useState("");

const [reviewRating, setReviewRating] =
  useState(5);

const [reviews, setReviews] = useState(
  JSON.parse(localStorage.getItem("reviews")) || []
);
  const [wishlist, setWishlist] = useState(
  JSON.parse(localStorage.getItem("wishlist")) || []
);
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );
const [orders, setOrders] = useState(
  JSON.parse(localStorage.getItem("orders")) || []
);


  useEffect(() => {
    fetch("https://electronic-ecommerce-store.onrender.com/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);
useEffect(() => {
  localStorage.setItem(
    "wishlist",
    JSON.stringify(wishlist)
  );
}, [wishlist]);
useEffect(() => {
  localStorage.setItem(
    "orders",
    JSON.stringify(orders)
  );
}, [orders]);
useEffect(() => {
  localStorage.setItem(
    "reviews",
    JSON.stringify(reviews)
  );
}, [reviews]);

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
  const addToWishlist = (product) => {
  const exists = wishlist.find(
    (item) => item._id === product._id
  );

  if (!exists) {
    setWishlist([...wishlist, product]);
  }
};

const removeWishlist = (id) => {
  setWishlist(
    wishlist.filter(
      (item) => item._id !== id
    )
  );
};
const addReview = () => {
  if (!reviewText) return;

  const newReview = {
    productId: selectedProduct._id,
    rating: reviewRating,
    comment: reviewText,
  };

  setReviews([
    ...reviews,
    newReview,
  ]);

  setReviewText("");
  setReviewRating(5);
};
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
    <h1>Electronic Ecommerce Store</h1>

<div>
  {isLoggedIn ? (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <h3>Welcome {userName}</h3>

      <button
        onClick={() => {
          localStorage.removeItem("user");
          window.location.reload();
        }}
        style={{
          backgroundColor: "red",
          color: "white",
          border: "none",
          padding: "10px 15px",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  ) : (
    <Link to="/login">
      <button
        style={{
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          padding: "12px 25px",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: "bold",
        }}
      >
        Login
      </button>
    </Link>
  )}
</div>


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
  onClick={() =>
    setSelectedProduct(product)
  }
  style={{
    objectFit: "cover",
    borderRadius: "10px",
    cursor: "pointer",
  }}
/>

              <h2>{product.name}</h2>
              <p
                  style={{
                  color: "gold",
                  fontWeight: "bold",
                  fontSize: "18px",
                  }}
                  >
  ⭐ {product.rating || 4.5}
</p>


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

<button
  onClick={() => addToWishlist(product)}
  style={{
    backgroundColor: "crimson",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    marginLeft: "10px",
  }}
>
  ❤️ Wishlist
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
          <button
  onClick={() =>
    setShowCheckout(true)
  }
  style={{
    backgroundColor: "green",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
  }}
>
  Proceed To Checkout
</button>
        </>
      )}
  <hr style={{ margin: "40px 0" }} />

<h2>❤️ Wishlist</h2>

{wishlist.length === 0 ? (
  <p>No Wishlist Items</p>
) : (
  wishlist.map((item) => (
    <div
      key={item._id}
      style={{
        border: "1px solid pink",
        padding: "10px",
        marginBottom: "10px",
        borderRadius: "10px",
      }}
    >
      <h3>{item.name}</h3>

      <p>₹{item.price}</p>

      <button
        onClick={() => removeWishlist(item._id)}
      >
        Remove
      </button>
    </div>
  ))
)}

{/* Checkout Form */}

{showCheckout && (
  <div
    style={{
      border: "1px solid white",
      padding: "20px",
      marginTop: "30px",
      borderRadius: "10px",
    }}
  >
    <h2>🧾 Checkout</h2>

    <input
      type="text"
      placeholder="Full Name"
      style={{
        padding: "10px",
        width: "300px",
      }}
    />

    <br />
    <br />

    <input
      type="text"
      placeholder="Phone Number"
      style={{
        padding: "10px",
        width: "300px",
      }}
    />

    <br />
    <br />
    <input
      type="text"
      placeholder="Add location on map"
      style={{
        padding: "10px",
        width: "300px",
      }}
    />

    <br />
    <br />

    <input
      type="text"
      placeholder="Flat,House no.,Building,Company,Apartment"
      style={{
        padding: "10px",
        width: "300px",
      }}
    />

    <br />
    <br />
    <input
      type="text"
      placeholder="Area,Street,Sector,Village"
      style={{
        padding: "10px",
        width: "300px",
      }}
    />

    <br />
    <br />
    <input
      type="text"
      placeholder="Landmark"
      style={{
        padding: "10px",
        width: "300px",
      }}
    />

    <br />
    <br />

    <input
      type="text"
      placeholder="Town/City"
      style={{
        padding: "10px",
        width: "300px",
      }}
    />

    <br />
    <br />

    <input
      type="text"
      placeholder="Pincode"
      style={{
        padding: "10px",
        width: "300px",
      }}
    />

    <br />
    <br />
    <input
      type="text"
      placeholder="State"
      style={{
        padding: "10px",
        width: "300px",
      }}
    />

    <br />
    <br />

    <h3>Total Amount: ₹{totalPrice}</h3>


    <button
      onClick={() => {
  const newOrder = {
    id: Date.now(),
    items: cart,
    total: totalPrice,
    status: "Processing",
    date: new Date().toLocaleString(),
  };

  setOrders([...orders, newOrder]);

  alert("Order Placed Successfully!");

  setCart([]);
  setShowCheckout(false);
}}
      style={{
        backgroundColor: "green",
        color: "white",
        border: "none",
        padding: "12px 20px",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      Place Order
    </button>
  </div>
)}
<hr style={{ margin: "40px 0" }} />

<h2>📦 Order History</h2>

{orders.length === 0 ? (
  <p>No Orders Yet</p>
) : (
  orders.map((order) => (
    <div
      key={order.id}
      style={{
        border: "1px solid orange",
        padding: "15px",
        marginBottom: "15px",
        borderRadius: "10px",
      }}
    >
      <p>
        <strong>Order Date:</strong>{" "}
        {order.date}
      </p>

      <p>
        <strong>Status:</strong>{" "}
        {order.status}
      </p>

      <p>
        <strong>Total:</strong> ₹
        {order.total}
      </p>

      <h4>Items:</h4>

      {order.items.map((item) => (
        <div key={item._id}>
          {item.name} × {item.quantity}
        </div>
      ))}
    </div>
  ))
)}
{selectedProduct && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.8)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 999,
    }}
  >
    <div
      style={{
        backgroundColor: "white",
        color: "black",
        padding: "20px",
        borderRadius: "10px",
        width: "600px",
        maxHeight: "90vh",
        overflowY: "auto",
        textAlign: "center",
      }}
    >
      <img
        src={selectedProduct.image}
        alt={selectedProduct.name}
        width="250"
        style={{
          borderRadius: "10px",
        }}
      />

      <h2
          style={{
              color: "black",
              fontWeight: "bold",
              marginTop: "15px",
              }}
          >
          {selectedProduct.name}
          </h2>

      <h3>
        ₹{selectedProduct.price}
      </h3>

      <p>
        ⭐ {selectedProduct.rating}
      </p>

      <p>
        Stock: {selectedProduct.stock}
      </p>

      <p
      style={{
          color: "black",
          }}
      >
        {selectedProduct.description}
      </p>
      <hr />

<h3>⭐ Product Reviews</h3>

<select
  value={reviewRating}
  onChange={(e) =>
    setReviewRating(Number(e.target.value))
  }
>
  <option value="5">5 Stars</option>
  <option value="4">4 Stars</option>
  <option value="3">3 Stars</option>
  <option value="2">2 Stars</option>
  <option value="1">1 Star</option>
</select>

<br />
<br />

<textarea
  placeholder="Write your review..."
  value={reviewText}
  onChange={(e) =>
    setReviewText(e.target.value)
  }
  style={{
    width: "90%",
    height: "60px",
  }}
/>

<br />
<br />

<button
  onClick={addReview}
  style={{
    backgroundColor: "green",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
  }}
>
  Submit Review
</button>

<hr />

{reviews
  .filter(
    (review) =>
      review.productId ===
      selectedProduct._id
  )
  .map((review, index) => (
    <div
      key={index}
      style={{
        marginBottom: "10px",
      }}
    >
      <p>
        ⭐ {review.rating}
      </p>

      <p>
        {review.comment}
      </p>
    </div>
  ))}

      <button
        onClick={() =>
          addToCart(selectedProduct)
        }
        style={{
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          padding: "10px 15px",
          borderRadius: "5px",
          marginRight: "10px",
        }}
      >
        Add To Cart
      </button>

      <button
        onClick={() =>
          setSelectedProduct(null)
        }
        style={{
          backgroundColor: "red",
          color: "white",
          border: "none",
          padding: "10px 15px",
          borderRadius: "5px",
        }}
      >
        Close
      </button>
    </div>
  </div>
)}

{/* Contact Us Section */}

<hr style={{ margin: "40px 0" }} />

<div
  style={{
    textAlign: "center",
    padding: "20px",
  }}
>
  <h2>📞 Contact Us</h2>

  <p>Email: mandeepkunasani@gmail.com</p>

  <p>Phone: +91 9573462444</p>

  <p>Address: Hyderabad, Telangana, India</p>

  <button
    onClick={() =>
      alert(
        "Mail us at mandeepkunasani@gmail.com"
      )
    }
  >
    Email Us
  </button>
</div>

</div>
);
}

export default App;