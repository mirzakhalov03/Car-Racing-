import { useState } from "react";
import { useGetCarsQuery } from "../../redux/api/carsApi";
import Car from "../singleCAR/Car";
import './raceTable.scss';

const RaceTable = () => {
  const [page, setPage] = useState(1);
  const limit = 5;
  const { data, isLoading, error } = useGetCarsQuery({ page, limit });

  

  return (
    <div className="raceTable">
      <div className="flex items-center justify-between mb-2 b-gray-500">
        <h2 className="text-[30px] text-white">Garage (cars: {data?.totalCount || 0})</h2>
        <p className="text-white text-[30px]">Page #{page}</p>
      </div>
      <hr className="mb-4" />

      {isLoading ? <p>Loading...</p> : null}
      {error ? <p>Error loading cars</p> : null}

      {data?.cars.map((car) => (
        <div key={car.id}>
          <Car name={car.name} color={car.color} id={car.id} />
          <hr className="my-2" />
        </div>
      ))}

      <div className="pagination flex items-center justify-end">
        <button
          disabled={page === 1}
          onClick={() => setPage((prevPage) => prevPage - 1)}
          className="px-4 py-1 bg-[--secondaryBlue] border-2 ml-2 border-[dodgerblue] rounded text-[#1c63a9]"
        >
          Back
        </button>
        <button
          disabled={data && page * limit >= data.totalCount}
          onClick={() => setPage((prevPage) => prevPage + 1)}
          className="px-4 py-1 bg-[--secondaryBlue] border-2 ml-2 border-[dodgerblue] rounded text-[#1c63a9]"
        >
          Next
        </button>
      </div>

      
    </div>
  );
};

export default RaceTable;
