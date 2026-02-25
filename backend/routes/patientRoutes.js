router.get("/dashboard", protect, roleMiddleware(["patient"]), (req, res) => {
  res.json({ message: "Patient Dashboard" });
});
