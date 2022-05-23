const getColorCodes = (colorArray) => {
  const colorCodes = colorArray.map((c) => {
    let code;
    switch (c) {
      case "White":
        code = "#FFF";
        break;
      case "Brown":
        code = "#481F01";
        break;
      case "Black":
        code = "#0d0e0f";
        break;
      case "Grey":
        code = "#E0E0E0";
        break;
      case "Golden":
        code = "#926F34";
        break;
      case "Cream":
        code = "#FFFDD0";
        break;
      default:
        code = c;
    }
    return code;
  });

  return colorCodes
};

export default getColorCodes;
