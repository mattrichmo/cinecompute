import React from "react";
import Link from "next/link";

const GenreTable = ({ data }) => {
  return (
    <div className="flex justify-center">
      <table className="w-full max-w-4xl shadow-md bg-white bg-opacity-10 mx-12 md:mx-6">
        <thead className="text-white border-b border-pink-300">
          <tr>
            <th className="px-6 py-3 text-left">Title</th>
            <th className="px-6 py-3 text-left">IMDb Link</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={index} className="hover:bg-pink-50 hover:bg-opacity-10">
                <td className="px-6 py-4 text-white whitespace-normal">{item.title}</td>
                <td className="px-6 py-4 whitespace-normal">
                  <Link href={`https://www.imdb.com/title/${item.imdbId}`} passHref target="_blank" className="text-pink-500 hover:text-pink-600 transition-colors">
                    <p >
                      View IMDb
                    </p>
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="text-center text-white italic py-10">
                Click data above to see titles.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GenreTable;
