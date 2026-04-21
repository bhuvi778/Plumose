import jwt from 'jsonwebtoken';

export default function generateToken(id) {
  // JWT_EXPIRES can be a number (seconds) or a valid timespan string like '7d'.
  // Fall back to 7 days in seconds to avoid format errors in jsonwebtoken v9.
  const raw = process.env.JWT_EXPIRES;
  const expiresIn = raw && raw.trim() ? (isNaN(raw) ? raw.trim() : Number(raw)) : 604800;
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn });
}
