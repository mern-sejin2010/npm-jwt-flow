import jwt, { 
    type Algorithm, 
    type Secret, 
    type SignOptions 
} from 'jsonwebtoken';
// interfaces
export interface BaseAccessTokenPayload {
    sub: string;
    role?: string;
    email?: string;
};
export type AccessTokenPayload<T extends object = {}> = BaseAccessTokenPayload & T;
// access token options
export interface AccessTokenOptions<T extends object = {}> {
    payload: AccessTokenPayload<T>;
    secret: Secret;
    expiresIn?: `${number}${"s" | "m" | "h" | "d" | "w"}`;
    algorithm?: Algorithm;
};
// generate access token
export function generateAccessToken<T extends object = {}> (
    payload: AccessTokenPayload<T>,
    secret: Secret,
    expiresIn: `${number}${"s" | "m" | "h" | "d" | "w"}` = '15m',
    algorithm: Algorithm = 'HS256',
): string {
    const options: SignOptions = { expiresIn, algorithm };
    return jwt.sign(payload, secret, options);
};
// verify access token
export function verifyAccessToken<T extends object = {}> (
    token: string,
    secret: Secret, 
    algorithms: Algorithm[] = ['HS256'],
): AccessTokenPayload<T> | null {
    try {
        const decoded = jwt.verify(token, secret, { algorithms });
        if (typeof decoded === 'object' && decoded !== null) {
            return decoded as AccessTokenPayload<T>;
        }
        return null;
    } catch (error) {
        return null;
    }
};