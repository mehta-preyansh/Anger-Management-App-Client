export const initialState = {
  user: {
    isAuthenticated: false,
    id: null,
    info: {
      username: null,
      email: null,
      phone: null,
    },
    tokens: {
      accessToken: null,
      refreshToken: null,
      expiresIn: null,
      user_id: null
    },
  },
  events: [],
}