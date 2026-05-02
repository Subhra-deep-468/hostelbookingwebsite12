import React, { useState, useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import './DummyPaymentPage.css';

const AMOUNT_LABEL = 1000;

function formatCardInput(value) {
  const d = value.replace(/\D/g, '').slice(0, 16);
  return d.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

const DummyPaymentPage = () => {
  const { user, initializing } = useContext(AuthContext);
  const [phase, setPhase] = useState('landing');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentRef, setPaymentRef] = useState('');

  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [country, setCountry] = useState('IN');
  const [saveInfo, setSaveInfo] = useState(false);

  useEffect(() => {
    if (user?.email) {
      setEmail((prev) => prev || user.email);
    }
  }, [user]);

  if (initializing) {
    return (
      <div className="dummy-pay-page">
        <p className="dummy-pay-loading">Loading…</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: '/dummy-payment' }} />;
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
    const v = validateForm();
    if (v) {
      setError(v);
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { data: order } = await api.post('/payments/quick-order', { forceMock: true });
      const { data: done } = await api.post('/payments/quick-verify', {
        razorpay_order_id: order.orderId,
        mockConfirm: true,
      });
      setPaymentRef(done.paymentId || order.orderId || '');
      setPhase('success');
    } catch (err) {
      setError(err.response?.data?.message || 'Payment could not be completed.');
    } finally {
      setLoading(false);
    }
  };

  if (phase === 'success') {
    return (
      <div className="dummy-pay-page stripe-checkout-page">
        <div className="stripe-success-card">
          <div className="stripe-success-icon" aria-hidden="true">
            ✓
          </div>
          <h1>Payment successful</h1>
          <p className="stripe-success-amount">₹{AMOUNT_LABEL} paid</p>
          <p className="stripe-success-note">Thank you. This was a test charge — no hostel booking was created.</p>
          {paymentRef && (
            <p className="stripe-success-ref">
              Reference: <code>{paymentRef}</code>
            </p>
          )}
          <button type="button" className="stripe-pay-primary" onClick={() => setPhase('landing')}>
            Pay again
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'landing') {
    return (
      <div className="dummy-pay-page stripe-checkout-page">
        <div className="stripe-landing-card">
          <h1>Test payment</h1>
          <p className="stripe-landing-lead">Pay <strong>₹{AMOUNT_LABEL}</strong> using the card checkout screen (demo).</p>
          <button type="button" className="stripe-pay-primary stripe-landing-cta" onClick={() => setPhase('checkout')}>
            Pay ₹{AMOUNT_LABEL}
          </button>
          <p className="stripe-landing-hint">You’ll fill in email and card details on the next step, then tap Pay.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dummy-pay-page stripe-checkout-page">
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
              <span className="stripe-hint">Demo: any valid-looking number works (e.g. 4242 4242 4242 4242).</span>
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
              <small>Pay securely on this demo site only.</small>
            </span>
          </label>

          {error && <div className="stripe-form-error">{error}</div>}

          <button type="submit" className="stripe-pay-primary stripe-pay-submit" disabled={loading}>
            {loading ? 'Processing…' : `Pay`}
          </button>

          <p className="stripe-amount-inline">
            Total due now: <strong>₹{AMOUNT_LABEL}</strong>
          </p>
        </form>

        <footer className="stripe-footer">
          <span>Demo checkout UI</span>
          <span className="stripe-footer-sep">·</span>
          <span>Practice payment only</span>
        </footer>

        <button type="button" className="stripe-back-link" onClick={() => setPhase('landing')}>
          ← Back
        </button>
      </div>
    </div>
  );
};

export default DummyPaymentPage;
