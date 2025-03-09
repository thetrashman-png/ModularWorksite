export const generateRandomString = (length = 10) => {
    return Math.random().toString(36).substring(2, 2 + length);
};

export const formatResponse = (success, message, data = null, statusCode = 200) => ({
    statusCode,
    success,
    message,
    data
});