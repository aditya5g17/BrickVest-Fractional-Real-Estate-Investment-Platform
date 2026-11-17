import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../hooks/useAuth";
import { formatCurrency } from "../utils/format";
import { normalizeProperty } from "../utils/propertyHelpers";
import {
  buildProfileSummary,
  rankProperties,
} from "../utils/recommendations";

function Recommendations() {
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [picks, setPicks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const snapshot = await getDocs(collection(db, "properties"));
        const properties = snapshot.docs.map((doc) =>
          normalizeProperty({ id: doc.id, ...doc.data() })
        );

        setPicks(rankProperties(properties, userProfile, 3));
      } catch (err) {
        console.error(err);
        setError("Could not load recommendations.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [userProfile]);

  const summary = buildProfileSummary(userProfile);

  return (
    <div className="page-shell bg-[var(--surface)] text-[var(--navy)]">
      <div className="page-container py-16">
        <p className="text-sm font-semibold uppercase tracking-wide text-[var(--gold)]">
          Smart Match (Demo)
        </p>
        <h1 className="mt-2 text-3xl font-bold">Recommendations For You</h1>
        <p className="mt-2 text-muted">
          Rule-based scoring — real ML will ship in production. Not financial advice.
        </p>

        <div className="mt-6 card border border-[var(--gold)]/30 bg-[var(--gold)]/10 p-4 text-sm text-[var(--gold)]">
          Demo recommendations — not financial advice. Scores are illustrative only.
        </div>

        <div className="mt-6 grid gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs text-[var(--navy-mid)]">Risk</p>
            <p className="font-semibold capitalize text-[var(--navy)]">{summary.risk}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--navy-mid)]">Goal</p>
            <p className="font-semibold capitalize text-[var(--navy)]">{summary.goal}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--navy-mid)]">City</p>
            <p className="font-semibold text-[var(--navy)]">{summary.city}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--navy-mid)]">Budget / share</p>
            <p className="font-semibold text-[var(--navy)]">{summary.budgetLabel}</p>
          </div>
        </div>

        {loading ? (
          <p className="mt-10 text-muted">Matching properties...</p>
        ) : error ? (
          <p className="mt-10 text-red-500">{error}</p>
        ) : picks.length === 0 ? (
          <div className="mt-10 card p-8 text-center">
            <p className="text-muted">No open properties match your profile.</p>
            <Link to="/marketplace" className="mt-4 inline-block text-[var(--gold)] hover:text-[var(--gold-light)]">
              Browse marketplace
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            {picks.map((pick, index) => (
              <div
                key={pick.property.id}
                className="card p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-[var(--gold)]">
                      {index === 0 ? "Best match" : index === 1 ? "Good match" : "Also consider"} · Score {pick.score}
                    </p>
                    <h2 className="mt-1 text-2xl font-bold text-[var(--navy)]">{pick.property.title}</h2>
                    <p className="text-muted">{pick.property.location}</p>
                  </div>
                  <span className="rounded-full bg-[var(--success)]/10 px-3 py-1 text-sm text-[var(--success)]">
                    {pick.matchPercent}% match
                  </span>
                </div>

                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-4">
                  <p>Yield: <strong>{pick.property.rentalYield}%</strong></p>
                  <p>Growth: <strong>{pick.property.growthScore}/10</strong></p>
                  <p>Share: <strong>{formatCurrency(pick.property.sharePrice)}</strong></p>
                  <p className="capitalize">Risk: <strong>{pick.property.riskLevel}</strong></p>
                </div>

                {pick.timing && (
                  <p className="mt-3 text-sm font-medium text-[var(--gold)]">{pick.timing}</p>
                )}

                <ul className="mt-3 list-inside list-disc text-sm text-muted">
                  {pick.reasons.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>

                <Link
                  to={`/property/${pick.property.id}`}
                  className="mt-5 inline-flex rounded-lg bg-[var(--navy)] px-5 py-2 font-semibold text-white hover:bg-[var(--navy-mid)]"
                >
                  View & Invest
                </Link>
              </div>
            ))}
          </div>
        )}

        <p className="mt-8 text-xs text-[var(--navy-mid)]">
          Scoring uses: risk match + goal + city + budget per share + growth + funding deadline.
        </p>
      </div>
    </div>
  );
}

export default Recommendations;
