require('dotenv').config();

const path = require('node:path');
const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const methodOverride = require('method-override');

const db = require('./models');
const currentUser = require('./middleware/currentUser');
const ensureAuth = require('./middleware/ensureAuth');
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories');
const employeeRoutes = require('./routes/employees');
const assetRoutes = require('./routes/assets');
const stockRoutes = require('./routes/stock');
const issueRoutes = require('./routes/issue');
const returnRoutes = require('./routes/return');
const scrapRoutes = require('./routes/scrap');

const app = express();
app.disable('x-powered-by');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionStore = new SequelizeStore({ db: db.sequelize });

app.use(session({
  secret: process.env.SESSION_SECRET,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 },
}));
sessionStore.sync();

app.use(currentUser);
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

app.use('/', authRoutes);
app.use('/categories', ensureAuth, categoryRoutes);
app.use('/employees', ensureAuth, employeeRoutes);
app.use('/assets', ensureAuth, assetRoutes);
app.use('/stock', ensureAuth, stockRoutes);
app.use('/issue-asset', ensureAuth, issueRoutes);
app.use('/return-asset', ensureAuth, returnRoutes);
app.use('/scrap-asset', ensureAuth, scrapRoutes);

app.get('/', ensureAuth, (req, res) => {
  res.redirect('/categories');
});

app.use((req, res) => {
  res.status(404).render('errors/404', { title: 'Not found' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Asset Management app listening on port ${port}`);
});
