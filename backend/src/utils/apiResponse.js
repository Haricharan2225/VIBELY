/**
 * Send standard success response
 * @param {import('express').Response} res
 * @param {*} data
 * @param {string} message
 * @param {number} statusCode
 */
export const successResponse = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * Send standard error response
 * @param {import('express').Response} res
 * @param {string} message
 * @param {number} statusCode
 * @param {*} error
 */
export const errorResponse = (res, message = 'Internal Server Error', statusCode = 500, error = null) => {
  const response = {
    success: false,
    message
  };

  if (error !== null && error !== undefined) {
    response.error = process.env.NODE_ENV === 'production' && typeof error === 'string'
      ? error
      : (process.env.NODE_ENV === 'production' ? undefined : error);
  }

  return res.status(statusCode).json(response);
};
