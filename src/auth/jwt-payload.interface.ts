export interface JwtPayload {
    readonly sub: string;
    readonly iat: number;
    readonly exp: number;
}