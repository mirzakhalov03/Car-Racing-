import { useState } from "react";
import { BsFillPlayFill } from "react-icons/bs";
import { MdReplay, MdOutlineWifiProtectedSetup } from "react-icons/md";
import { ColorPicker, Input } from "antd";
import { useCreateCarMutation, useGetCarsQuery, useStartEngineMutation } from "../../redux/api/carsApi";
import { BrandCarsName } from "../../db/carBrands";
import "./actionbtns.scss";
import { useDispatch } from "react-redux";
import { resetRace, startRace } from "../../redux/slice/raceSlice";

type CarType = {
  id: number;
  name: string;
  color: string;
};

type ActionBtnsProps = {
  refetch: () => void;
  cars: CarType[];
};

const ActionBtns = ({ cars }: ActionBtnsProps) => {
  const [newCarName, setNewCarName] = useState("");
  const [carColor, setCarColor] = useState<string>("#000000");
  const [createCar] = useCreateCarMutation();
  const [startEngine] = useStartEngineMutation();
  const dispatch = useDispatch();
  const { refetch: refetchCars } = useGetCarsQuery({ page: 1, limit: 5 });


  const handleStartRace = async () => {
    dispatch(startRace());

    const racePromises = cars.map(async (car) => {
      try {
        const response = await startEngine({ id: car.id, status: "started" }).unwrap();
        const { velocity, distance } = response;

        if (!velocity || !distance) {
          console.warn(`Car ${car.id} is missing velocity or distance.`);
          return;
        }

        animateCar(car.id, velocity, distance);
      } catch (error) {
        console.error(`Failed to start engine for car ${car.id}:`, error);
      }
    });

    await Promise.all(racePromises);
    console.log("Race started for all cars!");
  };

  const handleResetRace = () => {
    dispatch(resetRace());
  };

  const getRandomColor = (): string => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  };

  const getRandomCarName = (): string => {
    return BrandCarsName[Math.floor(Math.random() * BrandCarsName.length)];
  };

  const handleGenerateCars = async () => {
    const carPromises = [];
    for (let i = 0; i < 100; i++) {
      carPromises.push(
        createCar({
          name: getRandomCarName(),
          color: getRandomColor(),
        })
      );
    }
    await Promise.all(carPromises);
    refetchCars();
    alert("100 random cars created successfully!");
  };

  const handleCreateCar = async () => {
    if (newCarName.trim() !== "") {
      await createCar({ name: newCarName, color: carColor });
      refetchCars();
      setNewCarName("");
    }
  };

  const animateCar = (carId: number, velocity: number, distance: number) => {
    const finishLineX = 800;
    const finalDistance = Math.min(distance, finishLineX);
    const duration = finalDistance / velocity;

    const carElement = document.querySelector(`.car-${carId}`);

    if (carElement) {
      carElement.animate(
        [
          { transform: "translateX(0px)" },
          { transform: `translateX(${finalDistance}px)` },
        ],
        {
          duration: duration * 1000,
          easing: "linear",
          fill: "forwards",
        }
      );
    }
  };

  return (
    <div className="actionBtns">
      <div className="start_stop flex gap-4">
        <button
          onClick={handleStartRace}
          className="flex items-center gap-2 text-[lime] border-2 border-[limegreen]"
        >
          Race <BsFillPlayFill />
        </button>
        <button
          onClick={handleResetRace}
          className="flex items-center gap-2 text-[gold] border-2 border-[gold]"
        >
          Reset <MdReplay />
        </button>
      </div>
      <div className="flex gap-4">
        <span className="flex items-center gap-1">
          <Input
            className="w-[140px]"
            placeholder="Type Car Brand"
            value={newCarName}
            onChange={(e) => setNewCarName(e.target.value)}
          />
          <ColorPicker
            value={carColor}
            onChange={(color) => setCarColor(color.toHexString())}
          />
          <button
            onClick={handleCreateCar}
            className="flex items-center gap-2 text-[--secondaryBlue] border-2 border-[--secondaryBlue]"
          >
            Create
          </button>
        </span>
      </div>
      <button
        onClick={handleGenerateCars}
        className="flex items-center gap-2 text-[lime] border-[3px] border-[limegreen]"
      >
        Generate <MdOutlineWifiProtectedSetup />
      </button>
    </div>
  );
};

export default ActionBtns;
