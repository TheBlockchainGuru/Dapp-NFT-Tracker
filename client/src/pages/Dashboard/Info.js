import React from 'react';
import {
    Box,
    Stack,
    CardHeader,
    Skeleton,
    Typography,
    useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';

const cards = [
    { title: 'Total Revenue', price: 0 },
    { title: 'Total Cost Basis', price: 0 },
    { 
        title: 'Realized Short Term Gains', 
        price: 0
    },
    { 
        title: 'Realized Long Term Gains', 
        price: 0 
    },
    { 
        title: 'Total Realized Gains', 
        price: 0
    },
    { 
        title: 'Realized ROI', 
        price: 0
    }
]

export default function Info ({nfts, loading}) {
    const theme = useTheme();
    const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));
    const matchUpSm = useMediaQuery(theme.breakpoints.up('sm'));
    const { wallet } = useSelector((state) => state.userReducer);

    const [glanceCards, setGlanceCards] = React.useState(cards);

    React.useEffect(() => {
        let totalRevenue = 0, 
            totalCost = 0, 
            shortTerm = 0, 
            longTerm = 0,  
            totalGains = 0, 
            roi = 0;
        if (wallet !== '') {
            for (let i  in nfts) {
                const nft = nfts[i]

                if ( nft.node.type.toLowerCase() === 'mint') {
                    totalCost += (Number(nft.node.gastotal) + Number(nft.node.value))
                    if ((new Date().getTime() - new Date (nft.node.estimatedConfirmedAt).getTime()) > 365 * 1440 * 60000 ) {
                        longTerm -= (Number(nft.node.gastotal) + Number(nft.node.value))
                    } else {
                        shortTerm -= (Number(nft.node.gastotal) + Number(nft.node.value))
                    }
                } else if (nft.node.type.toLowerCase() === 'order') {
                    if (nft.node.toAddress.toLowerCase() === wallet.toLowerCase()) {
                        totalCost += (Number(nft.node.value) + Number(nft.node.gastotal))
                        if ((new Date().getTime() - new Date (nft.node.estimatedConfirmedAt).getTime()) > 365 * 1440 * 60000 ) {
                            longTerm -= (Number(nft.node.gastotal) + Number(nft.node.value))
                        } else {
                            shortTerm -= (Number(nft.node.gastotal) + Number(nft.node.value))
                        }
                    } else {
                        totalRevenue += (Number(nft.node.value))
                        if ((new Date().getTime() - new Date (nft.node.estimatedConfirmedAt).getTime()) > 365 * 1440 * 60000 ) {
                            longTerm += (Number(nft.node.value))
                        } else {
                            shortTerm += (Number(nft.node.value))
                        }
                    }
                } else {
                    if (nft.node.fromAddress.toLowerCase() === wallet.toLowerCase()) {
                        totalCost += (Number(nft.node.gastotal))
                        
                        if ((new Date().getTime() - new Date (nft.node.estimatedConfirmedAt).getTime()) > 365 * 1440 * 60000 ) {
                            longTerm -= (Number(nft.node.gastotal))
                        } else {
                            shortTerm -= (Number(nft.node.gastotal))
                        }
                    }
                }
            }
        }

        totalGains = totalRevenue - totalCost;
        const newCards = [...glanceCards];
        newCards[0].price = totalRevenue.toFixed(4);
        newCards[1].price = totalCost.toFixed(4);
        newCards[2].price = shortTerm.toFixed(4);
        newCards[3].price = longTerm.toFixed(4);
        newCards[4].price = totalGains.toFixed(4);
        newCards[5].price = (totalGains / totalCost * 100).toFixed(2)

        setGlanceCards(newCards);
    }, [nfts.length])

    return (
        <Box>
            <Typography variant="h3">At a glance</Typography>
            <Stack 
                flexDirection="row" 
                gap={matchUpMd ? 1 : 0 } 
                sx={{ 
                    py: 3 ,
                    display: matchUpMd ? 'flex' : 'grid',
                    gridTemplateColumns: matchUpMd ? 'repeat(3, 33.33%)' : 'repeat(2, 50%)',
                }}
            >
            {glanceCards.map((element, key) => 
                <CardHeader
                    sx={{
                        flex: 1,
                        background: '#FFFFFF',
                        border: '1px solid #F0F4FD',
                        borderRadius: 1,
                        py: 3,
                        px: matchUpMd ? 2 : 1,
                        m: matchUpMd ? 0 : .5,
                    }}
                    key={key}
                    title={<Typography variant="subtitle2" sx={{ fontWeight: 400 }}>{element.title}</Typography>}
                    subheader={
                        loading 
                        ?
                            <Skeleton />
                        :
                            <Stack flexDirection="row" alignItems="flex-end" gap={.5} sx={{ pt: 1 }}>
                                <Typography variant="h5" sx={{ lineHeight: 1, color: (element.price >= 0) ? '#08BD80' : '#ED4545' }}>{element.price}</Typography>
                                <Typography variant="caption" sx={{ lineHeight: 1 }}>{ key == 5 ? '%': 'ETH' }</Typography>
                            </Stack>                               
                    }
                />
            )}
            </Stack>
        </Box>
    );
}