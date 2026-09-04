function missingRequiredMessage(body = {}, fields = []) {
  for (const [field, message] of fields) {
    if (!String(body[field] ?? '').trim()) return message;
  }
  return null;
}

function friendlyValidationMessage(err, fieldMessages = {}) {
  if (err.name !== 'ValidationError') return null;

  const first = Object.values(err.errors)[0];
  if (!first) return 'Please check your details';

  if (first.kind === 'required') {
    return fieldMessages[first.path] || `Please provide ${first.path}`;
  }

  if (first.kind === 'user defined' && first.message) {
    return first.message;
  }

  if (first.kind === 'enum') {
    return fieldMessages[first.path] || 'Please check your details';
  }

  return fieldMessages[first.path] || first.message || 'Please check your details';
}

module.exports = {
  missingRequiredMessage,
  friendlyValidationMessage,
};
