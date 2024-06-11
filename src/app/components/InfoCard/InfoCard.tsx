import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Interface for film node
interface FilmNode {
  id: string;
  name: string;
  imdbID: string;
  type: 'film';
  values: {
    film: {
      budget: number | null;
      releaseYear: number;
    };
    producers: null;
  };
}

// Interface for producer node
interface ProducerNode {
  id: string;
  name: string;
  imdbID: string;
  type: 'producer';
  values: {
    film: null;
    producers: {
      numFilms: number;
      numConnections: number;
    };
  };
}

// Interface for company node
interface CompanyNode {
  id: string;
  name: string;
  imdbID: string | null;
  type: 'company';
  values: {
    film: null;
    companies: {
      numFilms: number;
      numConnections: number;
    };
  };
}

// Interface for cast node
interface CastNode {
  id: string;
  name: string;
  imdbID: string;
  type: 'cast';
  values: {
    film: null;
    cast: {
      starMeter: string;
      numFilms: number;
      numConnections: number;
    };
  };
}

// Interface for grip node
interface GripNode {
  id: string;
  name: string;
  imdbID: string;
  type: 'grip';
  values: {
    film: null;
    grips: {
      numFilms: number;
      numConnections: number;
    };
  };
}

// Union type for all possible node types
type Node = FilmNode | ProducerNode | CompanyNode | CastNode | GripNode;

// Interface for InfoCard component props
interface InfoCardProps {
  node: Node;
}

const InfoCard: React.FC<InfoCardProps> = ({ node }) => {
  const [isHidden, setIsHidden] = useState(false);

  const renderValues = () => {
    switch (node.type) {
      case 'film':
        return (
          <>
            <div className="my-4 flex items-center justify-between px-4">
              <p className="text-sm font-semibold text-white">Budget:</p>
              <p className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-600">{node.values.film.budget ?? 'N/A'}</p>
            </div>
            <div className="my-4 flex items-center justify-between px-4">
              <p className="text-sm font-semibold text-white">Release Year:</p>
              <p className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-600">{node.values.film.releaseYear}</p>
            </div>
          </>
        );
      case 'producer':
        return (
          <>
            <div className="my-4 flex items-center justify-between px-4">
              <p className="text-sm font-semibold text-white">Number of Films:</p>
              <p className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-600">{node.values.producers.numFilms}</p>
            </div>
            <div className="my-4 flex items-center justify-between px-4">
              <p className="text-sm font-semibold text-white">Number of Connections:</p>
              <p className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-600">{node.values.producers.numConnections}</p>
            </div>
          </>
        );
      case 'company':
        return (
          <>
            <div className="my-4 flex items-center justify-between px-4">
              <p className="text-sm font-semibold text-white">Number of Films:</p>
              <p className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-600">{node.values.companies.numFilms}</p>
            </div>
            <div className="my-4 flex items-center justify-between px-4">
              <p className="text-sm font-semibold text-white">Number of Connections:</p>
              <p className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-600">{node.values.companies.numConnections}</p>
            </div>
          </>
        );
      case 'cast':
        return (
          <>
            <div className="my-4 flex items-center justify-between px-4">
              <p className="text-sm font-semibold text-white">Star Meter:</p>
              <p className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-600">{node.values.cast.starMeter}</p>
            </div>
            <div className="my-4 flex items-center justify-between px-4">
              <p className="text-sm font-semibold text-white">Number of Films:</p>
              <p className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-600">{node.values.cast.numFilms}</p>
            </div>
            <div className="my-4 flex items-center justify-between px-4">
              <p className="text-sm font-semibold text-white">Number of Connections:</p>
              <p className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-600">{node.values.cast.numConnections}</p>
            </div>
          </>
        );
      case 'grip':
        return (
          <>
            <div className="my-4 flex items-center justify-between px-4">
              <p className="text-sm font-semibold text-white">Number of Films:</p>
              <p className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-600">{node.values.grips.numFilms}</p>
            </div>
            <div className="my-4 flex items-center justify-between px-4">
              <p className="text-sm font-semibold text-white">Number of Connections:</p>
              <p className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-600">{node.values.grips.numConnections}</p>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const renderIMDBLink = () => {
    if (node.type === 'company') return null;

    let imdbBaseURL;
    if (node.type === 'film') {
      imdbBaseURL = 'https://www.imdb.com/title/';
    } else {
      imdbBaseURL = 'https://www.imdb.com/name/';
    }

    const imdbLink = `${imdbBaseURL}${node.imdbID}`;

    return (
      <div className="my-4 flex justify-center px-4">
        <Link href={imdbLink} target="_blank" rel="noopener noreferrer" className="underline text-white">
          IMDB
        </Link>
      </div>
    );
  };

  const toggleVisibility = () => {
    setIsHidden(!isHidden);
  };

  return (
    <div>
      <div className={`absolute top-0 right-0 m-4 md:hidden ${isHidden ? 'block' : 'hidden'}`}>
        <button onClick={toggleVisibility} className="bg-blue-500 text-white px-2 py-1 rounded-full">Tab</button>
      </div>
      <div className={`absolute inset-x-0 bottom-0 mx-4 mb-4 z-30 max-w-full rounded-lg border border-white bg-black bg-opacity-90 backdrop-blur-md p-2 shadow duration-150 hover:scale-105 hover:shadow-md md:left-auto md:right-0 md:top-0 md:m-10 md:max-w-xs ${isHidden ? 'hidden' : 'block'}`}>
        <Image className="hidden w-full rounded-lg object-cover object-center md:block" src="/img/graph/grip.png" alt="product" width={300} height={200} />
        <div>
          <div className="my-6 flex items-center justify-between px-4">
            <p className="font-bold text-white">Name</p>
            <p className="rounded-full bg-blue-500 px-2 py-0.5 text-xs font-semibold text-white">{node.name}</p>
          </div>
          {renderIMDBLink()}
          {renderValues()}
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
