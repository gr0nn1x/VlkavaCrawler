import fs from "fs"
import path from "path"

// Create the audio directory if it doesn't exist
const audioDir = path.join(process.cwd(), "public", "audio")
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true })
  console.log(`Created directory: ${audioDir}`)
} else {
  console.log(`Directory already exists: ${audioDir}`)
}

console.log("You can now manually download the audio files and place them in this directory.")

