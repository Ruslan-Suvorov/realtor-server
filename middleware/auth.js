import jwt from "jsonwebtoken";

const secret = "test";

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const isCustomAuth = token.length < 500;
    let decodedData = jwt.decode(token);
    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, secret);
      req.userId = decodedData?.id;
    } else {
      console.log("User isn`t authentificated");
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

export default auth;
