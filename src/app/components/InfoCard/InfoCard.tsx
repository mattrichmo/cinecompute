// infocard.tsx

interface InfoCardProps {
  title: string;
  value: number;
}

const InfoCard = ({ title, value }: InfoCardProps) => {
  return (
    <div className="absolute top-0 right-0 m-10 z-30 max-w-xs cursor-pointer rounded-lg bg-white p-2 shadow duration-150 hover:scale-105 hover:shadow-md">
      <img className="w-full rounded-lg object-cover object-center" src="./img/default.webp" alt="product" />
      <div>
        <div className="my-6 flex items-center justify-between px-4">
          <p className="font-bold text-gray-500">Name</p>
          <p className="rounded-full bg-blue-500 px-2 py-0.5 text-xs font-semibold text-white">{title}</p>
        </div>
        <div className="my-4 flex items-center justify-between px-4">
          <p className="text-sm font-semibold text-gray-500">Number of Connections</p>
          <p className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-600">99</p>
        </div>
        <div className="my-4 flex items-center justify-between px-4">
          <p className="text-sm font-semibold text-gray-500">Number of Films</p>
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