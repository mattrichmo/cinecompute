import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs';
import readline from 'readline';
import { v4 as uuidv4 } from 'uuid'; // Ensure you have uuid installed in your project

async function createTables(db) {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS Films (
      film_id TEXT PRIMARY KEY,
      title TEXT,
      imdb_id TEXT,
      imdb_url TEXT,
      budget TEXT,
      gross_us_canada TEXT,
      gross_world TEXT,
      release_date TEXT,
      release_year INTEGER,
      type TEXT
    );

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
      imdb_link TEXT,
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
      imdb_link TEXT
    );

    CREATE TABLE IF NOT EXISTS FilmCrew (
      film_id TEXT,
      person_id TEXT,
      role TEXT,
      FOREIGN KEY (film_id) REFERENCES Films(film_id),
      FOREIGN KEY (person_id) REFERENCES People(person_id),
      PRIMARY KEY (film_id, person_id, role)
    );

    CREATE TABLE IF NOT EXISTS Cast (
      film_id TEXT,
      person_id TEXT,
      picture TEXT,
      imdb_link TEXT,
      starmeter TEXT,
      FOREIGN KEY (film_id) REFERENCES Films(film_id),
      FOREIGN KEY (person_id) REFERENCES People(person_id),
      PRIMARY KEY (film_id, person_id)
    );

    CREATE TABLE IF NOT EXISTS Producers (
      film_id TEXT,
      person_id TEXT,
      role_detail TEXT,
      FOREIGN KEY (film_id) REFERENCES Films(film_id),
      FOREIGN KEY (person_id) REFERENCES People(person_id),
      PRIMARY KEY (film_id, person_id)
    );
  `);
}


//#region  Helper functions

// Helper function to insert data into the Films table
async function insertFilm(db, film) {
  await db.run(
    `INSERT OR IGNORE INTO Films (film_id, title, imdb_id, imdb_url, budget, gross_us_canada, gross_world, release_date, release_year, type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      film.uuid || null,
      film.title || null,
      film.imdb?.id || null,
      film.imdb?.url || null,
      film.boxOffice?.budget || null,
      film.boxOffice?.grossUSCanada || null,
      film.boxOffice?.grossWorld || null,
      film.boxOffice?.releaseDate || null,
      film.boxOffice?.releaseYear || null,
      'feature'  // Set type as 'feature' for every film
    ]
  );
}


// Helper function to handle Genres
async function handleGenres(db, genres, uuid, genreCache) {
  for (const genreName of genres || []) {
    if (!genreCache.has(genreName)) {
      const genreId = uuidv4();
      await db.run(`INSERT OR IGNORE INTO Genres (genre_id, genre_name) VALUES (?, ?)`, [genreId, genreName || null]);
      genreCache.set(genreName, genreId);
    }
    await db.run(`INSERT OR IGNORE INTO FilmGenres (film_id, genre_id) VALUES (?, ?)`, [uuid || null, genreCache.get(genreName)]);
  }
}

// Helper function to handle Locations
async function handleLocations(db, locations, uuid) {
  for (const location of locations || []) {
    const locationId = uuidv4();
    if (Object.keys(location).length === 4) { // Assumes keys are specificLocation, city, province, country
      await db.run(`INSERT OR IGNORE INTO Locations (location_id, specificLocation, city, province, country) VALUES (?, ?, ?, ?, ?)`, [
        locationId || null,
        location.specificLocation || null,
        location.city || null,
        location.province || null,
        location.country || null
      ]);
    } else { // Defaults specificLocation to null if not provided
      await db.run(`INSERT OR IGNORE INTO Locations (location_id, specificLocation, city, province, country) VALUES (?, NULL, ?, ?, ?)`, [
        locationId || null,
        location.city || null,
        location.province || null,
        location.country || null
      ]);
    }
    await db.run(`INSERT OR IGNORE INTO FilmLocations (film_id, location_id) VALUES (?, ?)`, [uuid || null, locationId || null]);
  }
}

