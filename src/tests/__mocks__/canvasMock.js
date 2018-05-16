module.exports = {
  getContext: () => {
    return {
      clearRect: () => {},
      drawImage: () => {},
      beginPath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      stroke: () => {},
      arc: () => {},
      fill: () => {},
    }
  },
  getBoundingClientRect: () => {
    return {
      left: 1000,
      top: 1000
    }
  },
  width: 100,
  height: 100
};