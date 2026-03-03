# jwt-flow

**jwt-flow** is a library for Node.js that simplifies JWT token management by generating and verifying **Access** and **Refresh** tokens with customizable payloads, expiration, and algorithms — all in a single unified auth flow.  

It supports **HS256** (symmetric) and **RS256** (asymmetric) signing, allowing professional-grade JWT handling for Node.js applications.  

- Fully compatible with **JavaScript** and **TypeScript**  
- TypeScript users get **strongly typed payloads** with generics  
- Works in any Node.js project without additional configuration

## Why Use **jwt-flow**? (Value Proposition)

`jsonwebtoken` already exists, but `jwt-flow` gives you ready-to-use patterns and features that save time and reduce mistakes:

| Feature / Benefit                   | jwt-flow | jsonwebtoken |
|------------------------------------|------------|--------------|
| **Dual Tokens (Access + Refresh)**  | ✅ Built-in | ❌ Manual setup |
| **TypeScript Generics / Typed Payloads** | ✅ Fully typed | ⚠️ Manual / Partial |
| **HS256 & RS256 Support**           | ✅ Ready-to-use | ✅ Only signing, manual patterns |
| **Production-Ready Recommendations**| ✅ Env variables, short/long expiry, RS256 patterns | ❌ Must implement yourself |
| **Module Compatibility**            | ✅ CommonJS + ESM | ✅ Only what you configure |
| **Simple & Clean API**              | ✅ `auth.create()` + `auth.verify()` | ⚠️ Needs multiple calls / custom wrapper |

> **In short:** Save time, avoid boilerplate, and implement secure JWT flows instantly.

## Features

- Generate **Access tokens** and **Refresh tokens** with a single function  
- Support **different secrets or keys** for access & refresh tokens  
- Fully typed with **TypeScript generics** for **payload safety**  
- **Custom payload fields** supported 
- Works with **HS256** and **RS256** algorithms  
- Supports **custom expiration times**  

## Module Compatibility

**jwt-flow** works in **both CommonJS and ES Module projects**:

- **CommonJS:**
```js
const { auth } = require('jwt-flow');
```
- **ES Module:** 
```js
import { auth } from 'jwt-flow';
```

This ensures the library works seamlessly in **any Node.js project**, whether using CommonJS or ES Module syntax.

## Installation

### Note:
- `jsonwebtoken` is a peer dependency, so you need to install it manually.
- This avoids version mismatches and ensures your project uses the correct version.

### Using npm:
```bash
npm install jwt-flow

# Install jsonwebtoken (if not installed)
npm install jsonwebtoken
```

### Using Yarn:
```bash
yarn add jwt-flow
yarn add jsonwebtoken
```

### Using pnpm:
```bash
pnpm add jwt-flow
pnpm add jsonwebtoken
```

## Basic Usage (Single token)

```js
import { auth } from "jwt-flow";

// Create a single access token
const userPayload = { sub: "123", role: "user", email: 'example@gmail.com' };

const token = auth.create({
  accessToken: {
    payload: userPayload,
    secret: 'access token secret',
    expiresIn: "15m", // Token will expire in 15 minutes
    algorithm: "HS256" // Optional (It's default)
  }
});

console.log(token.accessToken);

// Verify the single access token
if (token.accessToken) {
    const verifiedToken = auth.verify({
      accessToken: { 
        token: token.accessToken, 
        secret: 'access token secret' 
      }   
    });

    console.log(verifiedToken.accessToken);
}
```

## Basic Usage (Dual tokens)

