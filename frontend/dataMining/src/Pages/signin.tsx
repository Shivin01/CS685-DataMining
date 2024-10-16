import {useForm} from "react-hook-form"
import {useAuth} from "~/Context/useAuth.tsx";
import {Link, useNavigate} from "react-router-dom";
import {useMutation} from "@tanstack/react-query";
import {useEffect} from "react";
import {loginAPI} from "~/Services/AuthService.tsx";

import {Button} from "~/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "~/components/ui/form";
import {Input} from "~/components/ui/input";
import {Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter} from "~/components/ui/card";

export default function SignIn() {

    const navigate = useNavigate()
    const {loginUser} = useAuth();
    const form = useForm<FormValues>()
    const {
        register,
        setError
    } = form

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
        mutate(data)
    }

    return (
        <div className="grid place-items-center h-screen">
            <Card className="max-w-sm mx-auto bg-white text-black">
                <CardHeader>
                    <CardTitle>Sign In</CardTitle>
                    <CardDescription>Enter your credentials to access your account.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="email@example.com" {...field}
                                                   {...register("email", {
                                                       pattern: {
                                                           value:
                                                               /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9-]+)*$/,
                                                           message: "Invalid email"
                                                       },
                                                       required: {
                                                           value: true,
                                                           message: "Email is required."
                                                       }
                                                   })}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="********" {...field}
                                                   {...register("password", {
                                                       required: {
                                                           value: true,
                                                           message: "Password is required."
                                                       }
                                                   })}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Sign In</Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter>
                    <span className="m-auto dark:text-gray-400">Do not have an account?
                        &nbsp;<Link className="font-semibold text-indigo-600 dark:text-indigo-100" to="/signup">Create Account</Link>
                </span>
                </CardFooter>
            </Card>
        </div>
    );
}