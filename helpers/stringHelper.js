const stringHelper = {
    firstCharToUpperCase (sString) {
        try {
            if (sString && sString.length > 0) {
                return sString.charAt(0).toUpperCase() + sString.slice(1);
            }

            return null;
        } catch (err) { console.error(err); }
    }
};

module.exports = { stringHelper };