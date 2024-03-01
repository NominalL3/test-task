import axios from "axios";
import md5 from "md5";

const API_URL = "https://api.valantis.store:41000/";
const PASSWORD = "Valantis";
const MAX_RETRIES = 3; // Максимальное количество попыток повторения запроса

const generateAuthString = () => {
  const timestamp = new Date().toISOString().split("T")[0].replace(/-/g, "");
  return md5(`${PASSWORD}_${timestamp}`);
};

const makeRequestWithRetry = async (action, params, retries = MAX_RETRIES) => {
  try {
    const response = await axios.post(
      API_URL,
      {
        action,
        params,
      },
      {
        headers: {
          "X-Auth": generateAuthString(),
        },
      }
    );
    return response.data.result;
  } catch (error) {
    // Если ошибка 500 и остались попытки, повторяем запрос
    if (error.response?.status === 500 && retries > 0) {
      console.warn(`Retrying request for action ${action}, ${retries} retries left.`);
      return makeRequestWithRetry(action, params, retries - 1);
    }
    console.error(`Error fetching ${action}:`, error.response?.status);
    return null;
  }
};

export const fetchAllProductIds = async () => {
  return await makeRequestWithRetry("get_ids", {});
};

export const fetchProductData = async (productId) => {
  try {
    const result = await makeRequestWithRetry("get_items", { ids: [productId] });
    return result ? result[0] : null;
  } catch (error) {
    console.error(`Error fetching product data for id ${productId}:`, error);
    return null;
  }
};

export const filterProducts = async (searchTerm) => {
  try {
    const productPromise = makeRequestWithRetry("filter", { product: searchTerm });
    const pricePromise = makeRequestWithRetry("filter", {
      price: parseFloat(searchTerm).toFixed(1),
    });
    const brandPromise = makeRequestWithRetry("filter", { brand: searchTerm });

    const [productResult, priceResult, brandResult] = await Promise.all([
      productPromise,
      pricePromise,
      brandPromise,
    ]);

    const mergedResults = [
      ...new Set([
        ...(productResult || []),
        ...(priceResult || []),
        ...(brandResult || []),
      ]),
    ];
    return mergedResults;
  } catch (error) {
    console.error("Error filtering products:", error);
    return [];
  }
};
