import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import './stripeCheckoutForm.css';
import './AdvanceCheckoutOverlay.css';

function formatCardInput(value) {
  const d = value.replace(/\D/g, '').slice(0, 16);
  return d.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

const AdvanceCheckoutOverlay = ({
  open,
  phase,
  hostelName,
  order,
  user,
  paymentRef,
  onClose,
  onVerified,
}) => {
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [country, setCountry] = useState('IN');
  const [saveInfo, setSaveInfo] = useState(false);
  const [formError, setFormError] = useState('');
  const [payLoading, setPayLoading] = useState(false);

  useEffect(() => {
    if (user?.email) {
      setEmail((prev) => prev || user.email);
    }
  }, [user]);

  if (!open) {
    return null;
  }

  const validateForm = () => {
    const em = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      return 'Enter a valid email address.';
    }
    const digits = cardNumber.replace(/\s/g, '');
    if (digits.length < 13 || digits.length > 19 || !/^\d+$/.test(digits)) {
      return 'Enter a valid card number.';
    }
    if (!/^\d{2}\s*\/\s*\d{2}$/.test(expiry.trim())) {
      return 'Enter expiry as MM / YY.';
    }
    if (!/^\d{3,4}$/.test(cvc.trim())) {
      return 'Enter a valid CVC.';
    }
    if (!cardName.trim()) {
      return 'Enter the cardholder name.';
    }
    return '';
  };

  const handlePay = async (e) => {
    e.preventDefault();
    if (!order?.orderId) return;
    const v = validateForm();
    if (v) {
      setFormError(v);
      return;
    }
    setFormError('');
    setPayLoading(true);
    try {
      const { data } = await api.post('/payments/booking-verify', {
        razorpay_order_id: order.orderId,
        mockConfirm: true,
      });
      onVerified(data);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Payment could not be completed.');
    } finally {
      setPayLoading(false);
    }
  };

  const advance = order?.displayAmountRupees ?? 0;
  const balance = order?.balanceDueAtHostel ?? 0;

  return (
    <div className="advance-checkout-overlay" role="dialog" aria-modal="true" aria-labelledby="advance-checkout-title">
      <div className="advance-checkout-inner">
        <button type="button" className="advance-checkout-close-top" onClick={onClose}>
          ← Back to hostel
        </button>

        <p className="advance-checkout-hostel" id="advance-checkout-title">
          <strong>{hostelName}</strong>
          Advance booking payment
        </p>

        {phase === 'loading' && <div className="advance-checkout-loading">Preparing secure checkout…</div>}

        {phase === 'form' && order && (
          <div className="stripe-checkout-card">
            <button type="button" className="stripe-link-pay" disabled title="Demo only">
              Pay with <span className="stripe-link-brand">link</span>
            </button>

            <div className="stripe-or-rule">
              <span>OR</span>
            </div>

            <form onSubmit={handlePay} className="stripe-checkout-form" noValidate>
              <section className="stripe-section">
                <h2 className="stripe-section-title">Contact information</h2>
                <label className="stripe-label">
                  Email
                  <input
                    type="email"
                    className="stripe-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    placeholder="email@example.com"
                  />
                </label>
              </section>

              <section className="stripe-section">
                <h2 className="stripe-section-title">Payment method</h2>
                <label className="stripe-label">
                  Card information
                  <span className="stripe-hint">Demo: e.g. 4242 4242 4242 4242</span>
                  <div className="stripe-card-wrap">
                    <input
                      type="text"
                      className="stripe-input stripe-input-card"
                      inputMode="numeric"
                      placeholder="1234 1234 1234 1234"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardInput(e.target.value))}
                      autoComplete="cc-number"
                    />
                    <div className="stripe-card-row">
                      <input
                        type="text"
                        className="stripe-input"
                        inputMode="numeric"
                        placeholder="MM / YY"
                        value={expiry}
                        onChange={(e) => {
                          let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                          if (v.length >= 2) v = `${v.slice(0, 2)} / ${v.slice(2)}`;
                          setExpiry(v);
                        }}
                        autoComplete="cc-exp"
                      />
                      <input
                        type="text"
                        className="stripe-input"
                        inputMode="numeric"
                        placeholder="CVC"
                        maxLength={4}
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        autoComplete="cc-csc"
                      />
                    </div>
                  </div>
                </label>

                <label className="stripe-label">
                  Cardholder name
                  <input
                    type="text"
                    className="stripe-input"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    autoComplete="cc-name"
                    placeholder="Full name on card"
                  />
                </label>

                <label className="stripe-label">
                  Country or region
                  <select className="stripe-input stripe-select" value={country} onChange={(e) => setCountry(e.target.value)}>
                    <option value="IN">India</option>
                    <option value="US">United States</option>
                    <option value="GB">United Kingdom</option>
                    <option value="AU">Australia</option>
                  </select>
                </label>
              </section>

              <label className="stripe-save-row">
                <input type="checkbox" checked={saveInfo} onChange={(e) => setSaveInfo(e.target.checked)} />
                <span>
                  Save my information for faster checkout
                  <small>Demo only — not stored for real.</small>
                </span>
              </label>

              {formError && <div className="stripe-form-error">{formError}</div>}

              <button type="submit" className="stripe-pay-primary stripe-pay-submit" disabled={payLoading}>
                {payLoading ? 'Processing…' : 'Pay'}
              </button>

              <p className="stripe-amount-inline">
                Advance now: <strong>₹{advance}</strong> · Due at hostel: <strong>₹{balance}</strong>
              </p>
            </form>

            <footer className="stripe-footer">
              <span>Demo checkout</span>
              <span className="stripe-footer-sep">·</span>
              <span>Hostel booking advance</span>
            </footer>
          </div>
        )}

        {phase === 'success' && order && (
          <div className="stripe-success-card">
            <div className="stripe-success-icon" aria-hidden="true">
              ✓
            </div>
            <h1>Payment successful</h1>
            <p className="stripe-success-amount">₹{order.displayAmountRupees} advance paid</p>
            <p className="stripe-success-note">
              Your booking request was sent to the owner. Pay the remaining <strong>₹{order.balanceDueAtHostel}</strong>{' '}
              when you arrive at the hostel.
            </p>
            {paymentRef && (
              <p className="stripe-success-ref">
                Reference: <code>{paymentRef}</code>
              </p>
            )}
            <button type="button" className="stripe-pay-primary" onClick={onClose}>
              Back to hostel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvanceCheckoutOverlay;
