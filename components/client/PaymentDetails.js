import React from 'react';

const PaymentDetails = () => {
    return (
        <div>
            <h2>Payment Details</h2>
            <input type="text" placeholder="Card Number" />
            <input type="text" placeholder="Expiration Date" />
            <input type="text" placeholder="CVV" />
        </div>
    );
};

export default PaymentDetails;
