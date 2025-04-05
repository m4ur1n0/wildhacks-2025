import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

export default function PurchaseShare({ programId, price }) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm programId={programId} price={price} />
    </Elements>
  );
}
