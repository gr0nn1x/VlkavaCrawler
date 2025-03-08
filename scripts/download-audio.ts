import fs from "fs"
import path from "path"
import https from "https"

// Define the audio files and their URLs
const audioFiles = [
  {
    name: "attack.mp3",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attack-fRn3s2aYOPVFjBtk85HeoaaU2HyzFZ.mp3",
  },
  {
    name: "itemPickup.mp3",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/itemPickup-jo8egHgut7AQGMfEtLqWb0qRy36evV.mp3",
  },
  {
    name: "buttonClick.mp3",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/buttonClick-WB4JnXOwCMYMmO6KJY4oE2nuZ8uxWg.mp3",
  },
  {
    name: "damage.mp3",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/damage-EmlShtH6JTVL1lva3Un85CEr5h7QKi.mp3",
  },
  {
    name: "enemyDefeat.mp3",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/enemyDefeat-IQK6vHuGfVKnXTuIz3Hzzfh3pBLfWc.mp3",
  },
  {
    name: "itemEquip.mp3",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/itemEquip-YyhCXZGHQs0xg9p5zW9mKzoXkiSaTh.mp3",
  },
  {
    name: "flee.mp3",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/flee-k80UPmgv1MplAfTXs3Z33RJVbuKh6c.mp3",
  },
  {
    name: "background-music.mp3",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/background-music-7xzHUKvhkfqodKNB1SS1dVMOXf9oPs.mp3",
  },
  {
    name: "levelUp.mp3",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/levelUp-Hn4ASunp0zONVgwIB5EGTQCWId6gyq.mp3",
  },
  {
    name: "battle-music.mp3",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/battle-music-G7UoQd1LsW8pq1phLoKSCoVFplo9Bh.mp3",
  },
  // Add openChest.mp3 and spell.mp3 which are missing from the list
  {
    name: "openChest.mp3",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attack-fRn3s2aYOPVFjBtk85HeoaaU2HyzFZ.mp3",
  }, // Using attack.mp3 as a placeholder
  {
    name: "spell.mp3",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/levelUp-Hn4ASunp0zONVgwIB5EGTQCWId6gyq.mp3",
  }, // Using levelUp.mp3 as a placeholder
]

// Create the audio directory if it doesn't exist
const audioDir = path.join(process.cwd(), "public", "audio")
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true })
  console.log(`Created directory: ${audioDir}`)
}

// Function to download a file
function downloadFile(url: string, destination: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination)

    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download ${url}: ${response.statusCode}`))
          return
        }

        response.pipe(file)

        file.on("finish", () => {
          file.close()
          resolve()
        })
      })
      .on("error", (err) => {
        fs.unlink(destination, () => {}) // Delete the file if there was an error
        reject(err)
      })
  })
}

// Download all audio files
async function downloadAllFiles() {
  console.log("Starting download of audio files...")

  for (const file of audioFiles) {
    const filePath = path.join(audioDir, file.name)
    try {
      console.log(`Downloading ${file.name}...`)
      await downloadFile(file.url, filePath)
      console.log(`✅ Downloaded ${file.name}`)
    } catch (error) {
      console.error(`❌ Error downloading ${file.name}:`, error)
    }
  }

  console.log("All downloads completed!")
}

// Run the download function
downloadAllFiles()

