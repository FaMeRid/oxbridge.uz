const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// ━━━ AUTH ROUTES ━━━

// Student Register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    const { data, error } = await supabase
      .from("users")
      .insert([{ email, password, name, role: "student" }])
      .select();

    if (error) return res.status(400).json({ error: error.message });
    res.json({ user: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Student Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("password", password)
      .single();

    if (error) return res.status(400).json({ error: "Invalid credentials" });
    res.json({ user: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ━━━ TESTS ROUTES ━━━

// Get all tests
app.get("/api/tests", async (req, res) => {
  try {
    const { data, error } = await supabase.from("tests").select("*");
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create test (admin only)
app.post("/api/tests", async (req, res) => {
  try {
    const { name, skill, parts } = req.body;
    const { data, error } = await supabase
      .from("tests")
      .insert([{ name, skill, parts }])
      .select();

    if (error) return res.status(400).json({ error: error.message });
    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ━━━ SUBMISSIONS ROUTES ━━━

// Submit answer
app.post("/api/submissions", async (req, res) => {
  try {
    const { user_id, test_id, skill, answers } = req.body;
    
    const { data, error } = await supabase
      .from("submissions")
      .insert([{ user_id, test_id, skill, answers }])
      .select();

    if (error) return res.status(400).json({ error: error.message });
    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user submissions
app.get("/api/submissions/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .eq("user_id", user_id);

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Teacher grades submission
app.patch("/api/submissions/:id/grade", async (req, res) => {
  try {
    const { id } = req.params;
    const { score, feedback, teacher_id } = req.body;

    const { data, error } = await supabase
      .from("submissions")
      .update({ score, feedback, teacher_id })
      .eq("id", id)
      .select();

    if (error) return res.status(400).json({ error: error.message });
    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ━━━ START SERVER ━━━

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});