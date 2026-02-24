const Engine = {
  async dispatch(action, payload = {}) {
    const phase = State.phase();

    // 🔒 Δικαιώματα ψήφου
    if (action === "VOTE_PLAYER" || action === "H2H_VOTE") {
      if (!World.canVote(phase)) {
        console.error("❌ Δεν επιτρέπεται vote. Phase:", phase);
        return { ok: false, reason: "PHASE_LOCKED" };
      }
    }

    // 🎁 XP υπολογισμός
    const xp = World.xpFor(action);

    // 💾 XP persistence (Engine owns it)
    if (xp > 0 && State.user) {
      const newXP = (State.profile?.xp || 0) + xp;

      const { error } = await db
        .from('profiles')
        .update({ xp: newXP })
        .eq('id', State.user.id);

      if (!error && State.profile) {
        State.profile.xp = newXP;
      }
    }

    return {
      ok: true,
      xp
    };
  }
};