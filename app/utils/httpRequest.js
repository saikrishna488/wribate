import { default as toast } from 'react-hot-toast';

/**
 * Global HTTP request wrapper.
 * @param {Function} requestFn - A function that returns a Promise (e.g. an Axios call).
 * @param {Function|null} errorHandler - Optional custom error handler.
 * @returns {Promise<any|null>}
 */
const httpRequest = async (requestFn, errorHandler = null,msg) => {
  try {
    const res = await requestFn;

    // Axios usually returns data under res.data
    const data = res?.data;

    if (data?.res) {
      msg && toast.success(msg)
      return data;
    } else {
      toast.error(data?.msg || 'Unexpected response structure.');
      return null; // Make it clear that it failed
    }

  } catch (err) {
    if (errorHandler) {
      return errorHandler(err);
    }

    console.error('HTTP Error:', err);

    // Extract error message from Axios if available
    const message = err?.response?.data?.msg || err.message || 'Something went wrong!';
    toast.error(message);

    return null;
  }
};

export default httpRequest;
