# DC Shopping List Api

Complementary API to [dc-shopping-list](https://github.com/sukcinitas/dc-shopping-list) app which you can try out [here](https://shlist.netlify.app/).
Note: I hosted this on Heroku, however SQLite is bad fit for Heroku as its database file is stored on disk. Heroku filesystem's content is cleared periodically, so one cannot expect for the changes to be kept for long. I may use another RDMS in the future.

---

## Built with

- Express 4
- Axios
- sqlite3

##### Compiling

- Babel 7

---

## Setup

- Clone this repository - `git clone https://github.com/sukcinitas/dc-shopping-list-api.git`, install dependencies `cd dc-shopping-list-api`, `npm install` (you will need `npm` and `node` installed globally);

  - `npm start` - to run the app
  - `npm run dev` - to run the app on [localhost:8000](http://localhost:8080/) using nodemon

---

## Notes

- Implement user registration and authentication. Now all requests belong to default user.