// Helper function to handle Companies
async function handleCompanies(db, companies, uuid) {
  for (const type in companies) {
    for (const company of companies[type] || []) {
      const companyId = uuidv4();
      await db.run(
        `INSERT OR IGNORE INTO Companies (company_id, name, imdb_link, website, phone, fax, email) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          companyId || null,
          company.name || null,
          company.imdbLink || null,
          company.contact?.website || null,
          company.contact?.phone || null,
          company.contact?.fax || null,
          company.contact?.email || null
        ]
      );
      await db.run(`INSERT OR IGNORE INTO FilmCompanies (film_id, company_id, role) VALUES (?, ?, ?)`, [uuid || null, companyId || null, type || null]);
    }
  }
}

// Helper function to handle Crew
async function handleCrew(db, crew, uuid) {
  for (const role in crew) {
    for (const person of crew[role] || []) {
      const personId = uuidv4();
      await db.run(`INSERT OR IGNORE INTO People (person_id, name, imdb_link) VALUES (?, ?, ?)`, [personId || null, person.name || null, person.imdbLink || null]);
      await db.run(`INSERT OR IGNORE INTO FilmCrew (film_id, person_id, role) VALUES (?, ?, ?)`, [uuid || null, personId || null, role || null]);
    }
  }
}

// Helper function to handle Cast
async function handleCast(db, cast, uuid) {
  for (const member of cast || []) {
    const personId = uuidv4();
    await db.run(`INSERT OR IGNORE INTO People (person_id, name, imdb_link) VALUES (?, ?, ?)`, [
      personId || null,
      member.name || null,
      member.imdbLink || null
    ]);
    await db.run(`INSERT OR IGNORE INTO Cast (film_id, person_id, picture, imdb_link, starmeter) VALUES (?, ?, ?, ?, ?)`, [
      uuid || null,
      personId || null,
      member.picture || null,
      member.imdbLink || null,
      member.starmeter || null
    ]);
  }
}



// Helper function to handle Producers
async function handleProducers(db, producers, uuid) {
  for (const producer of producers || []) {
    const personId = uuidv4();
    await db.run(`INSERT OR IGNORE INTO People (person_id, name, imdb_link) VALUES (?, ?, ?)`, [personId || null, producer.name || null, producer.imdbLink || null]);
    await db.run(`INSERT OR IGNORE INTO Producers (film_id, person_id, role_detail) VALUES (?, ?, ?)`, [uuid || null, personId || null, producer.roleDetail || null]);
  }
}

// Helper function to insert data into the BoxOffice table
async function handleBoxOffice(db, boxOffice, uuid) {
  await db.run(
    `INSERT OR IGNORE INTO BoxOffice (film_id, opening_weekend, gross_us_canada, gross_world, release_date, release_year)
    VALUES (?, ?, ?, ?, ?, ?)`,
    [
      uuid || null,
      boxOffice.openingWeekend || null,
      boxOffice.grossUSCanada || null,
      boxOffice.grossWorld || null,
      boxOffice.releaseDate || null,
      boxOffice.releaseYear || null
    ]
  );
}


// Helper function to handle Awards
async function handleAwards(db, awards, uuid) {
  for (const award of awards || []) {
    const awardId = uuidv4();
    await db.run(
      `INSERT OR IGNORE INTO Awards (award_id, film_id, year, award_name, award_category, award_winner, award_status)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        awardId || null,
        uuid || null,
        award.year || null,
        award.awardName || null,
        award.awardCategory || null,
        award.awardWinner || null,
        award.awardStatus || null
      ]
    );
  }
}


//#endregion


// Main function
async function sortAndTableData() {
  const db = await open({
    filename: './films.sqlite',
    driver: sqlite3.Database
  });

  await createTables(db);

  const genreCache = new Map();
  const locationCache = new Map();
  const companyCache = new Map();
  const personCache = new Map();

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
      await insertFilm(db, film);
      await handleBoxOffice(db, film.boxOffice, film.uuid);
      await handleAwards(db, film.details.awards, film.uuid);
      await handleGenres(db, film.details.genres, film.uuid, genreCache);
      await handleLocations(db, film.details.filmingLocations, film.uuid);
      await handleCompanies(db, film.companies, film.uuid);
      await handleCrew(db, film.crew, film.uuid);
      if (film.cast) {
        await handleCast(db, film.cast, film.uuid);
      }
      if (film.crew && film.crew.Producer) {
        await handleProducers(db, film.crew.Producer, film.uuid);
      }
    } catch (error) {
      console.error(`Error processing item #${count}:`, error);
    }
  }

  db.close();
}


sortAndTableData();

