export const initialState = {
  user: {
    isAuthenticated: false,
    info: {
      username: null,
      email: null,
      phone: null,
    },
    tokens: {
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
    },
  },
  events: [],
}