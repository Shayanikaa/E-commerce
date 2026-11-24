
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const MyOrder = () => {
  const user = JSON.parse(sessionStorage.getItem("active-user"));
  const [myOrderData, setMyOrderData] = useState([]);
  const [loading, setLoading] = useState(true);

  const retrieveMyOrder = useCallback(async () => {
    const response = await axios.get(
      "http://localhost:8080/api/user/myorder?userId=" + user.id
    );

    console.log("My Orders:", response.data);
    return response.data;
  }, [user.id]);

  useEffect(() => {
    const getMyOrder = async () => {
      try {
        if (!user) {
          setMyOrderData([]);
          return;
        }

        const myOrder = await retrieveMyOrder();
        setMyOrderData(myOrder || []);
      } catch (error) {
        console.error("Unable to retrieve orders:", error);
      } finally {
        setLoading(false);
      }
    };

    getMyOrder();
  }, [retrieveMyOrder, user]);

  const getStatusClass = (status) => {
    switch (status?.toUpperCase()) {
      case "DELIVERED":
        return "bg-success";
      case "SHIPPED":
        return "bg-primary";
      case "PENDING":
        return "bg-warning text-dark";
      default:
        return "bg-secondary";
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <h5>Loading your orders...</h5>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      <h2 className="text-center mb-4">My Orders</h2>

      {myOrderData.length === 0 ? (
        <div className="card text-center p-5">
          <h4>No Orders Found</h4>
          <p className="text-muted">
            You haven't placed any orders yet.
          </p>
        </div>
      ) : (
        myOrderData.map((orderData, index) => (
          <div
            className="card mb-4 shadow-sm border-color"
            key={orderData.orderId + "-" + orderData.productId + "-" + index}
          >
            <div className="card-header bg-color custom-bg-text d-flex justify-content-between align-items-center flex-wrap">
              <div>
                <b>Order ID: {orderData.orderId}</b>
                <div className="small">
                  Ordered on: {orderData.orderDate}
                </div>
              </div>

              <span
                className={`badge ${getStatusClass(
                  orderData.deliveryStatus
                )} p-2 mt-2 mt-md-0`}
              >
                {orderData.deliveryStatus}
              </span>
            </div>

            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-2 text-center mb-3">
                  <img
                    src={
                      "http://localhost:8080/api/product/" +
                      orderData.productImage
                    }
                    className="img-fluid"
                    alt={orderData.productName}
                    style={{
                      maxWidth: "120px",
                      maxHeight: "120px",
                      objectFit: "contain",
                    }}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <h5>{orderData.productName}</h5>

                  <p className="text-muted mb-1">
                    {orderData.productDescription}
                  </p>

                  <p className="mb-1">
                    <b>Quantity:</b> {orderData.quantity}
                  </p>

                  <h5 className="text-success mt-2">
                    ₹ {orderData.totalPrice}
                  </h5>
                </div>

                <div className="col-md-4">
                  <div className="mb-3">
                    <small className="text-muted">Expected Delivery</small>
                    <h6>{orderData.deliveryDate}</h6>
                  </div>

                  <div className="mb-2">
                    <small className="text-muted">Delivery Person</small>
                    <h6>
                      {orderData.deliveryPersonName || "Not Assigned Yet"}
                    </h6>
                  </div>

                  <div>
                    <small className="text-muted">Contact Number</small>
                    <h6>
                      {orderData.deliveryPersonContact || "Not Available"}
                    </h6>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-footer bg-light">
              <div className="d-flex justify-content-between flex-wrap">
                <span>
                  <b>Delivery Status:</b> {orderData.deliveryStatus}
                </span>

                <span className="text-muted">
                  Expected by: {orderData.deliveryDate}
                </span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyOrder;
