// Mock payment gateway (similar to Stripe)
export const processPayment = async (amount, paymentMethod, cardDetails = null) => {
  // Simulate payment processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Simulate payment success/failure (90% success rate)
  const isSuccess = Math.random() > 0.1;

  if (isSuccess) {
    const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    return {
      success: true,
      paymentId,
      amount,
      status: 'completed',
      transactionId: `txn_${Date.now()}`,
      timestamp: new Date()
    };
  } else {
    return {
      success: false,
      error: 'Payment failed. Please try again.',
      status: 'failed'
    };
  }
};

export const processRefund = async (paymentId, amount) => {
  // Simulate refund processing delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // Refunds always succeed in this mock
  return {
    success: true,
    refundId: `refund_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    amount,
    status: 'processed',
    timestamp: new Date()
  };
};


