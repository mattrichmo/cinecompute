import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs';
import readline from 'readline';

function generateCustomId(prefix) {
  const randomNumber = Math.floor(100000000 + Math.random() * 900000000);
  return `${prefix}${randomNumber}`;
}

async function createTables(db) {
  await db.exec(`CREATE TABLE IF NOT EXISTS Films (
  film_id TEXT PRIMARY KEY,
  title TEXT,
  imdb_id TEXT UNIQUE,
  budget TEXT,
  gross_us_canada TEXT,
  gross_world TEXT,
  release_date TEXT,
  release_year INTEGER,
  type TEXT
);

-- Add indexes for frequently queried columns
CREATE INDEX idx_films_title ON Films(title);
CREATE INDEX idx_films_imdb_id ON Films(imdb_id);

CREATE TABLE IF NOT EXISTS BoxOffice (
  film_id TEXT,
  opening_weekend TEXT,
  gross_us_canada TEXT,
  gross_world TEXT,
  release_date TEXT,
  release_year INTEGER,
  FOREIGN KEY (film_id) REFERENCES Films(film_id)
);

CREATE TABLE IF NOT EXISTS Awards (
  award_id TEXT PRIMARY KEY,
  film_id TEXT,
  year TEXT,
  award_name TEXT,
  award_category TEXT,
  award_winner TEXT,
  award_status TEXT,
  FOREIGN KEY (film_id) REFERENCES Films(film_id)
);

CREATE TABLE IF NOT EXISTS Genres (
  genre_id TEXT PRIMARY KEY,
  genre_name TEXT UNIQUE
);

CREATE TABLE IF NOT EXISTS FilmGenres (
  film_id TEXT,
  genre_id TEXT,
  FOREIGN KEY (film_id) REFERENCES Films(film_id),
  FOREIGN KEY (genre_id) REFERENCES Genres(genre_id),
  PRIMARY KEY (film_id, genre_id)
);

CREATE TABLE IF NOT EXISTS Locations (
  location_id TEXT PRIMARY KEY,
  specificLocation TEXT,
  city TEXT,
  province TEXT,
  country TEXT
);

CREATE TABLE IF NOT EXISTS FilmLocations (
  film_id TEXT,
  location_id TEXT,
  FOREIGN KEY (film_id) REFERENCES Films(film_id),
  FOREIGN KEY (location_id) REFERENCES Locations(location_id),
  PRIMARY KEY (film_id, location_id)
);

CREATE TABLE IF NOT EXISTS Companies (
  company_id TEXT PRIMARY KEY,
  name TEXT,
  imdb_id TEXT,
  website TEXT,
  phone TEXT,
  fax TEXT,
  email TEXT
);

CREATE TABLE IF NOT EXISTS FilmCompanies (
  film_id TEXT,
  company_id TEXT,
  role TEXT,
  FOREIGN KEY (film_id) REFERENCES Films(film_id),
  FOREIGN KEY (company_id) REFERENCES Companies(company_id),
  PRIMARY KEY (film_id, company_id, role)
);

CREATE TABLE IF NOT EXISTS People (
  person_id TEXT PRIMARY KEY,
  name TEXT,
  imdb_id TEXT
);

CREATE TABLE IF NOT EXISTS Roles (
  role_id TEXT PRIMARY KEY,
  role_name TEXT UNIQUE
);

CREATE TABLE IF NOT EXISTS Departments (
  department_id TEXT PRIMARY KEY,
  name TEXT UNIQUE
);

CREATE TABLE IF NOT EXISTS FilmPeople (
  film_id TEXT,
  person_id TEXT,
  role_id TEXT,
  department_id TEXT,
  FOREIGN KEY (film_id) REFERENCES Films(film_id),
  FOREIGN KEY (person_id) REFERENCES People(person_id),
  FOREIGN KEY (role_id) REFERENCES Roles(role_id),
  FOREIGN KEY (department_id) REFERENCES Departments(department_id),
  PRIMARY KEY (film_id, person_id, role_id, department_id)
);

CREATE TABLE IF NOT EXISTS Cast (
  film_id TEXT,
  person_id TEXT,
  picture TEXT,
  imdb_id TEXT,
  starmeter TEXT,
  FOREIGN KEY (film_id) REFERENCES Films(film_id),
  FOREIGN KEY (person_id) REFERENCES People(person_id),
  PRIMARY KEY (film_id, person_id)
);

CREATE TABLE IF NOT EXISTS Producers (
  film_id TEXT,
  person_id TEXT,
  role_id TEXT,
  role TEXT,
  FOREIGN KEY (film_id) REFERENCES Films(film_id),
  FOREIGN KEY (person_id) REFERENCES People(person_id),
  FOREIGN KEY (role_id) REFERENCES Roles(role_id),
  PRIMARY KEY (film_id, person_id)
);
`);
}

