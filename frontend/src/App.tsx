import { useEffect, useState } from "react";
import axios from "axios";
function App() {
  const [backendResponse, setbackendResponse] = useState();
  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_URL!)
      .then((res) => setbackendResponse(res.data.data));
  }, []);
  return <div>Backend Response is: {backendResponse}</div>;
}

export default App;
