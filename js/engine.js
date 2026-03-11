const Engine = {

  // db inject από index.html αμέσως μετά το createClient()
  db: null,

  async dispatch(action, payload = {}) {

    // 🛡️ Guard #1 — db not injected
    if (!Engine.db) {
      throw new Error('[Engine] db not initialized. Call Engine.db = db before dispatch.');
    }

    // 🛡️ Guard #2 — user not authenticated
    if (!State.user) {
      console.error('[Engine] dispatch called without authenticated user.');
      return { ok: false, reason: 'NOT_AUTHENTICATED' };
    }

    const phase = State.phase();

    // 🔒 Έλεγχος δικαιωμάτων ψήφου
    if (action === 'VOTE_PLAYER') {
      if (!World.canVote(phase)) {
        console.error('❌ Δεν επιτρέπεται vote. Phase:', phase);
        return { ok: false, reason: 'PHASE_LOCKED' };
      }
    }

    // ── H2H_VOTE — DISABLED ──────────────────────────────────
    // H2H moved to future game environment.
    // Engine will not process H2H_VOTE. No writes. No XP.
    if (action === 'H2H_VOTE') {
      console.warn('[Engine] H2H_VOTE is disabled. No action taken.');
      return { ok: false, reason: 'H2H_DISABLED' };
    }

    // ── VOTE_PLAYER ──────────────────────────────────────────
    if (action === 'VOTE_PLAYER') {
      const { playerId, score } = payload;

      if (!playerId || score === undefined) {
        return { ok: false, reason: 'INVALID_PAYLOAD' };
      }

      const { data, error } = await Engine.db
        .rpc('cast_vote', {
          p_player_id: playerId,
          p_score: score
        });

      if (error) {
        console.error('❌ cast_vote error:', error.message);
        return { ok: false, reason: error.message };
      }

      return data;
    }

    return { ok: false, reason: 'UNKNOWN_ACTION' };
  }
};