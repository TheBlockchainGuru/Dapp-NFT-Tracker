import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
    Box, 
    Stack, 
    Paper,
    Table,
    Skeleton,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Tooltip,
    Pagination,
    Link,
    Button,
    useMediaQuery
} from '@mui/material';

import { useTheme } from '@mui/material/styles';

import { getPinataUrl } from '../../utils/Apis/common';
import { makeWalletAddress, convertDate } from '../../utils';

import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';

const temp = [1,2,3,4,5,6,7,8,9,0]

export default function History ({nfts, loading}) {
    const { wallets, wallet } = useSelector((state) => state.userReducer);
    // const [allevents, setAllEvents] = React.useState([]);
    // const [filteredEvents, setFilteredEvents] = React.useState([]);
    // const [pageCount, setPageCount] = React.useState(1);
    // const [perPage, setPerPage] = React.useState(10);
    // const [itemCount, setItemCount] = React.useState(0);
    // const [filter, setFilter] = React.useState('All');

    const theme = useTheme();
    const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));

    const [realNfts, setRealNfts] = React.useState([]);

    const { timeFrame, actionType, perPage, currentPage } = useSelector(state => state.userReducer);

    const dispatch = useDispatch();
    
    const onChangePerPage = (element) => {
        dispatch({type: 'SET_PER_PAGE', payload: parseInt(element.target.value)});
        dispatch({type: 'SET_CURRENT_PAGE', payload: 1});
    }

    const onChangePageCount = (element, page) => {
        dispatch({type: 'SET_CURRENT_PAGE', payload: page});
    }

    const onChangeFilter = (value) => {

        dispatch({type: 'SET_ACTION_TYPE', payload: value.target ? value.target.value : value});
        dispatch({ type: 'SET_CURRENT_PAGE', payload: 1 });
    }

    React.useEffect(() => {
        const newNfts = nfts.filter((element) => {
            switch (actionType) {
                case 'mint':
                    return element.node.type.toLowerCase() === 'mint'
                case 'transfer': 
                    return element.node.type.toLowerCase() == 'transfer'
                case 'all':
                    return true;
                case 'buy':
                    return (
                        element.node.type.toLowerCase() == 'order' &&
                        element.node.toAddress.toLowerCase() == wallet.toLowerCase()
                    )
                case 'sell':
                    return (
                        element.node.type.toLowerCase() == 'order' &&
                        element.node.fromAddress.toLowerCase() == wallet.toLowerCase()
                    )
                default:
                    return false;
            }
        })

        setRealNfts(newNfts)

        dispatch({type: 'SET_GAINS_TYPE', payload: 'all'});
    }, [nfts.length, loading, actionType])

    return (
        <Box>
            <Stack 
                flexDirection="row" 
                gap={2} 
                alignItems="center"
                sx={{
                    display: matchUpMd ? 'flex' : 'none',
                    '& button': {
                        color: '#9DA7B5'
                    }
                }}
            >
                <Typography variant="subtitle2">Activity Type:</Typography>
                <Button onClick={() => onChangeFilter('all')} sx={{ color: actionType === 'all' ? '#2D81F7 !important' : 'inherit' }}>All</Button>
                <Button onClick={() => onChangeFilter('mint')} sx={{ color: actionType === 'mint' ? '#2D81F7 !important' : 'inherit' }}>Mints</Button>
                <Button onClick={() => onChangeFilter('buy')} sx={{ color: actionType === 'buy' ? '#2D81F7 !important' : 'inherit' }}>Bought</Button>
                <Button onClick={() => onChangeFilter('sell')} sx={{ color: actionType === 'sell' ? '#2D81F7 !important' : 'inherit' }}>Sells</Button>
                <Button onClick={() => onChangeFilter('transfer')} sx={{ color: actionType === 'transfer' ? '#2D81F7 !important' : 'inherit' }}>Transfers</Button>
            </Stack>
            <Stack
                flexDirection="row"
                alignItems="center"
                sx={{
                    display: matchUpMd ? 'none' : 'flex'
                }}
            >
                <Typography variant="subtitle2">Activity Type :&nbsp;</Typography>
                <Box 
                    component="select" 
                    onChange={onChangeFilter} 
                    value={actionType}
                    
                    sx={{
                        color: '#18181B',
                        borderColor: '#D7DCE3',
                        fontSize: 13,
                        borderRadius: 1,
                        p: .5
                    }}
                >
                    <option value="all">All</option>
                    <option value="mint">Mints</option>
                    <option value="buy">Bought</option>
                    <option value="sell">Sells</option>
                    <option value="transfer">Transfers</option>
                </Box>
            </Stack>
            <Stack sx={{ py: matchUpMd ? 4 : 1, borderBottom: '1px solid #D7DCE3' }}>
                <TableContainer component={Paper} 
                    sx={{
                        display: matchUpMd ? 'block' : 'none',
                        border: 0, boxShadow: 'none' 
                    }}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow 
                                sx={{ 
                                    '& td, th': { 
                                        px: 0,
                                        fontFamily: 'PlusJakartaSansMedium', 
                                        border: 0, 
                                        color: '#9DA7B5' 
                                    } 
                                }}
                            >
                                <TableCell><Typography variant="subtitle2">DATE</Typography></TableCell>
                                <TableCell><Typography variant="subtitle2">COLLECTION</Typography></TableCell>
                                <TableCell><Typography variant="subtitle2">ITEM</Typography></TableCell>
                                <TableCell><Typography variant="subtitle2">ACTIVITY</Typography></TableCell>
                                <TableCell><Typography variant="subtitle2">SENT FROM</Typography></TableCell>
                                <TableCell><Typography variant="subtitle2">SENT TO</Typography></TableCell>
                                <TableCell><Typography variant="subtitle2">REVENUE</Typography></TableCell>
                                <TableCell><Typography variant="subtitle2">COST</Typography></TableCell>
                                <TableCell><Typography variant="subtitle2">GAS</Typography></TableCell>
                                <TableCell><Typography variant="subtitle2">OTHER FEES</Typography></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {!loading 
                        ? 
                        (realNfts.length 
                        ?
                            realNfts.slice((currentPage - 1) * perPage, currentPage * perPage).map((element, key) => 
                            <TableRow
                                key={key}
                                sx={{ '& td, th': { border: 0, px: 0 } }}
                            >
                                <TableCell>
                                    <Typography variant="subtitle2">{convertDate(element.node.estimatedConfirmedAt)}</Typography>
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    <Stack flexDirection="row" alignItems="center" gap={1}>
                                        <Box 
                                            component="img" 
                                            src={element.node.contract.unsafeOpenseaImageUrl} 
                                            sx={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: 1
                                            }}
                                        />
                                        <Typography variant="subtitle2">{element.node.contract.name}</Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Stack flexDirection="row" alignItems="center" gap={1}>
                                        <Box sx={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 1
                                        }} component="img" src={getPinataUrl(element.node.token.images.length ? element.node.token.images[0].url : element.node.contract.unsafeOpenseaImageUrl)} />
                                        <Typography variant="subtitle2">{element.node.token.name ? element.node.token.name : element.node.contract.name + '#' + element.node.token.tokenId}</Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    {element.node.type.toLowerCase().includes('mint')
                                    ?      
                                        <Stack flexDirection="row" alignItems="center" gap={.5}>
                                            <DownloadIcon fontSize='small' sx={{ color: '#2D81F7' }} />
                                            <Typography variant="subtitle2" sx={{ color: '#2D81F7' }}>Mint</Typography>
                                        </Stack>
                                    :   element.node.type.toLowerCase().includes('order')
                                    ?    
                                        (element.node.toAddress.toLowerCase() == wallet.toLowerCase()
                                        ?
                                            <Stack flexDirection="row" alignItems="center" gap={.5}>
                                                <DownloadIcon fontSize='small' sx={{ color: '#ED4545' }} />
                                                <Typography variant="subtitle2" sx={{ color: '#ED4545' }}>Bought</Typography>
                                            </Stack>
                                        :
                                            <Stack flexDirection="row" alignItems="center" gap={.5}>
                                                <UploadIcon fontSize='small' sx={{ color: '#08BD80' }} />
                                                <Typography variant="subtitle2" sx={{ color: '#08BD80' }}>Sold</Typography>
                                            </Stack>
                                        )
                                    :   element.node.type.toLowerCase().includes('transfer')
                                    ?   
                                        (element.node.toAddress.toLowerCase() == wallet.toLowerCase()
                                        ?
                                            <Stack flexDirection="row" alignItems="center" gap={.5}>
                                                <DownloadIcon fontSize='small' />
                                                <Typography variant="subtitle2">Transfer In</Typography>
                                            </Stack>
                                        :      
                                            <Stack flexDirection="row" alignItems="center" gap={.5}>
                                                <UploadIcon fontSize='small' />
                                                <Typography variant="subtitle2">Transfer Out</Typography>
                                            </Stack>
                                        )
                                    :   <></>
                                    }
                                </TableCell>
                                <TableCell>
                                    <Tooltip title={element.node.fromAddress ? element.node.fromAddress : '-'}>
                                        <Typography variant="subtitle2">{element.node.fromAddress ? makeWalletAddress(element.node.fromAddress, 6, 3) : '-' }</Typography>
                                    </Tooltip>
                                </TableCell>
                                <TableCell>
                                    <Tooltip title={element.node.toAddress ? element.node.toAddress : '-'}>
                                        <Typography variant="subtitle2">{element.node.toAddress ? makeWalletAddress(element.node.toAddress, 6, 3) : '-'}</Typography>
                                    </Tooltip>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2">
                                    {
                                    element.node.type.toLowerCase() === 'order' && element.node.fromAddress.toLowerCase() === wallet.toLowerCase() 
                                    ?   (Number(element.node.value)).toFixed(4)
                                    :   '-'
                                    }
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2">
                                    {
                                    element.node.type.toLowerCase() === 'mint'
                                    ?   (Number(element.node.value) + Number(element.node.gastotal)).toFixed(4)
                                    :   element.node.type.toLowerCase() === 'order' && element.node.toAddress.toLowerCase() === wallet.toLowerCase() 
                                    ?   (Number(element.node.value) + Number(element.node.gastotal)).toFixed(4)
                                    :   element.node.type.toLowerCase() == 'transfer' && element.node.fromAddress.toLowerCase() == wallet.toLowerCase()
                                    ?   (Number(element.node.gastotal)).toFixed(4)
                                    :   '-'
                                    }
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2">
                                    {
                                    (element.node.type.toLowerCase() == 'mint' ||
                                    (element.node.type.toLowerCase() == 'transfer' && element.node.fromAddress.toLowerCase() == wallet.toLowerCase()) ||
                                    (element.node.type.toLowerCase() == 'order' && element.node.toAddress.toLowerCase() == wallet.toLowerCase()))
                                    ?   Number(element.node.gastotal).toFixed(4)
                                    :   '-'
                                    }
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2">-</Typography>
                                </TableCell>
                            </TableRow>
                            )
                        :   <></>
                        )
                        :
                            temp.map((element, key) => 
                                <TableRow 
                                    key={key}
                                    sx={{ '& td, th': { border: 0, pl: 0 } }}
                                >
                                    <TableCell><Skeleton variant="rectangular" height={20} sx={{ borderRadius: 1 }} /></TableCell>
                                    <TableCell><Skeleton variant="rectangular" height={20} sx={{ borderRadius: 1 }} /></TableCell>
                                    <TableCell><Skeleton variant="rectangular" height={20} sx={{ borderRadius: 1 }} /></TableCell>
                                    <TableCell><Skeleton variant="rectangular" height={20} sx={{ borderRadius: 1 }} /></TableCell>
                                    <TableCell><Skeleton variant="rectangular" height={20} sx={{ borderRadius: 1 }} /></TableCell>
                                    <TableCell><Skeleton variant="rectangular" height={20} sx={{ borderRadius: 1 }} /></TableCell>
                                    <TableCell><Skeleton variant="rectangular" height={20} sx={{ borderRadius: 1 }} /></TableCell>
                                    <TableCell><Skeleton variant="rectangular" height={20} sx={{ borderRadius: 1 }} /></TableCell>
                                    <TableCell><Skeleton variant="rectangular" height={20} sx={{ borderRadius: 1 }} /></TableCell>
                                    <TableCell><Skeleton variant="rectangular" height={20} sx={{ borderRadius: 1 }} /></TableCell>
                                </TableRow>
                            )
                        }
                        </TableBody>
                    </Table>
                </TableContainer>
                <Stack
                    sx={{
                        display: matchUpMd ? 'none' : 'flex',
                    }}
                >
                {realNfts.length
                ? 
                    realNfts.slice((currentPage - 1) * perPage, currentPage * perPage).map((element, key) => 
                        <Stack
                            key={key}
                            gap={1}
                            sx={{
                                '&:hover' : {
                                    bgcolor: '#F0F4FD'
                                },
                                borderTop: '1px solid #D7DCE3',
                                py  : 1
                            }}
                        >
                            <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="subtitle2" sx={{ textTransform: 'uppercase' }}>Date</Typography>
                                <Typography variant="subtitle2">{convertDate(element.node.estimatedConfirmedAt)}</Typography>
                            </Stack>
                            <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="subtitle2" sx={{ textTransform: 'uppercase' }}>Link</Typography>
                                <Stack flexDirection="row" alignItems="center" gap={1}>
                                    <Box 
                                        component="img" 
                                        src={element.node.contract.unsafeOpenseaImageUrl} 
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 1
                                        }}
                                    />
                                    <Typography variant="subtitle2">{element.node.contract.name}</Typography>
                                </Stack>
                            </Stack>
                            <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="subtitle2" sx={{ textTransform: 'uppercase' }}>Item</Typography>
                                <Stack flexDirection="row" alignItems="center" gap={1}>
                                    <Box sx={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 1
                                    }} component="img" src={getPinataUrl(element.node.token.images.length ? element.node.token.images[0].url : element.node.contract.unsafeOpenseaImageUrl)} />
                                    <Typography variant="subtitle2">{element.node.token.name ? element.node.token.name : element.node.contract.name + '#' + element.node.token.tokenId}</Typography>
                                </Stack>
                            </Stack>
                            <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="subtitle2" sx={{ textTransform: 'uppercase' }}>Activity</Typography>
                                {element.node.type.toLowerCase().includes('mint')
                                ?      
                                    <Stack flexDirection="row" alignItems="center" gap={.5}>
                                        <DownloadIcon fontSize='small' sx={{ color: '#2D81F7' }} />
                                        <Typography variant="subtitle2" sx={{ color: '#2D81F7' }}>Mint</Typography>
                                    </Stack>
                                :   element.node.type.toLowerCase().includes('order')
                                ?    
                                    (element.node.toAddress.toLowerCase() == wallet.toLowerCase()
                                    ?
                                        <Stack flexDirection="row" alignItems="center" gap={.5}>
                                            <DownloadIcon fontSize='small' sx={{ color: '#ED4545' }} />
                                            <Typography variant="subtitle2" sx={{ color: '#ED4545' }}>Bought</Typography>
                                        </Stack>
                                    :
                                        <Stack flexDirection="row" alignItems="center" gap={.5}>
                                            <UploadIcon fontSize='small' sx={{ color: '#08BD80' }} />
                                            <Typography variant="subtitle2" sx={{ color: '#08BD80' }}>Sold</Typography>
                                        </Stack>
                                    )
                                :   element.node.type.toLowerCase().includes('transfer')
                                ?   
                                    (element.node.toAddress.toLowerCase() == wallet.toLowerCase()
                                    ?
                                        <Stack flexDirection="row" alignItems="center" gap={.5}>
                                            <DownloadIcon fontSize='small' />
                                            <Typography variant="subtitle2">Transfer In</Typography>
                                        </Stack>
                                    :      
                                        <Stack flexDirection="row" alignItems="center" gap={.5}>
                                            <UploadIcon fontSize='small' />
                                            <Typography variant="subtitle2">Transfer Out</Typography>
                                        </Stack>
                                    )
                                :   <></>
                                }
                            </Stack>
                            <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="subtitle2" sx={{ textTransform: 'uppercase' }}>Sent From</Typography>
                                <Tooltip title={element.node.fromAddress ? element.node.fromAddress : '-'}>
                                    <Typography variant="subtitle2">{element.node.fromAddress ? makeWalletAddress(element.node.fromAddress, 6, 3) : '-' }</Typography>
                                </Tooltip>
                            </Stack>
                            <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="subtitle2" sx={{ textTransform: 'uppercase' }}>Sent to</Typography>
                                <Tooltip title={element.node.toAddress ? element.node.toAddress : '-'}>
                                    <Typography variant="subtitle2">{element.node.toAddress ? makeWalletAddress(element.node.toAddress, 6, 3) : '-'}</Typography>
                                </Tooltip>
                            </Stack>
                            <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="subtitle2" sx={{ textTransform: 'uppercase' }}>Revenue</Typography>
                                <Typography variant="subtitle2">
                                {
                                element.node.type.toLowerCase() === 'order' && element.node.fromAddress.toLowerCase() === wallet.toLowerCase() 
                                ?   (Number(element.node.value)).toFixed(4)
                                :   '-'
                                }
                                </Typography>
                            </Stack>
                            <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="subtitle2" sx={{ textTransform: 'uppercase' }}>Cost</Typography>
                                <Typography variant="subtitle2">
                                {
                                element.node.type.toLowerCase() === 'mint'
                                ?   (Number(element.node.value) + Number(element.node.gastotal)).toFixed(4)
                                :   element.node.type.toLowerCase() === 'order' && element.node.toAddress.toLowerCase() === wallet.toLowerCase() 
                                ?   (Number(element.node.value) + Number(element.node.gastotal)).toFixed(4)
                                :   element.node.type.toLowerCase() == 'transfer' && element.node.fromAddress.toLowerCase() == wallet.toLowerCase()
                                ?   (Number(element.node.gastotal)).toFixed(4)
                                :   '-'
                                }
                                </Typography>                        </Stack>
                            <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="subtitle2" sx={{ textTransform: 'uppercase' }}>Gas</Typography>
                                <Typography variant="subtitle2">
                                    {
                                    (element.node.type.toLowerCase() == 'mint' ||
                                    (element.node.type.toLowerCase() == 'transfer' && element.node.fromAddress.toLowerCase() == wallet.toLowerCase()) ||
                                    (element.node.type.toLowerCase() == 'order' && element.node.toAddress.toLowerCase() == wallet.toLowerCase()))
                                    ?   Number(element.node.gastotal).toFixed(4)
                                    :   '-'
                                    }
                                </Typography>
                            </Stack>
                            <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="subtitle2" sx={{ textTransform: 'uppercase' }}>Other fees</Typography>
                                <Typography variant="subtitle2">-</Typography>
                            </Stack>
                        </Stack>
                    )
                :   <></>
                }
                </Stack>
            </Stack>
            <Stack 
                flexDirection={matchUpMd ? "row" : "column"} 
                justifyContent={matchUpMd ? "space-between" : "flex-start"} 
                alignItems={matchUpMd ? "center" : "flex-start"}
                gap={matchUpMd ? 0 : 1}
                sx={{
                    py: 2
                }}
            >
                <Stack flexDirection="row" alignItems="center" gap={1}>

                    <Typography variant="subtitle2" sx={{ color: '#9DA7B5', fontWeight: 400 }}>Rows per page</Typography>

                    <Box component="select"
                        sx={{
                            color: '#18181B',
                            borderColor: '#D7DCE3',
                            fontSize: 13,
                            borderRadius: 1,
                            p: .5
                        }}
                        onChange={onChangePerPage}
                        value={perPage}
                    >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </Box>
                </Stack>
                <Pagination 
                    count={Math.ceil(realNfts.length / perPage)} 
                    onChange={onChangePageCount} 
                    page={currentPage}
                    variant="outlined" 
                    shape="rounded" 
                />
            </Stack>
        </Box>
    );
}