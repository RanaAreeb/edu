export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // In a real application, you might want to invalidate sessions or tokens here
    return res.status(200).json({ message: 'Successfully signed out' });
  } catch (error) {
    console.error('Signout error:', error);
    return res.status(500).json({ message: 'An error occurred during sign out' });
  }
} 