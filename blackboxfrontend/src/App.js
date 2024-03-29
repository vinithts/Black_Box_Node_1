import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Router from "./Router";
import { ThemeProvider } from "./Components/Context/Theme";
import '../src/Style.css';

function App() {
  return (
  <ThemeProvider>
    <BrowserRouter>
      <div
        className="App"
        style={{ background: "#171721", minHeight: "100vh" }}
      >
        <Router />
        <ToastContainer />
      </div>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
