const World = {
  // Ελέγχει αν η φάση του χρήστη επιτρέπει την ψηφοφορία
  canVote(phase) { 
    return phase >= 2; // Χρειάζεται login (1) και ομάδα (2)
  },

  // Ο κεντρικός πίνακας αμοιβών XP
  xpFor(action) {
    const rewards = {
      VOTE_PLAYER: 5,
      H2H_VOTE: 8,
      ONBOARDING_COMPLETE: 20
    };
    return rewards[action] || 0;
  }
};