const app = require("./app");
const path = require("path");

app.use(express.static(path.join(__dirname, "../frontend")));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});