import * as React from 'react';
import { 
    Box, 
    Stack,
    Skeleton, 
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Tooltip,
    Pagination,
    useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';

import { getPinataUrl } from '../../utils/Apis/common';
import { makeWalletAddress, convertDate, getRoi } from '../../utils';

import InfoIcon from '@mui/icons-material/Info';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';

const temp = [1,2,3,4,5,6,7,8,9,10];

export default function Gains ({nfts, loading, data}) {
    const theme = useTheme();
    const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));    
    const { wallets, wallet } = useSelector((state) => state.userReducer);

    const [realNfts, setRealNfts] = React.useState([]);

    const { perPage, currentPage } = useSelector(state => state.userReducer);

    const dispatch = useDispatch();

    const getCostRevenue = (contractAddress, tokenId, transactionHash) => {
        for (let i in data) {
            const nft = data[i].node;

            if (nft.transactionHash == transactionHash) continue;
            if (nft.contractAddress == contractAddress && nft.token.tokenId == tokenId) {
                return nft
            } 
        }
        return null;
    }

    const onChangePerPage = (element) => {
        dispatch({type: 'SET_PER_PAGE', payload: parseInt(element.target.value)});
        dispatch({type: 'SET_CURRENT_PAGE', payload: 1 });
    }

    const onChangePageCount = (element, page) => {
        dispatch({type: 'SET_CURRENT_PAGE', payload: page});
    }
    
    React.useEffect(() => {
        if (nfts.length) {
            const result = nfts.filter((element) => {
                if (element.node.type.toLowerCase() == 'order' && 
                    element.node.fromAddress.toLowerCase() == wallet.toLowerCase()) {
                    return true;
                } else return false;
            })

            for ( let i in result) {
                const nft = result[i]
                const parentNft = getCostRevenue(nft.node.contractAddress, 
                                        nft.node.token.tokenId,
                                        nft.node.transactionHash)
                if (parentNft === null) {
                    result[i].node.timeHeld = 0;
                    result[i].node.costBasis = 0;
                    result[i].node.revenue = 0;
                    result[i].node.gains = 0;
                    result[i].node.roi = '-';
                } else {
                    result[i].node.timeHeld = ((new Date(nft.node.estimatedConfirmedAt).getTime() 
                                        - new Date(parentNft.estimatedConfirmedAt).getTime()) / (1440 * 60000)).toFixed(1)
                                        
                    result[i].node.costBasis = Number(parentNft.value) + Number(parentNft.gastotal);
                    result[i].node.revenue = Number(nft.node.value);
                    result[i].node.gains = Number(nft.node.value) - (Number(parentNft.value) + Number(parentNft.gastotal));
                    result[i].node.roi = ((result[i].node.gains/result[i].node.costBasis) * 100).toFixed(2) ;
                }
            }
            setRealNfts(result)
        }
        dispatch({type: 'SET_ACTION_TYPE', payload: 'all'});
    }, [nfts.length, loading])
    return (
        <Box>
            <Stack sx={{ py: matchUpMd ? 4 : 1, borderBottom: '1px solid #D7DCE3' }}>
                <TableContainer 
                    component={Paper} 
                    sx={{ 
                        border: 0, 
                        boxShadow: 'none',
                        display: matchUpMd ? 'block' : 'none'
                    }}
                >
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow 
                                sx={{ 
                                    '& td, th': { 
                                        px: 0,
                                        fontFamily: 'PlusJakartaSansMedium', 
                                        border: 0, 
                                        // fontSize: 15, 
                                        color: '#9DA7B5' 
                                    } 
                                }}
                            >
                                <TableCell><Typography variant="subtitle2">DATE</Typography></TableCell>
                                <TableCell><Typography variant="subtitle2">COLLECTION</Typography></TableCell>
                                <TableCell><Typography variant="subtitle2">ITEM</Typography></TableCell>
                                <TableCell><Typography variant="subtitle2">ACTIVITY</Typography></TableCell>
                                <TableCell><Typography variant="subtitle2">TIME HELD</Typography></TableCell>
                                <TableCell><Typography variant="subtitle2">COST BASIS</Typography></TableCell>
                                <TableCell><Typography variant="subtitle2">REVENUE</Typography></TableCell>
                                <TableCell><Typography variant="subtitle2">REALIZED GAINS</Typography></TableCell>
                                <TableCell><Typography variant="subtitle2">ROI</Typography></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {!loading
                        ?
                        (realNfts.length 
                        ?   
                            realNfts.slice((currentPage - 1) * perPage, currentPage * perPage).map((element, key) => (
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
                                        <Typography variant="subtitle2">{element.node.token.name ? element.node.token.name : (element.node.contract.name + '#' + element.node.token.tokenId)}</Typography>
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
                                    <Stack flexDirection="row" alignItems="center" gap={.5}>
                                        <Typography variant="subtitle2">{element.node.timeHeld}</Typography>
                                        <Tooltip title="">
                                            <InfoIcon fontSize='small' sx={{ color: '#D7DCE3' }} />
                                        </Tooltip>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Stack flexDirection="row" alignItems="center" gap={.5}>
                                        <Typography variant="subtitle2">{element.node.costBasis.toFixed(4)}</Typography> 
                                        <Tooltip title="">  
                                            <InfoIcon fontSize='small' sx={{ color: '#D7DCE3' }} />
                                        </Tooltip>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Stack flexDirection="row" alignItems="center" gap={.5}>
                                        <Typography variant="subtitle2">{element.node.revenue.toFixed(4)}</Typography>
                                        <Tooltip title="">  
                                            <InfoIcon fontSize='small' sx={{ color: '#D7DCE3' }} />
                                        </Tooltip>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2">{element.node.gains.toFixed(4)}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2">{element.node.roi}%</Typography>
                                </TableCell>
                            </TableRow>
                            ))
                        :
                            <></>
                        )
                        :   
                            temp.map((element, key) => 
                            <TableRow
                                key={key}
                                sx={{ '& td, th': { border: 0, pl: 0 } }}
                            >
                                <TableCell><Skeleton variant="rectangular" height={20} sx={{ borderRadius: 1  }} /></TableCell>
                                <TableCell><Skeleton variant="rectangular" height={20} sx={{ borderRadius: 1  }} /></TableCell>
                                <TableCell><Skeleton variant="rectangular" height={20} sx={{ borderRadius: 1  }} /></TableCell>
                                <TableCell><Skeleton variant="rectangular" height={20} sx={{ borderRadius: 1  }} /></TableCell>
                                <TableCell><Skeleton variant="rectangular" height={20} sx={{ borderRadius: 1  }} /></TableCell>
                                <TableCell><Skeleton variant="rectangular" height={20} sx={{ borderRadius: 1  }} /></TableCell>
                                <TableCell><Skeleton variant="rectangular" height={20} sx={{ borderRadius: 1  }} /></TableCell>
                                <TableCell><Skeleton variant="rectangular" height={20} sx={{ borderRadius: 1  }} /></TableCell>
                                <TableCell><Skeleton variant="rectangular" height={20} sx={{ borderRadius: 1  }} /></TableCell>
                            </TableRow>)
                        }
                        </TableBody>
                    </Table>
                </TableContainer>
                <Stack
                    sx={{
                        display: matchUpMd ? 'none' : 'flex',

                    }}
                >
                {
                realNfts.length 
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
                            <Typography variant="subtitle2">{convertDate(element.node.estimatedConfirmedAt)}</Typography>                        </Stack>
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
                                <Typography variant="subtitle2">{element.node.token.name ? element.node.token.name : (element.node.contract.name + '#' +  element.node.token.tokenId)}</Typography>
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
                            <Typography variant="subtitle2" sx={{ textTransform: 'uppercase' }}>Time Held</Typography>
                            <Stack flexDirection="row" alignItems="center" gap={.5}>
                                <Typography variant="subtitle2">-</Typography>
                                <Tooltip title="">
                                    <InfoIcon fontSize='small' sx={{ color: '#D7DCE3' }} />
                                </Tooltip>
                            </Stack>
                        </Stack>
                        <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="subtitle2" sx={{ textTransform: 'uppercase' }}>Cost Basis</Typography>
                            <Stack flexDirection="row" alignItems="center" gap={.5}>
                                <Typography variant="subtitle2"></Typography>
                                <Tooltip title="">
                                    <InfoIcon fontSize='small' sx={{ color: '#D7DCE3' }} />
                                </Tooltip>
                            </Stack>
                        </Stack>
                        <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="subtitle2" sx={{ textTransform: 'uppercase' }}>Revenue</Typography>
                            <Typography variant="subtitle2"></Typography>
                        </Stack>
                        <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="subtitle2" sx={{ textTransform: 'uppercase' }}>Realized Gains</Typography>
                            <Typography variant="subtitle2"></Typography>
                        </Stack>
                        <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="subtitle2" sx={{ textTransform: 'uppercase' }}>Roi</Typography>
                            <Typography variant="subtitle2"></Typography>
                        </Stack>
                    </Stack>
                    )
                :
                    <></>
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
                    count={Math.ceil(nfts.length / perPage)} 
                    onChange={onChangePageCount} 
                    page={currentPage}
                    variant="outlined" 
                    shape="rounded" 
                />
            </Stack>
        </Box>
    );
}