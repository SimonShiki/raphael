// ColorArray example:
// [[white, black, 0.4], white, 0.6]
// convert to [{color: white, proportion: 0.24}, {color: black, proportion: 0.6}, {color: white, proportion: 1}]

const flatGradient = (colorArray) => {
    const flattened = [];
    flatOnce(flattened, colorArray);
    
    let flag = 0;
    for (const itemId in flattened) {
        flag += flattened[itemId].proportion;
        flattened[itemId].proportion = flag;
    }
    
    return flattened;
};

const flatOnce = (flattened, colorArray, totalRatio = 1) => {
    if (Array.isArray(colorArray[0])) flatOnce(flattened, colorArray[0], totalRatio * colorArray[2]);
    else flattened.push({
        color: colorArray[0],
        proportion: totalRatio * colorArray[2]
    });
    
    if (Array.isArray(colorArray[1])) flatOnce(flattened, colorArray[1], totalRatio * (1 -  colorArray[2]));
    else flattened.push({
        color: colorArray[1],
        proportion: totalRatio * (1 -  colorArray[2])
    });
};

export {
    flatGradient
}