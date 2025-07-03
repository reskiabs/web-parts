import * as React from "react";
import { useHistory } from "react-router-dom";

const HomePage: React.FC = () => {
  const history = useHistory();

  const handleGoToDocument = (): void => {
    history.push("/document");
  };

  return (
    <div>
      <h1>Home Page</h1>
      <button onClick={handleGoToDocument}>Go to Document Page</button>
    </div>
  );
};

export default HomePage;
