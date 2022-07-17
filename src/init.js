import "dotenv/config";
import "./db";
import app from "./server";

const PORT = 8800;

const handleListener = () => {
  console.log(`✅ Server listenting on port http://localhost:${PORT} 🚀`);
};

app.listen(PORT, handleListener);
