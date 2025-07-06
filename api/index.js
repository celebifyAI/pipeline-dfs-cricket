const express = require("express")
const { generateAllPlayerSalaries } = require("../src/services/salaryGenerator")

const app = express()
app.use(express.json())

// --- API Route ---
app.post("/api/admin/generate-player-salaries", async (req, res) => {
  const { cricinfoMatchUrl } = req.body

  if (!cricinfoMatchUrl) {
    return res.status(400).json({ error: "cricinfoMatchUrl is required" })
  }

  if (!cricinfoMatchUrl.includes("espncricinfo.com")) {
    return res.status(400).json({ error: "A valid espncricinfo.com match URL is required." })
  }

  try {
    console.log(`Generating salaries for match: ${cricinfoMatchUrl}`)
    const salaries = await generateAllPlayerSalaries(cricinfoMatchUrl)
    console.log("Successfully generated salaries.")
    res.status(200).json(salaries)
  } catch (error) {
    console.error("Failed to generate salaries:", error.message)
    res.status(500).json({ error: "Failed to generate player salaries", details: error.message })
  }
})

// Export the app for Vercel
module.exports = app
