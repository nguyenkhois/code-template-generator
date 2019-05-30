const stringHelper = {
    firstCharToUpperCase (sString) {
        try {
            if (sString && sString.length > 0) {
                return sString.charAt(0).toUpperCase() + sString.slice(1);
            }

            return null;
        } catch (e) { console.error(e); }
    }
};

module.exports = { stringHelper };