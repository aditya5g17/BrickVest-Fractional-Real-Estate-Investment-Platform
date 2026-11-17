import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import toast from "react-hot-toast";
import { marketFeedProperties } from "../data/marketFeed";
import { db } from "../firebase/config";
import { useAuth } from "../hooks/useAuth";

function MarketFeed() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [city, setCity] = useState("All");
  const [type, setType] = useState("All");
  const [savedIds, setSavedIds] = useState([]);
  const [savingId, setSavingId] = useState("");
  const [error, setError] = useState("");

  const cities = useMemo(
    () => ["All", ...new Set(marketFeedProperties.map((property) => property.location.split(",")[0]))],
    []
  );

  const types = useMemo(
    () => ["All", ...new Set(marketFeedProperties.map((property) => property.type))],
    []
  );

  const filteredProperties = marketFeedProperties.filter((property) => {
    const matchesCity = city === "All" || property.location.startsWith(city);
    const matchesType = type === "All" || property.type === type;

    return matchesCity && matchesType;
  });

  const saveForReview = async (property) => {
    if (!currentUser) {
      navigate("/login", { state: { from: { pathname: "/market-feed" } } });
      return;
    }

    if (savedIds.includes(property.id)) return;

    setError("");
    setSavingId(property.id);

    try {
      await addDoc(collection(db, "reviewQueue"), {
        ...property,
        sourceListingId: property.id,
        status: "pending",
        savedBy: currentUser.uid,
        savedByEmail: currentUser.email,
        savedAt: serverTimestamp(),
      });

      setSavedIds((current) => [...current, property.id]);
      toast.success("Saved for admin review.");
    } catch (err) {
      console.error(err);
      toast.error("Save failed.");
      setError("Could not save listing to review queue. Check Firebase permissions.");
    } finally {
      setSavingId("");
    }
  };

  return (
    <div className="page-shell bg-[var(--surface)] text-[var(--navy)]">
      <div className="page-container py-16">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--gold)]">
              Raw Market Feed
            </p>
            <h1 className="text-4xl font-bold">Live Market Opportunities</h1>
            <p className="mt-3 max-w-2xl text-muted">
              This is a demo feed. In the future, this section will fetch live listings from paid APIs or broker feeds.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <select
              value={city}
              onChange={(event) => setCity(event.target.value)}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--navy)] outline-none focus:border-[var(--gold)]"
            >
              {cities.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={type}
              onChange={(event) => setType(event.target.value)}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--navy)] outline-none focus:border-[var(--gold)]"
            >
              {types.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-6 rounded-xl border border-[var(--gold)]/30 bg-[var(--gold-pale)] p-4 text-sm text-[var(--navy)]">
          Market Feed listings are not investment-ready. Review them and publish to Verified Properties.
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-[var(--danger)]/30 bg-[var(--danger)]/10 p-4 text-sm text-[var(--danger)]">
            {error}
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {filteredProperties.map((property) => {
            const isSaved = savedIds.includes(property.id);

            return (
              <div key={property.id} className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
                <img
                  src={property.image}
                  alt={property.title}
                  className="h-56 w-full object-cover"
                />

                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className="rounded-full bg-[var(--gold-pale)] px-3 py-1 text-sm text-[var(--gold)]">
                      {property.type}
                    </span>
                    <span className="text-sm text-muted">{property.source}</span>
                  </div>

                  <h2 className="mb-2 text-xl font-semibold text-[var(--navy)]">{property.title}</h2>
                  <p className="mb-3 text-muted">{property.location}</p>

                  <div className="mb-5 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-lg bg-[var(--cream)] p-3">
                      <p className="text-[var(--navy-mid)]">Price</p>
                      <p className="font-semibold text-[var(--navy)]">Rs.{property.price.toLocaleString()}</p>
                    </div>
                    <div className="rounded-lg bg-[var(--cream)] p-3">
                      <p className="text-[var(--navy-mid)]">Area</p>
                      <p className="font-semibold text-[var(--navy)]">{property.area}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => saveForReview(property)}
                    disabled={savingId === property.id || isSaved}
                    className={`w-full rounded-lg px-4 py-3 font-semibold ${
                      isSaved
                        ? "border border-[var(--success)]/40 bg-[var(--success)]/10 text-[var(--success)]"
                        : "bg-[var(--navy)] text-white hover:bg-[var(--navy-mid)]"
                    }`}
                  >
                    {savingId === property.id ? "Saving..." : isSaved ? "Saved for Review" : "Save for Review"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default MarketFeed;
