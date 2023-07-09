import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import NotFound from './NotFound';

const Reset = () => {

  const [password, setPassword] = useState("")
  const [passwords, setPasswords] = useState("")

  const { id, token } = useParams();

  const navigate = useNavigate();

  const [data, setData] = useState(false)

  useEffect(() => {
    const getData = async () => {
      await axios.get(`/users/${id}/forgot/${token}`).then(res => {
        if (res.data.success) {
          setData(true)
        } else {
          setData(false)
        }
      })
    }
    getData();
  })

  const handleChangePass = (e) => {
    setPasswords(e.target.value)
  };

  const handleChange = (e) => {
    setPassword(e.target.value)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password === passwords) {
      await axios.put(`/users/reset/${id}`, { password: password }).then(res => {
        if (res.data.success) {
          toast.success(res.data.message)
          setTimeout(() => {
            navigate("/login")
          }, 2000);
        }
        else {
          toast.error(res.data.error)
        }
      })
    } else {
      toast.error("Password and confirm password not matched")
      setPassword("")
      setPasswords("")
    }
  };

  return (
    <>
      {data ? <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Reset Password</h2>

        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-confirm-password"
                    required
                    value={passwords}
                    onChange={handleChangePass}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
        <Toaster />
      </div> : <NotFound />}
    </>
  );
};

export default Reset;
