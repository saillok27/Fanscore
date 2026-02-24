const State = {
  user: null,
  profile: null,

  phase() {
    if (!this.user) return 0;                 // όχι login
    if (!this.profile?.favorite_team) return 1; // login, χωρίς ομάδα
    return 2;                                 // login + ομάδα
  }
};
// ===============================
// NICKNAME
// ===============================

function submitNickname() {
  const input = document.getElementById('nicknameInput');
  const errorEl = document.getElementById('nicknameError');

  if (!input) return;

  const nickname = input.value.trim();

  // regex: μικρά γράμματα, _, 3 αριθμοί στο τέλος
  const regex = /^[a-z][a-z_]{1,16}[0-9]{0,3}$/;

  if (!regex.test(nickname)) {
    errorEl.textContent =
      'Μόνο μικρά γράμματα, "_" και έως 3 αριθμοί στο τέλος';
    return;
  }

  errorEl.textContent = '';

  console.log('✅ Nickname OK:', nickname);

  // ΠΡΟΣΩΡΙΝΑ (μέχρι DB)
  State.profile.nickname = nickname;

  // κλείσε nickname screen
  document.getElementById('nicknameScreen').style.display = 'none';

  // άνοιξε onboard (ομάδα)
  document.getElementById('onboardScreen').style.display = 'block';
}