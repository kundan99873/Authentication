import axios from 'axios'
import React from 'react'
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom'

export default function VerifyUser() {
  const { id, token } = useParams();
  const navigate = useNavigate();

  const handleClick = async () => {
    console.log(`/${id}/verify/${token}`)
    await axios.put(`/users/${id}/verify/${token}`).then(res => {
      toast.success(res.data.message)
      setTimeout(() => {
        navigate("/login")
      }, [2000])
      // console.log(res)
      // console.log(res.data)
    })
  }
  return (
    // -->   /user/${user._id}/token/${userToken}
    <div className='flex justify-center items-center min-h-screen'>

      <button onClick={handleClick} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
        Click here to Verify
      </button>
      <Toaster />
    </div>
  )
}
