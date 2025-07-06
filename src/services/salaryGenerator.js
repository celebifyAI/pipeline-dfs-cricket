const salaryConfig = require("../config/salaryConfig.json")
const axios = require("axios")
const cheerio = require("cheerio")

// --- Dummy Player Data (Source of Truth for now) ---
const dummyPlayers = [
  { _id: "player1", name: "Virat Kohli", baseSalary: 50000 },
  { _id: "player2", name: "Rohit Sharma", baseSalary: 48000 },
  { _id: "player3", name: "Jasprit Bumrah", baseSalary: 45000 },
  { _id: "player4", name: "Pat Cummins", baseSalary: 46000 },
  { _id: "player5", name: "Steve Smith", baseSalary: 42000 },
  { _id: "player6", name: "Travis Head", baseSalary: 40000 },
]

const scrapeCricinfoScorecard = async (cricinfoMatchUrl) => {
  try {
    const { data } = await axios.get(cricinfoMatchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    })
    const $ = cheerio.load(data)
    const playersData = []

    // IMPORTANT: Cricinfo's HTML structure changes often. These selectors
    // are examples and will likely need to be updated by inspecting the
    // live scorecard page in your browser's developer tools.
    $("div.ds-p-0 > div > table.ds-table > tbody > tr").each((index, element) => {
      const playerNameEl = $(element).find("td:nth-child(1) a span")
      const playerName = playerNameEl
        .text()
        .trim()
        .replace(/\s*$$c$$\s*|\s*†\s*/g, "") // Clean up name

      const runs = $(element).find("td:nth-child(3)").text().trim()
      const balls = $(element).find("td:nth-child(4)").text().trim()
      const fours = $(element).find("td:nth-child(6)").text().trim()
      const sixes = $(element).find("td:nth-child(7)").text().trim()
      const strikeRate = $(element).find("td:nth-child(8)").text().trim()

      if (playerName && $(element).find("td.ds-text-right").length > 0) {
        playersData.push({
          name: playerName,
          runs: Number.parseInt(runs) || 0,
          balls: Number.parseInt(balls) || 0,
          fours: Number.parseInt(fours) || 0,
          sixes: Number.parseInt(sixes) || 0,
          strikeRate: Number.parseFloat(strikeRate) || 0.0,
        })
      }
    })

    if (playersData.length === 0) {
      throw new Error("Could not find any player data. The scraper selectors may be outdated.")
    }

    return playersData
  } catch (error) {
    console.error("Error scraping Cricinfo data:", error.message)
    throw new Error("Could not fetch or parse player data from Cricinfo.")
  }
}

const calculatePlayerSalary = (player, matchPerformance) => {
  // Find the player's performance from the scraped data.
  const playerData = matchPerformance.find((p) => player.name.includes(p.name) || p.name.includes(player.name))

  if (!playerData) {
    return { finalSalary: player.baseSalary, performance: null } // Return base salary if player didn't bat
  }

  let performanceBonus = 0
  performanceBonus += playerData.runs * salaryConfig.weights.runs
  performanceBonus += playerData.fours * salaryConfig.weights.fours
  performanceBonus += playerData.sixes * salaryConfig.weights.sixes

  if (playerData.runs >= 100) {
    performanceBonus += salaryConfig.bonuses.century
  } else if (playerData.runs >= 50) {
    performanceBonus += salaryConfig.bonuses.halfCentury
  }

  const finalSalary = player.baseSalary + performanceBonus

  return { finalSalary, performance: playerData }
}

const generateAllPlayerSalaries = async (cricinfoMatchUrl) => {
  const players = dummyPlayers
  const salaryResults = []

  const matchPerformance = await scrapeCricinfoScorecard(cricinfoMatchUrl)

  for (const player of players) {
    try {
      const { finalSalary, performance } = calculatePlayerSalary(player, matchPerformance)
      salaryResults.push({
        playerId: player._id,
        playerName: player.name,
        baseSalary: player.baseSalary,
        performance,
        finalSalary,
      })
    } catch (error) {
      salaryResults.push({
        playerId: player._id,
        playerName: player.name,
        error: error.message,
      })
    }
  }
  return salaryResults
}

module.exports = {
  generateAllPlayerSalaries,
}
