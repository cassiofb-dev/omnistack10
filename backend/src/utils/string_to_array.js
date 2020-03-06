module.exports = (array_as_string) => {
    return array_as_string.split(',').map(array_as_string => array_as_string.trim());
};