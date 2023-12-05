import React from 'react';

function News() {
  return (
    <div>
      <h2>News</h2>
      <p>This is the News page. Content related to news will go here.</p>
      {/* Add more content and structure as needed */}
    </div>
  );
}

export default News;



// function App() {
//   const [currentTime, setCurrentTime] = useState(0);

//   useEffect(() => {
//     fetch('/api/time').then(res => res.json()).then(data => {
//       setCurrentTime(data.time);
//     });
//   }, []);

//   return (
//                 <p>The current time is {currentTime}.</p>
