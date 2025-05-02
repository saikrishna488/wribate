'use client';

import { useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAtom } from 'jotai';
import { userAtom } from '../states/globalStates';
import { usePathname } from 'next/navigation';

const Render = () => {
  const [user,setUser] = useAtom(userAtom);
  const path = usePathname();

  if(path.includes('/admin')){
    return null;
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/jwt`,{
            withCredentials: true
        });
        const data = res.data;

        console.log(data)

        if (data.res) {
          toast.success("Welcome " + data.user.name);
          setUser(data.user);
        }
      } catch (err) {
        console.log("Error fetching user:", err);
      }
    };

    if(!user._id){
        fetchUser();
    }
    
  }, []);

  return null;
};

export default Render;
