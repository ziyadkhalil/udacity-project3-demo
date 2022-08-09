import { useEffect, useState } from "react";
import axios from "axios";
const fetchData = async () =>
  (await axios.get(process.env.REACT_APP_API_URL!)).data.data;

function App() {
  const [backendResponse, setbackendResponse] = useState();
  useEffect(() => {
    fetchData().then(setbackendResponse);
  }, []);
  return <div>Backend Response is: {backendResponse}</div>;
}

export default App;
