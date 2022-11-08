// Import Dependencies
const dotenv = require("dotenv");
const supertokens = require("supertokens-node");
const Dashboard = require("supertokens-node/recipe/dashboard");
const Session = require("supertokens-node/recipe/session");
const Passwordless = require("supertokens-node/recipe/passwordless");

// Utilize environment variables
dotenv.config();

// SuperTokens
const {
  CORE_CONNECTION_URI,
  CORE_API_KEY,
  API_BASE_URL,
  DASHBOARD_BASE_URL
} = process.env;
supertokens.init({
    framework: "express",
    supertokens: {
      connectionURI: CORE_CONNECTION_URI,
      apiKey: CORE_API_KEY
  },
    appInfo: {
        appName: "Cathy Admin Dashboard",
        apiDomain: API_BASE_URL,
        websiteDomain: DASHBOARD_BASE_URL,
        apiBasePath: "/auth",
        websiteBasePath: "/login"
    },
    recipeList: [
        Dashboard.init({
          apiKey: CORE_API_KEY
        }),
        Passwordless.init({
            flowType: "MAGIC_LINK",
            contactMethod: "EMAIL"
        }),
        Session.init() // initializes session features
    ]
});

// Import app and define port to run server
const app = require('./app')
const { PORT = 5000 } = process.env;

// Define and run listener
const listener = () => console.log(`Server running on Port ${PORT}!`);
app.listen(PORT, listener);
