// components/Home.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Card, CardHeader, CardContent, CardFooter } from "~/components/ui/card";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
import { useAuth } from '../contexts/AuthContext';

const API_URL = 'http://localhost:8000'; // Replace with your FastAPI backend URL

interface VideoSubmission {
    video_path: string;
    is_real: boolean;
    reason: string;
}

const Home: React.FC = () => {
    const [currentVideo, setCurrentVideo] = useState<string | null>(null);
    const [isReal, setIsReal] = useState<boolean | null>(null);
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { logout } = useAuth();

    const fetchNextVideo = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/get-next-video`);
            if (response.data.video_path) {
                setCurrentVideo(response.data.video_path);
            } else {
                setCurrentVideo(null); // No more videos
            }
        } catch (error) {
            console.error('Error fetching next video:', error);
            setError('Failed to fetch the next video. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNextVideo();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (isReal === null || !currentVideo) return;

        try {
            const submission: VideoSubmission = {
                video_path: currentVideo,
                is_real: isReal,
                reason,
            };
            await axios.post(`${API_URL}/submit-video`, submission);
            // Reset form and fetch next video
            setIsReal(null);
            setReason('');
            fetchNextVideo();
        } catch (error) {
            setError('Failed to submit video. Please try again.');
            console.error('Submission error:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!currentVideo) {
        return (
            <div className="container mx-auto p-4">
                <Card className="w-full max-w-2xl mx-auto">
                    <CardContent>
                        <h2 className="text-2xl font-bold mb-4">All videos processed</h2>
                        <p>Thank you for your contributions!</p>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" onClick={handleLogout}>Log Out</Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <h2 className="text-2xl font-bold">Video Authentication</h2>
                </CardHeader>
                <CardContent>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <video src={currentVideo} controls className="w-full mb-4" />
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <RadioGroup value={isReal?.toString()} onValueChange={(value) => setIsReal(value === 'true')}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="true" id="real" />
                                    <Label htmlFor="real">Real</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="false" id="fake" />
                                    <Label htmlFor="fake">Fake</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        <div className="mb-4">
                            <Textarea
                                placeholder="Reason for your decision"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit">Submit</Button>
                    </form>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" onClick={handleLogout}>Log Out</Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Home;