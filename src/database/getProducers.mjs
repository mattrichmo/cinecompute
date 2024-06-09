import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import fs from 'fs';

let db = null;

async function openDb() {
  if (!db) {
    db = await open({
      filename: './films.sqlite',
      driver: sqlite3.Database
    });
  }
  return db;
}

async function saveProducersData() {
  const db = await openDb();
  try {
    const RECENT_YEARS = 1;
    const currentYear = new Date().getFullYear();
    const thresholdYear = currentYear - RECENT_YEARS;

    // First query to get the films
    const filmsQuery = `
      SELECT
        Films.film_id,
        Films.title,
        Films.imdb_id,
        Films.budget,
        Genres.genre_name
      FROM Films
      JOIN FilmGenres ON Films.film_id = FilmGenres.film_id
      JOIN Genres ON FilmGenres.genre_id = Genres.genre_id
      WHERE Films.release_year >=?
        AND Films.film_id IN (
          SELECT film_id
          FROM Producers
          GROUP BY film_id
        )
    `;

    const filmsResults = await db.all(filmsQuery, thresholdYear);
    console.log(`Number of films found: ${filmsResults.length}`);
    if (!filmsResults.length) {
      console.log("No films found for the given query");
      return;
    }

    // Fetch producers for each film
    const filmIds = filmsResults.map(film => film.film_id);
    const producersQuery = `
      SELECT
        Films.film_id,
        People.person_id,
        People.name,
        People.imdb_id AS person_imdb_id,
        Producers.role
      FROM Films
      JOIN Producers ON Films.film_id = Producers.film_id
      JOIN People ON Producers.person_id = People.person_id
      WHERE Films.film_id IN (${filmIds.map(() => '?').join(',')})
    `;

    const producersResults = await db.all(producersQuery,...filmIds);
    console.log(`Number of producers found: ${producersResults.length}`);

    // Organize data into the desired structure
    const filmsMap = new Map();
    const producersMap = new Map();

    filmsResults.forEach(film => {
      filmsMap.set(film.film_id, {
        id: film.film_id,
        title: film.title,
        imdbID: film.imdb_id,
        genre: film.genre_name,
        money: {
          budget: film.budget,
        },
        producers: [],
      });
    });

    producersResults.forEach(row => {
      if (filmsMap.has(row.film_id)) {
        filmsMap.get(row.film_id).producers.push(row.person_id);
      }

      if (!producersMap.has(row.person_id)) {
        producersMap.set(row.person_id, {
          id: row.person_id,
          name: row.name,
          imdbID: row.person_imdb_id,
          affiliations: {
            produced: [],
            producedWith: []
          }
        });
      }

      const producer = producersMap.get(row.person_id);
      producer.affiliations.produced.push({
        film_id: row.film_id,
        role: row.role
      });

      // Find other producers who worked on the same film
      const otherProducers = producersResults.filter(p => p.film_id === row.film_id && p.person_id!== row.person_id);
      otherProducers.forEach(otherProducer => {
        const existing = producer.affiliations.producedWith.find(pw => pw.id === otherProducer.person_id);
        if (existing) {
          existing.workedOn.push(row.film_id);
        } else {
          producer.affiliations.producedWith.push({
            id: otherProducer.person_id,
            workedOn: [row.film_id]
          });
        }
      });
    });

    // Transform the organized data into nodes and links
    let nodes = [];
    let links = [];
    filmsMap.forEach((value, key) => {
      nodes.push({id: key, name: value.title, imdbID: value.imdb_id, type: 'film'});
      value.producers.forEach(producerId => {
        const producer = producersMap.get(producerId);
        if (producer) {
          nodes.push({id: producer.id, name: producer.name, imdbID: producer.imdb_id, type: 'producer'});
          links.push({source: producer.id, target: key});
        }
      });
    });

    // Flatten the producedWith array to find links between producers
    producersMap.forEach(producer => {
      producer.affiliations.producedWith.forEach(link => {
        const producerNode = nodes.find(node => node.id === link.id);
        if (producerNode) {
          links.push({source: producer.id, target: link.id});
        }
      });
    });

    // Save to producers.json
    fs.writeFileSync('producers.json', JSON.stringify({nodes, links}, null, 2));
    console.log('Data saved to producers.json');

  } catch (error) {
    console.error("Error processing request:", error);
  }
}

saveProducersData();
