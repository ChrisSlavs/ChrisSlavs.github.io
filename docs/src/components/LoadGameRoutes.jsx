import { Route } from "react-router-dom";

const LoadGameRoutes = (gamesObject) => {
  const arr = Object.values(gamesObject[Object.keys(gamesObject)[0]]); // Convert the games object into an array of game data

  return (
    <>
      {arr.map((element, key) => (
        <Route
          key={key}
          path={`/casino/games/${element.route}`}
          element={element.component}
        />
      ))}
    </>
  );
}

export default LoadGameRoutes;