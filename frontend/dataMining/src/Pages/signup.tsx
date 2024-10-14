import {useForm} from "react-hook-form"
import {useNavigate} from "react-router-dom";
import {useAuth} from "~/Context/useAuth.tsx";
import {useEffect, useState} from "react";
import {useMutation} from "@tanstack/react-query";
import {registerAPI} from "~/Services/AuthService.tsx";
import {toast} from "react-toastify";
import {Button} from "~/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "~/components/ui/form";
import {Input} from "~/components/ui/input";
import {Card, CardHeader, CardTitle, CardDescription, CardContent} from "~/components/ui/card";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "~/components/ui/select.tsx";


type FormValues = {
    email: string,
    password: string,
    age: number,
    department: string,
    branch: string,
    confirmPassword: string
}

// Dictionary for department options
const department: { [key: string]: string } = {
    'Aerospace Engineering': 'Aerospace Engineering',
    'Biological Sciences and Bioengineering': 'Biological Sciences and Bioengineering',
    'Civil Engineering': 'Civil Engineering',
    'Chemical Engineering': 'Chemical Engineering',
    'Chemistry': 'Chemistry',
    'Cognitive Science': 'Cognitive Science',
    'Computer Science and Engineering': 'Computer Science and Engineering',
    'Design': 'Design',
    'Economics': 'Economics',
    'Electrical Engineering': 'Electrical Engineering',
    'Environmental Engineering and Management': 'Environmental Engineering and Management',
    'Earth Science': 'Earth Science',
    'Humanities and Social Sciences': 'Humanities and Social Sciences',
    'Industrial and Management Engineering': 'Industrial and Management Engineering',
    'Laser Technology': 'Laser Technology',
    'Mathematics': 'Mathematics',
    'Mechanical Engineering': 'Mechanical Engineering',
    'Materials Science and Engineering': 'Materials Science and Engineering',
    'Mathematics and Statistics': 'Mathematics and Statistics',
    'Mathematics and Scientific Computing': 'Mathematics and Scientific Computing',
    'Materials Science Programme': 'Materials Science Programme',
    'Nuclear Engineering and Technology Programme': 'Nuclear Engineering and Technology Programme',
    'Physics': 'Physics',
    'Photonics Science and Engineering': 'Photonics Science and Engineering',
    'Statistics and Data Science': 'Statistics and Data Science',
    'Sustainable Energy Engineering': 'Sustainable Energy Engineering',
    'Space Science and Astronomy': 'Space Science and Astronomy',
    'Statistics': 'Statistics',
    'Others': 'Others'
}

// Dictionary for branch options
const branch: { [key: string]: string } = {
    'B.S.': 'B.S.',
    'B.S.-M.S.': 'B.S.-M.S.',
    'B.S.-M.B.A.': 'B.S.-M.B.A.',
    'B.S.-M.Tech': 'B.S.-M.Tech',
    'B.Tech.-M.S.': 'B.Tech.-M.S.',
    'B.Tech.-M.B.A.': 'B.Tech.-M.B.A.',
    'B.Tech.-M.Des.': 'B.Tech.-M.Des.',
    'B.Tech': 'B.Tech',
    'DIIT': 'DIIT',
    'Exchange Program': 'Exchange Program',
    'M.B.A.': 'M.B.A.',
    'M.Sc. (2 yr)': 'M.Sc. (2 yr)',
    'M.Sc. (Integrated)': 'M.Sc. (Integrated)',
    'M.Sc.-Ph.D. (Dual)': 'M.Sc.-Ph.D. (Dual)',
    'M.S. (Research)': 'M.S. (Research)',
    'M.Des.': 'M.Des.',
    'M.Tech': 'M.Tech',
    'M.Tech.-Ph.D.': 'M.Tech.-Ph.D.',
    'M.Tech. (Dual)': 'M.Tech. (Dual)',
    'PGPEX-VLM': 'PGPEX-VLM',
    'Ph.D': 'Ph.D',
    'Preparatory': 'Preparatory',
    'SURGE': 'SURGE',
    'eMasters': 'eMasters',
    'Others': 'Others'
}

export default function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });
    const form = useForm<FormValues>()
    const {
        register,
        setError,
        clearErrors,
        formState: {isValid}
    } = form

    const {registerUser} = useAuth();

    const {
        data,
        mutate,
        isSuccess,
    } = useMutation({
        mutationFn: (data: FormValues) => {
            return registerAPI(data.email, data.password, data.age, data.department, data.branch)
        },
        onError: (err) => {
            console.log(err);
            toast.error("Error Occurred please contact your Admin.");
        }
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
        // Check if passwords match dynamically while typing
        if (name === "confirmPassword" || name === "password") {
            if (formData.password !== value && name === "confirmPassword") {
                setError("password", {message: "Passwords do not match!"});
            } else if (formData.confirmPassword !== value && name === "password") {
                setError("password", {message: "Passwords do not match!"});
            } else {
                clearErrors("password"); // Clear error if passwords match
            }
        }
    };


    const onSubmit = async (data: FormValues) => {
        mutate(data)
    }

    useEffect(() => {
        if (isSuccess) {
            registerUser(data.data)
            navigate('/signin');
        }
    }, [data, isSuccess, navigate, registerUser])


    return (
        <div className="grid place-items-center h-screen">
            <Card className="max-w- mx-auto bg-white text-black">
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
                                            <Input type="password" {...field}
                                                   {...register("password", {
                                                       required: {
                                                           value: true,
                                                           message: "Password is required."
                                                       }
                                                   })}
                                                   onChange={handleInputChange}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field}
                                                   {...register("confirmPassword", {
                                                       required: {
                                                           value: true,
                                                           message: "Confirm Password is required."
                                                       }
                                                   })}
                                                   onChange={handleInputChange}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="age"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Age</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field}
                                                   {...register("age", {
                                                       required: {
                                                           value: true,
                                                           message: "Please enter your Age."
                                                       }
                                                   })}
                                                   onChange={(e) => field.onChange(parseInt(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="department"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Department</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a department"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent
                                                {...register("department", {
                                                    required: {
                                                        value: true,
                                                        message: "Please enter your Department."
                                                    }
                                                })}
                                            >
                                                {Object.entries(department).map(([key, value]) => (
                                                    <SelectItem key={key} value={key}>{value}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="branch"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Program</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a program"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent
                                                {...register("branch", {
                                                    required: {
                                                        value: true,
                                                        message: "Please enter your Branch."
                                                    }
                                                })}
                                            >
                                                {Object.entries(branch).map(([key, value]) => (
                                                    <SelectItem key={key} value={key}>{value}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                disabled={!isValid}
                            >
                                Sign Up
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}