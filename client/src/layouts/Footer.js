import {
    Box, Typography
} from '@mui/material';
import BackBottomImage from '../assets/img/landing-bottom-back.png';

export default function Footer () {
    return (
        <Box
            sx={{
                border: '1px solid #CCD4F4',
                py: 4,
                // backgroundImage: `url(${BackBottomImage})`,
                // backgroundPosition: 'left bottom',
                // backgroundSize: '100%',
            }}
        >
            <Typography
                variant="subtitle2"
                sx={{
                    textAlign: 'center',
                }}
            >Tallyup © 2022. All Rights Reserved.</Typography>
        </Box>
    );
}