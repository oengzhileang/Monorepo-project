import app from "@/src/app";
import connectToMongoDB from "@/src/database/connectDB";
import configs from "./config";

async function run() {
  try {
    await connectToMongoDB();
    app.listen(configs.port, () => {
      console.log(
        `Products-service is running on http://localhost:${configs.port}/`
      );
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

run();
