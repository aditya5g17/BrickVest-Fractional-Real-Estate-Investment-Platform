
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const riskLabels = { low: "Low", medium: "Medium", high: "High" };
const goalLabels = { income: "Monthly Income", growth: "Growth", balanced: "Balanced" };

function Profile() {
  const { currentUser, userProfile, isAdmin, isOnboardingComplete } = useAuth();

  return (
    <div className="page-shell bg-[var(--surface)] text-[var(--navy)]">
      <div className="page-container py-16">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold">Profile</h1>

          <div className="card p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--gold-pale)] text-2xl font-bold text-[var(--gold)]">
                {(currentUser?.displayName || currentUser?.email || "U").charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-semibold text-[var(--navy)]">
                    {currentUser?.displayName || userProfile?.name || "BrickVest Investor"}
                  </h2>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isAdmin ? "bg-[var(--navy)]/10 text-[var(--navy)]" : "bg-[var(--border)] text-[var(--navy)]"}`}>
                    {isAdmin ? "Admin" : "Investor"}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      isOnboardingComplete
                        ? "bg-[var(--success)]/10 text-[var(--success)]"
                        : "bg-[var(--gold)]/10 text-[var(--gold)]"
                    }`}
                  >
                    {isOnboardingComplete ? "Active" : "Setup Pending"}
                  </span>
                </div>
                <p className="text-muted">{currentUser?.email}</p>
                {userProfile?.phone && (
                  <p className="text-sm text-muted">Phone: {userProfile.phone}</p>
                )}
              </div>
            </div>
          </div>

          {!isOnboardingComplete && !isAdmin && (
            <div className="rounded-xl border border-[var(--gold)]/30 bg-[var(--gold-pale)] p-5">
              <p className="mb-3 text-[var(--navy)]">
                Your account is not complete yet. Finish onboarding before you invest.
              </p>
              <Link
                to="/onboarding"
                className="inline-flex rounded-lg bg-[var(--navy)] px-4 py-2 font-semibold text-white hover:bg-[var(--navy-mid)]"
              >
                Continue Setup
              </Link>
            </div>
          )}

          {isOnboardingComplete && !isAdmin && (
            <div className="card p-6">
              <h3 className="mb-4 text-lg font-semibold text-[var(--navy)]">Investor Profile</h3>
              <dl className="grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-[var(--navy-mid)]">KYC</dt>
                  <dd
                    className={`font-medium ${
                      userProfile?.kycStatus === "verified" || userProfile?.kycStatus === "verified_demo"
                        ? "text-[var(--success)]"
                        : userProfile?.kycStatus === "pending_review"
                          ? "text-[var(--gold)]"
                          : userProfile?.kycStatus === "rejected"
                            ? "text-[var(--danger)]"
                            : "text-[var(--navy)]"
                    }`}
                  >
                    {userProfile?.kycStatus === "verified" || userProfile?.kycStatus === "verified_demo"
                      ? "Verified (demo)"
                      : userProfile?.kycStatus === "pending_review"
                        ? "Pending admin review"
                        : userProfile?.kycStatus === "rejected"
                          ? `Rejected${userProfile?.kycRejectReason ? `: ${userProfile.kycRejectReason}` : ""}`
                          : userProfile?.kycStatus || "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-[var(--navy-mid)]">Bank</dt>
                  <dd className="font-medium text-[var(--navy)]">
                    {userProfile?.bankVerified
                      ? userProfile?.bankAccountMasked || "Linked"
                      : "Not linked"}
                  </dd>
                </div>
                <div>
                  <dt className="text-[var(--navy-mid)]">Risk</dt>
                  <dd className="font-medium text-[var(--navy)]">{riskLabels[userProfile?.riskProfile] || "—"}</dd>
                </div>
                <div>
                  <dt className="text-[var(--navy-mid)]">Goal</dt>
                  <dd className="font-medium text-[var(--navy)]">{goalLabels[userProfile?.investmentGoal] || "—"}</dd>
                </div>
                <div>
                  <dt className="text-[var(--navy-mid)]">Preferred city</dt>
                  <dd className="font-medium text-[var(--navy)]">{userProfile?.preferredCity || "Any"}</dd>
                </div>
                <div>
                  <dt className="text-[var(--navy-mid)]">Budget / share</dt>
                  <dd className="font-medium text-[var(--navy)]">{userProfile?.budgetRange || "all"}</dd>
                </div>
                <div>
                  <dt className="text-[var(--navy-mid)]">Horizon</dt>
                  <dd className="font-medium capitalize text-[var(--navy)]">{userProfile?.investmentHorizon || "medium"}</dd>
                </div>
              </dl>
              <Link
                to="/recommendations"
                className="mt-4 inline-flex text-sm text-[var(--gold)] hover:text-[var(--gold-light)]"
              >
                View personalized recommendations →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
