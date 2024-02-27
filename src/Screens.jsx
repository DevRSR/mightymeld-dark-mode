import { useState } from "react";
import confetti from "canvas-confetti";
import * as icons from "react-icons/gi";
import { Tile } from "./Tile";

export const possibleTileContents = [
  icons.GiHearts,
  icons.GiWaterDrop,
  icons.GiDiceSixFacesFive,
  icons.GiUmbrella,
  icons.GiCube,
  icons.GiBeachBall,
  icons.GiDragonfly,
  icons.GiHummingbird,
  icons.GiFlowerEmblem,
  icons.GiOpenBook,
];

export function StartScreen({ start }) {
  return (
    <div className="flex items-center justify-center w-full h-screen dark:bg-slate-800">
      <div className="flex flex-col items-center w-80 h-72 bg-pink-50 rounded-md pt-12 dark:bg-pink-900">
        <h1 className="text-3xl text-pink-500 mb-4 font-bold dark:text-pink-50">
          Memory
        </h1>
        <p className="text-pink-500 dark:text-pink-50">
          Flip over tiles looking for pairs
        </p>
        <button
          onClick={start}
          className="bg-pink-500 text-white px-10 py-1 rounded-full shadow-md cursor-pointer hover:bg-pink-600 mt-8 dark:bg-rose-500 dark:hover:bg-rose-600"
        >
          Play
        </button>
      </div>
    </div>
  );
}

export function PlayScreen({ end }) {
  const [tiles, setTiles] = useState(null);
  const [tryCount, setTryCount] = useState(0);

  const getTiles = (tileCount) => {
    // Throw error if count is not even.
    if (tileCount % 2 !== 0) {
      throw new Error("The number of tiles must be even.");
    }

    // Use the existing list if it exists.
    if (tiles) return tiles;

    const pairCount = tileCount / 2;

    // Take only the items we need from the list of possibilities.
    const usedTileContents = possibleTileContents.slice(0, pairCount);

    // Double the array and shuffle it.
    const shuffledContents = usedTileContents
      .concat(usedTileContents)
      .sort(() => Math.random() - 0.5)
      .map((content) => ({ content, state: "start" }));

    setTiles(shuffledContents);
    return shuffledContents;
  };

  const flip = (i) => {
    // Is the tile already flipped? We don’t allow flipping it back.
    if (tiles[i].state === "flipped") return;

    // How many tiles are currently flipped?
    const flippedTiles = tiles.filter((tile) => tile.state === "flipped");
    const flippedCount = flippedTiles.length;

    // Don't allow more than 2 tiles to be flipped at once.
    if (flippedCount === 2) return;

    // On the second flip, check if the tiles match.
    if (flippedCount === 1) {
      setTryCount((c) => c + 1);

      const alreadyFlippedTile = flippedTiles[0];
      const justFlippedTile = tiles[i];

      let newState = "start";

      if (alreadyFlippedTile.content === justFlippedTile.content) {
        confetti({
          ticks: 100,
          origin: {
            y: 0.75
          }
        });
        newState = "matched";
      }

      // After a delay, either flip the tiles back or mark them as matched.
      setTimeout(() => {
        setTiles((prevTiles) => {
          const newTiles = prevTiles.map((tile) => ({
            ...tile,
            state: tile.state === "flipped" ? newState : tile.state,
          }));

          // If all tiles are matched, the game is over.
          if (newTiles.every((tile) => tile.state === "matched")) {
            setTimeout(end, 0);
          }

          return newTiles;
        });
      }, 1000);
    }

    setTiles((prevTiles) => {
      return prevTiles.map((tile, index) => ({
        ...tile,
        state: i === index ? "flipped" : tile.state,
      }));
    });
  };

  return (
    <>
      <div className="flex items-center justify-center w-full h-screen dark:bg-slate-800">
        <div className="flex flex-col gap-8 items-center w-80 h-80">
          <div className="flex gap-2">
            <p className="text-indigo-500 dark:text-indigo-100">Tries</p>
            <div className="px-2.5 py-0 rounded-md bg-indigo-200 font-medium text-indigo-700 dark:bg-indigo-800 dark:text-indigo-100">
              {tryCount}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3 p-4 bg-indigo-50 rounded-md flex-1 w-full dark:bg-indigo-700">
            {getTiles(16).map((tile, i) => (
              <Tile key={i} flip={() => flip(i)} {...tile} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
