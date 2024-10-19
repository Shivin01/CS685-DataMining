import {useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod';
import {Button} from "~/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "~/components/ui/form";
import {Input} from "~/components/ui/input";
import {RadioGroup, RadioGroupItem} from "~/components/ui/radio-group";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "~/components/ui/card.tsx";
import {useMutation, useQuery} from "@tanstack/react-query";
import {fetchVideo, saveVideoResponse} from "~/Services/videos.tsx";
import {toast} from "react-toastify";
import { Progress } from "~/components/ui/progress"

const formSchema = z.object({
    is_real: z.boolean({
        required_error: "You need to select if the video is real or fake.",
    }).refine(value => value === true || value === false, {
        message: "You need to select if the video is real or fake.",
    }),
    reason: z.string().min(1, "Reason is required").max(500, "Reason must not exceed 500 characters"),
});

type FormSchemaType = {
    is_real: boolean,
    reason: string,
}

type FormValues = {
    video_id: string;
    is_real: boolean,
    reason: string,

}

const HomePage = () => {
    const {
        data,
        isFetching,
        error,
        isError
    } = useQuery({
        queryKey: ['video'],
        queryFn: () => {
            return fetchVideo()
        },
    })

    const {
        mutate,
        isSuccess
    } = useMutation({
        mutationFn: (data: FormValues) => {
            return saveVideoResponse(data.video_id, data.is_real, data.reason);
        },
    })

    useEffect(() => {
        if (isError) {
            toast.error('Error occurred while fetching videos. Please contact the admin');
            console.log(error);
            // window.location.reload();
        }
    }, [isError]);


    useEffect(() => {
        if (isSuccess) {
            toast.success('Success');
            window.location.reload();
        } else {
            form.reset();
        }
    }, [isSuccess]);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            is_real: true,
            reason: '',
        },
    });

    const onSubmit = (SubmitData: FormSchemaType) => {
        if (data?.data) {
            mutate({...SubmitData, "video_id": data.data.video_id});
        } else {
            toast.error('Error');
            form.reset();
        }
    };


    if (isFetching) {
        const seconds = new Date().getTime() / 1000;
        return (<div className="grid place-items-center">
            <h1> Loading videos...</h1>
            <Progress value={seconds} />
        </div>);
    }

    return data ? (
        <div className="grid place-items-center">
            <br />
            <Card className="max-w-screen-lg mx-auto bg-white text-black">
                <CardHeader>
                    <CardTitle>Additional Info</CardTitle>
                    <CardDescription>Enter your Additional Information.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="container mx-auto p-4">
                        <h1 className="text-2xl font-bold mb-4">Video Assessment</h1>
                        <div className="mb-4">
                            <h2 className="text-xl mb-2">Video</h2>
                            <video
                                src={`/videos/${data.data.video_title}`}
                                controls
                                className="max-w max-w-lg mx-auto mb-4 h-1/2"
                            />
                        </div>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="is_real"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Is this video real or fake?</FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={(value) => {
                                                        // Convert the string value to a boolean
                                                        field.onChange(value === "true"); // true if 'real', false if 'fake'
                                                    }}
                                                    defaultValue={'true'}
                                                    className="flex flex-col space-y-1"
                                                >
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="real"/>
                                                        </FormControl>
                                                        <FormLabel className="font-normal">
                                                            Real
                                                        </FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="fake"/>
                                                        </FormControl>
                                                        <FormLabel className="font-normal">
                                                            Fake
                                                        </FormLabel>
                                                    </FormItem>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="reason"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Why do you think so?</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your comment here" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit">Submit</Button>
                            </form>
                        </Form>
                    </div>
                </CardContent>
            </Card>
        </div>

    ) : (<div className="grid place-items-center">
        <h1> Failed to load videos. Please contact the admin.</h1>
    </div>);
};

export default HomePage;