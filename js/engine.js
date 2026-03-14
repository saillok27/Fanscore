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
    if (action === 'H2H_VOTE') {
      console.warn('[Engine] H2H_VOTE is disabled. No action taken.');
      return { ok: false, reason: 'H2H_DISABLED' };
    }

    // ── VOTE_PLAYER ──────────────────────────────────────────
    if (action === 'VOTE_PLAYER') {
      const {
        playerId,
        score,
        matchId       = null,
        exposureLevel = null,
        attributeTag  = null,
        confidence    = null,
        biasDeclared  = null
      } = payload;

      if (!playerId || score === undefined) {
        return { ok: false, reason: 'INVALID_PAYLOAD' };
      }

      // Build RPC params — only include optional fields if provided.
      // cast_vote() uses DEFAULT NULL + COALESCE, so omitting preserves existing values.
      const rpcParams = { p_player_id: playerId, p_score: score };
      if (matchId       !== null) rpcParams.p_match_id       = matchId;
      if (exposureLevel !== null) rpcParams.p_exposure_level = exposureLevel;
      if (attributeTag  !== null) rpcParams.p_attribute_tag  = attributeTag;
      if (confidence    !== null) rpcParams.p_confidence     = confidence;
      if (biasDeclared  !== null) rpcParams.p_bias_declared  = biasDeclared;

      const { data, error } = await Engine.db.rpc('cast_vote', rpcParams);

      if (error) {
        console.error('❌ cast_vote error:', error.message);
        return { ok: false, reason: error.message };
      }

      return data;
    }

    return { ok: false, reason: 'UNKNOWN_ACTION' };
  }
};