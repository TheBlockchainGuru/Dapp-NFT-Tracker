import * as React from 'react';
import {
    Box,
    Button,
    Stack, 
    Typography,
    CardHeader,
    useMediaQuery
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Footer from '../../layouts/Footer';
import BackImage from '../../assets/img/landing_back.png';
import RectangleImage from '../../assets/img/Rectangle.png';
import BackCardImage from '../../assets/img/landing-card-back.png';
import DashboardImage from '../../assets/img/dashboard.png';
import MetamaskImage from '../../assets/img/metamask.png';
import WalletImage from '../../assets/img/wallet.png';
import RoninImage from '../../assets/img/Ronin.png';
import TaxImage from '../../assets/img/tax.png';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

const wallets = [
    { icon: MetamaskImage, title: 'My Primary Wallet', subTitle: '0xbdAD235eBF188a...10aF' },
    { icon: RoninImage, title: 'Ronin-1', subTitle: '0xbdAD235eBF0xb...041b' }
]

const cards = [
    [
        { title: 'Total Revenue', price: '20.58' },
        { title: 'Total Cost Basis', price: '6.17' }
    ],[
        { title: 'Realized Short Term Gains', price: '+12' },
        { title: 'Realized Long Term Gains', price: '+2.41' }
    ],[
        { title: 'Total Realized Gains', price: '+14.41' },
        { title: 'Realized ROI', price: '+233.55%' }
    ]
]

export default function Landing () {
    const theme = useTheme();
    const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                pt: 24,
                // backgroundImage: `url(${BackImage})`, 
                                // linear-gradient(180deg, rgba(255, 255, 255, 0.31) 0%, rgba(255, 255, 255, 0.56) 46.49%, #FFFFFF 100%),
                                // linear-gradient(180deg, #FFFFFF -12.02%, rgba(255, 255, 255, 0.72) 54.25%, rgba(255, 255, 255, 0.27) 124.79%)`,
                backgroundSize: 'auto auto, auto 100%, auto auto',
                backgroundPosition: 'top left, top left, bottom left',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <Box
                sx={{
                    maxWidth: 1024,
                    mx: 'auto',
                    px: matchUpMd ? 0 : 2, 
                }}
            >
                <Stack flexDirection={matchUpMd ? "row" : "column"} alignItems="center" justifyContent="center">
                    <Typography variant="h1" sx={{ textAlign: 'center' }}>Get clear on your&nbsp;</Typography>
                    <Typography variant="h1"
                        sx={{
                            textAlign: 'center',
                            background: 'linear-gradient(to right, #FC00FF, #00DBDE)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >NFT profits</Typography>
                </Stack>
                <Box sx={{ pt: 3 }}>
                    <Typography variant="body1" sx={{ textAlign: 'center' }}>Instantly see revenue, cost, gas, taxable gains, and more in one place</Typography>
                </Box>
                <Stack alignItems="center" justifyContent="center" sx={{ pt: 4, pb: 7 }}>
                    <Button
                        size="large" 
                        variant="contained"
                        onClick={() => navigate('signup')}
                        sx={{ bgcolor: '#000', py: 2, px: 6 }}
                    >Sign Up Free</Button>
                </Stack>
                <Box
                    sx={{
                        borderRadius: 2.5,
                        background: 'linear-gradient(to bottom,  #B4C5FF, #EAEFFF)',
                        padding: '1px',
                        // borderImageSource: 'linear-gradient(to bottom, #B4C5FF, #EAEFFF)',
                    }}
                >
                    <Box
                        sx={{
                            background: 'transparent',
                            borderRadius: 2,
                            p: 2,
                        }}
                    >
                        <Box 
                            component="img" 
                            src={DashboardImage}
                            sx={{
                                width: '100%',
                                borderRadius: 2
                            }}
                        />
                    </Box>
                </Box>
                <Stack
                    flexDirection={matchUpMd ? "row" : "column"}
                    alignItems="center"
                    gap={matchUpMd ? 20 : 4}
                    sx={{
                        py: 12
                    }}
                >
                    <Typography variant="h3" flex={1} sx={{ textAlign: 'center' }}>Display mints, buys, sells, <strong>transfers across multiple wallets in one view</strong></Typography>
                    <Box
                        flex={1}
                        sx={{
                            border: '1px solid #DFE9FF',
                            borderRadius: 2,
                            p: matchUpMd ? 2 : 1,
                        }}
                    >
                        <Box
                            sx={{
                                py: matchUpMd ? 4 : 2,
                                px: matchUpMd ? 6 : 3,
                                backgroundImage: `url(${RectangleImage})`,
                                borderRadius: 1
                            }}
                        >
                            <Stack sx={{ bgcolor: '#FFFFFF', borderRadius: 1 }}>
                                <CardHeader 
                                    avatar={
                                        <Box component="img" src={WalletImage} />
                                    }
                                    title={<Typography variant="subtitle1">Display All Wallets</Typography>}
                                    subheader={<Typography variant="caption">1 Wallet Connected</Typography>}
                                    sx={{
                                        '& .MuiCardHeader-action': {
                                            alignSelf: 'center'
                                        },
                                        '& .MuiCardHeader-content': {
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }
                                    }}
                                    action={
                                        <ArrowDropUpIcon fontSize="small" sx={{ color: '#9DA7B5' }} />
                                    }
                                />
                                {wallets.map((element, key) => 
                                <CardHeader
                                    key={key}
                                    avatar={
                                        <Box src={element.icon} component="img" />
                                    }
                                    sx={{
                                        '& .MuiCardHeader-action': {
                                            alignSelf: 'center'
                                        },
                                        '& .MuiCardHeader-content': {
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }
                                    }}
                                    action={
                                        <Stack flexDirection="row" gap={1}>
                                            <EditIcon fontSize='small' sx={{ color: '#9DA7B5' }} />
                                            <DeleteIcon fontSize='small' sx={{ color: '#9DA7B5' }} />
                                        </Stack>
                                    }
                                    title={<Typography variant="subtitle1">{element.title}</Typography>}
                                    subheader={<Typography variant="caption">{element.subTitle}</Typography>}
                                />                            
                                )}
                            </Stack>
                        </Box>
                    </Box>
                </Stack>
                <Stack
                    gap={matchUpMd ? 20 : 4}
                    flexDirection={matchUpMd ? "row" : "column-reverse"}
                    alignItems="center"
                >
                    <Stack flex={1} gap={matchUpMd ? 2.5 : 1}>
                    {cards.map((row, key) =>
                        <Stack key={key} flexDirection="row" gap={matchUpMd ? 2.5 : 1} sx={{ width: '100%' }}>
                        {row.map((element, k) => 
                            <CardHeader
                                sx={{
                                    flex: 1,
                                    background: '#FFFFFF',
                                    border: '1px solid #F0F4FD',
                                    boxShadow: '5px 5px 13px rgba(70, 155, 255, 0.08)',
                                    borderRadius: 1,
                                    py: 3,
                                    px: matchUpMd ? 2 : 1
                                }}
                                key={k}
                                title={<Typography variant="subtitle2">{element.title}</Typography>}
                                subheader={
                                    <Stack flexDirection="row" alignItems="flex-end" gap={.5} sx={{ pt: 1 }}>
                                        <Typography variant="h5" sx={{ lineHeight: 1, color: '#08BD80' }}>{element.price}</Typography>
                                        <Typography variant="caption" sx={{ lineHeight: 1 }}>{ k == 1 && key == 2 ? '': 'ETH' }</Typography>
                                    </Stack>                               
                                }
                            />
                        )}
                        </Stack>
                    )}
                    </Stack>
                    <Typography flex={1} variant="h3">Get simple profit and loss stats at a glance</Typography>
                </Stack>
                <Box sx={{ pt: matchUpMd ? 8 : 4, pb: matchUpMd ? 25 : 12}}>
                    <Box sx={{ pb: 4 }}>
                        <Typography variant="h3" sx={{ textAlign: 'center' }}>Track <strong>taxable gains</strong> (or losses) effortlessly</Typography>
                    </Box>
                    <Box
                        sx={{
                            border: '1px solid #DFE9FF',
                            p: 1,                                
                            borderRadius: 2,
                            background: 'rgba(255, 255, 255, 0.6)',
                        }}
                    >
                        <Box 
                            sx={{
                                backgroundImage: `url(${BackCardImage})`,
                                backgroundSize: '100% 100%',
                                backgroundRepeat: 'no-repeat',
                                borderRadius: 1,
                                bgcolor: 'rgba(255, 255, 255, 0.6)',
                                p: matchUpMd ? 8 : 2
                            }}
                        >
                            <Box component="img" src={TaxImage} sx={{ width: '100%', height: '100%', borderRadius: 1 }} />
                        </Box>
                    </Box>
                </Box>
                <Box 
                    sx={{ 
                        pt: matchUpMd ? 8 : 4,
                    }}
                >
                    <Typography variant="h3" sx={{ textAlign: 'center' }}>
                        And that's just the beginning... 🔮<br />
                        Getting started is easy (and free)!
                    </Typography>
                    <Stack justifyContent="center" alignItems="center" sx={{ pb: 12, pt: 4}}>
                        <Button 
                            size="large" 
                            variant="contained"
                            onClick={() => navigate('signup')}
                            sx={{ bgcolor: '#000', py: 2, px: 6 }}>Create Account</Button>
                    </Stack>
                </Box>
            </Box>
            <Footer />
        </Box>
    );
}