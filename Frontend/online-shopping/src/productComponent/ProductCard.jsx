

import { Link } from "react-router-dom";
import CategoryNavigator from "./CategoryNavigator";

const ProductCard = ({ item }) => {
  return (
    <div className="col">
      <div className="card border-color rounded-card card-hover product-card custom-bg h-100">

        {/* Product Image */}
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "220px", padding: "12px" }}
        >
          {item.imageName ? (
            <img
              src={`http://localhost:8080/api/product/${item.imageName}`}
              className="card-img-top"
              alt={item.title}
              style={{
                maxHeight: "200px",
                maxWidth: "100%",
                width: "auto",
                objectFit: "contain",
              }}
            />
          ) : (
            <div className="text-muted text-center">
              <p>No image available</p>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="card-body text-color">
          <h5 className="card-title">
            <b>{item.title}</b>
          </h5>

          <div className="mb-2">
            <CategoryNavigator
              item={{
                id: item.category?.id,
                title: item.category?.title,
              }}
            />
          </div>

          <p className="card-text">
            {item.description}
          </p>
        </div>

        {/* Price and Stock */}
        <div className="card-footer">
          <div className="text-center text-color">
            <h4>Price: ₹{item.price}</h4>
          </div>

          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <Link
              to={`/product/${item.id}/category/${item.category?.id}`}
              className="btn bg-color custom-bg-text"
            >
              Add to Cart
            </Link>

            <p className="text-color mb-0">
              <b>
                <i>Stock:</i> {item.quantity}
              </b>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductCard;