function extractImdbKey(imdbUrl) {
  const match = imdbUrl.match(/name\/(nm\d+)\//) || imdbUrl.match(/title\/(tt\d+)\//);
  return match ? match[1] : null;
}

async function getPersonIdByImdbId(db, imdbId) {
  const person = await db.get(`SELECT person_id FROM People WHERE imdb_id = ?`, [imdbId]);
  return person ? person.person_id : null;
}

async function insertFilm(db, film, filmCache) {
  const filmId = generateCustomId('tff');
  const imdbKey = film.imdb?.id || null;

  if (imdbKey && filmCache.has(imdbKey)) {
    return filmCache.get(imdbKey);
  }

  await db.run(
    `INSERT OR IGNORE INTO Films (film_id, title, imdb_id, budget, gross_us_canada, gross_world, release_date, release_year, type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      filmId,
      film.title || null,
      imdbKey,
      film.boxOffice?.budget || null,
      film.boxOffice?.grossUSCanada || null,
      film.boxOffice?.grossWorld || null,
      film.boxOffice?.releaseDate || null,
      film.boxOffice?.releaseYear || null,
      'feature'
    ]
  );

  if (imdbKey) {
    filmCache.set(imdbKey, filmId);
  }

  return filmId;
}

async function handleGenres(db, genres, filmId, genreCache) {
  for (const genreName of genres || []) {
    let genreId;
    if (genreCache.has(genreName)) {
      genreId = genreCache.get(genreName);
    } else {
      genreId = generateCustomId('gen');
      await db.run(`INSERT OR IGNORE INTO Genres (genre_id, genre_name) VALUES (?, ?)`, [genreId, genreName || null]);
      genreCache.set(genreName, genreId);
    }
    await db.run(`INSERT OR IGNORE INTO FilmGenres (film_id, genre_id) VALUES (?, ?)`, [filmId, genreId]);
  }
}

async function handleLocations(db, locations, filmId, locationCache) {
  for (const location of locations || []) {
    const locationKey = `${location.city}-${location.province}-${location.country}`;
    let locationId;

    if (locationCache.has(locationKey)) {
      locationId = locationCache.get(locationKey);
    } else {
      locationId = generateCustomId('loc');
      if (Object.keys(location).length === 4) {
        await db.run(`INSERT OR IGNORE INTO Locations (location_id, specificLocation, city, province, country) VALUES (?, ?, ?, ?, ?)`, [
          locationId,
          location.specificLocation || null,
          location.city || null,
          location.province || null,
          location.country || null
        ]);
      } else {
        await db.run(`INSERT OR IGNORE INTO Locations (location_id, specificLocation, city, province, country) VALUES (?, NULL, ?, ?, ?)`, [
          locationId,
          location.city || null,
          location.province || null,
          location.country || null
        ]);
      }
      locationCache.set(locationKey, locationId);
    }
    await db.run(`INSERT OR IGNORE INTO FilmLocations (film_id, location_id) VALUES (?, ?)`, [filmId, locationId]);
  }
}

async function handleCompanies(db, companies, filmId, companyCache) {
  for (const type in companies) {
    for (const company of companies[type] || []) {
      const imdbKey = extractImdbKey(company.imdbLink);
      let companyId;

      if (imdbKey && companyCache.has(imdbKey)) {
        companyId = companyCache.get(imdbKey);
      } else {
        companyId = generateCustomId('com');
        await db.run(
          `INSERT OR IGNORE INTO Companies (company_id, name, imdb_id, website, phone, fax, email) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            companyId,
            company.name || null,
            imdbKey || null,
            company.contact?.website || null,
            company.contact?.phone || null,
            company.contact?.fax || null,
            company.contact?.email || null
          ]
        );
        if (imdbKey) {
          companyCache.set(imdbKey, companyId);
        }
      }
      await db.run(`INSERT OR IGNORE INTO FilmCompanies (film_id, company_id, role) VALUES (?, ?, ?)`, [filmId, companyId, type || null]);
    }
  }
}

