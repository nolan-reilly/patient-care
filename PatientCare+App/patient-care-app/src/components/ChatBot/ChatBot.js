import React, { useState, useEffect } from 'react';
import { Button, CircularProgress } from '@mui/material';
import './ChatBot.css';
import Robot from "./hollow-chatbot.svg"
import Exit from "./exit.png";
import CloseIcon from '@mui/icons-material/Close';

import { GoogleGenerativeAI } from '@google/generative-ai';
const API_KEY = "AIzaSyAo0VxaWvwbqiiy8m52pCyFR8i4cepQQsc";

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const ChatBot = ({ lastHealthData }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [aiText, setAiText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [displayText, setDisplayText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    // Quick way to change the speed of the typing animation
    const TYPING_SPEED = 30;
    const CHARS_PER_FRAME = 4;

    useEffect(() => {
        if (aiText && currentIndex < aiText.length) {
            const timer = setTimeout(() => {
                const nextChars = aiText.slice(currentIndex, currentIndex + CHARS_PER_FRAME);
                setDisplayText(prev => prev + nextChars);
                setCurrentIndex(currentIndex + CHARS_PER_FRAME);
            }, TYPING_SPEED);

            return () => clearTimeout(timer);
        }
    }, [aiText, currentIndex]);

    const handleToggle = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setDisplayText('');
            setCurrentIndex(0);
        }
    };

    const handleGenerateText = async () => {
        try {
            setIsLoading(true);
            setDisplayText('');
            setCurrentIndex(0);

            const prompt = `You are an AI healthcare bot, who gives safe and simple advice on how to improve ones health.
                            You will be given a JSON string of data containing 4-parameter: Glucose (mg/dL), Heart Rate (bpm), Blood Sugar (mg/dL), Blood Pressure (mmHg).
                            You must give a respectful response meant for the person receiving the health recommendation that points out the data of concern and what
                            can be done to possibly help stabilize that data point in terms of life style choices.
                            Exclude typography emphasis in your response, this response it being printed out as a string in a program. Also user nextline characters for grouping ideas.
                            The response must only be directed to the user about their data, no response should be given to this prompt.
                            The reponse must be short and concise, no more than 200 characters.

                            Here is the JSON that you are meant to respond to: ${JSON.stringify(lastHealthData)}`;
            
            const result = await model.generateContent(prompt);
            setAiText(result.response.text());
        } catch (error) {
            console.error('Error generating AI content:', error);
            setAiText('An error occurred while generating content.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            {!isOpen ? (
                <div className="chat-circle" onClick={handleToggle}>
                    <img src={Robot} className="chatbot-icon" alt="Chatbot Icon" />
                </div>
            ) : (
                <div className={`chat-container ${isOpen ? 'open' : ''}`}>
                    <button className="close-button" onClick={handleToggle}>
                        <CloseIcon sx={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            color: 'rgba(0, 0, 0, 0.54)',
                            transition: 'color 0.2s ease, transform 0.2s ease',
                            cursor: 'pointer',
                            '&:hover': {
                                color: 'rgba(0, 0, 0, 0.87)',
                                transform: 'scale(1.1)'
                            }
                        }} />
                    </button>
                    <div className="chat-output">
                        {isLoading ? (
                            <div className="loading-container">
                                <CircularProgress color="inherit" size={30} />
                            </div>
                        ) : (
                            <div className="typewriter-text">
                                {displayText}
                            </div>
                        )}
                    </div>

                    <Button
                        className="analyze-btn"
                        onClick={handleGenerateText} 
                        disabled={isLoading}
                        color="primary"
                        variant="contained"
                        sx={{
                            padding: '12px 0px',
                            marginTop: '12px', 
                            fontWeight: 'bold', 
                            border: 'none',
                            borderRadius: '8px', 
                            width: '100%', 
                            height: '45px',
                            '&:disabled': {
                                backgroundColor: 'gray',
                                color: 'white'
                            }
                        }}
                    >
                        {isLoading ? 'Analyzing...' : 'Analyze My Data'}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ChatBot;