```js
import { auth } from "jwt-flow";

// User payload
const userPayload = { sub: "123", role: "user", email: 'example@gmail.com' };

// Create both access and refresh tokens
const tokens = auth.create({
  accessToken: {
    payload: userPayload,
    secret: 'access token secret',
    expiresIn: "15m", // Token will expire in 15 minutes
    algorithm: "HS256" // Optional (default HS256)
  },
  refreshToken: {
    payload: userPayload,
    secret: 'refresh token secret',
    expiresIn: "7d", // Token will expire in 7 days
    algorithm: "HS256" // Optional (default HS256)
  }
});

console.log(tokens.accessToken);
console.log(tokens.refreshToken);

// Verify both tokens
const verifiedTokens = auth.verify({
  accessToken: { 
    token: tokens.accessToken!, 
    secret: 'access token secret' 
  },
  refreshToken: { 
    token: tokens.refreshToken!, 
    secret: 'refresh token secret' 
  }
});

console.log(verifiedTokens.accessToken);
console.log(verifiedTokens.refreshToken);
```

## Algorithm Notes

| Algorithm | Type       | Use Case                                     |
|-----------|-----------|---------------------------------------------|
| HS256     | Symmetric  | Simple apps, single secret for sign & verify |
| RS256     | Asymmetric | Production APIs, private/public key pair     |

- **Default algorithm:** `"HS256"`  
- **RS256:** Requires **private key** for signing and **public key** for verification

## RS256 Example (Advanced)

### Generate RSA Keys (Manually):
```bash
openssl genrsa -out private.key 2048

openssl rsa -in private.key -pubout -out public.key
```

- private.key → Used for signing tokens
- public.key → Used for verifying tokens
- ⚠️ Never commit private.key to GitHub

### Usage Example:

```js
import fs from "fs";
import { auth } from "jwt-flow";

// Load keys
const PRIVATE_KEY = fs.readFileSync('./private.key', 'utf-8');
const PUBLIC_KEY = fs.readFileSync('./public.key', 'utf-8');

const tokens = auth.create({
  accessToken: {
    payload: { sub: "123", role: "admin" },
    secret: PRIVATE_KEY,
    expiresIn: "15m",
    algorithm: "RS256"
  },
  refreshToken: {
    payload: { sub: "123", role: "admin" },
    secret: PRIVATE_KEY,
    expiresIn: "7d",
    algorithm: "RS256"
  }
});

console.log(tokens.accessToken);
console.log(tokens.refreshToken);

// Verify using public key
const verified = auth.verify({
  accessToken: { 
    token: tokens.accessToken!, 
    secret: PUBLIC_KEY,
    algorithms: ["RS256"]
  },
  refreshToken: { 
    token: tokens.refreshToken!, 
    secret: PUBLIC_KEY,
    algorithms: ["RS256"]
  }
});

console.log(verified.accessToken);
console.log(verified.refreshToken);
```

## Production Recommendation

Instead of loading keys from files, use `environment variables` to keep your private keys secure:

```js
const PRIVATE_KEY = process.env.PRIVATE_KEY!;
const PUBLIC_KEY = process.env.PUBLIC_KEY!;
```

## TypeScript Generics Example

```ts
import { auth } from "jwt-flow";

// Define your payload type
interface UserPayload {
  sub: string;
  role: "user" | "admin";
  email: string;
}

// Create an access token with typed payload
const token = auth.create<UserPayload>({
  accessToken: {
    payload: {
      sub: "123",
      role: "admin",
      email: "admin@example.com",
    },
    secret: "my-secret",
    expiresIn: "15m" // Token will expire in 15 minutes
  }
});

console.log(token.accessToken);

// Verify the typed token
const verified = auth.verify<UserPayload>({
  accessToken: { 
    token: token.accessToken!, 
    secret: "my-secret" 
  }
});

console.log(verified.accessToken);
```

## Notes & Tips

- Always keep your **secrets and private keys safe**.  
- Use **short expiration** for access tokens and **longer** for refresh tokens.  
- For TypeScript users, the payload is **fully typed** — generics ensure type safety.  
- `auth.create()` and `auth.verify()` are synchronous. No `async/await` needed unless you implement RS256 async methods.  

## Author
- Sejin Ahmed – [GitHub: mern-sejin2010](https://github.com/mern-sejin2010)

## License

This package is licensed under the ISC License
 
Copyright © 2026, Jupiter Programmer