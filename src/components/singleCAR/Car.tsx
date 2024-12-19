import { useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { GiRaceCar } from "react-icons/gi";
import { BsTrash3 } from "react-icons/bs";
import { MdReplay } from "react-icons/md";
import { BsFillPlayFill } from "react-icons/bs";
import { Modal, Input, Button } from "antd";
import {
  useDeleteCarMutation,
  useGetCarsQuery,
  useStartEngineMutation,
  useStopEngineMutation,
  useUpdateCarMutation,
} from "../../redux/api/carsApi";
import { ColorPicker } from "antd";

const Car = ({ name, color, id }: { name: string; color: string; id: number }) => {
  const [deleteCar] = useDeleteCarMutation();
  const [updateCar] = useUpdateCarMutation();
  const { data: cars, refetch } = useGetCarsQuery({ page: 1, limit: 5 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCarName, setNewCarName] = useState(name);
  const [carColor, setCarColor] = useState(color);
  const [position, setPosition] = useState(0);
  const [startEngineMutation] = useStartEngineMutation();
  const [stopEngineMutation] = useStopEngineMutation();
  console.log(cars);

  const startEngine = async () => {
    try {
      const response = await startEngineMutation({ id, status: "started" }).unwrap();
      const { velocity, distance } = response;

      const duration = distance / velocity;
      animateCar(id, distance, duration);
    } catch (error) {
      console.error("Error starting engine:", error);
    }
  };

  const stopEngine = async () => {
    try {
      await stopEngineMutation({ id }).unwrap();
      setPosition(0);
    } catch (error) {
      console.error("Error stopping engine:", error);
    }
  };

  const animateCar = (carId: number, distance: number, duration: number) => {
    const carElement = document.querySelector(`.car-${carId}`);
    if (!carElement) {
      console.error(`Car element with ID car-${carId} not found`);
      return;
    }

    // Dynamically adjust the distance based on the screen size
    const screenWidth = window.innerWidth;
    let adjustedDistance = distance;

    if (screenWidth < 1024) {
      // For smaller screens, scale down the distance accordingly
      adjustedDistance = Math.min(distance, screenWidth - 100); // Ensure cars fit within screen boundaries
    }

    // Animate the car with the adjusted distance
    carElement.animate(
      [
        { transform: "translateX(0px)" },
        { transform: `translateX(${adjustedDistance}px)` },
      ],
      {
        duration: duration * 1000, // Convert duration to milliseconds
        easing: "linear",
        fill: "forwards", // Retain the final position after animation ends
      }
    );

    // Update the position visually in state
    setPosition(adjustedDistance);
  };

  const handleDeleteCar = async () => {
    try {
      const response = await deleteCar(id);
      if (response?.data) {
        console.log("Car deleted successfully");
      } else {
        console.log("Failed to delete car");
      }
      refetch();
    } catch (error) {
      console.error("Error deleting car:", error);
    }
  };

  const handleUpdateCar = async () => {
    try {
      const updatedCar = {
        id,
        name: newCarName,
        color: carColor,
      };
      const response = await updateCar(updatedCar);
      if (response?.data) {
        console.log("Car updated successfully");
        setIsModalOpen(false);
      } else {
        console.log("Failed to update car");
      }
      refetch();
    } catch (error) {
      console.error("Error updating car:", error);
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className="carBtns flex flex-col gap-2">
          <span className="flex gap-2">
            <button
              onClick={startEngine}
              className="p-1 border border-lime-500 text-[lime]"
            >
              <BsFillPlayFill />
            </button>
            <button
              onClick={stopEngine}
              className="p-1 border border-[gold] text-[gold]"
            >
              <MdReplay />
            </button>
          </span>
          <span className="flex gap-2">
            <button
              onClick={handleDeleteCar}
              className="p-1 border border-[crimson] text-[crimson]"
            >
              <BsTrash3 />
            </button>
            <button
              onClick={showModal}
              className="p-1 border border-[--secondaryBlue] text-[--secondaryBlue]"
            >
              <BiEditAlt />
            </button>
          </span>
        </div>
        <div className="flex flex-col">
          <h1
            className="ml-5 text-[18px]"
            style={{ color: color }}
          >
            {name.toUpperCase()}
          </h1>
          <GiRaceCar
            className={`text-[80px] w-[100px] h-[50px] car-${id}`} // Class includes car ID for dynamic selection
            style={{
              color,
              transform: `translateX(${position}px)`,
            }}
          />
        </div>
      </div>
      <div className="finishing-line mr-[40px] w-[20px] border border-[white] h-[50px] flex flex-wrap overflow-hidden">
        <span className="w-[9px] h-[9px] bg-[white] block"></span>
        <span className="w-[9px] h-[9px] bg-[black] block"></span>
        <span className="w-[9px] h-[9px] bg-[black] block"></span>
        <span className="w-[9px] h-[9px] bg-[white] block"></span>
        <span className="w-[9px] h-[9px] bg-[white] block"></span>
        <span className="w-[9px] h-[9px] bg-[black] block"></span>
        <span className="w-[9px] h-[9px] bg-[black] block"></span>
        <span className="w-[9px] h-[9px] bg-[white] block"></span>
        <span className="w-[9px] h-[12px] bg-[white] block"></span>
        <span className="w-[9px] h-[12px] bg-[black] block"></span>
      </div>

      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        title="Edit Car"
      >
        <div className="modal-content">
          <div className="flex flex-col gap-2">
            <Input
              value={newCarName}
              onChange={(e) => setNewCarName(e.target.value)}
              placeholder="Edit Car Name"
            />
            <ColorPicker
              value={carColor}
              onChange={(color) => setCarColor(color.toHexString())}
              style={{ marginBottom: "10px" }}
              showText
            />
            <Button onClick={handleUpdateCar} type="primary" block>
              Update
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Car;