async function handleCrew(db, crew, filmId) {
  const departmentCache = new Map();
  const roleCache = new Map();
  const personCache = new Map(); // Cache to store already created person_ids

  for (const departmentName in crew) {
    let departmentId;
    if (!departmentCache.has(departmentName)) {
      departmentId = generateCustomId('dep');
      await db.run(`INSERT OR IGNORE INTO Departments (department_id, name) VALUES (?, ?)`, [departmentId, departmentName]);
      departmentCache.set(departmentName, departmentId);
    } else {
      departmentId = departmentCache.get(departmentName);
    }

    for (const person of crew[departmentName] || []) {
      const imdbKey = extractImdbKey(person.imdbLink);
      let personId;

      // Check if person already exists in cache or database
      if (imdbKey && personCache.has(imdbKey)) {
        personId = personCache.get(imdbKey);
      } else {
        personId = await getPersonIdByImdbId(db, imdbKey);
        if (!personId) {
          personId = generateCustomId('per');
          await db.run(`INSERT OR IGNORE INTO People (person_id, name, imdb_id) VALUES (?, ?, ?)`, [personId, person.name || null, imdbKey || null]);
        }
        if (imdbKey) {
          personCache.set(imdbKey, personId);
        }
      }

      let roleId;
      if (!roleCache.has(person.role)) {
        roleId = generateCustomId('role');
        await db.run(`INSERT OR IGNORE INTO Roles (role_id, role_name) VALUES (?, ?)`, [roleId, person.role || null]);
        roleCache.set(person.role, roleId);
      } else {
        roleId = roleCache.get(person.role);
      }

      // Insert into FilmPeople table
      await db.run(`INSERT OR IGNORE INTO FilmPeople (film_id, person_id, role_id, department_id) VALUES (?, ?, ?, ?)`, [
        filmId,
        personId,
        roleId,
        departmentId
      ]);

      // Insert into Producers table if role is producer
      if (person.role.toLowerCase().includes('producer')) {
        // Insert into Producers table with role id and role text
        await db.run(`INSERT OR IGNORE INTO Producers (film_id, person_id, role_id, role) VALUES (?, ?, ?, ?)`, [
          filmId,
          personId,
          roleId,
          person.role
        ]);
      }
    }
  }
}

async function handleCast(db, cast, filmId) {
  const personCache = new Map(); // Cache to store already created person_ids

  for (const member of cast || []) {
    const imdbKey = extractImdbKey(member.imdbLink);
    let personId;

    // Check if person already exists in cache or database
    if (imdbKey && personCache.has(imdbKey)) {
      personId = personCache.get(imdbKey);
    } else {
      personId = await getPersonIdByImdbId(db, imdbKey);
      if (!personId) {
        personId = generateCustomId('per');
        await db.run(`INSERT OR IGNORE INTO People (person_id, name, imdb_id) VALUES (?, ?, ?)`, [
          personId,
          member.name || null,
          imdbKey || null
        ]);
      }
      if (imdbKey) {
        personCache.set(imdbKey, personId);
      }
    }

    await db.run(`INSERT OR IGNORE INTO Cast (film_id, person_id, picture, imdb_id, starmeter) VALUES (?, ?, ?, ?, ?)`, [
      filmId,
      personId,
      member.picture || null,
      imdbKey || null,
      member.starmeter || null
    ]);
  }
}


async function handleBoxOffice(db, boxOffice, filmId) {
  await db.run(
    `INSERT OR IGNORE INTO BoxOffice (film_id, opening_weekend, gross_us_canada, gross_world, release_date, release_year)
    VALUES (?, ?, ?, ?, ?, ?)`,
    [
      filmId,
      boxOffice.openingWeekend || null,
      boxOffice.grossUSCanada || null,
      boxOffice.grossWorld || null,
      boxOffice.releaseDate || null,
      boxOffice.releaseYear || null
    ]
  );
}

async function handleAwards(db, awards, filmId) {
  for (const award of awards || []) {
    const awardId = generateCustomId('awd');
    await db.run(
      `INSERT OR IGNORE INTO Awards (award_id, film_id, year, award_name, award_category, award_winner, award_status)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        awardId,
        filmId,
        award.year || null,
        award.awardName || null,
        award.awardCategory || null,
        award.awardWinner || null,
        award.awardStatus || null
      ]
    );
  }
}

async function sortAndTableData() {
  const db = await open({
    filename: './films.sqlite',
    driver: sqlite3.Database
  });

  await createTables(db);

  const genreCache = new Map();
  const filmCache = new Map();
  const locationCache = new Map();
  const companyCache = new Map();

  const fileStream = fs.createReadStream('./scrapedFilms.jsonl');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let count = 0;
  for await (const line of rl) {
    try {
      count++;
      console.log(`Processing item #${count}`);
      const film = JSON.parse(line);
      const filmId = await insertFilm(db, film, filmCache);
      await handleBoxOffice(db, film.boxOffice, filmId);
      await handleAwards(db, film.details.awards, filmId);
      await handleGenres(db, film.details.genres, filmId, genreCache);
      await handleLocations(db, film.details.filmingLocations, filmId, locationCache);
      await handleCompanies(db, film.companies, filmId, companyCache);
      await handleCrew(db, film.crew, filmId);
      if (film.cast) {
        await handleCast(db, film.cast, filmId);
      }
    } catch (error) {
      console.error(`Error processing item #${count}:`, error);
    }
  }

  db.close();
}

sortAndTableData();
