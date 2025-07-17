// // // // import React from "react";

// // // // const TopHeader = () => {
// // // //   return (
// // // //     <>
// // // //       <div style={headerStyle}>
// // // //         <span>TopHeader Text</span>
// // // //       </div>
// // // //       <style>
// // // //         {`
// // // //           @keyframes gradientMove {
// // // //             0% {
// // // //               background-position: 0% 50%;
// // // //             }
// // // //             50% {
// // // //               background-position: 100% 50%;
// // // //             }
// // // //             100% {
// // // //               background-position: 0% 50%;
// // // //             }
// // // //           }
// // // //         `}
// // // //       </style>
// // // //     </>
// // // //   );
// // // // };

// // // // const headerStyle = {
// // // //   width: "100%",
// // // //   height: "20px",
// // // //   display: "flex",
// // // //   alignItems: "center",
// // // //   justifyContent: "flex-end",
// // // //   color: "white",
// // // //   background:
// // // //     "linear-gradient(90deg, #6e7e91, #5a6c8a, #455674, #5a6c8a, #6e7e91)",
// // // //   backgroundSize: "200% 200%",
// // // //   animation: "gradientMove 5s ease infinite",
// // // //   margin: "0",
// // // //   paddingLEft: "10px",
// // // //   paddingRight: "10px",
// // // // };

// // // // export default TopHeader;

// // // import React, { useState, useEffect } from "react";

// // // const TopHeader = () => {
// // //   const [colors, setColors] = useState([
// // //     "#6e7e91",
// // //     "#5a6c8a",
// // //     "#455674",
// // //     "#5a6c8a",
// // //     "#6e7e91",
// // //   ]);

// // //   useEffect(() => {
// // //     const generateRandomColor = () => {
// // //       return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
// // //     };

// // //     const updateColors = () => {
// // //       const newColors = Array.from({ length: 5 }, generateRandomColor);
// // //       setColors(newColors);
// // //     };

// // //     const intervalId = setInterval(updateColors, 1000);

// // //     return () => clearInterval(intervalId); // Cleanup interval on component unmount
// // //   }, []);

// // //   const headerStyle = {
// // //     width: "100%",
// // //     height: "20px",
// // //     display: "flex",
// // //     alignItems: "center",
// // //     justifyContent: "flex-end",
// // //     color: "white",
// // //     background: `linear-gradient(90deg, ${colors.join(", ")})`,
// // //     backgroundSize: "200% 200%",
// // //     animation: "gradientMove 5s ease infinite",
// // //     margin: "0",
// // //     paddingLeft: "10px",
// // //     paddingRight: "10px",
// // //   };

// // //   return <div style={headerStyle}>TopHeader Text</div>;
// // // };

// // // export default TopHeader;

// // import React, { useState, useEffect } from "react";

// // const TopHeader = () => {
// //   const [colors, setColors] = useState([
// //     "#f0f8ff",
// //     "#e6f7ff",
// //     "#d9f2ff",
// //     "#ccf5ff",
// //     "#c2efff",
// //   ]);

// //   useEffect(() => {
// //     const generateLightColor = () => {
// //       const randomValue = () => Math.floor(Math.random() * 56) + 200; // 200 to 255
// //       const r = randomValue();
// //       const g = randomValue();
// //       const b = randomValue();
// //       return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
// //     };

// //     const updateColors = () => {
// //       const newColors = Array.from({ length: 5 }, generateLightColor);
// //       setColors(newColors);
// //     };

// //     const intervalId = setInterval(updateColors, 1000);

// //     return () => clearInterval(intervalId); // Cleanup interval on component unmount
// //   }, []);

// //   const headerStyle = {
// //     width: "100%",
// //     height: "20px",
// //     display: "flex",
// //     alignItems: "center",
// //     justifyContent: "flex-end",
// //     color: "white",
// //     background: `linear-gradient(90deg, ${colors.join(", ")})`,
// //     backgroundSize: "200% 200%",
// //     animation: "gradientMove 5s ease infinite",
// //     margin: "0",
// //     paddingLeft: "10px",
// //     paddingRight: "10px",
// //   };

// //   return <div style={headerStyle}>TopHeader Text</div>;
// // };

// // export default TopHeader;

// import React, { useState, useEffect } from "react";

// const TopHeader = () => {
//   const [colors, setColors] = useState([
//     "#a3d5d3",
//     "#8aa6c1",
//     "#3b6978",
//     "#d4a5a5",
//     "#e27d60",
//   ]);

//   useEffect(() => {
//     const generateColorInRange = (min, max) => {
//       const randomValue = () =>
//         Math.floor(Math.random() * (max - min + 1)) + min;
//       const r = randomValue();
//       const g = randomValue();
//       const b = randomValue();
//       return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
//     };

//     const generateSpecificColor = () => {
//       const colorRanges = [
//         { min: [0, 100, 0], max: [50, 255, 50] }, // Green shades
//         { min: [0, 0, 100], max: [50, 50, 255] }, // Blue shades
//         { min: [0, 50, 100], max: [50, 150, 200] }, // Dark Blue + Green
//         { min: [50, 0, 50], max: [150, 50, 150] }, // Purple shades
//         { min: [200, 100, 0], max: [255, 150, 100] }, // Orange shades
//         { min: [255, 182, 193], max: [255, 192, 203] }, // Pink shades
//       ];

//       const range = colorRanges[Math.floor(Math.random() * colorRanges.length)];
//       return generateColorInRange(range.min[0], range.max[0]);
//     };

//     const updateColors = () => {
//       const newColors = Array.from({ length: 5 }, generateSpecificColor);
//       setColors(newColors);
//     };

//     const intervalId = setInterval(updateColors, 1000);

//     return () => clearInterval(intervalId); // Cleanup interval on component unmount
//   }, []);

//   const headerStyle = {
//     width: "100%",
//     height: "20px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "flex-end",
//     color: "white",
//     background: `linear-gradient(90deg, ${colors.join(", ")})`,
//     backgroundSize: "200% 200%",
//     animation: "gradientMove 5s ease infinite",
//     margin: "0",
//     paddingLeft: "10px",
//     paddingRight: "10px",
//   };

//   return <div style={headerStyle}>TopHeader Text</div>;
// };

// export default TopHeader;
