// components/CheckoutWrapper.js
import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./StripePayment";

const stripePromise = loadStripe("pk_test_51Rc3OyQR9SYQY3Zz9fC2j6sLwEpKUFLmx84AfyYCmGZ9LTn96XA8TyWIuOSbprQmtx2LtSI7qBdaeqMhEA6P0v0H00i2Hp7Upc");

const CheckoutWrapper = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default CheckoutWrapper;
