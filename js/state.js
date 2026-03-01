const State = {
  user: null,
  profile: null,

  phase() {
    if (!this.user) return 0;                    // Phase 0: όχι login
    if (!this.profile?.fav_team_id) return 1;    // Phase 1: login, χωρίς ομάδα
    return 2;                                    // Phase 2: login + ομάδα
  }
};

// ── Σημείωση αρχιτεκτονικής ─────────────────────────────────
// State.user  → set από index.html μετά από κάθε login/logout
// State.profile → set από index.html μετά από loadProfile()
// Το State δεν περιέχει UI logic. Δεν αναφέρεται σε DOM.
// ─────────────────────────────────────────────────────────────