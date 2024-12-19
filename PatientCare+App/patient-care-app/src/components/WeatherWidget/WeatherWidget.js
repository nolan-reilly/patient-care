import { useEffect } from 'react';
import {  Grid2} from '@mui/material';

const WeatherWidget = () => {
    useEffect(() => {
        const scriptId = 'weatherwidget-io-js';

        // Check if the script already exists
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.src = 'https://weatherwidget.io/js/widget.min.js';
            script.async = true;
            script.id = scriptId;
            document.body.appendChild(script);

            // Force reinitialization after the script is loaded
            script.onload = () => {
                if (window.__weatherwidget_init) {
                    window.__weatherwidget_init();
                }
            };
        } else {
            // Reinitialize if script already exists
            if (window.__weatherwidget_init) {
                window.__weatherwidget_init();
            }
        }

        return () => {
            // Optionally remove the script and clean up (not necessary if the widget is reused)
        };
    }, []);

    return (
        <Grid2 container spacing={4}
            sx={{
                marginTop: '50px', // margin top
                justifyContent: 'center', // Center the widget
            }}
        >
            <div>
                <a
                    className="weatherwidget-io"
                    href="https://forecast7.com/en/41d88n87d63/chicago/"
                    data-label_1="CHICAGO"
                    data-label_2="WEATHER"
                    data-theme="original"
                >
                    CHICAGO WEATHER
                </a>
            </div>
        </Grid2>
    );
};

export default WeatherWidget;
