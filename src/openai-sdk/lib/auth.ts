let TOKEN = ''
let EncodingAESKey = ''

interface AuthOptions {
  TOKEN: string;
  EncodingAESKey: string;
}

function auth (opt: AuthOptions) {
  TOKEN = opt.TOKEN
  EncodingAESKey = opt.EncodingAESKey
}

export { auth, TOKEN, EncodingAESKey }
