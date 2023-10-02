export function expressApiMiddleware (req, res, next) {
    try {
      const { token } = req.headers;
      if (token) {
        req.user = JWT.verify(token);
      } else {
        req.user = {}
      }
      next();
    } catch (error) {
      next(error)
    }
  }