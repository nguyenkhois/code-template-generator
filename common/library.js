function filterByProperty(objectArray, sPropertyName, sSeekingValue) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(objectArray)) {
            reject(Error("Input data is not an array"));
            return;
        }

        resolve(objectArray.filter(objItem => objItem[sPropertyName] === sSeekingValue));
    });
}

module.exports = {
    filterByProperty
}