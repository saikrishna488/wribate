import axios from "axios";
import toast from "react-hot-toast";

const fetchCountries = async () => {
    try {
        // const res = await axios.get('https://restcountries.com/v3.1/all?fields=name');
        const response = await axios.get(
            process.env.NEXT_PUBLIC_BACKEND_URL + "/user/getCountries"
        );
        // Sort countries alphabetically by name
        const sortedCountries = response.data.data
            ?.map((country) => country.countryName)
            .sort((a, b) => a.localeCompare(b));

        return sortedCountries;
    } catch (err) {
        console.log(err);
        toast.error("Error fetching countries");
    }
};

export default fetchCountries;