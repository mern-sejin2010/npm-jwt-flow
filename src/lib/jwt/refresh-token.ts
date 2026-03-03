import jwt, { 
    type Algorithm, 
    type Secret, 
    type SignOptions 
} from 'jsonwebtoken';
// interfaces
export interface BaseRefreshTokenPayload {
    sub: string;
    role?: string;
    email?: string;
};
export type RefreshTokenPayload<T extends object = {}> = BaseRefreshTokenPayload & T;
// access token options
export interface RefreshTokenOptions<T extends object = {}> {
    payload: RefreshTokenPayload<T>;
    secret: Secret;
    expiresIn?: `${number}${"s" | "m" | "h" | "d" | "w"}`;
    algorithm?: Algorithm;
};
// generate refresh token
export function generateRefreshToken<T extends object = {}> (
    payload: RefreshTokenPayload<T>,
    secret: Secret,
    expiresIn: `${number}${"s" | "m" | "h" | "d" | "w"}` = '7d',
    algorithm: Algorithm = 'HS256',
): string {
    const options: SignOptions = { expiresIn, algorithm };
    return jwt.sign(payload, secret, options);
};
// verify refresh token
export function verifyRefreshToken<T extends object = {}> (
    token: string,
    secret: Secret, 
    algorithms: Algorithm[] = ['HS256'],
): RefreshTokenPayload<T> | null {
    try {
        const decoded = jwt.verify(token, secret, { algorithms });
        if (typeof decoded === 'object' && decoded !== null) {
            return decoded as RefreshTokenPayload<T>;
        }
        return null;
    } catch (error) {
        return null;
    }
};