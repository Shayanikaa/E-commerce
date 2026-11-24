
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const AddCardDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem("active-user"));
  const priceToPay = location.state?.priceToPay ?? "0";

  const [processing, setProcessing] = useState(false);

  const [card, setCard] = useState({
    cardName: "",
    cardNumber: "",
    validThrough: "",
    cvv: "",
  });

  const handleCardInput = (e) => {
    setCard({ ...card, [e.target.name]: e.target.value });
  };

  const payForOrder = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login before placing an order.");
      return;
    }

    try {
      setProcessing(true);

      const response = await fetch(
        "http://localhost:8080/api/user/order?userId=" + user.id,
        {
          method: "POST",
          headers: {
            Accept: "text/plain",
          },
        }
      );

      // Backend returns plain text, not JSON.
      const result = await response.text();

      console.log("Order API status:", response.status);
      console.log("Order API response:", result);

      if (!response.ok) {
        throw new Error(result || "Unable to place order.");
      }

      toast.success("Products ordered successfully!", {
        position: "top-center",
        autoClose: 1000,
      });

      setTimeout(() => {
        navigate("/user/myorder");
      }, 1000);

    } catch (error) {
      console.error("Order placement error:", error);
      toast.error("Unable to place order. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      <div className="mt-2 d-flex align-items-center justify-content-center">
        <div className="card form-card border-color" style={{ width: "25rem" }}>
          <div className="card-header bg-color custom-bg-text">
            <h5 className="card-title text-center">Payment Details</h5>
          </div>

          <div className="card-body text-color custom-bg">
            <form onSubmit={payForOrder}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  <b>Name on Card</b>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="cardName"
                  onChange={handleCardInput}
                  value={card.cardName}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="cardNumber" className="form-label">
                  <b>Card Number</b>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="cardNumber"
                  name="cardNumber"
                  onChange={handleCardInput}
                  value={card.cardNumber}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="validThrough" className="form-label">
                  <b>Valid Through</b>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="validThrough"
                  name="validThrough"
                  onChange={handleCardInput}
                  value={card.validThrough}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="cvv" className="form-label">
                  <b>CVV</b>
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="cvv"
                  name="cvv"
                  onChange={handleCardInput}
                  value={card.cvv}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn custom-bg-text bg-color"
                disabled={processing}
              >
                {processing ? "Processing..." : "Pay Rs " + priceToPay}
              </button>

              <ToastContainer />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCardDetails;
