Array.prototype.findIndexByProperty = function (sPropertyName, sPropertyValue) {
    try {
        return this.findIndex(objItem => objItem[sPropertyName] === sPropertyValue);
    } catch (err) { return err; }
};

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
};
