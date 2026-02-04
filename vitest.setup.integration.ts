import fs from "fs";
import path from "path";

// Load environment variables for integration tests
const envPath = path.resolve(__dirname, ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  const lines = envContent.split("\n");
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, ...rest] = trimmed.split("=");
      if (key) {
        process.env[key] = rest.join("=");
      }
    }
  });
}
