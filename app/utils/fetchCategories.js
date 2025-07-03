import axios from "axios";
import toast from "react-hot-toast";

const fetchCategories = async () => {
    try {
        const res = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + '/user/getallcategories')

        const data = res.data

        if (data.res) {
            return data.categories
        }
    }
    catch (err) {
        console.log(err);
        toast.error("error occured")
    }
}

export default fetchCategories;