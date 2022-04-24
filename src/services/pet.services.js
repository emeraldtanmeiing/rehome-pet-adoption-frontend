import axios from 'axios';
import {apiURL} from '../helpers/url';

export const fetchPets = async () => {
    const url = apiURL('/pets');
    console.log({url})
    // const { accessToken } = useSession();
  
    try {
      const response = await axios({
        method: 'GET',
        url: url,
        // data: omitBy({ filters: filters, pagination, sorting }, isNil),
        // headers: { 'Authorization': `Bearer ${accessToken}` }
      })
      console.log({response})
  return response;
    //   return !isEmpty(response) ? response : [];
    }
    catch (err) {
        console.log({err})
    //   const { error } = err.response?.data || {};
  
    //   if (!isEmpty(error)) {
    //     const callback = async () => await fetchOrderById(filters, pagination, sorting);
    //     const { value, code, message, stack } = await errorHandler.response(error, { callback });
    //     return { error: { value, code, message, stack } };
    //   }
    //   else {
    //     console.log(err.message)
    //     return { error: { message: err.message } };
    //   }
    }
  }