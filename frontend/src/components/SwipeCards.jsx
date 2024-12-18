import React, { useState } from "react";
import { useSwipeable } from "react-swipeable";

const SwipeCards = () => {
  const [cards, setCards] = useState([
    { id: 1, name: "Alex", age: 25, img: "https://via.placeholder.com/300" },
    { id: 2, name: "Bella", age: 28, img: "https://via.placeholder.com/300" },
    { id: 3, name: "Chris", age: 30, img: "https://via.placeholder.com/300" },
  ]);

  const handleSwipe = (direction) => {
    console.log(`You swiped ${direction}`);
    setCards((prev) => prev.slice(1));
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe("left"),
    onSwipedRight: () => handleSwipe("right"),
  });

  return (
    <div className="flex justify-center items-center h-screen">
      {cards.length > 0 ? (
        <div
          {...handlers}
          className="relative w-80 h-96 bg-white shadow-lg rounded-lg"
        >
          <img
            src={cards[0].img}
            alt={cards[0].name}
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute bottom-0 w-full bg-gray-800 bg-opacity-75 p-4 text-white">
            <h3>{cards[0].name}, {cards[0].age}</h3>
          </div>
        </div>
      ) : (
        <h2>No more cards</h2>
      )}
    </div>
  );
};

export default SwipeCards;
