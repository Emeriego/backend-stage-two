const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  console.log('Connection to database has been established successfully.');
}).catch(error => {
  console.error('Unable to connect to the database:', error);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// The above code snippet is the entry point of the application. It brings in the app module, which is the Express application, and the sequelize instance from the models folder. It then syncs the database with the models and starts the server on the specified port. If there is an error connecting to the database, it logs the error to the console.
