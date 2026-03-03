import type { Algorithm, Secret } from "jsonwebtoken";
import { 
    generateAccessToken, 
    verifyAccessToken, 
    type AccessTokenOptions, 
    type AccessTokenPayload 
} from "./lib/jwt/access-token.js";
import { 
    generateRefreshToken, 
    verifyRefreshToken, 
    type RefreshTokenOptions, 
    type RefreshTokenPayload 
} from "./lib/jwt/refresh-token.js";
// interfaces
// create token options
export interface CreateTokenOptions<T extends object = {}> {
    accessToken?: AccessTokenOptions<T>;
    refreshToken?: RefreshTokenOptions<T>;
};
// verify token options
export interface VerifySingleTokenOptions {
    token: string;
    secret: Secret;
    algorithms?: Algorithm[];
};
export interface VerifyTokenOptions {
    accessToken?: VerifySingleTokenOptions;
    refreshToken?: VerifySingleTokenOptions;
};
export interface VerifiedTokens<T extends object = {}> {
    accessToken?: AccessTokenPayload<T> | null;
    refreshToken?: RefreshTokenPayload<T> | null;
};
// create and verify tokens
export const auth = {
    create<T extends object = {}>(
        options: CreateTokenOptions<T>, 
    ) {
        const result: { accessToken?: string; refreshToken?: string } = {};
        if (options.accessToken) {
            const { payload, secret, expiresIn, algorithm } = options.accessToken;
            result.accessToken = generateAccessToken(payload, secret, expiresIn, algorithm);
        }
        if (options.refreshToken) {
            const { payload, secret, expiresIn, algorithm } = options.refreshToken;
            result.refreshToken = generateRefreshToken(payload, secret, expiresIn, algorithm);
        }
        return result;
    },
    verify<T extends object = {}>(
        options: VerifyTokenOptions,
    ): VerifiedTokens<T> {
        const { accessToken, refreshToken } = options;
        const result: VerifiedTokens<T> = {};
        if (accessToken) {
            const { token, secret, algorithms } = accessToken;
            result.accessToken = verifyAccessToken<T>(token, secret, algorithms);
        }
        if (refreshToken) {
            const { token, secret, algorithms } = refreshToken;
            result.refreshToken = verifyRefreshToken<T>(token, secret, algorithms);
        }
        return result;
    }
};