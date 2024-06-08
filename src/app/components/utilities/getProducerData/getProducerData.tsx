type Node = {
  id: string;
  name: string;
  imdbID: string;
  type: 'film' | 'producer';
};

type Link = {
  source: string;
  target: string;
};

type Data = {
  nodes: Node[];
  links: Link[];
};

export const getProducerData = async (): Promise<Data> => {
  let data: Data = {
    nodes: [],
    links: []
  };

  try {
    const response = await fetch('http://localhost:3000/api/getProducers', {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

    if (!response.ok) {
      console.error(`Error: HTTP ${response.status} ${response.statusText}`);
      throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }

    const apiData = await response.json();

    let nodes: Node[] = [];
    let links: Link[] = [];

    // Create a map to track added producers to avoid duplicates
    let producerMap: { [key: string]: Node } = {};
    // Create a map to track films associated with each producer
    let producerFilmMap: { [key: string]: string[] } = {};

    apiData.films.forEach((film: any) => {
      // Create a node for the film
      nodes.push({
        id: film.id,
        name: film.title,
        imdbID: film.imdbID,
        type: 'film',
      });

      // Process each producer
      film.producers.forEach((producerId: string) => {
        const producer = apiData.producers.find((p: any) => p.id === producerId);
        if (producer) {
          if (!producerMap[producer.id]) {
            // If producer node does not exist, create it
            producerMap[producer.id] = {
              id: producer.id,
              name: producer.name,
              imdbID: producer.imdbID,
              type: 'producer',
            };
            nodes.push(producerMap[producer.id]);
          }

          // Track films associated with this producer
          if (!producerFilmMap[producer.id]) {
            producerFilmMap[producer.id] = [];
          }
          producerFilmMap[producer.id].push(film.id);

          // Create a link from the producer to the film
          links.push({
            source: producer.id,
            target: film.id,
          });

          // Create links between producers who worked together
          producer.affiliations.producedWith.forEach((affiliatedProducer: any) => {
            links.push({
              source: producer.id,
              target: affiliatedProducer.id,
            });
          });
        }
      });
    });

    // Create links between films that share a producer
    Object.values(producerFilmMap).forEach(filmIds => {
      for (let i = 0; i < filmIds.length; i++) {
        for (let j = i + 1; j < filmIds.length; j++) {
          links.push({
            source: filmIds[i],
            target: filmIds[j],
          });
        }
      }
    });

    data.nodes = nodes;
    data.links = links;

    return data;
  } catch (error) {
    console.error(`Error fetching producer data: ${error}`);
    throw error; // Throw the error to be caught by the calling component
  }
};

export default getProducerData;
