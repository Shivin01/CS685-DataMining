import {useForm} from "react-hook-form"
import {useAuth} from "~/Context/useAuth.tsx";
import {Link, useNavigate} from "react-router-dom";
import {useMutation} from "@tanstack/react-query";
import {useEffect} from "react";
import {loginAPI} from "~/Services/AuthService.tsx";

import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "~/components/ui/card";

export default function SignIn() {

    const navigate = useNavigate()
    const {loginUser} = useAuth();
    const form = useForm<FormValues>()
    const {
        register,
        handleSubmit,
        formState,
        setError
    } = form

    const {errors} = formState;

    type FormValues = {
        email: string,
        password: string
    }

    const {
        data,
        error,
        isError,
        mutate,
        isSuccess,
        isPending
    } = useMutation({
        mutationFn: (data: FormValues) => {
            return loginAPI(data.email, data.password)
        },
    })


    useEffect(() => {
        if (isSuccess) {
            // Fetch user training data.
            loginUser(data.data)
            navigate('/');
        }
    }, [data, isSuccess, navigate, loginUser])

    useEffect(() => {
        //TODO: Check agar message mein email and password, Either email or password is wrong.
        if (isError) {
            setError("password", {
                message: "Wrong password"
            });
        }
    }, [error, isError, setError])

    const onSubmit = async (data: FormValues) => {
        console.log('data', data);
        // mutate(data)
    }

    // return (
    //     <div className="bg-gray-50 h-screen dark:bg-gray-800">
    //         <div className="flex min-h-[80vh] flex-col justify-center py-12 sm:px-6 lg:px-8">
    //             <div className="text-center sm:mx-auto sm:w-full sm:max-w-md">
    //                 <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
    //                     Sign in
    //                 </h1>
    //             </div>
    //             <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
    //                 <div className="bg-white dark:bg-gray-700 px-4 pb-4 pt-8 sm:rounded-lg sm:px-10 sm:pb-6 sm:shadow">
    //                     <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
    //                         <div>
    //                             <label htmlFor="email"
    //                                    className="block text-sm font-medium text-gray-700 dark:text-white">Email
    //                                 address</label>
    //                             <div className="mt-1">
    //                                 <input id="email" type="text" data-testid="email" required
    //                                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-300 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 sm:text-sm"
    //                                        {...register("email", {
    //                                            pattern: {
    //                                                value:
    //                                                    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9-]+)*$/,
    //                                                message: "Invalid email"
    //                                            },
    //                                            required: {
    //                                                value: true,
    //                                                message: "Email is required."
    //                                            }
    //                                        })}
    //                                 />
    //                                 <p className="dark:text-red-500">{errors.email?.message}</p>
    //                             </div>
    //                         </div>
    //                         <div>
    //                             <label htmlFor="password"
    //                                    className="block text-sm font-medium text-gray-700 dark:text-white">Password</label>
    //                             <div className="mt-1">
    //                                 <input id="password" type="password" data-testid="password" required
    //                                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-300 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 sm:text-sm"
    //                                        {...register("password", {
    //                                            required: {
    //                                                value: true,
    //                                                message: "Password is required."
    //                                            }
    //                                        })} />
    //                                 <p className="text-red-600 dark:text-red-500">{errors.password?.message}</p>
    //                             </div>
    //                         </div>
    //                         {/*<div className="flex items-center justify-between">*/}
    //                         {/*    <div className="flex items-center">*/}
    //                         {/*        <input id="remember_me" name="remember_me" type="checkbox"*/}
    //                         {/*               className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:text-white dark:border-gray-600 dark:focus:ring-indigo-400 disabled:cursor-wait disabled:opacity-50"/>*/}
    //                         {/*        <label htmlFor="remember_me"*/}
    //                         {/*               className="ml-2 block text-sm text-gray-900 dark:text-white">Remember*/}
    //                         {/*            me</label>*/}
    //                         {/*    </div>*/}
    //                         {/*    <div className="text-sm">*/}
    //                         {/*        <a className="font-medium text-indigo-400 hover:text-indigo-500" href="">*/}
    //                         {/*            Forgot your password?*/}
    //                         {/*        </a>*/}
    //                         {/*    </div>*/}
    //                         {/*</div>*/}
    //                         <div>
    //                             <button data-testid="login" type="submit"
    //                                     disabled={isPending}
    //                                     className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-700 dark:border-transparent dark:hover:bg-indigo-600 dark:focus:ring-indigo-400 dark:focus:ring-offset-2 disabled:cursor-wait disabled:opacity-50">
    //                         <span className="absolute inset-y-0 left-0 flex items-center pl-3">
    //                             <svg className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
    //                                  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
    //                                  aria-hidden="true">
    //                                 <path fillRule="evenodd"
    //                                       d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
    //                                       clipRule="evenodd"></path>
    //                             </svg>
    //                         </span>
    //                                 Sign In
    //                             </button>
    //                         </div>
    //                     </form>
    //                     <div className="m-auto mt-6 w-fit md:mt-8">
    //             <span className="m-auto dark:text-gray-400">Do not have an account?
    //                 &nbsp;<Link className="font-semibold text-indigo-600 dark:text-indigo-100" to="/signup">Create Account</Link>
    //             </span>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // )

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>Enter your credentials to access your account.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" noValidate>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="email@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="********" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full">Sign In</Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter>
                {/*<Button variant="link" onClick={onToggleForm} className="w-full">*/}
                <Button variant="link" className="w-full">
                    Don't have an account? Sign Up
                </Button>
            </CardFooter>
        </Card>
    );
}