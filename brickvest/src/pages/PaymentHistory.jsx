import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Link } from "react-router-dom";
import { db } from "../firebase/config";
import { useAuth } from "../hooks/useAuth";
import { formatCurrency, formatDate, paymentStatusLabel } from "../utils/format";

function PaymentHistory() {
  const { currentUser } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      if (!currentUser) return;

      setLoading(true);

      const paymentsQuery = query(
        collection(db, "payments"),
        where("userId", "==", currentUser.uid)
      );
      const snapshot = await getDocs(paymentsQuery);
      const data = snapshot.docs
        .map((paymentDoc) => ({
          id: paymentDoc.id,
          ...paymentDoc.data(),
        }))
        .sort((a, b) => {
          const aTime = a.createdAt?.toMillis?.() || 0;
          const bTime = b.createdAt?.toMillis?.() || 0;
          return bTime - aTime;
        });

      setPayments(data);
      setLoading(false);
    };

    fetchPayments();
  }, [currentUser]);

  return (
    <div className="page-shell bg-[var(--surface)] text-[var(--navy)]">
      <div className="page-container py-16">
        <h1 className="mb-2 text-3xl font-bold">Payment History</h1>
        <p className="mb-8 text-muted">
          View all your investment payments and their status here.
        </p>

        {loading ? (
          <p className="text-muted">Loading payments...</p>
        ) : payments.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-muted">No payment records yet.</p>
            <Link to="/marketplace" className="mt-4 inline-block text-[var(--gold)] hover:text-[var(--gold-light)]">
              Browse properties
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="card p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-[var(--navy)]">{payment.propertyTitle}</h2>
                    <p className="text-sm text-muted">{formatDate(payment.createdAt)}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      payment.status === "paid"
                        ? "bg-[var(--success)]/10 text-[var(--success)]"
                        : payment.status === "failed" || payment.status === "otp_failed"
                          ? "bg-[var(--danger)]/10 text-[var(--danger)]"
                          : "bg-[var(--gold)]/10 text-[var(--gold)]"
                    }`}
                  >
                    {paymentStatusLabel(payment.status)}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                  <div>
                    <p className="text-[var(--navy-mid)]">Amount</p>
                    <p className="font-semibold text-[var(--navy)]">{formatCurrency(payment.amount)}</p>
                  </div>
                  <div>
                    <p className="text-[var(--navy-mid)]">Shares</p>
                    <p className="font-semibold text-[var(--navy)]">{payment.shares}</p>
                  </div>
                  <div>
                    <p className="text-[var(--navy-mid)]">Provider</p>
                    <p className="font-semibold text-[var(--navy)]">
                      {payment.provider === "brickvest_sandbox" ? "Sandbox" : "Razorpay"}
                    </p>
                  </div>
                </div>

                {payment.propertyId && (
                  <Link
                    to={`/property/${payment.propertyId}`}
                    className="mt-4 inline-block text-sm text-[var(--gold)] hover:text-[var(--gold-light)]"
                  >
                    View property
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentHistory;
