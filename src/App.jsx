import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Copy } from "lucide-react";

//! MARK: Main App Component
const App = () => {
  //! MARK: State Definitions
  const [type, setType] = useState("linear");
  const [style, setStyle] = useState("pastel");
  const [gradients, setGradients] = useState([]);
  const [page, setPage] = useState(1);

  //! MARK: Color Generation Logic
  const getBeautifulColor = (style = "vivid") => {
    let h = Math.floor(Math.random() * 360);
    let s, l;
    if (style === "pastel") {
      s = 60 + Math.random() * 20;
      l = 70 + Math.random() * 10;
    } else if (style === "vivid") {
      s = 80 + Math.random() * 20;
      l = 50 + Math.random() * 10;
    } else if (style === "unique") {
      s = 40 + Math.random() * 60;
      l = 40 + Math.random() * 40;
      h = Math.floor(Math.random() * 360);
    } else {
      s = 80;
      l = 60;
    }
    return `hsl(${h},${s}%,${l}%)`;
  };

  //! MARK: Gradient Generation Logic
  const GRADIENTS_PER_PAGE = 12;
  const generateGradient = (append = false) => {
    const colors = [];
    for (let i = 0; i < GRADIENTS_PER_PAGE; i++) {
      const color1 = getBeautifulColor(style);
      const color2 = getBeautifulColor(style);
      const degree = Math.floor(Math.random() * 360);
      const degreeString = `${degree}deg`;
      let gradient, css, tailwind;

      if (type === "linear") {
        gradient = `linear-gradient(${degreeString}, ${color1}, ${color2})`;
        css = `background: ${gradient};`;
        tailwind = `bg-[${gradient.replace(/\s+/g, "_")}]`;
      } else if (type === "radial") {
        gradient = `radial-gradient(circle, ${color1}, ${color2})`;
        css = `background: ${gradient};`;
        tailwind = `bg-[${gradient.replace(/\s+/g, "_")}]`;
      } else if (type === "conical") {
        const numColors = 3 + Math.floor(Math.random() * 3);
        const angleStep = 360 / numColors;
        const colorList = Array.from({ length: numColors }, (_, j) => {
          const start = j * angleStep;
          const end = (j + 1) * angleStep;
          return `${getBeautifulColor(style)} ${start}deg ${end}deg`;
        });
        gradient = `conic-gradient(${colorList.join(", ")})`;
        css = `background: ${gradient};`;
        tailwind = `bg-[${gradient.replace(/\s+/g, "_")}]`;
      }

      colors.push({ gradient, css, tailwind });
    }

    if (append) {
      setGradients((prev) => [...prev, ...colors]);
    } else {
      setGradients(colors);
    }
  };

  //! MARK: Copy Logic
  const onCopy = (code, label = "CSS") => {
    navigator.clipboard.writeText(code);
    toast.success(`${label} code copied!`, { position: "top-center" });
  };

  //! MARK: Effect - Regenerate gradients on type/style change
  useEffect(() => {
    generateGradient(false);
    setPage(1);
  }, [type, style]);

  //! MARK: Effect - Infinite Scroll Handler
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 100
      ) {
        setPage((prev) => {
          const next = prev + 1;
          generateGradient(true);
          return next;
        });
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [type, style, gradients]);

  //! MARK: Main Render
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-11/12 md:w-9/12 mx-auto space-y-8">
        {/* //! MARK: Header Section */}
        <div className="flex flex-col md:flex-row md:justify-between items-center p-6 rounded-xl bg-white shadow-md">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-0">
            🎨 Gradient Generator - {type}
          </h1>
          <div className="flex flex-wrap gap-3">
            <select
              value={type}
              className="border border-slate-300 bg-white rounded-lg w-[110px] p-2 text-sm shadow-sm"
              onChange={(e) => setType(e.target.value)}
            >
              <option value="linear">Linear</option>
              <option value="radial">Radial</option>
              <option value="conical">Conical</option>
            </select>
            <select
              value={style}
              className="border border-slate-300 bg-white rounded-lg w-[120px] p-2 text-sm shadow-sm"
              onChange={(e) => setStyle(e.target.value)}
            >
              <option value="pastel">Pastel</option>
              <option value="vivid">Vivid</option>
              <option value="unique">Unique</option>
            </select>
            <button
              className="px-6 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg font-medium shadow-md hover:scale-105 transition"
              onClick={() => generateGradient(false)}
            >
              Refresh
            </button>
          </div>
        </div>

        {/* //! MARK: Gradient Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gradients.map((item, index) => (
            <div
              key={index}
              className="h-[180px] rounded-xl relative shadow-md overflow-hidden 
                       transform transition duration-300 hover:scale-105 hover:shadow-xl"
              style={{ background: item.gradient }}
            >
              {/* Copy buttons always visible */}
              <div className="absolute bottom-3 right-3 flex gap-2">
                <button
                  onClick={() => onCopy(item.css, "CSS")}
                  className="flex items-center gap-1 bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white rounded text-xs py-1 px-2 transition"
                >
                  <Copy size={14} /> CSS
                </button>
                <button
                  onClick={() => onCopy(item.tailwind, "Tailwind")}
                  className="flex items-center gap-1 bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white rounded text-xs py-1 px-2 transition"
                >
                  <Copy size={14} /> Tailwind
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* //! MARK: Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default App;
