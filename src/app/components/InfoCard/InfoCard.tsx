import React from 'react';
import Image from 'next/image';

interface InfoCardProps {
  title: string;
  value: number;
}

interface PeopleCardProps {
  name: string;
  imdb: string;
  numFilms: number;
  numConnections: number;
  type: string; // producer, cast, grip
}

interface CompanyCardProps {
  name: string;
  imdb: string;
  numFilms: number;
  numConnections: number;
  website: string;
  type: string; // company
}

interface FilmCardProps {
  title: string;
  imdb: string;
  budget: number;
  revenue: number;
  type: string; //
}

const InfoCard: React.FC<InfoCardProps> = ({ title, value }) => {
  return (
    <div className="absolute inset-x-0 bottom-0 mx-4 mb-4 z-30 max-w-full rounded-lg bg-white p-2 shadow duration-150 hover:scale-105 hover:shadow-md md:left-auto md:right-0 md:top-0 md:m-10 md:max-w-xs">
      <Image className="hidden w-full rounded-lg object-cover object-center md:block" src="/img/graph/grip.png" alt="product" width={300} height={200} />
      <div>
        <div className="my-6 flex items-center justify-between px-4">
          <p className="font-bold text-gray-500">Name</p>
          <p className="rounded-full bg-blue-500 px-2 py-0.5 text-xs font-semibold text-white">{title}</p>
        </div>
        <div className="my-4 flex items-center justify-between px-4">
          <p className="text-sm font-semibold text-gray-500">IMDB Link:</p>
          <p className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-600">99</p>
        </div>
        <div className="my-4 flex items-center justify-between px-4">
          <p className="text-sm font-semibold text-gray-500">Number of Films Worked On:</p>
          <p className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-600">{value}</p>
        </div>
        <div className="my-4 flex items-center justify-between px-4">
          <p className="text-sm font-semibold text-gray-500">Third option</p>
          <p className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-600">1</p>
        </div>
        <div className="my-4 flex items-center justify-between px-4">
          <p className="text-sm font-semibold text-gray-500">Fourth option</p>
          <p className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-600">23</p>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;