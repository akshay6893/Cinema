import Functions from "./Pages/functions/Functions";
import {BrowserRouter,Routes,Route} from "react-router-dom";

function App() {
  return (                                     
    <div className="App">
      <BrowserRouter basename="/">
        <Routes> 
          <Route path="/" element={<Functions/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
