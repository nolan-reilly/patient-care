// File used to describe the general color themes of our App
import { createTheme } from '@mui/material/styles'

// Primary and Secondary colors that can be called in MUI components
const theme = createTheme({
    palette: {
        primary: {
            main: '#0F248D'
        },
        secondary: {
            main: '#008836'
        }
    }
});

export default theme;
