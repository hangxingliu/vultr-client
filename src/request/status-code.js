//@ts-check

const ERROR_MESSAGE_MAP = {
	200: 'Function successfully executed.',
	400: 'Invalid API location. Check the URL that you are using.',
	403: 'Invalid or missing API key. Check that your API key is present and matches your assigned key.',
	405: 'Invalid HTTP method. Check that the method (POST|GET) matches what the documentation indicates.',
	412: 'Request failed. Check the response body for a more detailed description.',
	500: 'Internal server error. Try again at a later time.',
	503: 'Rate limit hit. API requests are limited to an average of 2/s. Try your request again later.',
};
const DEFAULT_ERROR_MESSAGE = 'Unknown error result code.';

module.exports = { getStatusCodeMessage };

/**
 * @param {number} statusCode
 * @returns {string}
 */
function getStatusCodeMessage(statusCode) {
	if (statusCode in ERROR_MESSAGE_MAP)
		return ERROR_MESSAGE_MAP[statusCode];
	return DEFAULT_ERROR_MESSAGE;
}
