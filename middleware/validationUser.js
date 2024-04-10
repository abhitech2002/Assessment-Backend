const validateUser = (req, res, next) => {
  const { email, password, userName } = req.body;

  if (!email || !password || !userName) {
    return res
      .status(400)
      .json({ message: "Email, password, and username are required" });
  }

  // Check email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  // Check password length
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });
  }
  next();
};

export { validateUser };
