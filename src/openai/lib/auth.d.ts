declare let TOKEN: string
declare let EncodingAESKey: string
interface AuthOptions {
    TOKEN: string;
    EncodingAESKey: string;
}
declare function auth(opt: AuthOptions): void;
export { auth, TOKEN, EncodingAESKey }
