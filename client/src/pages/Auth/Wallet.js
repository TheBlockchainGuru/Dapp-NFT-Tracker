import {
    Box,
    Stack,
    Typography
} from '@mui/material';
import WalletBoxImage from '../../assets/img/wallet-box.png';

export default function Wallet () {
    return (
        <Box
            sx={{
                bgcolor: '#F2F4FD',
                maxWidth: 600,
                m: 'auto'
            }}
        >
            <Box component="img" src={WalletBoxImage} sx={{ width: '100%' }} />
        </Box>
    );
}