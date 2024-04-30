import { useEffect, useState } from 'react';
import ForceGraph from './force-graph';

const Home = () => {
  const [data, setData] = useState('');

  useEffect(() => {
    // Fetch the CSV data from the server
    fetch('/api/data')
      .then((response) => response.text())
      .then((csvData) => setData(csvData));
  }, []);

  return (
    <div>
      <h1>Force-Directed Graph</h1>
      {data && <ForceGraph data={data} />}
    </div>
  );
};

export default Home;