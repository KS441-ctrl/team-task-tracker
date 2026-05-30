const VALID_TRANSITIONS = {
  TODO: ['IN_PROGRESS', 'BLOCKED'],
  IN_PROGRESS: ['IN_REVIEW', 'BLOCKED'],
  IN_REVIEW: ['DONE', 'BLOCKED'],
  DONE: ['BLOCKED'],
  BLOCKED: ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE']
};

const canTransition = (from, to) => {
  return VALID_TRANSITIONS[from] && VALID_TRANSITIONS[from].includes(to);
};

module.exports = { canTransition, VALID_TRANSITIONS };
