const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// In-memory storage for demo purposes
const users = new Map();
const challenges = new Map();

// Generate random string for challenge
function generateRandomString(length = 32) {
  return require('crypto').randomBytes(length).toString('hex');
}

// Registration options endpoint
app.get('/auth/register-options', (req, res) => {
  const { username } = req.query;
  
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }
  
  // Generate a challenge
  const challenge = generateRandomString();
  challenges.set(username, { challenge, type: 'registration' });
  
  // Return options for registration
  res.json({
    challenge,
    rp: {
      name: 'WebAuthn Demo',
      id: 'localhost'
    },
    user: {
      id: Buffer.from(username).toString('base64url'),
      name: username,
      displayName: username
    },
    pubKeyCredParams: [
      { alg: -7, type: 'public-key' },  // ES256
      { alg: -257, type: 'public-key' } // RS256
    ],
    timeout: 60000,
    attestation: 'none',
    authenticatorSelection: {
      authenticatorAttachment: undefined,
      residentKey: 'preferred',
      userVerification: 'preferred'
    }
  });
});

// Registration verification endpoint
app.post('/auth/register-verify', (req, res) => {
  const { username, credential } = req.body;
  
  if (!username || !credential) {
    return res.status(400).json({ error: 'Username and credential are required' });
  }
  
  // Store the user's credential
  if (!users.has(username)) {
    users.set(username, {
      id: Buffer.from(username).toString('base64url'),
      credentials: []
    });
  } else {
    return res.status(400).json({ error: 'User is already registered' });
  }
  
  const user = users.get(username);
  user.credentials.push({
    id: credential.id,
    publicKey: credential.response.publicKey,
    counter: credential.response.counter
  });
  
  res.json({ verified: true });
});

// Login options endpoint
app.get('/auth/login-options', (req, res) => {
  const { username } = req.query;
  
    // Generate a challenge
  const challenge = generateRandomString();
  
  if (!username) {
    return res.json({
      challenge,
      rpId: 'localhost',
      timeout: 60000,
      allowCredentials: undefined,
      userVerification: 'preferred'
    });
  }
  
  // Check if user exists
  if (!users.has(username)) {
    return res.status(400).json({ error: 'User not found' });
  }
  
  // Generate a challenge
  challenges.set(username, { challenge, type: 'authentication' });
  
  res.json({
    challenge,
    rpId: 'localhost',
    timeout: 60000,
    allowCredentials: users.get(username).credentials.map(cred => ({
      id: cred.id,
      type: 'public-key'
    })),
    userVerification: 'preferred'
  });
});

// Login verification endpoint
app.post('/auth/login-verify', (req, res) => {
  const { username, credential } = req.body;
  
  if (!username || !credential) {
    return res.status(400).json({ error: 'Username and credential are required' });
  }
  
  // In a real app, you would verify the credential against the stored public key
  // For this demo, we'll just check if the user exists
  if (!users.has(username)) {
    return res.status(400).json({ error: 'User not found' });
  }
  
  // Find the credential
  const user = users.get(username);
  const storedCredential = user.credentials.find(cred => cred.id === credential.id);
  
  if (!storedCredential) {
    return res.status(400).json({ error: 'Credential not found' });
  }
  
  // In a real implementation, you would verify the signature here
  // For this demo, we'll just assume it's valid
  
  res.json({ verified: true, username });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});